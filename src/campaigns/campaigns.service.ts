import { Injectable, NotFoundException } from '@nestjs/common';
import { transaction } from 'objection';
import { Campaign } from './entities/campaign.entity';
import { Payout } from './entities/payout.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import pino from 'pino';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  private logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    try {
      const result = await transaction(Campaign.knex(), async (trx) => {
        // Create campaign
        const campaign = await Campaign.query(trx).insert({
          title: createCampaignDto.title,
          landing_page_url: createCampaignDto.landingPageUrl,
          description: createCampaignDto.description,
          budget: createCampaignDto.budget,
          daily_budget: createCampaignDto.dailyBudget,
          is_running: false,
        });

        // Create payouts
        const payouts = createCampaignDto.payouts.map((payout) => ({
          campaign_id: campaign.id,
          ...payout,
        }));

        await Payout.query(trx).insert(payouts);

        // Return campaign with payouts
        return Campaign.query(trx)
          .findById(campaign.id)
          .withGraphFetched('payouts');
      });

      this.logger.info(
        { campaign_id: result.id },
        'Campaign created successfully',
      );

      return result;
    } catch (error) {
      this.logger.error(error, 'Failed to create campaign');
      throw error;
    }
  }

  async findAll(search?: {
    title?: string;
    landing_page_url?: string;
    is_running?: boolean;
  }): Promise<Campaign[]> {
    try {
      let query = Campaign.query()
        .withGraphFetched('payouts')
        .select([
          'id',
          'title',
          'landing_page_url as landingPageUrl',
          'is_running as isRunning',
          'created_at as created_at',
        ]);

      if (search?.title) {
        query = query.where('title', 'ilike', `%${search.title}%`);
      }
      if (search?.landing_page_url) {
        query = query.where(
          'landing_page_url',
          'ilike',
          `%${search.landing_page_url}%`,
        );
      }
      if (search?.is_running !== undefined) {
        query = query.where('is_running', search.is_running);
      }

      const campaigns = await query;
      this.logger.info(`Found ${campaigns.length} campaigns`);

      return campaigns;
    } catch (error) {
      this.logger.error(error, 'Failed to fetch campaigns');

      throw error;
    }
  }

  async findOne(id: number): Promise<Campaign> {
    try {
      const campaign = await Campaign.query()
        .findById(id)
        .select([
          'id',
          'title',
          'landing_page_url as landingPageUrl',
          'is_running as isRunning',
          'description',
          'budget',
          'daily_budget as dailyBudget',
          'created_at as created_at',
          'updated_at as updatedAt',
        ])
        .withGraphFetched('payouts');

      if (!campaign) {
        this.logger.warn({ campaign_id: id }, 'Campaign not found');
        throw new NotFoundException(`Campaign with ID ${id} not found`);
      }

      this.logger.info({ campaign_id: id }, 'Campaign found');
      return campaign;
    } catch (error) {
      this.logger.error(error, 'Failed to fetch campaign');
      throw error;
    }
  }

  async update(
    id: number,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    try {
      const result = await transaction(Campaign.knex(), async (trx) => {
        const campaign = await Campaign.query(trx).findById(id);
        if (!campaign) {
          throw new NotFoundException(`Campaign with ID ${id} not found`);
        }

        await Campaign.query(trx).findById(id).patch({
          title: updateCampaignDto.title,
          landing_page_url: updateCampaignDto.landing_page_url,
          is_running: updateCampaignDto.is_running,
          description: updateCampaignDto.description,
          budget: updateCampaignDto.budget,
          daily_budget: updateCampaignDto.daily_budget,
        });

        // Update payouts if provided
        if (updateCampaignDto.payouts) {
          // Delete existing payouts
          await Payout.query(trx).where('campaign_id', id).delete();

          // Create new payouts
          const payouts = updateCampaignDto.payouts.map((payout) => ({
            campaign_id: id,
            ...payout,
          }));
          await Payout.query(trx).insert(payouts);
        }

        return Campaign.query(trx).findById(id).withGraphFetched('payouts');
      });

      this.logger.info({ campaign_id: id }, 'Campaign updated successfully');
      return result;
    } catch (error) {
      this.logger.error(error, 'Failed to update campaign');
      throw error;
    }
  }

  async toggleStatus(id: number): Promise<Campaign> {
    try {
      const campaign = await Campaign.query().findById(id);

      if (!campaign) {
        this.logger.warn({ campaign_id: id }, 'Campaign not found');
        throw new NotFoundException(`Campaign with ID ${id} not found`);
      }

      const updatedCampaign = await Campaign.query()
        .patchAndFetchById(id, {
          is_running: !campaign.is_running,
        })
        .withGraphFetched('payouts');

      this.logger.info(
        { campaign_id: id, status: updatedCampaign.is_running },
        'Campaign status toggled',
      );

      return updatedCampaign;
    } catch (error) {
      this.logger.error(error, 'Failed to toggle campaign status');
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await transaction(Campaign.knex(), async (trx) => {
        const campaign = await Campaign.query(trx).findById(id);

        if (!campaign) {
          throw new NotFoundException(`Campaign with ID ${id} not found`);
        }

        await Payout.query(trx).where('campaign_id', id).delete();
        await Campaign.query(trx).deleteById(id);
      });
      this.logger.info({ campaign_id: id }, 'Campaign deleted successfully');
    } catch (error) {
      this.logger.error(error, 'Failed to delete campaign');
      throw error;
    }
  }
}
