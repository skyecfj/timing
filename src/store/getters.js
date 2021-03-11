const getters = {
    showLoading(state){
        return state.showLoading
    },
    visitedViews: state => {
        return state.tagsView.visitedViews
    },
    // permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    token: state => state.user.token,
    // avatar: state => state.user.avatar,
    // name: state => state.user.name,
    // introduction: state => state.user.introduction,
    // status: state => state.user.status,
    roles: state => state.user.roles,
    permissionBtns: state =>state.user.permissionBtn,
    dataAuthorities: state =>state.user.permissionBtn,
    // setting: state => state.user.setting,
};
export default getters
