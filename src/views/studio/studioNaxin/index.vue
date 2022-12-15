<template>
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
      <el-form-item label="新增人姓名" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入新增人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleList">搜索</el-button>
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
          v-hasPermi="['studio:naxin:add']"
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
          v-hasPermi="['studio:naxin:edit']"
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
          v-hasPermi="['studio:naxin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['studio:naxin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="naxinList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请状态" align="center" prop="start" >
        <template slot-scope="scope">
          <div v-if="scope.row.start == '协商' " > 协商 <el-button size="mini" type="primary" @click="xieShan(scope.row)">查 看</el-button> </div>
          <div v-else>
            {{scope.row.start}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="新增人姓名" align="center" prop="userId" >
        <template slot-scope="scope">
          {{getChangestudentId(scope.row.userId)}}
        </template>
      </el-table-column>
      <el-table-column label="申请工作室" align="center" prop="stioId" >
        <template slot-scope="scope">
          {{getChangeStioId(scope.row.stioId)}}
        </template>
      </el-table-column>
      <el-table-column label="申请文件" align="center" prop="naxinReason" >
        <el-button>点击下载</el-button>
      </el-table-column>
      <el-table-column label="个人简介" align="center" prop="naxinShuoming" />
      <el-table-column label="学习情况" align="center" prop="naxinQingk" />
      <el-table-column label="特长说明" align="center" prop="naxinTechang" />
      <el-table-column  label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.start == '待审批'||scope.row.start == '协商'">
          <el-button

            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="pass(scope.row)"
          >通过</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="juJueDig(scope.row)"
          >拒绝</el-button>

        </template>
        <template slot-scope="scope" v-if="scope.row.start == '通过'">
          <div>
            <strong style="color: red">不可操作</strong>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">


        <template slot-scope="scope" v-if="scope.row.start == '待审批'||scope.row.start == '协商'">

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="xieShang(scope.row)"
          >协商</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="bohui(scope.row)"
          >驳回</el-button>

        </template>
        <template slot-scope="scope" v-if="scope.row.start == '通过'">
          <div>
            <strong style="color: red">不可操作</strong>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button @click="lookForStuDetail(scope.row.userId)">查看详情</el-button>
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
    <el-dialog title="拒绝" :visible.sync="open" width="500px" append-to-body>
      <div slot="footer" class="dialog-footer">
        <p>確定拒絕該學生
        ？？</p>
        <el-button type="primary" @click="juJue">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNaxin,pass ,refuse,overrule } from "@/api/studio/studioNaxin";
import {listNaxin1} from "@/api/studio/naxin";
import { addXs, listXs } from '@/api/applications/xs/xs'
import {downloadFujian} from "@/utils/request";
import { listDept } from "@/api/system/dept";
import { listUsers} from "@/api/system/user";

