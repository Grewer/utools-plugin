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
        return getArrayType(config.arrayType, getType(data[0], gap + 1, config))
      }
      return getArrayType(config.arrayType, 'any')
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
