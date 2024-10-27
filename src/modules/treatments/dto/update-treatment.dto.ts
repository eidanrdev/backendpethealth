import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTreatmentDto {
  @ApiProperty({
    description: 'El nombre del tratamiento.',
    example: 'Vacuna antirrábica',
    required: false,
  })
  @IsString({ message: 'El nombre del tratamiento debe ser una cadena de texto.' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'La descripción del tratamiento.',
    example: 'Tratamiento para prevenir la rabia.',
    required: false,
  })
  @IsString({ message: 'La descripción del tratamiento debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'La fecha de inicio del tratamiento.',
    example: '2024-08-29T00:00:00.000Z',
    required: false,
  })
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida.' })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'La fecha de finalización del tratamiento.',
    example: '2024-09-29T00:00:00.000Z',
    required: false,
  })
  @IsDate({ message: 'La fecha de finalización debe ser una fecha válida.' })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'El ID de la mascota a la que se le aplica el tratamiento.',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  @IsOptional()
  petId?: number;
}
