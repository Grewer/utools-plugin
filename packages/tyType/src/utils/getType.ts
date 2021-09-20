function getObjectType(type: string) {
  switch (type) {
    case '1':
      return '{}'
    case '2':
      return 'object'
    case '3':
      return `Record<string, unknown>`
    default:
      return ''
  }
}

function getArrayType(type: string, val: any) {
  switch (type) {
    case '1':
      return `${val}[]`
    case '2':
      return `Array<${val}>`
    default:
      return ''
  }
}

function dynamicArray(arr: any[], gap, config) {
  return arr.reduce((previousValue, currentValue) => {
    if (!previousValue.lastType) {
      previousValue.lastType = typeof currentValue
      previousValue.immutable = true
    }

    if (previousValue.lastType === typeof currentValue) {
      previousValue.push(previousValue.lastType)
    } else {
      const type = getType(currentValue, gap + 1, config)
      previousValue.lastType = type
      previousValue.push(type)
      // 不变的
      previousValue.immutable = false
    }
    return previousValue
  }, [])
}

function getType(
  data,
  gap = 0,
  config: {
    arrayType: string // 1,2
    objectType: string // 1,2,3
  } = {
    arrayType: '1',
    objectType: '2',
  }
) {
  if (typeof data === 'object') {
    if (typeof data.length !== 'undefined') {
      if (data.length > 0) {
        // todo 优化 如果 array 中的类型不一致, 将导出多种类型
        const arrType = dynamicArray(data, gap, config)
        if (arrType.immutable) {
          // 如果 immutable 说明是同一种类型
          return getArrayType(config.arrayType, arrType.lastType)
        }
        // 非同一种类型
        const str = arrType.map(val => `${'  '.repeat(gap + 1)}${val}`).join(',\n')
        return getArrayType(config.arrayType, `{\n${str}\n${'  '.repeat(gap)}}`)
      }
      return getArrayType(config.arrayType, 'void')
    }

    const keys = Object.keys(data)
    if (keys.length === 0) {
      return getObjectType(config.objectType)
    }
    let a = Object.keys(data)
      .map(v => {
        const type = getType(data[v], gap + 1, config)
        return `${'  '.repeat(gap + 1)}${v}: ${type}`
      })
      .join(',\n')
    a = `{\n${a}\n${'  '.repeat(gap)}}`
    return a
  }
  return typeof data
}

export default getType
