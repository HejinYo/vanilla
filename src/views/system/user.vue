<template>
  <div>
    <div>
      <Card>
        <p slot="title">
          <Icon type="person-stalker"></Icon>
          用户管理
        </p>

        <Row v-if="advancedSearch">
          <!-- 高级查询 -->
          <Card :dis-hover="true">
            <Form ref="queryParam" :model="queryParam" :label-width="80" class="search">
              <Row :gutter="8">
                <i-Col :xs="24" :sm="8" :md="6" :lg="4">
                  <FormItem label="用户名" prop="userName">
                    <Input v-model="queryParam.userName" placeholder="用户名"></Input>
                  </FormItem>
                </i-Col>
                <i-Col :xs="24" :sm="8" :md="6" :lg="4">
                  <FormItem label="邮箱" prop="email">
                    <Input v-model="queryParam.email" placeholder="邮箱"></Input>
                  </FormItem>
                </i-Col>
                <i-Col :xs="24" :sm="8" :md="6" :lg="4">
                  <FormItem label="手机" prop="phone">
                    <Input v-model="queryParam.phone" placeholder="手机" :maxlength="11"></Input>
                  </FormItem>
                </i-Col>
                <i-Col :xs="24" :sm="8" :md="6" :lg="4">
                  <FormItem label="状态" prop="state">
                    <Select v-model="queryParam.state" placeholder="状态">
                      <Option value="0">启用</Option>
                      <Option value="1">禁用</Option>
                    </Select>
                  </FormItem>
                </i-Col>
                <i-Col :xs="24" :sm="8" :md="6" :lg="4">
                  <FormItem label="创建时间" prop="createTime">
                    <Input v-model="queryParam.createTime" v-show="false"></Input>
                    <DatePicker type="date" placeholder="创建时间" @on-change="dateHandleChange"></DatePicker>
                  </FormItem>
                </i-Col>
              </Row>
            </Form>
          </Card>
          <br/>
        </Row>
        <!--操作工具条-->
        <Row>
          <i-Col :xs="24" :sm="12" :md="14" :lg="16">
            <Button type="primary" icon="android-add" @click="openSave">添加</Button>
            <Button type="primary" icon="edit" :disabled="showEdit" @click="openEdit">修改</Button>
            <Button type="error" icon="android-delete" :disabled="showDelete" @click="doDelete">删除</Button>
          </i-Col>

          <i-Col :xs="24" :sm="12" :md="10" :lg="8">
            <i-Input v-model="pageQuery.queryValue" :disabled="advancedSearch" @on-enter="searchUser" placeholder="查询..." :maxlength="32" clearable>
              <Select v-model="pageQuery.queryKey" :disabled="advancedSearch" @on-change="searchUser" slot="prepend" style="width: 80px">
                <Option value="userName">用户名</Option>
                <Option value="phone">电话</Option>
                <Option value="email">邮箱</Option>
              </Select>
              <Button type="primary" slot="append" @click="searchUser">
                <Icon type="ios-search-strong"></Icon>
              </Button>
              <Button type="error" slot="append" @click="searchRset">重置</Button>
              <Tooltip slot="append" trigger="hover" content="高级查询" placement="top" :disabled="advancedSearch">
                <Button type="primary" @click="advancedSearch = !advancedSearch">
                  <Icon :type=" advancedSearch ? 'chevron-up' : 'chevron-down' "></Icon>
                </Button>
              </Tooltip>
            </i-Input>
          </i-Col>
        </Row>
        <br/>
        <div>
          <!-- 表格 -->
          <el-table :data="userList" stripe border highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" size="mini"
                    @row-click="clickRow" @row-dblclick="openEdit" @selection-change="selectionRow" @sort-change="sortChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column prop="userId" label="ID" sortable="custom" width="60"></el-table-column>
            <el-table-column prop="userName" label="姓名" sortable="custom" align="center" width="200"></el-table-column>
            <el-table-column prop="phone" label="电话" sortable="custom" align="center" width="150"></el-table-column>
            <el-table-column prop="email" label="邮箱" sortable="custom" align="center" min-width="180"></el-table-column>
            <el-table-column prop="roleName" label="角色" sortable="custom" align="center" min-width="100">
              <template slot-scope="scope">
                <Tag :color="scope.row.roleName != null ? 'green': 'red' "> {{scope.row.roleName != null ? scope.row.roleName : '无'}} </Tag>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" sortable="custom" align="center" width="90">
              <template slot-scope="scope">
                <Tag :color="scope.row.state == 0 ? 'green': 'red' "> {{scope.row.state == 0 ? '正常' : '禁用'}} </Tag>
              </template>
            </el-table-column>
            <el-table-column prop="loginIp" label="登录IP" sortable="custom" align="center" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column prop="loginTime" label="登录时间" sortable="custom" align="center" width="180"></el-table-column>
            <el-table-column prop="createTime" label="创建日期" sortable="custom" align="center" width="180"></el-table-column>
          </el-table>
          <br/>
          <!--翻页工具条-->
          <Page show-elevator show-total show-sizer size="small" placement="top"
                :total="pageParam.total" :current="pageParam.pageNum"
                :page-size-opts="[10, 20, 50, 100]"
                @on-change="currentChange"
                @on-page-size-change="sizeChange">
          </Page>
        </div>
      </Card>
    </div>

    <Modal :mask-closable="false" v-model="addUserVisible" :title="showOperation">
      <transition name="fade">
        <Form ref="sysUser" :model="sysUser" :rules="addUserRules" :label-width="80" v-if="addUserVisible">
          <FormItem label="角色" prop="roleId" :required="true">
            <Select v-model="sysUser.roleId" title="">
              <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">
                <span>{{ item.roleName }}</span>
                <span style="float:right;color:#ccc">{{ item.roleCode }}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem label="用户名" prop="userName">
            <Input v-model="sysUser.userName" placeholder="请输入用户名"/>
          </FormItem>
          <FormItem label="密码" prop="userPwd" v-if="operationType===0">
            <Input type='password' v-model="sysUser.userPwd" placeholder="请输入密码"/>
          </FormItem>
          <FormItem label="密码" v-if="operationType===1">
            <Input type='password' v-model="sysUser.userPwd" placeholder="修改密码"/>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="sysUser.email" placeholder="请输入邮箱"/>
          </FormItem>
          <FormItem label="电话" prop="phone" :required="true">
            <Input v-model="sysUser.phone" placeholder="请输入电话" :maxlength="11"/>
          </FormItem>
          <FormItem label="状态">
            <i-switch v-model="sysUser.state" size="large" :true-value="0" :false-value="1">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </Form>
      </transition>
      <div slot="footer">
        <Button @click="operation(false)">取 消</Button>
        <Button @click="resetForm('sysUser')">重 置</Button>
        <Button type="primary" @click="operation(true)">确 定</Button>
      </div>

    </Modal>

  </div>
