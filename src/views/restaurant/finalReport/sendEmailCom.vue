<template>
  <el-dialog :visible.sync="sendEmailDialog" @close="close" class="emailContent" width="70%" top="8vh">
    <div slot="title">发送邮件</div>
    <el-form :model="sendEmailForm" label-width="120px" ref="sendEmailForm" :rules="rules">
      <el-form-item label="标题" prop="emailTitle	">
      	<div class="item-width">
          <el-input size="small"  placeholder="" v-model="sendEmailForm.emailTitle"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="发件人" prop="sendUserMail	">
      	<div class="item-width">
          <el-input size="small"  placeholder="" v-model="sendEmailForm.sendUserMail" disabled></el-input>
        </div>
      </el-form-item>
      <el-form-item label="收件人" prop="receiveUserMail">
      	<div class="item-width">
     	  <el-input size="small"  placeholder="" v-model="sendEmailForm.receiveUserMail"></el-input>
       	</div>
      </el-form-item>
     <el-form-item label="抄送" prop="ccUserMail	">
      	<div class="item-width">
          <el-input size="small"  placeholder="" v-model="sendEmailForm.ccUserMail"></el-input>
        </div>
     </el-form-item>
      <el-form-item label="正文">
        <div class="editor-container">
          <el-input id="textarea" type="textarea" size="small" :autosize="{ minRows: 8, maxRows: 10}" v-model="sendEmailForm.emailContext"></el-input>
          <!--<textarea name="" rows="10" cols="" style="width: 100%;">你好/br你好</textarea>-->
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
</template>

<script>
import apidr from '@/model/apidr'

export default {
  name: 'sendEmailCom',
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
      rules: {
        receiveUserMail: [{ validator: validateEmail, trigger: 'blur'}]
      },
      closable: true,
      emailInfo: {}
    }
  },
  props: ['isShow', 'sendEmailForm','notNeedPassword'],
  watch: {
    isShow (val) {
      this.sendEmailDialog = val
    },
    sendEmailForm (val) {
      let str = val.emailContext
      this.sendEmailForm.emailContext = str.replace(/\\n/g, '\r\n')
    }
  },
  methods: {
    submits (form) {
      let _self = this;
      this.$refs[form].validate((valid) => {
        if(valid){
          if(_self.notNeedPassword){
            _self.sendEmailInfo()
          }else{
            _self.$prompt('请输入邮箱密码', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputType: 'password',
              inputPattern: /\S/,
              inputErrorMessage: '邮箱密码不能为空'
            }).then(({ value }) => {
              _self.sendEmailForm.password = value
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
    handleClose(tag) {
      this.sendEmailForm.emailAttachmentDTOList.splice(this.sendEmailForm.emailAttachmentDTOList.indexOf(tag), 1);
    },
    close () {
      this.$emit('close')
    },
    sendEmailInfo () {
      let that = this
      apidr.sendEmail(this.sendEmailForm, function(res){
        if (res.code === 200) {
          that.showTips('发送成功','success')
          that.sendEmailDialog = false
        }else{
          that.showTips(res.msg,'warning')
        }
      })
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  }
}
</script>

<style>
</style>