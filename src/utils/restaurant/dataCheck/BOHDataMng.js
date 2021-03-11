export default{
    searchConfigCheck:{
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
            label : '营运市场',
            prop  : ['operateMarket'],
            otherConfig : {
              placeHolder : '营运市场',  //占位符
              optLabel    : 'name', //下拉框选项对象label
              optValue    : 'marketNumber', //下拉框选项对象取值
              filterable  : true,
              opts : [] //下拉框选项
            }
          },
          // {
          //   range : false,
          //   type  : 'select',
          //   label : '法人公司',
          //   prop  : ['companyName'],
          //   otherConfig : {
          //     placeHolder : '法人公司',  //占位符
          //     optValue    : 'companyName',
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
            label : '品牌',
            prop  : ['brand'],
            otherConfig : {
              placeHolder : '全部品牌',  //占位符
              optLabel    : 'brandEnglishName', //下拉框选项对象label
              optValue    : 'brandEnglishName', //下拉框选项对象取值
              filterable  : true,
              opts : [], //下拉框选项
            }
          },
          {
            range : false,
            type  : 'select',
            label : 'BOH项目',
            prop  : ['exceptionId'],
            otherConfig : {
              placeHolder : '全部项目',  //占位符
              optLabel    : 'ruleName', //下拉框选项对象label
              optValue    : 'id', //下拉框选项对象取值
              opts : [],
              filterable  : true
            }
          }
          // {
          //   range : false,
          //   type  : 'select',
          //   label : '原因类型',
          //   prop  : ['specialTrack'],
          //   otherConfig : {
          //     placeHolder : '请选择',  //占位符
          //     optLabel    : 'brandEnglishName', //下拉框选项对象label
          //     optValue    : 'brandEnglishName', //下拉框选项对象取值
          //     filterable  : true,
          //     opts : [], //下拉框选项
          //   }
          // }
        ],
        searchObj : {
          bizDateBegin : null,
          bizDateEnd   : null,
          companyName   : null,
          operateMarket : null,
          brand       : null,
          exceptionId : null,
          reset       : false
        }
    },
    searchConfigAdjust:{
      searchConditions : [
        {
          range : true,      //是否为范围
          type  : 'date',    //查询项类型 'date','input','select'
          label : '营业日期', //查询项名称
          prop  : ['beginDate','endDate'],
          otherConfig : {
            dateTime : false
          }
        },
        {
          range : false,
          type  : 'input',
          label : '餐厅编号',
          prop  : ['storeCode'],
          otherConfig : {}
        }
      ],
      searchObj : {
        beginDate : null,
        endDate   : null,
        storeCode : null,
        reset     : false
      }
  }
}
