<template>
  <div class="ibox">
    <Row>
      <i-Col :md="24">
        <Card>
          <p slot="title">
            <Icon type="ios-paw"></Icon>
            角色管理
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
              <i-Input v-model="pageQuery.queryValue" @on-enter="searchRole" placeholder="查询..." :maxlength="32" clearable>
                <Select v-model="pageQuery.queryKey" @on-change="searchRole" slot="prepend" style="width: 80px">
                  <Option value="roleName">角色名称</Option>
                  <Option value="roleCode">角色编码</Option>
                  <Option value="roleDescription">描述</Option>
                </Select>
                <Button type="primary" slot="append" @click="searchRole">
                  <Icon type="ios-search-strong"></Icon>
                </Button>
                <Button type="error" slot="append" @click="searchRset">重置</Button>
              </i-Input>
            </i-Col>
          </Row>
          <br/>
          <el-table :data="roleList" stripe border highlight-current-row element-loading-text="拼命加载中" v-loading="listLoading" size="mini"
                    @row-click="clickRow" @selection-change="selectionRow" @row-dblclick="openEdit" @sort-change="sortChange">
            <!--    <el-table-column type="expand" label="展开">
                  <template slot-scope="props">
                    <Form :label-width="60">
                      <FormItem label="角色编码">
                        <span>{{ props.row.roleCode }}</span>
                      </FormItem>
                      <FormItem label="描述">
                        <span>{{ props.row.roleDescription }}</span>
                      </FormItem>
                      <FormItem label="创建时间">
                        <span>{{ props.row.createTime }}</span>
                      </FormItem>
                    </Form>
                  </template>

                </el-table-column>-->
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column prop="roleId" label="ID" sortable="custom" width="60"></el-table-column>
            <el-table-column label="角色名称" prop="roleName" align="center" show-overflow-tooltip min-width="90">
              <template slot-scope="scope">
                {{scope.row.roleName}}({{scope.row.roleCode}})
              </template>
            </el-table-column>
            <el-table-column prop="roleCode" label="角色编码" sortable="custom" align="center" width="180"></el-table-column>
            <el-table-column prop="roleDescription" label="描述" sortable="custom" align="center" min-width="180"></el-table-column>
            <el-table-column prop="state" label="状态" sortable="custom" align="center" min-width="90">
              <template slot-scope="scope">
                <Tag :color="scope.row.state == 0 ? 'green': 'red' ">
                  {{scope.row.state == 0 ? '正常' : '禁用'}}
                </Tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" sortable="custom" align="center" width="180"></el-table-column>
            <el-table-column label="授权" align="center" width="70">
              <template slot-scope="scope">
                <Button size="small" @click="addRoleResource(scope.row)">
                  <Icon type="android-unlock"></Icon>
                </Button>
              </template>
            </el-table-column>
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

    <Modal :mask-closable="false" v-model="addRoleVisible" :title="showOperation">
      <transition name="fade">
        <Form ref="sysRole" :model="sysRole" :rules="addRoleRules" :label-width="80" v-if="addRoleVisible">
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="sysRole.roleName" placeholder="请输入"/>
          </FormItem>
          <FormItem label="角色编码" prop="roleCode">
            <Input v-model="sysRole.roleCode" placeholder="请输入"/>
          </FormItem>
          <FormItem label="描述" prop="roleDescription">
            <Input v-model="sysRole.roleDescription" placeholder="请输入"/>
          </FormItem>
          <FormItem label="状态" prop="state">
            <i-switch v-model="sysRole.state" size="large" :true-value="0" :false-value="1">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </Form>
      </transition>
      <div slot="footer">
        <Button @click="operation(false)">取 消</Button>
        <Button @click="resetForm('sysRole')">重 置</Button>
        <Button type="primary" @click="operation(true)">确 定</Button>
      </div>
    </Modal>

    <Modal :mask-closable="false" v-model="permissionVisible" title="权限分配">
      <Card :padding="10">
        <div slot="title">
          系统权限
        </div>
        <a href="#" slot="extra" type="primary" @click.prevent="resetChecked">
          <Icon type="ios-plus"></Icon>
          重置
        </a>
        <el-tree :data="resourceTreeData" :props="treeProps" :default-expanded-keys="[0]" style="border: none;" show-checkbox
                 :default-checked-keys="rolePermisson" ref="tree"
                 node-key="resCode" highlight-current :expand-on-click-node="true" accordion></el-tree>
      </Card>
      <div slot="footer">
        <Button @click="permissionVisible = false">取 消</Button>
        <Button @click="authorization" type="primary">确 定</Button>
      </div>
    </Modal>


  </div>

