<template>
  <div id="app">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane v-for="item in processName" :label="item.name" :name="item.name" :key="item.id">
          <dragTreeTable
            :data="treeData"
            :onDrag="onTreeDataChange"
            fixed
            onlySameLevelCanDrag
            hightRowChange
            border>
          </dragTreeTable>
          <div style="float: right">
            <el-button @click="newRow">新增一行</el-button>
            <el-button>提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import dragTreeTable from "drag-tree-table";
export default {
  name: "app",
  data() {
    return {
      processName:[{
          name:'工作室纳新流程',
          id:0
        },
        {
          name:'工作室创建流程',
          id:1
        },
        {
          name:'工作室销毁流程',
          id:2
        }
      ],
      activeTab: '工作室纳新流程',
      treeData: {
        columns: [
          {
            type: 'checkbox',
            isContainChildren: true, //是否勾选子节点，默认false
            onChange: this.onCheck, // parmas selectRows
            title: '链接',
            field: 'url',
            width: 200,
            align: 'center'
          },
          {
            isContainChildren: true, //是否勾选子节点，默认false
            title: '顺序',
            field: 'order',
            width: 200,
            align: 'center'
          },
          {
            type: 'selection',
            title: '菜单名称',
            field: 'name',
            width: 200,
            align: 'center',
            formatter: (item) => {
              return '<a>'+item.name+'</a>'
            }
          },
          {
            title: '操作',
            type: 'action',
            width: 350,
            align: 'center',
            actions: [
              {
                text: '新增一行',
                onclick: (item) => {
                  // item是当前行的数据
                  this.treeData.lists.remove(item)
                  for (let i = 0;i < this.treeData.lists.length;i++) {
                    this.treeData.lists[i].id = i;
                    this.treeData.lists[i].order = i;
                  }
                  console.log(this.treeData)
                },
                formatter: (item) => {
                  return '<i>删除本行</i>'
                }
              }
            ]
          },
        ],
        lists:  [
          {
            "id":0,
            "parent_id":0,
            "order":0,
            "name":"教务老师审批",
            "uri":"/masd/ds",
            "open":true,
          },
          {
            "id":1,
            "parent_id":0,
            "order":1,
            "name":"工作室老师审批",
            "uri":"/masd/ds",
            "open":true,
            "lists":[]
          },
          {
            "id":2,
            "parent_id":0,
            "order":2,
            "name":"工作室老师审批2",
            "uri":"/masd/ds",
            "open":true,
            "lists":[]
          }
        ]
      }
    };
  },
  created() {

  },
  components: {
    dragTreeTable
  },
  methods: {
    onTreeDataChange(list) {
      this.treeData.lists = list;
    },
    newRow(){

      this.treeData.lists.push({
        "id":this.treeData.lists.length,
        "parent_id":0,
        "order":this.treeData.lists.length,
        "name":"工作室老师审批"+this.treeData.lists.length,
        "uri":"/masd/ds",
        "open":true,
        "lists":[]
      })
    }
  },
};
</script>
