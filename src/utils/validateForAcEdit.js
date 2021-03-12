import common from "@/utils/common"

var legalChars = (rule, value, callback) => {
    if (!/^[A-Za-z0-9\u4e00-\u9fa5！~·@#%……&* （）——、。-，；：“”？,.?""'';()!:\+\=\-\/]+$/.test(value) && !common.isNullString(value)) {
        callback(new Error('只能输入数字、汉字、字母、符号(特殊符号除外)'));
    } else {
        callback()
    }
}
var legalEnglishChars = (rule, value, callback) => {
    if (!/^[A-Za-z]+$/.test(value) && !common.isNullString(value)) {
        callback(new Error('只能输入字母'));
    } else {
        callback()
    }
}
var legalNumber = (rule, value, callback) => {
    if (!/^[0-9]+$/.test(value) && !common.isNullString(value)) {
        callback(new Error('只能输入1-2位的数字'));
    } else {
        callback()
    }
}
var phone = (rule, value, callback) => {
    if (!/^[0-9\-]+$/.test(value) && !common.isNullString(value)) {
        callback(new Error('只能输入数字和-'));
    } else {
        callback()
    }
}
var workDay = (rule, value, callback) => {
    if (!/^[0-9]$|^1\d$|^2[0-2]$/.test(value) && !common.isNullString(value)) {
        callback(new Error('请输入1-22以内的正整数'));
    } else {
        callback()
    }
}
var calendarDay = (rule, value, callback) => {
    if (!/^[0-9]$|^1\d$|^2[0-8]$/.test(value) && !common.isNullString(value)) {
        callback(new Error('请输入1-28以内的正整数'));
    } else {
        callback()
    }
}
var defaultDay = (rule, value, callback) => {
    if (!/^\+?[1-9]\d*$/.test(value) && !common.isNullString(value)) {
        callback(new Error('请输入正整数'));
    } else {
        callback()
    }
};
var percent = (rule, value, callback) => {
    if (!/^(\d|[1-9]\d|100)(\.\d{1,2})?$/.test(value) && !common.isNullString(value)) {//^(\d|[1-9]\d|100)(\.\d{1,2})?$/0-100之间保留两位小数
        callback(new Error('100以内保留两位小数'));
    } else {
        callback()
    }
}
export {
    legalChars,
    legalEnglishChars,
    legalNumber,
    phone,
    workDay,
    calendarDay,
    defaultDay,
    percent
}
