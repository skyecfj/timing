<template>
    <!--<div id="not-found">-->
        <!--<h1>OOPS - Could not find it</h1>-->
        <!--<strong>-->
            <!--404-->
        <!--</strong>-->
    <!--</div>-->
    <div id="da-wrapper" class="fluid">

        <!-- Content -->
        <div id="da-content">

            <!-- Container -->
            <div class="da-container clearfix">

                <div id="da-error-wrapper">

                    <div id="da-error-pin"></div>
                    <div id="da-error-code">
                        error <span>404</span>                    </div>

                    <h1 class="da-error-heading">哎哟喂！你会不会玩！这儿没啦！</h1>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'notFoundComponent'

    }
</script>
<style lang="scss" scoped>
    body{
        background: url(../../assets/blueprint.png);
    }
    @-webkit-keyframes error-swing{0%{-webkit-transform:rotate(1deg)}100%{-webkit-transform:rotate(-2deg)}}
    @-moz-keyframes error-swing{0%{-moz-transform:rotate(1deg)}100%{-moz-transform:rotate(-2deg)}}
    @keyframes error-swing{0%{transform:rotate(1deg)}100%{transform:rotate(-2deg)}}
    div#da-error-wrapper {
        width: 380px;
        padding: 30px 0;
        margin: auto;
        position: relative;
        #da-error-code span {
            font-size: 96px;
            display: block;
         }
        #da-error-code {
            width: 285px;
            height: 170px;
            padding: 127px 16px 0 16px;
            position: relative;
            margin: auto;
            margin-bottom: 20px;
            z-index: 5;
            line-height: 1;
            font-size: 32px;
            text-align: center;
            background: url(../../assets/error-hanger.png) no-repeat center center;
            -webkit-transform-origin: center top;
            -moz-transform-origin: center top;
            transform-origin: center top;
            -webkit-animation: error-swing infinite 2s ease-in-out alternate;
            -moz-animation: error-swing infinite 2s ease-in-out alternate;
            animation: error-swing infinite 2s ease-in-out alternate;
        }
        #da-error-pin {
            width: 38px;
            height: 38px;
            display: block;
            margin: auto;
            margin-bottom: -27px;
            z-index: 10;
            position: relative;
            background: url(../../assets/error-pin.png) no-repeat center center;
        }
        .da-error-heading {
            color: #e15656;
            text-align: center;
            font-size: 24px;
            font-family: Georgia,"Times New Roman",Times,serif;
        }
    }

</style>