import * as types from './mutations-types'

export default{
    showloader:({ commit }) => {
        commit( types.SHOWLOADING )
    },
    hideloader:({ commit }) => {
        commit( types.HIDELOADING )
    }
}