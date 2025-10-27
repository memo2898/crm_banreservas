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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { VisitasService } from './visitas.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { VisitaFiltersDto, PaginationDto } from './dto/pagination.dto';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@ApiTags('Visitas')
@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo visita' })
  @ApiResponse({ status: 201, description: 'Visita creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createVisitaDto: CreateVisitaDto) {
    return this.visitasService.create(createVisitaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los visitas (sin paginación - para compatibilidad)' })
  @ApiResponse({ status: 200, description: 'Lista de visitas obtenida exitosamente.' })
  findAll() {
    return this.visitasService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener todos los visitas con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada de visitas obtenida exitosamente.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo:dirección (ej: name:ASC)' })
  findAllPaginated(@Query() filters: VisitaFiltersDto): Promise<PaginationResponse<any>> {
    return this.visitasService.findAllPaginated(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un visita por ID' })
  @ApiResponse({ status: 200, description: 'Visita encontrado.' })
  @ApiResponse({ status: 404, description: 'Visita no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del visita' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un visita' })
  @ApiResponse({ status: 200, description: 'Visita actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Visita no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del visita' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVisitaDto: UpdateVisitaDto
  ) {
    return this.visitasService.update(id, updateVisitaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un visita' })
  @ApiResponse({ status: 200, description: 'Visita eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Visita no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del visita' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.visitasService.remove(id);
  }

  //? Endpoints para Foreign Keys:
  
  @Get('by-cliente/:idCliente')
  @ApiOperation({ summary: 'Obtener visitas por id_cliente (sin paginación - para compatibilidad)' })
  @ApiResponse({ status: 200, description: 'Lista de visitas obtenida exitosamente.' })
  @ApiParam({ name: 'idCliente', type: 'number', description: 'ID del cliente' })
  findByIdCliente(@Param('idCliente', ParseIntPipe) idCliente: number) {
    return this.visitasService.findByIdCliente(idCliente);
  }

  @Get('by-ejecutivo/:idEjecutivo')
  @ApiOperation({ summary: 'Obtener visitas por id_ejecutivo (sin paginación - para compatibilidad)' })
  @ApiResponse({ status: 200, description: 'Lista de visitas obtenida exitosamente.' })
  @ApiParam({ name: 'idEjecutivo', type: 'number', description: 'ID del ejecutivo' })
  findByIdEjecutivo(@Param('idEjecutivo', ParseIntPipe) idEjecutivo: number) {
    return this.visitasService.findByIdEjecutivo(idEjecutivo);
  }


  //? Endpoints paginados para Foreign Keys:
  
  @Get('by-cliente/:idCliente/paginated')
  @ApiOperation({ summary: 'Obtener visitas por id_cliente con paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de visitas obtenida exitosamente.' })
  @ApiParam({ name: 'idCliente', type: 'number', description: 'ID del cliente' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo:dirección (ej: name:ASC)' })
  findIdClientePaginated(
    @Param('idCliente', ParseIntPipe) idCliente: number,
    @Query() pagination: PaginationDto
  ): Promise<PaginationResponse<any>> {
    return this.visitasService.findIdClientePaginated(idCliente, pagination);
  }

  @Get('by-ejecutivo/:idEjecutivo/paginated')
  @ApiOperation({ summary: 'Obtener visitas por id_ejecutivo con paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de visitas obtenida exitosamente.' })
  @ApiParam({ name: 'idEjecutivo', type: 'number', description: 'ID del ejecutivo' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo:dirección (ej: name:ASC)' })
  findIdEjecutivoPaginated(
    @Param('idEjecutivo', ParseIntPipe) idEjecutivo: number,
    @Query() pagination: PaginationDto
  ): Promise<PaginationResponse<any>> {
    return this.visitasService.findIdEjecutivoPaginated(idEjecutivo, pagination);
  }

}
