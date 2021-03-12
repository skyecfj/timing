<template>
    <el-date-picker
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            v-model="bizDate"
            clearable
            size="small"
            :picker-options="pickerOptions"
            @blur="cleanDate"
            @change="getDate"
    >
    </el-date-picker>
</template>

<script>
    export default {
        name: "limitDateRange",
        props: {
            /**
             * 限制天数：默认30天
             */
            limitDays: {
                type: Number,
                default: 31,
            },
            /**
             * 是否开启限制：默认开启
             */
            isLimit:{
                type:Boolean,
                default:true,
            }
        },
        data(){
            return {
                bizDate:[],
                minDate:'',
                maxDate:'',
                pickerOptions:{
                    onPick:(dateRange)=>{
                        this.minDate =  new Date(dateRange.minDate).getTime();
                        this.maxDate =  new Date(dateRange.maxDate).getTime();
                    },
                }
            }
        },
        watch:{
            minDate(val,oldVal){
                var that = this;
                this.pickerOptions = Object.assign({},{
                    onPick:(dateRange)=>{
                        this.minDate =  new Date(dateRange.minDate).getTime();
                        this.maxDate =  new Date(dateRange.maxDate).getTime();
                    },
                    disabledDate: (time) => {
                        if(that.minDate && this.isLimit){
                            return time.getTime() <= that.minDate-that.limitDays*24*60*60*1000 || time.getTime() >= that.minDate +that.limitDays*24*60*60*1000;
                        }else{
                            return false;
                        }
                    }
                });
            },
            bizDate(val,oldVal){
                if(!val || (val &&val.length === 0)){
                    this.pickerOptions = Object.assign({},{
                        onPick:(dateRange)=>{
                            this.minDate =  new Date(dateRange.minDate).getTime();
                            this.maxDate =  new Date(dateRange.maxDate).getTime();
                        },
                        disabledDate: (time) => {
                            return false;
                        }
                    });
                    this.minDate = '';
                }

            }
        },
        methods:{
            cleanDate(){
                if(!this.maxDate){
                    this.minDate = '';
                    this.bizDate = [];
                }
            },
            getDate(res){
                this.$emit('changeDate',res);
            },
            reset(){
                this.bizDate = [];
            }
        },
        destroyed(){
            this.$off('changeDate')
        }

    }
</script>

<style scoped>

</style>
