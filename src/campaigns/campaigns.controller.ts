import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UsePipes,
  UseInterceptors,
  ParseIntPipe,
  Delete,
  Headers,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto,
  CreateCampaignSchema,
} from './dto/create-campaign.dto';
import {
  UpdateCampaignDto,
  UpdateCampaignSchema,
} from './dto/update-campaign.dto';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('campaigns')
@UseInterceptors(LoggingInterceptor)
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private configService: ConfigService,
  ) {}

  @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  @UsePipes(new JoiValidationPipe(CreateCampaignSchema))
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    ) as unknown as {
      sub: number;
      role: UserRole;
      email: string;
    };

    console.log('DECODED', decoded);
    return this.campaignsService.create(createCampaignDto, decoded.sub);
  }

  @Get()
  async findAll(
    @Headers('authorization') authHeader: string,
    @Query('title') title?: string,
    @Query('landingPageUrl') landing_page_url?: string,
    @Query('isRunning') is_running?: boolean,
  ) {
    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    ) as unknown as {
      sub: number;
      role: UserRole;
      email: string;
    };

    return this.campaignsService.findAll({
      title,
      landing_page_url,
      is_running,
      user_id: decoded.sub,
    });
  }

  @Get('stats')
  async getStats() {
    return this.campaignsService.getStats();
  }

  @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    ) as unknown as {
      sub: number;
      role: UserRole;
      email: string;
    };

    const user_id = decoded.role === UserRole.ADMIN ? undefined : decoded.sub;

    return this.campaignsService.findOne(id, user_id);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  @UsePipes(new JoiValidationPipe(UpdateCampaignSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    ) as unknown as {
      sub: number;
      role: UserRole;
      email: string;
    };

    return this.campaignsService.update(id, updateCampaignDto, decoded.sub);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id/toggle')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.toggleStatus(id);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    ) as unknown as {
      sub: number;
      role: UserRole;
      email: string;
    };

    return this.campaignsService.delete(id, decoded.sub);
  }
}
