"use strict";

/** encode from MDN */
const b64EncodeUnicode = str => (
  btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }))
)

/** decode from MDN */
const b64DecodeUnicode = str => (
  decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''))
)

const willNotThrow = fn => (...args) => {
  try { fn(...args) } catch (e) { return false }
  return true
}

const getContent = doc => eval(`predication.predication(${doc.getValue().trim()})`)

Vue.component('editor', {
  template: '<div class="editor" :class="{ invalid: !isValid }"></div>',
  data: () => ({ isValid: true }),
  props: [
    'initialValue',
    'onChange',
  ],
  computed: {
    useValue() {
      const init = this.$router.currentRoute.query.predicate
      return init ? b64DecodeUnicode(init) : this.initialValue
    }
  },
  mounted() {
    this.codeMirror = CodeMirror(this.$el, {
      value: this.useValue,
      mode: 'javascript',
      gutters: [ 'editor-gutter' ],
      autoCloseBrackets: true,
      cursorScrollMargin: 300,
      matchBrackets: true,
      lineWrapping: true,
      smartIndent: false,
      fixedGutter: false,
      autofocus: true,
      tabSize: '2',
    })

    this.source = Rx.Observable.fromEvent(this.codeMirror, 'change')
    this.multicasted = this.source.multicast(new Rx.BehaviorSubject(this.codeMirror))
    this.multicasted.connect()

    this.values = this.multicasted
        .debounceTime(100)
        .filter(willNotThrow(getContent))
        .map(getContent)
        .subscribe((value) => {
          this.$router.push({ query: { predicate: b64EncodeUnicode(this.codeMirror.getValue()) } })
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
    this.validity.unsubscribe()
    this.values.unsubscribe()
  }
})

const Main = {
  template: `
    <div id="app">
      <editor
        :initial-value="initialValue"
        @change="update">
      </editor>
      <div class="numbers-wrap">
        <div class="numbers">
          <li v-for="item in filteredValues">
            <span class="number" :class="{ filtered: !item.included }">{{ item.value }}</span>
          </li>
        </div>
      </div>
    </div>
  `,
  data: () => ({
    values: Array.from(new Array(7 * 40).keys()).map(v => v + 1),
    initialValue: `{or: [
  {not: {gt: 7}},
  {rng: [15, 35]},
  {and: [
    {rng: [43, 77]},
    {mod: [2, 1]}
  ]},
  {and: [
    {gte: 85},
    {or: [
      {mod: 3},
      {mod: [7, 0]},
      {mod: [7, 4]},
      {mod: [7, 1]}
    ]}
  ]}
]}`,
    predicate: () => true,
  }),
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
}

const numbers = Main
const objects = { template: '<div>bar</div>' }

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/numbers' },
    { path: '/numbers', component: numbers },
    { path: '/objects', component: objects },
    { path: '*', redirect: '/numbers' }
  ]
})

new Vue({ router }).$mount('#app')
