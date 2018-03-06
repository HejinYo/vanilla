import Main from '@/views/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {requireAuth: false, title: 'Login - 登录'},
  component: resolve => {
    require(['@/views/login.vue'], resolve)
  }
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {requireAuth: false, title: '404-页面不存在'},
  component: resolve => {
    require(['@/views/error-page/404.vue'], resolve)
  }
}

export const page403 = {
  path: '/403',
  meta: {requireAuth: false, title: '403-权限不足'},
  name: 'error-403',
  component: resolve => {
    require(['@//views/error-page/403.vue'], resolve)
  }
}

export const page500 = {
  path: '/500',
  meta: {requireAuth: false, title: '500-服务端错误'},
  name: 'error-500',
  component: resolve => {
    require(['@/views/error-page/500.vue'], resolve)
  }
}

export const preview = {
  path: '/preview',
  name: 'preview',
  meta: {requireAuth: false},
  component: resolve => {
    require(['@/views/form/article-publish/preview.vue'], resolve)
  }
}

export const locking = {
  path: '/locking',
  name: 'locking',
  meta: {requireAuth: false},
  component: resolve => {
    require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve)
  }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  meta: {requireAuth: true},
  component: Main,
  children: [
    {
      path: 'home', name: 'home_index', title: {i18n: 'home'}, meta: {requireAuth: false}, component: resolve => {
      require(['@/views/home/home.vue'], resolve)
    }
    },
    {
      path: 'ownspace', name: 'ownspace_index', title: '个人中心', meta: {requireAuth: true}, component: resolve => {
      require(['@/views/own-space/own-space.vue'], resolve)
    }
    },
    {
      path: 'order/:order_id', name: 'order-info', title: '订单详情', meta: {requireAuth: true}, component: resolve => {
      require(['@/views/advanced-router/component/order-info.vue'], resolve)
    }
    }, // 用于展示动态路由
    {
      path: 'shopping', name: 'shopping', title: '购物详情', meta: {requireAuth: true}, component: resolve => {
      require(['@/views/advanced-router/component/shopping-info.vue'], resolve)
    }
    }, // 用于展示带参路由
    {
      path: 'message', name: 'message_index', title: '消息中心', meta: {requireAuth: true}, component: resolve => {
      require(['@/views/message/message.vue'], resolve)
    }
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/system',
    name: 'system',
    icon: 'ios-cog',
    title: '系统管理',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        icon: 'person-stalker',
        title: '用户管理',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/system/user.vue'], resolve)
        }
      },
      {
        path: 'role',
        name: 'role',
        icon: 'ios-paw',
        title: '角色管理',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/system/role.vue'], resolve)
        }
      },
      {
        path: 'resource',
        name: 'resource',
        icon: 'briefcase',
        title: '资源管理',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/system/resource.vue'], resolve)
        }
      },
      {
        path: 'log',
        name: 'log',
        icon: 'map',
        title: '日志管理',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/system/log.vue'], resolve)
        }
      },
      {
        path: 'access',
        name: 'access',
        icon: 'locked',
        title: '权限管理',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/access/access.vue'], resolve)
        }
      },
      {
        path: 'vuexTest',
        name: 'vuexTest',
        icon: 'person-stalker',
        title: '状态测试',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/system/vuexTest.vue'], resolve)
        }
      }

    ]
  },
  {
    path: '/access-test',
    icon: 'lock-combination',
    title: '权限测试页',
    name: 'accesstest',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'index',
        name: 'accesstest_index',
        title: '权限测试页',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/access/access-test.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/international',
    icon: 'earth',
    name: 'international',
    title: {i18n: 'international'},
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'index',
        name: 'international_index',
        title: {i18n: 'international'},
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/international/international.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/component',
    icon: 'social-buffer',
    name: 'component',
    title: '组件',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'text-editor',
        icon: 'compose',
        name: 'text-editor',
        title: '富文本编辑器',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/text-editor/text-editor.vue'], resolve)
        }
      },
      {
        path: 'md-editor',
        icon: 'pound',
        name: 'md-editor',
        title: 'Markdown编辑器',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/markdown-editor/markdown-editor.vue'], resolve)
        }
      },
      {
        path: 'image-editor',
        icon: 'crop',
        name: 'image-editor',
        title: '图片预览编辑',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/image-editor/image-editor.vue'], resolve)
        }
      },
      {
        path: 'draggable-list',
        icon: 'arrow-move',
        name: 'draggable-list',
        title: '可拖拽列表',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/draggable-list/draggable-list.vue'], resolve)
        }
      },
      {
        path: 'area-linkage',
        icon: 'ios-more',
        name: 'area-linkage',
        title: '城市级联',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/area-linkage/area-linkage.vue'], resolve)
        }
      },
      {
        path: 'file-upload',
        icon: 'android-upload',
        name: 'file-upload',
        title: '文件上传',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/file-upload/file-upload.vue'], resolve)
        }
      },
      {
        path: 'count-to',
        icon: 'arrow-graph-up-right',
        name: 'count-to',
        title: '数字渐变',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/my-components/count-to/count-to.vue'], resolve)
        }
      }
      // {
      //     path: 'clipboard-page',
      //     icon: 'clipboard',
      //     name: 'clipboard-page',
      //     title: '一键复制',
      //     component: resolve => { require(['@/views/my-components/clipboard/clipboard.vue'], resolve); }
      // }
    ]
  },
  {
    path: '/form',
    icon: 'android-checkbox',
    name: 'form',
    title: '表单编辑',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'artical-publish',
        name: 'artical-publish',
        title: '文章发布',
        meta: {requireAuth: true},
        icon: 'compose', component: resolve => {
        require(['@/views/form/article-publish/article-publish.vue'], resolve)
      }
      },
      {
        path: 'workflow',
        name: 'workflow',
        icon: 'arrow-swap',
        title: '工作流',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/form/work-flow/work-flow.vue'], resolve)
        }
      }

    ]
  },
  // {
  //     path: '/charts',
  //     icon: 'ios-analytics',
  //     name: 'charts',
  //     title: '图表',
  //     component: Main,
  //     children: [
  //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
  //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

  //     ]
  // },
  {
    path: '/tables',
    icon: 'ios-grid-view',
    name: 'tables',
    title: '表格',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'dragableTable',
        name: 'dragable-table',
        icon: 'arrow-move',
        title: '可拖拽排序',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/tables/dragable-table.vue'], resolve)
        }
      },
      {
        path: 'editableTable',
        name: 'editable-table',
        icon: 'edit',
        title: '可编辑表格',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/tables/editable-table.vue'], resolve)
        }
      },
      {
        path: 'searchableTable',
        name: 'searchable-table',
        icon: 'search',
        title: '可搜索表格',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/tables/searchable-table.vue'], resolve)
        }
      },
      {
        path: 'exportableTable',
        name: 'exportable-table',
        icon: 'code-download',
        title: '表格导出数据',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/tables/exportable-table.vue'], resolve)
        }
      },
      {
        path: 'table2image',
        name: 'table-to-image',
        icon: 'images',
        title: '表格转图片',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/tables/table-to-image.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/advanced-router',
    icon: 'ios-infinite',
    name: 'advanced-router',
    title: '高级路由',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'mutative-router',
        name: 'mutative-router',
        icon: 'link',
        title: '动态路由',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/advanced-router/mutative-router.vue'], resolve)
        }
      },
      {
        path: 'argument-page',
        name: 'argument-page',
        icon: 'android-send',
        title: '带参页面',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/advanced-router/argument-page.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/error-page',
    icon: 'android-sad',
    name: 'errorpage',
    title: '错误页面',
    meta: {requireAuth: true},
    component: Main,
    children: [
      {
        path: 'index',
        name: 'errorpage_index',
        title: '错误页面',
        meta: {requireAuth: true},
        component: resolve => {
          require(['@/views/error-page/error-page.vue'], resolve)
        }
      }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  preview,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
]
