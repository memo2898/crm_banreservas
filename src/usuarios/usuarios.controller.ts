import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioFiltersDto, PaginationDto } from './dto/pagination.dto';
import { PaginationResponse } from './interfaces/pagination-response.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Obtener todos los usuarios (sin paginación - para compatibilidad)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente.',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Obtener todos los usuarios con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuarios obtenida exitosamente.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Campo:dirección (ej: name:ASC)',
  })
  findAllPaginated(
    @Query() filters: UsuarioFiltersDto,
  ): Promise<PaginationResponse<any>> {
    return this.usuariosService.findAllPaginated(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del usuario' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del usuario' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch(':id/change-password')
  // @UseGuards(JwtAuthGuard) // Descomenta si usas guards de autenticación
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usuariosService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del usuario' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  //? Endpoints para Foreign Keys:

  @Get('by-rol/:idRol')
  @ApiOperation({
    summary:
      'Obtener usuarios por id_rol (sin paginación - para compatibilidad)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente.',
  })
  @ApiParam({ name: 'idRol', type: 'number', description: 'ID del rol' })
  findByIdRol(@Param('idRol', ParseIntPipe) idRol: number) {
    return this.usuariosService.findByIdRol(idRol);
  }

  //? Endpoints paginados para Foreign Keys:

  @Get('by-rol/:idRol/paginated')
  @ApiOperation({ summary: 'Obtener usuarios por id_rol con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuarios obtenida exitosamente.',
  })
  @ApiParam({ name: 'idRol', type: 'number', description: 'ID del rol' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Campo:dirección (ej: name:ASC)',
  })
  findIdRolPaginated(
    @Param('idRol', ParseIntPipe) idRol: number,
    @Query() pagination: PaginationDto,
  ): Promise<PaginationResponse<any>> {
    return this.usuariosService.findIdRolPaginated(idRol, pagination);
  }
}
