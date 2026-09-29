import {RESOLUTION} from "@/logic/constants/general.ts";
import {Game} from "@/logic/game.ts";
import {Settings} from "@/logic/settings.ts";


export const initGame = () => {

    const canvas = document.querySelector('canvas');
    if (!canvas) {
        alert('no canvas')
        console.error(canvas)
        return null
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        alert('no ctx')
        console.error(ctx)
        return;
    }

    canvas.width = RESOLUTION.WIDTH
    canvas.height = RESOLUTION.HEIGHT
    const bgDawn = document.getElementById('dawn')
    const bgDay = document.getElementById('day')
    const bgDusk = document.getElementById('dusk')
    const bgNight = document.getElementById('night')
    const dinoImg = document.getElementById('dinoSmall') as HTMLImageElement
    const backgroundImage = [bgDusk, bgDay, bgDawn, bgNight] as HTMLImageElement[];
    const settings = new Settings()
    const game = new Game({ctx, settings, backgroundImage, dinoImg})
    let lastTime = 0

    function animate(timeStamp: number) {
        const deltaTime = (timeStamp - lastTime) / 1000

        if (!ctx) {
            console.error(ctx)
            return
        }
        if (game.gameState) {
            game.draw(ctx)
            game.update(deltaTime)
        }

        lastTime = timeStamp
        requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
    return game
}



