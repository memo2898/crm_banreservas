import { PartialType } from '@nestjs/swagger';
import { CreateEjecutivoDto } from './create-ejecutivo.dto';

export class UpdateEjecutivoDto extends PartialType(CreateEjecutivoDto) {}
