import { IsString, IsNotEmpty, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({
    description: 'El tipo de actividad',
    example: 'Paseo',
  })
  @IsString({ message: 'El tipo de actividad debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo de actividad no puede estar vacío.' })
  activityType: string;

  @ApiProperty({
    description: 'La descripción de la actividad',
    example: 'Paseo matutino en el parque.',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  description: string;

  @ApiProperty({
    description: 'La fecha de la actividad',
    example: '2024-08-29T10:00:00.000Z',
  })
  @IsDate({ message: 'La fecha de la actividad debe ser una fecha válida.' })
  @IsNotEmpty({ message: 'La fecha no puede estar vacía.' })
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'ID de la mascota asociada con la actividad',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  petId: number;
}
