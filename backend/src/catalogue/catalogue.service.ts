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

  async updateProduct(editProductDto: EditProductDto) {}

  async deleteCategory() {}

  async updateCategory() {}
}
