<template>
  <div class="navbar">
    <!--<i :class="{'el-icon-menu':true, 'iconTrans':val, 'iconTransAnti':!val}" @click="switchMenu"></i>-->
    <!--<breadcrumb class="breadcrumb-container"></breadcrumb>-->
    <!--<i class="fas fa-sign-out-alt" @click="logout" style="float:right"></i>-->
      <div ref="leftToggle" class="toggleCollapse"><el-button size="small"  :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" @click="switchMenu" ></el-button></div>
      <!--<el-row type="flex" justify="end">
          <el-col :span="1" >
              <el-tooltip class="item" effect="dark" content="登出" placement="right">
                  <a @click="logout">
                      <i class="fas fa-sign-out-alt"  style="font-size:20px;cursor: pointer;"></i>
                  </a>
              </el-tooltip>
          </el-col>
      </el-row>-->
  </div>

</template>

<script>
import Breadcrumb from './breadcrumb'
import main from "../../main"
import api from '../../model/api'
export default {
    components: {
        Breadcrumb
    },
    data() {
        return {
            BigMenu: 180,
            smallMenu: 90,
            isCollapse: false,
            toLeft: 0,
            dataList: {},
            val: false,
            // username:''
        }
    },
    methods: {
        // logout(){
        //     let that = this;
        //     this.$store.dispatch('LogOut').then(res=> {
        //         that.$router.push('/login');
        //         location.reload();
        //     })
        // },
        switchMenu() {
            this.isCollapse = !this.isCollapse;
            if (!this.isCollapse) {
                //展开
                this.toLeft = this.BigMenu;
                this.val = false;
            } else {
                //缩进
                this.toLeft = this.smallMenu;
                this.val = true;
            }
            this.dataList = {'isCollapse': this.isCollapse, 'toLeft': this.toLeft};
            main.$emit('dataList', this.dataList);
            this.$emit('homeLeft', this.dataList);
        }
    },
    mounted(){
        // this.username = localStorage.getItem('username');
    }

}
</script>

<style  lang="scss" scoped>
.navbar {
  /*padding:10px 0px;*/
  border-radius: 0px !important;
  /*margin-bottom: 15px;*/
  background: #FFFFFF;
  .el-icon-menu{
    position: relative;
    top: -19px;
    left: 10px;
    cursor: pointer;
  }
  .iconTransAnti{
    transform: rotate(-90deg);
    -webkit-transition: transform .25s linear;
    -moz-transition: transform .25s linear;
    -o-transition: transform .25s linear;
    transition: transform .25s linear;
  }
  .iconTrans{
    transform: rotate(0deg);
    -webkit-transition: transform .25s linear;
    -moz-transition: transform .25s linear;
    -o-transition: transform .25s linear;
    transition: transform .25s linear;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .toggleCollapse {
    position: fixed;
    top: 42%;
    text-align: center;
    z-index: 9;
    margin-left: -10px;
    .el-button{
        background:#56CD74;
        height: 40px;
        color:#FFFFFF;
        padding: 5px;
        border:none;
    }
    }
}
</style>
