!function(e,t){e.dom=function(i){return"string"!=typeof i?i instanceof Array||i[0]&&i.length?[].slice.call(i):[i]:(e.__create_dom_div__||(e.__create_dom_div__=t.createElement("div")),e.__create_dom_div__.innerHTML=i,[].slice.call(e.__create_dom_div__.childNodes))};var i=0,l=e.ListPicker=e.Class.extend({init:function(t,l){var n=this;if(!t)throw"构造 ListPicker 时找不到元素";n.box=t,n.box.listpickerId||(n.listpickerId=n.box.listpickerId="listpicker-"+ ++i,n.box.setAttribute("data-listpicker-id",n.box.listpickerId),l=l||{},l.fiexdDur=l.fiexdDur||150,l.highlightStyle=l.highlightStyle||"color: green;",e.os.ios&&(l.enabledH5=!0),(null===l.enabled3d||"undefined"==typeof l.enabled3d)&&(l.enabled3d=e.os.ios),n.options=l,n._create(),n._handleShim(),n._bindEvent(),n._applyToBox(),n._handleHighlight())},_create:function(){var t=this;t.boxInner=e(".mui-listpicker-inner",t.box)[0],t.boxHeight=t.box.offsetHeight,t.list=e("ul",t.boxInner)[0],t.refresh();var i=t.itemElementArray[0];t.itemHeight=0,i?t.itemHeight=i.offsetHeight:(t.list.innerHTML="<li>...</li>",i=e("li",t.list)[0],t.itemHeight=i.offsetHeight,t.list.innerHTML=""),t.list.style.paddingTop=t.list.style.paddingBottom=t.boxHeight/2-t.itemHeight/2+"px",t.rule=e.dom('<div class="mui-listpicker-rule"> </div>')[0],t.rule.style.height=t.itemHeight+"px",t.rule.style.marginTop=-(t.itemHeight/2)+"px",t.box.appendChild(t.rule),t.middle=t.boxInner.offsetHeight/2,t.showLine=parseInt((t.boxInner.offsetHeight/t.itemHeight).toFixed(0)),t.options.enabled3d&&t.box.classList.add("three-dimensional")},_handleShim:function(){var t=this;t.options.enabledH5?(t.options.fiexdDur*=2,t.boxInner.classList.add(e.className("scroll-wrapper")),t.list.classList.add(e.className("scroll")),t._scrollerApi=e(t.boxInner).scroll({deceleration:.002}),t.setScrollTop=function(e,i,l){t._scrollerApi.scrollTo(0,-e,i)},t.getScrollTop=function(){var e=this;return e._scrollerApi.lastY>0?0:Math.abs(e._scrollerApi.lastY)}):(t.boxInner.addEventListener("scroll",function(i){t.disabledScroll||(t.isScrolling=!0,t.scrollTimer&&clearTimeout(t.scrollTimer),t.scrollTimer=setTimeout(function(){t.isScrolling=!1,t.isTouchDown&&e.os.ios||e.trigger(t.boxInner,"scrollend")},150))},!1),t.aniScrollTop=function(e,i,l){t.disabledScroll=!0;var n=i>0?i/10:1,r=(e-t.boxInner.scrollTop)/n;t._lastScrollTop=t.boxInner.scrollTop,t._aniScrollTop(e,0,n,r,l)},t._aniScrollTop=function(e,i,l,n,r){t.boxInner.scrollTop=t._lastScrollTop+n*i,l>i?setTimeout(function(){t._aniScrollTop(e,++i,l,n)},10):(t.disabledScroll=!1,r&&r())},t.setScrollTop=function(e,i,l){t.aniScrollTop(e,i)},t.getScrollTop=function(){var e=this;return e.boxInner.scrollTop},e.os.ios&&(t.boxInner.addEventListener("touchstart",function(e){var t=this;t.isTouchDown=!0},!1),t.boxInner.addEventListener("touchend",function(i){t.isTouchDown=!1,t.isScrolling||setTimeout(function(){e.trigger(t.boxInner,"scrollend")},0)},!1)))},_handleHighlight:function(){var t=this,i=t.getScrollTop(),l=parseInt((i/t.itemHeight).toFixed(0)),n=t.itemElementArray.length-1,r=parseInt((t.showLine/2).toFixed(0)),o=l-r,s=l+r;0>o&&(o=0),s>n&&(s=n);for(var a=o;s>=a;a++){var d=t.itemElementArray[a];if(a==l?d.classList.add(e.className("listpicker-item-selected")):d.classList.remove(e.className("listpicker-item-selected")),t.options.enabled3d){var c=t.middle-(d.offsetTop-i+t.itemHeight/2)+1,u=c/t.itemHeight,g=18*u;d.style.webkitTransform="rotateX("+g+"deg) translate3d(0px,0px,"+(0-Math.abs(12*u))+"px)"}}},_triggerChange:function(){var t=this;e.trigger(t.box,"change",{index:t.getSelectedIndex(),value:t.getSelectedValue(),text:t.getSelectedText(),item:t.getSelectedItem(),element:t.getSelectedElement()})},_scrollEndHandle:function(){var e=this,t=e.getScrollTop(),i=(t/e.itemHeight).toFixed(0);e.disabledScrollEnd=!0,e.setSelectedIndex(i),e._triggerChange(),e._handleHighlight(),setTimeout(function(){e.disabledScrollEnd=!1,e._handleHighlight()},e.options.fiexdDur)},_bindEvent:function(){var t=this;t.boxInner.addEventListener("scroll",function(e){t._handleHighlight(e)},!1),t.disabledScrollEnd=!1,t.boxInner.addEventListener("scrollend",function(e){t.disabledScrollEnd||(t.disabledScrollEnd=!0,t._scrollEndHandle())},!1),e(t.boxInner).on("tap","li",function(i){var l=this,n=[].slice.call(e("li",t.list));for(var r in n){var o=n[r];if(o==l)return void t.setSelectedIndex(r)}})},getSelectedIndex:function(){var e=this;return(e.getScrollTop()/e.itemHeight).toFixed(0)},setSelectedIndex:function(e,t){var i=this;e=e||0,i.setScrollTop(i.itemHeight*e,t?0:i.options.fiexdDur)},getSelectedElement:function(){var t=this,i=t.getSelectedIndex();return e("li",t.list)[i]},getSelectedItem:function(){var e=this,t=e.getSelectedElement();if(!t)return null;var i=t.getAttribute("data-item");return i?JSON.parse(i):{text:t.innerText,value:t.getAttribute("data-value")}},refresh:function(){var t=this;t.itemElementArray=[].slice.call(e("li",t.list))},setItems:function(e){var t=this,i=[];for(index in e){var l=e[index]||{text:"null",value:"null"+index},n=JSON.stringify(l);i.push("<li data-value='"+l.value+"' data-item='"+n+"'>"+l.text+"</li>")}t.list.innerHTML=i.join(""),t._scrollerApi&&t._scrollerApi.refresh&&t._scrollerApi.refresh(),t.refresh(),t._handleHighlight(),t._triggerChange()},getItems:function(){var t=this,i=[],l=e("li",t.list);for(index in l){var n=l[index],r=n.getAttribute("data-item");i.push(r?JSON.parse(r):{text:n.innerText,value:n.getAttribute("data-value")})}return i},getSelectedValue:function(){var e=this,t=e.getSelectedItem();return t?t.value:null},getSelectedText:function(){var e=this,t=e.getSelectedItem();return t?t.text:null},setSelectedValue:function(t,i){var l=this,n=e("li",l.list);for(index in n){var r=n[index];if(r&&r.getAttribute&&r.getAttribute("data-value")==t)return void l.setSelectedIndex(index,i)}},_applyToBox:function(){var e=this,t=["getSelectedIndex","setSelectedIndex","getSelectedElement","getSelectedItem","setItems","getItems","getSelectedValue","getSelectedText","setSelectedValue"],i=function(t){"function"==typeof e[t]?e.box[t]=function(){return e[t].apply(e,arguments)}:e.box[t]=e[t]};for(var l in t){var n=t[l];i(n)}}});e.fn.listpicker=function(e){return this.each(function(t,i){if(e)new l(i,e);else{var n=i.getAttribute("data-listpicker-options"),r=n?JSON.parse(n):{};r.enabledH5=i.getAttribute("data-listpicker-enabledh5")||r.enabledH5,r.enabled3d=i.getAttribute("data-listpicker-enabled3d")||r.enabled3d,r.fixedDur=i.getAttribute("data-listpicker-fixddur")||r.fixedDur,new l(i,r)}}),this},e.ready(function(){e(".mui-listpicker").listpicker()})}(mui,document);