import { Component, createSignal } from 'solid-js'

function getType(data) {
  if (typeof data === 'object') {
    if (typeof data.length !== 'undefined') {
      if (data.length > 0) {
        return `Array<${getType(data[0])}>`
      }
      return 'Array<any>'
    }
    const keys = Object.keys(data)
    if (keys.length === 0) {
      return 'object'
    }
    let a = Object.keys(data)
      .map(v => {
        const type = getType(data[v])
        return `  ${v}: ${type}`
      })
      .join(',\n')
    a = `{\n${a}\n}`
    return a
  }
  return typeof data
}

const App: Component = () => {
  const [input, setInput] = createSignal('')

  const formatHandle = () => {
    try {
      // setInput(JSON.stringify(eval(`(${input()})`), null, 2))
    } catch (e) {
      console.log('格式化错误', e)
    }
  }
  const resetHandle = () => {
    // setInput(template)
    // onChange(template)
  }
  const copy = () => {
    // const res = window.utools?.copyText(result())
    // if (res) {
    //   window.utools?.showNotification('已复制')
    // }
  }

  const onInput = ev => {
    const val = ev.target?.value
    setInput(val)
    try {
      const data = JSON.parse(val)
      console.log(data)
      const res = getType(data)
      console.log(res)
    } catch (e) {
      console.error('e', e)
    }
  }

  return (
    <div className="container">
      输入 json, 获取对应的 ts 类型
      <div className="row">
        <button type="button" onClick={formatHandle} className="button button-clear">
          格式化输入框
        </button>
        <button type="button" onClick={resetHandle} className="button button-clear">
          重置
        </button>
        <button type="button" onClick={copy} className="button button-clear">
          复制结果
        </button>
      </div>
      <div className="row">
        <div className="column column-50">
          <textarea value={input()} onInput={onInput} placeholder={`输入 mock, 如{'boolean|1-2': true}`} id="source" />
        </div>
        <div className="column column-50">
          <textarea readOnly />
        </div>
      </div>
    </div>
  )
}

export default App
