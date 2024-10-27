import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreatmentDto {
  @ApiProperty({
    description: 'El nombre del tratamiento.',
    example: 'Vacuna antirrábica',
  })
  @IsString({ message: 'El nombre del tratamiento debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del tratamiento no puede estar vacío.' })
  name: string;

  @ApiProperty({
    description: 'La descripción del tratamiento.',
    example: 'Tratamiento para prevenir la rabia.',
  })
  @IsString({ message: 'La descripción del tratamiento debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción del tratamiento no puede estar vacía.' })
  description: string;

  @ApiProperty({
    description: 'La fecha de inicio del tratamiento.',
    example: '2024-08-29T00:00:00.000Z',
  })
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida.' })
  @IsNotEmpty({ message: 'La fecha de inicio no puede estar vacía.' })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'La fecha de finalización del tratamiento.',
    example: '2024-09-29T00:00:00.000Z',
  })
  @IsDate({ message: 'La fecha de finalización debe ser una fecha válida.' })
  @IsNotEmpty({ message: 'La fecha de finalización no puede estar vacía.' })
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'El ID de la mascota a la que se le aplica el tratamiento.',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  petId: number;
}
