import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { VisitaFiltersDto, PaginationDto } from './dto/pagination.dto';
import { Visita } from './entities/visita.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private visitasRepository: Repository<Visita>,
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
  async create(createVisitaDto: CreateVisitaDto) {
    try {
      const newVisita = this.visitasRepository.create(createVisitaDto);
      const savedVisita = await this.visitasRepository.save(newVisita);
      return savedVisita;
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
      const records = await this.visitasRepository.find();
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
      const record = await this.visitasRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Visita con ID ${id} no encontrado`);
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
  async update(id: number, updateVisitasDto: UpdateVisitaDto) {
    try {
      const existingRecord = await this.visitasRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Visita con ID ${id} no encontrado`);
      }

      await this.visitasRepository.update(id, updateVisitasDto);
      return await this.visitasRepository.findOne({ where: { id } });
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
      const existingRecord = await this.visitasRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Visita con ID ${id} no encontrado`);
      }

      await this.visitasRepository.delete(id);
      return {
        message: `Visitas con ID ${id} eliminado correctamente`,
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
      const records = await this.visitasRepository.find({ 
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

  // Obtener registros por id_ejecutivo (método original - para compatibilidad)
  async findByIdEjecutivo(idEjecutivo: number) {
    try {
      const records = await this.visitasRepository.find({ 
        where: { id_ejecutivo: idEjecutivo },
        //order: { created_at: 'DESC' }
      });
      
      if (!records || records.length === 0) {
        return [];
      }
      
      return records;
    } catch (error: unknown) {
      throw new HttpException(
        `Error al obtener los registros por id_ejecutivo: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  //? Filtrado paginado:

  // Obtener todos los registros con paginación y filtros
  async findAllPaginated(
    filters: VisitaFiltersDto
  ): Promise<PaginationResponse<Visita>> {
    try {
      const { page = 1, limit = 10, sort, ...filterParams } = filters;

      // Crear query builder
      const queryBuilder = this.visitasRepository.createQueryBuilder('visita');

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
  ): Promise<PaginationResponse<Visita>> {
    try {
      const { page = 1, limit = 10, sort } = pagination;

      const queryBuilder = this.visitasRepository
        .createQueryBuilder('visita')
        .where('visita.id_cliente = :idCliente', { idCliente });

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

  // Obtener registros por id_ejecutivo con paginación
  async findIdEjecutivoPaginated(
    idEjecutivo: number,
    pagination: PaginationDto
  ): Promise<PaginationResponse<Visita>> {
    try {
      const { page = 1, limit = 10, sort } = pagination;

      const queryBuilder = this.visitasRepository
        .createQueryBuilder('visita')
        .where('visita.id_ejecutivo = :idEjecutivo', { idEjecutivo });

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
        `Error al obtener los registros por id_ejecutivo: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  // Método helper para aplicar filtros
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Visita>,
    filters: Partial<VisitaFiltersDto>
  ) {
    
    // Filtro por ID específico
    if (filters.id) {
      queryBuilder.andWhere('visita.id = :id', {
        id: filters.id,
      });
    }

    // Filtro por id_cliente
    if (filters.id_cliente) {
      queryBuilder.andWhere('visita.id_cliente = :id_cliente', {
        id_cliente: filters.id_cliente,
      });
    }

    // Filtro por id_ejecutivo
    if (filters.id_ejecutivo) {
      queryBuilder.andWhere('visita.id_ejecutivo = :id_ejecutivo', {
        id_ejecutivo: filters.id_ejecutivo,
      });
    }

    // Filtro por fecha_visita
    if (filters.fecha_visita) {
      queryBuilder.andWhere('visita.fecha_visita = :fecha_visita', {
        fecha_visita: filters.fecha_visita,
      });
    }

    // Filtro por resultado (búsqueda parcial)
    if (filters.resultado) {
      queryBuilder.andWhere('visita.resultado ILIKE :resultado', {
        resultado: `%${filters.resultado}%`,
      });
    }

    // Filtro por agregado_por (búsqueda parcial)
    if (filters.agregado_por) {
      queryBuilder.andWhere('visita.agregado_por ILIKE :agregado_por', {
        agregado_por: `%${filters.agregado_por}%`,
      });
    }

    // Filtro por agregado_en
    if (filters.agregado_en) {
      queryBuilder.andWhere('visita.agregado_en = :agregado_en', {
        agregado_en: filters.agregado_en,
      });
    }

    // Filtro por actualizado_por (búsqueda parcial)
    if (filters.actualizado_por) {
      queryBuilder.andWhere('visita.actualizado_por ILIKE :actualizado_por', {
        actualizado_por: `%${filters.actualizado_por}%`,
      });
    }

    // Filtro por actualizado_en
    if (filters.actualizado_en) {
      queryBuilder.andWhere('visita.actualizado_en = :actualizado_en', {
        actualizado_en: filters.actualizado_en,
      });
    }

    // Filtro por estado (búsqueda parcial)
    if (filters.estado) {
      queryBuilder.andWhere('visita.estado ILIKE :estado', {
        estado: `%${filters.estado}%`,
      });
    }

  }

  // Método helper para aplicar ordenamiento
  private applySorting(queryBuilder: SelectQueryBuilder<Visita>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = [
                'id',
        'id_cliente',
        'id_ejecutivo',
        'fecha_visita',
        'resultado',
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
          `visita.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC'
        );
      } else {
        // Ordenamiento por defecto
        queryBuilder.orderBy('visita.agregado_en', 'DESC');
      }
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('visita.agregado_en', 'DESC');
    }
  }
}
