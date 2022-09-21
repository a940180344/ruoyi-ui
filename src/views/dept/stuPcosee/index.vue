<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请状态" prop="start">
        <el-input
          v-model="queryParams.start"
          placeholder="请输入申请状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作室所属老师" prop="stioTeacher">
        <el-input
          v-model="queryParams.stioTeacher"
          placeholder="请输入工作室所属老师"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属学院" prop="stioAcademy">
        <el-input
          v-model="queryParams.stioAcademy"
          placeholder="请输入所属学院"
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
          v-hasPermi="['studio:stio:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['studio:stio:edit']"
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
          v-hasPermi="['studio:stio:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['studio:stio:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stioList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" />
      <el-table-column label="申请状态" align="center" prop="start" />
      <el-table-column label="所属进程id" align="center" prop="hostId" />
      <el-table-column label="当前进行到的进程" align="center" prop="appOrder" />
      <el-table-column label="工作室名" align="center" prop="stioName" />
      <el-table-column label="工作室所属老师" align="center" prop="stioTeacher" />
      <el-table-column label="申请理由" align="center" prop="stioReason" />
      <el-table-column label="所属学院" align="center" prop="stioAcademy" />
      <el-table-column label="修改意见" align="center" prop="stioOpinion" />
      <el-table-column label="审批人" align="center" prop="stioAppover" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >拒绝</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >驳回</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >通过</el-button>
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

    <!-- 添加或修改studio对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="申请状态" prop="start">
          <el-input v-model="form.start" placeholder="请输入申请状态" />
        </el-form-item>
        <el-form-item label="所属进程id" prop="hostId">
          <el-input v-model="form.hostId" placeholder="请输入所属进程id" />
        </el-form-item>
        <el-form-item label="当前进行到的进程" prop="appOrder">
          <el-input v-model="form.appOrder" placeholder="请输入当前进行到的进程" />
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
        <el-form-item label="所属学院" prop="stioAcademy">
          <el-input v-model="form.stioAcademy" placeholder="请输入所属学院" />
        </el-form-item>
        <el-form-item label="修改意见" prop="stioOpinion">
          <el-input v-model="form.stioOpinion" placeholder="请输入修改意见" />
        </el-form-item>
        <el-form-item label="审批人" prop="stioAppover">
          <el-input v-model="form.stioAppover" placeholder="请输入审批人" />
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
import { listStio,addStio } from "@/api/dept/stuPcosee";

export default {
  name: "Stio",
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
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询studio列表 */
    getList() {
      this.loading = true;
      listStio(this.queryParams).then(response => {
        this.stioList = response.data.records;
        this.total = response.data.total;
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
        start: null,
        createTime: null,
        hostId: null,
        appOrder: null,
        stioName: null,
        stioTeacher: null,
        stioReason: null,
        stioAcademy: null,
        stioOpinion: null,
        stioAppover: null
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
      this.title = "添加studio";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStio(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改studio";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStio(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStio(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除studio编号为"' + ids + '"的数据项？').then(function() {
        return delStio(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('studio/stio/export', {
        ...this.queryParams
      }, `stio_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
