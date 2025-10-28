import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';

import {
  KpisDashboardDto,
  KpisDashboardQueryDto,
} from './dto/kpis-dashboard.dto';
import {
  TendenciaMensualDto,
  TendenciaMensualQueryDto,
} from './dto/tendencia-mensual.dto';
import {
  VentasProductoDto,
  VentasProductoQueryDto,
} from './dto/ventas-producto.dto';
import {
  VentasClienteDto,
  VentasClienteQueryDto,
} from './dto/ventas-cliente.dto';
import {
  VentasEjecutivoDto,
  VentasEjecutivoQueryDto,
} from './dto/ventas-ejecutivo.dto';
import {
  PromedioVentasClienteDto,
  PromedioVentasClienteQueryDto,
} from './dto/promedio-ventas-cliente.dto';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  private readonly logger = new Logger(ReportesController.name);

  constructor(private readonly reportesService: ReportesService) {}

  @Get('dashboard/kpis')
  @ApiOperation({
    summary: 'KPIs generales del dashboard',
    description:
      'Obtiene los indicadores clave de rendimiento del dashboard incluyendo ventas, visitas, clientes y ejecutivos',
  })
  @ApiQuery({
    name: 'fecha_inicio',
    required: false,
    type: String,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fecha_fin',
    required: false,
    type: String,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'KPIs obtenidos exitosamente',
    schema: {
      example: {
        total_ventas: 1250,
        monto_total_ventas: 15750000.0,
        venta_promedio: 12600.0,
        total_visitas: 3500,
        total_clientes: 850,
        clientes_con_ventas: 620,
        promedio_ventas_por_cliente: 2.02,
        tasa_conversion_global: 35.71,
        total_ejecutivos: 45,
        ejecutivos_activos: 38,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener los KPIs',
  })
  async getKpisDashboard(
    @Query() query: KpisDashboardQueryDto,
  ): Promise<KpisDashboardDto> {
    this.logger.log('Obteniendo KPIs del dashboard');
    return this.reportesService.getKpisDashboard(query);
  }

  @Get('ventas/por-producto')
  @ApiOperation({
    summary: 'Ventas totales por producto',
    description:
      'Obtiene el listado de productos con su cantidad de ventas y monto total vendido, ordenados por monto descendente',
  })
  @ApiQuery({
    name: 'fecha_inicio',
    required: false,
    type: String,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fecha_fin',
    required: false,
    type: String,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Ventas por producto obtenidas exitosamente',
    schema: {
      example: [
        {
          producto: 'Tarjeta de Crédito Premium',
          cantidad_ventas: 150,
          monto_total: 2500000.0,
        },
        {
          producto: 'Cuenta de Ahorro Plus',
          cantidad_ventas: 200,
          monto_total: 1800000.0,
        },
        {
          producto: 'Préstamo Personal',
          cantidad_ventas: 75,
          monto_total: 3750000.0,
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener ventas por producto',
  })
  async getVentasPorProducto(
    @Query() query: VentasProductoQueryDto,
  ): Promise<VentasProductoDto[]> {
    this.logger.log('Obteniendo ventas por producto');
    return this.reportesService.getVentasPorProducto(query);
  }

  @Get('ventas/por-cliente')
  @ApiOperation({
    summary: 'Ventas totales por cliente',
    description:
      'Obtiene el listado de clientes con su total de ventas y monto total de compras, ordenados por monto descendente',
  })
  @ApiQuery({
    name: 'fecha_inicio',
    required: false,
    type: String,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fecha_fin',
    required: false,
    type: String,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Ventas por cliente obtenidas exitosamente',
    schema: {
      example: [
        {
          id_cliente: 1,
          cliente: 'Juan Pérez',
          total_ventas: 5,
          monto_total: 125000.0,
        },
        {
          id_cliente: 2,
          cliente: 'María García',
          total_ventas: 3,
          monto_total: 95000.0,
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener ventas por cliente',
  })
  async getVentasPorCliente(
    @Query() query: VentasClienteQueryDto,
  ): Promise<VentasClienteDto[]> {
    this.logger.log('Obteniendo ventas por cliente');
    return this.reportesService.getVentasPorCliente(query);
  }

  @Get('ventas/por-ejecutivo')
  @ApiOperation({
    summary: 'Ventas totales por ejecutivo',
    description:
      'Obtiene el listado de ejecutivos con su total de ventas y monto total vendido, ordenados por monto descendente',
  })
  @ApiQuery({
    name: 'fecha_inicio',
    required: false,
    type: String,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fecha_fin',
    required: false,
    type: String,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Ventas por ejecutivo obtenidas exitosamente',
    schema: {
      example: [
        {
          ejecutivo: 'María González',
          total_ventas: 45,
          monto_total: 875000.0,
        },
        {
          ejecutivo: 'Carlos Rodríguez',
          total_ventas: 38,
          monto_total: 720000.0,
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener ventas por ejecutivo',
  })
  async getVentasPorEjecutivo(
    @Query() query: VentasEjecutivoQueryDto,
  ): Promise<VentasEjecutivoDto[]> {
    this.logger.log('Obteniendo ventas por ejecutivo');
    return this.reportesService.getVentasPorEjecutivo(query);
  }

  @Get('ventas/promedio-por-cliente')
  @ApiOperation({
    summary: 'Promedio de ventas por cliente',
    description:
      'Calcula el promedio del monto total de ventas dividido entre el número de clientes únicos',
  })
  @ApiQuery({
    name: 'fecha_inicio',
    required: false,
    type: String,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fecha_fin',
    required: false,
    type: String,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Promedio de ventas por cliente obtenido exitosamente',
    schema: {
      example: {
        promedio_ventas_por_cliente: 25450.75,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener el promedio de ventas por cliente',
  })
  async getPromedioVentasPorCliente(
    @Query() query: PromedioVentasClienteQueryDto,
  ): Promise<PromedioVentasClienteDto> {
    this.logger.log('Obteniendo promedio de ventas por cliente');
    return this.reportesService.getPromedioVentasPorCliente(query);
  }
}
