<template>

  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="申请次数"
      width="85"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="Date">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="拒绝理由">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="审批人">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="Importance">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" />
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" width="95">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click=""
        >查看详情</el-button>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="状态" width="110">
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
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      list: [
        {
          "id": 3,
          "timestamp": "2021.09.01",
          "author": "Lisa",
          "reviewer": "Susan",
          "title": "Bsdgyxrq Humj Sakqkdnd Xvciwqf Yuub Sdwgy Zqldf Non Zgj Xotryxcdm",
          "content_short": "mock data",
          "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
          "forecast": 63.48,
          "importance": 2,
          "type": "CN",
          "status": "published",
          "display_time": "2004-04-02 20:51:24",
          "comment_disabled": true,
          "pageviews": 1518,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        },
        {
          "id": 4,
          "timestamp": "2021.09.01",
          "author": "Patricia",
          "reviewer": "Dorothy",
          "title": "Hrbibk Usytejbrx Ggsxreuq Vyiyrdubsk Dtoptt",
          "content_short": "mock data",
          "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
          "forecast": 77.12,
          "importance": 3,
          "type": "CN",
          "status": "published",
          "display_time": "1990-10-24 20:07:17",
          "comment_disabled": true,
          "pageviews": 1243,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        },
        {
          "id": 5,
          "timestamp": "2021.09.01",
          "author": "Margaret",
          "reviewer": "Timothy",
          "title": "Tygbgjjbt Xkts Lykhquy Sqbkun Lllzqc Tgmikx",
          "content_short": "mock data",
          "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
          "forecast": 56.24,
          "importance": 2,
          "type": "CN",
          "status": "published",
          "display_time": "2001-06-14 20:48:29",
          "comment_disabled": true,
          "pageviews": 4927,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        },
        {
          "id": 6,
          "timestamp": "2021.09.01",
          "author": "Robert",
          "reviewer": "Lisa",
          "title": "Ofxbo Hgyijmcpc Viptz Bdxenjgku Mhvpyr Mhe Gumkhxg Udsndn Uqzvzaivg",
          "content_short": "mock data",
          "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
          "forecast": 29.55,
          "importance": 2,
          "type": "CN",
          "status": "draft",
          "display_time": "2022-06-17 02:06:35",
          "comment_disabled": true,
          "pageviews": 2750,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        },
        {
          "id": 7,
          "timestamp": "2021.09.01",
          "author": "Susan",
          "reviewer": "Brian",
          "title": "Jhgcgilxq Ymn Xdeja Bsjaa Yhnbr Bsnfbtdlc Kjuoz Mkyryo Gavbtrb Mkqy",
          "content_short": "mock data",
          "content": "<p>I am testing data, I am testing data.</p><p><img src=\"https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943\"></p>",
          "forecast": 98.18,
          "importance": 1,
          "type": "CN",
          "status": "published",
          "display_time": "1973-04-09 15:54:22",
          "comment_disabled": true,
          "pageviews": 4436,
          "image_uri": "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          "platforms": [
            "a-platform"
          ]
        }
      ],
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {

  },
  methods: {
    getList() {

    }
  }
}
</script>

