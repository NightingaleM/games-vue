<template>
  <input type="number" v-model="delay" min="0" max="5000">
  <button @click="RUN({map})">RUN</button>
  <div v-for="(line,x) in map" :key="x">
    <span v-for="(value,y) in line" :class="[{alive: value}]" :key="x+','+y"
          @mousemove="setLife(x,y)"
          ></span>
  </div>
</template>

<script>
import {
  makeContinuationArray,
  DeepClone,
  makeArrayByAppoint
} from '../public/lib.js'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      delay: 200,
      map: []
    }
  },
  methods: {
    setLife(x, y) {
      this.map[x][y] = this.map[x][y] ? 0 : 1
    },
    MakeWorld(w, h) {
      let erect = makeArrayByAppoint(0, h)
      // let cross = makeArrayByAppoint([...erect], w)
      let cross = []
      for (let i = 0; i < w; i++) {
        cross.push([...erect])
      }
      // let map = cross.map(c => {
      //   erect.forEach(e => {
      //     c.push(e)
      //   })
      //   return c
      // })
      return cross
    },
    RUN() {
      let delay = this.delay
      setInterval(() => {
        this.ergodicMap()
      }, delay)
    },
    ergodicMap() {
      let _map = new DeepClone().clone(this.map)
      this.map.forEach((line, x) => {
        line.forEach((value, y) => {
          let newValue = this.checkRule({
            map: this.map, x, y
          })
          _map[x][y] = newValue
        })
      })
      this.map = _map
    },
    checkRule: ({map, x, y}) => {
      let _x = x == 0 ? null : x - 1
      let x_ = x == map.length - 1 ? null : x + 1
      let _y = y == 0 ? null : y - 1
      let y_ = y == map[0].length - 1 ? null : y + 1
      let target = map[x][y]

      let lt = _x ? _y ? map[_x][_y] : 0 : 0 // 左上
      let t = x ? _y ? map[x][_y] : 0 : 0 // 上
      let rt = x_ ? _y ? map[x_][_y] : 0 : 0 // 右上
      let l = _x ? y ? map[_x][y] : 0 : 0 // 左
      let r = x_ ? y ? map[x_][y] : 0 : 0 // 右
      let lb = _x ? y_ ? map[_x][y_] : 0 : 0 // 左下
      let b = x ? y_ ? map[x][y_] : 0 : 0 // 下
      let rb = x_ ? y_ ? map[x_][y_] : 0 : 0 // 右下

      let sum = lt + t + rt + l + r + lb + b + rb
      // -------------------
      // if(sum < 2) {
      //   map[x][y] = 0
      // }else if(sum === 2 || sum === 3) {
      //   map[x][y] = 1
      // }else if( sum > 3) {
      //
      // }
      // -------------------
      if (sum === 3) {
        target = 1
      } else if (sum !== 2) {
        target = 0
      }
      // -------------------
      return target
    }
  },
  mounted() {
    this.map = this.MakeWorld(80, 80)
  },
  watch: {
    map: {
      deep: true,
      handle: v => {

      }
    }
  },
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  user-select: none;
}
div{
  height: 10px;
}
span {
  box-sizing: border-box;
  /*border: 1px solid #ccc;*/
  padding: 0;
  margin: 0;
  display: inline-block;
  width: 10px;
  height: 10px;
  font-size: 12px;
}

span.alive {
  background-color: #cccccc;
}
</style>
