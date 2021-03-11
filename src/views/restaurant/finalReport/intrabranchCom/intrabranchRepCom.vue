<template>
  <div class="intra-report-direct">
  	<div class="report-info">
      <div class="info-content">
        <div class="info-list">
          <span>公司 ：</span>
          <span>{{ infoData.companyName }}</span>
        </div>
        <div class="info-list">
          <span>结算日期：</span>
          <span>{{ infoData | accountPriod }}</span>
        </div>
        <div class="info-list">
          <span>内部往来结算：</span>
          <span>{{ companyName }}</span>
        </div>
        <div class="info-list">
          <span>促销活动名称：</span>
          <span>{{ infoData.activityName }}</span>
        </div>
      </div>
      <div class="info-content">
        <div class="info-list">
          <span>报告生成日期 ：</span>
          <span>{{ infoData | createDate}}</span>
        </div>
        <div class="info-list">
          <span>报告生成人：</span>
          <span>{{ infoData.createUser }}</span>
        </div>
        <div class="info-list">
          <span>报告提交日期：</span>
          <span>{{ infoData | checkDate }}</span>
        </div>
        <div class="info-list">
          <span>报告提交人：</span>
          <span>{{ infoData.checkUser }}</span>
        </div>
      </div>
      <div class="info-content">
        <div class="info-list">
          <span>报告审批日期 ：</span>
          <span>{{ infoData | auditDate }}</span>
        </div>
        <div class="info-list">
          <span>报告审批人：</span>
          <span>{{ infoData.auditUser }}</span>
        </div>
      </div>
    </div>
    <div class="dataContent">
      <el-table :data="intrabranchInfoData" style="width: 100%" border>
        <el-table-column prop="companyCode" label="JDE CODE"></el-table-column>
        <el-table-column prop="companyName" label="法人公司"></el-table-column>
        <el-table-column prop="balanceAmount" label="结算金额（单位：元）"></el-table-column>
        <el-table-column prop="sendType" label="发送状态" v-if="storeType == 'FR'">
          <template slot-scope="scope">
            <span>{{ scope.row.sendFlag | checkSendState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
        	<template slot-scope="scope">
            <el-button size="small" type="text" @click="downFile(scope.row)">
              <span>下载明细</span>
            </el-button>
            <el-button size="small" type="text" @click="sendEmail(scope.row)" v-if="storeType == 'FR'" style="margin-left:0" >
              <span>发送邮件</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="sendEmailDialog" class="emailContent" width="70%" top="8vh">
      <div slot="title">发送邮件</div>
      <el-form :model="sendEmailForm" label-width="120px" ref="sendEmailForm" :rules="rules">
        <el-form-item label="标题" prop="emailTitle	">
        	<div class="item-width">
            <el-input size="small"  placeholder="" v-model="sendEmailForm.emailTitle"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="收件人" prop="receiveUserMail">
        	<div class="item-width">
            <el-input size="small"  placeholder="" v-model="sendEmailForm.receiveUserMail"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="抄送人" prop="ccUserMail	">
        	<div class="item-width">
            <el-input size="small"  placeholder="" v-model="sendEmailForm.ccUserMail"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="正文">
          <div class="editor-container">
            <el-input type="textarea" size="small" :autosize="{ minRows: 8, maxRows: 10}" v-model.trim="sendEmailForm.emailContext"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="附件">
          <el-tag
            v-for="tag in sendEmailForm.emailAttachmentDTOList"
            :key="tag.fileName"
            closable
            type="success"
            @close="handleClose(tag)">
            {{tag.fileName}}
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"  @click="sendEmailDialog = false" class="c-button c-button--plain">取消</el-button>
        <el-button size="small"  type="" @click="submits('sendEmailForm')" class="c-button c-button--primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apidr from '@/model/apidr'

export default {
  data () {
    var validateEmail = (rule, value, callback) => {
      if (value == '' || value == null) {
        callback(new Error('请输入收件人邮箱'))
      } else {
      	var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
        if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确'))
        }
        callback();
      }
    }
    return {
      sendEmailDialog: false,
      sendEmailForm: {
        receiveUserMail: '',
        ccUserMail: '',
        financialManagerUser: '',
        activityManagerUser: '',
        emailTitle: '',
        emailContext: '',
        sendUserMail: '',
        emailAttachmentDTOList: []
      },
      rules: {
        receiveUserMail: [{ validator: validateEmail, trigger: 'blur'}]
      },
      closable: true,
      currentId: '',
      currentSendEmailObj : {}
    }
  },
  props: ['infoData', 'intrabranchInfoData', 'storeType'],
  computed: {
    companyName () {
      return this.storeType == '!FR' ? '付直营' : '付加盟'
    }
  },
  methods: {
  	downFile (rowObj) {
      let that = this;
      let nameArr = rowObj.filePath.split('/');
      let fileName = nameArr[nameArr.length - 1];
      nameArr.splice(nameArr.length - 1, 1);
      let filePath = nameArr.join('/');
      let param = {
        fileName : fileName,
        filePath : filePath
      }
      apidr.downBalanceList(param, 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = fileName
          link.target = '_blank';link.click()
        }
      })
  		//  apidr.getDownFilePath(this.common.joinSearchParam(pathParam), function(res){
      //   if (res.code === 200) {
      //     that.downFileList(res.data)
      //   }else if (res.code != 404) {
      //     that.showTips(res.msg,'warning')
      //   }
      // })
  	},
  	sendEmail (rowObj) {
      this.currentId = rowObj.id
      this.currentSendEmailObj = Object.assign({},{
        companyCode : rowObj.companyCode,
        uuidCode    : rowObj.uuidCode
      }) 
      this.sendEmailDialog = true
      this.getInsideEmailDetail(rowObj)
    },
    handleClose(tag) {
      this.sendEmailForm.emailAttachmentDTOList.splice(this.sendEmailForm.emailAttachmentDTOList.indexOf(tag), 1);
    },
    submits (form) {
      let _self = this;
      this.$refs[form].validate((valid) => {
        if(valid){
          if(!this[form].needPassword){
            _self.sendEmailInfo()
          }else{
            this.$prompt('请输入邮箱密码', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputType: 'password',
              inputPattern: /\S/,
              inputErrorMessage: '邮箱密码不能为空'
            }).then(({ value }) => {
              let mainId = _self.$route.query.id
              _self.sendEmailForm.password = value
              _self.sendEmailForm.id = mainId
              _self.sendEmailForm.detailId = _self.currentId
              _self.sendEmailInfo()
            }).catch(() => {
              //
            })
          }
        } else {
          return false
        }
      })
    },
    getInsideEmailDetail (rowObj) {
      let that = this
      let pathParam = [{
        name: 'promotionId',
        value: this.infoData.id
      }, {
        name: 'companyCode',
        value: rowObj.companyCode
      }, {
        name: 'uuidCode',
        value: rowObj.uuidCode
      }]
      apidr.getInsideEmailDetail(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          let sendEmailForm = res.data
          let str = sendEmailForm.emailContext
          sendEmailForm.emailContext = str.replace(/\\n/g, '\r\n')
          that.sendEmailForm = sendEmailForm
        }else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    sendEmailInfo () {
      let that = this
      let param = Object.assign(this.sendEmailForm,{
        companyCode : this.currentSendEmailObj.companyCode,
        uuidCode    : this.currentSendEmailObj.uuidCode
      });
      apidr.sendInsideEmail(param, function(res){
        if (res.code === 200) {
          that.showTips('发送成功','success')
          that.sendEmailDialog = false
        }else{
          that.showTips(res.msg,'warning')
        }
      })
    },
    downFileList (filePath) {
      let that = this
      apidr.downBalanceList(filePath, 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = filePath.fileName
          link.target = '_blank';link.click()
        }
      })
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  filters: {
  	checkSendState (val) {
  	  return val == '0' ? '未发送' : '已发送'
  	},
  	accountPriod (val) {
    	if (JSON.stringify(val) == '{}' || val.balanceStartDate === null) return ''
      let balanceStartDate = val.balanceStartDate
  	  let balanceEndDate = val.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
    },
    createDate (val) {
      if (JSON.stringify(val) == '{}' || val.createTime === null ) return ''
      return val.createTime.split(' ')[0]
    },
    checkDate (val) {
    	if (JSON.stringify(val) == '{}' || val.checkTime === null) return ''
    	return val.checkTime.split(' ')[0]
    },
    auditDate (val) {
      if (JSON.stringify(val) == '{}' || val.auditTime === null) return ''
      return val.auditTime.split(' ')[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.report-info {
  .info-content {
    .info-list {
      margin-bottom: 10px;
      span {
        font-size: 13px;
      }
    }
  }
  .info-content:last-child {
    vertical-align: top;
  }
}
</style>
