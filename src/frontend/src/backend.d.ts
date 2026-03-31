import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type BallType = {
    __kind__: "noBall";
    noBall: null;
} | {
    __kind__: "wicket";
    wicket: null;
} | {
    __kind__: "runs";
    runs: bigint;
} | {
    __kind__: "wide";
    wide: null;
};
export interface CreateMatchArgs {
    totalOvers: bigint;
    team2Name: string;
    team1Name: string;
}
export interface Match {
    status: MatchStatus;
    wickets1: bigint;
    wickets2: bigint;
    totalOvers: bigint;
    currentBowler: string;
    team2Name: string;
    isFirstInning: boolean;
    matchResult?: MatchResult;
    ballsBowled: bigint;
    balls: Array<Ball>;
    requiredRunRate?: number;
    currentBatsmen: [string, string];
    runRate: number;
    team1Name: string;
    sixesCount: bigint;
}
export interface Ball {
    ballType: BallType;
    bowler: string;
    batsman: string;
}
export enum MatchResult {
    draw = "draw",
    tied = "tied",
    team1Won = "team1Won",
    team2Won = "team2Won"
}
export enum MatchStatus {
    completed = "completed",
    ongoing = "ongoing"
}
export interface backendInterface {
    createMatch(args: CreateMatchArgs): Promise<bigint>;
    getAllMatches(): Promise<Array<Match>>;
    getMatch(id: bigint): Promise<Match>;
}
