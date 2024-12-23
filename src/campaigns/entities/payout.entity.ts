import { Model } from 'objection';
import { Campaign } from './campaign.entity';

export class Payout extends Model {
  static tableName = 'payouts';

  id: number;
  campaign_id: number;
  country: string;
  amount: number;
  currency: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;

  // Relationship with campaign
  campaign?: Campaign;

  static relationMappings = {
    campaign: {
      relation: Model.BelongsToOneRelation,
      modelClass: Campaign,
      join: {
        from: 'payouts.campaign_id',
        to: 'campaigns.id',
      },
    },
  };

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
