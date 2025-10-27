import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { EmpleadosModule } from 'src/empleados/empleados.module';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    EmpleadosModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN');

        console.log('JWT_SECRET configurado:', secret ? 'SÍ' : 'NO'); // Para debug
        console.log('JWT_EXPIRES_IN:', expiresIn || '24h'); // Para debug

        return {
          secret: secret || 'TicketsTime', // Fallback si no hay variable de entorno
          signOptions: {
            expiresIn: expiresIn || '24h', // Fallback
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule], // ✅ AGREGADO: Exportar JwtModule también
})
export class AuthModule {}
