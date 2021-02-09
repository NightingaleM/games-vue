export const makeContinuationArray = (s, e) => {
  let a = []
  for (let i = s; i <= e; i++) {
    a.push(i)
  }
  return a
}

export const makeArrayByAppoint = (appoint, length) => {
  let a = []
  if (appoint instanceof Function) {
    for (let i = 0; i < length; i++) {
      a.push(appoint())
    }
  } else {
    for (let i = 0; i < length; i++) {
      a.push(appoint === 'random' ? Math.random() > 0.2 ? 0 : 1 : appoint)
    }
  }
  return a
}


export class DeepClone {
  constructor() {
    this.cache = []
  }

  clone(source) {
    if (source instanceof Object) {
      let cacheDist = this.findCache(source)
      if (cacheDist) {
        return cacheDist
      } else {
        let dist
        if (source instanceof Array) {
          dist = new Array()
        } else if (source instanceof Function) {
          dist = function () {
            return source.apply(this, arguments)
          }
          //  dist = source.bind(this, ...arguments)
        } else if (source instanceof RegExp) {
          dist = new RegExp(source.source, source.flags)
        } else if (source instanceof Date) {
          dist = new Date(source)
        } else {
          dist = new Object()
        }
        this.cache.push([source, dist])
        for (const key in source) {
          // for in 默认会遍历原型上的属性，所以需要加上
          if (source.hasOwnProperty(key)) {
            dist[key] = this.clone(source[key])
          }
        }
        return dist
      }
    }
    return source
  }

  findCache(source) {
    for (let i = 0; i < this.cache.length; i++) {
      if (this.cache[i][0] === source) {
        return this.cache[i][1]
      }
    }
    return undefined
  }
}

export const checkRule = ({map, lat, long, wordSize}) => {
  let _lat = lat == 0 ? wordSize - 1 : lat - 1 // 左
  let lat_ = lat == map.length - 1 ? 0 : lat + 1 // 右
  let _long = long == 0 ? wordSize - 1 : long - 1 // 上
  let long_ = long == map[0].length - 1 ? 0 : long + 1 // 下
  let target = map[long][lat]

  let left = map[long][_lat]
  let right = map[long][lat_]
  let top_left = map[_long][_lat]
  let top = map[_long][lat]
  let top_right = map[_long][lat_]
  let bottom_left = map[long_][_lat]
  let bottom = map[long_][lat]
  let bottom_right = map[long_][lat_]

  let sum = left + right + top_left + top + top_right + bottom_left + bottom + bottom_right
  // -------------------
  // if (sum <= 1) {
  //   target = 0
  // } else if (sum === 2 || sum === 3) {
  //   target = map[long][lat]
  //
  // } else if (sum > 3) {
  //   target = 0
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
