import { Context, Schema } from 'koishi';
export declare const name = "russian-roulette";
export interface Config {
}
export declare const Config: Schema<Config>;
declare module 'koishi' {
    interface Tables {
        russian_roulette_table: russian_roulette_table;
    }
}
export interface russian_roulette_table {
    id: number;
    clip: string[];
    channel: string;
    time: any;
}
export declare function apply(ctx: Context): void;
