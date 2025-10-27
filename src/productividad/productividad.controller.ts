import { Controller, Get, Query, UseGuards, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  //ApiBearerAuth,
} from '@nestjs/swagger';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductividadService } from './productividad.service';
import {
  ProductividadFiltrosDto,
  ProductividadSimpleDto,
} from './dto/productividad.dto';

@ApiTags('Productividad')
@Controller('productividad')
export class ProductividadController {
  private readonly logger = new Logger(ProductividadController.name);

  constructor(private readonly productividadService: ProductividadService) {}

  @Get('analisis-completo')
  @ApiOperation({
    summary: 'Análisis completo de productividad por ejecutivo',
    description:
      'Ejecuta sp_analizar_productividad_ejecutivo con todas las métricas detalladas',
  })
  @ApiResponse({
    status: 200,
    description: 'Análisis ejecutado exitosamente',
    schema: {
      example: {
        success: true,
        data: [
          {
            id_ejecutivo: 1,
            nombre_ejecutivo: 'Juan',
            apellido_ejecutivo: 'Pérez',
            total_visitas: 50,
            visitas_exitosas: 35,
            tasa_exito_visitas: 70.0,
            total_clientes_visitados: 20,
            promedio_visitas_por_cliente: 2.5,
            total_ventas_relacionadas: 15,
            monto_total_ventas: 500000.0,
            monto_promedio_venta: 33333.33,
            tasa_conversion_visita_venta: 30.0,
            efectividad_ejecutivo: 85.5,
            dias_activo: 30,
            promedio_visitas_diarias: 1.67,
            periodo_analisis: '2024-01-01 al 2024-01-31',
          },
        ],
        total: 1,
      },
    },
  })
  async analisisCompleto(@Query() filtros: ProductividadFiltrosDto) {
    this.logger.log('Ejecutando análisis completo de productividad');
    return this.productividadService.analisisCompleto(
      filtros.fechaInicio,
      filtros.fechaFin,
      filtros.idEjecutivo,
    );
  }

  @Get('analisis-simple')
  @ApiOperation({
    summary: 'Análisis simplificado de productividad',
    description:
      'Ejecuta sp_productividad_ejecutivo_simple con métricas básicas',
  })
  @ApiResponse({
    status: 200,
    description: 'Análisis ejecutado exitosamente',
    schema: {
      example: {
        success: true,
        data: [
          {
            id_ejecutivo: 1,
            nombre_completo: 'Juan Pérez',
            total_visitas: 50,
            total_clientes: 20,
            total_ventas: 500000.0,
            efectividad_porcentaje: 30.0,
          },
        ],
        total: 1,
      },
    },
  })
  async analisisSimple(@Query() filtros: ProductividadSimpleDto) {
    this.logger.log('Ejecutando análisis simple de productividad');
    return this.productividadService.analisisSimple(filtros.idEjecutivo);
  }

  @Get('ultimos-30-dias')
  @ApiOperation({
    summary: 'Productividad de los últimos 30 días',
    description:
      'Análisis de todos los ejecutivos en los últimos 30 días (comportamiento por defecto)',
  })
  @ApiResponse({
    status: 200,
    description: 'Análisis ejecutado exitosamente',
  })
  async ultimos30Dias() {
    this.logger.log('Ejecutando análisis de últimos 30 días');
    // Sin parámetros, el SP usa los últimos 30 días por defecto
    return this.productividadService.analisisCompleto();
  }
}
