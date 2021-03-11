export default{
    searchConfig:{
        searchConditions : [
          {
            range : true,      //是否为范围
            type  : 'date',    //查询项类型 'date','input','select'
            label : '核销日期', //查询项名称
            prop  : ['transStartTime','transEndTime'],
            otherConfig : {
              dateTime : false,
              valueKey : 'startTimeVal'
            }
          },
          {
            range : false,
            type  : 'input',
            label : '卡号',
            prop  : ['couponCode']
          },
          {
            range : false,
            type  : 'select',
            label : '品牌',
            prop  : ['brand'],
            otherConfig : {
              placeHolder : '全部品牌',  //占位符
              optLabel    : 'brandEnglishName', //下拉框选项对象label
              optValue    : 'brandName', //下拉框选项对象取值
              filterable  : true,
              opts : [] //下拉框选项
            }
          },
          {
            range : false,
            type  : 'select',
            label : '法人公司',
            prop  : ['companyCode'],
            otherConfig : {
              placeHolder : '法人公司',  //占位符
              optValue    : 'jdeCode',
              optLabel    : 'companyName',
              filterable  : true,
              isRemote    : true,
              remoteLoading : false,
              opts :[],
            }
          },
          {
            range : false,
            type  : 'select',
            label : '餐厅',
            prop  : ['storeId'],
            otherConfig : {
              placeHolder : '餐厅',  //占位符
              optValue : 'storeHypId',
              optLabel : 'storeHypId',
              filterable  : true,
              isRemote    : true,
              remoteLoading : false,
              opts :[],
            }
          },
          {
            range : false,
            type  : 'select',
            label : '交易状态',
            prop  : ['flag'],
            otherConfig : {
              placeHolder : '交易状态',  //占位符
              optLabel    : 'label', //下拉框选项对象label
              optValue    : 'value', //下拉框选项对象取值
              filterable  : false,
              opts : [{
                label : '核销',
                value : '0'
              },{
                label : '撤销核销',
                value : '1'
              }] //下拉框选项
            }
          }
        ],
        searchObj : {
          transStartTime : null,
          transEndTime   : null,
          couponCode  : null,
          brand       : null,
          companyCode : null,
          storeId   : null,
          flag      : null,
          reset     : false
        }
    }
}
