import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEjecutivoDto } from './dto/create-ejecutivo.dto';
import { UpdateEjecutivoDto } from './dto/update-ejecutivo.dto';
import { EjecutivoFiltersDto, PaginationDto } from './dto/pagination.dto';
import { Ejecutivo } from './entities/ejecutivo.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class EjecutivosService {
  constructor(
    @InjectRepository(Ejecutivo)
    private ejecutivosRepository: Repository<Ejecutivo>,
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
  async create(createEjecutivoDto: CreateEjecutivoDto) {
    try {
      const newEjecutivo = this.ejecutivosRepository.create(createEjecutivoDto);
      const savedEjecutivo = await this.ejecutivosRepository.save(newEjecutivo);
      return savedEjecutivo;
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
      const records = await this.ejecutivosRepository.find();
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
      const record = await this.ejecutivosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Ejecutivo con ID ${id} no encontrado`);
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
  async update(id: number, updateEjecutivosDto: UpdateEjecutivoDto) {
    try {
      const existingRecord = await this.ejecutivosRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Ejecutivo con ID ${id} no encontrado`);
      }

      await this.ejecutivosRepository.update(id, updateEjecutivosDto);
      return await this.ejecutivosRepository.findOne({ where: { id } });
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
      const existingRecord = await this.ejecutivosRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Ejecutivo con ID ${id} no encontrado`);
      }

      await this.ejecutivosRepository.delete(id);
      return {
        message: `Ejecutivos con ID ${id} eliminado correctamente`,
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
  

  //? Filtrado paginado:

  // Obtener todos los registros con paginación y filtros
  async findAllPaginated(
    filters: EjecutivoFiltersDto
  ): Promise<PaginationResponse<Ejecutivo>> {
    try {
      const { page = 1, limit = 10, sort, ...filterParams } = filters;

      // Crear query builder
      const queryBuilder = this.ejecutivosRepository.createQueryBuilder('ejecutivo');

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

  

  // Método helper para aplicar filtros
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Ejecutivo>,
    filters: Partial<EjecutivoFiltersDto>
  ) {
    
    // Filtro por ID específico
    if (filters.id) {
      queryBuilder.andWhere('ejecutivo.id = :id', {
        id: filters.id,
      });
    }

    // Filtro por nombre (búsqueda parcial)
    if (filters.nombre) {
      queryBuilder.andWhere('ejecutivo.nombre ILIKE :nombre', {
        nombre: `%${filters.nombre}%`,
      });
    }

    // Filtro por apellido (búsqueda parcial)
    if (filters.apellido) {
      queryBuilder.andWhere('ejecutivo.apellido ILIKE :apellido', {
        apellido: `%${filters.apellido}%`,
      });
    }

    // Filtro por agregado_por (búsqueda parcial)
    if (filters.agregado_por) {
      queryBuilder.andWhere('ejecutivo.agregado_por ILIKE :agregado_por', {
        agregado_por: `%${filters.agregado_por}%`,
      });
    }

    // Filtro por agregado_en
    if (filters.agregado_en) {
      queryBuilder.andWhere('ejecutivo.agregado_en = :agregado_en', {
        agregado_en: filters.agregado_en,
      });
    }

    // Filtro por actualizado_por (búsqueda parcial)
    if (filters.actualizado_por) {
      queryBuilder.andWhere('ejecutivo.actualizado_por ILIKE :actualizado_por', {
        actualizado_por: `%${filters.actualizado_por}%`,
      });
    }

    // Filtro por actualizado_en
    if (filters.actualizado_en) {
      queryBuilder.andWhere('ejecutivo.actualizado_en = :actualizado_en', {
        actualizado_en: filters.actualizado_en,
      });
    }

    // Filtro por estado (búsqueda parcial)
    if (filters.estado) {
      queryBuilder.andWhere('ejecutivo.estado ILIKE :estado', {
        estado: `%${filters.estado}%`,
      });
    }

  }

  // Método helper para aplicar ordenamiento
  private applySorting(queryBuilder: SelectQueryBuilder<Ejecutivo>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = [
                'id',
        'nombre',
        'apellido',
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
          `ejecutivo.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC'
        );
      } else {
        // Ordenamiento por defecto
        queryBuilder.orderBy('ejecutivo.agregado_en', 'DESC');
      }
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('ejecutivo.agregado_en', 'DESC');
    }
  }
}
