
export function numberFormatToThousand(value){
        if(isNaN(value)) return '0.00';
        let intPart =  Number(value)|0;//不进行四舍五入
         var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三用逗号一断 ? 前导对象必须在目标对象中连续出现零次或者一次

        let floatPart = ".00"; //预定义小数部分
        let value2Array = value.toString().split("."); //隔断小数与整数部分

        //=2表示数据有小数位
        if(value2Array.length === 2) {
            floatPart = value2Array[1].toString(); //拿到小数部分
                return intPartFormat + "." + floatPart;
        } else {
            return intPartFormat + floatPart;
        }
}