import {
    IsInt,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class DescribePassageByIdDto {
    @IsString()
    readonly passageId: string;
}

export class DescribePassagesDto {
    @Transform(value => parseInt(value, 10))
    @IsInt()
    @Min(1)
    @Max(100)
    readonly limit: number;

    @Transform(value => parseInt(value, 10))
    @IsInt()
    @Min(1)
    readonly page: number;
}
