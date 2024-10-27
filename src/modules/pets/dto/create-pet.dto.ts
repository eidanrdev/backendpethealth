import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn, IsInt, IsString, IsDate, MinDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Firulais',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la mascota es obligatorio' })
  name: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    example: 'Perro',
    enum: ['Perro', 'Gato'],
  })
  @IsString()
  @IsNotEmpty({ message: 'La especie de la mascota es obligatoria' })
  @IsIn(['Perro', 'Gato'], { message: 'La especie debe ser Perro o Gato' })
  species: string;

  @ApiProperty({
    description: 'Raza de la mascota',
    example: 'Labrador',
  })
  @IsString()
  @IsNotEmpty({ message: 'La raza de la mascota es obligatoria' })
  breed: string;

  @ApiProperty({
    description: 'Fecha de nacimiento de la mascota',
    example: '2010-05-15T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  @MinDate(new Date('2005-01-01'), { message: 'La fecha de nacimiento debe ser posterior al 1 de enero de 2005' })
  birthDate: Date;

  @ApiProperty({
    description: 'Color de la mascota',
    example: 'Negro',
  })
  @IsString()
  @IsNotEmpty({ message: 'El color de la mascota es obligatorio' })
  color: string;

  @ApiProperty({
    description: 'ID del usuario asociado a la mascota',
    example: 1,
  }) 
  userid?: number; 
  
}
