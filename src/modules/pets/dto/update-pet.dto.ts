import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsInt, IsString, IsDate, MinDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePetDto {
  @ApiPropertyOptional({
    description: 'Nombre de la mascota',
    example: 'Firulais',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la mascota es obligatorio si se proporciona' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Especie de la mascota',
    example: 'Perro',
    enum: ['Perro', 'Gato'],
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La especie de la mascota es obligatoria si se proporciona' })
  @IsIn(['Perro', 'Gato'], { message: 'La especie debe ser Perro o Gato' })
  species?: string;

  @ApiPropertyOptional({
    description: 'Raza de la mascota',
    example: 'Labrador',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La raza de la mascota es obligatoria si se proporciona' })
  breed?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento de la mascota',
    example: '2010-05-15T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: Date;

  @ApiPropertyOptional({
    description: 'Color de la mascota',
    example: 'Negro',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El color de la mascota es obligatorio si se proporciona' })
  color?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario asociado a la mascota',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  userid?: number;
}
