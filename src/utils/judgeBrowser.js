export default {
   isChrome(){
       let browser = navigator.userAgent.toLocaleLowerCase();
       if(browser.match(/chrome/) === null){
           alert('您的浏览器版本可能不太兼容，请选择chrome浏览器登录！')
       }
   }
}