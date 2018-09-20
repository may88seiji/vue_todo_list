// ★STEP2
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// ★STEP1
new Vue({
  el: '#app',
  data: {
    // ★STEP5 localStorage から 取得した ToDo のリスト
    todos: [],
    // ★STEP11 抽出しているToDoの状態
    current: -1,
    // ★STEP11＆STEP13 各状態のラベル
    options: [
      { value: -1, label: 'すべて'},
      { value: 0, label: '作業中'},
      { value: 1, label: '完了'}
    ]
  },

  computed: {
    // *STEP12
    computedTodos: function() {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      return this.todos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function (a,b) {
        return Object.assign(a, {[b.value]: b.label})
      },{})
    }
  },

  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
    deep: true
    }
  },

  created() {
    this.todos = todoStorage.fetch()
  },

  methods: {
    //*STEP 7 ToDo 追加処理
    doAdd: function(event, value) {
      //refで名前参照
      var comment = this.$refs.comment
      //入力がなければ何もしない rerurn
      if(!comment.value.length){
        return
      }
    this.todos.push({
      id: todoStorage.uid++,
      comment: comment.value,
      state: 0
    })
    comment.value = ''
    },
    //*STEP 10 変更
    doChangeState: function(item) {
      item.state = !item.state ? 1 : 0
    },

    //*STEP 10 削除
    doRemove: function(item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  }

})