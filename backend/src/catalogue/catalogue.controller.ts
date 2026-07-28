import {
  Controller,
  Delete,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import { PaginationDto } from './dto/product.dto';

@Controller('product')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Public()
  @Get('list-products')
  @UsePipes(ValidationPipe)
  listProducts(@Query() paginationDto: PaginationDto) {
    return this.catalogueService.getProducts(paginationDto);
  }

  

  @Public()
  @Get('product-details')
  @UsePipes(ValidationPipe)
  productDetails() {
    return this.catalogueService.getDetails();
  }

  @Delete('delete-product')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  deleteProduct() {
    return this.catalogueService.deleteProduct();
  }
}
