<template>
  <div class="app-container home dashboard-editor-container">
    <panel-group/>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { listEssayFabu, getEssayFabu } from '@/api/essay/essayFabu'
import PanelGroup from "@/views/components/PanelGroup";
import TodoList from "@/views/components/TodoList"
import TransactionTable from '@/views/components/TransactionTable'
export default {
  name: "Index",
  components:{
    PanelGroup,
    TodoList,
    TransactionTable
  },
  data() {
    return {


    }
  },
  created() {
  },
  methods: {
    async getList() {
      const dataProlist = await listEssayFabu();
      this.essayList = dataProlist.rows;
      console.log(this.essayList)
    },
    async getEssayContxt(essayId) {
      const dataEssayContxt = await getEssayFabu(essayId);
      this.essayContxt = dataEssayContxt.data.essayContent;
      this.essayContxtTitle = this.essayList[essayId - 1].essayTitle;

    }
  }
};
</script>
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
