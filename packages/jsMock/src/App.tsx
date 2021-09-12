import { Component, createSignal, onMount } from "solid-js";
import Mock from "mockjs";
import { debounce } from "./utils/debounce";

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

  const onChange = debounce(val => {
    try {
      // eslint-disable-next-line no-eval
      const _result = eval(`Mock.mock(${val})`)
      // console.log(result)
      setResult(JSON.stringify(_result, null, 2))
    } catch (e) {
      console.log('err?', setResult(e))
    }
  }, 300)

  const onInput = ev => {
    const val = ev.target?.value
    setInput(val)
    onChange(val)
  }

  onMount(() => {
    onChange(template)
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
    <div className="container">
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
          <textarea readOnly value={result()} />
        </div>
      </div>
      <h5>常用 mock 模板:</h5>
      <div className="row">
        <div className="column">
          <ul>
            <li>
              布尔值
              <code>@boolean()</code>
            </li>
            <li>
              整数
              <code>@integer(60, 100)</code>
            </li>
            <li>
              长度字符串
              <code>@string(5)</code>
            </li>
          </ul>
        </div>
        <div className="column">
          <ul>
            <li>
              日期
              <code>@date()</code>
            </li>
            <li>
              时间
              <code>@time()</code>
            </li>
            <li>
              日期时间
              <code>@datetime()</code>
            </li>
          </ul>
        </div>
        <div className="column">
          <ul>
            <li>
              图片 <code>Mock.Random.image()</code>
            </li>
            <li>
              语句
              <code>@csentence(3, 5)</code>
            </li>
            <li>
              名字
              <code>@cname</code>
            </li>
          </ul>
        </div>
        <div className="column">
          <ul>
            <li>
              url <code>@url</code>
            </li>
            <li>
              email <code>@email</code>
            </li>
            <li>
              城市 <code>@city</code>
            </li>
            <li>
              id <code>@id</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
