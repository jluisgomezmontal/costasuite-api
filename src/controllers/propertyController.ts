import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../types';
import * as propertyService from '../services/propertyService';

// Schemas de validación
export const getPropertiesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
    sort: z.string().optional(),
    search: z.string().optional(),
    type: z.enum(['sale', 'rent']).optional(),
    status: z.enum(['available', 'sold', 'rented']).optional(),
    minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
    city: z.string().optional(),
  }),
});

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').trim(),
    description: z.string().min(20, 'Description must be at least 20 characters').trim(),
    type: z.enum(['sale', 'rent']),
    price: z.number().positive('Price must be positive'),
    location: z.object({
      address: z.string().trim(),
      city: z.string().trim(),
      state: z.string().trim(),
      country: z.string().trim(),
      postalCode: z.string().trim(),
      coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      }),
    }),
    features: z.object({
      bedrooms: z.number().int().min(0),
      bathrooms: z.number().int().min(0),
      area: z.number().positive(),
      parkingSpots: z.number().int().min(0).optional(),
      yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    }),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    amenities: z.array(z.string()).default([]),
  }),
});

export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').trim().optional(),
    description: z.string().min(20, 'Description must be at least 20 characters').trim().optional(),
    type: z.enum(['sale', 'rent']).optional(),
    status: z.enum(['available', 'sold', 'rented']).optional(),
    price: z.number().positive('Price must be positive').optional(),
    location: z.object({
      address: z.string().trim(),
      city: z.string().trim(),
      state: z.string().trim(),
      country: z.string().trim(),
      postalCode: z.string().trim(),
      coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      }),
    }).optional(),
    features: z.object({
      bedrooms: z.number().int().min(0),
      bathrooms: z.number().int().min(0),
      area: z.number().positive(),
      parkingSpots: z.number().int().min(0).optional(),
      yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    }).optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

export const propertyIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Controladores
export const getAllProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await propertyService.getAllProperties(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const property = await propertyService.createProperty({
      ...req.body,
      ownerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const property = await propertyService.updateProperty(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const result = await propertyService.deleteProperty(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
