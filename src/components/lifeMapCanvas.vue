<template>
  <button @click="createClearWord">空白世界</button>
  <button @click="createRandomWord">随机世界</button>
  <input type="number" max="500" min="5" v-model="wordSize">
  <button @click="toNextWord">下一步</button>
  <button @click="autoWordHandle">{{ running ? 'stop' : 'auto' }} </button>
  <div id="canvas-box">
    <canvas id="my-canvas" width="1000" height="1000"></canvas>
  </div>
</template>

<script lang="ts">
import {ref, onMounted, watchEffect, computed} from 'vue';
import {
  checkRule,
  makeContinuationArray,
  DeepClone,
  makeArrayByAppoint
} from '../public/lib.js';

export default {
  setup(props, context) {
    let canvas = null;
    let canvasCtx = null;
    let timer = null;
    const running = ref<Boolean>(false);
    const wordSize = ref<number>(100);
    const cubSize = computed(() => 1000 / wordSize.value);
    const word = ref(null);
    const createWord = (point) => {
      clearInterval(timer);
      running.value = false;
      let w = [];
      for (let long = 0; long < wordSize.value; long++) {
        w.push(makeArrayByAppoint(point, wordSize.value));
      }
      word.value = w;
    };
    const createClearWord = () => {
      createWord(0);
      showWord(word.value,canvasCtx)
    };
    const createRandomWord = () => {
      createWord('random');
      showWord(word.value,canvasCtx)
    };
    const canvasMouseEventHandle = (canvasDom) => {
      let changed = [];
      const checkOutCoordinate = (x, y) => {
        let longIndex = Math.floor(x / cubSize.value);
        let latIndex = Math.floor(y / cubSize.value);
        if (changed.indexOf(`${longIndex},${latIndex}`) >= 0) {
          // 如果已经改变过状态就不再在这次操作中再次改变
          return;
        } else {
          word.value[longIndex][latIndex] = +!word.value[longIndex][latIndex];
          changed.push(`${longIndex},${latIndex}`);
          showWord(word.value, canvasCtx);
        }
      };
      const canvasMouseDown = event => {
        checkOutCoordinate(event.offsetY, event.offsetX);
        canvasDom.addEventListener('mousemove', canvasMouseMove);
        canvasDom.addEventListener('mouseup', canvasEventEnd);
        canvasDom.addEventListener('mouseout', canvasEventEnd);
      };
      const canvasMouseMove = event => {
        checkOutCoordinate(event.offsetY, event.offsetX);
      };
      const canvasEventEnd = event => {
        canvasDom.removeEventListener('mousemove', canvasMouseMove);
        canvasDom.removeEventListener('mouseup', canvasEventEnd);
        canvasDom.removeEventListener('mouseout', canvasEventEnd);
        changed = [];
      };
      canvasDom.addEventListener('mousedown', canvasMouseDown);
    };

    const handleExecute = () => {
      canvas = document.querySelector('#my-canvas');
      canvasCtx = canvas.getContext('2d');
      canvasCtx.lineWidth = 0.04;
      showWord(word.value, canvasCtx);
      canvasMouseEventHandle(canvas);
    };

    const showWord = (W, ctx) => {
      ctx.clearRect(0, 0, 1000, 1000);
      for (let long = 0; long < wordSize.value; long++) {
        // console.log('s: ', W[long]);
        for (let lat = 0; lat < wordSize.value; lat++) {
          if (W[long][lat]) {
            ctx.fillRect(cubSize.value * lat, cubSize.value * long, cubSize.value, cubSize.value);
          } else {
            ctx.strokeRect(cubSize.value * lat, cubSize.value * long, cubSize.value, cubSize.value);
          }
        }
      }
      ctx.stroke();
    };

    const nextWord = oldWord => {
      let newWord = makeArrayByAppoint(() => new Array(wordSize.value), wordSize.value);
      for (let long = 0; long < wordSize.value; long++) {
        for (let lat = 0; lat < wordSize.value; lat++) {
          let newCub = checkRule({map: oldWord, long, lat, wordSize: wordSize.value});
          newWord[long][lat] = newCub;
        }
      }
      return newWord;
    };

    const toNextWord = () => {
      word.value = nextWord(word.value);
      showWord(word.value, canvasCtx);
    };

    const autoWordHandle = () => {
      if (running.value) {
        clearInterval(timer);
        running.value = false;
      } else {
        running.value = true;
        timer = setInterval(() => {
          toNextWord();
        }, 50);
      }
    };
    onMounted(() => {
      createWord('random');
      handleExecute();
    });
    return {
      createClearWord,
      createRandomWord,
      wordSize,
      autoWordHandle,
      running,
      toNextWord
    };
  }
};
</script>
<style>
#canvas-box {
  width: 100vw;
  height: 90vh;
}

</style>
