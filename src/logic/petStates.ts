import {PetStates} from "@/logic/constants/stats.ts";
import type {Pet} from "@/logic/pet.ts";
import {constructStateConfig, type StateConfig} from "@/logic/lib/petStates.util.ts";

export class PetState {
    state: PetStates
    pet: Pet
    dinoImg: HTMLImageElement
    currentPositionX: number
    currentPositionY: number
    config: StateConfig

    constructor(state: PetStates, pet: Pet, dinoImg: HTMLImageElement) {
        this.state = state
        this.pet = pet
        this.dinoImg = dinoImg
        this.config = constructStateConfig(this.state)
        this.currentPositionX = 1
        this.currentPositionY = this.config.positionY
    }

}

export class IdleState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.idle, pet, dinoImg)
    }
    enter() {
        this.pet.changeDecayCoef({loyalty: 10, satiety: 10, interest: 10, hygiene: 10, mood: 10})
    }

}
export class SleepState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.sleep, pet, dinoImg)
    }
    enter() {
        this.pet.changeIncreaseCoef({energy: 35})
        this.pet.changeDecayCoef({loyalty: 5, satiety: 5, interest: 5, hygiene: 5, mood: 5})
    }
}

export class BathState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.bath, pet, dinoImg)

    }
    enter() {
        this.pet.changeIncreaseCoef({hygiene: 35, health: 10, mood: 10})
        this.pet.changeDecayCoef({loyalty: 5, satiety: 5, interest: 5, energy: 10})
    }
}

export class EatState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.eat, pet, dinoImg)

    }
    enter() {
        this.pet.changeIncreaseCoef({satiety: 35, health: 10, mood: 10})
        this.pet.changeDecayCoef({loyalty: 5, interest: 5, mood: 5, hygiene: 5, energy: 10})

    }
}

export class PlayState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.play, pet, dinoImg)

    }
    enter() {
        this.pet.changeIncreaseCoef({loyalty: 35, interest: 35, mood: 10})
        this.pet.changeDecayCoef({energy: 10, satiety: 10, hygiene: 5})
    }
}

export class SickState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.sick, pet, dinoImg)

    }
    enter() {
        this.pet.changeDecayCoef({
            loyalty: 20,
            satiety: 20,
            interest: 20,
            hygiene: 20,
            mood: 20,
            energy: 15,
            health: 20})
    }
}

export class AppearanceState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.appearance, pet, dinoImg)

    }
    enter() {
        this.pet.changeDecayCoef({loyalty: 10, satiety: 10, interest: 10, hygiene: 10, mood: 10})
    }
}

export class DiscomfortState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.discomfort, pet, dinoImg)

    }
    enter() {
        this.pet.changeDecayCoef({loyalty: 15, satiety: 15, interest: 15, hygiene: 15, mood: 15, energy: 15, health: 15})
    }
}

export class GrowState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.grow, pet, dinoImg)

    }
    enter() {
        this.pet.dinoImg
    }
}


export class ToiletState extends PetState {
    constructor(pet: Pet, dinoImg: HTMLImageElement) {
        super(PetStates.toilet, pet, dinoImg)

    }
    enter() {
        this.pet.changeIncreaseCoef({hygiene: 35, mood: 10})
        this.pet.changeDecayCoef({loyalty: 5, interest: 5, mood: 5, hygiene: 5, energy: 10})
    }
}

//доделать