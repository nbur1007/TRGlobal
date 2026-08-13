import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateProductDto,
  EditProductDto,
  PaginationDto,
  ProductByIdDto,
  ProductQueryDto,
} from './dto/product.dto';
import { Prisma } from 'generated/prisma/client';
import {
  CategorySelectDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CatalogueService {
  constructor(private prismaService: PrismaService) {}

  async getProducts(paginationDto: PaginationDto) {
    const { skip, take } = paginationDto;

    const [products, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prismaService.product.count(),
    ]);

    return { products, total, skip, take, hasMore: skip + products.length < total };
  }

  async getCategories() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }

  async getProductsByCategory(productQueryDto: ProductQueryDto) {
    const { categoryId, skip, take } = productQueryDto;
    const where = { categoryId };

    const [products, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prismaService.product.count({ where }),
    ]);

    return { products, total, skip, take, hasMore: skip + products.length < total };
  }

  async getDetails(product: ProductByIdDto) {
    const details = await this.prismaService.product.findUnique({
      where: { id: product.id },
    });
    if (!details) {
      throw new HttpException(
        'This product does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    return details;
  }

  async createProduct(product: CreateProductDto){
    try {
      const newCategory = await this.prismaService.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId
        },
      });
      return newCategory;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(
            'This product already exists.',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw err;
    }
  }

  async deleteProduct(product: ProductByIdDto) {
    try {
      await this.prismaService.product.delete({
        where: {
          id: product.id,
        },
      });
      return;
    } catch (err) {
      throw new HttpException(
        'This product does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateProduct(editProductDto: EditProductDto) {
    try {
      const updatedProduct = await this.prismaService.product.update({
        where: { id: editProductDto.id },
        data: {
          name: editProductDto.name,
          description: editProductDto.description,
          price: editProductDto.price,
          stock: editProductDto.stock,
          imageUrl: editProductDto.imageUrl,
          categoryId: editProductDto.categoryId,
        },
      });

      return updatedProduct;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
        }
        if (err.code === 'P2003') {
          throw new HttpException(
            'Category does not exist.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw err;
    }
  }

  async deleteCategory(category: CategorySelectDto) {
    try {
      await this.prismaService.category.delete({
        where: { id: category.id },
      });
      return;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
        }
        if (err.code === 'P2003') {
          throw new HttpException(
            'Category must be empty to be deleted.',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw err;
    }
  }

  async updateCategory(category: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prismaService.category.update({
        where: { id: category.id },
        data: {
          name: category.name,
          slug: category.slug,
        },
      });

      return updatedCategory;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
        }
        if (err.code === 'P2002') {
          throw new HttpException(
            'A category with that name or slug already exists.',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw err;
    }
  }

  async createCategory(category: CreateCategoryDto) {
    try {
      const newCategory = await this.prismaService.category.create({
        data: {
          name: category.name,
          slug: category.slug,
        },
      });
      return newCategory;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(
            'A category with that name or slug already exists.',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw err;
    }
  }
}
