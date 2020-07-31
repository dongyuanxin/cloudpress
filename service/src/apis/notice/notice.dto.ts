import {
    IsInt,
    IsString,
    IsNumberString,
    IsNumber,
    IsOptional,
    Max,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class DescribeNoticesDto {
    // 不论先后顺序，@Transform 都会先被调用
    @Transform(value => parseInt(value, 10))
    @IsInt()
    @Min(1)
    readonly startTime: number;

    @Transform(value => {
        value = parseInt(value, 10);
        return value > 100 ? 100 : value;
    })
    @IsOptional()
    @IsInt()
    @Max(100)
    @Min(1)
    readonly size = 5;
}
