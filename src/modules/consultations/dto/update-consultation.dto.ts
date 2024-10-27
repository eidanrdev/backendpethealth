import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateConsultationDto {
  @ApiPropertyOptional({
    description: 'Nombre del veterinario que realiza la consulta',
    example: 'Dr. Ana Gómez',
  })
  @IsString({ message: 'El nombre del veterinario debe ser una cadena de texto.' })
  @IsOptional()
  veterinarian?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la consulta',
    example: 'Revisión de seguimiento.',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha de la consulta',
    example: '2024-09-15T09:30:00.000Z',
  })
  @IsDate({ message: 'La fecha debe ser una fecha válida.' })
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({
    description: 'ID de la mascota a la que se le realiza la consulta',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  @IsOptional()
  petId?: number;
}
