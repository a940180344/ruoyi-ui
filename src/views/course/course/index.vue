<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="150px">
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
      <el-form-item   label="课程/学分名称" prop="courseName">
          <el-select filterable v-model="queryParams.courseName" placeholder="请输入课名称" clearable>
              <el-option
                  v-for="dict in dict.type.sys_ke"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
          </el-select>
      </el-form-item>
      <el-form-item label="完成状态" prop="finishStatus">
        <el-select v-model="queryParams.finishStatus" placeholder="请选择完成状态）" clearable>
          <el-option
            v-for="dict in dict.type.sys_klll"
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
          v-hasPermi="['course:course:add']"
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
          v-hasPermi="['course:course:edit']"
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
          v-hasPermi="['course:course:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['course:course:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
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
        <el-table-column label="置换积分数" align="center" prop="courseUnitId" />
      <el-table-column label="自己在这个工作室工作的内容" align="center" prop="content" />
      <el-table-column label="课程/学分名称" align="center" prop="courseName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_ke" :value="scope.row.courseName"/>
        </template>
      </el-table-column>
      <el-table-column label="完成状态）" align="center" prop="finishStatus">

      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['course:course:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['course:course:remove']"
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

    <!-- 添加或修改course对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
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
        <el-form-item   label="课程/学分名称" prop="courseName">
          <el-select filterable v-model="form.courseName" placeholder="请输入课名称" clearable>
            <el-option
              v-for="dict in dict.type.sys_ke"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
          <el-col :span="12">
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="form.studentName" placeholder="请输入学生姓名" disabled />
        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="学号" prop="studentNumber">
              <el-input v-model="form.studentNumber" placeholder="请输入学号" disabled />
            </el-form-item>
          </el-col>
          <el-col>

        <el-form-item  label="所在工作室名称" prop="studioName">
          <el-input v-model="form.studioName" placeholder="请输入所在工作室名称" disabled />
        </el-form-item>
          </el-col>
          <el-col >
        <el-form-item label="所在工作室id" prop="studioId">
          <el-input v-model="form.studioId" placeholder="请输入所在工作室id" disabled />
        </el-form-item>
          </el-col>
        <el-form-item label="课程开课单位" prop="courseUnit">
          <el-input v-model="form.courseUnit" placeholder="请输入申请免听课程开课单位" />
        </el-form-item>
          <el-form-item label="置换积分数" prop="courseUnit">
              <el-input v-model="form.courseUnitId" placeholder="" />
          </el-form-item>
        <el-form-item label="自己在这个工作室工作的内容">
          <editor v-model="form.content" :min-height="192"/>
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
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/course/course";
import { mapGetters } from 'vuex'
export default {
  name: "Course",
  dicts: ['sys_sq', 'sys_klll','sys_ke'],
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
      // course表格数据
      courseList: [],
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
        studentId: null,
        studentNumber: null,
        studioName: null,
        studioId: null,
        courseUnit: null,
        courseUnitId: null,
        content: null,
        courseName: null,
        deptId: null,
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
    /** 查询course列表 */
    getList() {
      this.loading = true;
      listCourse(this.queryParams).then(response => {
        this.courseList = response.rows;
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
      this.title = "添加course";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCourse(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改course";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.form.finishStatus = "待审批"
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCourse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCourse(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除course编号为"' + ids + '"的数据项？').then(function() {
        return delCourse(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('course/course/export', {
        ...this.queryParams
      }, `course_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
