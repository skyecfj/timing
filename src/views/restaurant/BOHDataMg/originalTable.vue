<template>
    <!--:span-method="spanMethod"-->
    <div class="originalTable">
        <el-table :data="dynamicData" border :cell-style="nullRowStyle? null : commonRowStyle" @selection-change="handleSelectionChange"
                  :header-cell-style="headerStyle" :show-header="showHeader"
                  :span-method="spanMethod" :height="height || tblHeight" :row-class-name="rowClassName"
        >
            <el-table-column type="index" width="50" header-align="center" v-if="index.flag" :label="index.label" :resizable="resizable">
            </el-table-column>
            <el-table-column type="selection" width="55" header-align="center" v-if="selection" :resizable="resizable" :selectable="randerSelectableFn"></el-table-column>
            <template v-for="(item,index) in tableHead">
                <el-table-column width="150" header-align="center" v-if="item.fixed" :formatter="item.formatter" :label="item.label" :resizable="resizable">
                    <!-- 强耦合 第三方账单接入数据管理 -->
                </el-table-column>
                <el-table-column v-if="!item.multiple && !item.fixed" :header-align="item.align? item.align : 'center'"
                                 :class-name="item.columnClass" :align="item.align? item.align : 'center'"
                                 :label="item.label"
                                 :key="index"
                                 :width="item.width||'auto'" :resizable="resizable"> <!--单表头显示-->
                    <template slot="header" slot-scope="headerItem" >
                        <div v-if="item.labelComments" class="th-with-comment" >
                            <p>{{item.label}}</p>
                            <p :style="'color:'+item.commentColor" >{{item.labelComments}}</p>
                        </div>
                        <span v-if="!item.labelComments" >{{item.label}}</span>
                    </template>
                    <template slot-scope="scope"> <!--单个链接或者编辑按钮的显示-->
                        <template v-if="item.title" >
                            <span :title="scope.row[item.prop]" >{{item.formatter(scope.row)}}</span>
                        </template>
                        <template v-if="item.singleMultiple&&item.list.length>0" v-for="(item11,index11) in item.list"><!-- 一个单元格多个按钮 -->
                            <a class="link-blue"
                               @click="item11.method(index,scope.row)"
                               v-if="item11.showFn?item11.showFn(scope.row):item11.showItem?!!scope.row[item11.showItem] === item11.showFlag:true">{{item11.label}}</a>

                            <span  v-if="!index11===item.list.length-1">&nbsp;</span><!--多个按钮之间空格--->
                        </template>
                        <a v-if="!item.type&&item.edit&&!item.children" class="link-blue"
                           @click="item.method(index,scope.row,scope.row[item.prop],scope.$index)">
                            <template v-if="!scope.row[item.prop] && item.emptyText">{{item.emptyText}}</template>
                            <template v-if="item.formatter">{{item.formatter(scope.row)}}</template>
                            <template v-else>{{scope.row[item.prop]}}</template>
                            <!-- 若设置了单元格为空时的默认字符，则显示默认字符 -->
                        </a>
                        <span v-else-if="!item.type&&!item.edit&&!item.children&&!item.title">
                            <template v-if="item.formatter">
                                {{item.formatter(scope.row)}}
                            </template>
                            <template v-else>
                                {{scope.row[item.prop]}}
                            </template>
                            <template v-if="!scope.row[item.prop] && item.emptyText">{{item.emptyText}}</template>
                            <!-- 若设置了单元格为空时的默认字符，则显示默认字符 -->
                        </span>
                        <router-link v-if="item.type=='router'"
                                     :to="{name:item.router ,query : item.getQuery&&item.getQuery(scope.row) ? item.getQuery(scope.row) : null}">
                            <a class="link-blue">
                                {{scope.row[item.prop]}}
                                <template v-if="!scope.row[item.prop] && item.emptyText">{{item.emptyText}}</template>
                                <!-- 若设置了单元格为空时的默认字符，则显示默认字符 -->
                            </a>
                        </router-link>
                        <el-select v-model="scope.row[item.prop]" v-if="item.type==='select'"
                                   @change="item.method(scope.$index,scope.row)" filterable>
                            <el-option v-for="(optItem,index) in item.options" :value="optItem[item.selectValueKey]"
                                       :label="optItem[item.selectLabelKey]" :key="index"
                                       :selected="scope.row[item.prop] == optItem[item.selectValueKey]"></el-option>
                        </el-select>
                        <span v-else-if="item.type==='judge'&&!item.edit&&!item.children">{{scope.row[item.prop]?item.param[0]:item.param[1]}}</span>
                        <el-input v-if="item.type==='input'" v-model.trim="scope.row[item.prop]" :disabled="item.disabled" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.multiple" :label="item.label" header-align="center" :resizable="resizable"><!--多表头显示-->
                    <template slot="header" slot-scope="headerItem" >
                        <div v-if="item.labelComments" class="th-with-comment" >
                            <p>{{item.label}}</p>
                            <p :style="'color:'+item.commentColor" >{{item.labelComments}}</p>
                        </div>
                        <span v-if="!item.labelComments" >{{item.label}}</span>
                    </template>
                    <el-table-column
                            :label="item1.label"
                            :key="index1"
                            v-for="(item1,index1) in item.columns"
                            header-align="center"
                            :class-name="item1.columnClass"
                    >
                        <template slot="header" slot-scope="headerItem" >
                            <div v-if="item1.labelComments" class="th-with-comment" >
                                <p>{{item1.label}}</p>
                                <p :style="'color:'+item1.commentColor" >{{item1.labelComments}}</p>
                            </div>
                            <span v-if="!item1.labelComments">{{item1.label}}</span>
                        </template>
                        <template slot-scope="scope">
                            <template v-if="item1.type==='multiple' && item1.list.length>0" v-for="(item11,index11) in item1.list"><!-- 一个单元格多个按钮 -->
                                <a class="link-blue"
                                   @click="item11.method(index,scope.row)"
                                   v-if="item11.showFn?item11.showFn(scope.row):item11.showItem?!!scope.row[item11.showItem] === item11.showFlag:true">{{item11.label}}</a>
                                <span  v-if="!index11===item1.list.length-1">&nbsp;</span><!--多个按钮之间空格--->
                            </template>
                            <a v-if="!item1.type&&item1.edit&&!item1.children" class="link-blue"
                               @click="item1.method(index,scope.row,item1.formatter?item1.formatter(scope.row):null)">{{item1.formatter?item1.formatter(scope.row):scope.row[item1.prop]}}</a><!--格式化显示-->
                            <span v-else-if="!item1.type&&!item1.edit&&!item1.children">{{scope.row[item1.prop]}}</span>
                            <router-link v-if="item1.type=='router'"
                                         :to="{path:item1.router,query : item1.getQuery&&item1.getQuery(scope.row) ? item1.getQuery(scope.row) : null}">
                                <a class="link-blue">{{scope.row[item1.prop]}}</a></router-link>
                        </template>
                    </el-table-column>
                </el-table-column>
            </template>
            <el-table-column :label="operates.label||'操作'"
                             v-if="operates && operates.list&&operates.list.filter(_x=>_x.show === true).length > 0"
                             header-align="center" :width=operates.width :resizable="resizable">
                <template slot-scope="scope">
                    <template v-for="(btn,bIndex) in operates.list" >
                        <el-tooltip v-if="!btn.link && (btn.show || (btn.showFn&&btn.showFn(scope.row)))" :content="btn.label" placement="top" effect="light"
                                    popper-class="table-cell-toolTip" :key="'controlBtn_'+bIndex" >
                            <el-button size="small" :class="btn.class" @click="btn.method?btn.method(bIndex,scope.row,scope.row[bIndex]):null">
                                <router-link v-if="btn.router"
                                             :to="{path:btn.path,query : btn.getQuery&&btn.getQuery(scope.row) ? btn.getQuery(scope.row) : null}">
                                    <i :class="btn.iClass"></i></router-link>
                                <i v-if="!btn.router" :class="btn.iClass"></i>
                            </el-button>
                        </el-tooltip>
                        <el-button v-else-if="btn.link && btn.dynamic" size="small" :class="btn.class" @click="btn.method?btn.method(bIndex,scope.row,scope.row[bIndex]):null" >
                            <i :class="btn.iClass"></i>
                        </el-button>
                        <a v-else-if="btn.show && (btn.showFn&&btn.showFn(scope.row))" @click="btn.method(bIndex,scope.row,scope.row[bIndex])" class="linkClass"
                           :key="bIndex">{{btn.label}}</a>
                        <el-upload
                                :action="action"
                                :file-list="fileList"
                                :on-success="(response,file,fileList) => {return uploadSuccess(response,file,fileList)}"
                                :on-remove="(file,fileList) => {return removeFile(file,fileList)}"
                                :show-file-list="showFileList"
                                v-else-if="btn.upload"
                                style="display: inline-block;margin-left:15px;"
                        >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-external-link-square-alt"></i></el-button>
                        </el-upload>

                    </template>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-if="pageination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="pageSizesList"
                           :page-size="pageSize" class="gross" background
                           layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "originalTable",
        computed: {
            currentPage()
            {
                return this.pageIndex?this.pageIndex:this.curPage
            }
        },
        props: {
            //表头
            tableHead: {
                type: Array,
                default: function () {
                    return []
                }
            },
            //动态表格数据
            dynamicData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            tblHeight:{
                type: Number
            },
            //是否为可选状态
            selection: {
                type: Boolean,
                default: false
            },
            index: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            //表头align
            align: {
                type: String,
            },
            //表格类型筛选
            option: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            //操作
            operates: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            totalRecords: {
                type: Number,
                default: 0
            },
            pageination: {
                type: Boolean,
                default: true
            },
            headerStyle:{
                type: Function,
                default: function () {
                    return {}
                }
            },
            pageIndex:{
                type:Number,
                default:1
            },
            showHeader:{
                type:Boolean,
                default:true
            },
            spanMethod:{
                type: Function,
                // default: function ({ row, column, rowIndex, columnIndex }) {
                //     return []
                // }
            },
            needColRowSpan:{
                type:Boolean,
                default:false
            },
            resizable:{
                type:Boolean,
                default:true
            },
            nullRowStyle:{
                type:Boolean,
                default:false
            },
            action:{
                type:String,
                default:'',
            },
            fileList:{
                type:Array,
                default:()=>{
                    return []
                },
            },
            showFileList:{
                type:Boolean,
                default:false
            },
            height:{
                type:Number,
                default:null
            },
            //行的样式
            rowClassName:{
                type: Function,
            },
            randerSelectableFn:{
                type: Function,
                default:(row)=>{
                    return true
                }
            },
            pageSizesList:{
                type:Array,
                default:()=>{
                    return [25, 50, 75, 100, 125]
                },
            }

        },
        data() {
            return {
                pageSize: 25,
                curPage: 1,
                selectReason: '',//业务强耦合 为上传页面
                multipleSelection: []
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.$emit('handleSizeChange', size);
            },
            handleCurrentChange(currentPage) {
                this.curPage = currentPage;
                this.$emit('handleCurrentChange', currentPage)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.$emit('handleSelectionChange', val)
            },
            uploadSuccess(response,file,fileList){
                this.$emit('uploadSuccess', {response,file,fileList})
            },
            removeFile(){

            },
            commonRowStyle() {
                return {
                    'text-align': 'center'
                }
            },
        }
    }
</script>

<style scoped>
    .textarea-remark {
        min-height: 100px;
        width: 90%;
        padding: 8px;
    }

    .link-blue {
        color: #3a8ee6;
    }

    .linkClass {
        color: -webkit-link;
    }

    .linkClass:not(last-child) {
        margin-right: 5px;
    }
</style>
