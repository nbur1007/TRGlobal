import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import {
  ProductQueryDto,
  PaginationDto,
  ProductByIdDto,
  EditProductDto,
  CreateProductDto,
} from './dto/product.dto';
import {
  CategorySelectDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { ModerateThrottle, RelaxedThrottle } from '../utils/custom-throttler.decorator';

@Controller('catalogue')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Public()
  @Get('list-products')
  @RelaxedThrottle()
  listProducts(@Query() paginationDto: PaginationDto) {
    return this.catalogueService.getProducts(paginationDto);
  }

  @Public()
  @Get('list-categories')
  @RelaxedThrottle()
  listCategories() {
    return this.catalogueService.getCategories();
  }

  @Public()
  @Get('products-by-category')
  @RelaxedThrottle()
  listProductsByCategory(@Query() productQueryDto: ProductQueryDto) {
    return this.catalogueService.getProductsByCategory(productQueryDto);
  }

  @Public()
  @Get('product-details')
  @RelaxedThrottle()
  productDetails(@Query() productByIdDto: ProductByIdDto) {
    return this.catalogueService.getDetails(productByIdDto);
  }

  @Delete('delete-product')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  deleteProduct(@Query() productByIdDto: ProductByIdDto) {
    return this.catalogueService.deleteProduct(productByIdDto);
  }

  @Patch('update-product')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  updateProduct(@Body() editProductDto: EditProductDto) {
    return this.catalogueService.updateProduct(editProductDto);
  }

  @Delete('delete-category')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  deleteCategory(@Query() categoryDto: CategorySelectDto) {
    return this.catalogueService.deleteCategory(categoryDto);
  }

  @Patch('update-category')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.catalogueService.updateCategory(updateCategoryDto);
  }

  @Post('create-category')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.catalogueService.createCategory(createCategoryDto);
  }

  @Post('create-product')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.catalogueService.createProduct(createProductDto);
  }
}
