<template>
  <div class="tab-container">



      <div v-for="(item) of apprList" style="margin-top: 40px;width: 1000px;text-align: center;margin-left: 250px">
        <el-card class="box-card" :span="10">
          <div slot="header" class="clearfix">
            <span>{{item.name}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="TiaoZh(item)">点击展示</el-button>
          </div>
          <div style="text-align: center">
            <el-steps :active="item.crrut" align-center>
              <el-step v-for="(sub) of item.subList" :title="sub.name" description=""></el-step>

            </el-steps>
          </div>
        </el-card>

      </div>



    <el-tabs v-model="activeTea" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="工作室申请" name="工作室申请">
        <keep-alive>
          <timeline/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="工作室销毁" name="工作室销毁">

      </el-tab-pane>
      <el-tab-pane label="纳新申请" name="纳新申请">
        <naxinTimeLine :naxin-list="naxinList"></naxinTimeLine>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import { listStio,addStio ,getInfoList} from "@/api/dept/stuPcosee";
import TabPane from './tabpanes/student/TabPane'
import Timeline from './tabpanes/teacher/Timeline'
import {dictionaryApplication,getByid,updataApplication,getAllUserApp} from  "@/api/applications/process"
import naxinTimeLine from '@/views/applications/tabpanes/teacher/naxinTimeLine'
import { listDept } from "@/api/system/dept";
export default {
  name: 'applications',
  components: { TabPane ,Timeline,naxinTimeLine},
  data() {
    return {

      tabTeaOptions: [
        { label: '工作室申请', key: '工作室申请' },
        { label: '项目组申请', key: '项目组申请' },
      ],
      createdTimes: 0,
      activeTea:'工作室申请',
      List:'',
      apprList:'',
      fujian:'',
      appList:['工作室申请','项目组申请'],
      naxinList:'',
      delStudioList:'',
      studioList:''
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
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

      const processData = await dictionaryApplication();
      this.appList  = processData.data
      // const appprDate = await getAllUserApp()
      await getAllUserApp().then(res=>{
        this.apprList = res.data
        for (let i = 0 ; i<res.data.length;i++){
          if (res.data[i].name == "纳新申请"){
            console.log(i)
            this.naxinList = res.data[i]
          }
          if (res.data[i].name == "工作室申请"){
            console.log(i)
            this.studioList = res.data[i]
          }
          if (res.data[i].name == "工作室销毁"){
            console.log(i)
            this.delStudioList = res.data[i]
          }
        }
      });



      const studioDate = await getInfoList();
      this.List = studioDate.data


      for (const item of processData.data) {
        this.tabTeaOptions.push({
          label: item.name, key: item.name
        })
      }
    },

    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    TiaoZh(item){
      this.activeTea = item.name
     console.log(item+"跳转成功");
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
