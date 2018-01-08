<template>
  <div class="ibox">
    <Row>
      <i-Col :xs="24" :sm="10" :md="10" :lg="6">
        <Card :padding="10">
          <div slot="title">
            资源管理
          </div>
          <!-- <a href="#" slot="extra" type="primary" @click.prevent="resetData">
             <Icon type="refresh"></Icon>
             重置
           </a>-->
          <!-- <Tree :data="treeData" :render="renderContent"></Tree>-->

          <i-Input v-model="filterText" style="padding:0px 30px 5px 10px "
                   placeholder="输入关键字进行过滤"
                   icon="ios-clock-outline">
            <Button slot="append" icon="ios-close" @click.prevent="filterText=''"></Button>
          </i-Input>
          <el-tree
            :data="treeData"
            node-key="resId"
            :default-expanded-keys="resTreeExpandedKeys"
            :expand-on-click-node="false"
            :render-content="renderContent"
            accordion highlight-current
            :filter-node-method="filterNode"
            ref="resTree"
            :indent="20"
          >
          </el-tree>
        </Card>
      </i-Col>

      <i-Col :xs="24" :sm="14" :md="14" :lg="18">
        <div>
          <Card>
            <Tabs v-model="currTabs" @on-click="tabsChange">
              <TabPane label="资源管理" name="resource" icon="folder">
                <!-- 表格 -->
                <!-- <Table border stripe highlight-row ref="selection" :loading="resLoading"
                        :columns="resColumns" :data="resList"
                        @on-sort-change="resSortChange " @on-row-dblclick="editRes"
                 ></Table>-->

                <el-table :data="resList" stripe border highlight-current-row v-loading="resLoading" size="mini"
                          @row-dblclick="editRes"
                          @sort-change="resSortChange">
                  <el-table-column prop="resId" label="编号" align="center" width="70"></el-table-column>
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
                      <Tag :color="scope.row.resLevel != 1 ? scope.row.resLevel == 2 ? 'yellow': scope.row.resLevel == 3 ? 'green': '' : 'red' ">
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
                <Page show-elevator show-total show-sizer size="small" placement="top" v-if="resPagePara.total > 1"
                      :total="resPagePara.total"
                      :page-size-opts="[10, 20, 50, 100]"
                      @on-change="resPageChange"
                      @on-page-size-change="resSizeChange">
                </Page>
              </TabPane>

              <TabPane label="权限管理" name="permission" icon="key">
                <!-- 表格 -->
                <!--     <Table border stripe highlight-row ref="selection" :loading="permLoading"
                            :columns="permColumns" :data="permList"
                            @on-row-dblclick="editPerm" @on-sort-change="permSortChange"></Table>-->

                <el-table :data="permList" stripe border highlight-current-row v-loading="permLoading" size="mini"
                          @sort-change="permSortChange" @cell-dblclick="editPerm">
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
                  <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                      <Button type="primary" size="small" @click="editPerm(scope.row)">
                        修改
                      </Button>
                      <Button type="error" size="small" @click="doDelPerm(scope.row)">
                        删除
                      </Button>
                    </template>
                  </el-table-column>
                </el-table>
                <br/>
                <!--翻页工具条-->
                <Page show-elevator show-total show-sizer size="small" placement="top" v-if="permPagePara.total > 1"
                      :total="permPagePara.total"
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

    <Modal :transfer="false" :mask-closable="false" v-model="resVisible" :title="resOpName.show" class-name="vertical-center-modal">
      <Form ref="resFrom" :model="resFrom" :rules="resValidate" :label-width="80">
        <FormItem label="上级资源" prop="resPname">
          <i-Input v-model="resFrom.resPname" placeholder="请选择" readonly>
            <Poptip placement="bottom-end" slot="append">
              <Button type="ghost">选择上级</Button>
              <div slot="content">
                <Card :padding="0" :bordered="false" :dis-hover="true">
                  <!-- <Tree style="border:none;text-align: left;" :data="dropTree" @on-select-change="resTreeChange"></Tree>-->
                  <el-tree style="border:none;text-align: left;"
                           :data="dropTree"
                           node-key="resId"
                           :default-expanded-keys="[0]"
                           :expand-on-click-node="true"
                           :props="dropTreeProps"
                           @node-click="resTreeChange"
                           accordion highlight-current
                  >
                  </el-tree>
                </Card>
              </div>
            </Poptip>

          </i-Input>
        </FormItem>
        <FormItem label="资源类型" prop="resType">
          <RadioGroup v-model="resFrom.resType">
            <Radio label="menu">菜单</Radio>
            <Radio label="file">文件</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="资源名称" prop="resName">
          <Input v-model="resFrom.resName" placeholder="请输入"/>
        </FormItem>
        <FormItem label="资源编码" prop="resCode">
          <Input v-model="resFrom.resCode" placeholder="请输入"/>
        </FormItem>
        <FormItem label="资源图标" prop="resIcon">
          <i-Input v-model="resFrom.resIcon" placeholder="请输入">
            <Poptip placement="right" slot="prepend">
              <Button type="ghost">
                <Icon :type="resFrom.resIcon" :size="14"></Icon>
              </Button>
              <div slot="content">
                <iframe src="http://fontawesome.dashgame.com/" width="350px" height="400px"></iframe>
              </div>
            </Poptip>
          </i-Input>
        </FormItem>
        <FormItem label="资源级别" prop="resLevel">
          <Rate disabled v-model="resFrom.resLevel" :count="3"></Rate>
          {{resFrom.resLevel}}级
        </FormItem>
        <FormItem label="排序号" prop="seq">
          <InputNumber :max="100" :min="1" v-model="resFrom.seq"></InputNumber>
        </FormItem>
        <FormItem label="状态" prop="state">
          <i-switch v-model="resFrom.state" size="large" :true-value="1" :false-value="0">
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

    <Modal :transfer="false" :mask-closable="false" v-model="permVisible" :title="permOpName.show" class-name="vertical-center-modal">
      <Form ref="permFrom" :model="permFrom" :rules="permValidate" :label-width="80">
        <FormItem label="资源编码" prop="resCode">
          <i-Input v-model="permFrom.resCode" placeholder="请选择" readonly>
            <Poptip placement="bottom-end" slot="append">
              <Button type="ghost">选择</Button>
              <div slot="content">
                <Card :padding="0" :bordered="false" :dis-hover="true">
                  <!-- <Tree style="border:none;text-align: left;" :data="dropTree" @on-select-change="permTreeChange"></Tree>-->
                  <el-tree
                    :data="resTreeData"
                    node-key="resId"
                    :default-expanded-keys="[0]"
                    :expand-on-click-node="true"
                    :props="dropTreeProps"
                    @node-click="permTreeChange"
                    accordion highlight-current
                  >
                  </el-tree>
                </Card>
              </div>
            </Poptip>
          </i-Input>
        </FormItem>
        <FormItem label="权限名称" prop="permName">
          <Input v-model="permFrom.permName" placeholder="请输入"/>
        </FormItem>
        <FormItem label="权限编码" prop="permCode">
          <AutoComplete
            @on-select="permCodeSelect"
            v-model="permFrom.permCode"
            icon="ios-search"
            placeholder="请输入">
            <Option v-for="option in permission" :value="option.value" :key="option.value">
              <span>{{ option.text }}</span>
              <span>{{ option.value }}</span>
            </Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="URL" prop="permUrl">
          <Input v-model="permFrom.permUrl" placeholder="请输入"/>
        </FormItem>
        <FormItem label="状态" prop="state">
          <i-switch v-model="permFrom.state" size="large" :true-value="1" :false-value="0">
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
  export default {
    name: 'resource',
    data () {
      return {
        filterText: '',
        //资源树当前节点
        currNode: {},
        resTreeExpandedKeys: [0],
        /*************资源START*************/
        resLoading: false,
        resOpName: {show: '', save: '添加资源', update: '修改资源'},
        //资源表格数据
        resList: [],
        //分页查询参数
        resPagePara: {
          total: 0,
          page: 1,
          pageSize: 10,
          sidx: 'resLevel,resPid,seq',
          sort: 'asc',
          queryCol: '',
          queryStr: ''
        },
        resOpsType: 'save',
        resVisible: false,
        resFrom: {
          'resPid': 0,
          'resPname': '',
          'resType': 'menu',
          'resName': '',
          'resCode': '',
          'resLevel': 1,
          'resIcon': 'grid',
          'seq': 1,
          'state': 1
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
        /*************资源END*************/
        /*************权限START*************/
        permList: [],//表格数据
        permPagePara: {//分页查询参数
          total: 0,
          page: 1,
          pageSize: 10,
          sidx: 'permId',
          sort: 'asc',
          queryCol: 'permName',
          queryStr: ''
        },
        permOpsType: 'save',
        permVisible: false,
        permLoading: false,
        permOpName: {show: '', save: '添加权限', update: '修改权限'},
        permFrom: {
          'permId': 0,
          'resCode': '',
          'permCode': '',
          'permName': '',
          'permUrl': '#',
          'state': 1
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
        /*************资源树START*************/
        //资源树源数据
        resTreeData: [],
        //资源树
        treeData: [
          {
            resName: '系统资源',
            resId: 0,
            resLevel: 0,
            children: []
          }
        ],
        //下拉树
        dropTree: [{
          resName: '系统资源',
          resId: 0,
          resLevel: 0,
          children: []
        }],
        dropTreeProps: {
          children: 'children',
          label: 'resName'
        },
        buttonProps: {
          type: 'ghost',
          size: 'small',
        },
        /*************资源树END*************/
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
        //当前table页
        currTabs: 'resource'
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getResTree()
        this.getResList()
      })
    },
    methods: {
      renderContent (h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: data.resId !== 0 ? data.resIcon : 'home'
              },
              style: {
                marginLeft: '8px',
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                type: 'text'
              }),
              on: {
                click: () => {
                  this.treeDataChange(data, node)
                }
              }
            }, data.resName)
          ]),

          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-plus-empty',
                type: 'primary'
              }),
              style: data.resId !== 0 ? {marginRight: '8px'} : {width: '52px'},
              on: {
                click: () => {
                  data.resId !== 0 ? this.addData(data, node) : this.addRes(data, node)
                }
              }
            }),
            data.resId !== 0 ? h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-minus-empty'
              }),
              on: {
                click: () => { this.doDelRes(data, node) }
              }
            }) : null

          ])
        ])
      },
      //加载资源树
      getResTree () {
        this.$http.get('/api/resource/tree')
          .then(response => {
            let {code, message, result} = response.data
            if (code === 1) {
              this.treeData[0].children = JSON.parse(JSON.stringify(result))
              this.dropTree[0].children = JSON.parse(JSON.stringify(result))
              this.resTreeData = response.data.result
            }
          })
      },
      //加载资源列表
      getResList () {
        this.resLoading = true
        this.$http.get('/api/resource/listPage' +
          '?pageNum=' + this.resPagePara.page +
          '&pageSize=' + this.resPagePara.pageSize +
          '&sidx=' + this.resPagePara.sidx +
          '&sort=' + this.resPagePara.sort +
          '&' + this.resPagePara.queryCol + '=' + this.resPagePara.queryStr
        ).then(response => {
          if (response.data.code === 1) {
            this.resList = response.data.result.list
            this.resPagePara.total = response.data.result.total
          }
          setTimeout(() => {
            this.resLoading = false
          }, 100)
        })
      },
      //加载权限列表
      getPermList () {
        this.permLoading = true
        this.$http.get('/api/permission/listPage' +
          '?pageNum=' + this.permPagePara.page +
          '&pageSize=' + this.permPagePara.pageSize +
          '&sidx=' + this.permPagePara.sidx +
          '&sort=' + this.permPagePara.sort +
          '&' + this.permPagePara.queryCol + '=' + this.permPagePara.queryStr
        ).then(response => {
          if (response.data.code === 1) {
            this.permList = response.data.result.list
            this.permPagePara.total = response.data.result.total
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
        if (data.resLevel === 0) {
          this.resPagePara.queryCol = ''
          this.resPagePara.queryStr = ''
          this.resPagePara.page = 1
          this.permPagePara.queryCol = ''
          this.permPagePara.queryStr = ''
          this.permPagePara.page = 1
        } else {
          this.resPagePara.queryCol = 'resId'
          this.resPagePara.queryStr = data.resId
          this.permPagePara.queryCol = 'resCode'
          this.permPagePara.queryStr = data.resCode
        }
        if (this.currTabs === 'resource') {
          this.getResList()
        } else {
          this.getPermList()
        }
      },
      //添加资源下拉树点击事件
      resTreeChange (data, node) {
        this.currNode = node
        if (data.resLevel > 2) {
          this.$Message.info('最高只支持3级')
          return false
        }
        this.resFrom.resPname = data.resName
        this.resFrom.resLevel = data.resLevel + 1
        this.resFrom.resPid = data.resId
        let childrenRes = data.children
        if (childrenRes.length > 0) {
          this.resFrom.seq = childrenRes[childrenRes.length - 1].seq * 1 + 1
        } else {
          this.resFrom.seq = 1
        }
      },
      //添加权限下拉树点击事件
      permTreeChange (data, node) {
        this.currNode = node
        if (data.resLevel > 0) {
          this.permFrom.resCode = data.resCode
          this.permFrom.permName = data.resName
        }
      },
      //权限下拉菜单点击事件
      permCodeSelect (value) {
        let permName = this.permFrom.permName
        if (permName.indexOf('-') > 0) {
          permName = permName.substring(0, permName.indexOf('-'))
        }
        this.permission.forEach(data => {
          if (data.value === value) {
            this.permFrom.permName = permName + '-' + data.text
          }
        })
      },
      // 资源翻页操作
      resPageChange (val) {
        this.resPagePara.page = val
        this.getResList()
      },
      //资源改变分页数量
      resSizeChange (val) {
        this.resPagePara.pageSize = val
        this.getResList()
      },
      //资源排序
      resSortChange (val) {
        this.resPagePara.sidx = val.prop
        this.resPagePara.sort = val.order
        this.getResList()
      },
      //添加资源
      addRes (data, node) {
        this.currNode = node
        this.resOpName.show = this.resOpName.save
        this.resetForm('resFrom')
        if (data.resLevel > 2) {
          this.$Message.info('最高只支持3级')
          return false
        }
        this.resFrom.resPname = data.resName
        this.resFrom.resLevel = data.resLevel + 1
        this.resFrom.resPid = data.resId
        let childrenRes = data.children
        if (childrenRes.length > 0) {
          this.resFrom.seq = childrenRes[childrenRes.length - 1].seq * 1 + 1
        } else {
          this.resFrom.seq = 1
        }
        this.resVisible = true
        this.dropTree[0].children = JSON.parse(JSON.stringify(this.resTreeData))
        this.resOpsType = 'save'
      },
      //修改资源
      editRes (val) {
        this.resOpName.show = this.resOpName.update
        this.resetForm('resFrom')
        this.resFrom = JSON.parse(JSON.stringify(val))
        this.resVisible = true
        this.resOpsType = 'update'
      },
      //资源请求处理
      resOperation () {
        if (this.resOpsType === 'save') {
          this.doSaveRes()
        } else if (this.resOpsType === 'update') {
          this.doUpdateRes()
        }
      },
      //权限翻页操作
      permPageChange (val) {
        this.permPagePara.page = val
        this.getPermList()
      },
      //权限改变分页数量
      permSizeChange (val) {
        this.permPagePara.pageSize = val
        this.getPermList()
      },
      //权限排序
      permSortChange (val) {
        this.permPagePara.sidx = val.prop
        this.permPagePara.sort = val.order
        this.getPermList()
      },
      //重置表格
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      doSaveRes () {
        this.$refs['resFrom'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/resource/', this.resFrom)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('添加成功！')
                  //this.resetForm('resFrom')
                  this.resVisible = false
                  this.echoTree('save')
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          }
        })
      },
      //执行更新操作
      doUpdateRes () {
        this.$refs['resFrom'].validate((valid) => {
          if (valid) {
            this.$http.put('/api/resource/' + this.resFrom.resId, this.resFrom)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('修改成功！')
                  // this.resetForm('resFrom')
                  this.resVisible = false
                  this.getResTree()
                  this.getResList()
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          }
        })
      },
      //执行单个删除操作
      doDelRes (data, node) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除资源  <span style="color: red;">' + data.resName + '</span> , 是否继续?</p>',
          onOk: () => {
            this.$http.delete('/api/resource/' + data.resId)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('删除成功！')
                  this.currNode = node
                  this.echoTree('delete')
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          }
        })
      },
      //添加权限
      addPerm (data, node) {
        this.currNode = node
        this.permOpName.show = this.permOpName.save
        this.resetForm('permFrom')
        this.permVisible = true
        this.permOpsType = 'save'
        if (data.resLevel > 0) {
          this.permFrom.resCode = data.resCode
          this.permFrom.permName = data.resName
        }
        this.dropTree[0].children = JSON.parse(JSON.stringify(this.resTreeData))
      },
      //修改权限
      editPerm (data) {
        this.permOpName.show = this.permOpName.update
        this.resetForm('permFrom')
        this.permFrom = JSON.parse(JSON.stringify(data))
        this.permVisible = true
        this.permOpsType = 'update'
      },
      //权限请求处理
      permOperation () {
        if (this.permOpsType === 'save') {
          this.doSavePerm()
        } else if (this.permOpsType === 'update') {
          this.doUpdatePerm()
        }
      },
      //执行权限添加
      doSavePerm () {
        this.$refs['permFrom'].validate((valid) => {
          if (valid) {
            this.$http.post('/api/permission/', this.permFrom)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('添加成功！')
                  this.resetForm('permFrom')
                  this.permVisible = false
                  this.echoTree('save')
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          }
        })
      },
      //执行权限更新
      doUpdatePerm () {
        this.$refs['permFrom'].validate((valid) => {
          if (valid) {
            this.$http.put('/api/permission/' + this.permFrom.permId, this.permFrom)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('修改成功！')
                  this.resetForm('permFrom')
                  this.permVisible = false
                  this.getPermList()
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          }
        })
      },
      //执行单个删除操作
      doDelPerm (data) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>此操作将删除权限  <span style="color: red;">' + data.permName + '</span> , 是否继续?</p>',
          onOk: () => {
            this.$http.delete('/api/permission/' + data.permId)
              .then(response => {
                if (response.data.code === 1) {
                  this.$Message.success('删除成功！')
                  this.getPermList()
                } else {
                  this.$Message.warning(response.data.message)
                }
              })
          }
        })
      },
      //树节点添加资源或权限
      addData (data, node) {
        if (this.currTabs === 'resource') {
          this.addRes(data, node)
        } else {
          this.addPerm(data, node)
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
    },
    watch: {
      filterText (val) {
        this.$refs.resTree.filter(val)
      }
    }
  }
</script>
<style lang="less" scoped>


</style>
