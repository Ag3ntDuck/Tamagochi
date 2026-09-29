import type {Settings} from "@/logic/settings.ts";

export interface GamePayload {
    ctx: CanvasRenderingContext2D
    settings: Settings
    backgroundImage: HTMLImageElement[]
    dinoImg: HTMLImageElement
}