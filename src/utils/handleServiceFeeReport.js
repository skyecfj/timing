export default {
    searchConfig: {
        searchConditions: [
            {
                range: true,      //是否为范围
                type: 'date',    //查询项类型 'date','input','select'
                label: '交易日期', //查询项名称
                prop: ['tradeDateStart', 'tradeDateEnd'],
                otherConfig: {
                    dateTime: false,
                    valueKey : 'startTimeVal'
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
            tradeDateStart: null,
            tradeDateEnd: null,
            activityId: null,
            reset: false
        }
    }
}
