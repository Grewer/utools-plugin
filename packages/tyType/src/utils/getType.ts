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
  const { arrayType, objectType } = config

  if (typeof data === 'object') {
    if (typeof data.length !== 'undefined') {
      if (data.length > 0) {
        const arrType = dynamicArray(data, gap, config)
        if (arrType.immutable) {
          // 如果 immutable 说明是同一种类型
          return getArrayType(arrayType, arrType.lastType)
        }
        // 非同一种类型 str = 数组内的所有类型, 并且使用 空格 format
        const str = arrType.map(val => `${'  '.repeat(gap + 1)}${val}`).join(',\n')
        // 填充类型至 {}[] 中
        const _type = getArrayType(arrayType, `{\n${str}\n${'  '.repeat(gap)}}`)
        return _type
      }
      // 空数组 返回 void[]
      return getArrayType(arrayType, 'void')
    }

    const keys = Object.keys(data)
    if (keys.length === 0) {
      return getObjectType(objectType)
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
