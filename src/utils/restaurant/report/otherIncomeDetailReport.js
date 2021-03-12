export default{
  searchConfig:{
      searchConditions : [
        {
          range : true,      //是否为范围
          type  : 'date',    //查询项类型 'date','input','select'
          label : '交易日期', //查询项名称
          prop  : ['bizDateBeginDate','bizDateEndDate'],
          otherConfig : {
            dateTime : false,
            valueKey : 'startTimeVal'
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
          label : '餐厅编号',
          prop  : ['storeCode'],
          otherConfig : {
            opts     :[],
            optValue : 'storeHypId',
            optLabel : 'storeHypId',
            isRemote : true,
            remoteLoading : false,
            filterable  : true
          }
        }
      ],
      searchObj : {
        bizDateBeginDate : null,
        bizDateEndDate   : null,
        companyCode : null,
        storeCode   : null,
        reset       : false
      }
  }
}
