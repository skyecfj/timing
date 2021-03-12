<template>
    <el-form
            class="viewForm"
            label-position="top"
            ref="dataDictionary"
            :model="dataDictionary"
            :rules="rules"
            label-width="100px">
        <div class="viewFormHeader">
            <el-form-item v-if="dateDictionaryId !== ''" label="字典项编号" class="viewFormDataDic" prop="dictionaryNumber">
                <el-input size="small"  placeholder="" v-model="dataDictionary.dictionaryNumber" disabled></el-input>
            </el-form-item>
            <el-form-item v-else label="字典项编号" class="viewFormDataDic" prop="dictionaryNumber">
                <el-input size="small"  placeholder="" v-model="dataDictionary.dictionaryNumber" clearable></el-input>
            </el-form-item>
            <el-form-item label="字典项名称" class="viewFormDataDic" prop="dictionaryEntryName">
                <el-input size="small"  placeholder="" v-model="dataDictionary.dictionaryEntryName" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <br>
            <span v-for="(item,index) in dataDictionary.dictionaryEntries" :key="index">
                <el-form-item
                        label="属性值编号"
                        class="viewFormDataDic"
                        :prop="'dictionaryEntries.' + index + '.dictionaryEntryCode'"
                        :rules="dictionaryEntryCodeRules">
                    <el-input size="small" placeholder="" v-model="item.dictionaryEntryCode" clearable :disabled="isChecked"></el-input>
                </el-form-item>
                <el-form-item
                        label="属性值"
                        class="viewFormDataDic"
                        :prop="'dictionaryEntries.' + index + '.dictionaryEntryName'"
                        :rules="dictionaryEntryNameRules">
                    <el-input size="small"  placeholder="" v-model="item.dictionaryEntryName" clearable :disabled="isChecked" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="" class="viewFormDataButton">
                    <el-button size="small"  v-if="dataDictionary.dictionaryEntries.length > 1" icon="el-icon-minus" circle @click="deleteRow(index)" class="button" :disabled="isChecked"></el-button>
                    <el-button size="small"  v-if="(index + 1) === dataDictionary.dictionaryEntries.length" icon="el-icon-plus" circle @click="addRow()" class="button" :disabled="isChecked"></el-button>
                </el-form-item>
            </span>
            <el-form-item label="备注" class="cardRemark">
                <el-input size="small"
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 10}"
                        placeholder="请输入(1-100位)"
                        maxlength="100"
                        v-model="dataDictionary.dictionaryDescribe"
                        :disabled="isChecked">
                </el-input>
            </el-form-item>
        </div>
        <div class="viewFormContent" v-if="dateDictionaryId !== ''">
            <el-form-item label="更新时间">
                <el-input size="small"  placeholder="" v-model="dataDictionary.modifiedTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新人">
                <el-input size="small"  placeholder="" v-model="dataDictionary.modifiedUser" disabled></el-input>
            </el-form-item>
        </div>
        <div class="buttomButton" v-if="!isChecked">
            <el-form-item>
                <el-button size="small"  type="success" plain @click='cancel' class="c-button">取消</el-button>
                <el-button size="small"  type="success" @click="insertDataDictionary('dataDictionary')" class="c-button">保存</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script>
    import ip from '../../model/api'
    const dictionaryEntries = {
        dictionaryEntryCode: '',
        dictionaryEntryName: ''
    };
    export default {
        name: "dataDictionaryAdd",
        data(){
            var dictionaryEntryNameRule = (rule,value,callback) => {
                if(!/^[A-Za-z0-9\u4e00-\u9fa5！~·@#%……&*（）——、。-，；：“”？,.?""'';()!:\+\=\ \\\/\_\-]+$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入1-50位的数字、汉字、字母、符号(特殊符号除外)'));
                }else{
                    callback()
                }
            };
            // var dictionaryEntryCodeRule = (rule,value,callback) => {
            //     console.log(isNaN(value));
            //     if(!/^([0-9]{1,2})$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('只能输入1-2位的数字'));
            //     }else{
            //         callback()
            //     }
            // };
            return{
                isChecked:false,
                dateDictionaryId: '',
                dictionaryEntryName:'',
                dataDictionary: {
                    dictionaryEntries: [Object.assign({},dictionaryEntries)]
                },
                rules: {
                    dictionaryNumber: [
                        { required: true, message: '请输入字典项代码', trigger: 'blur' }
                    ],
                    dictionaryEntryName: [
                        { required: true, message: '请输入字典项名称', trigger: 'blur' }
                    ]
                },
                dictionaryEntryCodeRules:[
                    { required: true, message: '属性值编号不能为空', trigger: 'blur' }
                    // { validator: dictionaryEntryCodeRule }
                ],
                dictionaryEntryNameRules:[
                    { required: true, message: '属性值不能为空', trigger: 'blur' },
                    { validator: dictionaryEntryNameRule }
                ],
                items: [Object.assign({},dictionaryEntries)],
                checkedDictionaryNumber: '',
                checkedDictionaryName: ''
            }
        },
        methods:{
            cancel(){
                this.common.deleteTag(this.$route,this);
            },
            addRow(){
                this.dataDictionary.dictionaryEntries.push(Object.assign({},dictionaryEntries));
            },
            deleteRow(index){
                this.dataDictionary.dictionaryEntries.splice(index,1);
            },
            getdataDictionary(dateDictionaryId){
                var that = this;
                ip.getDateDictionaryById(dateDictionaryId, function (res) {
                    if(res.code === 200){
                        that.dataDictionary = res.data;
                        that.dictionaryEntryName = that.dataDictionary.dictionaryEntryName;
                        if(that.dataDictionary.dictionaryEntries.length < 1){
                            that.dataDictionary.dictionaryEntries = that.items;
                        }
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                })
            },
            insertDataDictionary(formName){
                var that = this;
                delete this.dataDictionary.modifiedUser;
                delete this.dataDictionary.modifiedTime;
                delete this.dataDictionary.createUser;
                delete this.dataDictionary.createTime;
                that.$refs[formName].validate((valid) => {
                    if(valid){
                        if(that.isRepeated(that.dataDictionary.dictionaryEntries)){
                            if(that.dateDictionaryId !== ''){
                                if(that.dataDictionary.dictionaryEntryName !== that.dictionaryEntryName){
                                    ip.checkDateDictionaryName(that.dataDictionary.dictionaryEntryName,function (res) {
                                        that.checkedDictionaryName = res.data;
                                        if( that.checkedDictionaryName ){
                                            //修改时将新增的属性加id为null
                                            that.dataDictionary.dictionaryEntries.forEach(item => {
                                                if(!item.hasOwnProperty('id')){
                                                    that.$set(item,'id',null);
                                                }
                                            })
                                            ip.updateDateDictionary(that.dataDictionary,function (res) {
                                                if(res.code === 200){
                                                    that.common.messageUtil({
                                                        type:'success',
                                                        message:res.data
                                                    });
                                                    that.cancel();
                                                }else{
                                                    that.common.messageUtil({
                                                        type:'info',
                                                        message:res.msg
                                                    });
                                                }
                                            })
                                        }else{
                                            that.common.messageUtil({
                                                type:'info',
                                                message:'字典项名称重复'
                                            });
                                        }
                                    })
                                }else{
                                    //修改时将新增的属性加id为null
                                    that.dataDictionary.dictionaryEntries.forEach(item => {
                                        if(!item.hasOwnProperty('id')){
                                            that.$set(item,'id',null);
                                        }
                                    })
                                    ip.updateDateDictionary(that.dataDictionary,function (res) {
                                        if(res.code === 200){
                                            that.common.messageUtil({
                                                type:'success',
                                                message:res.data
                                            });
                                            that.cancel();
                                        }else{
                                            that.common.messageUtil({
                                                type:'info',
                                                message:res.msg
                                            });
                                        }
                                    })
                                }
                            }else{
                                ip.checkDateDictionaryNum(this.dataDictionary.dictionaryNumber,function (res) {
                                    that.checkedDictionaryNumber = res.data;
                                    if( that.checkedDictionaryNumber ){
                                        ip.checkDateDictionaryName(that.dataDictionary.dictionaryEntryName,function (res) {
                                            that.checkedDictionaryName = res.data;
                                            if( that.checkedDictionaryName ){
                                                ip.addDateDictionary(that.dataDictionary,function (res) {
                                                    if(res.code === 200){
                                                        that.common.messageUtil({
                                                            type:'success',
                                                            message:res.data
                                                        });
                                                        that.cancel();
                                                    }else{
                                                        that.common.messageUtil({
                                                            type:'info',
                                                            message:res.msg
                                                        });
                                                    }
                                                })
                                            }else {
                                                that.common.messageUtil({
                                                    type:'info',
                                                    message:'字典项名称重复'
                                                });
                                            }
                                        });
                                    }else{
                                        that.common.messageUtil({
                                            type:'info',
                                            message:'字典项编号重复'
                                        });
                                    }
                                })
                            }
                        }else {
                            that.common.messageUtil({
                                type:'info',
                                message:'属性值编号或属性值重复'
                            });
                        }
                    }else{
                        return false;
                    }
                });
            },
            isRepeated(dictionaryEntries){
                var code = [];
                var name = [];
                dictionaryEntries.forEach((item,index) => {
                    code.push(item.dictionaryEntryCode);
                    name.push(item.dictionaryEntryName);
                });
                var newCode = [...new Set(code)];
                var newName = [...new Set(name)];
                if( code.length === newCode.length && name.length ===newName.length ){
                    return true
                }else{
                    return false
                }
            }
        },
        mounted(){
            if(this.$route.query.id){
                this.dateDictionaryId = this.$route.query.id;
                this.getdataDictionary(this.dateDictionaryId);
            }
            if(this.$route.query.detail){
                this.isChecked = true;
            }else{
                this.isChecked = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>