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
        label : '财务市场',
        prop  : ['financialMarket'],
        otherConfig : {
          placeHolder : '财务市场',  //占位符
          optLabel    : 'marketEnglishName', //下拉框选项对象label
          optValue    : 'marketNumber', //下拉框选项对象取值
          filterable  : true,
          opts : [] //下拉框选项
        }
      },
      {
        range : false,
        type  : 'select',
        label : '法人公司',
        prop  : ['companyName'],
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
        label : '异常原因类别',
        prop  : ['exceptionCateagry'],
        otherConfig : {
          placeHolder : '请选择',  //占位符
          optLabel    : 'entryName', //下拉框选项对象label
          optValue    : 'entryCode', //下拉框选项对象取值
          filterable  : true,
          opts : [] //下拉框选项
        }
      },
      // {
      //   range : false,
      //   type  : 'checkBox',
      //   label : '少存行1000元及以上',
      //   prop  : ['moreFlag'],
      //   otherConfig : {}
      // }
    ],
    searchObj : {
      reset       : false,
      bizDateBegin : '',
      bizDateEnd   : '',
      companyName : '',
      storeCode   : '',
      moreFlag : '',
      financialMarket : '',
      exceptionCateagry : ''
    }
  }
}
