// dto/kpis-dashboard.dto.ts
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class KpisDashboardDto {
  total_ventas: number;
  monto_total_ventas: number;
  venta_promedio: number;
  total_visitas: number;
  total_clientes: number;
  clientes_con_ventas: number;
  promedio_ventas_por_cliente: number;
  tasa_conversion_global: number;
  total_ejecutivos: number;
  ejecutivos_activos: number;
}

export class KpisDashboardQueryDto {
  @ApiPropertyOptional({
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;
}
