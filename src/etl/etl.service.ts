import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as XLSX from 'xlsx';
import { parse } from 'papaparse';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  VentaClienteRowDto,
  ETLResultDto,
  ETLOptionsDto,
  TipoDocumento ,
} from './dto/create-etl.dto';

// Importa las entidades reales
import { Cliente } from '../clientes/entities/cliente.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { TipoDocumento as TipoDocumentoEntity } from '../tipo_documentos/entities/tipo_documento.entity';

@Injectable()
export class EtlService {
  private readonly logger = new Logger(EtlService.name);
  private tipoDocumentoCache: Map<string, number> = new Map();

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(TipoDocumentoEntity)
    private tipoDocumentoRepository: Repository<TipoDocumentoEntity>,
    private dataSource: DataSource,
  ) {
    this.initializeTipoDocumentoCache();
  }

  private async initializeTipoDocumentoCache() {
    const tipos = await this.tipoDocumentoRepository.find({
      where: { estado: 'activo' },
    });
    tipos.forEach((tipo) => {
      this.tipoDocumentoCache.set(tipo.nombre_documento, tipo.id);
    });
  }

  async procesarArchivoVentas(
    file: Express.Multer.File,
    options: ETLOptionsDto,
  ): Promise<ETLResultDto> {
    const startTime = Date.now();
    const resultado: ETLResultDto = {
      total_registros: 0,
      exitosos: 0,
      fallidos: 0,
      clientes_creados: 0,
      clientes_actualizados: 0,
      ventas_creadas: 0,
      errores: [],
      tiempo_procesamiento_ms: 0,
    };

    try {
      // Parsear archivo según el tipo
      const datos = await this.parsearArchivo(file);
      resultado.total_registros = datos.length;

      // Procesar cada registro en una transacción
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      for (let i = 0; i < datos.length; i++) {
        const fila = i + 2; // +2 porque la fila 1 es el header
        try {
          await queryRunner.startTransaction();

          // Validar y transformar el registro
          const dto = plainToClass(VentaClienteRowDto, datos[i]);
          const errores = await validate(dto);

          if (errores.length > 0) {
            const mensajesError = errores
              .map((e) => Object.values(e.constraints || {}).join(', '))
              .join('; ');
            throw new Error(mensajesError);
          }

          // Procesar cliente y venta
          const { clienteCreado, clienteActualizado } =
            await this.procesarCliente(dto, options, queryRunner);

          await this.procesarVenta(dto, options, queryRunner);

          await queryRunner.commitTransaction();

          resultado.exitosos++;
          if (clienteCreado) resultado.clientes_creados++;
          if (clienteActualizado) resultado.clientes_actualizados++;
          resultado.ventas_creadas++;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          resultado.fallidos++;
          resultado.errores.push({
            fila,
            id_transaccion: datos[i].id_transaccion,
            error: error.message,
          });
          this.logger.warn(`Error en fila ${fila}: ${error.message}`);
        }
      }

      await queryRunner.release();
      resultado.tiempo_procesamiento_ms = Date.now() - startTime;

      this.logger.log(
        `ETL completado: ${resultado.exitosos}/${resultado.total_registros} exitosos`,
      );

      return resultado;
    } catch (error) {
      this.logger.error('Error en proceso ETL', error.stack);
      throw new InternalServerErrorException(
        'Error procesando el archivo: ' + error.message,
      );
    }
  }

  private async parsearArchivo(file: Express.Multer.File): Promise<any[]> {
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      return this.parsearCSV(file.buffer);
    } else if (['xlsx', 'xls'].includes(extension || '')) {
      return this.parsearExcel(file.buffer);
    } else {
      throw new BadRequestException(
        'Formato de archivo no soportado. Use CSV o Excel',
      );
    }
  }

  private parsearCSV(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const texto = buffer.toString('utf-8');
      parse(texto, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(
              new BadRequestException(
                'Error parseando CSV: ' + results.errors[0].message,
              ),
            );
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(new BadRequestException('Error parseando CSV: ' + error));
        },
      });
    });
  }

  private parsearExcel(buffer: Buffer): any[] {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: '',
      });

      // Normalizar las claves a minúsculas
      return data.map((row: any) => {
        const normalizedRow: any = {};
        Object.keys(row).forEach((key) => {
          normalizedRow[key.trim().toLowerCase()] = row[key];
        });
        return normalizedRow;
      });
    } catch (error) {
      throw new BadRequestException('Error parseando Excel: ' + error.message);
    }
  }

  private async procesarCliente(
    dto: VentaClienteRowDto,
    options: ETLOptionsDto,
    queryRunner: any,
  ): Promise<{ clienteCreado: boolean; clienteActualizado: boolean }> {
    // Obtener o crear tipo de documento
    let tipoDocId = this.tipoDocumentoCache.get(dto.tipo_documento);

    if (!tipoDocId) {
      const tipoDoc = await queryRunner.manager.findOne(TipoDocumentoEntity, {
        where: { nombre_documento: dto.tipo_documento },
      });

      if (!tipoDoc) {
        const nuevoTipo = queryRunner.manager.create(TipoDocumentoEntity, {
          nombre_documento: dto.tipo_documento,
          descripcion: `Tipo de documento ${dto.tipo_documento}`,
          agregado_por: options.agregado_por || 'ETL_SYSTEM',
          agregado_en: new Date(),
          estado: 'activo',
        });
        const savedTipo = await queryRunner.manager.save(nuevoTipo);
        tipoDocId = savedTipo.id;
        this.tipoDocumentoCache.set(dto.tipo_documento, tipoDocId);
      } else {
        tipoDocId = tipoDoc.id;
        this.tipoDocumentoCache.set(dto.tipo_documento, tipoDocId);
      }
    }

    // Buscar cliente existente
    const clienteExistente = await queryRunner.manager.findOne(Cliente, {
      where: { documento: dto.documento },
    });

    let clienteCreado = false;
    let clienteActualizado = false;

    if (clienteExistente) {
      if (options.update_existing) {
        // Actualizar cliente existente
        clienteExistente.nombre = dto.nombre;
        clienteExistente.apellido = dto.apellido || '';
        clienteExistente.id_tipo_documento = tipoDocId;
        clienteExistente.actualizado_por = options.agregado_por || 'ETL_SYSTEM';
        clienteExistente.actualizado_en = new Date();

        await queryRunner.manager.save(Cliente, clienteExistente);
        clienteActualizado = true;
      }
    } else {
      // Crear nuevo cliente
      const nuevoCliente = queryRunner.manager.create(Cliente, {
        nombre: dto.nombre,
        apellido: dto.apellido || '',
        id_tipo_documento: tipoDocId,
        documento: dto.documento,
        agregado_por: options.agregado_por || 'ETL_SYSTEM',
        agregado_en: new Date(),
        estado: 'activo',
      });

      await queryRunner.manager.save(Cliente, nuevoCliente);
      clienteCreado = true;
    }

    return { clienteCreado, clienteActualizado };
  }

  private async procesarVenta(
    dto: VentaClienteRowDto,
    options: ETLOptionsDto,
    queryRunner: any,
  ): Promise<void> {
    // Obtener el cliente
    const cliente = await queryRunner.manager.findOne(Cliente, {
      where: { documento: dto.documento },
    });

    if (!cliente) {
      throw new Error('Cliente no encontrado después de procesamiento');
    }

    // Verificar duplicados si está habilitado
    if (options.skip_duplicates) {
      const ventaExistente = await queryRunner.manager.findOne(Venta, {
        where: {
          id_cliente: cliente.id,
          fecha_venta: new Date(dto.fecha_venta),
          monto: dto.monto,
          producto: dto.producto,
        },
      });

      if (ventaExistente) {
        this.logger.debug(`Venta duplicada omitida: ${dto.id_transaccion}`);
        return;
      }
    }

    // Crear la venta
    const nuevaVenta = queryRunner.manager.create(Venta, {
      id_cliente: cliente.id,
      fecha_venta: new Date(dto.fecha_venta),
      monto: dto.monto,
      producto: dto.producto,
      agregado_por: options.agregado_por || 'ETL_SYSTEM',
      agregado_en: new Date(),
      estado: 'activo',
    });

    await queryRunner.manager.save(Venta, nuevaVenta);
  }

  async obtenerEstadisticasETL(): Promise<any> {
    const ventasHoy = await this.ventaRepository
      .createQueryBuilder('v')
      .where('DATE(v.agregado_en) = CURRENT_DATE')
      .getCount();

    const clientesHoy = await this.clienteRepository
      .createQueryBuilder('c')
      .where('DATE(c.agregado_en) = CURRENT_DATE')
      .getCount();

    return {
      ventas_hoy: ventasHoy,
      clientes_hoy: clientesHoy,
      ultima_actualizacion: new Date(),
    };
  }
}
