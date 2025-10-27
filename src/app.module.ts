import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EjecutivosModule } from './ejecutivos/ejecutivos.module';
import { ClientesModule } from './clientes/clientes.module';
import { VisitasModule } from './visitas/visitas.module';
import { VentasModule } from './ventas/ventas.module';
import { ProductividadModule } from './productividad/productividad.module';
import { EtlModule } from './etl/etl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', //mysql
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'test',
      //entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      //synchronize: process.env.NODE_ENV !== 'production',
      synchronize: false,
      //logging: process.env.NODE_ENV !== 'production',
    }),
    RolesModule,
    UsuariosModule,
    EjecutivosModule,
    ClientesModule,
    VisitasModule,
    VentasModule,
    ProductividadModule,
    EtlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
