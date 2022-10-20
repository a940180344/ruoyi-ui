<template>
 <div class="app-container">
   <el-form ref="form" :model="form" :rules="rules" label-width="80px">

     <el-form-item label="所属学院" prop="stioAcademy">
       <el-input v-model="form.stioAcademy" placeholder="请输入所属学院" />
     </el-form-item>

     <el-form-item label="工作室名" prop="stioName">
       <el-input v-model="form.stioName" placeholder="请输入工作室名" />
     </el-form-item>

     <el-form-item label="工作室所属老师" prop="stioTeacher">
       <el-input v-model="form.stioTeacher" placeholder="请输入工作室所属老师" />
     </el-form-item>

     <el-form-item label="其他说明">
       <el-input v-model="form.stioShuoming" placeholder="" />
     </el-form-item>

     <el-form-item label="工作室类型">
       <el-input v-model="form.stioType" placeholder="" />
     </el-form-item>

     <el-form-item label="申请理由">
       <file-upload v-model="form.stioReason" ref="upload" />
     </el-form-item>
   </el-form>
   <el-button type="primary" @click="submitForm">提 交</el-button>
  </div>
  </template>
<script>
import {addStio} from "@/api/dept/stuPcosee";
import {getArlDictionary} from "@/api/dept/dept";
import { mapGetters } from 'vuex'
export default{
  name: "",
  data() {
    return {
      arlDictionary:'',


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
      fileList:"",
      // 表单参数
      form: {
        hostId:null,
        stioAcademy:"人工智能学院",
        stioName:"xunl工作室",
        stioTeacher:"",
        stioReason:'',
        stioShuoming:null,
        stioType:null,
        ll:""
      },
      // 表单校验
      rules: {
      }
    };
  },
  methods: {
    async getList(){
      const arlDictionaryData = await getArlDictionary();
      this.arlDictionary = arlDictionaryData.data;

      for (const arlItem of this.arlDictionary) {
        if(arlItem.name == "工作室申请"){
           this.form.hostId = arlItem.id;
        }
      }
    },
    submitForm() {
      this.form.stioReason = this.form.stioReason.substring(0,this.form.stioReason.length-10);
      addStio(this.form).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.form = {
          hostId:null,
          stioAcademy:"人工智能学院",
          stioName:"xunl工作室",
          stioTeacher:"",
          stioReason:'',
          stioShuoming:null,
          stioType:null,
          ll:""
        }
      })

    }
  },
  created() {
    this.form.stioTeacher = this.userIn.userId;
    this.getList();

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
