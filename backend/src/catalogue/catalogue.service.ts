import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
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
    const details = await this.prismaService.product.findFirstOrThrow({
      where: {
        id: product.productId,
      },
    });

    return details;
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
}
