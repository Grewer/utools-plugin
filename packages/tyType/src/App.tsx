import { Component } from 'solid-js'

const App: Component = () => {
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
          <textarea placeholder={`输入 mock, 如{'boolean|1-2': true}`} id="source" />
        </div>
        <div className="column column-50">
          <textarea readOnly />
        </div>
      </div>
    </div>
  )
}

export default App
