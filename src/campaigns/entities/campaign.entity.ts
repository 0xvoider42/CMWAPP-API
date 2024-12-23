import { Model } from 'objection';
import { Payout } from './payout.entity';

export class Campaign extends Model {
  static tableName = 'campaigns';

  id: number;
  title: string;
  landing_page_url: string;
  is_running: boolean;
  description?: string;
  budget?: number;
  daily_budget?: number;
  created_at!: Date;
  updated_at!: Date;

  // Relationship with payouts
  payouts?: Payout[];

  static relationMappings = {
    payouts: {
      relation: Model.HasManyRelation,
      modelClass: Payout,
      join: {
        from: 'campaigns.id',
        to: 'payouts.campaign_id',
      },
    },
  };

  // Hooks for updating timestamps
  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
