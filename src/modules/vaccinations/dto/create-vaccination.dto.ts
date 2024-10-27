import { IsString, IsDate, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccinationDto {
  @ApiProperty({
    description: 'Nombre de la vacunación',
    example: 'Vacuna contra la rabia',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name: string;

  @ApiProperty({
    description: 'Fecha de aplicación de la vacunación',
    example: '2024-08-15T00:00:00.000Z',
    type: String,
  })
  @IsDate({ message: 'La fecha de aplicación debe ser una fecha valida.' })
  @IsNotEmpty({ message: 'La fecha de aplicación no puede estar vacía.' })
  @Type(() => Date)
  applicationDate: Date;

  @ApiProperty({
    description: 'Peso de la vacunación',
    example: '2.5',
    type: String, 
  })
  @IsNotEmpty({ message: 'El peso no puede estar vacío.' })
  weight: Decimal;

  @ApiProperty({
    description: 'ID de la mascota',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  petId: number;

  @ApiProperty({
    description: 'ID del registro de vacunación',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del registro de vacunación debe ser un número.' })
  @Min(1, { message: 'El ID del registro de vacunación debe ser mayor a 0.' })
  vaccinationRecordId: number;
}
