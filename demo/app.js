const { predication } = window.predication

function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }));
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}


const willNotThrow = fn => (...args) => {
  try { fn(...args) } catch (e) { return false }
  return true
}

const getContent = doc => eval(`predication(${doc.getValue().trim()})`)

Vue.component('editor', {
  template: '<div class="editor" :class="{ invalid: !isValid }"></div>',
  data: () => ({ isValid: true }),
  props: [
    'initialValue',
    'onChange',
  ],
  mounted() {
    let init = this.$router.currentRoute.query.predicate
    init = init ? b64DecodeUnicode(init) : this.initialValue

    this.codeMirror = CodeMirror(this.$el, {
      value: init,
      mode:  { name: "javascript" },
      autofocus: true,
      lineWrapping: true,
      smartIndent: false,
      fixedGutter: false,
      autoCloseBrackets: true,
      matchBrackets: true,
      gutters: [ 'editor-gutter' ],
      tabSize: '2',
      cursorScrollMargin: 300,
    })

    // this.codeMirror.execCommand('selectAll')
    // this.codeMirror.execCommand('goDocEnd')

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
    console.log('destroy codeMirror and observable stuff')
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

const app = new Vue({ router }).$mount('#app')
