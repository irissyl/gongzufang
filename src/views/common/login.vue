<template>
  <div>
    <section id="wrapper">
      <div class="login-main">
        <div id="logo">
          <p class="shadow"></p>
          <div class="logo">
            <img src="~@/assets/img/logo.svg" alt />
            <p class="zn">{{title}}</p>
            <!-- <p class="en">backstage management system</p> -->
          </div>
        </div>
        <div id="login">
          <h3 class="login-title">管理员登录</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
            style="width:350px"
          >
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="captcha">
				    <el-row :gutter="20">
				      <el-col :span="14">
				        <el-input v-model="dataForm.captcha" placeholder="验证码">
				        </el-input>
				      </el-col>
				      <el-col :span="10" class="login-captcha">
				        <img :src="captchaPath" @click="getCaptcha()" alt="">
				      </el-col>
				    </el-row>
            </el-form-item>-->
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
import {mapMutations} from 'vuex'
export default {
  data() {
    return {
	  url:process.env.VUE_APP_URL,
	  title:"和田公租房",
      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        captcha: ""
      },
      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        // captcha: [
        //   { required: true, message: '验证码不能为空', trigger: 'blur' }
        // ]
      },
      // captchaPath: ''
    };
  },
  created() {
		if(localStorage.getItem("username")||localStorage.getItem("password")){
			this.dataForm.userName=localStorage.getItem("username");
			this.dataForm.password=localStorage.getItem("password");
		}
		if(localStorage.getItem("title")){
			this.title=localStorage.getItem("title");
		}
    //this.getCaptcha()
  },
  mounted() {},
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
					let port={
              username: this.dataForm.userName,
              password: this.dataForm.password,
							grant_type: "password",
							client_id: "anlock_restful_client",
							client_secret: "anlock_secret_2018",
            }
					this.$cookie.set("token", "");
          this.$http.formData(this.url+"/iotwebapi/oauth/token",port)
            .then((res) => {
							console.log(res);
							if(res.resultCode==0){	
								this.$cookie.set("token", res.access_token);
								this.$cookie.set("account", this.dataForm.userName);
								localStorage.setItem("username",this.dataForm.userName);
								localStorage.setItem("password",this.dataForm.password);
								this.$router.replace({ name: "home" }); 
						
							}else if(res.resultCode==400){
								this.$message.error("账号或密码错误!");
							}else{
								this.$message.error(res.message);
							}
							
							// this.$http.get("/api/sys-manager/admin/getManagerInfo").then(({ data }) => {
							// 	this.$cookie.set("userInfo",JSON.stringify(data), "1d");
							// 	this.$router.replace({ name: "home" });  
							// })     
            });
        }
      });
    },
		...mapMutations({
			setUserId: "user/updateId",
		}),
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`
      );
    },
  },
};
</script>

<style scoped lang="scss">
#wrapper {
  width: 100vw;
  height: 100vh;
  background-image: url(~@/assets/img/login-bg.png);
  background-size: 100% 100%;
}
.login-main {
  width: 840px;
  height: 450px;
  display: flex;
  position: relative;
  left: calc(50% - 420px);
  top: 160px;
}
#logo {
  width: 420px;
  height: 450px;
  position: relative;
  .shadow {
    position: absolute;
    width: 420px;
    height: 450px;
    background-color: rgba(0, 121, 254, 0.8);
    left: 0px;
    top: 0px;
  }
  .logo {
    position: absolute;
    width: 420px;
    height: 450px;
    z-index: 1;
    font-size: 26px;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    img {
      width: 115px;
      height: 115px;
    }
    .zn {
      margin-top: 30px;
    }
    .en {
      margin-top: 6px;
      font-size: 20px;
      font-weight: 410;
    }
  }
}
#login {
  background: #fff;
  width: 420px;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    padding: 150px 60px 180px;
    width: 470px;
    min-height: 100%;
    background-color: #fff;
  }
  .login-title {
    font-size: 20px;
    color: #666;
    margin-bottom: 20px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
