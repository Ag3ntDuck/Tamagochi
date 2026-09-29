export interface PetStats  {
    age: number
    loyalty: number
    satiety: number
    interest: number
    hygiene: number
    health: number
    mood: number
    energy: number
    [key: string]: number;
}

export type CoefChange = Partial<Record<keyof PetStats, number>>

export const DEFAULT_PET_STATS = {
    age: 0,
    loyalty: 50,
    satiety: 50,
    interest: 50,
    hygiene: 50,
    health: 100,
    mood: 50,
    energy: 100
} as const

export enum PetStates {
    idle = 0,
    sleep = 1,
    bath = 2,
    eat = 3,
    play = 4,
    sick = 5,
    appearance = 6,
    discomfort = 7,
    grow = 8,
    toilet = 9
}

export const NORMALIZE_DECAY_COEF = 10