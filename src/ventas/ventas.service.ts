import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { VentaFiltersDto, PaginationDto } from './dto/pagination.dto';
import { Venta } from './entities/venta.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
  ) {}

  // Método helper para manejar errores de forma segura
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Error desconocido';
  }

  // Crear un nuevo registro
  async create(createVentaDto: CreateVentaDto) {
    try {
      const newVenta = this.ventasRepository.create(createVentaDto);
      const savedVenta = await this.ventasRepository.save(newVenta);
      return savedVenta;
    } catch (error: unknown) {
      throw new HttpException(
        `Error al crear el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Obtener todos los registros (método original sin paginación - para compatibilidad)
  async findAll() {
    try {
      const records = await this.ventasRepository.find();
      return records;
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener los registros: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener un registro por ID
  async findOne(id: number) {
    try {
      const record = await this.ventasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Venta con ID ${id} no encontrado`);
      }
      return record;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error; // Re-lanzar NotFoundException sin modificar
      }
      throw new HttpException(
        `Error al obtener el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar un registro
  async update(id: number, updateVentasDto: UpdateVentaDto) {
    try {
      const existingRecord = await this.ventasRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Venta con ID ${id} no encontrado`);
      }

      await this.ventasRepository.update(id, updateVentasDto);
      return await this.ventasRepository.findOne({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error; // Re-lanzar NotFoundException sin modificar
      }
      throw new HttpException(
        `Error al actualizar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Eliminar un registro
  async remove(id: number) {
    try {
      const existingRecord = await this.ventasRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Venta con ID ${id} no encontrado`);
      }

      await this.ventasRepository.delete(id);
      return {
        message: `Ventas con ID ${id} eliminado correctamente`,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error; // Re-lanzar NotFoundException sin modificar
      }
      throw new HttpException(
        `Error al eliminar el registro: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //? Métodos findBy para Foreign Keys:
    // Obtener registros por id_cliente (método original - para compatibilidad)
  async findByIdCliente(idCliente: number) {
    try {
      const records = await this.ventasRepository.find({ 
        where: { id_cliente: idCliente },
        //order: { created_at: 'DESC' }
      });
      
      if (!records || records.length === 0) {
        return [];
      }
      
      return records;
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener los registros por id_cliente: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  //? Filtrado paginado:

  // Obtener todos los registros con paginación y filtros
  async findAllPaginated(
    filters: VentaFiltersDto
  ): Promise<PaginationResponse<Venta>> {
    try {
      const { page = 1, limit = 10, sort, ...filterParams } = filters;

      // Crear query builder
      const queryBuilder = this.ventasRepository.createQueryBuilder('venta');

      // Aplicar filtros
      this.applyFilters(queryBuilder, filterParams);

      // Aplicar ordenamiento
      this.applySorting(queryBuilder, sort);

      // Calcular offset
      const offset = (page - 1) * limit;

      // Ejecutar query con paginación
      const [data, total] = await queryBuilder
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      // Calcular metadatos de paginación
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext,
          hasPrev,
        },
      };
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener los registros: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    // Obtener registros por id_cliente con paginación
  async findIdClientePaginated(
    idCliente: number,
    pagination: PaginationDto
  ): Promise<PaginationResponse<Venta>> {
    try {
      const { page = 1, limit = 10, sort } = pagination;

      const queryBuilder = this.ventasRepository
        .createQueryBuilder('venta')
        .where('venta.id_cliente = :idCliente', { idCliente });

      // Aplicar ordenamiento
      this.applySorting(queryBuilder, sort);

      const offset = (page - 1) * limit;

      const [data, total] = await queryBuilder
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext,
          hasPrev,
        },
      };
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener los registros por id_cliente: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  // Método helper para aplicar filtros
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Venta>,
    filters: Partial<VentaFiltersDto>
  ) {
    
    // Filtro por ID específico
    if (filters.id) {
      queryBuilder.andWhere('venta.id = :id', {
        id: filters.id,
      });
    }

    // Filtro por id_cliente
    if (filters.id_cliente) {
      queryBuilder.andWhere('venta.id_cliente = :id_cliente', {
        id_cliente: filters.id_cliente,
      });
    }

    // Filtro por fecha_venta
    if (filters.fecha_venta) {
      queryBuilder.andWhere('venta.fecha_venta = :fecha_venta', {
        fecha_venta: filters.fecha_venta,
      });
    }

    // Filtro por monto
    if (filters.monto) {
      queryBuilder.andWhere('venta.monto = :monto', {
        monto: filters.monto,
      });
    }

    // Filtro por producto (búsqueda parcial)
    if (filters.producto) {
      queryBuilder.andWhere('venta.producto ILIKE :producto', {
        producto: `%${filters.producto}%`,
      });
    }

    // Filtro por agregado_por (búsqueda parcial)
    if (filters.agregado_por) {
      queryBuilder.andWhere('venta.agregado_por ILIKE :agregado_por', {
        agregado_por: `%${filters.agregado_por}%`,
      });
    }

    // Filtro por agregado_en
    if (filters.agregado_en) {
      queryBuilder.andWhere('venta.agregado_en = :agregado_en', {
        agregado_en: filters.agregado_en,
      });
    }

    // Filtro por actualizado_por (búsqueda parcial)
    if (filters.actualizado_por) {
      queryBuilder.andWhere('venta.actualizado_por ILIKE :actualizado_por', {
        actualizado_por: `%${filters.actualizado_por}%`,
      });
    }

    // Filtro por actualizado_en
    if (filters.actualizado_en) {
      queryBuilder.andWhere('venta.actualizado_en = :actualizado_en', {
        actualizado_en: filters.actualizado_en,
      });
    }

    // Filtro por estado (búsqueda parcial)
    if (filters.estado) {
      queryBuilder.andWhere('venta.estado ILIKE :estado', {
        estado: `%${filters.estado}%`,
      });
    }

  }

  // Método helper para aplicar ordenamiento
  private applySorting(queryBuilder: SelectQueryBuilder<Venta>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = [
                'id',
        'id_cliente',
        'fecha_venta',
        'monto',
        'producto',
        'agregado_por',
        'agregado_en',
        'actualizado_por',
        'actualizado_en',
        'estado'
      ];

      if (
        validFields.includes(field) &&
        ['ASC', 'DESC'].includes(direction?.toUpperCase())
      ) {
        queryBuilder.orderBy(
          `venta.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC'
        );
      } else {
        // Ordenamiento por defecto
        queryBuilder.orderBy('venta.agregado_en', 'DESC');
      }
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('venta.agregado_en', 'DESC');
    }
  }
}