export default {
  name: "Naxin",
  dicts: ['sys_xue_yuan', 'sys_user_sex', 'sys_ban','sys_state'],
  data() {
    return {
      listUsers:'',
      listDepts:'',
      XieSForm: {},
      openXies:false,
      XieList:"",
      // 遮罩层
      Xieopen:false,
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
      // naxin表格数据
      naxinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
      },
      jujueForm: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      xieQueryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        hostId: null,
        xsContxtApper: null,
        xsFile: null,
        xsContxtTeacher: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //查看学生详情
    lookForStuDetail(userId){
      this.$router.push({
        path:'/studio/studentdetail',
        query: { userId: userId },})
    },
    xieShan(item){
      this.xieQueryParams.hostId = item.hostId;
      this.xieQueryParams.id = item.id
      listXs(this.xieQueryParams).then(response => {
        this.Xieopen = true;
        console.log(response)
        this.XieList = response.rows;
      });
    },
    overrule(){
      overrule(this.row).then(response => {
        this.$modal.msgSuccess("驳回成功");
        this.getList();
      })
      this.opens = false
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
      });
    },
    downloadFujian(fujian){
      downloadFujian(fujian);
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
    /*部门字典
    * */
    getChangeStioId(studioId){
      let studioName ;
      for (let studio of this.listDepts){
        if (studio.deptId == studioId){
          studioName = studio.deptName
        }
      }
      return studioName
    },
    /** 提交按钮 */
    pass(row) {
      console.log(row)
      pass(row).then(response => {
        this.$modal.msgSuccess("通过成功");
        this.getList();
      })
    },
    /** 查询naxin列表 */
    getList() {
      this.loading = true;
      listNaxin(this.queryParams).then(response => {
        this.naxinList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
      listDept().then(res=>{
        this.listDepts = res.data
      })
      listUsers().then(res=>{
        this.listUsers = res.rows
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
        userId: null,
        stioId: null,
        naxinReason: null,
        naxinOpinion: null,
        naxinAppover: null,
        naxinShuoming: null,
        naxinQingk: null,
        naxinTechang: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    async  handleList(){
      this.queryParams.pageNum = 1;
       const list =  await listNaxin1(this.queryParams);
       console.log(list);
      this.naxinList = list.rows;
      this.total = list.total;
      // .then(response => {
      //   this.naxinList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
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
      this.title = "添加naxin";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNaxin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改naxin";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNaxin(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNaxin(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除naxin编号为"' + ids + '"的数据项？').then(function() {
        return delNaxin(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('studio/naxin/export', {
        ...this.queryParams
      }, `naxin_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
























<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="name" prop="dioName">-->
<!--        <el-input-->
<!--          v-model="queryParams.dioName"-->
<!--          placeholder="请输入name"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="学生学号" prop="dioStudentId">-->
<!--        <el-input-->
<!--          v-model="queryParams.dioStudentId"-->
<!--          placeholder="请输入学生学号"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['studio:studioNaxin:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['studio:studioNaxin:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

<!--    <el-table v-loading="loading" :data="studioNaxinList" @selection-change="handleSelectionChange">-->
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="id" align="center" prop="dioId" />-->
<!--      <el-table-column label="name" align="center" prop="dioName" />-->
<!--      <el-table-column label="学生学号" align="center" prop="dioStudentId" />-->
<!--      <el-table-column label="申请理由" align="center" prop="dioReason" />-->
<!--      <el-table-column label="工作室id" align="center" prop="dioStudioId" />-->
<!--      <el-table-column label="审批状态" align="center" prop="dioStarts" >-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag :type="scope.row.dioStarts | proStartsFilter">-->
<!--            {{ scope.row.dioStarts }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['studio:studioNaxin:edit']"-->
<!--          >拒绝</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['studio:studioNaxin:remove']"-->
<!--          >通过</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-position"-->
<!--            @click="studentDetailDig = true"-->
<!--            v-hasPermi="['studio:studioNaxin:remove']"-->
<!--          >详情</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-position"-->
<!--            @click="detailTiaoZhuan(scope.row.dioStudentId)"-->
<!--          >跳转</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    <pagination-->
<!--      v-show="total>0"-->
<!--      :total="total"-->
<!--      :page.sync="queryParams.pageNum"-->
<!--      :limit.sync="queryParams.pageSize"-->
<!--      @pagination="getList"-->
<!--    />-->

<!--    &lt;!&ndash; 添加或修改纳新对话框 &ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="80px">-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->

<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

<!--    <el-dialog-->
<!--      title="学生申请"-->
<!--      :visible.sync="studentDetailDig"-->
<!--      width="40%">-->
<!--      <el-form ref="form" :model="studentDetail"  label-width="80px">-->
<!--        <el-col >-->
<!--          <el-form-item label="名字" >-->
<!--            <el-input v-model="studentDetail.name"  disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="学号" >-->
<!--            <el-input v-model="studentDetail.studentId"   disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

<!--        <el-col :span="12">-->
<!--          <el-form-item label="性别" >-->
<!--            <el-input v-model="studentDetail.studentId"   disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

<!--        <el-col :span="12">-->
<!--          <el-form-item label="年纪" >-->
<!--            <el-input v-model="studentDetail.studentId"   disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

<!--        <el-col :span="12">-->
<!--          <el-form-item label="班级" >-->
<!--            <el-input v-model="studentDetail.studentId"  disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

<!--        <el-col >-->
<!--          <el-form-item label="学习情况" >-->
<!--            <el-input-->
<!--              type="textarea" :rows="3"  placeholder="请输入学习情况"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-form-item label="特长说明" >-->
<!--          <el-input-->
<!--            type="textarea" :rows="3"  placeholder="请输入特长说明"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="学习方向和期望" >-->
<!--          <el-input-->
<!--            type="textarea" :rows="3" v-model="studentDetail.reason"  placeholder="请输入学习方向和期望"/>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="个人简介" >-->
<!--          <el-input type="textarea" :rows="3" v-model="studentDetail.reason" placeholder="请输入个人简介" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="上传附件" prop="field102" required>-->
<!--          <el-upload ref="field102" :file-list="field102fileList" :action="field102Action"-->
<!--                     :before-upload="field102BeforeUpload">-->
<!--            <el-button size="small" type="primary" icon="el-icon-upload">点击下载</el-button>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button type="danger" @click="student = false" style="float: left">拒 绝</el-button>-->
<!--    <el-button @click="student = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="student = false">通 过</el-button>-->
<!--  </span>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { listStudioNaxin, getStudioNaxin, delStudioNaxin, addStudioNaxin, updateStudioNaxin } from "@/api/studio/studioNaxin";-->

<!--export default {-->
<!--  name: "StudioNaxin",-->
<!--  filters: {-->
<!--    proStartsFilter(proStarts) {-->
<!--      const statusMap = {-->
<!--        已完成: 'success',//已完成-->
<!--        执行中: '',//执行中-->
<!--        待负责人审批: 'warning'//队列中-->
<!--      }-->
<!--      return statusMap[proStarts]-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      studentDetail:[],-->
<!--      studentDetailDig:false,-->
<!--      dataPro:{},-->
<!--      // 遮罩层-->
<!--      loading: true,-->
<!--      // 选中数组-->
<!--      ids: [],-->
<!--      // 非单个禁用-->
<!--      single: true,-->
<!--      // 非多个禁用-->
<!--      multiple: true,-->
<!--      // 显示搜索条件-->
<!--      showSearch: true,-->
<!--      // 总条数-->
<!--      total: 0,-->
<!--      // 纳新表格数据-->
<!--      studioNaxinList: [-->
<!--      ],-->
<!--      // 弹出层标题-->
<!--      title: "",-->
<!--      // 是否显示弹出层-->
<!--      open: false,-->
<!--      // 查询参数-->
<!--      queryParams: {-->
<!--        pageNum: 1,-->
<!--        pageSize: 10,-->
<!--        dioId: null,-->
<!--        dioName: null,-->
<!--        dioStudentId: null,-->
<!--        dioReason: null,-->
<!--        dioStudioId: null,-->
<!--        dioStarts: null,-->
<!--        studioId:2-->
<!--      },-->
<!--      // 表单参数-->
<!--      form: {},-->
<!--      // 表单校验-->
<!--      rules: {-->
<!--        dioReason: [-->
<!--          { required: true, message: "申请理由不能为空", trigger: "blur" }-->
<!--        ],-->
<!--      }-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.getList();-->
<!--  },-->
<!--  methods: {-->
<!--    detailTiaoZhuan(studentId){-->
<!--      this.$router.push({-->
<!--        path: '/studio/studentdetail',-->
<!--        query: { studentId: studentId },-->
<!--      })-->
<!--    },-->
<!--    /** 查询纳新列表 */-->
<!--    getList() {-->
<!--      this.loading = true;-->
<!--      listStudioNaxin(this.queryParams).then(response => {-->
<!--        this.studioNaxinList = response.rows;-->
<!--        this.total = response.total;-->
<!--        this.loading = false;-->
<!--      });-->
<!--    },-->
<!--    // 取消按钮-->
<!--    cancel() {-->
<!--      this.open = false;-->
<!--      this.reset();-->
<!--    },-->
<!--    // 表单重置-->
<!--    reset() {-->
<!--      this.form = {-->
<!--        dioId: null,-->
<!--        dioName: null,-->
<!--        dioStudentId: null,-->
<!--        dioReason: null,-->
<!--        dioStudioId: null,-->
<!--        dioStarts: []-->
<!--      };-->
<!--      this.resetForm("form");-->
<!--    },-->
<!--    /** 搜索按钮操作 */-->
<!--    handleQuery() {-->
<!--      this.queryParams.pageNum = 1;-->
<!--      this.getList();-->
<!--    },-->
<!--    /** 重置按钮操作 */-->
<!--    resetQuery() {-->
<!--      this.resetForm("queryForm");-->
<!--      this.handleQuery();-->
<!--    },-->
<!--    // 多选框选中数据-->
<!--    handleSelectionChange(selection) {-->
<!--      this.ids = selection.map(item => item.dioId)-->
<!--      this.single = selection.length!==1-->
<!--      this.multiple = !selection.length-->
<!--    },-->
<!--    /** 新增按钮操作 */-->
<!--    handleAdd() {-->
<!--      this.reset();-->
<!--      this.open = true;-->
<!--      this.title = "添加纳新";-->
<!--    },-->
<!--    /** 修改按钮操作 */-->
<!--    handleUpdate(row) {-->
<!--      this.reset();-->
<!--      const dioId = row.dioId || this.ids-->
<!--      getStudioNaxin(dioId).then(response => {-->
<!--        this.form = response.data;-->
<!--        this.form.dioStarts = this.form.dioStarts.split(",");-->
<!--        this.open = true;-->
<!--        this.title = "修改纳新";-->
<!--      });-->
<!--    },-->
<!--    /** 提交按钮 */-->
<!--    submitForm() {-->
<!--      this.$refs["form"].validate(valid => {-->
<!--        if (valid) {-->
<!--          this.form.dioStarts = this.form.dioStarts.join(",");-->
<!--          if (this.form.dioId != null) {-->
<!--            updateStudioNaxin(this.form).then(response => {-->
<!--              this.$modal.msgSuccess("修改成功");-->
<!--              this.open = false;-->
<!--              this.getList();-->
<!--            });-->
<!--          } else {-->
<!--            addStudioNaxin(this.form).then(response => {-->
<!--              this.$modal.msgSuccess("新增成功");-->
<!--              this.open = false;-->
<!--              this.getList();-->
<!--            });-->
<!--          }-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    /** 删除按钮操作 */-->
<!--    handleDelete(row) {-->
<!--      const dioIds = row.dioId || this.ids;-->
<!--      this.$modal.confirm('是否确认删除纳新编号为"' + dioIds + '"的数据项？').then(function() {-->
<!--        return delStudioNaxin(dioIds);-->
<!--      }).then(() => {-->
<!--        this.getList();-->
<!--        this.$modal.msgSuccess("删除成功");-->
<!--      }).catch(() => {});-->
<!--    },-->
<!--    /** 导出按钮操作 */-->
<!--    handleExport() {-->
<!--      this.download('studio/studioNaxin/export', {-->
<!--        ...this.queryParams-->
<!--      }, `studioNaxin_${new Date().getTime()}.xlsx`)-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
