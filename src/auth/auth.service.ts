/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EmpleadosService } from 'src/empleados/empleados.service'; // Importar el servicio de empleados

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly empleadosService: EmpleadosService, // Inyectar el servicio
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findByEmailOrUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    const userData = await this.usersService.findOne(user.id);

    // Buscar los datos del empleado por id_usuario
    const empleadoData = await this.empleadosService.findByIdUsuario(user.id);

    return {
      access_token: token,
      user: userData,
      empleado: empleadoData, // Incluir datos del empleado
    };
  }
}
