<template>
  <div class="ibox">
    <Row>
      <i-Col :xs="24" :sm="10" :md="10" :lg="6">
        <Card :padding="10">
          <p slot="title">
            <Icon type="briefcase"></Icon>
            资源管理
          </p>
          <edit-tree :data="resTreeData" :expandedKeys="resTreeExpandedKeys"
                     label="resName" value="resId" nodeKey="resId" icon="resIcon"
                     @treeClick="treeDataChange" @treeAdd="resTreeAdd" @treeDel="doDelRes"></edit-tree>
        </Card>
      </i-Col>

      <i-Col :xs="24" :sm="14" :md="14" :lg="18">
        <div>
          <Card>
            <Tabs v-model="currTabs" @on-click="tabsChange">
              <TabPane label="资源管理" name="resource" icon="folder">
                <!--操作工具条-->
                <Row>
                  <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                    <Button type="primary" icon="edit" :disabled="resShowEdit" @click="resOpenEdit">修改</Button>
                  </i-Col>
                  <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                    <i-Input v-model="resPageQuery.queryValue" @on-enter="search" placeholder="查询..." :maxlength="32" clearable>
                      <Select v-model="resPageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                        <Option value="resName">资源名称</Option>
                        <Option value="resCode">资源编码</Option>
                      </Select>
                      <Button type="primary" slot="append" @click="search">
                        <Icon type="ios-search-strong"></Icon>
                      </Button>
                      <Button type="error" slot="append" @click="searchRset">重置</Button>
                    </i-Input>
                  </i-Col>
                </Row>
                <br/>
                <el-table :data="resList" stripe border highlight-current-row v-loading="resLoading" size="mini" element-loading-text="拼命加载中"
                          @row-click="resClickRow" @row-dblclick="resOpenEdit" @sort-change="resSortChange">
                  <el-table-column prop="resId" label="ID" sortable="custom" width="60"></el-table-column>
                  <el-table-column prop="resType" label="类型" sortable="custom" align="center" width="90">
                    <template slot-scope="scope">
                      <Tag :color="scope.row.resType == 'menu' ? 'green': 'yellow' ">
                        {{scope.row.resType == 'menu' ? '菜单' : '文件'}}
                      </Tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resName" label="资源名称" sortable="custom" align="center" width="130"></el-table-column>
                  <el-table-column prop="resCode" label="资源编码" sortable="custom" width="150"></el-table-column>
                  <el-table-column prop="resPname" label="上级资源" sortable="custom" align="center" width="130"></el-table-column>
                  <el-table-column prop="resLevel" label="级别" sortable="custom" align="center" width="90">
                    <template slot-scope="scope">
                      <Tag :color="scope.row.resLevel != 1 ? scope.row.resLevel == 2 ? 'yellow': scope.row.resLevel == 3 ? 'green': 'blue' : 'red' ">
                        {{scope.row.resLevel}} 级
                      </Tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resIcon" label="图标" show-overflow-tooltip align="center" width="70">
                    <template slot-scope="scope">
                      <Button type="text" size="small">
                        <Icon :type="scope.row.resIcon" :size="20"></Icon>
                      </Button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="seq" label="序号" align="center" width="70"></el-table-column>
                  <el-table-column prop="state" label="状态" align="center" width="90">
                    <template slot-scope="scope">
                      <Tag :color="scope.row.state == 1 ? 'green': '' ">
                        {{scope.row.state == 1 ? '正常' : '禁用'}}
                      </Tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建日期" align="center" min-width="170"></el-table-column>
                </el-table>
                <br/>
                <!--翻页工具条-->
                <Page show-elevator show-total show-sizer size="small" placement="top" v-if="resPageParam.total > 0"
                      :total="resPageParam.total" :current="resPageParam.pageNum"
                      :page-size-opts="[10, 20, 50, 100]"
                      @on-change="resPageChange"
                      @on-page-size-change="resSizeChange">
                </Page>
              </TabPane>

              <TabPane label="权限管理" name="permission" icon="key">
                <!--操作工具条-->
                <Row>
                  <i-Col :xs="24" :sm="12" :md="14" :lg="16">
                    <Button type="primary" icon="edit" :disabled="permShowEdit" @click="permOpenEdit">修改</Button>
                    <Button type="error" icon="android-delete" :disabled="permShowEdit" @click="doDelPerm">删除</Button>
                  </i-Col>
                  <i-Col :xs="24" :sm="12" :md="10" :lg="8">
                    <i-Input v-model="permPageQuery.queryValue" @on-enter="search" placeholder="查询..." :maxlength="32" clearable>
                      <Select v-model="permPageQuery.queryKey" @on-change="search" slot="prepend" style="width: 80px">
                        <Option value="permName">权限名称</Option>
                        <Option value="resCode">资源编码</Option>
                        <Option value="permCode">资源编码</Option>
                      </Select>
                      <Button type="primary" slot="append" @click="search">
                        <Icon type="ios-search-strong"></Icon>
                      </Button>
                      <Button type="error" slot="append" @click="searchRset">重置</Button>
                    </i-Input>
                  </i-Col>
                </Row>
                <br/>
                <el-table :data="permList" stripe border highlight-current-row v-loading="permLoading" size="mini" element-loading-text="拼命加载中"
                          @row-click="permClickRow" @row-dblclick="permOpenEdit" @sort-change="permSortChange">
                  <el-table-column prop="permId" label="编号" align="center" width="70"></el-table-column>
                  <el-table-column prop="permName" label="权限名称" sortable="custom" align="center" width="150"></el-table-column>
                  <el-table-column prop="resCode" label="资源编码" sortable="custom" align="center" width="150"></el-table-column>
                  <el-table-column prop="permCode" label="权限编码" sortable="custom" align="center" width="150"></el-table-column>
                  <el-table-column prop="permUrl" label="资源URL" sortable="custom" show-overflow-tooltip width="180"></el-table-column>
                  <el-table-column prop="state" label="状态" sortable="custom" align="center" width="90">
                    <template slot-scope="scope">
                      <Tag :color="scope.row.state == 1 ? 'green': '' ">
                        {{scope.row.state == 1 ? '正常' : '禁用'}}
                      </Tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建日期" align="center" min-width="180"></el-table-column>
                </el-table>
                <br/>
                <!--翻页工具条-->
                <Page show-elevator show-total show-sizer size="small" placement="top" v-if="permPageParam.total > 0"
                      :total="permPageParam.total" :current="permPageParam.pageNum"
                      :page-size-opts="[10, 20, 50, 100]"
                      @on-change="permPageChange"
                      @on-page-size-change="permSizeChange">
                </Page>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </i-Col>
    </Row>
    <Modal :mask-closable="false" v-model="resVisible" :title="resShowOpsType">
      <Form ref="sysResource" :model="sysResource" :rules="resValidate" :label-width="80">
        <FormItem label="上级资源" prop="resPid">
          <res-select :resId="sysResource.resPid" @resChange="resSelectChange" :rootNode="true" :refresh="true"></res-select>
        </FormItem>
        <FormItem label="资源类型" prop="resType">
          <RadioGroup v-model="sysResource.resType">
            <Radio label="menu">菜单</Radio>
            <Radio label="file">文件</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="资源名称" prop="resName">
          <Input v-model="sysResource.resName" placeholder="请输入"/>
        </FormItem>
        <FormItem label="资源编码" prop="resCode">
          <Input v-model="sysResource.resCode" placeholder="请输入"/>
        </FormItem>
        <FormItem label="资源图标：" prop="resIcon">
          <i-Input v-model="sysResource.resIcon" placeholder="请输入">
            <Poptip placement="right" slot="prepend">
              <Button type="ghost">
                <Icon :type="sysResource.resIcon" :size="15"></Icon>
              </Button>
              <div slot="content" style="height:200px">
                <icon-select @selectIcon="selectIcon"></icon-select>
              </div>
            </Poptip>
          </i-Input>
        </FormItem>
        <FormItem label="资源级别" prop="resLevel">
          <Rate disabled v-model="sysResource.resLevel" :count="3"></Rate>
          {{addResFrom.resLevel}}级
        </FormItem>
        <FormItem label="排序号" prop="seq">
          <InputNumber :max="100" :min="1" v-model="sysResource.seq"></InputNumber>
        </FormItem>
        <FormItem label="状态" prop="state">
          <i-switch v-model="sysResource.state" size="large" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="resVisible = false">取 消</Button>
        <Button type="primary" @click="resOperation">确 定</Button>
      </div>
    </Modal>

    <Modal :mask-closable="false" v-model="permVisible" :title="permShowOpsType">
      <Form ref="sysPermission" :model="sysPermission" :rules="permValidate" :label-width="80">
        <FormItem label="所属资源" prop="resId">
          <res-select :resId="sysPermission.resId" @resChange="permSelectChange" :refresh="true"></res-select>
        </FormItem>
        <FormItem label="权限名称" prop="permName">
          <Input v-model="sysPermission.permName" placeholder="请输入"/>
        </FormItem>
        <FormItem label="权限编码" prop="permCode">
          <AutoComplete
            @on-select="permCodeSelect"
            v-model="sysPermission.permCode"
            icon="ios-search"
            placeholder="请输入">
            <Option v-for="option in permission" :value="option.value" :key="option.value">
              <span>{{ option.text }}</span>
              <span>{{ option.value }}</span>
            </Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="URL" prop="permUrl">
          <Input v-model="sysPermission.permUrl" placeholder="请输入"/>
        </FormItem>
        <FormItem label="状态" prop="state">
          <i-switch v-model="sysPermission.state" size="large" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="permVisible = false">取 消</Button>
        <Button type="primary" @click="permOperation">确 定</Button>
      </div>
    </Modal>

  </div>

