import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConsultationDto {
  @ApiProperty({
    description: 'Nombre del veterinario que realiza la consulta',
    example: 'Dr. Juan Pérez',
  })
  @IsString({ message: 'El nombre del veterinario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del veterinario no puede estar vacío.' })
  veterinarian: string;

  @ApiProperty({
    description: 'Descripción de la consulta',
    example: 'Consulta de rutina para revisión general.',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  description: string;

  @ApiProperty({
    description: 'Fecha de la consulta',
    example: '2024-08-29T14:00:00.000Z',
  })
  @IsDate({ message: 'La fecha debe ser una fecha válida.' })
  @IsNotEmpty({ message: 'La fecha no puede estar vacía.' })
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'ID de la mascota a la que se le realiza la consulta',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  petId: number;
}
