<template>
  <div :data-id="rightTblConfig.requiredSearchObj.checkStatus">
    <el-table ref="rightTbl" :data="rightTblData" style="width: 100%" :border="true" @selection-change="handleRightSelectionChange" 
              :row-class-name="tableRowClassName" @row-dblclick="rightTblClick" :height="tblHeight" v-loading="loadingSingle"
              element-loading-text="Loading">
      <el-table-column  v-if="rightTblConfig.requiredSearchObj.checkStatus === 0" fixed="left" width="38px" class-name="left-check-column" type="selection" key='tblCheckBox'>
      </el-table-column>
      <el-table-column  v-else-if="rightTblConfig.requiredSearchObj.checkStatus === 1"  fixed="left" width="38px" class-name="left-checked-column" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.seleted" @change="(val)=>{handleRightCheckedDatasChange(val,scope.row.id)}" ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column  v-for="(headerItem,index) in rightTHeaderConfig.labels" align="center"
                        :width="calTheadWidth(pageUtil.tblSearchConfigs[rightTblConfig.dataType][index])"
                        v-bind:key="index"
                        :prop="rightTHeaderConfig.props[index]"
                        :label="headerItem">
        <template slot="header" slot-scope="scope">
          <div v-if="tblSearchConfigs[index].type == 'date'" class="header-search header-date-search" >
            <p class="header-label" >{{headerItem}}</p>
            <el-date-picker  type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                             v-model="rightTblSearchObj[tblSearchConfigs[index].prop[0]]" 
                             v-on:change="$emit('toogleRefreshRightTbl',true,rightTempSelectedDatas)"></el-date-picker>
          </div>
          <div v-if="tblSearchConfigs[index].type == 'rangeInput'" class="header-search header-range-search" >
            <p class="header-label" >{{headerItem}}</p>
            <el-input class="range-start" v-model="rightTblSearchObj[tblSearchConfigs[index].prop[0]]" 
                      v-on:keyup.enter.native="$emit('toogleRefreshRightTbl',true,rightTempSelectedDatas)"/>
            <span class="split" >-</span>
            <el-input class="range-end" v-model="rightTblSearchObj[tblSearchConfigs[index].prop[1]]" 
                      v-on:keyup.enter.native="$emit('toogleRefreshRightTbl',true,rightTempSelectedDatas)"/>
          </div>
          <div v-if="tblSearchConfigs[index].type == 'input'" class="header-search header-input-search" >
            <p class="header-label" >{{headerItem}}</p>
            <el-input v-model="rightTblSearchObj[tblSearchConfigs[index].prop[0]]" 
                      v-on:keyup.enter.native="$emit('toogleRefreshRightTbl',true,rightTempSelectedDatas)"/>
          </div>
        </template>
        <template slot-scope="scope" >
          <div v-if="index == 0 && (scope.row.voucherId || scope.row.specialVoucherId)" class="icon-content" >
            <span class="column-icon split" >账</span>
          </div>
          <span>{{scope.row[scope.column.property]}}</span>
          <div v-if="scope.column.label == rightTHeaderConfig.iconColumn" class="icon-content" >
            <span v-if="scope.row.fscActivityCode == '支票' && scope.row[scope.column.property]"  class="column-icon check" >支票</span>
            <span v-if="scope.row.rootId && scope.row[scope.column.property]" class="column-icon split" >拆</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  v-if="rightTblConfig.requiredSearchObj.checkStatus === 1" min-width="130px" align="center"
                        prop="notspfFlag" label="调整类型" :render-header="renderRightHeader" key="adjustType"  width="90px"  ></el-table-column>
      <el-table-column  v-if="rightTblConfig.requiredSearchObj.checkStatus === 1 && pageName == 'manual-check-statement'" align="center"
                        prop="userName" label="操作人" :render-header="renderRightHeader" key="updateUser" width="70px"  >
      <template slot="header" slot-scope="scope">
          <p class="header-label" >操作人</p>
          <el-input v-model="rightTblSearchObj.modiferUser" 
                    v-on:keyup.enter.native="$emit('toogleRefreshRightTbl',true,rightTempSelectedDatas)"/>
        </template>
      </el-table-column>
      <el-table-column  v-if="rightTblConfig.requiredSearchObj.checkStatus === 0 && pageName == 'manual-check-statement'" align="center"  width="90px"
                        prop="splitReason" label="拆分理由" :render-header="renderRightHeader" key="splitReason"  >
        <template slot-scope="scope" >
          <span v-if="scope.row.splitReason && scope.row.splitReason.length > 8" :title="scope.row.splitReason" >{{scope.row.splitReason.substring(0,8)}}...</span>
          <span v-else :title="scope.row.splitReason" >{{scope.row.splitReason}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
  import pageUtilCash from '../../../../utils/restaurant/dataCheck/cashManualCheck'
  import pageUtilNonCash from '../../../../utils/restaurant/dataCheck/nonCashManualCheck'

  export default{
    name  : 'manualCheckSingleTblRight',
    props : ['rightTblConfig','pageName','refreshRightTbl','resetRightTblFlag','currentSumIdsForRigh','currentSinIdsForRigh','sinRefreshObj',
             'refreshCashCheckedRight','rightSelectedIdsParam','rightInvertIdsParam','cashCheckedLeftRefreshDown','cashCheckedRightRefreshDown','setMaxAmount','rightMaxAmount'], 
    beforeMount(){
      let windowHeight = window.innerHeight;
      this.tblHeight = windowHeight * 0.59;
      this.pageUtil = this.pageName == 'manual-check-statement' ? pageUtilCash : pageUtilNonCash;
      this.rightTHeaderConfig = this.pageUtil.tblColumns[this.rightTblConfig.dataType];
      this.tblSearchConfigs = this.pageUtil.tblSearchConfigs[this.rightTblConfig.dataType];
      this.rightTblSearchObj  = Object.assign({},this.pageUtil.tblSearchDtos[this.rightTblConfig.dataType]);
      this.getAdjustType();
    },
    mounted(){
      this.getData();
    },
    data() {
			return {
        pageUtil : {},
        tblHeight : 0,
        sumIdsForRigh : '',
        sinIdsForRigh : '',
        rightTblData : [],
        rightTHeaderConfig : {},
        tblSearchConfigs   : [],
        rightTblSearchObj  : {},
        rightInvertIds : [],
        adjustTypes : [{
          adjustType : '请选择'
        }],
        rightTempSelectedDatas  : [],
        rightCheckedDatas       : [],
        tempSelectedDatas       : [],
        rightCheckedDatasStr    : '',
        rightHasReslot : false,
        rightRefreshDown : false,
        loadingSingle : true
			}
    },
    watch : {
      //刷新列表
      refreshRightTbl(val,oldVal){
        if(val != oldVal && val){
          this.$nextTick(function(){
            if(this.resetRightTblFlag){
              this.getAdjustType();
              this.getTblColumns();
              this.$emit('resetRightTblDown',false);
            }
            // if(this.rightTblConfig.requiredSearchObj.checkStatus == 1){
            //   this.rightHasReslot = true;
            // }
            this.getData();
          })
        }
      },
      refreshCashCheckedRight(val,oldVal){
        if(val){
          this.$nextTick(function(){
            if(!this.cashCheckedRightRefreshDown){
              this.getData('cashCheckedRefresh');
            }
            if(this.cashCheckedLeftRefreshDown && this.cashCheckedRightRefreshDown ){
              this.$emit('bothRefreshDown');
            }
          })
        }
      },
      cashCheckedRightRefreshDown(val,oldVal){
        if(val){
          //console.log(this.rightCheckedDatas)
          if(this.pageName == 'manual-check-statement' && this.rightTblConfig.requiredSearchObj.checkStatus == 1){
            this.$emit('setRightCashCheckedDatas',this.rightCheckedDatas);
          }
        }
      },
      rightTempSelectedDatas(val,oldVal){
        if(val.length){
          this.toggleRightSelection(val);
          this.rightHasReslot = true;
        }
      },
      rightCheckedDatasStr:{
        handler(val,oldVal){
          if(this.pageName != 'manual-check-statement'){
            this.$emit('selectedRightRow', this.rightCheckedDatas);
          }
        },
        deep:true
      },
      sinRefreshObj:{
        handler(val,oldVal){
          // console.log(val.prop +'======'+this.rightTblSearchObj[val.prop] )
          // console.log(val.prop+ '====='+val.value)
          this.rightTblSearchObj[val.prop] = val.value;
          this.$nextTick(function(){
            this.$emit('toogleRefreshRightTbl',true,this.rightTempSelectedDatas);
          });
        },
        deep:true
      },
      setMaxAmount(val,oldVal){
        if(val){
          this.rightTblSearchObj[this.rightTHeaderConfig.amountMaxKey] = '';
        }
      }
    },
    methods : {
      calTheadWidth(headerObj){
        let checkedStatus = this.rightTblConfig.requiredSearchObj.checkStatus;
        let winWidth = window.innerWidth;
        if(!headerObj){
          return null;
        }else{
          if(checkedStatus === 0){
            if(headerObj.unCheckedMin && winWidth > headerObj.unCheckedMin){
              return null;
            }else{
              return headerObj.unCheckWidth;
            }
          }else if(checkedStatus === 1){
            if(headerObj.checkedMin && winWidth > headerObj.checkedMin){
              return null;
            }else{
              return headerObj.checkedWidth;
            }
          }
        }
      },
      tableRowClassName({row, rowIndex}) {
        let checkStatus = this.rightTblConfig.requiredSearchObj.checkStatus;
        if(row.multiFlag === 1 && checkStatus === 0) {
          return 'multi-row';
        }else{
          return '';
        }
      },
      //获取调整类型下拉框数据
      getAdjustType(){
        let _self = this;
        let param = this.common.formatPathParam({
          itemCode : this.pageName == 'manual-check-statement'? '现金,支票' : ' '
        });
        apiStore.getAdjustTypeByBohKeyworld(param,function(res){
          _self.adjustTypes = [{
            adjustType : '请选择'
          }];
          if(res.code === 200){
            _self.adjustTypes = _self.adjustTypes.concat(res.data);
          }else{
            _self.adjustTypes = [{
              adjustType : '请选择'
            }];
          }
          _self.adjustTypes.push({
            adjustType : '非SPF手工账务'
          });
          if(_self.pageName != 'manual-check-statement' && _self.rightTblConfig.dataType == 'bank'){
            _self.adjustTypes = _self.adjustTypes.concat([{
              adjustType : '长假保证金'
            },{
              adjustType : '日常保证金'
            },{
              adjustType : '长假预付款'
            },{
              adjustType : '日常预付款'
            }]);
          }
        })
      },
      //获取表配置
      getTblColumns(){
        this.rightTHeaderConfig = this.pageUtil.tblColumns[this.rightTblConfig.dataType];
        this.tblSearchConfigs = this.pageUtil.tblSearchConfigs[this.rightTblConfig.dataType];
        this.rightTblSearchObj  = Object.assign({},this.pageUtil.tblSearchDtos[this.rightTblConfig.dataType]);
      },
      //查询列表
      getData(refreshType){
        this.resetSelectedStatus();
        this.loadingSingle = true;
        this.sumIdsForRigh = this.currentSumIdsForRigh? this.currentSumIdsForRigh : '';
        this.sinIdsForRigh = this.currentSinIdsForRigh? this.currentSinIdsForRigh : '';
        let _self = this;
        let searchUrl = '/'+ this.pageName +'/select-unsplit-'+ this.rightTblConfig.dataType + (this.pageName == 'manual-check-statement'? '-by-condition-all' : '');
        let searchObj = Object.assign(this.rightTblSearchObj,this.rightTblConfig.requiredSearchObj);
        let searchParam  = '';
        if(this.rightTblConfig.requiredSearchObj.checkStatus != 1 || this.pageName != 'manual-check-statement'){
          searchParam = (this.sinIdsForRigh || this.sumIdsForRigh) ? this.common.formatPathParam(searchObj) + this.sumIdsForRigh + this.sinIdsForRigh : this.common.formatPathParam(searchObj);
        }else{
          searchParam = this.common.formatPathParam(searchObj) + this.common.formatPathParam(this.rightSelectedIdsParam) + this.common.formatPathParam(this.rightInvertIdsParam);
        }
        apiStore.getSummurySideData(searchUrl,searchParam,function(result){
          if(_self.setMaxAmount){
            _self.rightTblSearchObj[_self.rightTHeaderConfig.amountMaxKey] = _self.rightMaxAmount.replace(/,/g,'');
            _self.$emit('setMaxAmountDown');
          }
          _self.loadingSingle = false;
          _self.sinIdsForRigh = '';
          _self.sumIdsForRigh = '';
          _self.$emit('toogleRefreshRightTbl',false);
          _self.rightTblData = [];
          if(result.code != 404 && result.code != 200){
            _self.common.errorMessage(result.msg);
            return false;
          }
          let dataList = _self.pageName == 'manual-check-statement' ? result.data.result : result.data;
          if(dataList){
            //数组去重
            if(result.data.invertIds){
              let tempInvertIds = _self.rightInvertIds.concat(result.data.invertIds);
              let newObj = new Set(tempInvertIds); 
              _self.rightInvertIds = Array.from(newObj);
            }
            _self.rightTblData =dataList;
            if(refreshType == 'cashCheckedRefresh'){
              _self.$emit('cashRightCheckedChange',_self.tempSelectedDatas,_self.rightInvertIds,'notSelf',_self.rightTblConfig.dataType);
              _self.$emit('cashRightCheckedRefreshDown');
              _self.$emit('cashCheckedRightRefreshDown');
            }
            let selectedRows = [];
            dataList.forEach(function(item,index){
              if(item.seleted){
                selectedRows.push(item);
              }
            })
            if(selectedRows.length){
              _self.rightCheckedDatas = selectedRows.concat();
              _self.rightCheckedDatasStr = JSON.stringify(selectedRows);
            }else{
              _self.rightCheckedDatas = [];
              _self.rightCheckedDatasStr = '';
            }
            _self.rightTempSelectedDatas = selectedRows;
          }
        })
      },
      setTblHeaderConfig(){
        let _self = this;
        let storage = window.localStorage;
        let params = JSON.parse(storage.params);
        for(let i = 0; i < tblHeaderConfig.noBillTblHeader.length; i ++){
          if(tblHeaderConfig.noBillTblHeader[i].type == params.type){
            _self.rightTHeaderConfig = tblHeaderConfig.noBillTblHeader[i];
            if(tblHeaderConfig.noBillTblHeader[i].isSameHeader){
              _self.rightTHeaderConfig.labels = tblHeaderConfig.noBillTblHeader[i-1].labels;
              _self.rightTHeaderConfig.props  = tblHeaderConfig.noBillTblHeader[i-1].props;
            }
          }
        }
      },
      renderRightHeader(h, { column, $index }){
        if(column.property == 'notspfFlag'){
          var $header = ( h('div',
                          { class : 'header-search header-select-search'},
                          [ h('p',{class : 'header-label'},column.label),
                            h('el-select',{
                              props:{
                                class:'header-search-item',
                                size:'small',
                                value:this.rightTblSearchObj.notspfFlag,
                              },on:{
                                input: (value) =>{
                                  this.rightTblSearchObj.notspfFlag = value;
                                  console.log(this);
                                  this.$emit('toogleRefreshRightTbl',true,this.rightTempSelectedDatas);
                                }
                              }
                            },Array.apply(null,this.adjustTypes).map(function(currentValue,index,array){
                              return h('el-option',{props:index == 0? {label : currentValue.adjustType, value : ''}:{label : currentValue.adjustType, value : currentValue.adjustType }})
                            }))
                          ])
                        )
        }else{
          var $header = ( h('div',
                          { class : 'header-search header-select-search'},
                          [ h('p',{class : 'header-label'},column.label)])
                        )
        }
        return $header;
      },
      //处理表单数据
      renderTblData(row,column,cellValue,index){
        let _self = this;
      },
      //选中行，调整
      rightTblClick(row, event, column){
        let _self = this;
        let tblConfig = Object.assign({},this.rightTblConfig); 
        tblConfig.tblPosition = 'right';
        let storageType = this.rightTHeaderConfig.storageType;
        this.$emit('adjustRightTblData',{row, event, column, tblConfig, storageType});
        // if(this.rightTblConfig.requiredSearchObj.checkStatus != 1){
        //   this.$emit('adjustRightTblData',{row, event, column, tblConfig, storageType});
        // }
      },
      resetSelectedStatus(){
        // this.rightCheckedDatas = [];
        // this.rightCheckedDatasStr = '';
        this.rightTblData.forEach(function(item,index){
          item.seleted = false;
        })
      },
      handleRightCheckedDatasChange(checkStatus,invertId){
        let _self = this;
        let tempSelectedDatas = [];
        let tempUnSelectedDatas = [];
        let slotedTblData = [];
        this.$nextTick(function(){
          _self.rightTblData.forEach(function(item,index){
            if(item.seleted){
              tempSelectedDatas.push(item);
            }else{
              tempUnSelectedDatas.push(item);
            }
          });
          slotedTblData = tempSelectedDatas.concat(tempUnSelectedDatas);
          if(tempSelectedDatas.length){
            _self.rightCheckedDatas = tempSelectedDatas.concat();
            _self.tempSelectedDatas = tempSelectedDatas.concat();
            _self.rightCheckedDatasStr = JSON.stringify(tempSelectedDatas);
          }else{
            _self.rightCheckedDatas = [];
            _self.tempSelectedDatas = [];
            _self.rightCheckedDatasStr = '';
          }
          _self.rightInvertIds = [];
          if(!checkStatus){
            _self.rightInvertIds.push(invertId);
          }
          _self.rightTblData = slotedTblData.concat();
          _self.$emit('cashRightCheckedChange',_self.rightCheckedDatas,_self.rightInvertIds,'self',_self.rightTblConfig.dataType);
        });
      },
      handleRightSelectionChange(selectedDatas) {
        let _self = this;
        if(this.rightTblConfig.requiredSearchObj.checkStatus != 1){
          this.$emit('selectedRightRow', selectedDatas);
        }else if(this.rightTblConfig.requiredSearchObj.checkStatus == 1){
          this.rightCheckedDatas = selectedDatas.concat();
        }
        if(this.rightTblConfig.requiredSearchObj.checkStatus != 1 && !this.rightHasReslot){
          let tempDataList = Object.assign([],selectedDatas);;
          this.rightTblData.forEach(function(item,index){
            if(!_self.common.isInArray(tempDataList,item)){
              tempDataList.push(item);
            }
          });
          _self.rightTblData = tempDataList;
          this.rightTempSelectedDatas = selectedDatas;
        }
      },
      toggleRightSelection(rows) {
        let _self = this;
        var toogleDown = false;
        if (rows.length) {
          this.$nextTick(function(){
            rows.forEach(function(row,index){
              if(index == rows.length - 1){
                toogleDown = true;
              }
              _self.$refs.rightTbl.toggleRowSelection(row,true);
            });
            if(toogleDown){
              this.rightHasReslot = false;
              // this.$emit('selectedRightRow', rows); 
              // if( this.pageName == 'manual-check-statement'){
              //   this.$emit('rightTblSelectToogleDown',rows);
              // }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            }
          })
        } else {
          this.$refs.rightTbl.clearSelection();
          this.rightHasReslot = false;
        }
      }
    }
  }
</script>