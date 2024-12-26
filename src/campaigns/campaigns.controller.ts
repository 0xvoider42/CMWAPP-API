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

@Controller('campaigns')
@UseInterceptors(LoggingInterceptor)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateCampaignSchema))
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  async findAll(
    @Query('title') title?: string,
    @Query('landingPageUrl') landingPageUrl?: string,
    @Query('isRunning') isRunning?: boolean,
  ) {
    return this.campaignsService.findAll({
      title,
      landingPageUrl,
      isRunning,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe(UpdateCampaignSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Patch(':id/toggle')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.toggleStatus(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.delete(id);
  }
}
