import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class CatalogueService {
  constructor(private prismaService: PrismaService) {}

  async getProducts(paginationDto: PaginationDto) {
    const page = await this.prismaService.product.findMany({
      skip: paginationDto.skip,
      take: paginationDto.take,
    })
    return page;
  }

  async getProductsByCategory(productQueryDto: ProductQueryDto){
    const page = await this.prismaService.product.findMany({
      where: {
        categoryId: productQueryDto.categoryId,
      },
      skip: productQueryDto.skip,
      take: productQueryDto.take,
    })
    return page;
  }

  async getDetails(){}

  async deleteProduct(){}
}
