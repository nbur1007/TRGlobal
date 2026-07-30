import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import {
  ProductQueryDto,
  PaginationDto,
  ProductByIdDto,
  EditProductDto,
} from './dto/product.dto';
import { CategoryDto } from './dto/category.dto';

@Controller('catalogue')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Public()
  @Get('list-products')
  listProducts(@Query() paginationDto: PaginationDto) {
    return this.catalogueService.getProducts(paginationDto);
  }

  @Public()
  @Get('products-by-category')
  listProductsByCategory(@Query() productQueryDto: ProductQueryDto) {
    return this.catalogueService.getProductsByCategory(productQueryDto);
  }

  @Public()
  @Get('product-details')
  productDetails(@Query() productByIdDto: ProductByIdDto) {
    return this.catalogueService.getDetails(productByIdDto);
  }

  @Delete('delete-product')
  @Roles(Role.ADMIN)
  deleteProduct(@Body() productByIdDto: ProductByIdDto) {
    return this.catalogueService.deleteProduct(productByIdDto);
  }

  @Patch('update-product')
  @Roles(Role.ADMIN)
  updateProduct(@Body() editProductDto: EditProductDto) {
    return this.catalogueService.updateProduct(editProductDto);
  }

  @Delete('delete-category')
  @Roles(Role.ADMIN)
  deleteCategory(@Body() categoryDto:CategoryDto) {
    return this.catalogueService.deleteCategory(categoryDto);
  }

  @Patch('update-category')
  @Roles(Role.ADMIN)
  updateCategory() {
    return this.catalogueService.updateCategory();
  }
}
