<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名" prop="xmName">
        <el-input
          v-model="queryParams.xmName"
          placeholder="请输入项目名"
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
          v-hasPermi="['xm:xm:add']"
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
          v-hasPermi="['xm:xm:edit']"
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
          v-hasPermi="['xm:xm:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xm:xm:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="xmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="所在工作室名称" align="center" prop="studioName" />
      <el-table-column label="所在工作室id" align="center" prop="studioId" />
      <el-table-column label="项目名" align="center" prop="xmName" />
      <el-table-column label="项目成员" align="center" prop="xmUser" />
      <el-table-column label="文件" align="center" prop="wenjian" >
        <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="downloadFujian(scope.row.wenjian)"
            >下载附件</el-button>
        </template>
        </el-table-column>
      <el-table-column label="描述" align="center" prop="xmMiaosu" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xm:xm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xm:xm:remove']"
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

    <!-- 添加或修改xm对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="所在工作室名称" prop="studioName">
          <el-input v-model="form.studioName" placeholder="请输入所在工作室名称" disabled />
        </el-form-item>
        <el-form-item label="所在工作室id" prop="studioId">
          <el-input v-model="form.studioId" placeholder="请输入所在工作室id" disabled />
        </el-form-item>
        <el-form-item label="项目名" prop="xmName">
          <el-input v-model="form.xmName" placeholder="请输入项目名" />
        </el-form-item>
          <el-form-item label="项目成员" prop="xmUser">
              <el-select v-model="form.xmUser" multiple placeholder="请选择">
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
          <el-form-item label="文件">
          <file-upload v-model="form.wenjian"/>
        </el-form-item>
        <el-form-item label="描述">
          <editor v-model="form.xmMiaosu" :min-height="192"/>
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
import { listXm, getXm, delXm, addXm, updateXm } from "@/api/xm/xm";
import {dept} from "@/api/system/user";
import { mapGetters } from 'vuex'
import {downloadFujian} from "@/utils/request";
export default {
  name: "Xm",
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
      // xm表格数据
      xmList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studioName: null,
        studioId: null,
        xmName: null,
        xmUser: null,
        wenjian: null,
        xmMiaosu: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
        userList:[],
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
    this.getUser()
  },
  methods: {
    /** 查询xm列表 */
     getUser(){
        dept().then(res =>{
            const data = res;
            this.userList = data.rows
        })
    },
      downloadFujian(fujian){
          downloadFujian(fujian);
      },
    getList() {
      this.loading = true;
      listXm(this.queryParams).then(response => {
        this.xmList = response.rows;
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
        studioName: this.deptName,
        studioId: this.deptID,
        xmName: null,
        xmUser: [],
        wenjian: null,
        createBy: null,
        createTime: null,
        xmMiaosu: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
        this.queryParams.studioId = this.deptID;
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
      this.title = "添加xm";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getXm(id).then(response => {
        this.form = response.data;
        this.form.xmUser = this.form.xmUser.split(",");
        this.open = true;
        this.title = "修改xm";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.title == "添加xm"){
        this.form.state = "进行中"
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.xmUser = this.form.xmUser.join(",");
          if (this.form.id != null) {
            updateXm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXm(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除xm编号为"' + ids + '"的数据项？').then(function() {
        return delXm(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xm/xm/export', {
        ...this.queryParams
      }, `xm_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
