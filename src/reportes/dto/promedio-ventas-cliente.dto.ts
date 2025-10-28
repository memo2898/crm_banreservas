import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PromedioVentasClienteDto {
  @ApiProperty({
    description: 'Promedio de ventas por cliente',
    example: 25450.75,
  })
  promedio_ventas_por_cliente: number;
}

export class PromedioVentasClienteQueryDto {
  @ApiProperty({
    required: false,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  fecha_inicio?: string;

  @ApiProperty({
    required: false,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  fecha_fin?: string;
}
