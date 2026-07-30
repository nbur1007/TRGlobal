import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
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
    const pageContents = await this.prismaService.product.findMany({
      skip: paginationDto.skip,
      take: paginationDto.take,
    });
    return pageContents;
  }

  async getProductsByCategory(productQueryDto: ProductQueryDto) {
    const page = await this.prismaService.product.findMany({
      where: {
        categoryId: productQueryDto.categoryId,
      },
      skip: productQueryDto.skip,
      take: productQueryDto.take,
    });
    return page;
  }

  async getDetails(product: ProductByIdDto) {
    try {
      const details = await this.prismaService.product.findUnique({
        where: {
          id: product.id,
        },
      });

      return details;
    } catch (err) {
      throw new HttpException(
        'This product does not exist.',
        HttpStatus.NOT_FOUND,
      );
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
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw err;
    }
  }

  async updateCategory(category: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prismaService.product.update({
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
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
        }
      }
      throw err;
    }
  }
}
