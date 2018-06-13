import {forEachValue, isObject} from "./utils";

export function mapGetters(getters) {
  const res = {};
  if(Array.isArray(getters)){
    getters.forEach(key=>{
      res[key] = function () {
        return this.$store.getters[key]();
      }
    })
  }else if(isObject(getters)){
    forEachValue(getters, (value,key)=>{
      res[value] = function () {
        return this.$store.getters[key]();
      }
    })
  }
  return res;
}
