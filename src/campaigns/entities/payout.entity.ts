import { Model } from 'objection';
import { Campaign } from './campaign.entity';

export class Payout extends Model {
  static tableName = 'payouts';

  // Properties in camelCase as they'll be used in your code
  id!: number;
  campaignId!: number;
  country!: string;
  amount!: number;
  currency!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  // Optional relation
  campaign?: Campaign;

  // Define the JSON schema for type validation
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['campaignId', 'country', 'amount', 'currency'],
      properties: {
        id: { type: 'integer' },
        campaignId: { type: 'integer' },
        country: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
        isActive: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Relationship definition using snake_case for database columns
  static get relationMappings() {
    return {
      campaign: {
        relation: Model.BelongsToOneRelation,
        modelClass: Campaign,
        join: {
          from: 'payouts.campaign_id', // Use snake_case here
          to: 'campaigns.id',
        },
      },
    };
  }

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
