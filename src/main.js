// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
// import VueResource from 'vue-resource';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import lodash from 'lodash';
import echarts from 'echarts'
import App from './App';
import router from './router';
import store from './store';

import common from './utils/common'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import './permisson'
import 'vue-event-calendar/dist/style.css'
import vueCalendarSwiper from 'vue-calendar-swiper'
Vue.use(vueCalendarSwiper, { locale: 'en' });
import judge from './utils/judgeBrowser'
import * as filters from './filters'
judge.isChrome();
fontawesome.library.add(solid);
Vue.prototype.$echarts = echarts;
Vue.prototype.$ajax = axios;
Vue.prototype._ = lodash;
axios.defaults.timeout = 1800000;
Vue.prototype.common = common;
axios.defaults.withCredentials = true;
let loading = {};
let showLoading = false;
let interfaceUrl = '';
axios.interceptors.request.use(config => {
    //判断是否存在token,如果存在将每个页面header都添加token
    showLoading = config.headers.LOADINGFLAG === 'FALSE';
    let url = config.url.split('/')[config.url.split('/').length - 1];
    if(url != 'select-no-read'){
        interfaceUrl = config.url;
    }
    if (!showLoading) {
        loading = ElementUI.Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }
    return config;
}, error => {
    loading.close();
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    let lastIndex = response.request.responseURL.lastIndexOf('/');
    //取消预警接口select-no-read的页面loading关闭效果
    //response.request.responseURL.substring(lastIndex+1) !== 'select-no-read'||response.request.responseURL.substring(lastIndex+1) !== 'total-amount-sum'
    if (response.request.responseURL.substring(lastIndex + 1) !== 'select-no-read' && response.request.responseURL.substring(lastIndex + 1) !== 'amount-sum'
        && interfaceUrl === response.config.url) {
        loading.close();
    }
    return response
}, function (err) {
    if (err.response.status === 401) {
        router.push({ path: '/login' })
    }
    loading.close();
    return Promise.reject(err)
});
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.mixin({
    beforeRouteLeave: function (to, from, next) {
        let deleteCache = from.meta.param ? from.meta.param.deleteCache : false;
        if (from && deleteCache && from.meta.level === 3) {
            // 三级路由下的缓存未清除问题，//此处判断是否是点击关闭tab，酌情决定是否摧毁本层缓存。
            if (this.$vnode && this.$vnode.parent && this.$vnode.parent.data.keepAlive) {
                if (this.$vnode.parent && this.$vnode.parent.parent && this.$vnode.parent.parent.componentInstance && this.$vnode.parent.parent.componentInstance.cache) {
                    if (this.$vnode.parent.parent) {
                        var key = this.$vnode.parent.key == null
                            ? this.$vnode.parent.componentOptions.Ctor.cid + (this.$vnode.parent.componentOptions.tag ? `::${this.$vnode.parent.componentOptions.tag}` : '')
                            : this.$vnode.parent.key;
                        var cache = this.$vnode.parent.parent.componentInstance.cache;
                        var keys = this.$vnode.parent.parent.componentInstance.keys;
                        if (cache[key]) {
                            if (keys.length) {
                                var index = keys.indexOf(key);
                                if (index > -1) {
                                    keys.splice(index, 1);
                                }
                            }
                            delete cache[key];
                        }
                    }
                }
            }
            this.$destroy();
            from.meta.param.deleteCache = false;
            //from.meta.deleteCache = false;
        }
        next();
    },
});

// Resource
// Vue.use(VueResource);

// vuex
Vue.use(Vuex);

//ElementUI
Vue.use(ElementUI);

Vue.config.productionTip = false;
// axios.defaults.withCredentials = true;
/* eslint-disable no-new */
export default new Vue;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    template: '<App/>',
    components: { App }
});
