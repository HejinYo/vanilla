<template>
  <div class="ivu-input-group">
    <div class="ivu-input-group-prepend">
      <Poptip placement="bottom-start" slot="append">
        <Button type="ghost">{{ btnShow }}</Button>
        <div slot="content">
          <Card :padding="0" :bordered="false" :dis-hover="true">
            <el-tree style="border:none;text-align: left;"
                     :data="resData.tree"
                     node-key="resId"
                     :default-expanded-keys="[0]"
                     :expand-on-click-node="true"
                     :props="resTreeProps"
                     @node-click="resTreeChange"
                     accordion highlight-current
            >
            </el-tree>
          </Card>
        </div>
      </Poptip>

    </div>
    <div>
      <Select v-model="resId" disabled class="select-new-disabled">
        <Option v-for="item in resData.list" :value="item.resId" :label="item.resName" :key="item.resId"></Option>
      </Select>
    </div>
  </div>
</template>

<script>
  /**
   * 部门选择组件
   */
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      resId: null,
      btnShow: {
        default: '选择'
      },
      rootNode: {
        default: false
      },
      refresh: {
        default: false
      }
    },
    data () {
      return {
        resData: {
          list: [],
          tree: []
        },
        resTreeProps: {
          children: 'children',
          label: 'resName'
        }
      }
    },
    methods: {
      ...mapActions([
        'getResData'
      ]),
      // 部门级联选择
      resTreeChange (data, node, object) {
        this.$emit('resChange', data)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getResData(this.refresh).then(value => {
          this.resData = value
          if (this.rootNode) {
            this.resData = value
          } else {
            if (value.tree.length > 0) {
              this.resData.tree = value.tree[0].children
              let list = JSON.parse(JSON.stringify(value.list))
              list.splice(0, 1)
              this.resData.list = list
            }
          }
        })
      }
      )
    }
  }
</script>
<style>
  .select-new-disabled .ivu-select-selected-value {
    background-color: #fff;
    opacity: 1;
    cursor: not-allowed;
    color: #495060;
  }
</style>
