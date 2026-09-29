<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, onUnmounted, type Ref, ref, type ShallowRef, shallowRef} from "vue";
import {initGame} from "@/logic";


import type {Game} from '@/logic/game.ts';
import type {PetStats} from "@/logic/constants/stats.ts";
import {HOUR_IN_SECONDS} from "@/logic/constants/general.ts";

let game: Game | null | undefined = undefined


const statsObj = ref<PetStats>({} as PetStats)
let placheolder = [['ты нашел 3', [{hygiene: -10, mood: +10}, {satiety: +10, energy: -10}]]]
let someevent = ref(placheolder)
let isTrueOrNot = ref(false)
const get = () => {
  if (game === null || game === undefined) return
  if (!game?.pet?.stats) return
  statsObj.value = {...game.pet.stats}
  isTrueOrNot.value = game.pet.isTrueOrNot
  someevent.value = [game.pet.currentEvent.description, game.pet.currentEvent.statVariants]
  requestAnimationFrame(get)
}


const changeStats = (i: number) => {
  console.log(someevent.value[0])
  let stats: Record<string, number>[] = someevent.value[1]
  isTrueOrNot.value = false
  if (stats[i])
    for (const [key, value] of Object.entries(stats[i])) {
      if (value < 0) {
        if (game!.pet.stats[key])
          game!.pet.stats[key] -= Math.abs(value)
          game!.pet.isTrueOrNot = false
      } else {
        if (game!.pet.stats[key])
          game!.pet.stats[key] += value
          game!.pet.isTrueOrNot = false
      }

    }
}

//до принципа я додумалась сама, а вот до реализации (а именно компьютед) - нет
const statGradient = (key: keyof PetStats) => computed(() => {
  const value = statsObj.value?.[key] ?? 0

  if (value >= 90) {
    return `radial-gradient(closest-side, white 79%, transparent 80% 100%),  conic-gradient(#4D852C ${value}%, white 0)`
  } else if (value >= 60) {
    return `radial-gradient(closest-side, white 79%, transparent 80% 100%),  conic-gradient(#ADCE43 ${value}%, white 0)`
  } else if (value >= 20) {
    return `radial-gradient(closest-side, white 79%, transparent 80% 100%),  conic-gradient(#FF7575 ${value}%, white 0)`
  } else if (value >= 0) {
    return `radial-gradient(closest-side, white 79%, transparent 80% 100%),  conic-gradient(red ${value}%, white 0)`
  }

})


onMounted(() => {
  requestAnimationFrame(get)
  game = initGame();
  const now = new Date().getTime()
  let stats = localStorage.getItem('stats')
  let lastTime = localStorage.getItem('lastTime')
  if (stats === null || lastTime === null || !game) return
  game.pet.stats = JSON.parse(stats)
});

const gameHandler = () => {
  const start = () => {
    if (game === null || game === undefined) return
    game.start()
    let lastTime = localStorage.getItem('lastTime')
    const now = new Date().getTime()
    checkTime(Number(lastTime), now)

  }
  const pause = () => {
    if (game === null || game === undefined) return
    game.pause()
  }

  return {start, pause}
}

const useAction = (t: number) => {
  if (game === null || game === undefined) return
  game.pet.userAction(t)
}

let gameShowEvent = shallowRef(false)
let saveHandler = () => {
  let statsStringified = JSON.stringify(game?.pet.stats)
  localStorage.setItem('stats', statsStringified)
  let test = new Date().getTime()
  let lastTimestamp = JSON.stringify(test)
  localStorage.setItem('lastTime', lastTimestamp)

}

let checkTime = (time: number, now: number) => {
  const diff = now - time
  const seconds = Math.floor(diff / 1000)
  if (game?.pet.stats.age) {
    game.pet.stats.age += seconds
  }
  if (seconds >= 100) {
    game?.pet.petDecayInactive()
  }
}

