<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="免听申请.置换申请" prop="applyType">
        <el-select v-model="queryParams.applyType" placeholder="请选择免听申请.置换申请" clearable>
          <el-option
            v-for="dict in dict.type.sys_sq"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学号" prop="studentNumber">
        <el-input
          v-model="queryParams.studentNumber"
          placeholder="请输入学号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在工作室名称" prop="studioName">
        <el-input
          v-model="queryParams.studioName"
          placeholder="请输入所在工作室名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在工作室id" prop="studioId">
        <el-input
          v-model="queryParams.studioId"
          placeholder="请输入所在工作室id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程/学分名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入课程/学分名称"
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['coursespi:coursespi:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="coursespiList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="免听申请.置换申请" align="center" prop="applyType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_sq" :value="scope.row.applyType"/>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" align="center" prop="studentName" />
      <el-table-column label="学号" align="center" prop="studentNumber" />
      <el-table-column label="所在工作室名称" align="center" prop="studioName" />
      <el-table-column label="所在工作室id" align="center" prop="studioId" />
      <el-table-column label="申请免听课程开课单位" align="center" prop="courseUnit" />
      <el-table-column label="申请免听课程开课单位id" align="center" prop="courseUnitId" />
      <el-table-column label="自己在这个工作室工作的内容" align="center" prop="content" />
      <el-table-column label="课程/学分名称" align="center" prop="courseName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_ke" :value="scope.row.courseName"/>
        </template>
      </el-table-column>
      <el-table-column label="完成状态）" align="center" prop="finishStatus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <div v-if="scope.row.finishStatus == '待审批'">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="submitForm1(scope.row)"
            v-hasPermi="['coursespi:coursespi:edit']"
          >通过</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="submitForm2(scope.row)"
            v-hasPermi="['coursespi:coursespi:remove']"
          >拒绝</el-button>
            </div>
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

    <!-- 添加或修改coursespi对话框 -->
    <el-dialog :rules="rules" :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="免听申请.置换申请" prop="applyType">
          <el-select v-model="form.applyType" placeholder="请选择免听申请.置换申请">
            <el-option
              v-for="dict in dict.type.sys_sq"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input disabled v-model="form.studentName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="学号" prop="studentNumber">
          <el-input disabled v-model="form.studentNumber" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="所在工作室名称" prop="studioName">
          <el-input disabled v-model="form.studioName" placeholder="请输入所在工作室名称" />
        </el-form-item>
        <el-form-item label="所在工作室id" prop="studioId">
          <el-input disabled v-model="form.studioId" placeholder="请输入所在工作室id" />
        </el-form-item>
        <el-form-item label="申请免听课程开课单位" prop="courseUnit">
          <el-select v-model="form.courseUnit" placeholder="请选择申请免听课程开课单位">
            <el-option
              v-for="dict in dict.type.sys_danwei"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请免听课程开课单位id" prop="courseUnitId">
          <el-input v-model="form.courseUnitId" placeholder="请输入申请免听课程开课单位id" />
        </el-form-item>
        <el-form-item label="自己在这个工作室工作的内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="课程/学分名称" prop="courseName">
          <el-select v-model="form.courseName" placeholder="请选择课程/学分名称">
            <el-option
              v-for="dict in dict.type.sys_ke"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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
import { listCoursespi, getCoursespi, delCoursespi, addCoursespi, updateCoursespi } from "@/api/coursespi/coursespi";
import { addJifenspi, updateJifenspi } from '@/api/jifenspi/jifenspi'
import { mapGetters } from 'vuex'
export default {
  name: "Coursespi",
  dicts: ['sys_sq','sys_danwei','sys_ke'],
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
      // coursespi表格数据
      coursespiList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyType: null,
        studentName: null,
        studentNumber: null,
        studioName: null,
        studioId: null,
        courseUnit: null,
        courseUnitId: null,
        content: null,
        courseName: null,
        finishStatus: null
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        applyType: [
          { required: true, message: "免听申请.置换申请不能为空", trigger: "change" }
        ],
        studentName: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" }
        ],
        studentNumber: [
          { required: true, message: "学号不能为空", trigger: "blur" }
        ],
        studioName: [
          { required: true, message: "所在工作室名称不能为空", trigger: "blur" }
        ],
        studioId: [
          { required: true, message: "所在工作室id不能为空", trigger: "blur" }
        ],
        courseUnit: [
          { required: true, message: "申请免听课程开课单位不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "自己在这个工作室工作的内容不能为空", trigger: "blur" }
        ],
        courseName: [
          { required: true, message: "课程/学分名称不能为空", trigger: "blur" }
        ],
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
      'deptName',
      'academy',
      'grade',
      'translation',
    ])
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询coursespi列表 */
    getList() {
      this.loading = true;
      listCoursespi(this.queryParams).then(response => {
        this.coursespiList = response.rows;
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
        applyType: null,
        studentName: this.name,
        studentId: null,
        studentNumber: this.studentID,
        studioName: this.deptName,
        studioId: this.deptID,
        courseUnit: null,
        courseUnitId: null,
        content: null,
        courseName: null,
        deptId: null,
        createBy: null,
        createTime: null,
        finishStatus: null
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
      this.title = "添加coursespi";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCoursespi(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改coursespi";
      });
    },
      submitForm1(row) {
          this.form = row


          this.form.finishStatus = "通过"
          updateCoursespi(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.getList();
          });

      },
      submitForm2(row) {
          this.form = row
          if (this.form.id != null) {
              this.form.finishStatus = "拒绝"
              updateCoursespi(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
              });
          } else {
              updateCoursespi(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
              });
          }

      },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCoursespi(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCoursespi(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除coursespi编号为"' + ids + '"的数据项？').then(function() {
        return delCoursespi(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('coursespi/coursespi/export', {
        ...this.queryParams
      }, `coursespi_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
