import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  EditProductDto,
  PaginationDto,
  ProductByIdDto,
  ProductQueryDto,
} from './dto/product.dto';

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
          id: product.productId,
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
          id: product.productId,
        },
      });
    } catch (err) {
      throw new HttpException(
        'This user does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateProduct(editProductDto: EditProductDto) {
    try {
      const updatedProduct = await this.prismaService.product.update({
        where: { id: editProductDto.productId },
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
      if (err === 'P2025') {
        throw new HttpException('Product not found.', HttpStatus.NOT_FOUND);
      }
      if (err === 'P2003') {
        throw new HttpException(
          'Category does not exist.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw err;
    }
  }

  async deleteCategory() {}

  async updateCategory() {}
}
