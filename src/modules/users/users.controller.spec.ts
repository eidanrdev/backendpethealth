import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService, JwtService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });
  describe('Opercaciones CRUD', () => {
  it('debería crear un usuario', async () => {
    const createUsersDto: CreateUsersDto = { name: 'Juan Pérez', email: 'juan@example.com', password: 'password' };
    const resultado = { message: 'Usuario creado exitosamente', user: { ...createUsersDto, id: 1 } };

    jest.spyOn(service, 'createUser').mockResolvedValue(resultado);

    expect(await controller.register(createUsersDto)).toBe(resultado);
  });

  it('debería obtener todos los usuarios', async () => {
    const resultado = {
      message: 'Usuarios encontrados',
      users: [{ id: 1, name: 'Juan Pérez', email: 'juan@example.com', password: 'hashedpassword', pets: [] }],
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(resultado);

    expect(await controller.getUsers()).toBe(resultado);
  });

  it('debería obtener un usuario por ID', async () => {
    const resultado = {
      message: 'Usuario encontrado',
      user: { id: 1, name: 'Juan Pérez', email: 'juan@example.com', password: 'hashedpassword', pets: [] },
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(resultado);

    expect(await controller.getUser(1)).toBe(resultado);
  });

  it('debería actualizar un usuario por ID', async () => {
    const updateUsersDto: UpdateUserDto = { name: 'Juan Actualizado', email: 'juan.updated@example.com' };
    const resultado = {
      message: 'Usuario actualizado exitosamente',
      user: { id: 1, name: 'Juan Actualizado', email: 'juan.updated@example.com', pets: [] },
    };

    jest.spyOn(service, 'updateUser').mockResolvedValue(resultado);

    expect(await controller.updateUser(1, updateUsersDto)).toBe(resultado);
  });

  it('debería eliminar un usuario por ID', async () => {
    const resultado = {
      message: 'Usuario eliminado exitosamente',
      user: { id: 1, name: 'Juan Pérez', email: 'juan@example.com', password: 'hashedpassword' },
    };

    jest.spyOn(service, 'deleteUser').mockResolvedValue(resultado);

    expect(await controller.deleteUser(1)).toBe(resultado);
  });
})
});
