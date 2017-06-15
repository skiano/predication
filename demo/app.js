const app = new Vue({
  el: '#app',
  data: {
    message: 'You loaded this page on ' + new Date()
  }
})

const myCodeMirror = CodeMirror.fromTextArea(document.getElementById('editor'), {
  mode:  { name: "javascript", json: true },
  theme: '3024-night',
  tabSize: '2',
});

const willNotThrow = fn => (...args) => {
  try { fn(...args) } catch (e) { return false }
  return true
}

const getDescription = doc => JSON.parse(doc.getValue())
const isDocValid = doc => !throws(getDescription, doc)

Rx.Observable
  .fromEvent(myCodeMirror, 'change')
  .filter(willNotThrow(getDescription))
  .map(getDescription)
  .subscribe(doc => console.log(doc))