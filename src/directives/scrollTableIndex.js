import scrollTable from './scrollTable'

const install = function(Vue) {
    Vue.directive('scrollTable', scrollTable)
}

if (window.Vue) {
    window['scrollTable'] = scrollTable
    Vue.use(install); // eslint-disable-line
}

scrollTable.install = install
export default scrollTable
