<template>
  <div class="app-container">

    <el-table v-loading="loading" :data="xmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="所在工作室名称" align="center" prop="studioName" />
      <el-table-column label="所在工作室id" align="center" prop="studioId" />
      <el-table-column label="项目名" align="center" prop="xmName" />
      <el-table-column label="项目成员" align="center" prop="xmUser" />
      <el-table-column label="描述" align="center" prop="xmMiaosu" />
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="积分" align="center" prop="jifen" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xm:xm:edit']"
          >分配积分</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div  v-for="(item, index) in jifenti">

        <el-form-item  :label="item.user" prop="xmUser">
          <el-col  span="18">
            <el-input v-model="item.jifen" placeholder="请输入积分"  />
          </el-col>
          <el-col span="4">
            <el-button type="primary" @click="fenpeiJifen(item.user,item.jifen)">提 交</el-button>
          </el-col>
        </el-form-item>

        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listXm, getXm, delXm, addXm, updateXm } from "@/api/xm/xm";
import { listJifen, getJifen, delJifen, addJifen, updateJifen } from "@/api/studio/jifen";
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
        xmMiaosu: null,
        state: '已完成',
        jifen: null
      },
      // 表单参数
      form: {},
      jifenform:{

      },
      // 表单校验
      rules: {
      },
      jifenti:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    fenpeiJifen(user,jifen){
      let data = {
        jifen:jifen,
        user:user,
        xmuming:this.form.xmName
      }
      addJifen(data).then(response => {
        this.$modal.msgSuccess("分配成功");
      });
    },
    /** 查询xm列表 */
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
        studioName: null,
        studioId: null,
        xmName: null,
        xmUser: null,
        wenjian: null,
        createBy: null,
        createTime: null,
        xmMiaosu: null,
        state: null,
        jifen: null
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
      this.title = "添加xm";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getXm(id).then(response => {
        this.form = response.data;
        this.form.xmUser = this.form.xmUser.split(',')
        for (const argument of this.form.xmUser) {
          let one = {
            user:argument,
            jifen:0,
          }
          this.jifenti.push(one)
        }

        this.open = true;
        this.title = "分配积分"
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
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
