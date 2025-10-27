import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString, IsBoolean } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Número de página (empezando desde 1)',
    minimum: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    example: 10, 
    description: 'Cantidad de elementos por página',
    minimum: 1,
    maximum: 100 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'created_at:DESC',
    description: 'Ordenamiento en formato campo:direccion (ASC o DESC)' 
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class VentaFiltersDto extends PaginationDto {

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por ID específico' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por id_cliente' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_cliente?: number;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por fecha_venta exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  fecha_venta?: string;

  @ApiPropertyOptional({ 
    example: 10.5, 
    description: 'Filtrar por monto' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monto?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por producto (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  producto?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por agregado_por (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  agregado_por?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por agregado_en exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  agregado_en?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por actualizado_por (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  actualizado_por?: string;

  @ApiPropertyOptional({ 
    example: '2024-01-01T00:00:00.000Z', 
    description: 'Filtrar por actualizado_en exacto (ISO string)' 
  })
  @IsOptional()
  @IsString()
  actualizado_en?: string;

  @ApiPropertyOptional({ 
    example: 'activo', 
    description: 'Filtrar por estado (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

}
