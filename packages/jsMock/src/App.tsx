import { Component, createSignal, onMount } from 'solid-js'
import { debounce } from './utils/debounce'
import Mock from 'mockjs'

window.Mock = Mock

const App: Component = () => {
  console.log('render App')
  const [result, setResult] = createSignal('')
  const [input, setInput] = createSignal(`{
  "list|5-10": [{
    name: '@cname'
  }],
}`
  )

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
    onChange(`{
      "list|5-10": [{
        name: '@cname'
      }],
    }`)
  })

  const formatHandle = () => {
    try {
      setInput(JSON.stringify(eval('(' + input() + ')'), null, 2))
    } catch (e) {
      console.log('格式化错误', e)
    }
  }

  const resetHandle = () => {
    setInput(`{
  "list|5-10": [{
    name: '@cname'
  }],
}`)
    onChange(`{
      "list|5-10": [{
        name: '@cname'
      }],
    }`)
  }

  return (
    <div class="container">
      <div className="row">
        <button onClick={formatHandle} class="button button-clear">格式化</button>
        <button onClick={resetHandle} class="button button-clear">重置</button>
      </div>
      <div class="row">
        <div class="column column-50">
    <textarea value={input()} onInput={onInput} spellcheck autofocus placeholder={`输入 mock, 如{'boolean|1-2': true}`}
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
