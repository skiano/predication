const editorElm = document.getElementById('editor')

const app = new Vue({
  el: '#app',
  data: {
    message: 'You loaded this page on ' + new Date()
  }
})

const myCodeMirror = CodeMirror.fromTextArea(editorElm, {
  mode:  { name: "javascript", json: true },
  theme: '3024-night',
  tabSize: '2',
});

const willNotThrow = fn => (...args) => {
  try { fn(...args) } catch (e) { return false }
  return true
}

const getContent = doc => JSON.parse(doc.getValue())

const source = Rx.Observable.fromEvent(myCodeMirror, 'change')
const multicasted = source.multicast(new Rx.BehaviorSubject(myCodeMirror))

multicasted.connect()

const values = multicasted
  .debounceTime(100)
  .filter(willNotThrow(getContent))
  .map(getContent)

const validity = multicasted
  .map(willNotThrow(getContent))
  .distinctUntilChanged()

values.subscribe(v => console.log(`values 1: ${JSON.stringify(v)}`))
values.subscribe(v => console.log(`values 2: ${JSON.stringify(v)}`))

validity.subscribe(v => console.log(`validity 1: ${v}`))

validity.subscribe((valid) => {
  const elm = myCodeMirror.getTextArea()
  console.log(myCodeMirror)
  if (valid) {
    elm.style.borderColor = "red"
    console.log(elm.style.borderColor)
  } else {
    elm.style.borderColor = "blue"
  }
})



