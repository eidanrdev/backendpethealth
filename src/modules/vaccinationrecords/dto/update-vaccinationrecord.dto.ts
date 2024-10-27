import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVaccinationrecordDto {
  @ApiPropertyOptional({
    description: 'Tipo de registro de vacunación',
    example: 'Segunda dosis',
  })
  @IsString({ message: 'El tipo de registro debe ser una cadena de texto.' })
  @IsOptional()
  recordType?: string;

  @ApiPropertyOptional({
    description: 'ID de la mascota asociado al registro de vacunación',
    example: 2,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  @IsOptional()
  petId?: number;
}
