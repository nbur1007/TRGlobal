import {
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import {
  ProductQueryDto,
  PaginationDto,
  ProductByIdDto,
} from './dto/product.dto';

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
  listProductsById(@Query() productQueryDto: ProductQueryDto) {
    return this.catalogueService.getProductsByCategory(productQueryDto);
  }

  @Public()
  @Get('product-details')
  productDetails(@Query() productByIdDto: ProductByIdDto) {
    return this.catalogueService.getDetails(productByIdDto);
  }

  @Delete('delete-product')
  @Roles(Role.ADMIN)
  deleteProduct(@Query() productByIdDto: ProductByIdDto) {
    return this.catalogueService.deleteProduct(productByIdDto);
  }

  @Patch('update-product')
  @Roles(Role.ADMIN)
  updateProduct(){
    return this.catalogueService.updateProduct();
  }

  @Delete('delete-category')
  @Roles(Role.ADMIN)
  deleteCategory(){
    return this.catalogueService.deleteCategory();
  }

  @Patch('update-category')
  @Roles(Role.ADMIN)
  updateCategory(){
    return this.catalogueService.updateCategory();
  }

}
