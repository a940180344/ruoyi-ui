<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="essayTitle">
        <el-input
          v-model="queryParams.essayTitle"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章标签" prop="essayTag">
        <el-select v-model="queryParams.essayTag" placeholder="请选择文章标签" clearable>
          <el-option
            v-for="dict in dict.type.sys_essay_tag"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['essay:essay:add']"
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
          v-hasPermi="['essay:essay:edit']"
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
          v-hasPermi="['essay:essay:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['essay:essay:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="essayList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="essayId" />
      <el-table-column label="标题" align="center" prop="essayTitle" />
      <el-table-column label="文章标签" align="center" prop="essayTag">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_essay_tag" :value="scope.row.essayTag"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['essay:essay:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['essay:essay:remove']"
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

    <!-- 添加或修改发布文章对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="内容">
          <editor v-model="form.essayContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="标题" prop="essayTitle">
          <el-input v-model="form.essayTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="文章标签">
          <el-radio-group v-model="form.essayTag">
            <el-radio
              v-for="dict in dict.type.sys_essay_tag"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listEssay, getEssay, delEssay, addEssay, updateEssay } from "@/api/essay/essay";
import { mapGetters } from 'vuex'
export default {
  name: "Essay",
  dicts: ['sys_essay_tag'],
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
      // 发布文章表格数据
      essayList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        essayContent: null,
        essayTitle: null,
        essayTag: null,
        essaySource: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'studentID',//学号
      'deptID',
      'deptName'
    ])
  },
  created() {

    this.getList();
  },
  methods: {
    /** 查询发布文章列表 */
    getList() {
      this.loading = true;
      listEssay(this.queryParams).then(response => {
        this.essayList = response.rows;
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
        essayId: null,
        essayContent: null,
        essayTitle: null,
        essayTag: "0",
        essaySource: null,
        createTime: null,
        createBy: null
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
      this.ids = selection.map(item => item.essayId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加发布文章";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const essayId = row.essayId || this.ids
      getEssay(essayId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改发布文章";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if(this.form.essayTag == "工作室动态"){
        this.form.essaySource = this.deptName;
      }

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.essayId != null) {
            updateEssay(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEssay(this.form).then(response => {
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
      const essayIds = row.essayId || this.ids;
      this.$modal.confirm('是否确认删除发布文章编号为"' + essayIds + '"的数据项？').then(function() {
        return delEssay(essayIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('essay/essay/export', {
        ...this.queryParams
      }, `essay_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
