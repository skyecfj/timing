<template>
    <div id="ecahrtTest" style="width: 100%;;height:600px;margin:0 auto" :taskId="taskId" :taskName="taskName">

    </div>
</template>
<script>
    import echarts from 'echarts'
    import api from '../../model/api'
    export default{
        name:'echartForTaskDepends',
        props:['taskId','taskName'],
        data(){
            return{
                myChart:{},
                option : {
                    title: {
                        text: ''
                    },
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'none',
                            symbolSize: 40,
                            roam: true,
                            label: {
                                normal: {
                                    show: true
                                }
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                normal: {
                                    textStyle: {
                                        fontSize: 10,
                                    }
                                }
                            },
                            data: [],
                            // links: [],
                            links: [],
                            lineStyle: {
                                normal: {
                                    opacity: 0.9,
                                    width: 2,
                                    curveness: 0
                                }
                            }
                        }
                    ]
                }
            };
        },
        methods:{
            init(){
                this.myChart = echarts.init(document.getElementById('ecahrtTest'));
                this.getRelationship(this.taskId);
            },
            getRelationship(id){
                var that = this;var data=[],links=[];
                api.viewTaskRelationship(id,function(res){
                    that.option.title.text = '查看'+that.taskName+'任务依赖';
                    var depth = that.common.traverseTree(res.data,[],[],1,{});
                    if(depth.data && depth.data.length>0){
                        depth.data.push({
                            name: res.data.taskName,
                            x: 220,
                            y: 390,
                            itemStyle: {
                                color: '#bdbdbd'
                            },
                            label:{
                                color:'#000',
                                position:'top'
                            }
                        });
                        if(res.data.children && res.data.children.length>0){
                            res.data.children.forEach(function(item,index){
                                depth.links.push({
                                    source:res.data.taskName,
                                    target:item.taskName
                                })
                            })
                        }
                        data = that.common.countNumArrayUnique(depth.data,['name']);
                        links = that.common.cutDuplicateArr(depth.links);
                        console.log('data:',data);
                        console.log('links:',links);
                        that.option.series[0].data = data;//.concat(depth.data);
                        that.option.series[0].links = links;//.concat(depth.links);
                    }else {
                        that.common.messageUtil({
                            type:'info',
                            message:'该任务暂无依赖'
                        });
                        that.option.series[0].data = data;
                        that.option.series[0].links = links;
                    }
                    that.myChart.setOption(that.option);
                })
            }
        },
        mounted(){
            this.init();
        },
        updated(){
            this.init();
        }
    }
</script>
<style >

</style>