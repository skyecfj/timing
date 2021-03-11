<template>
    <el-select size="small" v-model="modelValue" :placeholder="placeholder||'请选择'" remote :remote-method="remoteStoreHypId"
                filterable v-scroll="bindScroll" @visible-change="visibleChange" :disabled="disabled"
               @keyup.native="focusFn" @change="changeFn" :value-key="showObjectModel?'jdeCode':null">
        <el-option label="请选择" value=""></el-option>
        <el-option  v-for="(item,index) in storeHypIdOpt" :key="index" :label="customType?customString(1,item[optValue],item[optLabel]):item[optLabel]"
                   :value="showObjectModel?item:item[optValue]" >
            <slot></slot>
        </el-option>
        <el-option v-show="loadingStoreHypId" v-loading label="加载中..." style="text-align:center" :value="null"></el-option>
    </el-select>
</template>

<script>
    import scroll from '@/directives/index'
    import ip from '@/model/api'
    export default {
        name: "remoteSelect",
        directives: {scroll},
        props:{
            placeholder:{
                type:String,
                default:''
            },
            refLabel:{
                type:String,
                default:''
            },
            remoteFn:{
                type:String,
                default:''
            },
            remoteFnParam:{
                type:String,
                default:null
            },
            optLabel:{
                type:String,
                default:''
            },
            optValue:{
                type:String,
                default:''
            },
            getChangeData:{
                type:Function,
                default:function () {

                }
            },
            type:{
                type:Number
            },
            customLabel:{
                type:Boolean,
                default:false
            },
            customType:{
                type:Number,
            },
            selectedFirst:{
                type:Boolean,
                default:false
            },
            showFirst: {
                type:Boolean,
                default:false
            },
            paramFromParentLabel:{
                type:String,
                default:''
            },
            paramFromParentVal:{
                type:String,
                default:''
            },
            showItemOrNot:{
                type:Boolean,
                default:false
            },
            disabled:{
                type:Boolean,
                default:false
            },
            judgePermission:{
                type:Boolean,
                default:false
            },
            showObjectModel:{
                type:Boolean,
                default:false
            },
            param:{
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data(){
            return {
                scrollFlag:true,
                loadingStoreHypId:false,
                listPageIndex: 1,
                storeHypIdOpt:[],
                temString:'',
                selectObj: {},
                modelValue:'',
                flagSelect:false,
                remoteFlag:true,
                showObj:[],//回显对象
                showItemFromParent:false
            }
        },
        methods:{
            customString(num,value,label){
                switch(num) {
                    case 1:return '['+value+']'+label;
                    default:return ;
                }
            },
            reset(){
                this.modelValue = '';
                if(Object.keys(this.param)){
                    for (let val in this.param){
                        this.param[val] = '';
                    }
                }
                if(Object.keys(this.param)?!!Object.values(this.param)[0]:true){
                    this.remoteStoreHypId();
                }else{
                    this.storeHypIdOpt = [];
                }
            },
            getParam(){
                if(this.type > 0){
                    switch (this.type) {
                        case 1:return { //餐厅编号
                            storeName:this.temString,
                            pageSize: 20,
                            pageIndex: this.listPageIndex,
                            judgePermission: this.judgePermission
                        };
                        case 2:return this.common.joinSearchParam([
                            {
                                value:this.temString,
                                name:'companyName'
                            },
                            {
                                value:20,
                                name:'pageSize'
                            },
                            {
                                value:this.listPageIndex,
                                name:'pageIndex'
                            },
                            {
                                value:this.judgePermission,
                                name:'judgePermission'
                            },
                            {
                                name:'marketId',
                                value:Object.values(this.param)?Object.values(this.param)[0]:'',
                            }
                        ])
                        case 3:return this.common.joinSearchParam([
                            {
                                value:this.temString,
                                name:'customerName'
                            },
                            {
                                value:20,
                                name:'pageSize'
                            },
                            {
                                value:this.listPageIndex,
                                name:'pageIndex'
                            }
                        ])
                        // case 3:return { //财务市场
                        //     marketCategory:544,
                        //     storeHypId:this.temString
                        // };
                        // case 4:return { //开票单位
                        //     storeHypId:this.temString
                        // };
                    }
                }

            },
            showItem(val){  //下拉框回显问题 单独去调用一次会回显的list 该list length 为 1
                let that = this;
                this.showItemFromParent = true;
                ip[this.remoteFn]('?'+this.optValue+'='+val, function (res) {
                    if (res.data.list){
                        that.storeHypIdOpt = that.showObj = res.data.list;
                    } else{
                        that.storeHypIdOpt = that.showObj = res.data;
                    }
                    that.modelValue = val;
                })
            },
            bindScroll(param, object) {
                if (param && this.remoteFlag) {
                 this.remoteFlag = false;
                 this.loadingStoreHypId = true;
                    var that = this;
                    this.selectObj = object;
                    if (this.scrollFlag) {
                        this.listPageIndex++;
                        ip[this.remoteFn](this.getParam(), function (res) {
                            if (res.code === 200) {
                                that.remoteFlag = true;
                                if (res.data.list){
                                    that.storeHypIdOpt = that.storeHypIdOpt.concat(res.data.list);
                                } else{
                                    that.storeHypIdOpt = that.storeHypIdOpt.concat(res.data);
                                }
                                if(that.showObj && that.showObj.length>0  && !_.isUndefined(that.storeHypIdOpt.find(x=>{return x[that.optValue] === that.showObj[0][that.optValue] }))){
                                    that.storeHypIdOpt.shift();
                                    that.showObj = [];
                                }
                            } else if (res.code === 404) {
                                that.scrollFlag = false;
                            }
                            that.loadingStoreHypId = false;
                        },{},true)
                    }
                }
            },
            remoteStoreHypId(val) {
                let that = this;
                this.temString = val;
                this.listPageIndex = 1;
                if (JSON.stringify(this.selectObj) !== '{}') {
                    this.selectObj.scrollTop = 0;
                }
                setTimeout(()=>{
                    ip[this.remoteFn](this.getParam(), function (res) {
                        if (res.code === 200) {
                            if (res.data.list){
                                that.storeHypIdOpt = res.data.list;
                            } else{
                                that.storeHypIdOpt = res.data;
                            }
                            if(that.selectedFirst && that.flagSelect ){
                                let firstValue = that.storeHypIdOpt[0][that.optValue];
                                if (!that.showFirst) {
                                    that.modelValue = ''
                                } else {
                                    that.modelValue = firstValue
                                }
                                that.$emit('getChangeData',{first:true,val:firstValue});
                                that.flagSelect = false;
                            }
                            if(that.showObj && that.showObj.length>0  && _.isUndefined(that.storeHypIdOpt.find(x=>{return x[that.optValue] === that.showObj[0][that.optValue] }))){
                                that.storeHypIdOpt[0] = (that.showObj[0]);//回显对象放进返回对象里,，如果第一次回显的时候，返回的数据里没有该条数据
                                that.showItemFromParent = false;
                            }
                        } else if (res.code === 404) {
                            that.storeHypIdOpt = [];
                        }
                        // that.storeHypIdOpt = res.data
                    },{},true)
                },500)

            },
            visibleChange(param) {
                if(Object.keys(this.param).length > 0?!!Object.values(this.param)[0]:true){
                    if (!param && !this.storeCode) {
                        this.remoteStoreHypId();
                        this.temString = '';
                    }else {
                        this.remoteStoreHypId(this.storeCode);
                    }
                }
            },
            focusFn(param) {
                if (!param.target.value) {
                    this.temString = '';
                    this.remoteStoreHypId();
                }
            },
            changeFn(res){
                this.$emit('getChangeData',res)
            }
        },
        mounted(){
            if(this.selectedFirst){ //默认选择第一个时调用
                this.flagSelect = true;
                this.visibleChange();
                // this.$emit('getChangeData',this.modelValue)
            }
        },
    }
</script>

<style scoped>

</style>
