<template>
    <div>
        <div class="dataContent">
        <div class="opreRight">
            <el-button size="small"   @click="newCreate" class="c-button c-button--primary">
                新增
            </el-button>
            <el-button size="small"   @click="deleteSelected" class="c-button c-button--plain--danger">
                删除选中
            </el-button>
        </div>
        <el-tree :data="dataTree" :props="defaultProps"
         @node-click="handleNodeClick"
         @check="checkBox"
         @check-change="checkChange"
         default-expand-all
         show-checkbox
         node-key="departmentId" ref="tree"
         :expand-on-click-node="false"
         :check-strictly="true"
         >
        <span class="customTreeNode" slot-scope="{ node, renderData }">
          <span>{{ node.label }}</span>
            <span type="text" size="mini" class="editNode" @click="editNode(node)">
              编辑
            </span>
        </span>
         </el-tree>
        </div>
         <!--新增-->
        <el-dialog :visible.sync="departmentDialog" class="departmentDialog" width="40%">
        <div slot="title">
          {{departmentDialogTitle}}
        </div>
            <el-form ref="departmentForm" :rules="rules" :model="departmentForm">
                    <span>上级部门(*留空则改部门为一级部门)</span>
                    <el-tree :data="parentDataTree" :props="defaultProps"
                      @node-click="handleParentNodeClick"
                      show-checkbox
                      node-key="departmentId" ref="parentTree"
                      :expand-on-click-node="false"
                      :check-strictly="true"
                      @check="checkParentNode"
                      :default-expand-all= "false"
                      :default-checked-keys="checkedParenrtNode"
                      :default-expanded-keys="defaultPExpandArray"
                      accordion
                      >
                    </el-tree>
                <el-form-item :label="isAdd ? '新增部门名称':'部门名称'" prop="departmentName" class="sectionConetnt">
                    <el-input size="small"  v-model.trim="departmentForm.departmentName" clearable placeholder="请输入新增部门"></el-input>
                </el-form-item>
                <el-form-item label="更新人" class="sectionConetnt" v-if="!isAdd">
                  <el-input size="small" v-model.trim="departmentForm.modifiedUser" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新时间" class="sectionConetnt" v-if="!isAdd">
                  <el-input size="small" v-model.trim="departmentForm.modifiedTime" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="departmentDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"   @click="newAddForm()" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
   </div>
