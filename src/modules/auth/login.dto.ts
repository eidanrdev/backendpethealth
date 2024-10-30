import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from './role.enum'; 

export class LoginDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre es obligatoria' })
  name: string;
  
  @IsEmail({}, { message: 'El correo electrónico es inválido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de caracteres válida' })
  role?: Role; 
}
