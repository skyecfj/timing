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
            type  : 'input',
            label : '活动名称',
            prop  : ['activityName'],
            otherConfig : {}
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
          }
        ],
        searchObj : {
          bizDateBegin : null,
          bizDateEnd   : null,
          activityName : null,
          brand : null,
          reset : false
        }
    }
}
