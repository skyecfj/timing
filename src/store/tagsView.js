import Vue from 'vue'
const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: ['level2Index'] //缓存三级菜单的时候，要先缓存二级菜单。临时用，后期需求变了再优化
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      var isPush = true
      var fullPathName = ''
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
            Vue.set(state.visitedViews[i],'path',view.path)
            Vue.set(state.visitedViews[i],'fullPath',view.fullPath)
            Vue.set(state.visitedViews[i],'query',view.query)
            Vue.set(state.visitedViews[i],'fullPathName',view.fullPathName)
            if(view.matched){
              for(let j in view.matched){
                if(j == view.matched.length - 1)
                {
                  fullPathName += view.matched[j].meta.title
                }
                else {
                  fullPathName += view.matched[j].meta.title + ' / '
                }
              }
              Vue.set(state.visitedViews[i],'fullPathName',fullPathName)
            }

            if(view.params && view.params.parentRoute){
              Vue.set(state.visitedViews[i],'params',view.params)
            }
            Vue.set(state.visitedViews,i,state.visitedViews[i])
            isPush = false
            break
        }
      }
      if(!isPush) return;
      fullPathName = view.fullPathName ? view.fullPathName :''
      if(view.matched){
        for(let j in view.matched){
          if(j == view.matched.length - 1)
          {
            fullPathName += view.matched[j].meta.title
          }
          else {
            fullPathName += view.matched[j].meta.title + ' / '
          }
        }
      }

      state.visitedViews.push(Object.assign({}, view, {
        name: view.name || 'no-name',
        fullPathName:fullPathName || 'no-name'
      }))
      if (view.meta && view.meta.keepAlive) {
        state.cachedViews.push(view.name)
      }
    },

    DEL_VISITED_VIEWS: (state, view) => {
      var str = sessionStorage.getItem('cacheView')
      var obj = str?JSON.parse(str):str
      if(obj){
        for (const i of obj) {
          if (i.path === view.path) {
            const index = obj.indexOf(i)
            obj.splice(index, 1)
            sessionStorage.setItem('cacheView',JSON.stringify(obj))
            break
          }
        }
      }

      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break
        }
      }

      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    DEL_CASHED_VIEWS: (state, view) => {
        for (const i of state.cachedViews) {
            if (i === view) {
                const index = state.cachedViews.indexOf(i)
                state.cachedViews.splice(index, 1)
                break
            }
        }
    },
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view);
        resolve([...state.visitedViews])
      })
    },
    delCashedViews({ commit, state }, view) {
          return new Promise((resolve) => {
              commit('DEL_CASHED_VIEWS', view);
              resolve([...state.visitedViews])
          })
      }

  }
};

export default tagsView
