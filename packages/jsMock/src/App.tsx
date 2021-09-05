import { Component, createSignal, onMount } from 'solid-js'
import { debounce } from './utils/debounce'
import Mock from 'mockjs'

const App: Component = () => {
  const [result, setResult] = createSignal('')
  onMount(()=>{
    window.Mock = Mock
  })

  const onChange = debounce((val) => {
    console.log(val)

    try {
      const result  = eval(`window.Mock.mock(val)`)
      console.log(result)
      setResult(result)
    } catch (e) {
      console.log('err?',e)
      setResult(e)
    }

  }, 300)

  return (
    <div class="container">
      <div class="row title">
        <div class="column">在线生成mock数据</div>
        // 这里各种提示
      </div>
      <div class="row">
        <TextAreaInput onChange={onChange}/>
        <div class="column column-50">
          <textarea readOnly value={result()}/>
        </div>
      </div>
    </div>
  )
}

const TextAreaInput = ((props) => {
  console.log('render TextAreaInput')
  const [input, setInput] = createSignal('{\n' +
    '  "string|1-10": "★"\n' +
    '}')

  const onChange = (ev) => {
    const val = ev.target.value
    setInput(val)
    props.onChange(val)
  }

  return <div class="column column-50">
    <textarea value={input()} onInput={onChange} spellcheck autofocus placeholder={`输入 mock, 如{'boolean|1-2': true}`}
              id="source"/>
  </div>
})

export default App
