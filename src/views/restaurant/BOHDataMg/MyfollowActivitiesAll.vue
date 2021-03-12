<!-- Created by smile-->
<template>
    <div class="myFollowingActivities">
        <!-- <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">用户名称</div>
                <el-input v-model.trim="userName" size="small" clearable></el-input>
            </div>
            <el-button size="small" @click="getAllUser" class="c-button c-button--primary">查询</el-button>
        </div> -->
        <div class="content">
            <el-row :gutter="20" type="flex">
                <el-col :span="10">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>用户列表</span>
                        </div>
                        <el-table :data="dynamicDataLeft" max-height="800"
                                  highlight-current-row :row-style="styleFn" @row-click="showBelongs">
                            <el-table-column prop="userName" ></el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="10">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>关注的活动</span>
                        </div>
                        <el-table :data="dynamicDataRight">
                            <el-table-column prop="activityName"></el-table-column>
                        </el-table>
                        <br>
                        <el-button size="small" type="success" class="align" @click="openDialog" v-if="showBtn">修改
                        </el-button>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <el-dialog :visible.sync="dialogVisible" width="60%">
            <el-transfer
                    size="medium"
                    filterable
                    :titles="['所有活动', '已关注活动']"
                    filter-placeholder="请输入活动名称"
                    v-model="selectedActivities"
                    @filter-method="filterMethod"
                    @change="handleChange"
                    :data="activities">
            </el-transfer>
            <br>
            <el-button size="small" type="success" @click="update">保存</el-button>
            <el-button size="small" type="success" @click="cancel">取消</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../model/apidr'

    export default {
        name: 'MyfollowActivitiesAll',
        data () {
            return {
                userName: '',
                dynamicDataLeft: [],
                dynamicDataRight: [],
                activities: [],
                selectedActivities: [],
                dialogVisible: false,
                userId: '',
                showBtn: false
            }
        },
        methods: {
            openDialog () {
                this.dialogVisible = true;
                this.getAllActivityById();
                this.generateData2();
            },
            update () {
                let that = this;
                // if(!this.selectedActivities || this.selectedActivities.length === 0){
                //     this.common.messageUtil({
                //         type:'warning',
                //         message:'右边数据并未发生变动，请操作之后进行保存'
                //     });
                //     return;
                // }
                this.$confirm('确定修改吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.saveMyActivity({
                        id: that.userId,
                        activityIdList: that.selectedActivities
                    },function(){
                        that.getAllUser();
                        that.showBtn = false;
                        that.dynamicDataRight = [];
                        that.dialogVisible = false;
                    })
                })

            },
            cancel () {
                this.dialogVisible = false;
            },
            getAllUser () {
                let that = this;
                api.getAllUserForActivity(this.common.joinSearchParam([{
                    value: this.userName,
                    name: 'userName'
                },
                ]), function (res) {
                    if (res.code === 200) {
                        that.dynamicDataLeft = res.data;
                        that.showBelongs(that.dynamicDataLeft[0])
                    } else {
                        that.dynamicDataLeft = [];
                    }
                })
            },
            getAllActivityById () {
                // let that = this;
                this.selectedActivities = [];
                if (this.dynamicDataRight && this.dynamicDataRight.length > 0) {
                    this.dynamicDataRight.forEach( (item, index)=> {
                        this.selectedActivities.push(item.id);
                    },this)
                }
            },
            showBelongs (row, event, column) {
                this.userId = row.id
                this.dynamicDataRight = row.activityInfoDtoList;
                this.showBtn = true;
            },
            generateData2 () {
                // let activities = [];
                // let that = this;
                api.getAllActivity(this.common.joinSearchParam([
                        {value: this.userId, name: 'userId'},
                    ]
                ),  (res)=> {
                    this.activities = [];
                    if (res.code === 200) {
                        res.data.forEach((activity, index) => {
                            this.activities.push({
                                label: activity.activityName,
                                key: activity.id,
                            });
                        },this);
                    }
                })
            },
            filterMethod (query, item) {
                return item.label.indexOf(query) > -1;
            },
            handleChange (value, direction, movedKeys) {
                // console.log(value, direction, movedKeys);
            },
            styleFn(object){
                return {
                    cursor:'pointer'
                }
            },
        },
        created () {
            this.getAllUser();
        },
        mounted () {
        }
    }
</script>

<style lang="scss">
    .myFollowingActivities {
        .content {
            min-width: 800px;
        }
        .box-card {
            width: 480px;
            /*height: 98%;*/
            min-height:600px;
            overflow-y: hidden;
            position: relative;
            .el-table--fit{
                max-height: 445px;
                overflow-y: auto;
            }
        }
        .align {
            text-align: center;
            margin: 0 auto;
            position: absolute;
            bottom: 20px;
            right: 20px;
        }
        .el-transfer .el-transfer-panel {
            width: 42%;
        }
    }
</style>
