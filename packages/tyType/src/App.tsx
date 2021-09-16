import { Component, createSignal } from 'solid-js'
import { debounce } from './utils/debounce'
import {createStore} from "solid-js/store";

function getType(data, gap = 0) {
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
  const [result, setResult] = createSignal('')
  const [state,setState] = createStore({
    input: '',
    result: ''
  })

  const formatHandle = () => {
    try {
      // eslint-disable-next-line no-eval
      setInput(JSON.stringify(eval(`(${input()})`), null, 2))
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

  const onChange = debounce(val => {
    try {
      // eslint-disable-next-line no-eval
      const data = eval(`(${val})`)
      console.log(data)
      const res = getType(data) // type  string
      console.log(res)
      // setResult(res)
      setResult(res)
    } catch (e) {
      console.log('e', e)
      setResult(e)
    }
  }, 300)

  const onInput = ev => {
    const val = ev.target?.value
    setInput(val)
    onChange(val)
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
          <textarea value={result()} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="column column-33">
          <fieldset id="group2" onChange={ev=>{
            console.log(ev.target.value)
          }}>
            object 模式:
            <label><input type="radio" value={1} name="indoor-outdoor"/> object</label>
            <label><input type="radio" value={2} name="indoor-outdoor"/> {'{}'}</label>
            <label><input type="radio" value={3} name="indoor-outdoor"/> {`Record<string, unknown>`}</label>
          </fieldset>
        </div>
        <div className="column column-33">
          <fieldset id="group3" onChange={ev=>{
            console.log(ev.target.value)
          }}>
            array 模式:
            <label><input type="radio" value={1} name="indoor-outdoor"/> {`{key:val}[]`}</label>
            <label><input type="radio" value={2} name="indoor-outdoor"/> {`Array<{key:val}>`}</label>
          </fieldset>
        </div>
      </div>
    </div>
  )
}

export default App
