<template>
  <div>

    <Row :gutter="10">
      <Col span="12">
      <Card>
        <h1>vuex 测试</h1>
        Clicked: {{ count }} times
        <Button type="primary" @click="increment">+</Button>
        <Button type="error">
          点击次数: {{ count }}
        </Button>
        <Button type="primary" @click="decrement">-</Button>
      </Card>
      </Col>
      <Col span="12">
      <Card>
        <Button type="primary" @click="info">显示普通提醒</Button>
      </Card>
      </Col>
    </Row>
    <div class="image-editor">
      <Row :gutter="10">
        <Col span="12">
        <Card>
          <p slot="title">
            <Icon type="qr-scanner"></Icon>
            基础实例
          </p>
          <Row :gutter="10">
            <Col span="14" class="image-editor-con1">
            <div class="cropper">
              <img id="cropimg1" alt="">
            </div>
            </Col>
            <Col span="10" class="image-editor-con1">
            <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
              <div id="preview1"></div>
            </Row>
            <div class="image-editor-con1-btn-con margin-top-10">

              <div class="margin-top-10" style="text-align: center;">
                <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput"/>
                <label class="filelabel" for="fileinput1">
                  <Icon type="image"></Icon>&nbsp;选择图片</label>
                <span><Button @click="handlecrop1" type="primary" icon="crop">裁剪</Button></span>
              </div>
              <div class="margin-top-10" style="text-align: center;">
                <ButtonGroup>
                  <Button @click="cropper1.rotate(-90)" type="primary">
                    <Icon :size="14" type="arrow-return-left"></Icon>
                  </Button>
                  <Button @click="cropper1.rotate(90)" type="primary">
                    <Icon :size="14" type="arrow-return-right"></Icon>
                  </Button>
                  <Button @click="cropper1.scaleX(-cropper1.getData().scaleX)" type="primary">
                    <Icon :size="14" type="android-more-horizontal"></Icon>
                  </Button>
                  <Button @click="cropper1.scaleY(-cropper1.getData().scaleY)" type="primary">
                    <Icon :size="14" type="android-more-vertical"></Icon>
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <Modal v-model="option1.showCropedImage">
              <p slot="header">预览裁剪之后的图片</p>
              <img :src="option1.cropedImg" alt="" v-if="option1.showCropedImage" style="width: 100%;">
            </Modal>
            </Col>
          </Row>
        </Card>
        </Col>
        <Col span="12">
        <Card>
          <p><b>x:</b>{{ cropdata1.x }}</p>
          <p><b>y:</b>{{ cropdata1.y }}</p>
          <p><b>width:</b>{{ cropdata1.w }}</p>
          <p><b>heigh:</b>{{ cropdata1.h }}</p>
          <p><b>deg:</b>{{ cropdata1.deg }}</p>
          <p><b>scaleX:</b>{{ cropdata1.scaleX }}</p>
          <p><b>scaleY:</b>{{ cropdata1.scaleY }}</p>
        </Card>
        </Col>
      </Row>


    </div>
    <Row>
      <Col span="12">

      <Card>
        <div slot="title">
          文件上传
        </div>
        <Upload
          multiple
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          type="drag"
          action="/api/test/multiFileUpload">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>

        <div class="demo-upload-list" v-for="item in mulitUploadList">
          <template>
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
        </div>

        <Upload
          ref="upload"
          multiple
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          type="drag"
          action="/api/test/multiFileUpload"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
          </div>
        </Upload>
        <Modal title="查看图片" v-model="visible">
          <i-Input v-model="imgUrl" readonly>
            <span slot="prepend">链接</span>
          </i-Input>
          <br>


          <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
      </Card>
      </Col>
      <Col span="12">
      <Upload action="//jsonplaceholder.typicode.com/posts/">
        <!--<Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>-->
      </Upload>
      </Col>
    </Row>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import Cropper from 'cropperjs'
  import '../my-components/image-editor/cropper.min.css'

  export default {
    computed: {
      // 使用对象展开运算符...将 getters 混入 computed 对象中
      ...mapGetters([
        'count'
      ])
    },
    data () {
      return {
        cropper1: {},
        option1: {
          showCropedImage: false,
          cropedImg: ''
        },
        cropdata1: {
          x: '',
          y: '',
          w: '',
          h: '',
          deg: '',
          scaleX: '',
          scaleY: ''
        },
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        imgUrl: '',
        visible: false,
        mulitUploadList: []
      }
    },
    methods: {
      ...mapActions([
        'increment', // 映射 this.increment() 为 this.$store.dispatch('increment')
        'decrement'
      ]),
      handleSuccess (response, file, fileList) {
        this.$alert('http://ow1prafcd.bkt.clouddn.com/' + response.key, '上传成功！', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        console.log(response)
      },
      info () {
        this.$Message.info('这是一条普通的提醒')
      },
      handleChange1 (e) {
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.onload = () => {
          this.cropper1.replace(reader.result)
          reader.onload = null
        }
        reader.readAsDataURL(file)
      },
      handlecrop1 () {
        let file = this.cropper1.getCroppedCanvas().toDataURL()
        this.option1.cropedImg = file
        this.option1.showCropedImage = true
      },
      handleSuccess (res, file, list) {
        if (file.status === 'finished') {
          this.$Message.success('上传成功!')
          file.url = file.response.result
        }
        this.getFileList()
      },
      handleView (item) {
        this.imgUrl = item.url
        this.imgName = item.name
        this.visible = true
      },
      handleRemove (file) {
        let _this = this
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除此图片, 是否继续?</p>',
          onOk: () => {
            this.$http.post('/api/test/filedelete', file)
              .then(response => {
                if (response.data.code === 0) {
                  _this.$Message.success('删除成功!')
                }
                _this.getFileList()
              })
          }
        })
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },
      getFileList () {
        this.listLoading = true
        this.$http.get('/api/test/filelist')
          .then(response => {
            if (response.data.code === 0) {
              this.mulitUploadList = response.data.result
            }
          })
      }
    },
    mounted () {
      let img1 = document.getElementById('cropimg1')
      this.cropper1 = new Cropper(img1, {
        /* 'crop': create a new crop box
        'move': move the canvas
        'none': do nothing */
        viewMode: '1',
        dragMode: 'crop',
        aspectRatio: 1, // 剪切比例
        preview: '#preview1', // 截图的显示位置
        restore: false, // 是否调整窗口大小后恢复裁剪区域。
        center: true, // 是否显示裁剪框 中间的+
        highlight: false, // 是否在剪裁框上显示白色的模态窗口。
        /* cropBoxMovable: false, */// 是否允许拖动裁剪框
        /* toggleDragModeOnDblclick: false, */
        cropBoxMovable: true, // 是否允许拖动裁剪框
        cropBoxResizable: true, // 是否允许拖动 改变裁剪框大小
        movable: false// 是否允许移动图片
      })

      img1.addEventListener('crop', (e) => {
        this.cropdata1.x = parseInt(e.detail.x)
        this.cropdata1.y = parseInt(e.detail.y)
        this.cropdata1.w = parseInt(e.detail.width)
        this.cropdata1.h = parseInt(e.detail.height)
        this.cropdata1.deg = parseInt(e.detail.rotate)
        this.cropdata1.scaleX = parseInt(e.detail.scaleX)
        this.cropdata1.scaleY = parseInt(e.detail.scaleY)
      })

      this.$nextTick(function () {
        this.getFileList()
      })
    }
  }
</script>
<style lang="less">
  @import '../../assets/styles/common.less';
  @import '../my-components/image-editor/image-editor.less';

  .ivu-table .min-width {
    width: 200px;
    background-color: #fff123;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
