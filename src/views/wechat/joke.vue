<template>
  <div class="ibox">
    <Row>
      <i-Col :md="24">
        <Card>
          <p slot="title">
            <Icon type="aperture"></Icon>
            笑话管理
          </p>
          <div slot="extra">
          </div>
          <!--操作工具条-->
          <Row>
            <i-Col :xs="24" :sm="12" :md="14" :lg="16">
              <Button type="primary" icon="android-add" @click="openSave">添加</Button>
              <Button type="primary" icon="edit" :disabled="showEdit" @click="openEdit">修改</Button>
              <Button type="error" icon="android-delete" :disabled="showDelete" @click="doDelete">删除</Button>
            </i-Col>

            <i-Col :xs="24" :sm="12" :md="10" :lg="8">
              <i-Input v-model="pageQuery.queryValue" @on-enter="searchJoke" placeholder="查询..." :maxlength="32" clearable>
                <Select v-model="pageQuery.queryKey" @on-change="searchJoke" slot="prepend" style="width: 80px">
                  <Option value="title">标题</Option>
                  <Option value="content">内容</Option>
                </Select>
                <Button type="primary" slot="append" @click="searchJoke">
                  <Icon type="ios-search-strong"></Icon>
                </Button>
                <Button type="error" slot="append" @click="searchRset">重置</Button>
              </i-Input>
            </i-Col>
          </Row>
          <br/>
          <el-table :data="jokeList" stripe border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading" size="mini"
                    @row-click="clickRow" @selection-change="selectionRow" @row-dblclick="openEdit" @sort-change="sortChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable="custom" width="60"></el-table-column>
            <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip min-width="90"></el-table-column>
            <el-table-column prop="content" label="内容" sortable="custom" align="center" min-width="180"></el-table-column>
            <el-table-column prop="dateandtime" label="创建时间" sortable="custom" align="center" width="180"></el-table-column>
          </el-table>
          <br/>
          <!--翻页工具条-->
          <Page show-elevator show-total show-sizer size="small" placement="top" v-if="pageParam.total > 0"
                :total="pageParam.total" :current="pageParam.pageNum"
                :page-size-opts="[10, 20, 50, 100]"
                @on-change="currentChange"
                @on-page-size-change="sizeChange">
          </Page>
        </Card>
      </i-Col>
    </Row>

    <Modal :mask-closable="false" v-model="addJokeVisible" :title="showOperation">
      <transition name="fade">
        <Form ref="sysJoke" :model="sysJoke" :rules="addJokeRules" :label-width="80" v-if="addJokeVisible">
          <FormItem label="标题" prop="title">
            <Input v-model="sysJoke.title" placeholder="请输入"/>
          </FormItem>
          <FormItem label="内容" prop="content">
            <Input v-model="sysJoke.content" placeholder="请输入" type="textarea" :rows="8"/>
          </FormItem>
        </Form>
      </transition>
      <div slot="footer">
        <Button @click="operation(false)">取 消</Button>
        <Button @click="resetForm('sysJoke')">重 置</Button>
        <Button type="primary" @click="operation(true)">确 定</Button>
      </div>
    </Modal>
  </div>