window.addEventListener('beforeunload', saveHandler)

</script>

<template>
  <main class="main">`
    <div class="game-wrapper">
      <div class="game__event-wrapper" v-show="isTrueOrNot">
        <div>{{ someevent[0] }}</div>
        <button @click="changeStats(0)">Сьесть</button>
        <button @click="changeStats(1)">Поиграть</button>
      </div>
      <canvas/>
      <button @click="gameShowEvent = !gameShowEvent" class="game__open-button-lists">actions</button>
      <div class="actions" v-show="gameShowEvent">
        <button @click="useAction(3)">покормить</button>
        <button @click="useAction(2)">помыть</button>
        <button @click="useAction(4)">поиграть</button>
        <button @click="useAction(9)">отвести в туалет</button>
        <button @click="useAction(1)">отправить спать</button>
      </div>
      <div class="stats-progress">
        <div class="progress-bar" :style="{ background: statGradient('loyalty').value }">
          <p>loyalty</p>
        </div>
        <div class="progress-bar" :style="{ background: statGradient('satiety').value }">
          <p>satiety</p>
        </div>
        <div class="progress-bar" :style="{ background: statGradient('interest').value }">
          <p>interest</p>
        </div>
        <div class="progress-bar" :style="{ background: statGradient('hygiene').value }">
          <p>hygiene</p>
        </div>
        <div class="progress-bar" :style="{ background: statGradient('health').value }">
          <p>health</p>
        </div>
        <div class="progress-bar" :style="{ background: statGradient('mood').value }">
          <p>mood</p>
        </div>
        <div class="progress-bar" :style="{ background: statGradient('energy').value }">
          <p>energy</p>
        </div>
      </div>
      <div class="assets">
        <img alt="background" src="../assets/game/background/day.png" id="day">
        <img alt="background" src="../assets/game/background/dusk.png" id="dusk">
        <img alt="background" src="../assets/game/background/night.png" id="night">
        <img alt="background" src="../assets/game/background/dawn.png" id="dawn">
        <img alt="dino small" src="../assets/game/pet/dino/dinoSpriesheet.png" id="dinoSmall">
      </div>
      <button class="start" @click="gameHandler().start()">start</button>
      <button class="pause" @click="gameHandler().pause()">stop</button>
    </div>
  </main>
</template>

<style scoped>

.game__event-wrapper {
  position: absolute;
  left: 50%;
  top: 20px;
}

.game__open-button-lists {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 20%;
  top: 20px;
}

.game-wrapper {
  position: relative;
  width: 1024px;
  height: 768px;
}


.stats-progress {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 100px
}

.progress-bar {
  margin: 10px;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;

}


.progress-bar > p {
  top: 40px;
  left: 30px;
  content: "75%";
  position: absolute;
}

.actions {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 19%;
  top: 10%
}


button {
  align-items: center;
  appearance: none;
  background-color: #ADCE43;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px, rgba(0, 0, 0, .14) 0 6px 10px 0, rgba(0, 0, 0, .12) 0 1px 18px 0;
  box-sizing: border-box;
  color: #3c4043;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: .25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  will-change: transform, opacity;
  z-index: 0;
}

button:hover {
  background: #F6F9FE;
  color: #174ea6;
}

button:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

button:focus {
  outline: none;
  border: 2px solid #4285f4;
}

button:not(:disabled) {
  box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
}

button:not(:disabled):hover {
  box-shadow: rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px;
}

button:not(:disabled):focus {
  box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
}

button:not(:disabled):active {
  box-shadow: rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px;
}

button:disabled {
  box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
}


.assets {
  display: none;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: relative;
}

.start {
  position: absolute;
  padding: 16px;
  top: 20px;
  left: 40px;
}

.pause {
  position: absolute;
  padding: 16px;
  top: 20px;
  right: 40px;
}


.actions > button {
  margin: 10px;
  padding: 20px;
}
</style>