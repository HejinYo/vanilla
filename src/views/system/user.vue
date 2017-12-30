<template>
  <div>
    <div class="ibox float-e-margins">
      <br/>
      <!--操作工具条-->
      <Row class="ibox-title">
        <i-Col :xs="24" :sm="12" :md="14" :lg="16">
          <Button type="primary" @click="openSave"><i class="fa fa-plus fa-fw"></i>添加</Button>
          <Button type="primary" @click="openEdit" :disabled="showEdit"><i class="fa fa-edit fa-fw"></i>修改</Button>
          <Button type="error" @click="openDelete" :disabled="showDelete"><i class="fa fa-trash-o fa-fw"></i>删除</Button>
        </i-Col>

        <i-Col :xs="24" :sm="12" :md="10" :lg="8">
          <i-Input v-model="pagePara.queryStr" @on-enter="searchUser" placeholder="查询..." :maxlength="32">
            <Select v-model="pagePara.queryCol" @on-change="searchUser" slot="prepend" style="width: 80px">
              <Option value="userName">用户名</Option>
              <Option value="phone">电话</Option>
              <Option value="email">邮箱</Option>
            </Select>
            <Button type="primary" slot="append" @click="searchUser"><i class="fa fa-search"></i></Button>
            <Button type="error" slot="append" @click="searchRset">重置</Button>
          </i-Input>
        </i-Col>

      </Row>
      <br/>
      <!-- 表格 -->
      <div class="ibox-content">
        <div class="row">
          <div class="col-lg-12">
            <Table border stripe highlight-row ref="selection" :columns="user_columns" :data="userList"></Table>
          </div>
          <div class="col-lg-12">
            <br/>
            <!--翻页工具条-->
            <Page show-elevator show-total show-sizer size="small" placement="top"
                  :total="pagePara.total"
                  :page-size-opts="[10, 20, 50, 100]"
                  @on-change="currentChange"
                  @on-page-size-change="sizeChange">
            </Page>
          </div>
        </div>
      </div>

    </div>

    <Modal :transfer="true" :mask-closable="false" v-model="addFormVisible" class-name="vertical-center-modal" title="添加用户">
      <Form ref="addUserForm" :model="addUserForm" :rules="addUserRules" :label-width="80">
        <FormItem label="角色" prop="roleId" :required="true">
          <Select v-model="addUserForm.roleId">
            <Option v-for="item in roleSelect" :value="item.roleId" :key="item.roleId">
              <span>{{ item.roleName }}</span>
              <span style="float:right;color:#ccc">{{ item.roleCode }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem label="用户名" prop="userName">
          <Input v-model="addUserForm.userName" placeholder="请输入用户名"/>
        </FormItem>
        <FormItem label="密码" prop="userPwd">
          <Input type='password' v-model="addUserForm.userPwd" placeholder="请输入密码"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="addUserForm.email" placeholder="请输入邮箱"/>
        </FormItem>
        <FormItem label="电话" prop="phone" :required="true">
          <Input v-model="addUserForm.phone" placeholder="请输入电话" :maxlength="11"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addFormVisible = false">取 消</Button>
        <Button @click="resetForm('addUserForm')">重 置</Button>
        <Button type="primary" @click="doSave">确 定</Button>
      </div>
    </Modal>

    <Modal :transfer="false" :mask-closable="false" v-model="editFormVisible" title="编辑用户">
      <Form ref="editUserForm" :model="editUserForm" :rules="addUserRules" :label-width="80">
        <FormItem label="用户名" prop="userName">
          <Input v-model="editUserForm.userName" placeholder="请输入用户名"/>
        </FormItem>
        <FormItem label="角色" prop="roleId" :required="true">
          <Select v-model="editUserForm.roleId" placeholder="请选择">
            <Option v-for="item in roleSelect" :value="item.roleId" :key="item.roleId">
              <span>{{ item.roleName }}</span>
              <span style="float:right;color:#ccc">{{ item.roleCode }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="editUserForm.email" placeholder="请输入邮箱"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="editUserForm.phone" placeholder="请输入电话"/>
        </FormItem>
        <FormItem label="状态">
          <i-switch v-model="editUserForm.state" size="large" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="登录时间">
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="editUserForm.loginTime"></DatePicker>
          </FormItem>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editFormVisible = false">取 消</Button>
        <Button type="primary" @click="doUpdate">确 定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: 'sysUser',
    data () {
      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'))
        } else {
          let reg = /^$|^((17[0-9])|(14[0-9])|(13[0-9])|(15[^4,\D])|(18[0,5-9]))\d{8}$/
          if (!reg.test(value)) {
            callback('手机号码格式不正确')
          }
          callback()
        }
      }
      const validateRole = (rule, value, callback) => {
        if (undefined === value || value === '') {
          callback(new Error('请选择角色'))
        } else {
          callback()
        }
      }
      return {
        user_columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'userName',
            width: 200,
            align: 'center'
          },
          {
            title: '电话',
            key: 'phone',
            width: 150,
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'email',
            width: 180,
            align: 'center'
          },
          {
            title: '角色',
            key: 'roleName',
            render: (h, params) => {
              return h('div', [
                h('Tag', {
                  props: {
                    color: params.row.roleId === 1 ? 'red' : '#EF6AFF',
                    size: 'small',
                  }
                }, params.row.roleName !== null ? params.row.roleName : '无')
              ])
            },
            width: 100,
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            align: 'center',
            width: 90,
            render: (h, params) => {
              return h('div', [
                h('Tag', {
                  props: {
                    color: params.row.state === 1 ? 'green' : 'yellow',
                    size: 'small',
                  }
                }, params.row.state === 1 ? '正常' : '禁用')
              ])
            }
          },
          {
            title: '登录IP',
            key: 'loginIp',
            width: 180,
            align: 'center'
          },
          {
            title: '登录时间',
            key: 'loginTime',
            width: 180,
            align: 'center'
          },
          {
            title: '创建日期',
            key: 'createTime',
            width: 180,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, 'Delete')
              ])
            }
          }
        ],
        roleSelect: [],
        listLoading: false,
        userList: [],//表格数据
        pagePara: {//分页查询参数
          total: 0,
          page: 1,
          pageSize: 10,
          sidx: 'userId',
          sort: 'asc',
          queryCol: 'userName',
          queryStr: ''
        },
        secol: null,//当前选择行
        selist: [],//列表选中行
        addFormVisible: false,//新增界面是否显示
        addUserForm: {
          userName: 'user100',
          userPwd: '123456',
          email: 'user@qq.com',
          phone: '17600222250'
        },
        editFormVisible: false,
        editUserForm: {},
        addUserRules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 5, message: '至少 5 个字符', trigger: 'blur'}
          ],
          userPwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '至少 6 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ],
          roleId: [
            {validator: validateRole, trigger: 'change'}
          ],
          phone: [
            {validator: validatePhone, trigger: 'change'}
          ]
        }
      }
    }
    ,
    computed: {
      showDelete () {
        return this.secol === null && this.selist.length === 0
      }
      ,
      showEdit () {
        return this.secol === null
      }
    }
    ,
    mounted: function () {
      this.$nextTick(function () {
        this.getUserList()
        this.getRoleSelect()
      })
    }
    ,
    methods: {
      //加载用户列表
      getUserList () {
        this.listLoading = true
        this.$http.get('/api/user/listPage' +
          '?pageNum=' + this.pagePara.page +
          '&pageSize=' + this.pagePara.pageSize +
          '&sidx=' + this.pagePara.sidx +
          '&sort=' + this.pagePara.sort +
          '&' + this.pagePara.queryCol + '=' + this.pagePara.queryStr
        )
          .then(response => {
            if (response.data.code === 1) {
              this.userList = response.data.result.list
              this.pagePara.total = response.data.result.total
            }
            setTimeout(() => {
              this.listLoading = false
            }, 100)
          })
          .catch(error => {
            this.listLoading = false
          })
      }
      ,
      //获取角色数据
      getRoleSelect () {
        this.listLoading = true
        this.$http.get('/api/role/select')
          .then(response => {
            if (response.data.code === 1) {
              this.roleSelect = response.data.result
            }
          })
      }
      ,
      //点击页码事件，翻页操作
      currentChange (val) {
        this.pagePara.page = val
        this.getUserList()
      }
      ,
      //改变分页数量
      sizeChange (val) {
        this.pagePara.pageSize = val
        this.getUserList()
      }
      ,
      //显示新增界面
      openSave: function () {
        this.resetForm('addUserForm')
        this.addFormVisible = true
      }
      ,
      //执行增加操作
      doSave () {
        let _this = this
        this.$refs['addUserForm'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/user/', this.addUserForm)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('添加成功！')
                  this.resetForm('addUserForm')
                  this.addFormVisible = false
                  _this.getUserList()
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          } else {
            this.$Message.info('表单验证失败')
          }
        })
      }
      ,
      //打开编辑用户面板
      openEdit () {
        if (null !== this.secol) {
          this.resetForm('editUserForm')
          this.editFormVisible = true
          this.editUserForm = JSON.parse(JSON.stringify(this.secol))
        }
      }
      ,
      //表格内打开编辑用户
      openColEdit (row) {
        this.secol = row
        this.openEdit()
      }
      ,
      //执行更新操作
      doUpdate () {
        let _this = this
        this.$refs['editUserForm'].validate((valid) => {
          if (valid) {
            this.$Modal.confirm({
              title: '提示',
              content: '<p>此操作将修改该用户, 是否继续?</p>',
              onOk: () => {
                this.$http.put('/api/user/' + this.editUserForm.userId, this.editUserForm)
                  .then(response => {
                    if (response.data.code === 1) {
                      this.$Message.success('修改成功！')
                      this.resetForm('editUserForm')
                      this.editFormVisible = false
                      _this.getUserList()
                    } else {
                      this.$Message.warning(response.data.message)
                    }
                  })
              },
              onCancel: () => {
                this.$Message.info('点击了取消')
              }
            })
          } else {
            this.$Message.info('表单验证失败')
          }
        })
      }
      ,
      //执行表格内删除用户
      doColDelete (row) {
        this.secol = row
        this.doDelete()
      }
      ,
      //删除
      openDelete () {
        let _this = this
        if (this.selist.length > 0) {
          _this.delBatch()
        } else {
          _this.doDelete()
        }
      }
      ,
      //执行单个删除操作
      doDelete () {
        let _this = this
        if (null !== this.secol) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>此操作将删除用户 ' + this.secol.userName + ', 是否继续?</p>',
            onOk: () => {
              this.$http.delete('/api/user/' + this.secol.userId)
                .then(response => {
                  if (response.data.code === 1) {
                    this.$Message.success('删除成功！')
                    _this.getUserList()
                  } else {
                    this.$Message.warning(response.data.message)
                  }
                })
            },
            onCancel: () => {
              this.$Message.info('已取消删除')
            }
          })
        }
      }
      ,
      delBatch () {
        let _this = this
        if (this.selist.length > 0) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>此操作将删除多个用户, 是否继续?</p>',
            onOk: () => {
              let userIdList = []
              this.selist.forEach(function (value, index, array) {
                userIdList.push(value.userId)
              })
              this.$http.delete('/api/user/batch/' + userIdList)
                .then(response => {
                  if (response.data.code === 1) {
                    this.$Message.success('删除成功！')
                    _this.getUserList()
                  } else {
                    this.$Message.warning(response.data.message)
                  }
                })
            },
            onCancel: () => {
              this.$Message.info('已取消删除')
            }
          })
        }
      }
      ,
      //点击表格行事件
      currentRow (val) {
        this.secol = val
      }
      ,
      //多选事件
      selectionRow (val) {
        this.selist = val
      }
      ,
      //排序
      sortChange (val) {
        this.pagePara.sidx = val.prop
        this.pagePara.sort = val.order
        this.getUserList()
      }
      ,
      //查询
      searchUser () {
        if (this.pagePara.queryStr !== '') {
          this.getUserList()
        }
      }
      ,
      //查询重置
      searchRset () {
        this.pagePara.queryStr = ''
        this.getUserList()
      }
      ,
      //重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="less">
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }
</style>
