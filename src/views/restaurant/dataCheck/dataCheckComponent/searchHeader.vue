<template>
    <div class="search-part-inline" >
        <template v-for="(searchItem,index) in searchConfig.searchConditions">
            <!-- 范围查询条件 -->
            <div  class="selectContent"
                  v-bind:key="index"
                  v-if="searchItem.range" >
                <div class="selectTitle">{{searchItem.label}}</div>
                <!-- 查询类型为日期 -->
                <template v-if="searchItem.type == 'date'" >
                    <el-date-picker type="daterange"
                                    range-separator="-"
                                    value-format="yyyy-MM-dd"
                                    :unlink-panels="true"
                                    v-model.trim="rangeDatas['rengeDate_'+index]"
                                    :clearable="true"
                                    size="small"
                                    start-placeholder="起始时间"
                                    end-placeholder="结束时间"
                                    :picker-options="searchItem.pickOptions? searchItem.pickOptions : null"
                                    @change="changeDateRange(searchItem.prop,'rengeDate_'+index,searchItem.otherConfig.valueKey)" ></el-date-picker>
                    <!-- <el-date-picker  v-model.trim="searchConfig.searchObj[searchItem.prop[0]]"
                                    :type="searchItem.otherConfig.dateTime? 'datetime' : 'date'"
                                    value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                    <span>-</span>
                    <el-date-picker v-model.trim="searchConfig.searchObj[searchItem.prop[1]]"
                                    :type="searchItem.otherConfig.dateTime? 'datetime' : 'date'"
                                    value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>  -->
                </template>
                <!-- 查询类型为输入框 -->
                <template v-if="searchItem.type == 'input'" >
                    <div class="range-input-content" >
                        <el-input size="small" v-model.trim="searchConfig.searchObj[searchItem.prop[0]]" clearable ></el-input>
                        <span>-</span>
                        <el-input size="small" v-model.trim="searchConfig.searchObj[searchItem.prop[1]]" clearable ></el-input>
                    </div>
                </template>
            </div>
            <!-- 非范围查询条件 -->
            <div  class="selectContent"
                  v-bind:key="index"
                  v-if="!searchItem.range" >
                <div v-if="searchItem.type != 'checkBox'" class="selectTitle" >{{searchItem.label}}</div>
                <!-- 查询条件为日期型 -->
                <el-date-picker v-if="searchItem.type == 'date'"
                                v-model.trim="searchConfig.searchObj[searchItem.prop[0]]"
                                :type="searchItem.otherConfig.dateTime? 'datetime' : 'date'"
                                value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                <!-- 查询条件为输入框型 -->
                <el-input  v-if="searchItem.type == 'input'" v-model.trim="searchConfig.searchObj[searchItem.prop[0]]" clearable ></el-input>
                <!-- 查询条件为下拉框型 -->
                <el-select v-if="searchItem.type == 'select'" size="samll" v-model.trim="searchConfig.searchObj[searchItem.prop[0]]"
                           :placeholder="searchItem.otherConfig.placeHolder" :filterable="searchItem.otherConfig.filterable"
                           :remote="searchItem.otherConfig.isRemote" :remote-method="searchItem.otherConfig.remoteMethod"
                           :loading="searchItem.otherConfig.remoteLoading" v-scroll="searchItem.otherConfig.scrollMethod? searchItem.otherConfig.scrollMethod : scrolldefault"
                           @change="selectChange(index)"
                           @visible-change="visibleChange($event,index)"
                           @keyup.native="keyupFn($event,index)" >
                    <el-option label="请选择" value="" ></el-option>
                    <el-option  v-for="(item,selectItemIndex) in searchItem.otherConfig.opts"
                                :key="item[searchItem.otherConfig.optValue]+'_'+selectItemIndex"
                                :label="item[searchItem.otherConfig.optLabel]"
                                :value="item[searchItem.otherConfig.optValue]" ></el-option>
                </el-select>
                <el-checkbox v-if="searchItem.type == 'checkBox'" v-model="searchConfig.searchObj[searchItem.prop[0]]">{{searchItem.label}}</el-checkbox>
            </div>
        </template>
        <slot></slot>
    </div>
</template>
<script>
    import scroll from '@/directives/index'
    export default{
        name  : 'searchHeader',
        props : ['searchConfig'],
        directives: { scroll },
        beforeMount() {},
        mounted() {},
        beforeDestroy(){
            this.resetComponent();
        },
        data() {
            return {
                rangeDatas:{}
            }
        },
        deactivated(){
           //console.log('aaaa'+searchConfig.searchObj.reset);
        },
        watch : {
            searchConfig:{
                handler(val,oldVal){
                    let searchObj = val.searchObj;
                    if(searchObj.reset){
                       this.resetComponent();
                    }
                },
                deep:true
            }    
        },
        methods : {
            resetComponent(){
                let _self = this;
                //清空日期范围值
                for(let rangeDataKey in this.rangeDatas){
                    this.rangeDatas[rangeDataKey] = [];
                }
                //遍历searchObj，重置查询项
                for(let searchKey in this.searchConfig.searchObj){
                    if(searchKey == 'reset'){
                        this.searchConfig.searchObj[searchKey] = false;
                    }else{
                        this.searchConfig.searchObj[searchKey] = null;
                    }
                }
                this.searchConfig.searchConditions.forEach(function(item,index){
                    if(item.otherConfig && item.otherConfig.valueKey){
                        _self.$emit('clearDateRange',item.otherConfig.valueKey);
                    }
                })
            },
            changeDateRange(searchProps,value,valueKey){
                let _self = this;
                var emitObj = {};
                searchProps.forEach(function(item,index){
                    if(_self.rangeDatas[value]){
                        emitObj[item] = _self.rangeDatas[value][index];
                    }else{
                        emitObj[item] = ''
                        _self.$emit('clearDateRange',valueKey);
                    }
                });
                this.$emit('rangeDatechange',emitObj);
            },
            selectChange(searchItemIndex){
                console.log(searchItemIndex);
                if(this.searchConfig.searchConditions[searchItemIndex].otherConfig.changeMethod){
                    this.searchConfig.searchConditions[searchItemIndex].otherConfig.changeMethod();
                }
            },
            visibleChange(isVisible,searchItemIndex){
                //console.log($event.isVisible);
                if(this.searchConfig.searchConditions[searchItemIndex].otherConfig.visibleChange){
                    this.searchConfig.searchConditions[searchItemIndex].otherConfig.visibleChange(isVisible);
                }
            },
            keyupFn(event,searchItemIndex){
                //console.log($event.isVisible);
                if(this.searchConfig.searchConditions[searchItemIndex].otherConfig.keyupFn){
                    this.searchConfig.searchConditions[searchItemIndex].otherConfig.keyupFn(event);
                }
            },
            scrolldefault(){
                return true;
            }
        }
    }
</script>
