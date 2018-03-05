<template>
  <div>
    <i-Input v-model="filterText" style="padding:0px 30px 5px 10px "
             placeholder="输入关键字进行过滤"
             icon="ios-clock-outline">
      <Button slot="append" icon="ios-close" @click.prevent="filterText=''"></Button>
    </i-Input>
    <el-tree
      :data="data"
      :node-key="nodeKey"
      :default-expanded-keys="expandedKeys"
      :expand-on-click-node="false"
      :render-content="renderContent"
      accordion highlight-current
      :filter-node-method="filterNode"
      ref="dataTree"
    >
    </el-tree>
  </div>
</template>

<script>
  export default {
    props: {
      nodeKey: {default: 'value'},
      label: {default: 'label'},
      value: {default: 'value'},
      icon: {default: 'icon'},
      data: null,
      expandedKeys: null
    },
    data () {
      return {
        buttonProps: {
          type: 'ghost',
          size: 'small',
        },
        filterText: ''
      }
    },
    methods: {
      //部门树渲染函数
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
                type: node.level !== 1 ? data[this.icon] ? data[this.icon] : '' : 'home'
              },
              /*style: {
                marginLeft: '8px',
              }*/
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                type: 'text'
              }),
              on: {
                click: () => {
                  this.$emit('treeClick', data, node)
                }
              }
            }, data[this.label])
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
              style: node.level !== 1 ? {marginRight: '8px'} : {width: '52px'},
              on: {
                click: () => {
                  this.$emit('treeAdd', data, node)
                }
              }
            }),
            node.level !== 1 ? h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-minus-empty'
              }),
              on: {
                click: () => {
                  this.$emit('treeDel', data, node)
                }
              }
            }) : null
          ])
        ])
      },
      filterNode (value, data) {
        if (!value) return true
        //this.$emit('filterNode', value, data)
        return data[this.label].indexOf(value) !== -1
      }
    },
    watch: {
      filterText (val) {
        this.$refs.dataTree.filter(val)
      }
    }
  }
</script>

<style>

</style>
