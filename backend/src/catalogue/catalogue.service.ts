import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryDto, PaginationDto } from './dto/product.dto';

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

  async getProductsByCategory(paginationDto: PaginationDto, categoryDto: CategoryDto){
    const page = await this.prismaService.product.findMany({
      where: {
        categoryId: categoryDto.categoryId,
      },
      skip: paginationDto.skip,
      take: paginationDto.take,
    })
  }

  async getDetails(){}

  async deleteProduct(){}
}
