import { Module } from '@nestjs/common';
import { ProductividadController } from './productividad.controller';
import { ProductividadService } from './productividad.service';

@Module({
  controllers: [ProductividadController],
  providers: [ProductividadService],
  exports: [ProductividadService],
})
export class ProductividadModule {}
