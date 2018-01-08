<template>
  <div>
    <h1>vuex 测试</h1>
    Clicked: {{ count }} times
    <Button type="primary" @click="increment">+</Button>
    <Button type="error">
      点击次数: {{ count }}
    </Button>
    <Button type="primary" @click="decrement">-</Button>

    <Button type="primary" @click="info">显示普通提醒</Button>

    <el-tree
      :data="data4"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'

  let id = 1000
  export default {
    computed: {
      // 使用对象展开运算符...将 getters 混入 computed 对象中
      ...mapGetters([
        'count'
      ])
    },
    data () {
      return {
        data4: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
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
              message: `action: ${ action }`
            })
          }
        })
        console.log(response)
      },
      info () {
        this.$Message.info('这是一条普通的提醒')
      },
      append (data) {
        const newChild = {id: id++, label: 'testtest', children: []}
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      remove (node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },
      renderContent (h, {node, data, store}) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                  <span>
                    <span>{node.label}</span>
                  </span>
                  <span>
                    <button style="font-size: 12px;" type="text" on-click={() => this.append(data)}>Append</button>
                    <button style="font-size: 12px;" type="text" on-click={() => this.remove(node, data)}>Delete</button>
                  </span>
                </span>)
      }
    }
  }

</script>
<style>

</style>
