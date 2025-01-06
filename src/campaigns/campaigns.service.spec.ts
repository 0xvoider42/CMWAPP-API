import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { Payout } from './entities/payout.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';

const moduleMocker = new ModuleMocker(global);

describe('CampaignsService', () => {
  let service: CampaignsService;
  let mockTransaction: jest.Mock;
  let mockCampaignQuery: jest.Mock;
  let mockPayoutQuery: jest.Mock;

  const mockCampaign = {
    id: 1,
    title: 'Test Campaign',
    landing_page_url: 'http://test.com',
    description: 'Test description',
    budget: 1000,
    daily_budget: 100,
    is_running: false,
    payouts: [
      { id: 1, campaign_id: 1, amount: 50 },
      { id: 2, campaign_id: 1, amount: 30 },
    ],
  };

  beforeEach(async () => {
    mockTransaction = jest.fn();
    mockCampaignQuery = jest.fn();
    mockPayoutQuery = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignsService],
    })
      .useMocker((token) => {
        if (token === Campaign || token === Payout) {
          return {
            query: jest.fn().mockReturnThis(),
            knex: () => ({ transaction: mockTransaction }),
            findById: jest.fn(),
            insert: jest.fn(),
            patch: jest.fn(),
            patchAndFetchById: jest.fn(),
            delete: jest.fn(),
            deleteById: jest.fn(),
            withGraphFetched: jest.fn(),
            where: jest.fn(),
            select: jest.fn(),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<CampaignsService>(CampaignsService);

    // Mock Campaign and Payout static methods
    jest.spyOn(Campaign, 'query').mockImplementation(mockCampaignQuery);
    jest.spyOn(Payout, 'query').mockImplementation(mockPayoutQuery);
    jest.spyOn(Campaign, 'knex').mockReturnValue({
      transaction: mockTransaction,
      VERSION: '1.0.0',
      __knex__: {},
      raw: jest.fn(),
      transactionProvider: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateCampaignDto = {
      title: 'Test Campaign',
      landingPageUrl: 'http://test.com',
      description: 'Test description',
      budget: 1000,
      dailyBudget: 100,
      payouts: [
        { amount: 50, country: 'US' },
        { amount: 30, country: 'US' },
      ],
    };

    it('should successfully create a campaign with payouts', async () => {
      mockTransaction.mockImplementation((fn) => fn());
      const mockQueryBuilder = {
        insert: jest.fn().mockResolvedValue({ id: 1 }),
        findById: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockResolvedValue(mockCampaign),
      };
      mockCampaignQuery.mockReturnValue(mockQueryBuilder);
      mockPayoutQuery.mockReturnValue({
        insert: jest.fn().mockResolvedValue([]),
      });

      const result = await service.create(createDto, 1);

      expect(result).toEqual(mockCampaign);
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCampaignQuery).toHaveBeenCalled();
      expect(mockPayoutQuery).toHaveBeenCalled();
    });

    it('should throw an error if campaign creation fails', async () => {
      mockTransaction.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto, 1)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all campaigns', async () => {
      const mockCampaigns = [mockCampaign];
      mockCampaignQuery.mockReturnValue({
        withGraphFetched: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockCampaigns),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockCampaigns);
      expect(mockCampaignQuery).toHaveBeenCalled();
    });

    it('should filter campaigns by search parameters', async () => {
      const search = {
        title: 'Test',
        landing_page_url: 'test.com',
        is_running: true,
      };

      const mockQueryBuilder = {
        withGraphFetched: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      };

      mockCampaignQuery.mockReturnValueOnce(mockQueryBuilder);

      const wherePromise = Promise.resolve([mockCampaign]);
      mockQueryBuilder.where.mockReturnValueOnce(mockQueryBuilder);
      mockQueryBuilder.where.mockReturnValueOnce(mockQueryBuilder);
      mockQueryBuilder.where.mockReturnValueOnce(wherePromise);

      const result = await service.findAll(search);

      expect(result).toEqual([mockCampaign]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'title',
        'ilike',
        '%Test%',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'landing_page_url',
        'ilike',
        '%test.com%',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('is_running', true);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOne', () => {
    it('should return a campaign by id', async () => {
      mockCampaignQuery.mockReturnValue({
        findById: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockResolvedValue(mockCampaign),
      });

      const result = await service.findOne(1);

      expect(result).toEqual(mockCampaign);
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockCampaignQuery.mockReturnValue({
        findById: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle campaign status', async () => {
      const updatedCampaign = { ...mockCampaign, is_running: true };
      mockCampaignQuery.mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockCampaign),
        patchAndFetchById: jest.fn().mockReturnThis(),
        withGraphFetched: jest.fn().mockResolvedValue(updatedCampaign),
      });

      const result = await service.toggleStatus(1);

      expect(result).toEqual(updatedCampaign);
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockCampaignQuery.mockReturnValue({
        findById: jest.fn().mockResolvedValue(null),
      });

      await expect(service.toggleStatus(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
