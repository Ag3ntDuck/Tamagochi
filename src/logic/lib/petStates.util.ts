import type {Pet} from "@/logic/pet.ts";
import {
    AppearanceState,
    BathState,
    DiscomfortState,
    EatState,
    GrowState,
    IdleState,
    PlayState,
    SickState,
    SleepState,
    ToiletState
} from "@/logic/petStates.ts";
import  {PetStates} from "@/logic/constants/stats.ts";
import {PET_SIZE, type PetSizeType} from "@/logic/constants/general.ts";


export type State =
    IdleState
    | SleepState
    | BathState
    | EatState
    | PlayState
    | SickState
    | AppearanceState
    | DiscomfortState
    | GrowState
    | ToiletState

export const constructStates = (pet: Pet, img: HTMLImageElement): State[] => {
    const output = [
        new IdleState(pet, img),
        new SleepState(pet, img as HTMLImageElement),
        new BathState(pet, img as HTMLImageElement),
        new EatState(pet, img as HTMLImageElement),
        new PlayState(pet, img as HTMLImageElement),
        new SickState(pet, img as HTMLImageElement),
        new AppearanceState(pet, img as HTMLImageElement),
        new DiscomfortState(pet, img as HTMLImageElement),
        new GrowState(pet, img as HTMLImageElement),
        new ToiletState(pet, img as HTMLImageElement)
    ]
    return output
}

export type StateConfig = {
    positionY: number,
    frameLimit: number,
    frameSize: PetSizeType,
    speedCoef: number
}

export const constructStateConfig = (state: PetStates): StateConfig => {

    switch (state) {
        case PetStates.idle: return {positionY: 1, frameLimit: 2, frameSize: PET_SIZE, speedCoef: 2}
        case PetStates.sleep: return {positionY: 2, frameLimit: 2, frameSize: PET_SIZE,  speedCoef: 2}
        case PetStates.bath: return {positionY: 3, frameLimit: 2, frameSize: PET_SIZE,  speedCoef: 1}
        case PetStates.eat: return {positionY: 4, frameLimit: 8, frameSize: PET_SIZE,  speedCoef: 1}
        case PetStates.play: return {positionY: 5, frameLimit: 9, frameSize: PET_SIZE,  speedCoef: 4}
        case PetStates.sick: return {positionY: 6, frameLimit: 2, frameSize: PET_SIZE,  speedCoef: 1}
        case PetStates.appearance: return {positionY: 7, frameLimit: 11, frameSize: PET_SIZE,  speedCoef: 2}
        case PetStates.discomfort: return {positionY: 8, frameLimit: 2, frameSize: PET_SIZE,  speedCoef: 2}
        case PetStates.grow: return {positionY: 9, frameLimit: 13, frameSize: PET_SIZE,  speedCoef: 2}
        case PetStates.toilet: return {positionY: 10, frameLimit: 6, frameSize: PET_SIZE,  speedCoef: 3}
        default: return {positionY: 1, frameLimit: 2, frameSize: PET_SIZE,  speedCoef: 1}

    }
}

//привести в порядок щит done,
// порядок массивов итд done,
// почистить код от хрени
//
// гниение к апдейту итд

