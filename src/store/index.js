import Vue from 'vue'
import Vuex from 'vuex'

//import state from './state'
import actions from './actions'
import mutations from './mutations'
import tagsView from './tagsView'
import getters from './getters'
import user from './user'
import permission from './permission'

Vue.use(Vuex);

export default new Vuex.Store({
    //state,
    modules:{
        mutations,
        tagsView,
        user,
        permission
    },
    getters
})