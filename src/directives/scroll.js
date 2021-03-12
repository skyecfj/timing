/***
 * created by ZhangXiaoxiao  针对el-select 作滚动分页查询
 * */
// import Vue from 'vue'
export default {
    bind(el, binding,dom) {
        // 获取滚动页面DOM
        let SCROLL_DOM = el.querySelector('.el-scrollbar .el-scrollbar__wrap');
        SCROLL_DOM.addEventListener('scroll', function () {
            let flag = (this.scrollHeight - this.scrollTop - this.clientHeight  <= 5);
            //console.log(flag?'请求分页':'不请求');
            if(flag){
                binding.value(flag,this);
            }
        })
    }
}
