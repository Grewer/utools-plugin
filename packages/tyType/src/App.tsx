import { Component, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { debounce } from './utils/debounce'
import getType from './utils/getType'

/* eslint-disable jsx-a11y/label-has-associated-control */

const temp = `{}`

const App: Component = () => {
  const [state, setState] = createStore({
    input: '',
    result: '',
    config: {
      arrayType: '1',
      objectType: '1',
    },
  })

  // console.log('render App', state)

  onMount(() => {
    window?.utools?.onPluginEnter(({ code, type, payload }) => {
      document.body.className = window?.utools?.isDarkColors() ? 'dark-mode' : ''
    })
  })

  const formatHandle = () => {
    try {
      // eslint-disable-next-line no-eval
      setState('input', JSON.stringify(eval(`(${state.input})`), null, 2))
    } catch (e) {
      console.log('格式化错误', e)
    }
  }
  const resetHandle = () => {
    setState('input', temp)
    onChange(temp)
  }
  const copy = () => {
    const res = window.utools?.copyText(state.result)
    if (res) {
      window.utools?.showNotification('已复制')
    }
  }

  const onChange = debounce(val => {
    try {
      // eslint-disable-next-line no-eval
      const data = eval(`(${val})`)
      // console.log(data)
      const res = getType(data, 0, state.config) // type  string
      // console.log(res)
      setState('result', res)
    } catch (e) {
      // console.log('e', e)
      setState('result', e)
    }
  }, 300)

  // 输入 onInput
  const onInput = ev => {
    const val = ev.target?.value
    setState('input', val)
    onChange(val)
  }

  const arrayTypeChange = ev => {
    setState('config', 'arrayType', (ev.target as HTMLOptionElement).value)
    onChange(state.input)
  }

  const objectTypeChange = ev => {
    setState('config', 'objectType', (ev.target as HTMLOptionElement).value)
    onChange(state.input)
  }

  return (
    <div className="container">
      输入 js, 获取对应的 ts 类型
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
          <textarea value={state.input} onInput={onInput} placeholder="输入 json, 如{a:1}" id="source" />
        </div>
        <div className="column column-50">
          <textarea value={state.result} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="column column-33">
          <fieldset id="group3" onChange={arrayTypeChange}>
            array 模式:
            <label>
              <input type="radio" checked value={1} name="array" /> {`{key:val}[]`}
            </label>
            <label>
              <input type="radio" value={2} name="array" /> {`Array<{key:val}>`}
            </label>
          </fieldset>
        </div>
        <div className="column column-33">
          <fieldset id="group2" onChange={objectTypeChange}>
            object 模式:
            <label>
              <input type="radio" checked value={1} name="object" /> {'{}'}
            </label>
            <label>
              <input type="radio" value={2} name="object" /> object
            </label>
            <label>
              <input type="radio" value={3} name="object" /> {`Record<string, unknown>`}
            </label>
          </fieldset>
        </div>
      </div>
    </div>
  )
}

export default App
