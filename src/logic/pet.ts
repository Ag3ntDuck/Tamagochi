import type {Game} from "@/logic/game.ts";
import {
    type CoefChange,
    DEFAULT_PET_STATS,
    NORMALIZE_DECAY_COEF,
    type PetStats
} from "@/logic/constants/stats.ts";
import {IdleState} from "@/logic/petStates.ts";
import {constructStates, type State} from "@/logic/lib/petStates.util.ts";
import {
    DEFAULT_GAME_SPEED,
    DEFAULT_GAME_SPEED_COEF,
    HOUR_IN_SECONDS,
    MONTH_IN_SECONDS
} from "@/logic/constants/general.ts";
import {Events} from "@/logic/events.ts";
import {testing} from "@/logic/lib/events.utils.ts";


export class Pet {
    game: Game
    coords: { x: number, y: number, width: number, height: number }
    stats: PetStats
    currentState: State
    states: State[]
    animationSpeed: number
    frameTimer: number
    frameInterval: number
    dinoImg: HTMLImageElement
    decayCoef: number
    decayCoefObj: CoefChange
    increaseCoefObj: CoefChange
    isBusy: boolean
    timerForAction: number
    statsSpeed: number
    statsInterval: number
    statsTimer: number
    randomEventTimer: number
    randomEventInterval: number
    newEvent: Events
    currentEvent: Events
    isTrueOrNot: boolean
    constructor(game: Game, x: number, y: number, width: number, height: number, dinoImg: HTMLImageElement) {
        this.isTrueOrNot = false
        this.randomEventTimer = 0
        this.randomEventInterval = 0
        this.increaseCoefObj = {}
        this.decayCoefObj = {}
        this.decayCoef = 0
        this.animationSpeed = DEFAULT_GAME_SPEED
        this.frameTimer = 0
        this.frameInterval = 1000 / this.animationSpeed
        this.game = game
        this.coords = {x, y, width, height}
        this.stats = DEFAULT_PET_STATS
        this.dinoImg = dinoImg
        this.states = constructStates(this, dinoImg)
        this.currentState = this.states[0] ?? new IdleState(this, dinoImg as HTMLImageElement)
        this.newEvent = new Events()
        this.currentEvent = this.newEvent
        this.dinoImg = this.currentState.dinoImg
        this.isBusy = false
        this.timerForAction = 30
        this.statsSpeed = DEFAULT_GAME_SPEED_COEF * DEFAULT_GAME_SPEED
        this.statsTimer = 0
        this.statsInterval = 1000 / this.statsSpeed

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.dinoImg,
            ((this.currentState.currentPositionX - 1) * this.currentState.config.frameSize.WIDTH),
            ((this.currentState.currentPositionY - 1) * this.currentState.config.frameSize.HEIGHT),
            this.currentState.config.frameSize.WIDTH,
            this.currentState.config.frameSize.HEIGHT,
            this.coords.x,
            this.coords.y,
            this.coords.width,
            this.coords.height
        )



    }

    update(deltaTime: number) {
        this.updateFrame(deltaTime)
        this.updateStats(deltaTime)
        this.updateAge(deltaTime)

    }


    updateFrame(deltaTime: number) {
        if (this.frameInterval < this.frameTimer) {
            this.frameTimer = 0
            this.animate()
            this.updateRandomEvent()
        } else {
            this.frameTimer += deltaTime
        }
    }

    updateStats(deltaTime: number) {
        if (this.statsInterval < this.statsTimer) {
            this.statsTimer = 0
            this.petDecayInGame(deltaTime)
            this.petIncreaseInGame(deltaTime)
            this.changeStateByDecay()
        } else {
            this.statsTimer += deltaTime

        }
    }

    updateAge(deltaTime: number) {
        this.stats.age += deltaTime
        if (this.stats.age >= MONTH_IN_SECONDS) {
            this.resetModifiersAndSetState(8)
            this.updateSpeed()
            this.currentState.enter()
        }
    }

    updateRandomEvent() {
        if (this.randomEventTimer === this.randomEventInterval) {
            let y = Math.floor(Math.random() * (120 - 30) + 30)
            this.randomEventTimer = y
            this.randomEventInterval = 0
            let rand = Math.floor(Math.random() * (0 - 3) + 3)
            this.newEvent.createEvent(testing, rand)
            this.currentEvent = this.newEvent
            this.isTrueOrNot = true
        }
        this.randomEventInterval++
    }



    animate() {

        if (this.currentState.currentPositionX < this.currentState.config.frameLimit) {
            this.currentState.currentPositionX++
        } else {
            this.currentState.currentPositionX = 1
        }

    }

    petDecayInactive() {
            this.stats.energy += 10
            this.stats.health -= 5
            this.stats.hygiene -= 10
            this.stats.mood -= 10
            this.stats.interest -= 10
            this.stats.loyalty -= 5
            this.stats.satiety -= 10
    }


    petDecayInGame(deltaTime: number) {
        for (const key of Object.keys(this.decayCoefObj) as (keyof PetStats)[]) {
            const coef = this.decayCoefObj[key]

            if (coef === undefined) continue

            const currentValue = this.stats[key]

            if (currentValue === undefined) continue

            const newValue = currentValue - Number(
                (coef * deltaTime * NORMALIZE_DECAY_COEF).toFixed(3)
            )

            this.stats[key] = newValue <= 0 ? 0 : newValue
        }
    }



    petIncreaseInGame(deltaTime: number) {
        for (const key of Object.keys(this.increaseCoefObj) as (keyof PetStats)[]) {
            const coef = this.increaseCoefObj[key]

            if (coef === undefined) continue

            const currentValue = this.stats[key]

            if (currentValue === undefined) continue

            const newValue = currentValue + Number(
                (coef * deltaTime * NORMALIZE_DECAY_COEF).toFixed(3)
            )

            this.stats[key] = newValue >= 100 ? 100 : newValue
        }
    }


    changeIncreaseCoef(coef: CoefChange) {
        this.increaseCoefObj = coef
    }

    changeDecayCoef(coef: CoefChange) {
        this.decayCoefObj = coef
    }

    userAction(state: number) {
        this.currentState = this.states[state] ?? new IdleState(this, this.dinoImg as HTMLImageElement)
        this.currentState.enter()
        this.updateSpeed()
        this.isBusy = true
        this.timerForAction = 10
    }

    changeStateByDecay() {
        if (this.isBusy) {

            if (this.timerForAction > 0) {
                this.timerForAction -= 1
            } else if (this.timerForAction <= 0) {
                this.isBusy = false
            }
        }
        if (!this.isBusy) {
            if (this.stats.health <= 40) {
                this.resetModifiersAndSetState(5)
                this.updateSpeed()
                this.currentState.enter()
            } else if (
                this.stats.hygiene <= 40 ||
                this.stats.satiety <= 40 ||
                this.stats.mood <= 40 ||
                this.stats.loyalty <= 40 ||
                this.stats.interest <= 40 ||
                this.stats.mood <= 40 ||
                this.stats.energy <= 40
            ) {
                this.resetModifiersAndSetState(7)
                this.updateSpeed()
                this.currentState.enter()
            } else {
                this.resetModifiersAndSetState(0)
                this.updateSpeed()
                this.currentState.enter()
            }

        }
    }

    resetModifiersAndSetState(i: number) {
        this.increaseCoefObj = {}
        this.decayCoefObj = {}
        this.currentState = this.states[i] ?? new IdleState(this, this.dinoImg as HTMLImageElement)
    }

    updateSpeed() {
        this.animationSpeed = this.currentState.config.speedCoef * DEFAULT_GAME_SPEED
        this.statsInterval = 1000 / this.statsSpeed
        this.frameInterval = 1000 / this.animationSpeed
    }


}