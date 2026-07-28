import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CatalogueService {
  constructor(private prismaService: PrismaService) {}

  async getProducts() {}

  async getProductsByCategory(){}

  async getDetails(){}

  async deleteProduct(){}
}
