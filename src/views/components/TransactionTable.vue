<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="已获奖项目" min-width="200" prop="order_no">
    </el-table-column>
    <el-table-column label="工作室所属" width="195" align="center" prop="username">
    </el-table-column>
    <el-table-column label="获得奖项" width="100" align="center" prop="status">
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list:[{
        "order_no": "机器人写字项目",
        "timestamp": 165342100832,
        "username": "Laura Rodriguez",
        "price": 8481.2,
        "status": "一等奖"
      }, {
        "order_no": "视频观看系统",
        "timestamp": 878935772913,
        "username": "名师工作室",
        "price": 7255.4,
        "status": "一等奖"
      }, {
        "order_no": "云在线旅游系统",
        "timestamp": 679244765983,
        "username": "名师工作室",
        "price": 12054.6,
        "status": "一等奖"
      }, {
        "order_no": "Project D",
        "timestamp": 452144501972,
        "username": "名师工作室",
        "price": 9129.1,
        "status": "二等奖"
      }, {
        "order_no": "Project E",
        "timestamp": 293613240275,
        "username": "蓝桥工作室",
        "price": 6230.3,
        "status": "二等奖"
      }, {
        "order_no": "Project F",
        "timestamp": 157882860991,
        "username": "蓝桥工作室",
        "price": 10670.9,
        "status": "二等奖"
      }, {
        "order_no": "Project G",
        "timestamp": 990607190151,
        "username": "Laura Rodriguez",
        "price": 15579.7,
        "status": "二等奖"
      }, {
        "order_no": "Project H",
        "timestamp": 784969471023,
        "username": "Laura Rodriguez",
        "price": 9911.8,
        "status": "三等奖"
      }, {
        "order_no": "Project I",
        "timestamp": 571816407441,
        "username": "Laura Rodriguez",
        "price": 12705.2,
        "status": "三等奖"
      }, {
        "order_no": "Project J",
        "timestamp": 469612446985,
        "username": "Laura Rodriguez",
        "price": 15358.6,
        "status": "三等奖"
      }]
    }
  },
  created() {
  },
  methods: {

  }
}
</script>
