import type {GamePayload} from "@/logic/constants/types.ts";
import {Background} from "@/logic/background.ts";
import type {Settings} from "@/logic/settings.ts";
import {Pet} from "@/logic/pet.ts";
import {PET_SIZE} from "@/logic/constants/general.ts";

export class Game {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    background: Background
    settings: Settings
    gameState: boolean
    pet: Pet
    imgArray: HTMLImageElement[]
    dinoImg: HTMLImageElement
    constructor({ctx, settings, backgroundImage, dinoImg}: GamePayload) {
        this.imgArray = backgroundImage
        this.dinoImg = dinoImg
        this.gameState = false
        this.ctx = ctx;
        this.settings = settings
        this.height = settings.height;
        this.width = settings.width;
        this.background = new Background({game: this})
        this.pet = new Pet(this, (this.width / 2 - PET_SIZE.WIDTH / 2), (this.height / 2.2), PET_SIZE.WIDTH, PET_SIZE.HEIGHT, this.dinoImg,)
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.background.draw(ctx)
        this.pet.draw(ctx)
    };
    update(deltaTime: number) {
        this.background.update(deltaTime)
        this.pet.update(deltaTime)
    };
    pause() {
        this.gameState = false
    }
    start() {
        this.gameState = true
    }

}