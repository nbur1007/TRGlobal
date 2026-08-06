import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Public } from './guards/public.decorator';
import { StrictThrottle } from '../common/decorators/custom-throttler.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @StrictThrottle()
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return this.authService.login(req.user as any);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
