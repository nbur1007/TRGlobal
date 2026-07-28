import { Controller, Delete, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/guards/roles/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { Public } from '../auth/guards/public.decorator';
import type { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}


  @Public()
  @Get('list-products')
  @UsePipes(ValidationPipe)
  listProducts(){

  }

  @Public()
  @Get('product-details')
  @UsePipes(ValidationPipe)
  productDetails() {

  }

  @Delete('delete-product')
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  deleteProduct(){
    
  }

  

}
