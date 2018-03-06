<template>
  <div>
    <div>
      <Card>
        <p slot="title">
          <Icon type="person-stalker"></Icon>
          日志管理
        </p>
        <!--操作工具条-->
        <Row>
          <i-Col :xs="24" :sm="12" :md="14" :lg="16">
            <!--<Button type="primary" icon="android-add" @click="openSave">添加</Button>
            <Button type="primary" icon="edit" :disabled="showEdit" @click="openEdit">修改</Button>
            <Button type="error" icon="android-delete" :disabled="showDelete" @click="doDelete">删除</Button>-->
          </i-Col>

          <i-Col :xs="24" :sm="12" :md="10" :lg="8">
            <i-Input v-model="pageQuery.queryValue" @on-enter="searchLog" placeholder="查询..." :maxlength="32" clearable>
              <Select v-model="pageQuery.queryKey" @on-change="searchLog" slot="prepend" style="width: 80px">
                <Option value="userName">用户名</Option>
                <Option value="opeartion">操作</Option>
              </Select>
              <Button type="primary" slot="append" @click="searchLog">
                <Icon type="ios-search-strong"></Icon>
              </Button>
              <Button type="error" slot="append" @click="searchRset">重置</Button>
            </i-Input>
          </i-Col>
        </Row>
        <br/>
        <div>
          <!-- 表格 -->
          <el-table :data="logList" stripe border highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中" size="mini"
                    @sort-change="sortChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable="custom" width="60"></el-table-column>
            <el-table-column prop="userName" label="姓名" sortable="custom" align="center" min-width="100"></el-table-column>
            <el-table-column prop="operation" label="操作" sortable="custom" align="center" width="150"></el-table-column>
            <el-table-column prop="method" label="方法" show-overflow-tooltip sortable="custom" align="center" min-width="150"></el-table-column>
            <el-table-column prop="params" label="参数" show-overflow-tooltip sortable="custom" align="center" min-width="150"></el-table-column>
            <el-table-column prop="ip" label="IP" sortable="custom" align="center" width="90"></el-table-column>
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
  </div>
</template>

<script>
  export default {
    name: 'sysLog',
    data () {
      return {
        listLoading: false,
        logList: [],//表格数据
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
        queryParam: {},
      }
    }
    ,
    mounted: function () {
      this.$nextTick(function () {
        this.getLogList()
      })
    },
    methods: {
      //加载日志列表
      getLogList () {
        this.listLoading = true
        //默认排序
        if (this.pageParam.sidx === null) {
          this.pageParam.sidx = 'createTime'
          this.pageParam.sort = 'desc'
        }
        this.$http({
          url: '/api/log/listPage',
          method: this.advancedSearch ? 'post' : 'get',
          data: this.queryParam,
          params: this.advancedSearch ? this.pageParam : {...this.pageParam, ...this.pageQuery}
        }).then(response => {
          let {code, msg, result} = response.data
          if (code === 0) {
            this.currCol = null
            this.logList = result.list
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
        this.getLogList()
      },
      //改变分页数量
      sizeChange (val) {
        this.pageParam.pageSize = val
        this.getLogList()
      },
      //排序
      sortChange (val) {
        this.pageParam.sidx = val.prop
        this.pageParam.sort = val.order
        this.getLogList()
      },
      //查询
      searchLog () {
        if (this.pageQuery.queryValue) {
          this.getLogList()
        }
      },
      //查询重置
      searchRset () {
        this.pageQuery.queryValue = null
        this.getLogList()
      }
    }
  }
</script>
<style lang="less">

</style>

