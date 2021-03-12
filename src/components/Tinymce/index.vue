<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
  </div>
</template>

<script>
import tinymceSetting from './setting'
import zh_CN from './zh_CN'
export default {
  name: 'tinymce',
  props: {
    isDisabled:{
      type:Boolean
    },
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    menubar: {
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 150
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date(),
      fullscreen: false,
      tinymceSetting:{},
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  methods: {
    initTinymce() {
      this.settingTinymce()
      window.tinymce.init(this.tinymceSetting)
    },
    settingTinymce(){
      var _this = this
      this.tinymceSetting =  Object.assign(
                {},
                tinymceSetting,
                {
                    selector: `#${this.tinymceId}`,
                    language_url: 'zh_CN',
                    language: 'zh_CN',
                    branding: false,
                    height: this.height,
                    body_class: 'panel-body ',
                    object_resizing: false,
                    branding: false,
                    menubar:false,
                    plugins: [tinymceSetting.plugins[0], 'searchreplace visualblocks visualchars code fullscreen nonbreaking', tinymceSetting.plugins[2]],
                    toolbar1: "newdocument | removeformat | undo redo | fontselect fontsizeselect formatselect | forecolor backcolor | bold italic underline strikethrough subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | first_line_indent body_margin | margin_top margin_bottom line_height letter_spacing | table ",
                    //skin
                    // skin: 'custom',

                    // // font
                    font_formats: "默认=微软雅黑, Microsoft YaHei, Arial, sans-serif;宋体=SimSun;微软雅黑=Microsoft YaHei,Apple LiGothic Medium;楷体=KaiTi,KaiTi_GB2312, SimKai;黑体=SimHei,STHeiti;隶书=LiSu,SimLi;andale mono=andale mono;arial=arial, helvetica, sans - serif;arial black=arial black, avant garde;comic sans ms=comic sans ms;impact=impact, chicago;Times New Roman=Times New Roman;",
                    fontsize_formats: "12px 14px 16px 18px 20px 24px 36px",

                    //list
                    advlist_bullet_styles: "default,circle,disc,square",
                    advlist_number_styles: "decimal,decimal-leading-zero,lower-alpha,upper-alpha,lower-greek,lower-roman,upper-roman,simp-chinese-informal,simp-chinese-formal,cjk-heavenly-stem,cjk-earthly-branch",

                    //link
                    link_title: false,
                    readonly:this.isDisabled,

                    //style
                    formats: {
                        margin_top: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li,table,img', styles: { marginTop: '%value' } },
                        margin_bottom: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li,table,img', styles: { marginBottom: '%value' } },
                        line_height: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li,table,img', styles: { lineHeight: '%value' } },
                        letter_spacing: { inline: 'span', styles: { letterSpacing: '%value' } },
                        first_line_indent: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li,table', styles: { textIndent: '16px' } },
                        wrapper_margin: { block: 'section', wrapper: 1, styles: { marginLeft: '%value', marginRight: '%value' }, attributes: { 'data-adm-wrapper': 'page' } }
                    },
                     init_instance_callback: editor => {
                      if (_this.value) {
                        editor.setContent(_this.value)
                      }
                      _this.hasInit = true
                      editor.on('NodeChange Change KeyUp SetContent', () => {
                        this.hasChange = true
                        this.$emit('input', editor.getContent())
                      })
                    },

                    setup(editor) {
                      // editor.on('FullscreenStateChanged', (e) => {
                      //   _this.fullscreen = e.state
                      // })
                    }
                }
            )
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    }
  },
  destroyed() {
    // this.destroyTinymce()
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
