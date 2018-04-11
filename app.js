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

const getError = fn => (...args) => {
  try { fn(...args) } catch (e) { return e }
  return undefined
}

const getContent = doc => eval(`predication.predication(${
  JSON.parse(JSON.stringify(doc.getValue().trim()))
})`)

const randInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randInArr = arr => arr[randInRange(0, arr.length - 1)]

const signs = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

const names = [
  'Sandra','Christopher','Michelle','George','Susan','John','Kevin','Michael','Paul','Donald',
  'Deborah','Anthony','Ronald','Ryan','Joshua','Amanda','Brian','Richard','Charles','Betty',
  'Lisa','Kimberly','Barbara','Laura','Carol','Andrew','Edward','Dorothy','Sharon','Mark',
  'Rebecca','Linda','Patricia','Joseph','Margaret','Jason','Helen','Ashley','Emily','Elizabeth',
  'Jennifer','Jeffrey','James','Sarah','Steven','Thomas','Karen','Donna','Melissa','Robert',
  'Nancy','David','Daniel','Jessica','Timothy','Mary','Matthew','William','Stephanie'
]

const things = [
  '♖', '❄', '☂', '♬', '☎', '✈', '✭', '✿', '❤', '☯', '☭',
]

const makePerson = (name) => ({
  name,
  age: randInRange(19, 50),
  sign: randInArr(signs),
  loves: [randInArr(things), randInArr(things)],
  hates: [randInArr(things), randInArr(things), randInArr(things)]
})

Vue.component('editor', {
  template: '<div class="editor" :class="{ invalid: errorMessage }"></div>',
  data: () => ({ errorMessage: false }),
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

    this.error = this.multicasted
        .map(getError(getContent))
        .distinctUntilChanged()
        .subscribe((error) => {
          this.errorMessage = error && error.message
          console.log(`error: ${this.errorMessage}`)
          this.$emit('error', error)
        })
  },
  beforeDestroy() {
    this.validity.unsubscribe()
    this.values.unsubscribe()
  }
})

Vue.component('person', {
  props: [ 'data' ],
  template: `
    <div>
      <p>{{data.name}}, {{data.age}} - {{data.sign}}</p>
      <p>Loves: <span class='stuff'>{{data.loves.join('')}}</span></p>
      <p>Hates: <span class='stuff'>{{data.hates.join('')}}</span></p>
      <pre>{{string}}</pre>
    </div>
  `,
  computed: {
    string() {
      return JSON.stringify(this.data, null, 2)
    }
  }
})

const Numbers = {
  template: `
    <div>
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

const Objects = {
  template: `
    <div>
      <editor
        :initial-value="initialValue"
        @change="update">
      </editor>
      <div class="numbers-wrap">
        <div class="objects">
          <li v-for="item in filteredValues">
            <div class="object" :class="{ filtered: !item.included }">
              <person :data="item.value"></person>
            </div>
          </li>
        </div>
      </div>
    </div>
  `,
  data: () => ({
    values: names.map(makePerson),
    initialValue: `{this: 'bar', eq: '♖'}`,
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

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/numbers' },
    { path: '/numbers', component: Numbers },
    { path: '/objects', component: Objects },
    { path: '*', redirect: '/numbers' }
  ]
})

new Vue({ router }).$mount('#app')
