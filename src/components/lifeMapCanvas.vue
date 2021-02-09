<template>
  <button @click="toNextWord">next word</button>
  <button @click="autoWordHandle">{{ running ? 'stop' : 'auto' }} word</button>
  <div id="canvas-box">
    <canvas id="my-canvas" width="1000" height="1000"></canvas>
  </div>
</template>

<script lang="ts">
import {ref, onMounted, watchEffect} from 'vue';
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
    let wordSize = 200;
    let cubSize = 1000/wordSize;
    let word = (function () {
      let w = [];
      for (let long = 0; long < wordSize; long++) {
        w.push(makeArrayByAppoint('random', wordSize));
      }
      return w;
    })();

    const handleExecute = () => {
      canvas = document.querySelector('#my-canvas');
      canvasCtx = canvas.getContext('2d');
      canvasCtx.lineWidth = 0.1;
      showWord(word, canvasCtx);
    };

    const showWord = (W, ctx) => {
      ctx.clearRect(0, 0, 1000, 1000);
      for (let long = 0; long < wordSize; long++) {
        // console.log('s: ', W[long]);
        for (let lat = 0; lat < wordSize; lat++) {
          if (W[long][lat]) {
            ctx.fillRect(cubSize * lat, cubSize * long, cubSize, cubSize);
          } else {
            ctx.strokeRect(cubSize * lat, cubSize * long, cubSize, cubSize);
          }
        }
      }
      ctx.stroke();
    };

    const nextWord = oldWord => {
      let newWord = makeArrayByAppoint(() => new Array(wordSize), wordSize);
      for (let long = 0; long < wordSize; long++) {
        for (let lat = 0; lat < wordSize; lat++) {
          let newCub = checkRule({map: oldWord, long, lat, wordSize});
          newWord[long][lat] = newCub;
        }
      }
      return newWord;
    };

    const running = ref<Boolean>(false);
    let timer = null;
    const toNextWord = () => {
      word = nextWord(word);
      showWord(word, canvasCtx);
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
      handleExecute();
    });
    return {
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
