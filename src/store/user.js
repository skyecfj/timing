// import { login, logout, getPermissionPaths } from '../model/api'
import api from '../model/api'
import apidr from '../model/apidr'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {Message} from 'element-ui'

const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        },
        permissionBtn: [],
        dataAuthorities: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_BTNS: (state, btns) => {
            state.permissionBtn = btns;
        },
        SET_DATA_POWER: (state, data) => {
            state.dataAuthorities = data;
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                api.login(userInfo, function (res) {
                    commit('SET_TOKEN', 'allowed');
                    // localStorage.setItem('username',userInfo.get('username'))
                    // api.getLoginUserInfo(function(res){
                    //     localStorage.setItem('username',res.data.userName);
                    //     localStorage.setItem('roleNames',res.data.roleName)
                    // });
                    setToken('allowed');
                    Message.success(
                        {
                            message: res.msg
                        }
                    );
                    resolve(res);
                }, function (res) {
                    Message.error(
                        {
                            message: res.msg
                        }
                    )
                })
            })
        },

        // 获取用户信息
        GetUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                api.getPermissionPath(function (res) {
                    // commit('SET_ROLES', res.data);
                    // sessionStorage.setItem('cacheView',JSON.stringify([]));
                    if (res.data && res.data.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', res.data)
                    } else {
                        // reject(res.msg)
                        commit('SET_ROLES', [])
                    }
                    resolve(res);
                });
            })
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                api.logout(function (res) {
                    commit('SET_TOKEN', 'not-allowed');
                    removeToken();
                    commit('SET_ROLES', []);
                    commit('SET_ROUTERS', []);
                    localStorage.removeItem('username');
                    localStorage.removeItem('roleNames')
                    sessionStorage.removeItem('cacheView');
                    sessionStorage.removeItem('withoutCode');
                    sessionStorage.removeItem('defaultIndex');
                    removeToken();
                    Message.success(
                        {
                            message: res.msg
                        }
                    );
                    resolve(res)
                }, function (res) {
                    Message.error(
                        {
                            message: res.msg
                        }
                    )
                })
            })
        },
        //前端退出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                removeToken()
                resolve()
            })
        },
        getDataPower({commit, state}) {
            return new Promise((resolve, reject) => {
                api.getLoginUserInfo(function (res) {
                    if (res.code === 200) {
                        commit('SET_DATA_POWER', res.data.dataAuthorities);
                        localStorage.setItem('dataAuthorities', res.data.dataAuthorities)
                    } else {
                        commit('SET_DATA_POWER', []);
                    }
                    resolve(res);
                })
            })
        },
        getPermissionBtnbs({commit, state}) {
            return new Promise((resolve, reject) => {
                apidr.getOtherPermission(function (res) {
                    if (res.code === 200) {
                        commit('SET_BTNS', res.data);
                        localStorage.setItem('permissionBtns', res.data)
                    } else {
                        commit('SET_BTNS', []);
                    }
                    resolve(res);
                })
            })
        }
    }
}

export default user
