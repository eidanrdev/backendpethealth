import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-users.dto';
import { Role } from '../auth/role.enum'; // Importa el enum Role

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string; role?: Role }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ConflictException('Correo inválido');
    }

    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || Role.USER,
      },
    });

    return {
      message: 'Usuario creado exitosamente',
      user,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { pets: true }, // Incluir las mascotas asociadas al usuario
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return {
      message: 'Usuario encontrado',
      user,
    };
  }

  /**
   * Recupera todos los usuarios de la base de datos.
   * @returns Un objeto con un mensaje y una lista de todos los usuarios.
   */
  async findAll() {
    const users = await this.prisma.user.findMany({ include: { pets: true } });
    return {
      message: 'Usuarios encontrados',
      users,
    };
  }

  /**
   * Actualiza un usuario existente en la base de datos.
   * @param id - El ID del usuario a actualizar.
   * @param data - Los nuevos datos del usuario.
   * @returns Un objeto con un mensaje de éxito y los datos del usuario actualizado.
   * @throws NotFoundException - Si no se encuentra el usuario con el ID proporcionado.
   * @throws ConflictException - Si el nuevo correo electrónico ya está registrado por otro usuario o es inválido.
   */
  async updateUser(id: number, data: UpdateUserDto) {
    const { password, email, role, ...rest } = data;

    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Validar y verificar el correo electrónico si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ConflictException('Correo inválido');
      }
      const existingUser = await this.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Correo ya existe');
      }
    }

    let updatedUser;

    // Encriptar la nueva contraseña si se proporciona
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...rest,
          email,
          password: hashedPassword,
          role, // Actualizar el rol si se proporciona
        },
      });
    } else {
      updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...rest,
          email,
          role, // Actualizar el rol si se proporciona
        },
      });
    }

    return {
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    };
  }

  /**
   * Elimina un usuario de la base de datos.
   * @param id - El ID del usuario a eliminar.
   * @returns Un objeto con un mensaje de éxito y los datos del usuario eliminado.
   * @throws NotFoundException - Si no se encuentra el usuario con el ID proporcionado.
   */
  async deleteUser(id: number) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Eliminar el usuario de la base de datos
    await this.prisma.user.delete({ where: { id } });
    return {
      message: 'Usuario eliminado exitosamente',
      user,
    };
  }
}
