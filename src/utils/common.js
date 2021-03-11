import api from '../model/api'
import {Message} from 'element-ui';
const colors = ['#bdbdbd','#f77062','#0ba360','#74ebd5','#00c6fb','#ffecd2','#fcb69f','#84fab0','#8fd3f4','#e2ebf0',
'#30cfd0','#330867','#a8edea','#fed6e3','#f5f7fa','#c3cfe2','#6a11cb','#2575fc','#fff1eb','#ace0f9'
]
export default{
    deleteTag:(route , currentPoint,backToList)=>{
        let that = currentPoint;
        that.$store.dispatch('delVisitedViews', route).then((views) => {
            if (route.path === that.$route.path) {
                const latestView = views.slice(-1)[0];
                var isHasParentRoute = false
                for (const i of views) {
                    if (i.fullPath === route.params.parentRoute) {
                        isHasParentRoute = true
                        break
                    }
                }
                if(route.params.parentRoute && isHasParentRoute)
                {
                    that.$router.push(route.params.parentRoute)
                }else if(backToList){
                    that.$router.push({name:backToList})
                }
                else {
                    if (latestView) {
                        that.$router.push(latestView)
                    }
                }
            }
        })

    },
    joinSearchParam:(param)=>{
        var string=  '';
        if(param.length > 1){
            param.forEach(function(item,index){
                if(index === 0 && (item.value || item.value === 0) ){
                    string = '?'+item.name+'='+encodeURIComponent(item.value);
                }else if(!string && (item.value || item.value === 0)){
                    string = '?'+item.name+'='+encodeURIComponent(item.value);
                }
                else  if(item.value || item.value === 0){
                    string += '&'+item.name+'='+encodeURIComponent(item.value);
                }
            })
        }else if(param.length === 1 ){
            string = '?'+param[0].name+'='+encodeURIComponent(param[0].value);
        }
        return string;
    },
    isNullString(text){
        return text === '' || text === null || text === undefined;
    },
    //test(children,num){
    //    var that  = this;var i = num?num: 1;
    //    console.log(children);
    //    if(children && children.length>0){
    //        children.forEach(function(item,index){
    //            return that.test(item.children,++i);
    //        })
    //    }else{
    //        return i;
    //    }
    //
    //},
    cutDuplicateArr(arr){
        var lg = arr.length;
        arr.forEach(function(item,index){
            for(var i=0;i<lg;i++){
                for(var j=i+1;j<lg;j++){
                    if(arr[i].source === arr[j].source && arr[i].target === arr[j].target){
                        arr.splice(i,1);
                        lg--;
                        j--;
                    }
                }
            }
        })
        return arr;
    },

    arrayUnique(object,arr, name) {   //根据数组某项数据进行去重
        var hash = {},newArr = [],flag= false;
        return arr.reduce(function (item, next) {
            hash[next[name]] ? flag=true : hash[next[name]] = true && item.push(next);
            //if(flag){
            //    //object.common.messageUtil({type:'info',message:name+'重复'});
            //    return false;
            //}
            return item;
        }, []);
    },
    countNumArrayUnique(arr,param) {
        var map = {},
            dest = [];
        if(param.length === 1){
            arr.forEach(function(item,index){
                if(!map[item[param]]){
                    dest.push(item);
                    map[item[param]] = item;
                }else{
                    dest.forEach(function(val,num){
                        if(val[param] == item[param]){
                            return false;
                        }
                    });
                }
            });
        }
        return dest;
    },
    getDataRecursion(res,data,links,x,y,color,position,level){
        let max = null;
        let obj = data.filter(x=>{return x.level === level});
        if(obj && obj.length>0){ //防止重叠 取y最大值继续增加
            let findMaxY = obj.map((val,index)=>{ return val.y});
            if(findMaxY.length > 0){
                max = _.max(findMaxY);
                y = max;
            }
        }
        res.children.forEach(function (item, index) {
            data.push({
                name: item.taskName,
                itemStyle: {
                    color: color
                },
                x: x,
                y: y+(index + 1) * 50,
                label:{
                    color:'#000',
                    position:position
                },
                level:level
            });
            links.push({
                source: res.taskName,
                target: item.taskName
            })
        });
    },
    traverseTree(node,datas,linkss,num,obj,xx){
        var temp,initNum=0,data=datas?datas:[],links=linkss?linkss:[],
            that = this, j= num?num:1,res =node,i = xx ?xx:0,
            flag = Object.keys(obj).length !== 0?obj: {
                flag2: 0,
                flag3: 0,
                flag4: 0,
                flag5: 0,
                flag6: 0,
                flag7: 0,
                flag8: 0,
                flag9: 0,
                flag10: 0,
                flag11: 0,
                flag12: 0,
                flag13: 0,
                flag14: 0,
                flag15: 0,
                flag16: 0,
                flag17: 0,
                flag18: 0,
                flag19: 0,
                flag20: 0
            };
        var position = '';
        if (node.children && node.children.length > 0) {
            ++j;
            if(j%2 ===0){
                position = 'top';
            }else{
                position = 'bottom';
            }
            if(j === 2){
                flag.flag2++;
                that.getDataRecursion(res,data,links,300,300 +(flag.flag2 + 1) * 50,colors[1],position,j);
            }else if(j === 3){
                flag.flag3++;
                that.getDataRecursion(res,data,links,380,300 +(flag.flag3 + 1) * 50,colors[2],position,j);
            }else if(j === 4){
                flag.flag4++;
                that.getDataRecursion(res,data,links,460,320 +(flag.flag4 + 1) * 50,colors[3],position,j);
            }else if(j === 5){
                flag.flag5++;
                that.getDataRecursion(res,data,links,520,320 +(flag.flag5 + 1) * 50,colors[4],position,j);
            }
            else if(j === 6){
                flag.flag6++;
                that.getDataRecursion(res,data,links,580,340 +(flag.flag6 + 1) * 50,colors[5],position,j);
            }else if(j === 7){
                flag.flag7++;
                that.getDataRecursion(res,data,links,640,340 +(flag.flag7 + 1) * 50,colors[6],position,j);
            }else if(j === 8){
                flag.flag8++;
                that.getDataRecursion(res,data,links,700,360 +(flag.flag8 + 1) * 50,colors[7],position,j);
            }else if(j === 9){
                flag.flag9++;
                that.getDataRecursion(res,data,links,760,360 +(flag.flag9 + 1) * 50,colors[8],position,j);
            }else if(j === 10){
                flag.flag10++;
                that.getDataRecursion(res,data,links,820,360 +(flag.flag10 + 1) * 50,colors[9],position,j);
            } if(j === 11){
                flag.flag11++;
                that.getDataRecursion(res,data,links,880,380 +(flag.flag11 + 1) * 50,colors[10],position,j);
            }else if(j === 12){
                flag.flag12++;
                that.getDataRecursion(res,data,links,940,380 +(flag.flag12 + 1) * 50,colors[11],position,j);
            }else if(j === 13){
                flag.flag13++;
                that.getDataRecursion(res,data,links,1000,380 +(flag.flag13 + 1) * 50,colors[12],position,j);
            }else if(j === 14){
                flag.flag14++;
                that.getDataRecursion(res,data,links,1060,400 +(flag.flag14 + 1) * 50,colors[13],position,j);
            }
            else if(j === 15){
                flag.flag15++;
                that.getDataRecursion(res,data,links,1120,400 +(flag.flag15 + 1) * 50,colors[14],position,j);
            }else if(j === 16){
                flag.flag16++;
                that.getDataRecursion(res,data,links,1180,420 +(flag.flag16 + 1) * 50,colors[15],position,j);
            }else if(j === 17){
                flag.flag17++;
                that.getDataRecursion(res,data,links,1240,420 +(flag.flag17 + 1) * 50,colors[16],position,j);
            }else if(j === 18){
                flag.flag18++;
                that.getDataRecursion(res,data,links,1300,440 +(flag.flag18 + 1) * 50,colors[17],position,j);
            }else if(j === 19){
                flag.flag19++;
                that.getDataRecursion(res,data,links,1360,440 +(flag.flag19 + 1) * 50,colors[18],position,j);
            }else if(j === 20){
                flag.flag20++;
                that.getDataRecursion(res,data,links,1420,460 +(flag.flag20 + 1) * 50,colors[19],position,j);
            }
            flag = {
                flag2:flag.flag2,
                flag3:flag.flag3,
                flag4:flag.flag4,
                flag5:flag.flag5,
                flag6:flag.flag6,
                flag7:flag.flag7,
                flag8:flag.flag8,
                flag9:flag.flag9,
                flag10:flag.flag10,
                flag11:flag.flag11,
                flag12:flag.flag12,
                flag13:flag.flag13,
                flag14:flag.flag14,
                flag15:flag.flag15,
                flag16:flag.flag16,
                flag17:flag.flag17,
                flag18:flag.flag18,
                flag19:flag.flag19,
                flag20:flag.flag20
            };
            for (var i = 0; i < node.children.length; i++) {
                temp =  that.traverseTree(node.children[i],data,links,j,flag);
                if(temp>initNum){
                    initNum = temp;
                }

            }
            return {data:datas,links:linkss};
        }else {
            return 1
        }
    },
    //将对象转换为pathParam
    formatPathParam:(paramObj)=>{
        let pathParam = '?';
        let hasParam = false;
        for(let variable in paramObj){
            if(paramObj[variable] === 0 || paramObj[variable]){
                pathParam += variable + '=' + paramObj[variable] + '&';
                hasParam = true;
            }
        }
        if(hasParam){
            pathParam = pathParam.substr(0,pathParam.length-1);
        }else{
            pathParam = '';
        }
        if((typeof paramObj =='string') && paramObj.constructor== String){
            return paramObj;
        }else{
            return pathParam;
        }  
    },
    //获取url后的参数
    getPathParam:()=>{
        let name,value;
        let str = window.location.href;
        let pathParam = {};
        let num = str.indexOf("?")
        str = str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){
            num=arr[i].indexOf("=");
            if(num>0){
                name = arr[i].substring(0,num);
                value = arr[i].substr(num+1);
                pathParam[name]=value;
            }
        }

        return pathParam;
    },
    //时间戳转时间
    formatDate (date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
            }
        }
        return fmt
    },

    //验证手机号码
    validTele (tele){
        var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        return reg.test(tele);

    },

    //验证 支持除特殊符号外的所有半角字符（数字、汉字、字母和符号）
    validSpecificSym (value){
        var reg= /[@#\$%\^&\*]+/g ;
        return !reg.test(value);

    },

    //list转string
    listToString (list,separator){
        let tempStr = '';
        list.forEach(function(item,index){
            if(index != list.length - 1){
                tempStr += item + separator;
            }else if(index == list.length - 1){
                tempStr += item;
            }
        });
        return tempStr;
    },
    //删除数组中制定索引的对象
    removeIndex (list,dx){
        if (isNaN(dx) || dx > this.length){
            return false;
        }
        let tempList = [];
        for (let i = 0; i < list.length; i++){
            if(i != dx){
                tempList.push(list[i]);
            }
        }
        return tempList;
    },
    //判断对象中是否包含某一对象
    isInArray (list,currentObj){
        var includeFlag = false;
        list.forEach(function(item){
            if(_.isEqual(item,currentObj)){
                includeFlag = true;
            }
        });
        return includeFlag;
    },
    formatterAmount (amountStr){
        let formatterValue = amountStr.toString().split("").reverse().join("").replace(/(\d{3})+?/g,function(s){
            return s+",";
        }).replace(/,$/,"").split("").reverse().join("");
        return formatterValue ;
    },
    checkFilePath (filePath) {
      let fileArr = []
      if (filePath === null) return fileArr
      let path = filePath.split(';')
      path.forEach(function(value, index) {
        let nameArr = value.split('/')
        let name = nameArr[nameArr.length - 1]
        nameArr.splice(nameArr.length - 1, 1)
        let path = nameArr.join('/')
        fileArr.push({
          fileName: name,
          filePath: path
        })
      })
      return fileArr
    },
    exportTemplate(name,url){
            let a = document.createElement('a');
            a.download = name;
            a.href = url;
            a.target = '_blank';
            a.click();
    },
    getStartDatePick(End){  //如果先选了结束时间，开始时间限制小于等于结束时间
        return {
            disabledDate:(time)=>{
                if(End){
                    return time.getTime() >=new Date(End).getTime() ;
                }
            }

        }
    },
    getEndDatePick(start){ //如果先选了开始时间，结束时间限制大于等于开始时间
        return {
            disabledDate:(time)=>{
                if(start){
                    return time.getTime() < new Date(start).getTime()- 8.64e7;
                }
            }
        }
    },

    //获取当前时间，格式YYYY-MM-DD
    getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return year + seperator1 + month + seperator1 + strDate;
    },

    messageUtil (param){
        if(param.type === 'error'){
            Message({
                message   : param.message,
                type      : param.type,
                showClose : true,
                duration  : 0,
                onClose   : param.onClose
            })
        }else{
            Message({
                message   : param.message,
                type      : param.type,
                showClose : true,
                duration  : param.duration ? param.duration : 3000,
                onClose   : param.onClose
            })
        }
    },
    infoMessage (param){
        Message({
            message   : param,
            type      : 'info',
            showClose : true,
            duration  : param.duration ? param.duration : 3000
        })
    },
    successMessage (param){
        Message({
            message   : param,
            type      : 'success',
            showClose : true,
            duration  : param.duration ? param.duration : 3000
        })
    },
    warningMessage (param){
        Message({
            message   : param,
            showClose : true,
            type      :'warning',
            duration  : param.duration ? param.duration : 3000
        })
    },
    errorMessage (param){
        Message({
            message   : param,
            type      : 'error',
            showClose : true,
            duration  : 0

        })
    },
    concatAndRemoval (arr1,arr2,keyWord){
        let resultArr = arr1.concat();
        arr2.forEach(function(currentItem){
            let isDuplicate = false;
            arr1.forEach(function(item){
                if(keyWord){
                    if(item[keyWord] == currentItem[keyWord]){
                        isDuplicate = true
                    }
                }else{
                    if(item == currentItem){
                        isDuplicate = true
                    }
                }
            });
            if(!isDuplicate){
                resultArr.push(currentItem)
            }
        })
        
        return resultArr;
        
    }

//    //获取数据字典选项
//    getDictionaryOptions(code){
//         return new Promise ((resolve) => {
//             api.getDictionaryByNumber(code,function(res){
//                 resolve(res.data);
//             })
//         });

//    }
}
