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
} from '@nestjs/common';

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
  constructor(private readonly campaignsService: CampaignsService) {}

  @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  @UsePipes(new JoiValidationPipe(CreateCampaignSchema))
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  async findAll(
    @Query('title') title?: string,
    @Query('landingPageUrl') landing_page_url?: string,
    @Query('isRunning') is_running?: boolean,
  ) {
    return this.campaignsService.findAll({
      title,
      landing_page_url,
      is_running,
    });
  }

  @Get('stats')
  async getStats() {
    return this.campaignsService.getStats();
  }

  @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.findOne(id);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  @UsePipes(new JoiValidationPipe(UpdateCampaignSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id/toggle')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.toggleStatus(id);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.delete(id);
  }
}
