import type {Game} from "@/logic/game.ts";
import {DEFAULT_GAME_SPEED} from "@/logic/constants/general.ts";
interface LayerArgs {
    height: number
    width: number
    img: CanvasImageSource | null
    game: Game
}

export class Layer {
    height: number
    width: number
    x: number
    y: number
    img: CanvasImageSource | null
    game: Game
    constructor({height, width, img, game}: LayerArgs) {
        this.height = height
        this.width = width
        this.x = 0
        this.y = 0
        this.img = img
        this.game = game

    }
    draw(ctx: CanvasRenderingContext2D) {
        if (!this.img) return
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)

    }
    update() {

    }

}

export class Background {
    height: number
    width: number
    game: Game
    imgArray: HTMLImageElement[]
    backgroundLayers: Layer[]
    currentBg: Layer
    frameTimer: number
    frameInterval: number
    animationSpeed: number
    constructor({game}:{game: Game}) {
        this.game = game
        this.imgArray = this.game.imgArray
        this.width = this.game.settings.width
        this.height = this.game.settings.height
        this.backgroundLayers = this.imgArray.map((img: HTMLImageElement) => new Layer(
            {height: this.height, width: this.width, img: img, game: this.game}
        ))
        this.currentBg = this.backgroundLayers[0] as Layer
        this.animationSpeed = DEFAULT_GAME_SPEED
        this.frameTimer = 0
        this.frameInterval = 1000 / this.animationSpeed
        

    }

    draw(ctx: CanvasRenderingContext2D) {
        this.currentBg.draw(ctx)
    }

    update(deltaTime: number) {
        this.backgroundLayers.forEach((layer) => {
            layer.update()
        })

        this.updateFrame(deltaTime)

    }

    updateFrame(deltaTime: number) {
        if (this.frameInterval < this.frameTimer) {
            this.frameTimer = 0
            this.changeBackgroundByTime()

        } else {
            this.frameTimer += deltaTime

        }
    }

    changeBackgroundByTime() {
        const timeClient = new Date().getHours()
        if (timeClient >= 0 && timeClient <= 6) {
            this.currentBg = this.backgroundLayers[3] as Layer
        }
        if (timeClient >= 7 && timeClient <= 12) {
            this.currentBg = this.backgroundLayers[2] as Layer
        }
        if (timeClient >= 13 && timeClient <= 17) {
            this.currentBg = this.backgroundLayers[1] as Layer
        }
        if (timeClient >= 18 && timeClient <= 23) {
            this.currentBg = this.backgroundLayers[0] as Layer
        }
    }

}