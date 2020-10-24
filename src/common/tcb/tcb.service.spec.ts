import { Test, TestingModule } from '@nestjs/testing';
import { TcbService } from './tcb.service';

describe('TcbService', () => {
    let service: TcbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TcbService],
        }).compile();

        service = module.get<TcbService>(TcbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
