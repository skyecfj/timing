<template>
    <div class="login" id="login">
        <el-form
                :model="loginForm"
                status-icon
                :rules="rules"
                label-position="top"
                ref="loginForm"
                label-width="100px"
                class="loginForm">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="user">
                <el-input size="small"  class="loginInput" type="text" placeholder="请输入用户名" prefix-icon="el-icon-mobile-phone" v-model.trim="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input size="small"  class="loginInput" :type="isType" placeholder="请输入密码" prefix-icon="el-icon-bell" v-model.trim="loginForm.password">
                    <!--<i slot="suffix" class="el-input__icon el-icon-view" ></i>-->
                    <span v-show="!showEye" slot="suffix" @click="psdToggle" style="cursor:pointer;"><i  class="fa fa-eye" ></i></span>
                    <span v-show="showEye" slot="suffix" @click="psdToggle" style="cursor:pointer;"><i  class="fa fa-eye-slash" ></i></span>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small"  type="primary" class="loginButton"  @click="jump">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import api from '../model/api'
    import { getToken, setToken, removeToken } from '@/utils/auth'
    export default {
        name: "login",
        data(){
            return{
                loginForm: {},
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                },
                isType: 'password',
                showEye:true,
            }
        },
        mounted(){
            var that = this;
            this.keyupSubmit();
            sessionStorage.setItem('cacheView',JSON.stringify([]));
            sessionStorage.setItem('withoutCode',false);
            removeToken();
            // this.$store.dispatch('GetUserInfo').then(res => { // 拉取user_info
            //     if(res.code ===200){
            //         this.$store.dispatch('GenerateRoutes', { res }).then(() => { // 根据roles权限生成可访问的路由表
            //             this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
            //             if(!getToken()){
            //                 setToken('allowed');
            //             }
            //             sessionStorage.setItem('withoutCode',true);
            //             // sessionStorage.setItem('cacheView',JSON.stringify([]))
            //             that.showFirstPage();
            //         })
            //     }
            // }).catch((err) => {
            //     // this.$router.push('/login');
            //     // this.$store.dispatch('FedLogOut').then(() => {
            //     //     // this..error(err || 'Verification failed, please login again');
            //     //     // loading.close();
            //     // })
            // })
        },
        methods:{
            keyupSubmit(){
                var that = this;
                document.getElementById('login').onkeydown=e=>{
                    let _key=window.event.keyCode;
                    if(_key===13){
                        that.jump('loginForm')
                    }
                }
            },
            psdToggle(){
                this.isShow = !this.isShow;
                if(this.isShow){
                    this.isType = 'text';
                    this.showEye = false;

                }else {
                    this.isType = 'password';
                    this.showEye = true;
                }
            },
            jump(){
                let that = this;
                this.$refs['loginForm'].validate((valid) => {
                    if(valid){
                      let formData = new FormData();
                      formData.append('username',that.loginForm.username);
                      formData.append('password',that.loginForm.password);
                       this.$store.dispatch('LoginByUsername',formData).then(res=>{
                           that.$router.push({ path: '/home' })
                       });
                    }else{
                        return false;
                    }
                });
            },
            // showFirstPage(){
            //     let firstRouter = '',parent = this.$store.getters.addRouters;
            //     let data = parent[0].children;
            //     for(var i=0;i<data.length;i++){
            //         if(data[i].meta.level && data[i].meta.level ===2){
            //             firstRouter = parent[0].path+'/'+data[i].path;
            //             sessionStorage.setItem('defaultIndex',parent[0].name);
            //             break;
            //         }
            //     }
            //     // sessionStorage.setItem('cacheView',JSON.stringify([]))
            //     this.$router.push(firstRouter);
            // }
        }
    }
</script>

<style  lang="scss">
    $bg: #2d3a4b;
    $bgInp: #454545;
    .login{
        background-color: $bg;
        height: 100%;
        text-align: center;
        .loginForm{
            width: 520px;
            display: inline-block;
            padding: 35px;
            margin: 180px auto;
            .title{
                font-size: 26px;
                color: #eee;
                margin-bottom: 40px;
                font-weight: bold;
            }
            .loginButton{
                width: 100%;
            }
        }
        .loginInput{
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
            .el-input__inner{
                background: transparent;
                color: #eee;
                height: 47px;
            }
        }
    }
</style>
<!--<style lang="scss">-->
    <!--.login{-->

    <!--}-->
<!--</style>-->
