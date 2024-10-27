import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/role.enum';  // Importa el enum de roles

export class CreateUsersDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario, debe tener al menos 8 caracteres.',
    example: 'securePassword123',
    minLength: 8,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario, puede ser USER o ADMIN.',
    example: 'USER',
    required: false,
  })
  @IsEnum(Role, { message: 'El rol debe ser uno de los valores permitidos: USER o ADMIN.' })
  @IsOptional()
  role?: Role;  // Este campo es opcional y tiene el enum de roles como validación
}
