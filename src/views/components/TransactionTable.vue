<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="已获奖项目" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="工作室所属" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="获得奖项" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
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
      "order_no": "961be2cb-5ecB-A55b-A5ee-c3dA9FFAabeE",
      "timestamp": 734668220731,
      "username": "Laura Rodriguez",
      "price": 10182.7,
      "status": "success"
    },
    {
      "order_no": "C8cED883-AAE6-Aa55-A7c2-c21eA31EBFF7",
      "timestamp": 734668220731,
      "username": "Sandra Brown",
      "price": 10601.84,
      "status": "pending"
    },
    {
      "order_no": "5C9FE2AA-FE5B-6313-d6f3-535A08893b5F",
      "timestamp": 734668220731,
      "username": "Linda White",
      "price": 12926,
      "status": "pending"
    },
    {
      "order_no": "BA63Eefd-cf3a-b9b7-cE31-A2FBfAF3555E",
      "timestamp": 734668220731,
      "username": "John Lopez",
      "price": 8178.4,
      "status": "pending"
    },
    {
      "order_no": "E1FE6517-eEF8-D54B-7bAF-8EeDfa1D14c4",
      "timestamp": 734668220731,
      "username": "Melissa Thompson",
      "price": 14126.1,
      "status": "pending"
    },
    {
      "order_no": "533c746e-7fDF-d183-dd0e-EbDB59241bCe",
      "timestamp": 734668220731,
      "username": "Jeffrey Jones",
      "price": 10659.22,
      "status": "pending"
    },
    {
      "order_no": "688C15bA-BfD8-E415-cFCE-CfeC2FFf6ec0",
      "timestamp": 734668220731,
      "username": "Kenneth Hernandez",
      "price": 10364.3,
      "status": "success"
    },
    {
      "order_no": "22b6197E-Ec58-12d8-d2C7-b5F3bcCEe8AA",
      "timestamp": 734668220731,
      "username": "Mary Wilson",
      "price": 12558.3,
      "status": "success"
    },
    {
      "order_no": "7BD2AEe3-bE67-dFA1-2415-fB912adcc51d",
      "timestamp": 734668220731,
      "username": "Deborah Moore",
      "price": 11515.4,
      "status": "success"
    },
    {
      "order_no": "de1ffeCc-eDCe-8fEc-cF44-64c6edFB1B7b",
      "timestamp": 734668220731,
      "username": "James Gonzalez",
      "price": 14760.8,
      "status": "success"
    },
    {
      "order_no": "d7EdECF2-1AFd-5318-Ec2F-fC12c345850e",
      "timestamp": 734668220731,
      "username": "Edward White",
      "price": 7826.96,
      "status": "pending"
    },
    {
      "order_no": "E3eE8a8A-cd8C-27C2-DFDF-9bE521B607F4",
      "timestamp": 734668220731,
      "username": "Sarah Young",
      "price": 13105.6,
      "status": "success"
    },
    {
      "order_no": "C3f219bD-88bc-BBfd-BD8b-1Ed44DF16478",
      "timestamp": 734668220731,
      "username": "Jason Johnson",
      "price": 8582.32,
      "status": "success"
    },
    {
      "order_no": "AB4C5CBD-C898-7CCA-D346-DCBbDfEfd5aC",
      "timestamp": 734668220731,
      "username": "Brian Moore",
      "price": 1740.34,
      "status": "pending"
    },
    {
      "order_no": "5b72d1f3-2968-E660-fB3a-10AeDB0eBbCc",
      "timestamp": 734668220731,
      "username": "Lisa Martin",
      "price": 11147.8,
      "status": "success"
    },
    {
      "order_no": "3548D0A4-Ac91-D627-3cEf-A6FE1bEec7E4",
      "timestamp": 734668220731,
      "username": "John Davis",
      "price": 14350.8,
      "status": "pending"
    },
    {
      "order_no": "CfeB479E-93c2-5edE-9983-BaB4fED1a32E",
      "timestamp": 734668220731,
      "username": "Steven Lee",
      "price": 10175.78,
      "status": "success"
    },
    {
      "order_no": "c156dFeA-1fCB-04fC-9fbE-B8F4Adcdb441",
      "timestamp": 734668220731,
      "username": "Edward Lewis",
      "price": 3145.4,
      "status": "pending"
    },
    {
      "order_no": "c05e672B-cE55-eb95-dcf7-0DF0cB18d87F",
      "timestamp": 734668220731,
      "username": "Brenda Thompson",
      "price": 1429.4,
      "status": "pending"
    }]
    }
  },
  created() {
  },
  methods: {

  }
}
</script>