</template>

<script>
  import { validatePhone } from '@/libs/validate'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'sysUser',
    data () {
      return {
        listLoading: false,
        userList: [],//表格数据
        //分页查询参数
        pageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          sidx: null,
          sort: null
        },
        //查询参数
        pageQuery: {
          queryKey: 'userName',
          queryValue: null
        },
        //高级查询
        advancedSearch: false,
        //高级查询参数
        queryParam: {
          userName: null,
          email: null,
          phone: null,
          state: null,
          createTime: null
        },
        //当前选择行
        currCol: null,
        //列表选中行
        currList: [],
        sysUser: {
          userName: null,
          userPwd: null,
          email: null,
          phone: null,
          roleId: null,
          state: 0
        },
        //新增界面是否显示
        addUserVisible: false,
        addUserForm: {
          userName: 'user100',
          userPwd: '123456',
          email: 'user@qq.com',
          phone: '17600222250',
          roleId: 1,
          state: 0
        },
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
            {required: true, message: '请选择角色'},
          ],
          phone: [
            {validator: validatePhone, trigger: 'change'}
          ]
        },
        // 操作类型 0:增加 1：修改
        operationType: 0,
        roleList: [],
      }
    }
    ,
    computed: {
      showDelete () {
        return this.currList.length === 0
      },
      showEdit () {
        return this.currCol === null
      },
      showOperation () {
        return this.operationType === 0 ? '添加用户' : '编辑用户'
      }
    }
    ,
    mounted: function () {
      this.$nextTick(function () {
        this.getUserList()
        this.getRoleList(true).then(value => { this.roleList = value })
      })
    },
    methods: {
      ...mapActions([
        'getRoleList'
      ]),
      //加载用户列表
      getUserList () {
        this.listLoading = true
        //默认排序
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'userId'
        }
        this.$http({
          url: '/api/user/listPage',
          method: this.advancedSearch ? 'post' : 'get',
          data: this.queryParam,
          params: this.advancedSearch ? this.pageParam : {...this.pageParam, ...this.pageQuery}
        }).then(response => {
          let {code, msg, result} = response.data
          if (code === 0) {
            this.currCol = null
            this.userList = result.list
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
      //点击页码事件，翻页操作
      currentChange (val) {
        this.pageParam.pageNum = val
        this.getUserList()
      },
      //改变分页数量
      sizeChange (val) {
        this.pageParam.pageSize = val
        this.getUserList()
      },
      //显示新增界面
      openSave: function () {
        this.operationType = 0
        this.sysUser = JSON.parse(JSON.stringify(this.addUserForm))
        this.addUserVisible = true
        //this.resetForm('addUserForm')
      },
      //执行增加操作
      doSave () {
        this.$refs['sysUser'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/user/', this.sysUser)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('添加成功！')
                  this.resetForm('sysUser')
                  this.addUserVisible = false
                  this.getUserList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //打开编辑用户面板
      openEdit (row) {
        this.operationType = 1
        if (this.currCol !== null) {
          this.$http.get('/api/user/' + this.currCol.userId)
            .then(response => {
              let {code, msg, result} = response.data
              if (code === 0) {
                this.sysUser = result
                this.addUserVisible = true
              } else {
                this.$Message.warning(msg)
              }
            })
        }
      },
      //执行更新操作
      doUpdate () {
        this.$refs['sysUser'].validate((valid) => {
          if (valid) {
            this.$http.put('/api/user/' + this.sysUser.userId, this.sysUser)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('修改成功！')
                  this.resetForm('sysUser')
                  this.addUserVisible = false
                  this.getUserList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //执行 删除操作
      doDelete () {
        if (this.currList.length > 0) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>此操作将删除' + (this.currList.length > 1 ? '多个用户' : '用户 ' + this.currCol.userName) + ', 是否继续?</p>',
            onOk: () => {
              let userIdList = []
              this.currList.forEach(function (value, index, array) {
                userIdList.push(value.userId)
              })
              this.$http.delete('/api/user/' + userIdList)
                .then(response => {
                  if (response.data.code === 0) {
                    this.$Message.success('删除成功！')
                    this.getUserList()
                  } else {
                    this.$Message.warning(response.data.msg)
                  }
                })
            }
          })
        }
      },
      //操作
      operation (flag) {
        if (flag) {
          if (this.operationType === 0) {
            this.doSave()
          } else if (this.operationType === 1) {
            this.doUpdate()
          }
        } else {
          //取消操作
          if (this.operationType === 0) {
            this.resetForm('sysUser')
          }
          this.addUserVisible = false
        }
      },
      //多选事件
      selectionRow (val) {
        this.currList = val
      },
      //点击行事件
      clickRow (val) {
        this.currCol = val
      },
      //排序
      sortChange (val) {
        this.pageParam.sidx = val.prop
        this.pageParam.sort = val.order
        this.getUserList()
      },
      //查询
      searchUser () {
        if (this.advancedSearch || this.pageQuery.queryValue) {
          this.getUserList()
        }
      },
      //查询重置
      searchRset () {
        if (this.advancedSearch) {
          this.resetForm('queryParam')
        } else {
          this.pageQuery.queryValue = null
        }
        this.getUserList()
      },
      //重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //iview大坑，时间选择器默认使用utc，不能使用v-model绑定
      dateHandleChange (value) {
        this.queryParam.createTime = value
      }
    }
  }
</script>
<style lang="less">

</style>