</template>
<script>
  export default {
    name: 'joke',
    data () {
      return {
        listLoading: false,
        // 表格数据
        jokeList: [],
        // 当前选择行
        currCol: null,
        // 列表选中行
        currList: [],
        // 分页查询笑话
        pageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          sidx: null,
          sort: null
        },
        // 查询笑话
        pageQuery: {
          queryKey: 'title',
          queryValue: null
        },
        // 高级查询
        advancedSearch: false,
        // 高级查询笑话
        queryParam: {},
        sysJoke: {
          title: null,
          content: null
        },
        // 新增界面是否显示
        addJokeVisible: false,
        addJokeForm: {
          title: '',
          content: ''
        },
        addJokeRules: {
          key: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        operationType: 0
      }
    },
    computed: {
      showDelete () {
        return this.currList.length === 0
      },
      showEdit () {
        return this.currCol === null
      },
      showOperation () {
        return this.operationType === 0 ? '添加笑话' : '编辑笑话'
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getJokeList()
      })
    },
    methods: {
      // 加载笑话列表
      getJokeList () {
        this.listLoading = true
        // 默认排序
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'id'
        }
        this.$http({
          url: '/api/joke/listPage',
          method: this.advancedSearch ? 'post' : 'get',
          data: this.queryParam,
          params: this.advancedSearch ? this.pageParam : {...this.pageParam, ...this.pageQuery}
        }).then(response => {
          let {code, msg, result} = response.data
          if (code === 0) {
            this.currCol = null
            this.jokeList = result.list
            this.pageParam.total = result.total
            this.pageParam.pageNum = result.pageNum
          } else {
            this.$Message.warning(msg)
          }
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      },
      // 点击页码事件，翻页操作
      currentChange (val) {
        this.pageParam.pageNum = val
        this.getJokeList()
      },
      // 多选事件
      selectionRow (val) {
        this.currList = val
      },
      // 改变分页数量
      sizeChange (val) {
        this.pageParam.pageSize = val
        this.getJokeList()
      },
      // 排序
      sortChange (val) {
        this.pageParam.sidx = val.prop
        this.pageParam.sort = val.order
        this.getJokeList()
      },
      // 点击表格行事件
      clickRow (val) {
        this.currCol = val
      },
      // 操作
      operation (flag) {
        if (flag) {
          if (this.operationType === 0) {
            this.doSave()
          } else if (this.operationType === 1) {
            this.doUpdate()
          }
        } else {
          // 取消操作
          if (this.operationType === 0) {
            this.resetForm('sysJoke')
          }
          this.addJokeVisible = false
        }
      },
      // 重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 显示新增界面
      openSave: function () {
        this.operationType = 0
        this.sysJoke = JSON.parse(JSON.stringify(this.addJokeForm))
        this.addJokeVisible = true
      },
      // 执行增加操作
      doSave () {
        this.$refs['sysJoke'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/joke/', this.sysJoke)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('添加成功！')
                  this.resetForm('sysJoke')
                  this.addJokeVisible = false
                  this.getJokeList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      openEdit (row) {
        this.operationType = 1
        if (this.currCol !== null) {
          this.$http.get('/api/joke/' + this.currCol.id)
            .then(response => {
              let {code, msg, result} = response.data
              if (code === 0) {
                this.sysJoke = result
                this.addJokeVisible = true
              } else {
                this.$Message.warning(msg)
              }
            })
        }
      },
      // 执行更新操作
      doUpdate () {
        this.$refs['sysJoke'].validate((valid) => {
          if (valid) {
            this.$http.put('/api/joke/' + this.sysJoke.id, this.sysJoke)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('修改成功！')
                  this.resetForm('sysJoke')
                  this.addJokeVisible = false
                  this.getJokeList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      // 执行 删除操作
      doDelete () {
        if (this.currList.length > 0) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>此操作将删除' + (this.currList.length > 1 ? '多个笑话' : '笑话 ' + this.currCol.title) + ', 是否继续?</p>',
            onOk: () => {
              let idList = []
              this.currList.forEach(function (value, index, array) {
                idList.push(value.id)
              })
              this.$http.delete('/api/joke/' + idList)
                .then(response => {
                  if (response.data.code === 0) {
                    this.$Message.success('删除成功！')
                    this.getJokeList()
                  } else {
                    this.$Message.warning(response.data.msg)
                  }
                })
            }
          })
        }
      },
      // 查询
      searchJoke () {
        if (this.pageQuery.queryValue) {
          this.getJokeList()
        }
      },
      // 查询重置
      searchRset () {
        this.pageQuery.queryValue = null
        this.getJokeList()
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
