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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ClienteFiltersDto, PaginationDto } from './dto/pagination.dto';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Obtener todos los clientes (sin paginación - para compatibilidad)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente.',
  })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Obtener todos los clientes con paginación y filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de clientes obtenida exitosamente.',
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
    @Query() filters: ClienteFiltersDto,
  ): Promise<PaginationResponse<any>> {
    return this.clientesService.findAllPaginated(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }

  @Delete('soft_delete/:id')
  @ApiOperation({ summary: 'Eliminar un cliente modo SOFT' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  remove_soft(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove_soft(id);
  }
}
