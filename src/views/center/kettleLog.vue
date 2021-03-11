<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">jobId</div>
                <el-input v-model="jobId" size="small" clearable placeholder="请输入jobId"></el-input>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset"  class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div v-if="!kettleLogData.log">
                <span>暂无数据</span>
            </div>
             <div v-else>
                <div class="logTitle">日志</div>
                <div class="logJobName">
                    <span>jobName： </span>
                    <span>{{kettleLogData.jobName}}</span>
                </div>
                <div class="logContent">
                    <pre style="white-space: pre-wrap;">{{kettleLogData.log}}</pre>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../model/api'
 export default {
     name:'kettleLog',
     data(){
        return {
         jobId:'',
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         pageLogSize:25,
         kettleLogData:{},
         lastJobId:''
       }
    },
     activated(){
          if((JSON.stringify(this.lastJobId) !== JSON.stringify(this.$route.params.jobId)) && (!this.common.isNullString(this.$route.params.jobId))){
                this.jobId = this.$route.params.jobId
                this.getKettleLogList(this.$route.params.jobId)
          }
        },
        deactivated(){
            this.lastJobId = this.jobId;
        },
    beforeMount(){
        if(this.$route.params.jobId){
            this.jobId = this.$route.params.jobId
            this.getKettleLogList()
        }
    },
     methods:{
         getSearch(){

         },
         search(){
             if(this.common.isNullString(this.jobId)){
                 this.common.warningMessage('请输入jodId')
             }else if(!/^[0-9]+$/.test(this.jobId)){
                 this.common.warningMessage('jodId必须为数字')
             }
             else{
                 this.getKettleLogList();
             }
         },
         reset(){
           this.jobId = ''
         },
         getKettleLogList(){
             var that = this
             api.getKettleLog(this.jobId,function(res){
                        if(res.code === 200)
                        {
                            that.kettleLogData = res.data
                        }
                        else if(res.code == 400){
                            that.kettleLogData = {}
                        }
                        else if(res.code != 400){
                            that.common.warningMessage(res.msg)
                        }
                })
         },
     }
 }
</script>
<style lang="scss" scoped>
    .logTitle{
        font-size: 18px;
        margin-bottom:10px
    }
    .logJobName{
        font-size: 13px;
        margin-bottom:10px
    }
    .logContent{
        max-height: 600px;
        overflow-y: scroll;
    }
</style>
