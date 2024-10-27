import { IsString, IsOptional, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiProperty({
    description: 'El tipo de actividad',
    example: 'Paseo',
    required: false, 
  })
  @IsString({ message: 'El tipo de actividad debe ser una cadena de texto.' })
  @IsOptional()
  activityType?: string;

  @ApiProperty({
    description: 'La descripción de la actividad',
    example: 'Paseo matutino en el parque.',
    required: false, 
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'La fecha de la actividad',
    example: '2024-08-29T10:00:00.000Z',
    required: false,
  })
  @IsDate({ message: 'La fecha debe ser una fecha válida.' })
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    description: 'ID de la mascota asociada con la actividad',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  @IsOptional()
  petId?: number;
}
