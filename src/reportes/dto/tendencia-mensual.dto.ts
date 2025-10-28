// dto/tendencia-mensual.dto.ts
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TendenciaMensualDto {
  año: number;
  mes: number;
  mes_nombre: string;
  total_ventas: number;
  monto_total: number;
  total_visitas: number;
  tasa_conversion: number;
  crecimiento_mensual: number;
}

export class TendenciaMensualQueryDto {
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
