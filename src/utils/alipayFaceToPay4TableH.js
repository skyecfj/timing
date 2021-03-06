const commonData = [
        {
            label:'法人公司',
            prop:'resEntity',
        },
        {
            label:'品牌',
            prop:'resBrand',
        },
        {
            label:'营运市场',
            prop:'resOprMarketName',
        },
        {
            label:'财务市场',
            prop:'resFinMarketName',
        },
        {
            label:'交易日期',
            prop:'transTime',
        },
        {
            label:'理论营业日期',
            prop:'theoryOperationDate',
        },
        {
            label:'百胜营业日期',
            prop:'operationDate',
        },
        {
            label:'订单金额',
            prop:'orderAmount',
        },
        {
            label:'券名称',
            prop:'discountCouponDes',
        },
        {
            label:'券合作方',
            prop:'discountCouponPartner',
        },
        {
            label:'券优惠金额',
            prop:'discountCouponAmount',
        },
        {
            label:'红包名称',
            prop:'discountRedDes',
        }, {
            label:'红包优惠金额',
            prop:'discountRedAmount',
        },
        {
            label:'实际金额',
            prop:'transAmount',
        },
        {
            label:'服务费',
            prop:'transFee',
        }, {
            label:'商户应收',
            prop:'transAr',
        },
        {
            label:'业务类型',
            prop:'transType',
        },
        {
            label:'集分宝抵扣',
            prop:'setPointsPo',
        },
        {
            label:'包销标识',
            prop:'underwriteMark',
        }, {
            label:'包销金额',
            prop:'underwriteAmount',
        }
    ];
export default {
    detail:[
        {
            label:'商户号',
            prop:'businessOrderNo',
        },
        {
            label:'交易渠道',
            prop:'lineType',
        },
        {
            label:'餐厅编码',
            prop:'resCode',
        },
        {
            label:'餐厅简称',
            prop:'resName',
        },
        {
            label:'品牌',
            prop:'resBrand',
        }, {
            label:'法人',
            prop:'resEntity',
        },
        {
            label:'开票单位',
            prop:'issuingName',
        },
        {
            label:'营运市场',
            prop:'resOprMarketName',
        },
        {
            label:'财务市场',
            prop:'resFinMarketName',
        }, {
            label:'终端号',
            prop:'posNo',
        },
        {
            label:'收银员',
            prop:'cashier',
        },
        {
            label:'交易日期',
            prop:'transTime',
        },
        {
            label:'理论营业日期',
            prop:'theoryOperationDate',
        },
        {
            label:'百胜营业日期',
            prop:'operationDate',
        },
        {
            label:'支付宝交易号',
            prop:'alipayTransNo',
        },
        {
            label:'客户账户',
            prop:'alipayAccount',
        },
        {
            label:'订单金额',
            prop:'orderAmount',
        }, {
            label:'卡名称',
            prop:'discountCardDes',
        },
        {
            label:'卡合作方',
            prop:'discountCardPartner',
        },
        {
            label:'卡优惠金额',
            prop:'discountCardAmount',
        }, {
            label:'券名称',
            prop:'discountCouponDes',
        },
        {
            label:'券合作方',
            prop:'discountCouponPartner',
        },
        {
            label:'券优惠金额',
            prop:'discountCouponAmount',
        },
        {
            label:'红包名称',
            prop:'discountRedDes',
        }, {
            label:'红包优惠金额',
            prop:'discountRedAmount',
        },
        {
            label:'实际金额',
            prop:'transAmount',
        },
        {
            label:'服务费',
            prop:'transFee',
        }, {
            label:'商户应收',
            prop:'transAr',
        },
        {
            label:'业务类型',
            prop:'transType',
        },
        {
            label:'集分宝抵扣',
            prop:'setPointsPo',
        },
        {
            label:'包销标识',
            prop:'underwriteMark',
        }, {
            label:'包销金额',
            prop:'underwriteAmount',
        }
    ],
    storeDetail:[
        {
            label:'餐厅编码',
            prop:'resCode',
        },
        {
            label:'餐厅简称',
            prop:'resName',
        },
    ].concat(commonData),
    issuingUnitDetail:[
        {
            label:'开票单位',
            prop:'issuingName',
        },
    ].concat(commonData),
    companyDetail:commonData
}
