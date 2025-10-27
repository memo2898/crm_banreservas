import { PartialType } from '@nestjs/swagger';
import { CreateProductividadDto } from './create-productividad.dto';

export class UpdateProductividadDto extends PartialType(CreateProductividadDto) {}
