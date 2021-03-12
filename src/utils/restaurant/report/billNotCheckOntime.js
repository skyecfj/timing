export default {
    searchConfig: {
        searchConditions: [
            {
                range: true,      //是否为范围
                type: 'date',    //查询项类型 'date','input','select'
                label: '实际核对日期', //查询项名称
                prop: ['preActualCheckDate', 'finalActualCheckDate'],
                otherConfig: {
                    dateTime: false,
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
                range: false,
                type: 'select',
                label: '活动名称',
                prop: ['activityId'],
                otherConfig: {
                    placeHolder: '活动名称',  //占位符
                    optValue: 'id',
                    optLabel: 'activityName',
                    filterable: true,
                    opts: [],
                }
            }
        ],
        searchObj: {
            preActualCheckDate: null,
            finalActualCheckDate: null,
            activityId: null,
            companyCode : null,
            reset: false
        }
    }
}
