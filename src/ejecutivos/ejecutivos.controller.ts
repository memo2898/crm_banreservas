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
import { EjecutivosService } from './ejecutivos.service';
import { CreateEjecutivoDto } from './dto/create-ejecutivo.dto';
import { UpdateEjecutivoDto } from './dto/update-ejecutivo.dto';
import { EjecutivoFiltersDto, PaginationDto } from './dto/pagination.dto';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@ApiTags('Ejecutivos')
@Controller('ejecutivos')
export class EjecutivosController {
  constructor(private readonly ejecutivosService: EjecutivosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ejecutivo' })
  @ApiResponse({ status: 201, description: 'Ejecutivo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createEjecutivoDto: CreateEjecutivoDto) {
    return this.ejecutivosService.create(createEjecutivoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ejecutivos (sin paginación - para compatibilidad)' })
  @ApiResponse({ status: 200, description: 'Lista de ejecutivos obtenida exitosamente.' })
  findAll() {
    return this.ejecutivosService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener todos los ejecutivos con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada de ejecutivos obtenida exitosamente.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo:dirección (ej: name:ASC)' })
  findAllPaginated(@Query() filters: EjecutivoFiltersDto): Promise<PaginationResponse<any>> {
    return this.ejecutivosService.findAllPaginated(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ejecutivo por ID' })
  @ApiResponse({ status: 200, description: 'Ejecutivo encontrado.' })
  @ApiResponse({ status: 404, description: 'Ejecutivo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del ejecutivo' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ejecutivosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ejecutivo' })
  @ApiResponse({ status: 200, description: 'Ejecutivo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ejecutivo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del ejecutivo' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateEjecutivoDto: UpdateEjecutivoDto
  ) {
    return this.ejecutivosService.update(id, updateEjecutivoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ejecutivo' })
  @ApiResponse({ status: 200, description: 'Ejecutivo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ejecutivo no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del ejecutivo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ejecutivosService.remove(id);
  }

  //? Endpoints para Foreign Keys:
  

  //? Endpoints paginados para Foreign Keys:
  
}
