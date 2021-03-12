<template>
    <div class="home-task">
        <div class="bannerContent">
            <!--<img src="../assets/bannerIcon.png"/>-->
            <span class="bannerTitle">Finance Settlement Center</span>
            <div class="tagUserContent">
                <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
                    <a class="userView" @click="logout">
                        <i class="fas fa-sign-out-alt"  style="font-size:20px;cursor: pointer;"></i>
                    </a>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'用户:'+username+';角色:'+roleNames" placement="bottom">
                    <a class="userView">
                        <i class="fas fa-user"  style="font-size:20px;cursor: pointer;"></i>
                    </a>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="通知" placement="bottom">
                    <a class="userView" @click="getWarnMsg">
                        <i class="fas fa-bell" style="font-size:20px;cursor: pointer;"></i>
                        <div class="notiFlag" v-if="noReadCount"></div>
                    </a>
                </el-tooltip>

                <div class="test-word" v-if="env">
                    测试环境
                </div>
            </div>
        </div>
        <div class="taskContainer">
            <leftNav
                    class="left-nav left-bgNav"
                    v-on:getSelectItem="getSelectItem($event)"
            >
            </leftNav>
            <div class="main-container" :style="'margin-left:'+toLeft+'px'">
                <navBar v-on:homeLeft="homeLeft"></navBar>
                <tagsView></tagsView>
                <appContent></appContent>
            </div>
        </div>
    </div>
</template>
<script>
    import navBar from "./home/navBar.vue"
    import tagsView from "./home/tagsView.vue"
    import leftNav from "./common/leftMenu.vue"
    import appContent from './home/appContent.vue'
    import { getToken, setToken, removeToken } from '@/utils/auth'
    import api from '../model/api'
    export default{
        name: 'home',
        components:{
            leftNav,
            navBar,
            tagsView,
            appContent
        },
        data(){
            return {
                toLeft:180,
                isCollapse:false,
                username:'',
                noReadCount:0,
                intervalTime:600000,
                timer:null,
                roleNames:[],
                env:true
            }
        },
        beforeMount(){
            this.env = process.env.NODE_ENV !== 'pro';
        },
        methods:{
            homeLeft:function (data) {
                this.isCollapse = data.isCollapse;
                this.toLeft=data.toLeft;
            },
            addViewTags(route) {
                if (!route) {
                    return false
                }
                this.$store.dispatch('addVisitedViews', route)
            },
            getUserInfo(){
                var str = sessionStorage.getItem('cacheView')
                var obj = str ? JSON.parse(str) : str
                var that = this
                var isCurrentRoute = false
                if(obj && obj.length >0 ) {
                    obj.forEach(function(item,index){
                        if(item.path == that.$route.path){
                            isCurrentRoute = true
                        }
                        that.addViewTags(item)
                    })
                }
                if(!isCurrentRoute && this.$route.name !== 'home'){
                    this.addViewTags(this.$route)
                }
                this.getNoReadMsg()
                this.getMessageCorn()
            },
            getMessageCorn(){
                var that = this
                api.getDictionaryByNumber('GET_MESSAGE_CORN',function(res){
                    if(res.code === 200){
                        that.intervalTime = parseInt(res.data[0].dictionaryEntryName)*60*1000
                    }
                    that.timer = setInterval(()=>{
                        that.getNoReadMsg()
                    },that.intervalTime)
                })
            },
            getNoReadMsg(){
                var that = this
                api.getWarnNoReadMsg(function(res){
                    if(res.code === 200){
                        that.noReadCount = parseInt(res.data)
                    }else if(res.code === 404)
                    {
                        that.noReadCount = 0
                    }
                })
            },
            getWarnMsg(){
                this.noReadCount = 0
                this.$router.push({name:'warnMessage'})
            },
            logout(){
                let that = this;
                this.$store.dispatch('LogOut').then(res=> {
                    that.$router.push({name:'login',replace:true});
                    location.reload();
                    window.close();
                }).catch(err=>{
                    // console.log('登出异常：',err);
                })
            },
        },
        created(){
        },
        mounted(){
            let that = this;
            this.$nextTick(function(){
                api.getLoginUserInfo(function(res){
                    if(res.code === 200){
                        localStorage.setItem('username',res.data.userName);
                        localStorage.setItem('userId',res.data.userId);
                        localStorage.setItem('roleNames',res.data.roleName);
                        localStorage.setItem('marketType',res.data.marketType)
                        that.username = localStorage.getItem('username');
                        that.roleNames = localStorage.getItem('roleNames');
                    }else{
                        that.common.messageUtil({
                            type:'error',
                            message:res.msg
                        })
                    }
                })
            })
            this.getUserInfo()
        },
        beforeDestroy(){
            clearInterval(this.timer)
        }
    }
</script>
<style lang="scss">
    @import '../assets/scss/home.scss';
    .home-task{
        height:100%;
        .el-header , .el-main{
            padding:0
        }
        .el-aside {
            width:auto !important
        }
        .taskContainer {
            position: relative;
            height: 100%;
        }
        .breadcrumbContainer {
            width:100%;
        }
        .tagsContainer {
            height:40px;
        }
        .main-container {
        	height: calc(100% - 50px);
            transition: margin-left .28s;
            padding-left: 8px;
            /*margin-top: 65px;*/
           padding-top: 60px;
        }
    }
    .bannerContent{
        height:60px;
        position: fixed;
        top: 0;
        z-index: 2005;
        width: 100%;
        /*background: #56CD74;*/
        background: -webkit-linear-gradient(left, #56CD74,#ffffff);
        background:linear-gradient(left, #56CD74,#ffffff);
        border-bottom: 1px solid #ccc;
        img{
            height: 40px;
            width: 40px;
            vertical-align: middle;
            text-align: center;
            margin-left: 20px;
        }
        .bannerTitle {
            line-height:60px;
            color:#FFFFFF;
            font-size: 20px;
            margin-left:20px
        }
    }
    .test-word{
        color:red;
        font-size:16px;
        margin-left:5%;
        font-weight:bold;
    }
    .tagUserContent {
        width:200px;
        display:inline-block;
        vertical-align: middle;
        float: right;
        margin-top:20px;
        .userView {
            float: right;
            margin-right: 10px;
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

</style>
