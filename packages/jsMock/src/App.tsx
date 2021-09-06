import { Component, createSignal, onMount } from 'solid-js'
import { debounce } from './utils/debounce'
import Mock from 'mockjs'

// @ts-ignore
window.Mock = Mock


const template = `{
  "list|5-10": [{
    name: '@cname'
  }],
}`

const App: Component = () => {
  console.log('render App')
  const [result, setResult] = createSignal('')
  const [input, setInput] = createSignal(template)

  const onChange = debounce((val) => {
    try {
      const result = eval(`Mock.mock(${val})`)
      // console.log(result)
      setResult(JSON.stringify(result, null, 2))
    } catch (e) {
      console.log('err?', e)
      setResult(e)
    }
  }, 300)

  const onInput = (ev) => {
    const val = ev.target?.value
    setInput(val)
    onChange(val)
  }

  onMount(() => {
    onChange(template)
  })

  const formatHandle = () => {
    try {
      setInput(JSON.stringify(eval('(' + input() + ')'), null, 2))
    } catch (e) {
      console.log('格式化错误', e)
    }
  }

  const resetHandle = () => {
    setInput(template)
    onChange(template)
  }

  const copy = () => {
    const res = window.utools?.copyText(result())
    if (res) {
      window.utools?.showNotification('已复制')
    }
  }

  return (
    <div class="container">
      <div className="row">
        <button onClick={formatHandle} class="button button-clear">格式化</button>
        <button onClick={resetHandle} class="button button-clear">重置</button>
        <button onClick={copy} class="button button-clear">复制结果</button>
      </div>
      <div class="row">
        <div class="column column-50">
          <textarea value={input()} onInput={onInput} spellcheck autofocus
                    placeholder={`输入 mock, 如{'boolean|1-2': true}`}
                    id="source"/>
        </div>
        <div class="column column-50">
          <textarea readOnly value={result()}/>
        </div>
      </div>
    </div>
  )
}


export default App
