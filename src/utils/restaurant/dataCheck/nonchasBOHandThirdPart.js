export default{
    searchConfig:{
        searchConditions : [
          {
            range : true,      //是否为范围
            type  : 'date',    //查询项类型 'date','input','select'
            label : '营业日期', //查询项名称
            prop  : ['bizDateBegin','bizDateEnd'],
            otherConfig : {
              dateTime : false
            }
          },
          {
            range : false,
            type  : 'select',
            label : '活动名称',
            prop  : ['fscActivityCode'],
            otherConfig : {
              placeHolder : '活动名称',  //占位符
              optValue    : 'activityAbbreviation',
              optLabel    : 'activityAbbreviation',
              filterable  : true,
              opts :[],
            }
          },
          // {
          //   range : false,
          //   type  : 'select',
          //   label : '法人公司',
          //   prop  : ['companyName'],
          //   otherConfig : {
          //     placeHolder : '法人公司',  //占位符
          //     optValue    : 'jdeCode',
          //     optLabel    : 'companyName',
          //     filterable  : true,
          //     isRemote    : true,
          //     remoteLoading : false,
          //     opts :[],
          //   }
          // },
          {
            range : false,
            type  : 'select',
            label : '营运市场',
            prop  : ['operateCode'],
            otherConfig : {
              placeHolder : '营运市场',  //占位符
              optValue    : 'marketNumber',
              optLabel    : 'marketNumber',
              filterable  : true,
              isRemote    : true,
              remoteLoading : false,
              opts :[],
            }
          },
          {
            range : false,
            type  : 'select',
            label : '餐厅编号',
            prop  : ['storeCode'],
            otherConfig : {
              placeHolder : '餐厅编号',  //占位符
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
            label : '品牌',
            prop  : ['brand'],
            otherConfig : {
              placeHolder : '全部品牌',  //占位符
              optLabel    : 'brandEnglishName', //下拉框选项对象label
              optValue    : 'brandEnglishName', //下拉框选项对象取值
              filterable  : true,
              opts : [] //下拉框选项
            }
          },
          {
            range : false,
            type  : 'select',
            label : '差异原因',
            prop  : ['resultCode'],
            otherConfig : {
              placeHolder : '全部品牌',  //占位符
              optLabel    : 'adjustType', //下拉框选项对象label
              optValue    : 'adjustType', //下拉框选项对象取值
              filterable  : true,
              opts : [] //下拉框选项
            }
          },
          {
            range : false,
            type  : 'checkBox',
            label : '显示有差异金额',
            prop  : ['hasDiff'],
            otherConfig : {}
          },
          {
            range : false,
            type  : 'checkBox',
            label : '不包含容差范围内的差异',
            prop  : ['hasOverTolerance'],
            otherConfig : {}
          },
          {
            range : false,
            type  : 'checkBox',
            label : '不包含已定位差异金额',
            prop  : ['hasDiffLeft'],
            otherConfig : {}
          },
          {
            range : false,
            type  : 'checkBox',
            label : 'BOH有账单无',
            prop  : ['hasBohNoBill'],
            otherConfig : {}
          }
        ],
        searchObj : {
          bizDateBegin : null,
          bizDateEnd   : null,
          fscActivityCode : null,
          //companyName : null,
          operateCode : null,
          storeCode   : null,
          brand       : null,
          resultCode  : null,
          hasDiff     : false,
          hasOverTolerance : false,
          hasDiffLeft  : false,
          hasBohNoBill : false,
          reset     : false
        }
    }
}
