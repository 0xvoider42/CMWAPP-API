import { Model } from 'objection';
import { Campaign } from './campaign.entity';

export class Payout extends Model {
  static tableName = 'payouts';

  // Properties in camelCase as they'll be used in your code
  id!: number;
  campaign_id!: number;
  country!: string;
  amount!: number;
  currency!: string;
  is_active!: boolean;
  created_at!: Date;
  updated_at!: Date;

  // Optional relation
  campaign?: Campaign;

  // Define the JSON schema for type validation
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['campaign_id', 'country', 'amount', 'currency'],
      properties: {
        id: { type: 'integer' },
        campaign_id: { type: 'integer' },
        country: { type: 'string' },
        amount: { type: 'number' },
        currency: { type: 'string' },
        is_active: { type: 'boolean', default: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
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
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
