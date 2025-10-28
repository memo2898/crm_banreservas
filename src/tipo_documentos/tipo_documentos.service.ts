import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto';
import { TipoDocumentoFiltersDto, PaginationDto } from './dto/pagination.dto';
import { TipoDocumento } from './entities/tipo_documento.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class TipoDocumentosService {
  constructor(
    @InjectRepository(TipoDocumento)
    private tipoDocumentosRepository: Repository<TipoDocumento>,
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
  async create(createTipoDocumentoDto: CreateTipoDocumentoDto) {
    try {
      const newTipoDocumento = this.tipoDocumentosRepository.create(createTipoDocumentoDto);
      const savedTipoDocumento = await this.tipoDocumentosRepository.save(newTipoDocumento);
      return savedTipoDocumento;
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
      const records = await this.tipoDocumentosRepository.find();
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
      const record = await this.tipoDocumentosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`TipoDocumento con ID ${id} no encontrado`);
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
  async update(id: number, updateTipoDocumentosDto: UpdateTipoDocumentoDto) {
    try {
      const existingRecord = await this.tipoDocumentosRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`TipoDocumento con ID ${id} no encontrado`);
      }

      await this.tipoDocumentosRepository.update(id, updateTipoDocumentosDto);
      return await this.tipoDocumentosRepository.findOne({ where: { id } });
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
      const existingRecord = await this.tipoDocumentosRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`TipoDocumento con ID ${id} no encontrado`);
      }

      await this.tipoDocumentosRepository.delete(id);
      return {
        message: `TipoDocumentos con ID ${id} eliminado correctamente`,
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
    filters: TipoDocumentoFiltersDto
  ): Promise<PaginationResponse<TipoDocumento>> {
    try {
      const { page = 1, limit = 10, sort, ...filterParams } = filters;

      // Crear query builder
      const queryBuilder = this.tipoDocumentosRepository.createQueryBuilder('tipoDocumento');

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
    queryBuilder: SelectQueryBuilder<TipoDocumento>,
    filters: Partial<TipoDocumentoFiltersDto>
  ) {
    
    // Filtro por ID específico
    if (filters.id) {
      queryBuilder.andWhere('tipoDocumento.id = :id', {
        id: filters.id,
      });
    }

    // Filtro por nombre_documento (búsqueda parcial)
    if (filters.nombre_documento) {
      queryBuilder.andWhere('tipoDocumento.nombre_documento ILIKE :nombre_documento', {
        nombre_documento: `%${filters.nombre_documento}%`,
      });
    }

    // Filtro por descripcion (búsqueda parcial)
    if (filters.descripcion) {
      queryBuilder.andWhere('tipoDocumento.descripcion ILIKE :descripcion', {
        descripcion: `%${filters.descripcion}%`,
      });
    }

    // Filtro por agregado_por (búsqueda parcial)
    if (filters.agregado_por) {
      queryBuilder.andWhere('tipoDocumento.agregado_por ILIKE :agregado_por', {
        agregado_por: `%${filters.agregado_por}%`,
      });
    }

    // Filtro por agregado_en
    if (filters.agregado_en) {
      queryBuilder.andWhere('tipoDocumento.agregado_en = :agregado_en', {
        agregado_en: filters.agregado_en,
      });
    }

    // Filtro por actualizado_por (búsqueda parcial)
    if (filters.actualizado_por) {
      queryBuilder.andWhere('tipoDocumento.actualizado_por ILIKE :actualizado_por', {
        actualizado_por: `%${filters.actualizado_por}%`,
      });
    }

    // Filtro por actualizado_en
    if (filters.actualizado_en) {
      queryBuilder.andWhere('tipoDocumento.actualizado_en = :actualizado_en', {
        actualizado_en: filters.actualizado_en,
      });
    }

    // Filtro por estado (búsqueda parcial)
    if (filters.estado) {
      queryBuilder.andWhere('tipoDocumento.estado ILIKE :estado', {
        estado: `%${filters.estado}%`,
      });
    }

  }

  // Método helper para aplicar ordenamiento
  private applySorting(queryBuilder: SelectQueryBuilder<TipoDocumento>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = [
                'id',
        'nombre_documento',
        'descripcion',
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
          `tipoDocumento.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC'
        );
      } else {
        // Ordenamiento por defecto
        queryBuilder.orderBy('tipoDocumento.agregado_en', 'DESC');
      }
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('tipoDocumento.agregado_en', 'DESC');
    }
  }
}
