import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'; // Asegúrate de que User esté importado correctamente

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea una nueva consulta.
   * @param createConsultationDto Datos de la consulta a crear.
   * @param user Usuario que realiza la operación.
   * @returns Mensaje de éxito y datos de la consulta creada.
   */
  async createConsultation(createConsultationDto: CreateConsultationDto, user: User) {
    const { veterinarian, description, date, petId } = createConsultationDto;
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });

    if (!pet) {
      throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
    }

    // Verificar que el usuario tenga acceso a la mascota
    if (pet.userid !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para crear consultas para esta mascota');
    }

    const parsedDate = new Date(date);
    // Verificar que la fecha sea en el futuro
    if (parsedDate <= new Date()) {
      throw new BadRequestException('La fecha debe ser en el futuro');
    }

    const consultation = await this.prisma.consultation.create({
      data: {
        veterinarian,
        description,
        date: parsedDate,
        petId,
      },
    });

    return {
      message: 'Consulta creada exitosamente',
      consultation,
    };
  }

  /**
   * Obtiene una consulta por su ID.
   * @param id ID de la consulta a obtener.
   * @param user Usuario que realiza la operación.
   * @returns Mensaje de éxito y datos de la consulta encontrada.
   */
  async findOne(id: number, user: User) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: { pet: true },
    });

    if (!consultation) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    // Verificar acceso
    if (consultation.pet.userid !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para ver esta consulta');
    }

    return {
      message: 'Consulta encontrada',
      consultation,
    };
  }

  /**
   * Obtiene todas las consultas.
   * @param user Usuario que realiza la operación.
   * @returns Mensaje de éxito y lista de todas las consultas encontradas.
   */
  async findAll(user: User) {
    if (user.role === 'ADMIN') {
      return this.prisma.consultation.findMany({
        include: { pet: true }, // Incluir detalles de mascota y usuario
      });
    }

    // Si el usuario no es admin, solo devolver las consultas de sus mascotas
    return this.prisma.consultation.findMany({
      where: { pet: { userid: user.id } }, // Filtrar por el usuario
      include: { pet: true },
    });
  }

  /**
   * Actualiza una consulta existente.
   * @param id ID de la consulta a actualizar.
   * @param data Datos de la consulta a actualizar.
   * @param user Usuario que realiza la operación.
   * @returns Mensaje de éxito y datos de la consulta actualizada.
   */
  async updateConsultation(id: number, data: UpdateConsultationDto, user: User) {
    const { petId, date, ...rest } = data;

    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: { pet: true },
    });

    if (!consultation) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    // Verificar acceso
    if (consultation.pet.userid !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para actualizar esta consulta');
    }

    if (petId) {
      const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        throw new NotFoundException(`Mascota con ID ${petId} no encontrada`);
      }
    }

    const updateData: any = { ...rest, petId };
    if (date) {
      const parsedDate = new Date(date);
      // Verificar que la nueva fecha sea en el futuro
      if (parsedDate <= new Date()) {
        throw new BadRequestException('La fecha debe ser en el futuro');
      }
      updateData.date = parsedDate;
    }

    const updatedConsultation = await this.prisma.consultation.update({
      where: { id },
      data: updateData,
    });

    return {
      message: 'Consulta actualizada exitosamente',
      consultation: updatedConsultation,
    };
  }

  /**
   * Elimina una consulta por su ID.
   * @param id ID de la consulta a eliminar.
   * @param user Usuario que realiza la operación.
   * @returns Mensaje de éxito y datos de la consulta eliminada.
   */
  async deleteConsultation(id: number, user: User) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: { pet: true },
    });

    if (!consultation) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    // Verificar acceso
    if (consultation.pet.userid !== user.id && user.role !== 'ADMIN') {
      throw new BadRequestException('No tienes permiso para eliminar esta consulta');
    }

    await this.prisma.consultation.delete({ where: { id } });

    return {
      message: 'Consulta eliminada exitosamente',
      consultation,
    };
  }
}
