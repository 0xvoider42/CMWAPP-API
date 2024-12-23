import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CampaignsModule } from './campaigns/campaigns.module';
import { Model } from 'objection';
import * as Knex from 'knex';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CampaignsModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    const knex = Knex(this.configService.get('config.database')!);

    Model.knex(knex);
  }
}
