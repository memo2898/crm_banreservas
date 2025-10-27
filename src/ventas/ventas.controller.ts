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
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { VentaFiltersDto, PaginationDto } from './dto/pagination.dto';
import { PaginationResponse } from './interfaces/pagination-response.interface';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo venta' })
  @ApiResponse({ status: 201, description: 'Venta creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ventas (sin paginación - para compatibilidad)' })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida exitosamente.' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener todos los ventas con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada de ventas obtenida exitosamente.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo:dirección (ej: name:ASC)' })
  findAllPaginated(@Query() filters: VentaFiltersDto): Promise<PaginationResponse<any>> {
    return this.ventasService.findAllPaginated(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrado.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del venta' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un venta' })
  @ApiResponse({ status: 200, description: 'Venta actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del venta' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVentaDto: UpdateVentaDto
  ) {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un venta' })
  @ApiResponse({ status: 200, description: 'Venta eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrado.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del venta' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }

  //? Endpoints para Foreign Keys:
  
  @Get('by-cliente/:idCliente')
  @ApiOperation({ summary: 'Obtener ventas por id_cliente (sin paginación - para compatibilidad)' })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida exitosamente.' })
  @ApiParam({ name: 'idCliente', type: 'number', description: 'ID del cliente' })
  findByIdCliente(@Param('idCliente', ParseIntPipe) idCliente: number) {
    return this.ventasService.findByIdCliente(idCliente);
  }


  //? Endpoints paginados para Foreign Keys:
  
  @Get('by-cliente/:idCliente/paginated')
  @ApiOperation({ summary: 'Obtener ventas por id_cliente con paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de ventas obtenida exitosamente.' })
  @ApiParam({ name: 'idCliente', type: 'number', description: 'ID del cliente' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo:dirección (ej: name:ASC)' })
  findIdClientePaginated(
    @Param('idCliente', ParseIntPipe) idCliente: number,
    @Query() pagination: PaginationDto
  ): Promise<PaginationResponse<any>> {
    return this.ventasService.findIdClientePaginated(idCliente, pagination);
  }

}
