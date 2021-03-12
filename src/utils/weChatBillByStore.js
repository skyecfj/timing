export default{
    searchConfig:{
        searchConditions : [
          {
            range : true,      //是否为范围
            type  : 'date',    //查询项类型 'date','input','select'
            label : '日期', //查询项名称
            prop  : ['transStartTime','transEndTime'],
            otherConfig : {
              dateTime : false,
              valueKey : 'startTimeVal'
            }
          },
          {
            range : false,
            type  : 'select',
            label : '法人公司',
            prop  : ['resEntity'],
            otherConfig : {
              placeHolder : '法人公司',  //占位符
              optValue    : 'jdeCode',
              optLabel    : 'companyName',
              filterable  : true,
              isRemote    : true,
              remoteLoading : false,
              opts :[],
            }
          }
        ],
        searchObj : {
          transStartTime : null,
          transEndTime   : null,
          resEntity   : null,
          reset       : false
        }
    }
}
