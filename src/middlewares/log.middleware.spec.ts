import { LogMiddleware } from './log.middleware';

describe('LogMiddleware', () => {
    it('should be defined', () => {
        expect(new LogMiddleware()).toBeDefined();
    });
});
