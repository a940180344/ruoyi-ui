<template>
    <div class="dashboard-editor-container">
      <el-card>
        <el-descriptions class="margin-top" title="工作室简介" :column="2" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              工作室名
            </template>
            {{form.deptName}}
<!--            {{ account }}-->
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-odometer"></i>
              创建时间
            </template>
            {{ form.createTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              人数
            </template>
            <el-tag size="small">{{ form.renshu }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message"></i>
              邮箱Email
            </template>
            {{ form.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号码
            </template>
            {{ form.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              学院
            </template>
            {{ form.xuey }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              创建人
            </template>
            {{ form.createBy }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-basketball"></i>
              工作室方向
            </template>
            {{ form.fangx }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-magic-stick"></i>
              宣传标语
            </template>
            {{ form.introduction }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-date"></i>
              其他信息
            </template>
            {{ createDate | formatDate }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                工作室总人数
                <!--            这个工作室的-->
              </div>
              <count-to :start-val="0" :end-val="form.renshu" :duration="2600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="message" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                工作室老师人数
              </div>
              <count-to :start-val="0" :end-val="form.teachershu" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                现项目数
              </div>
              <count-to :start-val="0" :end-val="form.xmushu" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('shoppings')">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="shopping" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待定
              </div>
              <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>

          <div class="text item">
            <el-col>
              <el-card>
                <div slot="header" class="clearfix">
                  <strong>工作室图片</strong>
                  <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                </div>
                <el-tabs v-model="activeTab">
                  <div v-if="studioId == 103">
                    <div> <img style="width: 1500px;" src="https://tse4-mm.cn.bing.net/th/id/OIP-C.nHqWRzgksJVaIiNZFg0_3wHaEo?w=302&h=188&c=7&r=0&o=5&pid=1.7" alt=""></div>
                    <div> <img src="https://img.zcool.cn/community/0171595add695aa801214a61e5ddbf.jpg@1280w_1l_2o_100sh.jpg" alt=""></div>
                  </div>
                  <div v-if="studioId != 103">
                    <div> <img style="width: 1500px;" src="https://img.zcool.cn/community/0117ba5685ed8632f8759f0404010b.jpg@1280w_1l_2o_100sh.jpg" alt=""></div>
                    <div> <img src="https://img.zcool.cn/community/01239f5a6fdcf9a80120a123d3195f.jpg@1280w_1l_2o_100sh.jpg" alt=""></div>
                  </div>
                </el-tabs>
              </el-card>
            </el-col>
          </div>

      </el-row>
    </div>
</template>
<script>
import CountTo from 'vue-count-to'
import PanelGroup from "@/views/studio/studioDetail/components/PanelGroup";
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
export default{
  name: "studiodetail",
  components:{
    CountTo,
    PanelGroup,
  },
  data(){
    return{
      img:"",
      studioId:'',
      form:{
      },
    }
  },
  created() {
    this.img = require('../../../images/1/1.png')
    this.studioId = this.$route.query.studioId;
    this.gegetDeptXq()
  },
  methods:{
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    gegetDeptXq(){
      getDept(this.studioId).then(res=>{
        this.form = res.data
        console.log(res.data.data)
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
<style scoped>
.img {
  width: 80px;
  height: 80px;
}

</style>

<style>

.essay {
  margin-top: 10px;
  flex-wrap: nowrap;
}

.ql-editor {
  float: right;
  margin-top: 30px;
}

.essayTitle {

  text-align: center;
  margin-top: -170px;
  color: brown;
}

.ql-editor p {
  margin-top: 10px;
  font-size: 18px;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

.github-corner {
  position: absolute;
  top: 0px;
  border: 0;
  right: 0;
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

</style>