</template>
<script>
  import editTree from '@/components/editTree'
  import iconSelect from '@/components/iconSelect'
  import resSelect from '@/components/resSelect'

  export default {
    name: 'resource',
    components: {
      'edit-tree': editTree,
      'icon-select': iconSelect,
      'res-select': resSelect,
    },
    computed: {
      resShowEdit () {
        return this.resCurrCol === null
      },
      resShowOpsType () {
        return this.resOpsType === 0 ? '添加资源' : '编辑资源'
      },
      permShowEdit () {
        return this.permCurrCol === null
      },
      permShowOpsType () {
        return this.permOpsType === 0 ? '添加权限' : '编辑权限'
      }
    },
    data () {
      return {
        //资源树数据
        resTreeData: [],
        //资源树当前节点
        currNode: {},
        //资源树查询
        filterText: '',
        //资源树默认展开节点
        resTreeExpandedKeys: [0],
        //查询参数
        queryParam: {
          resId: null,
          resCode: null
        },
        //当前table页
        currTabs: 'resource',
        //资源表格数据
        resList: [],
        resLoading: false,
        //资源分页查询参数
        resPageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          sidx: null,
          sort: null
        },
        //资源查询参数
        resPageQuery: {
          queryKey: 'resName',
          queryValue: null
        },
        //资源当前选择行
        resCurrCol: null,
        //资源操作类型
        resOpsType: 0,
        resVisible: false,
        sysResource: {
          resPid: null,
          resPname: null,
          resType: null,
          resName: null,
          resCode: null,
          resLevel: null,
          resIcon: null,
          seq: null,
          state: 1
        },
        addResFrom: {
          resPid: 0,
          resPname: '',
          resType: 'menu',
          resName: '',
          resCode: '',
          resLevel: 1,
          resIcon: 'grid',
          seq: 1,
          state: 1
        },
        resValidate: {
          resPname: [
            {required: true, message: '请选择上级资源', trigger: 'change'}
          ],
          resName: [
            {required: true, message: '资源名称不能为空', trigger: 'blur'}
          ],
          resCode: [
            {required: true, message: '资源编码不能为空', trigger: 'blur'}
          ],
          resType: [
            {required: true, message: '类型不能为空', trigger: 'blur'}
          ]
        },
        /*************权限START*************/
        permOpsType: 0,
        permVisible: false,
        permLoading: false,
        //权限表格数据
        permList: [],
        //资源当前选择行
        permCurrCol: null,
        //权限分页查询参数
        permPageParam: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          sidx: null,
          sort: null
        },
        //权限查询参数
        permPageQuery: {
          queryKey: 'permName',
          queryValue: null
        },
        sysPermission: {
          permId: null,
          resId: null,
          resCode: null,
          permCode: null,
          permName: null,
          permUrl: null,
          state: 1
        },
        addPermFrom: {
          permId: 0,
          resId: '',
          resCode: '',
          permCode: '',
          permName: '',
          permUrl: 'grid',
          state: 1
        },
        permValidate: {
          permName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          permCode: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          resCode: [
            {required: true, message: '请选择资源', trigger: 'change'}
          ]
        },
        /*************权限END*************/
        //权限下拉菜单
        permission: [
          {
            value: 'view',
            text: '查看',
          },
          {
            value: 'create',
            text: '添加',
          },
          {
            value: 'update',
            text: '修改',
          },
          {
            value: 'delete',
            text: '删除',
          },
        ],
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getResTree()
        this.getResList()
      })
    },
    methods: {
      //树添加按钮事件
      resTreeAdd (data, node) {
        data.resId !== 0 ? this.openSave(data, node) : this.resOpenSave(data, node)
      },
      //加载资源树
      getResTree () {
        this.$http.get('/api/resource/tree')
          .then(response => {
            let {code, msg, result} = response.data
            if (code === 0) {
              this.$store.commit('setResData', result)
              this.resTreeData = JSON.parse(JSON.stringify(result.tree))
            } else {
              this.$Message.warning(msg)
            }
          })
      },
      //加载资源列表
      getResList () {
        this.resLoading = true
        //默认排序
        if (this.resPageParam.sidx === null) {
          this.resPageParam.sidx = 'resPid,seq'
        }
        this.$http({
          url: '/api/resource/listPage',
          method: 'get',
          params: {...this.resPageParam, ...this.resPageQuery.queryValue ? this.resPageQuery : this.queryParam}
        }).then(response => {
          let {code, msg, result} = response.data
          if (code === 0) {
            this.resCurrCol = null
            this.resList = result.list
            this.resPageParam.total = result.total
            this.resPageParam.pageNum = result.pageNum
          } else {
            this.$Message.warning(msg)
          }
          setTimeout(() => {
            this.resLoading = false
          }, 100)
        })
      },
      //加载权限列表
      getPermList () {
        this.permLoading = true
        //默认排序
        if (this.permPageParam.sidx === null) {
          this.permPageParam.sidx = 'resId'
        }
        this.$http({
          url: '/api/permission/listPage',
          method: 'get',
          params: {...this.permPageParam, ...this.permPageQuery.queryValue ? this.permPageQuery : this.queryParam}
        }).then(response => {
          let {code, msg, result} = response.data
          if (code === 0) {
            this.permCurrCol = null
            this.permList = result.list
            this.permPageParam.total = result.total
            this.permPageParam.pageNum = result.pageNum
          } else {
            this.$Message.warning(msg)
          }
          setTimeout(() => {
            this.permLoading = false
          }, 100)
        })
      },
      //table页切换
      tabsChange (name) {
        if (name === 'resource') {
          this.getResList()
        } else {
          this.getPermList()
        }
      },
      //资源树点击事件
      treeDataChange (data, node) {
        this.currNode = node
        this.resPageQuery.queryValue = null
        this.queryParam.resId = null
        this.queryParam.resCode = null
        if (this.currTabs === 'resource') {
          this.queryParam.resId = data.resLevel === 0 ? null : data.resId
          this.getResList()
        } else {
          this.queryParam.resCode = data.resLevel === 0 ? null : data.resCode
          this.getPermList()
        }
      },
      //权限下拉菜单点击事件
      permCodeSelect (value) {
        let permName = this.sysPermission.permName
        if (permName.indexOf('-') > 0) {
          permName = permName.substring(0, permName.indexOf('-'))
        }
        this.permission.forEach(data => {
          if (data.value === value) {
            this.sysPermission.permName = permName + '-' + data.text
          }
        })
      },
      // 资源翻页操作
      resPageChange (val) {
        this.resPageParam.pageNum = val
        this.getResList()
      },
      //资源改变分页数量
      resSizeChange (val) {
        this.resPageParam.pageSize = val
        this.getResList()
      },
      //资源排序
      resSortChange (val) {
        this.resPageParam.sidx = val.prop
        this.resPageParam.sort = val.order
        this.getResList()
      },
      //资源表格点击行事件
      resClickRow (val) {
        this.resCurrCol = val
      },
      //添加资源
      resOpenSave (data, node) {
        this.currNode = node
        this.resetForm('sysResource')
        if (data.resLevel > 2) {
          this.$Message.info('最高只支持3级')
          return false
        }
        this.sysResource.resLevel = data.resLevel + 1
        this.sysResource.resPid = data.resId
        let childrenRes = data.children
        if (childrenRes.length > 0) {
          this.sysResource.seq = childrenRes[childrenRes.length - 1].seq * 1 + 1
        } else {
          this.sysResource.seq = 1
        }
        this.sysResource.resType = 'menu'
        this.resVisible = true
        this.resOpsType = 0
      },
      //修改资源
      resOpenEdit (val) {
        this.resOpsType = 1
        if (this.resCurrCol !== null) {
          this.$http.get('/api/resource/' + this.resCurrCol.resId)
            .then(response => {
              let {code, msg, result} = response.data
              if (code === 0) {
                this.sysResource = result
                this.resVisible = true
              } else {
                this.$Message.warning(msg)
              }
            })
        }
      },
      //资源请求处理
      resOperation () {
        if (this.resOpsType === 0) {
          this.doSaveRes()
        } else if (this.resOpsType === 1) {
          this.doUpdateRes()
        }
      },
      doSaveRes () {
        this.$refs['sysResource'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/resource/', this.sysResource)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('添加成功！')
                  this.resetForm('sysResource')
                  this.resVisible = false
                  this.echoTree(0)
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //执行更新操作
      doUpdateRes () {
        this.$refs['sysResource'].validate((valid) => {
          if (valid) {
            this.$http.put('/api/resource/' + this.sysResource.resId, this.sysResource)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('修改成功！')
                  this.resetForm('sysResource')
                  this.resVisible = false
                  this.getResTree()
                  this.getResList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //执行单个删除操作
      doDelRes (data, node) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除资源 ' + data.resName + ', 是否继续?</p>',
          onOk: () => {
            this.$http.delete('/api/resource/' + data.resId)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('删除成功！')
                  this.currNode = node
                  this.echoTree('delete')
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      selectIcon (icon) {
        this.sysResource.resIcon = icon
      },
      //查询
      search () {
        if (this.currTabs === 'resource') {
          if (this.resPageQuery.queryValue) {
            this.getResList()
          }
        } else {
          if (this.permPageQuery.queryValue) {
            this.getPermList()
          }
        }
      },
      //查询重置
      searchRset () {
        this.queryParam.resId = null
        this.queryParam.resCode = null
        if (this.currTabs === 'resource') {
          this.resPageQuery.queryValue = null
          this.getResList()
        } else {
          this.permPageQuery.queryValue = null
          this.getPermList()
        }
      },
      //资源级联选择
      resSelectChange (data) {
        this.sysResource.resPid = data.resId
      },
      //权限级联选择
      permSelectChange (data) {
        this.sysPermission.resId = data.resId
      },
      /*8888888888888888888888888888888888888888888888888888888888888888888888888888888888*/
      //权限表格点击行事件
      permClickRow (val) {
        this.permCurrCol = val
      },
      //权限翻页操作
      permPageChange (val) {
        this.permPageParam.pageNum = val
        this.getPermList()
      },
      //权限改变分页数量
      permSizeChange (val) {
        this.permPageParam.pageSize = val
        this.getPermList()
      },
      //权限排序
      permSortChange (val) {
        this.permPageParam.sidx = val.prop
        this.permPageParam.sort = val.order
        this.getPermList()
      },
      //重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //添加权限
      permOpenSave (data, node) {
        this.currNode = node
        this.permOpsType = 0
        this.sysPermission = JSON.parse(JSON.stringify(this.addPermFrom))
        this.sysPermission.resId = data.resId
        this.sysPermission.permName = data.resName
        this.permVisible = true
        this.resetForm('sysPermission')
      },
      //修改权限
      permOpenEdit () {
        this.permOpsType = 1
        if (this.permCurrCol !== null) {
          this.$http.get('/api/permission/' + this.permCurrCol.permId)
            .then(response => {
              let {code, msg, result} = response.data
              if (code === 0) {
                this.sysPermission = result
                this.permVisible = true
              } else {
                this.$Message.warning(msg)
              }
            })
        }
      },
      //权限请求处理
      permOperation () {
        if (this.permOpsType === 0) {
          this.doSavePerm()
        } else if (this.permOpsType === 1) {
          this.doUpdatePerm()
        }
      },
      //执行权限添加
      doSavePerm () {
        this.$refs['sysPermission'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/permission/', this.sysPermission)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('添加成功！')
                  this.resetForm('sysPermission')
                  this.permVisible = false
                  this.echoTree(0)
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //执行权限更新
      doUpdatePerm () {
        this.$refs['sysPermission'].validate((valid) => {
          if (valid) {
            this.$http.put('/api/permission/' + this.sysPermission.permId, this.sysPermission)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('修改成功！')
                  this.resetForm('sysPermission')
                  this.permVisible = false
                  this.getPermList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //执行单个删除操作
      doDelPerm () {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除权限  <span style="color: red;">' + this.permCurrCol.permName + '</span> , 是否继续?</p>',
          onOk: () => {
            this.$http.delete('/api/permission/' + this.permCurrCol.permId)
              .then(response => {
                if (response.data.code === 0) {
                  this.$Message.success('删除成功！')
                  this.getPermList()
                } else {
                  this.$Message.warning(response.data.msg)
                }
              })
          }
        })
      },
      //树节点添加资源或权限
      openSave (data, node) {
        if (this.currTabs === 'resource') {
          this.resOpenSave(data, node)
        } else {
          this.permOpenSave(data, node)
        }
      },
      //树节点回显
      echoTree (type) {
        if (type === 'delete') {
          this.treeDataChange(this.currNode.parent.data, this.currNode)
        } else {
          this.treeDataChange(this.currNode.data, this.currNode)
        }
        this.getResTree()
        let list = [0]
        this.doEcho(list, this.currNode)
        this.resTreeExpandedKeys = list
      },
      doEcho (list, node) {
        if (node.key !== undefined) {
          list.push(node.key)
          if (node.parent) {
            this.doEcho(list, node.parent)
          }
        } else {
          return list
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.resName.indexOf(value) !== -1
      }
    }
    ,
    watch: {
      filterText (val) {
        this.$refs.resTree.filter(val)
      }
    }
  }
</script>
<style lang="less" scoped>


</style>
