<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h3>{{ item.title }}</h3>
          <p>{{ item.prople }}</p>
          <div v-if="item.content != ''">
            <p style="color: red">{{item.content}}</p>
          </div>
          <strong>{{item.time}}</strong>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
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
      ]
    }
  }
}
</script>