</template>
<script>
  import api from '../../model/api'
  export default {
    name:'departmentChart',
    data() {
      return {
        defaultPKeyArray:[],
        defaultPExpandArray:[],
        deleteCheckedKeys:[],
        departmentDialog:false,
        departmentEditDialog:false,
        departmentDialogTitle:'',
        isAdd:true,
        checkedIndex:1,
        currentCheckedId:'',
        isCurrentChecked:false,
        checkedNodes:[],
        checkedParenrtNode:[],
        departmentForm:{},
        originalForm:{},
        rules:{
            departmentName:[
                { required:true, message: '部门名称不能为空', trigger: ['blur'] }
            ]
        },
        dataTree: [],
        parentDataTree:[],
        defaultProps: {
          children: 'childInfos',
          label: 'departmentName',
          id:'departmentId'
        }
      };
    },
    beforeMount(){
      this.getDepartmentlist()
    },
    methods: {
      handleParentNodeClick(data){

      },
      checkParentNode(data,checked){
        this.checkedParenrtNode = []
        if(checked.checkedKeys.length > 0){
          this.departmentForm.departmentId = data.departmentId
          this.checkedParenrtNode.push(data.departmentId)
        }
        else{
          this.departmentForm.departmentId = ''
        }
        if(this.$refs.parentTree){
              this.$refs.parentTree.setCheckedKeys(this.checkedParenrtNode)
          }
      },
      checkBox(data,checked){
        this.isCurrentChecked = false
        this.checkedNodes = checked.checkedNodes
      },
      checkChange(data,checked){
        if(!this.isCurrentChecked)
        {
            this.isCurrentChecked = true
            this.getDeleteCheckedKeys(data,checked)
            this.$refs.tree.setCheckedKeys(this.deleteCheckedKeys)
        }
      },

      //父选  //子也选
      getCheckedAllKeys(checked,childInfos){
        var that = this
        if(checked){
          if(childInfos){
            childInfos.forEach(function(item,index){
              if(that.deleteCheckedKeys.indexOf(item.departmentId) < 0){
                that.deleteCheckedKeys.push(item.departmentId)
              }
              that.getCheckedAllKeys(checked,item.childInfos)
            })
          }
        }else{
            //父不选 子不选
          if(childInfos){
             childInfos.forEach(function(item,index){
                if(that.deleteCheckedKeys.indexOf(item.departmentId) >= 0)
                {
                  that.deleteCheckedKeys.splice(that.deleteCheckedKeys.indexOf(item.departmentId),1)
                }
                that.getCheckedAllKeys(checked,item.childInfos)
              })
          }
        }
      },

      //不选中 父级也不选中
      deleteParentNode(id){
        var that = this
        if(!this.common.isNullString(id)){
            this.checkedNodes.forEach(function(item,index){
                if(item.departmentId === parseInt(id) && that.deleteCheckedKeys.indexOf(parseInt(item.departmentId)) >= 0)
                {
                  that.deleteCheckedKeys.splice(that.deleteCheckedKeys.indexOf(item.departmentId),1)
                  that.deleteParentNode(item.parentId)
                }
              })
          }
      },

      getDeleteCheckedKeys(data,checked){
        //父选
        //子也选
        var that = this
         if(checked){
           if(this.deleteCheckedKeys.indexOf(data.departmentId) < 0)
           {
             this.deleteCheckedKeys.push(data.departmentId)
           }
           that.getCheckedAllKeys(checked,data.childInfos)
         }else{
           //父不选
           //子不选
           if(this.deleteCheckedKeys.indexOf(data.departmentId) >= 0)
           {
              this.deleteCheckedKeys.splice(this.deleteCheckedKeys.indexOf(data.departmentId),1)
           }
           this.deleteParentNode(data.parentId)
           this.getCheckedAllKeys(checked,data.childInfos)
         }
      },
      handleNodeClick(data) {

      },
      editNode(node){
        var that = this
        this.departmentDialogTitle = '编辑'
        this.isAdd = false
        this.departmentForm = Object.assign({},node.data)
        this.originalForm = Object.assign({},node.data)
        this.checkedParenrtNode = []
        this.checkedParenrtNode.push(parseInt(this.departmentForm.parentId))
        this.departmentForm.departmentId = this.departmentForm.parentId
        this.departmentDialog = true
        this.getDepartmentParentList(true)
        if(this.$refs.departmentForm){
            this.$refs.departmentForm.clearValidate()
        }
        this.defaultPExpandArray = this.checkedParenrtNode
        if(this.$refs.parentTree){
            this.$refs.parentTree.setCheckedKeys(this.checkedParenrtNode)
            this.$refs.parentTree.$forceUpdate()
        }
      },
      deleteSelected(){
        var that = this
        if(this.$refs.tree.getCheckedNodes().length == 0){
          this.common.warningMessage('请选择要删除的部门')
          return
        }
        this.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // console.log('nodes',this.$refs.tree.getCheckedNodes());
              // console.log('keys',this.$refs.tree.getCheckedKeys());
              api.deleteDepartment(that.getCheckedKeys(),function(res){
                if(res.code == 200){
                  that.common.successMessage('删除成功')
                  that.dataTree = JSON.parse(JSON.stringify(res.data))
                  that.renderData = res.data
                  that.deleteCheckedKeys = []
                  that.$refs.tree.setCheckedKeys([])
                }
                else if(res.code == 404){
                  that.dataTree = []
                  that.renderData = []
                  that.parentDataTree = []
                }
                else if(res.code != 404){
                  that.common.warningMessage(res.msg)
                }
              })
          }).catch(() => {
              that.common.infoMessage('已取消删除')
          })
      },
      getCheckedKeys(){
        var checkedKeys =[]
        this.$refs.tree.getCheckedNodes().forEach(function(item,index){
             checkedKeys.push(item.departmentId)
        })
        return checkedKeys
      },
      newCreate(){
        var that = this
        this.departmentDialogTitle = '新增'
        this.isAdd = true
        this.departmentForm = {}
        this.originalForm={}
        this.checkedParenrtNode = []
        if(this.$refs.parentTree){
            this.$refs.parentTree.setCheckedKeys(this.checkedParenrtNode)
        }
        this.getDepartmentParentList(false)
        this.departmentDialog = true
        if(this.$refs.departmentForm){
            this.$refs.departmentForm.clearValidate()
        }
      },
      getDepartmentlist(){
        var that = this
        api.getDepartmentlist(function(res){
          that.dataTree = JSON.parse(JSON.stringify(res.data))
          that.renderData = res.data
        })
      },

      getDepartmentParentList(isDeleteChildInfo){
        var that = this
        api.getDepartmentParentlist(function(res){
          that.parentDataTree = JSON.parse(JSON.stringify(res.data))
          console.log('that.parentDataTreethat.parentDataTree',that.parentDataTree,that.parentDataTree[0],that.parentDataTree[0].modifiedUser,that.parentDataTree[0].modifiedTime)
          // that.departmentForm.modifiedUser = that.parentDataTree[0].modifiedUser
          // // that.departmentForm.modifiedTime = that.parentDataTree[0].modifiedTime
          // that.$set(that.departmentForm,'modifiedTime',that.parentDataTree[0].modifiedTime)
          console.log('that.departmentForm',that.departmentForm)
          if(isDeleteChildInfo){
            that.getDepartmentDisabled(that.parentDataTree)
          }
        })
      },

      getDepartmentDisabled(childInfos){
        var that = this
        if(childInfos){
         childInfos.forEach(function(item,index){
            if(item.departmentId == that.originalForm.departmentId){
              that.$set(item,'disabled',true)
              item.childInfos=[]
              childInfos.splice(index,1)
            }
            else{
              that.$set(item,'disabled',false)
            }
             that.getDepartmentDisabled(item.childInfos)
         })
        }
      },
      newAddForm(){
        var that = this
        this.$refs.departmentForm.validate((valid) => {
          if (valid) {
            var param = {}
            var checkParam = [{
              name:'departmentName',
              value:that.departmentForm.departmentName,
            },{
              name:'parentId',
              value:that.isAdd ? that.departmentForm.departmentId : that.departmentForm.parentId
            }]
            api.checkDepartmentName(that.common.joinSearchParam(checkParam),function(res){
              if(that.originalForm.departmentName == that.departmentForm.departmentName && !that.isAdd){
                  res.data = true
              }
              if(res.data){
                if(that.isAdd){
                  param = {
                    departmentName:that.departmentForm.departmentName,
                    parentId:that.departmentForm.departmentId
                  }
                  api.addDepartment(param,function(res){
                    res.code === 200 ? (that.common.messageUtil({
                      message: res.data,
                      type: 'success'
                    }) ,that.departmentDialog = false,that.getDepartmentlist()):
                      that.common.messageUtil({
                      message: res.msg,
                      type: 'warning'
                    })
                  })
                }
                else{
                  param = {
                      departmentName:that.departmentForm.departmentName,
                      parentId:that.departmentForm.departmentId,
                      id:that.originalForm.departmentId
                  }
                  if(param.parentId == param.id){
                    that.common.warningMessage('不能选择本身为上级部门')
                    return
                  }
                  api.updateDepartment(param,function(res){
                    if(res.code == 200){
                      that.common.successMessage(res.data)
                      that.departmentDialog = false
                      that.getDepartmentlist()
                    }
                    else{
                      that.common.warningMessage(res.msg)
                    }
                  })
                }
              }
              else{
                that.common.warningMessage('同一级的部门名称不能重复')
              }
            })

          }else{
            return false
          }
      })
    }
  }
}

</script>
<style scoped lang="scss">
  .dataContent{
    background-color: white;
    padding: 20px;
    .opreRight{
      text-align: right;
    }
    .customTreeNode {
      vertical-align: middle;
      font-size: 13px;
      margin-top: 3px;
      .editNode {
        color:#56CD74;
        margin-left: 10px
      }
    }
  }
  .departmentDialog {
    .el-form-item .el-select {
      width:100%
     }
  }
  .el-form{
      .sectionConetnt{
        margin-bottom:10px
    }
  }

</style>
