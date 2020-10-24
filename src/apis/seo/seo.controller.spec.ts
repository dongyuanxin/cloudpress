import { Test, TestingModule } from '@nestjs/testing';
import { SeoController } from './seo.controller';

describe('Seo Controller', () => {
    let controller: SeoController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeoController],
        }).compile();

        controller = module.get<SeoController>(SeoController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
