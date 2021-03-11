export default{
    searchConfig:{
        searchConditions : [
          {
            range : true,      //是否为范围
            type  : 'date',    //查询项类型 'date','input','select'
            label : '交易日期', //查询项名称
            prop  : ['transStartTime','transEndTime'],
            otherConfig : {
              dateTime : false,
              valueKey : 'startTimeVal'
            }
          },
          {
            range : true,
            type  : 'input',
            label : '支付宝补贴',
            prop  : ['setPointsPoStart','setPointsPoEnd']
          },
          {
            range : false,
            type  : 'select',
            label : '品牌',
            prop  : ['resBrand'],
            otherConfig : {
              placeHolder : '全部品牌',  //占位符
              optLabel    : 'brandEnglishName', //下拉框选项对象label
              optValue    : 'brandName', //下拉框选项对象取值
              filterable  : true,
              opts : [] //下拉框选项
            }
          },
          {
            range : false,
            type  : 'select',
            label : '财务市场',
            prop  : ['resFinMarket'],
            otherConfig : {
              placeHolder : '财务市场',  //占位符
              optLabel    : 'marketName', //下拉框选项对象label
              optValue    : 'marketCode', //下拉框选项对象取值
              filterable  : true,
              opts : [] //下拉框选项
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
          },
          {
            range : false,
            type  : 'select',
            label : '开票单位',
            prop  : ['issuingCode'],
            otherConfig : {
              placeHolder : '开票单位',  //占位符
              optValue    : 'jdeCode',
              optLabel    : 'billingUnitName',
              filterable  : true,
              isRemote    : true,
              remoteLoading : false,
              opts :[],
            }
          },
          {
            range : false,
            type  : 'select',
            label : '餐厅',
            prop  : ['resCode'],
            otherConfig : {
              placeHolder : '餐厅',  //占位符
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
            type  : 'input',
            label : '券名称',
            prop  : ['discountCouponDes']
          },
          {
            range : false,
            type  : 'select',
            label : '交易类型',
            prop  : ['transType'],
            otherConfig : {
              placeHolder : '交易类型',  //占位符
              optLabel    : 'label', //下拉框选项对象label
              optValue    : 'value', //下拉框选项对象取值
              filterable  : false,
              opts : [{
                label : '交易',
                value : '1'
              },{
                label : '退款',
                value : '2'
              }] //下拉框选项
            }
          },
          {
            range : false,
            type  : 'select',
            label : '交易渠道',
            prop  : ['lineType'],
            otherConfig : {
              placeHolder : '交易渠道',  //占位符
              optLabel    : 'label', //下拉框选项对象label
              optValue    : 'value', //下拉框选项对象取值
              filterable  : false,
              opts : [{
                label : '线下当面付',
                value : '1'
              },{
                label : '线下预付款快取',
                value : '2'
              },{
                label : '其他：线上',
                value : '3'
              }] //下拉框选项
            }
          }
        ],
        searchObj : {
          transStartTime : null,
          transEndTime   : null,
          setPointsPoStart : null,
          setPointsPoEnd   : null,
          resBrand     : null,
          resFinMarket : null,
          resEntity    : null,
          issuingCode  : null,
          resCode      : null,
          discountCouponDes : null,
          transType : null,
          lineType  : null,
          reset     : false
        }
    }
}
