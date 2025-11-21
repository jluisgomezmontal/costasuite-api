import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { PaginationParams } from '../types';

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
}

export const getAllUsers = async (params: PaginationParams) => {
  const { page = 1, limit = 10, sort = '-createdAt', search } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: sort.startsWith('-')
        ? { [sort.substring(1)]: 'desc' }
        : { [sort]: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { properties: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      properties: {
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          price: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const createUser = async (data: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({ where: { id } });

  return { message: 'User deleted successfully' };
};
