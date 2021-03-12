export default{
    searchConfig:{
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
          beginDate : '',
          endDate   : '',
          storeCode : '',
          reset     : false
        }
    }
}
