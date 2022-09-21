<template>
 <div class="app-container">
   <el-form ref="form" :model="form" :rules="rules" label-width="80px">
     <el-form-item label="所属进程id" prop="hostId">
       <el-input v-model="form.hostId" placeholder="请输入所属进程id" />
     </el-form-item>
     <el-form-item label="所属学院" prop="stioAcademy">
       <el-input v-model="form.stioAcademy" placeholder="请输入所属学院" />
     </el-form-item>
     <el-form-item label="工作室名" prop="stioName">
       <el-input v-model="form.stioName" placeholder="请输入工作室名" />
     </el-form-item>
     <el-form-item label="工作室所属老师" prop="stioTeacher">
       <el-input v-model="form.stioTeacher" placeholder="请输入工作室所属老师" />
     </el-form-item>
     <el-form-item label="申请理由">
       <file-upload v-model="form.stioReason"/>
     </el-form-item>
   </el-form>
   <el-button type="primary" @click="submitForm">提 交</el-button>
  </div>
  </template>
<script>
import {addStio} from "@/api/dept/stuPcosee";
import { mapGetters } from 'vuex'
export default{
  name: "",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // studio表格数据
      stioList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        hostId:31,
        stioAcademy:"人工智能",
        stioName:"xunl工作室",
        stioTeacher:"",
        stioReason:''
      },
      // 表单校验
      rules: {
      }
    };
  },
  methods: {
    submitForm() {
      addStio(this.form).then(response => {
        this.$modal.msgSuccess("新增成功");
      })
    }
  },
  created() {
    this.form.stioTeacher = this.userIn.userId;
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'studentID',//学号
      'deptID',
      'deptName',
      'userIn'
    ]),

  },
}
</script>
