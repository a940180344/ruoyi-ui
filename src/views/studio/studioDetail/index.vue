<template>
    <div class="dashboard-editor-container">
      <el-card>
        <el-descriptions class="margin-top" title="工作室简介" :column="2" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              工作室名{{this.studioId}}
            </template>
<!--            {{ account }}-->
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-odometer"></i>
              创建时间
            </template>
            {{ age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              人数/总人数
            </template>
            <el-tag size="small">{{ sex }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message"></i>
              邮箱Email
            </template>
            {{ email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号码
            </template>
            {{ mobilePhoneNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              学院
            </template>
            {{ area }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              创建人
            </template>
            {{ work }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-basketball"></i>
              工作室方向
            </template>
            {{ hobby }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-magic-stick"></i>
              宣传标语
            </template>
            {{ design }}
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
      <panel-group/>
      <el-row>

          <div class="text item">
            <el-col>
              <el-card>
                <div slot="header" class="clearfix">
                  <strong>工作室3d图片</strong>
                  <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                </div>
                <el-tabs v-model="activeTab">
<!--                  后期v-for-->
                  <el-tab-pane label="大厅" name="timeline">
                    <timeline />
                  </el-tab-pane>
                  <el-tab-pane label="项目展览" name="activity一">
                    <activity />
                  </el-tab-pane>
                </el-tabs>
              </el-card>
            </el-col>
          </div>

      </el-row>

    </div>
</template>
<script>
import PanelGroup from "@/views/studio/studioDetail/components/PanelGroup";

export default{
  name: "studiodetail",
  components:{
    PanelGroup,
  },
  data(){
    return{
      studioId:''
    }
  },
  created() {
    this.studioId = this.$route.query.studioId;
  },
}

</script>
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
}
</style>
