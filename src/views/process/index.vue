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
          <el-button @click="newRow" type="primary">新增一行</el-button>
          <div style="float: right">

            <el-button @click="setProcess" type="warning">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>



    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="block">
        <span class="demonstration"><strong>选择流程控制对象：</strong></span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="demo-input-suffix">
          <Strong>菜单流程名：</Strong>
          <el-input
            placeholder="请输入内容"
            style="width: 220px;margin-top: 10px;margin-left: 40px"
            v-model="caiDan">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogProcess()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import dragTreeTable from "drag-tree-table";
import {dictionaryApplication,getByid,updataApplication} from  "@/api/applications/process"
export default {
  name: "app",
  data() {
    return {
      caiDan:'',
      props: { multiple: true },
      value: [],
      options: [{
        value: '104',
        label: '教务管理'
      }, {
        value: '105',
        label: '院长'
      }, {
        value: '106',
        label: '副院长'
      }],

      dialogVisible: false,
      processName:'',//工作室流程字典
      activeTab: '',
      activeId:'',
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
        ]
      },
      newRows:{
        id:'',
        host_id:0,
        order:'',
        name:'',
        uri:"/masd/ds",
        open:true,
        lists:[]
      },
      jiaoWuData:''
    };
  },
  watch:{
    async activeTab(newValue, oldValue){
      if(oldValue == '') return;
      for (const item of this.processName) {
        if(item.name == newValue){
          this.activeId = item.id;
        }
      }
        const list = await  getByid(this.activeId)
      this.treeData.lists = list.data
    }
  },
  created() {
      this.getList()
  },
  components: {
    dragTreeTable
  },
  methods: {
    async  getList(){
        const processData = await dictionaryApplication();
        this.processName  = processData.data
        this.activeTab = processData.data[0].name;

        const list = await getByid(processData.data[0].id)
        this.treeData.lists = list.data;


        this.jiaoWuData = [{
          "教务管理":104
        },{
          "院长":105
        },{
          "副院长":106
        }];


        console.log(list)
    },

    onTreeDataChange(list) {
      this.treeData.lists = list;
    },
    newRow(){
      this.dialogVisible = true;
      for (const jiaoWu of this.jiaoWuData) {
        let deptId = jiaoWu.userName.substring(0,4);
        for (const option of this.options) {
          console.log(jiaoWu)
          if(option.deptId == deptId){
            option.children.push(jiaoWu);
            continue;
          }
        }
      }

    },
    setProcess(){
      updataApplication(this.treeData.lists).then(response => {
        this.$modal.msgSuccess("修改成功");
      })
      this.getList();
    },

    dialogProcess(){

      let length = this.treeData.lists.length
      let userId
      let row = {
        id:length,
        host_id:this.treeData.lists[0].hostId,
        order:length,
        name:this.caiDan,
        roleId: this.value,
      }



      this.treeData.lists.push(row)
      this.dialogVisible = false;
    }
  },
};
</script>
