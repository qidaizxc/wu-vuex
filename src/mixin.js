export function mixinInVue(Vue) {
  Vue.mixin({
    beforeCreate(){
      const options = this.$options;
      if(options.store){
        this.$store = options.store;
      }else if(options.parent && options.parent.$store){
        this.$store = options.parent.$store;
      }
    }
  })
}
