<template>
  <div class="app-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属进程id" prop="hostId">
          <el-input disabled v-model="form.hostId" placeholder="工作室废止" />
        </el-form-item>
        <el-form-item disabled label="工作室名" prop="delStioName">
          <el-input disabled v-model="form.delStioName" placeholder="请输入工作室名" />
        </el-form-item>
        <el-form-item label="附件">
          <file-upload v-model="form.delStioReason"/>
        </el-form-item>
        <el-form-item label="其他说明" prop="dekStioShuoming">
          <el-input v-model="form.dekStioShuoming" placeholder="请输入其他说明" />
        </el-form-item>
      </el-form>
        <el-button type="primary" @click="submitForm">确 定</el-button>
  </div>
</template>

<script>
import {  addDel_stio, updateDel_stio } from "@/api/applications/delStioAppli";
import {getArlDictionary} from "@/api/dept/dept";
export default {
  name: "Del_stio",
  data() {
    return {
      arlDictionary:'',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        hostId: null,
        delStioName: null,
        delStioReason: null,
        delStioAppover: null,
        dekStioShuoming: null,
        userId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getlist()
  },
  methods: {
    async getlist(){
      const arlDictionaryData = await getArlDictionary();
      this.arlDictionary = arlDictionaryData.data;

      for (const arlItem of this.arlDictionary) {
        if(arlItem.name == "工作室销毁"){
          this.form.hostId = arlItem.id;
        }
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        start: null,
        hostId: null,
        appOrder: null,
        delStioName: null,
        delStioReason: null,
        delStioOpinion: null,
        delStioAppover: null,
        dekStioShuoming: null,
        createTime: null,
        userId: null
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
         {
           addDel_stio(this.form).then(response => {
             this.$modal.msgSuccess("提交成功");
           });
          }
        }
      });
    },
  }
};
</script>
