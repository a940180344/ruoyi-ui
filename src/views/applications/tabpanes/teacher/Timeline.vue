<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item) of list" :key="item.appOrder" :timestamp="item.CreateTime" placement="top">
        <el-card>
          <strong v-if="item.start != '拒绝'" style="color: green;font-size: larger">{{ item.start }}</strong>
          <strong v-if="item.start == '拒绝'" style="color: red;font-size: larger">{{ item.start }}</strong>

          <p><strong> 审批人:</strong> {{ item.stioAppover }}</p>
          <div v-if="item.content != ''">
            <p style="color: red">{{item.stioOpinion}}</p>
          </div>
          <strong>{{item.time}}</strong>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { listStio,addStio ,getStudioList} from "@/api/dept/stuPcosee";
import {roleJiaoWu} from "@/api/applications/process";
export default {

  data() {
    return {
      timeline: [
        {
          timestamp: '教秘审批',
          title: '审批通过',
          prople:'审批人：linxxx ',
          time:'2019/4/20 20:46',
          content: ''
        },
        {
          timestamp: '院级审批',
          title: '审批通过',
          prople:'审批人：linxxx ',
          time:'2019/4/20 20:46',
          content: ''
        },
        {
          timestamp: '教务审批',
          title: '已拒绝',
          prople:'审批人：linxxx ',
          time:'2019/4/20 20:46',
          content: '缺少部分文件'
        }
      ],
      list:{
      "id": 6,
      "start": "通过",
      "hostId": 9,
      "appOrder": 1,
      "CreateTime": "2022-09-15",
      "stioName": "all工作室",
      "stioTeacher": 1,
      "stioReason": null,
      "stioAcademy": "继续教育学院",
      "stioOpinion": null,
      "stioAppover": 2,
      "createTime": "2022-09-15"},
      jiaoWu:''
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.getList()
  },
  methods: {
    async getList(){
      const studioDate = await getStudioList();
      this.list = studioDate.data

      const jiaoWuDate = await roleJiaoWu();
      this.jiaoWu = jiaoWuDate.data

      for (const studio of this.list) {
        for (const jiaowu of this.jiaoWu) {
          if(jiaowu.userId == studio.stioAppover){
            studio.stioAppover = jiaowu.nickName
          }

        }
      }
    },
  }
}
</script>
