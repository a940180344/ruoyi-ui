<template>
<!--  工作室申請審批-->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请状态" prop="start">
        <el-select v-model="queryParams.start" placeholder="请选择审批状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工作室名" prop="stioName">
        <el-input
          v-model="queryParams.stioName"
          placeholder="请输入工作室名"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="stioList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请状态" align="center" prop="start" >
        <template slot-scope="scope">
          <div v-if="scope.row.start == '协商' " > 协商 <el-button size="mini" type="primary" @click="xieShan(scope.row)">查 看</el-button> </div>
          <div v-else>
            <el-tag :type="scope.row.start | statusFilter">
              {{ scope.row.start }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="工作室名" align="center" prop="stioName" />
      <el-table-column label="工作室所属老师" align="center" prop="stioTeacher" >
      <template slot-scope="scope">
        {{getChangestudentId(scope.row.stioTeacher)}}
      </template>
      </el-table-column>
      <el-table-column  label="附件" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="downloadFujian(scope.row.stioReason)"
          >下载附件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="所属学院" align="center" prop="stioAcademy" />
      <el-table-column label="修改意见" align="center" prop="stioOpinion" />
      <el-table-column  label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.start == '待审批'||scope.row.start == '协商'">
          <el-button
            size="small"
            type="primary"
            @click="pass(scope.row)"
          >通过</el-button>
          <el-button
            size="small"
            type="danger"
            @click="juJueDig(scope.row)"
          >拒绝</el-button>
          <div v-if="scope.row.start == '通过' ">
            <strong>不可操作</strong>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.start == '待审批'||scope.row.start == '协商'">
          <el-button
            size="small"
            type="success"
            @click="xieShang(scope.row)"
          >协商</el-button>

          <el-button
            size="small"
            type="warning"
            @click="bohui(scope.row)"
          >驳回</el-button>
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

    <el-dialog title="拒绝" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form"  label-width="80px">
        <el-form-item label="拒绝理由">
          <el-input v-model="row.stioOpinion" placeholder="请输入拒绝理由" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="juJue">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog  :visible.sync="openXies" width="500px" append-to-body>
      <el-form  :model="XieSForm" label-width="80px">
        <el-form-item label="修改内容(审批人)" prop="xsContxtApper" >
          <el-input v-model="XieSForm.xsContxtApper" placeholder="请输入需要修改内容"  />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitXieS">确 定</el-button>
        <el-button @click="openXies = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog  :visible.sync="opens" width="500px" append-to-body>
      <el-form ref="form" :model="form"  label-width="80px">
        <el-form-item label="驳回理由">
          <el-input v-model="row.stioOpinion" placeholder="请输入驳回理由" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="overrule">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="协商记录" :visible.sync="Xieopen" width="800px" append-to-body>
      <el-timeline>
        <el-timeline-item v-for="(item) of XieList" :key="item.xsId" :timestamp="item.createTime" placement="top">
          <el-card>
            <div v-if="item.xsContxtApper != null">审批人： <el-input v-model="item.xsContxtApper" placeholder="请输入修改内容(审批人)" /></div>
            <br>
            <div v-if="item.xsFile != null">附件： <el-button @click="downloadFujian(item.xsFile)" size="mini" type="primary">点击 下载</el-button></div>
            <br>

            <div v-if="item.xsContxtTeacher != null">提交人： <el-input v-model="item.xsContxtTeacher" placeholder="请输入修改内容(提交人)" /></div>

          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { listStio, addStio,pass ,refuse,overrule} from "@/api/dept/stuPcosee";
import { listXs, getXs, delXs, addXs, updateXs } from "@/api/applications/xs/xs";
import {downloadFujian} from "@/utils/request";
import { listUsers} from "@/api/system/user";
export default {
  name: "Stio",
  dicts: ['sys_state'],
  filters: {
    statusFilter(status) {
      const statusMap = {
        '待审批': 'primary',
        '拒绝': 'danger',
        '协商': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listUsers:'',
      XieSForm: {},
      openXies:false,
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
      XieList:"",
      // studio表格数据
      Xieopen:false,
      stioList: [],
      // 弹出层标题
      title: "拒绝理由",
      // 是否显示弹出层
      open: false,
      opens: false,
      xieQueryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        hostId: null,
        xsContxtApper: null,
        xsFile: null,
        xsContxtTeacher: null,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        start: null,
        hostId: null,
        appOrder: null,
        stioName: null,
        stioTeacher: null,
        stioReason: null,
        stioAcademy: null,
        stioOpinion: null,
        stioAppover: null
      },
      // 表单参数
      form: {},
      row:'',
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    xieShan(item){
      this.xieQueryParams.hostId = item.hostId;
      this.xieQueryParams.id = item.id
      listXs(this.xieQueryParams).then(response => {
        this.Xieopen = true;
        console.log(response)
        this.XieList = response.rows;
      });
    },
    /** 查询studio列表 */
    downloadFujian(fujian){
      downloadFujian(fujian);
    },
    getList() {
      this.loading = true;
      listStio(this.queryParams).then(response => {
        this.stioList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
      listUsers().then(res=>{
        this.listUsers = res.rows
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    xieShang(row){
      this.XieSForm.id = row.id
      this.XieSForm.hostId = row.hostId
      this.openXies = true;
    },
    submitXieS(){
      addXs(this.XieSForm).then(response => {
        this.$modal.msgSuccess("提交成功");
        this.openXies = false;
        this.getList();
      });
    },
    /*用户字典
* */
    getChangestudentId(userId){
      let studentName ;
      for (let student of this.listUsers){
        if (student.userId == userId){
          studentName = student.nickName
        }
      }
      return studentName
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

    bohui(row){
      this.row = row
      this.opens = true
    },

    overrule(){
      overrule(this.row).then(response => {
        this.$modal.msgSuccess("驳回成功");
        this.getList();
      })
      this.opens = false
    },

    juJueDig(row){
      this.row = row
      this.open = true
    },
    juJue(){

      refuse(this.row).then(response => {
        this.$modal.msgSuccess("拒绝成功");
        this.getList();
      })
      this.open = false
    },
    /** 提交按钮 */
    pass(row) {
      console.log(row)
      pass(row).then(response => {
                this.$modal.msgSuccess("通过成功");
                this.getList();
              })
    },
  }
};
</script>
