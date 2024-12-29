import { Model } from 'objection';
import { Payout } from './payout.entity';

export class Campaign extends Model {
  static tableName = 'campaigns';

  // Properties in camelCase
  id!: number;
  title!: string;
  landing_page_url!: string;
  is_running!: boolean;
  description?: string;
  budget?: number;
  daily_budget?: number;
  created_at!: Date;
  updated_at!: Date;

  // Relationship property
  payouts?: Payout[];

  // JSON Schema for validation and type safety
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'landing_page_url', 'is_running'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1 },
        landing_page_url: { type: 'string', format: 'uri' },
        is_running: { type: 'boolean', default: false },
        description: { type: ['string', 'null'] },
        budget: { type: ['number', 'null'] },
        daily_budget: { type: ['number', 'null'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Relationship definition using snake_case for database columns
  static get relationMappings() {
    return {
      payouts: {
        relation: Model.HasManyRelation,
        modelClass: Payout,
        join: {
          from: 'campaigns.id',
          to: 'payouts.campaign_id',
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
