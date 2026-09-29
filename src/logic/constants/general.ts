export const RESOLUTION = {
    WIDTH: 1024,
    HEIGHT: 768
} as const

export const PET_SIZE = {
    WIDTH: 300,
    HEIGHT: 300
}

export type PetSizeType = typeof PET_SIZE

export const DEFAULT_GAME_SPEED = 1200
export const DEFAULT_GAME_SPEED_COEF = 1
export const HOUR_IN_SECONDS = 3600
export const MONTH_IN_SECONDS = 2592000