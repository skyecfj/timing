<template>
    <div class="mainContent">
       <div class="dataContent">
            <span class="selectTitle">通知标题</span>
            <el-input v-model.trim="warnTitle" placeholder="请输入" clearable class="searchTitleInput"></el-input>
            <el-button size="small"  @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"  @click="reset" class="c-button c-button--plain">重置</el-button>
            <div class="notiAllContent">
            <div v-if="messageArray.length == 0" class="noDataContent">无数据</div>
            <div class="notiItem" v-for="(item,index) in messageArray">
                <div class="contentTitle space">
                    {{item.warnTitle}}
                    <span class="deleteButton" @click="deleteMsg(item,index)">删除通知</span>
                </div>
                <div class="contentUser space">
                    <span>{{item.receivePersonName}}</span>,您好
                </div>
                <div class="notiContent space"   v-html="item.warnContext">
                </div>
                <span v-if="item.isPathUrl">请<span @click="check(item.pathUrl)" class="opre">立即查看处理</span>
                </span>
                <el-button v-if="item.attachmentFlag" @click="download(item)" type="text" class="downButton">下载附件 <i class="fa fa-paperclip"></i></el-button>
                <div>
                    <span>{{item.sendTime}}</span>
                </div>
            </div>

            </div>
             <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizeList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../model/api'
    import  ip from '../model/tempIp'
    export  default{
        name:'warnMessage',
        data(){
            return {
                pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                currentPage: 1,
                pageSize:25,
                warnTitle:'',
                messageArray:[]
            }
        },
        beforeMount(){
            this.getMsgList()
            api.updateMsgReadStatus(function(res){

            })
        },
        methods:{
            handleSizeChange:function(size) {
                this.pageSize = size
                this.getMsgList()
            },
            handleCurrentChange:function(currentPage) {
                this.currentPage = currentPage
                this.getMsgList()
            },
            download(item){
                var that = this
                var param = {
                    messageId:item.id
                }
                api.downloadWarnMsgFile(param,'application/vnd.ms-excel',function(res){
                    if(res.code){
                         that.common.warningMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = item.attachmentName;
                        link.target = '_blank';link.click();
                   }
                })
                // window.location.href = ip.warn_ip+'/early-warn-message/down-file?messageId='+item.id
            },
            search(){
              this.currentPage = 1
              this.getMsgList()
            },
            reset(){
              this.warnTitle = ''
            },
            deleteMsg(item,index){
                var that = this
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.messageArray.splice(index,1)
                    api.deleteWarnMsg(item.id,function(res){
                        if(res.code == 200)
                        {
                            that.common.successMessage(res.data)
                        }
                        else{
                            that.common.warningMessage(res.msg)
                        }
                    })
                }).catch(() => {
                 this.common.messageUtil({
                    type: 'info',
                    message: '已取消删除'
                 });
                });
            },
            check(msg){
              this.$router.push(msg)
            },
            getMsgList(){
                var that = this
                var param = [
                 {
                    name:'pageIndex',
                    value:this.currentPage
                 },
                 {
                    name:'pageSize',
                    value:this.pageSize
                },
                {
                    name:'warnTitle',
                    value:this.warnTitle
                }
               ]
               api.getWarnAllMessageList(this.common.joinSearchParam(param),function(res){
                if(res.code == 200){
                   for(var i = 0 ; i < res.data.list.length; i++)
                   {
                       var item = res.data.list[i]
                       var warnContext = item.warnContext
                       if(!that.common.isNullString(warnContext)){
                            if(warnContext.indexOf('$')>0)
                            {
                                item.pathUrl = warnContext.split('$')[1]
                                item.isPathUrl = true
                                item.warnContext=warnContext.split('$')[0]+warnContext.split('$')[2]
                            }
                            else{
                                item.isPathUrl = false
                            }
                       }
                   }
                    that.messageArray = res.data.list
                    that.totalRecords = res.data.totalRecords
                }
                else if(res.code == 404){
                    that.messageArray = []
                    that.totalRecords = 0
                }
              })
            }
        }
    }
</script>
<style scoped  lang="scss">
    .dataContent{
        .selectTitle{
            font-size: 13px;
        }
        .searchTitleInput{
            display:inline-block;
            width: 200px;
            margin: 0 5px;
        }
        .notiAllContent{
            border-top: 1px solid #bbb;
            margin-top: 30px;
            .noDataContent {
                text-align: center;
                font-size: 13px;
                margin-top: 10px;
            }
        }
        .notiItem{
            font-size: 13px;
            padding: 10px 0;
            border-bottom: 1px solid #bbb;
            .space{
              padding-bottom: 5px;
            }
            .contentTitle{

            }
            .contentUser{

            }
            .notiContent{
                display: inline-block;
                word-break: break-all;
                p{
                    display: inline;
                 }
            }
            .deleteButton{
                float: right;
                color:#F72E62;
                cursor: pointer;
            }
            .downButton.el-button{
                padding:0px;
                display: inline;
                margin-left:20px
            }
            .opre{
                display: inline;
                color:#409EFF;
                cursor: pointer;
            }
        }

    }
</style>
