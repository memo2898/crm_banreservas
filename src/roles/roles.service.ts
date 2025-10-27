import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleFiltersDto, PaginationDto } from './dto/pagination.dto';
import { Role } from './entities/role.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
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
  async create(createRoleDto: CreateRoleDto) {
    try {
      const newRole = this.rolesRepository.create(createRoleDto);
      const savedRole = await this.rolesRepository.save(newRole);
      return savedRole;
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
      const records = await this.rolesRepository.find();
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
      const record = await this.rolesRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Role con ID ${id} no encontrado`);
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
  async update(id: number, updateRolesDto: UpdateRoleDto) {
    try {
      const existingRecord = await this.rolesRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Role con ID ${id} no encontrado`);
      }

      await this.rolesRepository.update(id, updateRolesDto);
      return await this.rolesRepository.findOne({ where: { id } });
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
      const existingRecord = await this.rolesRepository.findOne({ where: { id } });
      if (!existingRecord) {
        throw new NotFoundException(`Role con ID ${id} no encontrado`);
      }

      await this.rolesRepository.delete(id);
      return {
        message: `Roles con ID ${id} eliminado correctamente`,
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
    filters: RoleFiltersDto
  ): Promise<PaginationResponse<Role>> {
    try {
      const { page = 1, limit = 10, sort, ...filterParams } = filters;

      // Crear query builder
      const queryBuilder = this.rolesRepository.createQueryBuilder('role');

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
    queryBuilder: SelectQueryBuilder<Role>,
    filters: Partial<RoleFiltersDto>
  ) {
    
    // Filtro por ID específico
    if (filters.id) {
      queryBuilder.andWhere('role.id = :id', {
        id: filters.id,
      });
    }

    // Filtro por nombre_rol (búsqueda parcial)
    if (filters.nombre_rol) {
      queryBuilder.andWhere('role.nombre_rol ILIKE :nombre_rol', {
        nombre_rol: `%${filters.nombre_rol}%`,
      });
    }

    // Filtro por descripcion (búsqueda parcial)
    if (filters.descripcion) {
      queryBuilder.andWhere('role.descripcion ILIKE :descripcion', {
        descripcion: `%${filters.descripcion}%`,
      });
    }

    // Filtro por agregado_por (búsqueda parcial)
    if (filters.agregado_por) {
      queryBuilder.andWhere('role.agregado_por ILIKE :agregado_por', {
        agregado_por: `%${filters.agregado_por}%`,
      });
    }

    // Filtro por agregado_en
    if (filters.agregado_en) {
      queryBuilder.andWhere('role.agregado_en = :agregado_en', {
        agregado_en: filters.agregado_en,
      });
    }

    // Filtro por actualizado_por (búsqueda parcial)
    if (filters.actualizado_por) {
      queryBuilder.andWhere('role.actualizado_por ILIKE :actualizado_por', {
        actualizado_por: `%${filters.actualizado_por}%`,
      });
    }

    // Filtro por actualizado_en
    if (filters.actualizado_en) {
      queryBuilder.andWhere('role.actualizado_en = :actualizado_en', {
        actualizado_en: filters.actualizado_en,
      });
    }

    // Filtro por estado (búsqueda parcial)
    if (filters.estado) {
      queryBuilder.andWhere('role.estado ILIKE :estado', {
        estado: `%${filters.estado}%`,
      });
    }

  }

  // Método helper para aplicar ordenamiento
  private applySorting(queryBuilder: SelectQueryBuilder<Role>, sort?: string) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = [
                'id',
        'nombre_rol',
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
          `role.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC'
        );
      } else {
        // Ordenamiento por defecto
        queryBuilder.orderBy('role.agregado_en', 'DESC');
      }
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('role.agregado_en', 'DESC');
    }
  }
}
