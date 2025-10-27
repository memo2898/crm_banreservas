/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Contrasena actual' })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  @IsString()
  current_password: string;

  @ApiProperty({ example: 'Contrasena nueva' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @IsString()
  //   @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  //   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'La contraseña debe contener mayúsculas, minúsculas y números',
  //   })
  new_password: string;
}
