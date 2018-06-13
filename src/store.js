import {mixinInVue} from "./mixin";
import {assert, forEachValue} from "./utils";

let Vue;
class Store {
  constructor(options){
    this._committing = false;
    this.getters = Object.create(null);
    const {state, mutations = {}, strict = false, getters = {}} = options;
    this._mutations = mutations;
    this.strict = strict;
    this._wrappedGetters = getters;
    // 创建Vue实例去混入data
    createVM(this, state);
    this.commit = this.commit.bind(this);
  }
  get state(){
    return this._vm._data.$$state;
  }
  set state(v){
    console.warn(`你应该使用commit提交变化~`);
  }
  commit(type, payload){
    const dispatch = this._mutations[type];
    if(dispatch){
      const _committing = this._committing;
      // 通过commit更改时关闭抛错
      this._committing = true;
      dispatch(this.state, payload);
      this._committing = _committing;
    }
  }
}

function createVM(store, state) {
  // 创建独立的根节点
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed: createComputed(store),
  })
  if(store.strict){
    enobleChange(store);
  }
}

function createComputed(store) {
  const computed = {};
  forEachValue(store._wrappedGetters, (fn,key)=>{
    store.getters[key] = computed[key] = ()=> fn(store.state);

   /* Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true
    })*/
  });
  return computed;
}

// 调用watch 的深观察来禁止随意修改state
function enobleChange(store) {
    store._vm.$watch(function () { return this._data.$$state }, () => {
      if (process.env.NODE_ENV !== 'production') {
        assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
      }
    }, { deep: true, sync: true })
}

export function install(_Vue) {
  if(Vue){
    console.warn(`你应该只调用一次use函数~`)
    return
  }
  Vue = _Vue;
  mixinInVue(Vue);
}



export default Store;

