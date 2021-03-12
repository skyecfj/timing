import common from "@/utils/common"

var workDay = (rule, value, callback) => {
    if (!/^[1-9]$|^1\d$|^2[0-2]$/.test(value) && !common.isNullString(value)) {
        callback(new Error('请输入1-22以内的正整数'));
    } else {
        callback()
    }
}
var calendarDay = (rule, value, callback) => {
    if (!/^[1-9]$|^1\d$|^2[0-8]$/.test(value) && !common.isNullString(value)) {
        callback(new Error('请输入1-28以内的正整数'));
    } else {
        callback()
    }
}
var defaultDay = (rule, value, callback) => {
    if (!/^\+?[0-9]\d*$/.test(value) && !common.isNullString(value)) {
        callback(new Error('请输入正整数'));
    } else {
        callback()
    }
}
var addAmount = (rule, value, callback) => {
    if (!/^0\.\d{1,2}$|^[1-9]\d{0,8}\.\d{1,2}$|^[1-9]\d{0,8}$/.test(value) && !common.isNullString(value)) {
        callback(new Error('追加金额只能为正数并最多精确至小数点后两位'));
    } else {
        callback()
    }
}
var percent = (rule, value, callback) => {
    if (!/^([1-9]\d{0,1}|100)$/.test(value) && !common.isNullString(value)) {
        callback(new Error('数值范围:1-100'));
    } else {
        callback()
    }
}
export {
    workDay,
    calendarDay,
    defaultDay,
    addAmount,
    percent,
}
