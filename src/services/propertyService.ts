import { PropertyType, PropertyStatus } from '@prisma/client';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { PaginationParams } from '../types';

interface CreatePropertyInput {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    parkingSpots?: number;
    yearBuilt?: number;
  };
  images: string[];
  amenities: string[];
  ownerId: string;
}

interface UpdatePropertyInput {
  title?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  price?: number;
  location?: CreatePropertyInput['location'];
  features?: CreatePropertyInput['features'];
  images?: string[];
  amenities?: string[];
}

interface PropertyFilters extends PaginationParams {
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
}

export const getAllProperties = async (params: PropertyFilters) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
    type,
    status = 'available',
    minPrice,
    maxPrice,
    city,
  } = params;

  const skip = (page - 1) * limit;

  const where: any = {
    status,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (type) {
    where.type = type;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (city) {
    where.location = {
      is: {
        city: { contains: city, mode: 'insensitive' },
      },
    };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: sort.startsWith('-')
        ? { [sort.substring(1)]: 'desc' }
        : { [sort]: 'asc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  return property;
};

export const createProperty = async (data: CreatePropertyInput) => {
  const property = await prisma.property.create({
    data,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return property;
};

export const updateProperty = async (
  id: string,
  userId: string,
  userRole: string,
  data: UpdatePropertyInput
) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Solo el dueño o admin puede actualizar
  if (property.ownerId !== userId && userRole !== 'admin') {
    throw new AppError('Not authorized to update this property', 403);
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedProperty;
};

export const deleteProperty = async (
  id: string,
  userId: string,
  userRole: string
) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Solo el dueño o admin puede eliminar
  if (property.ownerId !== userId && userRole !== 'admin') {
    throw new AppError('Not authorized to delete this property', 403);
  }

  await prisma.property.delete({ where: { id } });

  return { message: 'Property deleted successfully' };
};
