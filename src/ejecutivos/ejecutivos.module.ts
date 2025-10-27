import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjecutivosService } from './ejecutivos.service';
import { EjecutivosController } from './ejecutivos.controller';
import { Ejecutivo } from './entities/ejecutivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ejecutivo])],
  controllers: [EjecutivosController],
  providers: [EjecutivosService],

})
export class EjecutivosModule {}
