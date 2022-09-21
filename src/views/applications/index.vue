<template>
  <div class="tab-container">
    <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />

    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-model="activeTea" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabTeaOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <timeline />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import { listStio,addStio } from "@/api/dept/stuPcosee";
import TabPane from './tabpanes/student/TabPane'
import Timeline from './tabpanes/teacher/Timeline'
export default {
  name: 'applications',
  components: { TabPane ,Timeline},
  data() {
    return {
      tabMapOptions: [
        { label: '情暖工作室', key: 'CN' },
        { label: '小林工作室', key: 'US' },
        { label: '琳琳工作室', key: 'JP' },
      ],
      tabTeaOptions: [
        { label: '工作室创建申请', key: 'CN' },
        { label: '项目组申请', key: 'US' },
      ],
      activeName: 'CN',
      createdTimes: 0,
      activeTea:'CN',
      List:''
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
      const studioDate = await listStio();
      this.List = studioDate.data
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
