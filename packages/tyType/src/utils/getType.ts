function getType(
  data,
  gap = 0,
  config?: {
    arrayType: number
    objectType: number
  }
) {
  if (typeof data === 'object') {
    if (typeof data.length !== 'undefined') {
      if (data.length > 0) {
        // todo 优化 如果 array 中的类型不一致, 将导出多种类型
        return `Array<${getType(data[0], gap + 1)}>`
      }
      return 'Array<any>'
    }

    const keys = Object.keys(data)
    if (keys.length === 0) {
      return 'object'
    }
    let a = Object.keys(data)
      .map(v => {
        const type = getType(data[v], gap + 1)
        return `${'  '.repeat(gap + 1)}${v}: ${type}`
      })
      .join(',\n')
    a = `{\n${a}\n${'  '.repeat(gap)}}`
    return a
  }
  return typeof data
}


export default getType