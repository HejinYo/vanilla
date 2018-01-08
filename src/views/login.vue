<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="account" :rules="rules">
            <FormItem prop="username">
              <Input v-model="account.username" placeholder="请输入用户名">
              <span slot="prepend">
                       <Icon :size="16" type="person"></Icon>
                  </span>
              </Input>
            </FormItem>
            <FormItem prop="userpwd">
              <Input type="password" v-model="account.userpwd" placeholder="请输入密码">
              <span slot="prepend">
                     <Icon :size="14" type="locked"></Icon>
                  </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入正确的用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        account: {
          username: 'hejinyo',
          userpwd: '123456'
        },
        rules: {
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          userpwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$Notice.destroy()
            this.$http.post('/api/login', this.account)
              .then(response => {
                let {code, message, result} = response.data
                if (code === 1) {
                  this.$store.commit('login', result)
                  Cookies.set('user', this.account.username)
                  Cookies.set('password', this.account.userpwd)
                  this.$store.commit('setAvator', 'http://ow1prafcd.bkt.clouddn.com/hejinyo.jpg')
                  this.$router.replace({
                    path: decodeURIComponent(this.$route.query.redirect || '/home')
                  })
                } else {
                  this.$Message.info(message)
                }
              })
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less">
  @import './login.less';
</style>

