import { IsString, IsOptional, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVaccinationDto {
  @ApiPropertyOptional({
    description: 'Nombre de la vacunación',
    example: 'Vacuna contra la rabia',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Fecha de aplicación de la vacunación',
    example: '2024-08-15T00:00:00.000Z',
    type: String,
  })
  @IsDate({ message: 'La fecha de aplicación debe ser una fecha valida' })
  @IsOptional()
  @Type(() => Date)
  applicationDate?: Date;

  @ApiPropertyOptional({
    description: 'Peso de la vacunación',
    example: '2.5',
    type: String, // Decimal as string
  })
  @IsOptional()
  weight?: Decimal;

  @ApiPropertyOptional({
    description: 'ID de la mascota',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  @IsOptional()
  petId?: number;

  @ApiPropertyOptional({
    description: 'ID del registro de vacunación',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del registro de vacunación debe ser un número.' })
  @Min(1, { message: 'El ID del registro de vacunación debe ser mayor a 0.' })
  @IsOptional()
  vaccinationRecordId?: number;
}
