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
        label : '品牌',
        prop  : ['brand'],
        otherConfig : {
          placeHolder : '品牌',  //占位符
          optLabel    : 'brandEnglishName', //下拉框选项对象label
          optValue    : 'brandEnglishName', //下拉框选项对象取值
          filterable  : true,
          opts : [] //下拉框选项
        }
      },
      // {
      //   range : false,
      //   type  : 'select',
      //   label : '财务市场',
      //   prop  : ['financialMarket'],
      //   otherConfig : {
      //     placeHolder : '财务市场',  //占位符
      //     optLabel    : 'marketEnglishName', //下拉框选项对象label
      //     optValue    : 'marketNumber', //下拉框选项对象取值
      //     filterable  : true,
      //     opts : [] //下拉框选项
      //   }
      // },
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
        label : '差异定位状态',
        prop  : ['checkStatus'],
        otherConfig : {
          placeHolder : '请选择',  //占位符
          optLabel    : 'label', //下拉框选项对象label
          optValue    : 'value', //下拉框选项对象取值
          opts : [{
            label : '全部',
            value : ''
          },{
            label : '已完成差异定位',
            value : '1'
          },{
            label : '未完成差异定位',
            value : '0'
          }] //下拉框选项
        }
      }
    ],
    searchObj : {
      reset        : false,
      bizDateBegin : null,
      bizDateEnd   : null,
      brand        : null,
      //companyName : '',
      operateCode : null,
      storeCode   : null,
      checkStatus : null,
      //financialMarket : ''
    }
  }
}
