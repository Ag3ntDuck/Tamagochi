import { RESOLUTION } from "@/logic/constants/general.ts";

export class Settings {
    width: number
    height: number
    constructor() {
        this.width = RESOLUTION.WIDTH
        this.height = RESOLUTION.HEIGHT


    }
}