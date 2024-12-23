import * as Joi from 'joi';

export class CreateCampaignDto {
  title: string;
  landingPageUrl: string;
  description?: string;
  budget?: number;
  dailyBudget?: number;
  payouts: Array<{
    country: string;
    amount: number;
    currency?: string;
  }>;
}

export const CreateCampaignSchema = Joi.object({
  title: Joi.string().required().min(3).max(255),
  landingPageUrl: Joi.string().required().uri(),
  description: Joi.string().optional(),
  budget: Joi.number().optional().min(0),
  dailyBudget: Joi.number().optional().min(0),
  payouts: Joi.array()
    .min(1)
    .items(
      Joi.object({
        country: Joi.string().required().length(2).uppercase(),
        amount: Joi.number().required().min(0),
        currency: Joi.string().length(3).uppercase().default('USD'),
      }),
    )
    .required(),
});
