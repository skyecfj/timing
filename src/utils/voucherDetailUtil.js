export default {
   
     //凭证title信息
     TitleHeaderConfigData:
     {
         'B2C':{
            abstractInfo:{
                title:'摘要',
            },
            bu:{
                title:'BU',
                fixed:true,
                width:'80px'
            },
            subjectNum:{
                title:'会计科目'
            },
            subsidiaryLedgerTypeDesc:{
                title:'子账类型'
            },
            subsidiaryLedger:{
                title:'说明'
            },
            amount:{
                title:'金额'
            }
         }
     },

     getTitleHeaderConfigData(titleKey,voucherCode){
         if(titleKey == 'B2C' || titleKey == 'B2B')
         {
             return {
                'businessType':'业务类型',
                'voucherInstruction':'凭证类型',
                'accountMode':'账套',
                'jdeAccountModule':'JDE账务模块',
                'jdeInvoiceType':'单据类型',
                'voucherDate':'制单日期'
             }
         }
         if(titleKey == 'STORE')
         {
                return {
                'generalDate':'总账日期',
                'companyName':'法人公司',
                'businessType':'业务类型',
                'jdeAccountModule':'JDE账务模块',
                'voucherInstruction':'子业务类型',
                'accountMode':'账套',
                'jdeInvoiceType':'单据类型',
                'jdeInvoiceNumber':'单据号',
                'jdeBatchNo':'批号',
                'paymentDay':'账期',
                'remark':'说明'
                 }
         }
     },

     getTableHeaderData(titleKey,voucherCode){
         if(titleKey == 'B2C' || titleKey == 'B2B')
         {
             return {
                'abstractInfo':'摘要',
                'buName':'BU',
                'subjectNumName':'会计科目',
                'subsidiaryLedgerTypeDesc':'子账类型',
                'subsidiaryLedger':'子账',
                'description':'说明',
                'amount':'金额',
                'flag':'成功与否',
                'code':'错误编号',
                'message':'错误描述'
             }
         }
         if(titleKey == 'STORE'){
              if(voucherCode == 'STORE_0000'){//手工账务
                 return {
                    'bu':'BU',
                    'subjectNum':'会计科目',
                    'subsidiaryLedgerTypeDesc':'子账类型',
                    'subsidiaryLedger':'子账',
                    // 'description':'子账描述',
                    // 'currency':'币种',
                    'abstractInfo':'备注',
                    'bohAdjustResion':'调整类型',
                    'amount':'金额',
                    'flag':'成功与否',
                    'code':'错误编号',
                    'message':'错误描述'
                }
              }else if(voucherCode == 'STORE_0001' || voucherCode == 'STORE_0002' 
              || voucherCode == 'STORE_0003' || voucherCode == 'STORE_0020' || voucherCode == 'STORE_0004' || voucherCode == 'STORE_0005'){
                 return {
                    'bu':'BU',
                    'customerName':'客户',
                    'subjectNum':'会计科目',
                    'subsidiaryLedgerTypeDesc':'子账类型',
                    'subsidiaryLedger':'子账',
                    // 'description':'子账描述',
                    // 'currency':'币种',
                    'abstractInfo':'摘要',
                    'amount':'金额',
                    'flag':'成功与否',
                    'code':'错误编号',
                    'message':'错误描述'
                }
              }else if(voucherCode == 'STORE_0023' || voucherCode == 'STORE_0024' || voucherCode == 'STORE_0025' || voucherCode == 'STORE_0026'){
                return {
                    'customerNumber':'客户号',
                    'bu':'BU',
                    'subjectNum':'会计科目',
                    'subsidiaryLedgerTypeDesc':'子账类型',
                    'subsidiaryLedger':'子账',
                    // 'description':'子账描述',
                    // 'currency':'币种',
                    'abstractInfo':'摘要',
                    'amount':'金额',
                    'flag':'成功与否',
                    'code':'错误编号',
                    'message':'错误描述'
                }
              }else{
                   return {
                    'bu':'BU',
                    'subjectNum':'会计科目',
                    'subsidiaryLedgerTypeDesc':'子账类型',
                    'subsidiaryLedger':'子账',
                    // 'description':'子账描述',
                    // 'currency':'币种',
                    'abstractInfo':'摘要',
                    'amount':'金额',
                    'flag':'成功与否',
                    'code':'错误编号',
                    'message':'错误描述'
                }
              }
         }
     }
}
