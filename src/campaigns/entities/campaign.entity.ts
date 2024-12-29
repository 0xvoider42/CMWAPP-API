import { Model } from 'objection';
import { Payout } from './payout.entity';

export class Campaign extends Model {
  static tableName = 'campaigns';

  // Properties in camelCase
  id!: number;
  title!: string;
  landingPageUrl!: string;
  isRunning!: boolean;
  description?: string;
  budget?: number;
  dailyBudget?: number;
  createdAt!: Date;
  updatedAt!: Date;

  // Relationship property
  payouts?: Payout[];

  // JSON Schema for validation and type safety
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'landingPageUrl', 'isRunning'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1 },
        landingPageUrl: { type: 'string', format: 'uri' },
        isRunning: { type: 'boolean', default: false },
        description: { type: ['string', 'null'] },
        budget: { type: ['number', 'null'] },
        dailyBudget: { type: ['number', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
          to: 'payouts.campaign_id', // Use snake_case here
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
