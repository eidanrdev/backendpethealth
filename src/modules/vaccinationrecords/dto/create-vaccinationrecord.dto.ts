import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccinationrecordDto {
  @ApiProperty({
    description: 'Tipo de registro de vacunación',
    example: 'Primera dosis',
  })
  @IsString({ message: 'El tipo de registro debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo de registro no puede estar vacío.' })
  recordType: string;

  @ApiProperty({
    description: 'ID de la mascota asociado al registro de vacunación',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la mascota debe ser un número.' })
  @Min(1, { message: 'El ID de la mascota debe ser mayor a 0.' })
  petId: number;
}
