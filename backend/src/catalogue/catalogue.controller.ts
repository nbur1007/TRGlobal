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
import { ProductQueryDto, PaginationDto } from './dto/product.dto';

@Controller('catalogue')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Public()
  @Get('list-products')
  listProducts(@Query() paginationDto: PaginationDto) {
    return this.catalogueService.getProducts(paginationDto);
  }

  @Public()
  @Get('products-by-id')
  listProductsById(@Query() productQueryDto: ProductQueryDto){
    return this.catalogueService.getProductsByCategory(productQueryDto)
  }

  @Public()
  @Get('product-details')
  productDetails() {
    return this.catalogueService.getDetails();
  }

  @Delete('delete-product')
  @Roles(Role.ADMIN)
  deleteProduct() {
    return this.catalogueService.deleteProduct();
  }
}
