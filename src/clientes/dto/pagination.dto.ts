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

export class ClienteFiltersDto extends PaginationDto {

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por id_cliente' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_cliente?: number;

  @ApiPropertyOptional({ 
    example: 'ejemplo', 
    description: 'Filtrar por nombre (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por apellido (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({ 
    example: 'Calle Ejemplo 123', 
    description: 'Filtrar por direccion (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ 
    example: '123-456-7890', 
    description: 'Filtrar por telefono (búsqueda parcial)' 
  })
  @IsOptional()
  @IsString()
  telefono?: string;

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
