<template>
    <el-scrollbar class="leftMenuScroll" v-bind:class="isCollapse ? 'openSmall':'openBig'">
        <el-menu
                default-active="dataCheck"
                class="el-menu--scroll"
                @open="handleOpen"
                @close="handleClose"
                @select="handleSelectItem"
                :collapse="isCollapse"
                text-color='#FFFFFF'
                :default-openeds=openeds>
            <el-submenu :index="item.name" v-for="(item,index) in navs" :key="index">
                <!--<template >-->
                <div slot="title" class="small-menu">
                    <i :class="getClass(item.name)"> </i>
                    <p :class="isCollapse ? 'collapse-title--block':'collapse-title--inline'">{{item.meta.title}}</p>
                </div>
                <!--</template>-->
                <template v-for="(val,num) in item.children"  v-if="val.meta.level === 2">
                    <el-menu-item-group  v-if="!val.children &&val.meta.level === 2" :key="num">
                        <router-link :to="{path:item.path+'/'+val.path,query:val.meta.param?val.meta.param : null }" class="el-menu-item el-menu-wrap" :style="nav">{{val.meta.title}}</router-link>
                    </el-menu-item-group>
                    <el-submenu :index="val.name"  :key="num" v-if="val.children && val.children.length>0 && val.meta.level === 2">
                        <template slot="title">
                            <router-link v-if="!val.children" :to="{path:item.path+'/'+val.path,query:val.meta.param?val.meta.param : null }" class="el-menu-item el-menu-wrap" :style="nav">
                                {{val.meta.title}}</router-link>
                            <a v-else  class="el-menu-item el-menu-wrap a-inner-level3">{{val.meta.title}}</a>

                        </template>
                        <el-menu-item-group v-for="(val2,num2) in val.children" :key="num2"  class="menu-level3">
                            <a v-if="!val2.meta.type" target="_blank" href="http://www.baidu.com" class="el-menu-item el-menu-wrap a-inner-level3">
                                {{val2.meta && val2.meta.title||'跳转demo'}}
                            </a>
                            <router-link v-else :to="{path:item.path+'/'+val.path+'/'+val2.path,query:val2.meta.param?val2.meta.param : null }" class="el-menu-item el-menu-wrap" :style="nav">
                                {{val2.meta.title}}</router-link>
                        </el-menu-item-group>
                    </el-submenu>
                </template>
            </el-submenu>
        </el-menu>
    </el-scrollbar>

</template>

<script>
    import main from "../../main"
    export default {
        data(){
            return {
                name: 'leftMenu',
                isActive: 'true',
                nav: {
                    minWidth: '179px',
                    display: 'block',
                    color: '#ecf5ff',
                    fontSize: '12px'
                },
                navIcon: {
                    minWidth: '179px',
                    display: 'block',
                    color: '#ecf5ff',
                    marginLeft: '-29px',
                    fontSize: '12px'
                },
                navWrap: {
                    minWidth: '179px',
                    display: 'block',
                    color: '#ecf5ff',
                    lineHeight: '16px',
                    padding: '18px 45px',
                    fontSize: '12px'
                },
                title: '',
                selectItem: {},
                openeds:['dataCheck'],
                isCollapse: false,
                navs:[],
                defaultIndex:''
            }
        },
        beforeMount(){
            this.navs = this.$store.getters.addRouters;
            // console.log(this.navs);
            this.openeds = [sessionStorage.getItem('defaultIndex')];//his.navs[0].name
            // console.log(this.openeds);

        },
        mounted(){
            main.$on('dataList',(data) => {
                this.isCollapse = data.isCollapse;
            });

        },
        methods: {
            getClass(name){
                switch(name){
                    case 'checkBusiness':return ' fas fa-file-alt font24';//'el-icon-document';
                    case 'E-buzCheck': return 'fas fa-search font24';//'el-icon-search';
                    case 'manage':return 'fas fas fa-bell font24';
                    case 'center': return 'fas fa-map-marker-alt font24';
                    case 'taskManage':return 'fas fa-cog font24';
                    case 'masterData': return 'fas fa-database font24';
                    case 'storeDataCenter': return 'fas fa-table font24';
                    case 'E-busDataCenter': return 'fas fa-print font24';
                    case 'E-busReport':return 'fa fa-database font24 ';
                    // case 'DataCheckRes':return 'fa fa-database font24 ';
                    case 'finalReport':return 'fas fa-balance-scale font24 ';
                    case 'salesPromotion':return 'fas fa-chart-pie font24 ';
                    case 'storeBusReport':return 'fas fa-columns font24 ';
                    case 'storeCheck': return 'fas fa-table font24';
                    default:return ;
                }
            },
            refresh(){
//                var that = this
//                var path = this.$route.path
//                this.$router.push({
//                    path,
//                    query: {
//                    t:+new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
//                    }
//                })
            },
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
            handleSelectItem(key,keyPath){

            }
        }
    }
</script>
<style lang="scss">
    .left-nav .el-menu--scroll .el-menu-wrap{
        padding: 12px 45px;
    }
    .left-nav .el-submenu .el-submenu__title .collapse-title--inline {
        font-size: 14px;
        margin-left: 15px;
        display: inline-block;
        white-space: normal;
        max-width: 96px;
        line-height: 18px;
    }
    .left-nav .el-menu--collapse .el-submenu{
        margin-bottom: 10px;
    }
    .el-menu-item, .el-submenu__title {
        height:auto;
        line-height: 40px;
    }
    .left-nav .el-submenu .el-submenu__title .el-submenu__icon-arrow{
        margin-top:-7px;
        margin-right: 0;
    }

    .el-menu--collapse>.el-menu-item span, .el-menu--collapse>.el-submenu>.el-submenu__title span {
        overflow: hidden;
        visibility: visible;
        width:auto;
        height:auto;
    }
    .left-nav .el-submenu .el-submenu__title .collapse-title--block {
        font-size: 12px;
        text-align: center;
        line-height: 14px;
        margin-bottom: 0;
        margin-top:0;
        white-space: normal;
    }
    .leftMenuScroll{
        .el-scrollbar__wrap{
            overflow-x: hidden;
            .el-menu{
                background: transparent;
                border-right:none;
                .el-submenu{
                    .el-menu-item{
                        height: auto;
                        white-space: normal;
                    }
                }
            }
        }
    }
    .openSmall {
        width:90px;
        transition: all .5s;
    }
    .openBig {
        width:180px;
        transition: all .5s;
    }
    .font24{
        font-size:16px;
        margin-left:10px;
    }
    .left-nav .el-menu--scroll .el-menu-item.a-inner-level3{
        padding-left: 42px ;
        font-size:12px;
    }
    .a-inner-level3{
        font-size:12px;
        padding-left: 55px;
        &:hover{
            color:#666;
        }

    }
    .menu-level3{
        font-size:12px;
        a.el-menu-item.el-menu-wrap{
            padding-left: 55px;
        }

    }
    .el-menu-item.el-menu-wrap.router-link-exact-active.router-link-active {
        text-align:left;
        /*padding-left:55px;*/
    }
    .el-submenu .el-menu-item{
        padding:0 38px;
    }
</style>
