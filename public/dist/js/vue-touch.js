!function(){function e(e){return e.charAt(0).toUpperCase()+e.slice(1)}var t={},n="function"==typeof require?require("hammerjs"):window.Hammer,i=["tap","pan","pinch","press","rotate","swipe"],r={};t.install=function(t){t.directive("touch",{isFn:!0,acceptStatement:!0,bind:function(){this.el.hammer||(this.el.hammer=new n.Manager(this.el));var t,a,h=this.mc=this.el.hammer,o=this.arg;if(r[o]){var s=r[o];t=s.type,a=new(n[e(t)])(s),a.recognizeWith(h.recognizers),h.add(a)}else{for(var c=0;c<i.length;c++)if(0===o.indexOf(i[c])){t=i[c];break}if(!t)return void console.warn("Invalid v-touch event: "+o);a=h.get(t),a||(a=new(n[e(t)]),a.recognizeWith(h.recognizers),h.add(a))}},update:function(e){var t=this.mc,n=this.vm,i=this.arg;this.handler&&t.off(i,this.handler),this.handler=function(t){t.targetVM=n,e.call(n,t)},t.on(i,this.handler)},unbind:function(){this.mc.off(this.arg,this.handler),Object.keys(this.mc.handlers).length||(this.mc.destroy(),this.el.hammer=null)}})},t.registerCustomEvent=function(e,t){t.event=e,r[e]=t},"object"==typeof exports?module.exports=t:"function"==typeof define&&define.amd?define([],function(){return t}):window.Vue&&(window.VueTouch=t,Vue.use(t))}();