import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'objection';
import * as Knex from 'knex';

import { CampaignsModule } from './campaigns/campaigns.module';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
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
