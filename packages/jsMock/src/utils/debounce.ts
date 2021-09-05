function debounce(func, wait) {
  let timer
  return function () {
    let context = this
    let args = arguments // arguments中存着e，这个e就是onscroll事件的参数

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export { debounce }
