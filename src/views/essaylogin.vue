<template>
  <div class="essayDetail">
    <div > <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                   background-color="red" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1">
        <div style="margin-top:20px"><h2 >阳光学院</h2></div>

      </el-menu-item>
      <el-menu-item index="2" ><img style="width: 28%;margin-left: -15px" src="./t0134cef1dc7561dc52.png" alt=""></el-menu-item>


      <div class="right-1">
        <el-menu-item index="7">
          <!--            <div @click="dialogVisible = true">-->
          <div @click="tiaohzuan">
            <i class="el-icon-s-custom" style="color: white"></i>
          </div>
        </el-menu-item>
      </div>

      <div class="right-1">
        <el-menu-item index="6" class="right-1">
          <i class="el-icon-mobile-phone"  style="color: white"></i>
        </el-menu-item>
      </div>

      <div class="right-1">
        <el-menu-item index="5" class="right-1">
          <i class="el-icon-bell" style="color: white"></i>
        </el-menu-item>
      </div>

      <div class="right-1">
        <el-menu-item index="4" class="right-1">

          <i class="el-icon-message" style="color: white" ></i>
        </el-menu-item>
      </div>

    </el-menu>
      <div class="essay">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ essayTitle }}</span>
          </div>
          <div class="ql-container ql-snow">
            <div class="ql-editor" v-html="orz_content">
            </div>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</template>

<script>
import { listEssay, getEssay, delEssay, addEssay, updateEssay } from "@/api/essay/essay";
export default {
name: "essayLogin",
  data(){
    return{
      essayId:'',
      essay:'',
      orz_content:'',
      essayTitle:""
    }
  },
  created() {
    this.essayId = this.$route.query.essayId;
    this.getList()
  },
  methods:{
    tiaohzuan(){
      this.$router.push({
        path: '/loginshouye',
      })
    },
    async getList(){
      const essayDate = await getEssay(this.essayId);
      console.log("1")
      this.essay = essayDate
      this.orz_content = essayDate.data.essayContent
      this.essayTitle = essayDate.data.essayTitle
      console.log(this.orz_content)
    }
  }

}
</script>

<style scoped>
.essay {
  width: 90%;
  margin: 0 auto;
}
.essay .box-card{
  height: 100%;
  width: 100%;
  margin: 50px auto;

}
.box-card {
  opacity: 0.85;
}

/* 顶部导航栏 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.8;
  line-height: 150px;
  margin: 0;
}

.right-1{
  float: right;
}
.essayDetail {
  background-image: url(./xuanchaunBack.jpg);
  background-attachment: fixed;
  background-size: 100%;

}
</style>
<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
