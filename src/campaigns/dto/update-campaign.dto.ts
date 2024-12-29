import * as Joi from 'joi';

export class UpdateCampaignDto {
  title?: string;
  landing_page_url?: string;
  is_running?: boolean;
  description?: string;
  budget?: number;
  daily_budget?: number;
  payouts?: Array<{
    country: string;
    amount: number;
    currency?: string;
  }>;
}

export const UpdateCampaignSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  landingPageUrl: Joi.string().uri(),
  isRunning: Joi.boolean(),
  description: Joi.string(),
  budget: Joi.number().min(0),
  dailyBudget: Joi.number().min(0),
  payouts: Joi.array().items(
    Joi.object({
      country: Joi.string().length(2).uppercase(),
      amount: Joi.number().min(0),
      currency: Joi.string().length(3).uppercase().default('USD'),
    }),
  ),
}).min(1);
