/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioFiltersDto, PaginationDto } from './dto/pagination.dto';
import { Usuario } from './entities/usuario.entity';
import { PaginationResponse } from './interfaces/pagination-response.interface';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  // Método helper para encriptar contraseña
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Número de rondas de salt (más alto = más seguro pero más lento)
    return await bcrypt.hash(password, saltRounds);
  }

  // Crear un nuevo registro
  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      // Crear una copia del DTO para no modificar el original
      const userData = { ...createUsuarioDto };

      // Encriptar la contraseña si existe
      if (userData.password_hash) {
        userData.password_hash = await this.hashPassword(
          userData.password_hash,
        );
      }

      const newUsuario = this.usuariosRepository.create(userData);
      const savedUsuario = await this.usuariosRepository.save(newUsuario);

      // Remover la contraseña de la respuesta por seguridad
      const { password_hash, salt, ...usuarioSinPassword } = savedUsuario;

      return usuarioSinPassword;
    } catch (error) {
      throw new HttpException(
        'Error al crear el registro: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Obtener todos los registros (método original sin paginación - para compatibilidad)
  async findAll() {
    try {
      const records = await this.usuariosRepository.find();
      // Remover contraseñas de la respuesta
      return records;
    } catch (error) {
      throw new HttpException(
        'Error al obtener los registros: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // En UsuariosService - Método findByEmailOrUsername modificado
  async findByEmailOrUsername(search: string) {
    try {
      // Primero busca por email
      let record = await this.usuariosRepository.findOne({
        where: { email: search },
      });

      // Si no encuentra por email, busca por username
      if (!record) {
        record = await this.usuariosRepository.findOne({
          where: { username: search },
        });
      }

      // Retornar null en lugar de lanzar excepción
      // Esto permite que AuthService maneje la lógica
      // NOTA: Este método mantiene la contraseña porque se usa para autenticación
      return record || null;
    } catch (error) {
      throw new HttpException(
        'Error al obtener el usuario: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método para verificar contraseña
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Cambiar contraseña
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    try {
      // Buscar el usuario con su contraseña actual
      const user = await this.usuariosRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      // Verificar que la contraseña actual sea correcta
      const isPasswordValid = await this.verifyPassword(
        changePasswordDto.current_password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          'La contraseña actual es incorrecta',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Verificar que la nueva contraseña no sea igual a la actual
      const isSamePassword = await this.verifyPassword(
        changePasswordDto.new_password,
        user.password_hash,
      );

      if (isSamePassword) {
        throw new HttpException(
          'La nueva contraseña debe ser diferente a la actual',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Encriptar la nueva contraseña
      const newHashedPassword = await this.hashPassword(
        changePasswordDto.new_password,
      );

      // Actualizar la contraseña y campos relacionados
      await this.usuariosRepository.update(userId, {
        password_hash: newHashedPassword,
        fecha_ultimo_cambio_password: new Date(),
        debe_cambiar_password: false,
        intentos_fallidos: 0,
      });

      return {
        message: 'Contraseña actualizada exitosamente',
        success: true,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new HttpException(
        'Error al cambiar la contraseña: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener un registro por ID
  async findOne(id: number) {
    try {
      const record = await this.usuariosRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Remover contraseña de la respuesta
      const { password_hash, salt, ...recordSinPassword } = record;
      return recordSinPassword;
    } catch (error) {
      throw new HttpException(
        'Error al obtener el registro: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar un registro
  async update(id: number, updateUsuariosDto: UpdateUsuarioDto) {
    try {
      const existingRecord = await this.usuariosRepository.findOne({
        where: { id },
      });
      if (!existingRecord) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Crear una copia del DTO para no modificar el original
      const updateData = { ...updateUsuariosDto };

      // Encriptar la nueva contraseña si se proporciona
      if (updateData.password_hash) {
        updateData.password_hash = await this.hashPassword(
          updateData.password_hash,
        );
      }

      const response = await this.usuariosRepository.update(id, updateData);

      // Obtener el registro actualizado y remover la contraseña de la respuesta
      const updatedRecord = await this.usuariosRepository.findOne({
        where: { id },
      });
      // const { password_hash, salt, ...recordSinPassword } = updatedRecord;

      return updatedRecord;
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el registro: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Eliminar un registro
  async remove(id: number) {
    try {
      const existingRecord = await this.usuariosRepository.findOne({
        where: { id },
      });
      if (!existingRecord) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      await this.usuariosRepository.delete(id);
      return {
        message: `Usuarios con ID ${id} eliminado correctamente`,
      };
    } catch (error) {
      throw new HttpException(
        'Error al eliminar el registro: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //? Métodos findBy para Foreign Keys:
  // Obtener registros por id_rol (método original - para compatibilidad)
  async findByIdRol(idRol: number) {
    try {
      const records = await this.usuariosRepository.find({
        where: { id_rol: idRol },
        //order: { created_at: 'DESC' }
      });

      if (!records || records.length === 0) {
        return [];
      }

      // Remover contraseñas de la respuesta
      return records.map(({ password_hash, salt, ...record }) => record);
    } catch (error) {
      throw new HttpException(
        'Error al obtener los registros por id_rol: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //? Filtrado paginado:

  // Obtener todos los registros con paginación y filtros
  async findAllPaginated(
    filters: UsuarioFiltersDto,
  ): Promise<PaginationResponse<Usuario>> {
    try {
      const { page = 1, limit = 10, sort, ...filterParams } = filters;

      // Crear query builder
      const queryBuilder =
        this.usuariosRepository.createQueryBuilder('usuario');

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

      // Remover contraseñas de la respuesta
      const dataWithoutPasswords = data.map(
        ({ password_hash, salt, ...record }) => record,
      );

      // Calcular metadatos de paginación
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        data: dataWithoutPasswords as Usuario[],
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext,
          hasPrev,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener los registros: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener registros por id_rol con paginación
  async findIdRolPaginated(
    idRol: number,
    pagination: PaginationDto,
  ): Promise<PaginationResponse<Usuario>> {
    try {
      const { page = 1, limit = 10, sort } = pagination;

      const queryBuilder = this.usuariosRepository
        .createQueryBuilder('usuario')
        .where('usuario.id_rol = :idRol', { idRol });

      // Aplicar ordenamiento
      this.applySorting(queryBuilder, sort);

      const offset = (page - 1) * limit;

      const [data, total] = await queryBuilder
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      // Remover contraseñas de la respuesta
      const dataWithoutPasswords = data.map(
        ({ password_hash, salt, ...record }) => record,
      );

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        data: dataWithoutPasswords as Usuario[],
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNext,
          hasPrev,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener los registros por id_rol: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método helper para aplicar filtros
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Usuario>,
    filters: Partial<UsuarioFiltersDto>,
  ) {
    // No filters to apply
  }

  // Método helper para aplicar ordenamiento
  private applySorting(
    queryBuilder: SelectQueryBuilder<Usuario>,
    sort?: string,
  ) {
    if (sort) {
      const [field, direction] = sort.split(':');
      const validFields = [
        'id',
        'nombre_usuario',
        'nombre_completo',
        'email',
        'password_hash',
        'salt',
        'id_rol',
        'telefono',
        'avatar_url',
        'ultimo_acceso',
        'intentos_fallidos',
        'bloqueado_hasta',
        'token_reset_password',
        'token_reset_expira',
        'debe_cambiar_password',
        'fecha_ultimo_cambio_password',
        'agregado_por',
        'agregado_en',
        'actualizado_por',
        'actualizado_en',
        'estado',
      ];

      if (
        validFields.includes(field) &&
        ['ASC', 'DESC'].includes(direction?.toUpperCase())
      ) {
        queryBuilder.orderBy(
          `usuario.${field}`,
          direction.toUpperCase() as 'ASC' | 'DESC',
        );
      } else {
        // Ordenamiento por defecto
        queryBuilder.orderBy('usuario.created_at', 'DESC');
      }
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('usuario.created_at', 'DESC');
    }
  }
}
