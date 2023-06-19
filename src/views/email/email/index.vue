<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="接收人" prop="jieshouuser">
        <el-input
          v-model="queryParams.jieshouuser"
          placeholder="请输入接收人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdds"
          v-hasPermi="['email:email:adds']"
        >群发</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['email:email:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['email:email:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['email:email:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="发送人" align="center" prop="fasonguser" />
      <el-table-column label="接收人" align="center" prop="jieshouuser" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="文件" align="center" prop="wenjian" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="downloadFujian(scope.row.wenjian)"
          >下载附件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['email:email:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['email:email:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改email对话框 -->
    <el-dialog :title="title" :visible.sync="opens" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改email对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接收人" prop="jieshouuser">
          <el-select v-model="form.jieshouuser"  placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.nickName"
              :value="item.nickName">
              <span style="float: left">{{ item.nickName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="申请文件">
          <file-upload v-model="form.wenjian"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFujian } from '@/utils/request'
import { listEmail, getEmail, delEmail, addEmail, updateEmail } from "@/api/email/email";
import { listUser } from '@/api/system/user'
import { mapGetters } from 'vuex'
export default {
  name: "Email",
  data() {
    return {
      userList:[],
      // 遮罩层
      opens:false,
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
      // email表格数据
      emailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fasonguser: null,
        jieshouuser: null,
        content: null,
        wenjian: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'studentID',//学号
      'deptID',
      'deptName',
      'academy',
      'grade',
      'translation',
    ])
  },
  created() {
    this.queryParams.fasonguser = this.name
    this.getUser()
    this.getList();
  },
  methods: {
    downloadFujian(fujian){
      downloadFujian(fujian);
    },
    getUser(){
      listUser().then(res =>{
        const data = res;
        this.userList = data.rows
      })
    },
    /** 查询email列表 */
    handleAdds(){
      this.reset();
      this.form.jieshouuser = "全部"
      this.opens = true;
      this.title = "群发email";
    },
    getList() {
      this.loading = true;
      listEmail(this.queryParams).then(response => {
        this.emailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        fasonguser: null,
        jieshouuser: null,
        content: null,
        createBy: null,
        createTime: null,
        wenjian: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加email";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEmail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改email";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.form.fasonguser = this.name
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEmail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.opens = false;
              this.getList();
            });
          } else {
            addEmail(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.opens = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除email编号为"' + ids + '"的数据项？').then(function() {
        return delEmail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('email/email/export', {
        ...this.queryParams
      }, `email_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