</template>
<script>
  import { reqRoleListPage, reqRoleSave, reqRoleInfo, reqRoleUpdate, reqRoleDelete, reqRolePerm, reqPermissionTree, reqAuthorization } from '@/api/api'

  export default {
    name: 'role',
    data () {
      return {
        listLoading: false,
        // 表格数据
        roleList: [],
        // 当前选择行
        currCol: null,
        // 列表选中行
        currList: [],
        // 分页查询参数
        pageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          sidx: null,
          sort: null
        },
        // 查询参数
        pageQuery: {
          queryKey: 'roleName',
          queryValue: null
        },
        // 高级查询
        advancedSearch: false,
        // 高级查询参数
        queryParam: {},
        sysRole: {
          roleName: null,
          roleCode: null,
          roleDescription: null,
          state: 0
        },
        // 新增界面是否显示
        addRoleVisible: false,
        addRoleForm: {
          roleName: '',
          roleCode: '',
          roleDescription: '',
          state: 1
        },
        addRoleRules: {
          roleName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          roleCode: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        // 显示授权
        permissionVisible: false,
        // 资源树
        resourceTreeData: [],
        // 角色权限
        rolePermisson: [],
        treeProps: {
          children: 'children',
          label: 'resName'
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
        return this.operationType === 0 ? '添加角色' : '编辑角色'
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getRoleList()
      })
    },
    methods: {
      // 加载角色列表
      getRoleList () {
        this.listLoading = true
        // 默认排序
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'roleId'
        }
        reqRoleListPage(this.advancedSearch ? 'post' : 'get', this.queryParam, this.advancedSearch ? this.pageParam : {...this.pageParam, ...this.pageQuery}).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.currCol = null
            this.roleList = result.list
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
      // 获取角色拥有权限
      reqRolePermission (roleId) {
        reqRolePerm(roleId).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.rolePermisson = result
            this.getPermissionTree()
          }
        })
      },
      // 加载权限树
      getPermissionTree () {
        reqPermissionTree().then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.resourceTreeData = result
          }
        })
      },
      // 点击页码事件，翻页操作
      currentChange (val) {
        this.pageParam.pageNum = val
        this.getRoleList()
      },
      // 多选事件
      selectionRow (val) {
        this.currList = val
      },
      // 改变分页数量
      sizeChange (val) {
        this.pageParam.pageSize = val
        this.getRoleList()
      },
      // 排序
      sortChange (val) {
        this.pageParam.sidx = val.prop
        this.pageParam.sort = val.order
        this.getRoleList()
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
            this.resetForm('sysRole')
          }
          this.addRoleVisible = false
        }
      },
      // 重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 显示新增界面
      openSave: function () {
        this.operationType = 0
        this.sysRole = JSON.parse(JSON.stringify(this.addRoleForm))
        this.addRoleVisible = true
      },
      // 执行增加操作
      doSave () {
        this.$refs['sysRole'].validate((valid) => {
          if (valid) {
            reqRoleSave(this.sysRole).then(data => {
              let {code, msg, result} = data
              if (code === 0) {
                this.$Message.success('添加成功！')
                this.resetForm('sysRole')
                this.addRoleVisible = false
                this.getRoleList()
              } else {
                this.$Message.warning(msg)
              }
            })
          }
        })
      },
      openEdit (row) {
        this.operationType = 1
        if (this.currCol !== null) {
          reqRoleInfo(this.currCol.roleId).then(data => {
            let {code, msg, result} = data
            if (code === 0) {
              this.sysRole = result
              this.addRoleVisible = true
            } else {
              this.$Message.warning(msg)
            }
          })
        }
      },
      // 执行更新操作
      doUpdate () {
        this.$refs['sysRole'].validate((valid) => {
          if (valid) {
            reqRoleUpdate(this.sysRole.roleId, this.sysRole).then(data => {
              let {code, msg, result} = data
              if (code === 0) {
                this.$Message.success('修改成功！')
                this.resetForm('sysRole')
                this.addRoleVisible = false
                this.getRoleList()
              } else {
                this.$Message.warning(msg)
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
            content: '<p>此操作将删除' + (this.currList.length > 1 ? '多个角色' : '角色 ' + this.currCol.roleName) + ', 是否继续?</p>',
            onOk: () => {
              let roleIdList = []
              this.currList.forEach(function (value, index, array) {
                roleIdList.push(value.roleId)
              })
              reqRoleDelete(roleIdList).then(data => {
                let {code, msg, result} = data
                if (code === 0) {
                  this.$Message.success('删除成功！')
                  this.getRoleList()
                } else {
                  this.$Message.warning(msg)
                }
              })
            }
          })
        }
      },
      addRoleResource (val) {
        this.reqRolePermission(val.roleId)
        this.permissionVisible = true
      },
      authorization () {
        let checkData = JSON.parse(JSON.stringify(this.$refs.tree.getCheckedNodes(true)))
        reqAuthorization(this.currCol.roleId, checkData).then(data => {
          let {code, msg, result} = data
          if (code === 0) {
            this.$Message.success('授权成功！')
            this.permissionVisible = false
          } else {
            this.$Message.warning(msg)
          }
        })
      },
      resetChecked () {
        this.$refs.tree.setCheckedKeys([])
      },
      // 查询
      searchRole () {
        if (this.pageQuery.queryValue) {
          this.getRoleList()
        }
      },
      // 查询重置
      searchRset () {
        this.pageQuery.queryValue = null
        this.getRoleList()
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
