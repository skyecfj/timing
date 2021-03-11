<template>
  <div class="tagsViewContent">
    <div class="tags-view-container">
      <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
        <div class="tags-view-section" :class="isActive(tag)?'active':''" v-for="tag in visitedViews">
          <el-tooltip class="item" effect="dark" :content="tag.fullPathName" placement="top">
          <span>
            <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''"
              :to="tag" :key="tag.path">
              <span class="tags-item-span" :class="isActive(tag)?'active':''">{{tag.meta.title||'首页'}}</span>
            </router-link>
            <span v-if="visitedViews.length == 1"></span>
            <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)' v-else></span>
          </span>
          </el-tooltip>
        </div>
      </scroll-pane>
    </div>

  </div>
</template>

<script>
import ScrollPane from './scrollPane'
import api from '../../model/api'

export default {
  components: { ScrollPane },
  data() {
    return {
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      var str = sessionStorage.getItem('cacheView');
      var obj = str?JSON.parse(str):str;
      if(obj){
        if(obj.length == 0 && this.$store.state.tagsView.visitedViews){
          sessionStorage.setItem('cacheView',this.getCacheView());
        }
        if(obj.length>0){
          if((this.$store.state.tagsView.visitedViews.length == obj.length) ||(this.$store.state.tagsView.visitedViews.length > obj.length && obj.length == 1))
          {
            return this.$store.state.tagsView.visitedViews
          }
          return obj
        }
      }else{
         sessionStorage.setItem('cacheView',this.getCacheView());
      }
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
        this.addViewTags(this.$route);
        this.moveToCurrentTag();
        sessionStorage.setItem('cacheView',this.getCacheView());
    }
  },
  methods: {
    getCacheView(){
       var that = this
       var visitedArray = []
       if(this.$store.state.tagsView.visitedViews)
      {
        this.$store.state.tagsView.visitedViews.forEach(function(item,index){
            var visitedView = {}
            var fullPathName = ''
            visitedView.fullPath = item.fullPath
            visitedView.path = item.path
            visitedView.query = item.query
            visitedView.meta = item.meta
            visitedView.name = item.name
            visitedView.params = item.params
            visitedView.hash = item.hash
            visitedView.fullPathName = item.fullPathName
            if(item.matched){
              for(let j in item.matched){
                if(j == item.matched.length - 1)
                {
                  fullPathName += item.matched[j].meta.title
                }
                else {
                  fullPathName += item.matched[j].meta.title + ' / '
                }
              }
              visitedView.fullPathName = fullPathName
              item.fullPathName = fullPathName
            }
            // visitedView.matched = item.matched
            visitedArray.push(visitedView)
        })
        return JSON.stringify(visitedArray)
      }
      return visitedArray
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags(route) {
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      if(tags){
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el);
              break
            }
          }
        })
      }
    },
    closeSelectedTag(view) {
      let _self = this;
      if(this.$route.meta.param){
        this.$route.meta.param = Object.assign(this.$route.meta.param,{
          deleteCache : true
        })
      }else{
        this.$route.meta.param = {
          deleteCache : true
        }
      }
      
      if(view.fullPath !== this.$route.fullPath ){
          if(view.matched){
              let obj = view.matched.find(x=>{return x.name === view.name});
              if(obj &&  obj.instances && obj.instances.default){
                  let instance = obj.instances.default;
                  if (instance.$vnode &&instance.$vnode.parent && instance.$vnode.parent.data.keepAlive) {
                      if (instance.$vnode.parent&&instance.$vnode.parent.parent && instance.$vnode.parent.parent.componentInstance && instance.$vnode.parent.parent.componentInstance.cache) {
                          if(instance.$vnode.parent.parent){
                              var key = instance.$vnode.parent.key == null
                                  ? instance.$vnode.parent.componentOptions.Ctor.cid + (instance.$vnode.parent.componentOptions.tag ? `::${instance.$vnode.parent.componentOptions.tag}` : '')
                                  : instance.$vnode.parent.key;
                              var cache = instance.$vnode.parent.parent.componentInstance.cache;
                              var keys = instance.$vnode.parent.parent.componentInstance.keys;
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
              }
          }
      }
      //_self.common.deleteTag(view,_self);
      setTimeout(function(){
        _self.common.deleteTag(view,_self);
      },300)

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$tagViewHeight:40px;
.tagsViewContent {
  height:$tagViewHeight;
  margin-top: 5px;
}
.tagUserContent {
    width:15%;
    height:$tagViewHeight;
    line-height:$tagViewHeight;
    display:inline-block;
    vertical-align: middle;
    float: right;
  .userView {
    float: right;
    margin-right: 5%;
    i{
      font-size:20px;cursor: pointer;
    }
    .notiFlag{
      width: 8px;
      height: 8px;
      background: red;
      display: inline-block;
      margin-bottom: 10px;
      margin-left: -5px;
      border-radius: 4px;
    }
  }
}
.tags-view-container {
  /*display:inline-block;*/
  a{
    text-decoration: none;
  }
  .tags-view-wrapper {
    height: $tagViewHeight;
    .tags-view-section {
      display:inline-block;
      padding: 0 8px;
      cursor: pointer;
      height: $tagViewHeight;
      line-height: $tagViewHeight;
      margin-right: 10px;
      background-color: #E4E4E4;
       &.active {
        background-color: #FFFFFF;
      }
      .tags-item-span{
        font-size:13px;
         &.active {
           color:#56CD74
           &:foucs {
             outline: none;
           }
         }
         &:foucs {
           outline: none;
         }
      }
      .el-icon-close {
        width: 12px;
        height: 12px;
        font-size:13px;
        border-radius: 50%;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        background-color: #999999;
        color: #FFFFFF;
        margin-left: 5px;
        &:before {
          transform: scale(.6);
          display: inline-block;
          margin-top: -1px;
        }
      }
    }
    .tags-view-item {
      color: #495060;
      max-width: 100px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
    .test-word{
        color:red;
        font-size:16px;
        margin-left:5%;
        font-weight:bold;
    }
</style>
