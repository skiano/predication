const { predication } = window.predication

const willNotThrow = fn => (...args) => {
  try { fn(...args) } catch (e) { return false }
  return true
}

const getContent = doc => eval(`predication({ ${doc.getValue().trim()} })`)

Vue.component('editor', {
  template: '<div class="editor" :class="{ invalid: !isValid }"></div>',
  data: () => ({ isValid: true }),
  props: [
    'initialValue',
    'onChange',
  ],
  mounted() {
    this.codeMirror = CodeMirror(this.$el, {
      value: this.initialValue,
      mode:  { name: "javascript" },
      // theme: '3024-night',
      tabSize: '2',
    })

    this.codeMirror.on('beforeChange', (doc, change) => {
      console.log(doc.getValue())
      console.log(change)
    })

    this.source = Rx.Observable.fromEvent(this.codeMirror, 'change')
    this.multicasted = this.source.multicast(new Rx.BehaviorSubject(this.codeMirror))

    this.multicasted.connect()

    this.values = this.multicasted
        .debounceTime(100)
        .filter(willNotThrow(getContent))
        .map(getContent)
        .subscribe((value) => {
          this.$emit('change', value)
        })

    this.validity = this.multicasted
        .map(willNotThrow(getContent))
        .distinctUntilChanged()
        .subscribe((valid) => {
          this.isValid = valid
          this.$emit('validity', valid)
        })
  },
  beforeDestroy() {
    console.log('destroy codeMirror and observable stuff')
  }
})

const app = new Vue({
  el: '#app',
  data: {
    values: Array.from(new Array(7 * 40).keys()).map(v => v + 1),
    initialValue: '  mod: [2, 1]',
    predicate: () => true,
  },
  methods: {
    update(predicate) {
      this.predicate = predicate
    }
  },
  computed: {
    filteredValues() {
      return this.values.map(value => ({
        value: value,
        included: this.predicate(value)
      }))
    }
  }
})
