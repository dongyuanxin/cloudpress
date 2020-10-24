import {
    IsInt,
    IsString,
    IsNumberString,
    IsNumber,
    IsOptional,
    Max,
    Min,
    IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchPassagesDto {
    @IsInt()
    @Min(1)
    readonly page: number;

    @IsInt()
    @Min(1)
    readonly size: number;

    @Transform(value => {
        return Array.isArray(value) ? value : [];
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly keywords: string[];
}
