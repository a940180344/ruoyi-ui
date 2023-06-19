<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item) of list" :timestamp="item.CreateTime" placement="top">
        <el-card>
          <strong v-if="item.start == '通过'" style="color: green;font-size: larger">{{ item.start }}</strong>
          <strong v-if="item.start == '拒绝'" style="color: red;font-size: larger">{{ item.start }}</strong>
          <strong v-if="item.start == '驳回'" style="color: chocolate;font-size: larger">
              {{ item.start }}
            <el-button size="mini" type="primary" @click="sQing(item.id)">重新发起申请</el-button>
          </strong>

          <strong v-if="item.start == '协商'" style="color: cyan;font-size: larger">
            {{ item.start }}
            <el-button size="mini" type="primary" @click="addXs(item)">发 起</el-button>
          </strong>

          <strong v-if="item.start == '待审批'" style="color: orange;font-size: larger">{{ item.start }}</strong>

          <p><strong style="color:rebeccapurple"> 审批人:</strong> {{ getChangestudentId(item.stioAppover) }}</p>
          <div v-if="item.stioOpinion != null">
            <p style="color: red">拒绝理由：{{item.stioOpinion}}</p>
          </div>
          <p><strong>申请人：{{getChangestudentId(item.stioTeacher)}}</strong></p>
          <p><strong>工作室名：{{item.stioName}}</strong></p>
          <p><strong>附件：</strong>  <el-button @click="download(item.stioReason)">点击下载</el-button></p>
          <p><strong>学院：{{item.stioAcademy}}</strong></p>
          <strong>协商：<el-button size="mini" type="primary" @click="xieShan(item)"> 协商 记录</el-button></strong>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="修改内容(审批人)" prop="xsContxtApper" >
          <el-input v-model="form.xsContxtApper" placeholder="请输入修改内容(审批人)" disabled />
        </el-form-item>
        <el-form-item label="协商文件添加">
          <file-upload v-model="form.xsFile"/>
        </el-form-item>
        <el-form-item label="其他说明" prop="xsContxtTeacher">
          <el-input v-model="form.xsContxtTeacher" placeholder="其他说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="Xieopen" width="800px" append-to-body>
      <el-timeline>
        <el-timeline-item v-for="(item) of stioList" :key="item.xsId" :timestamp="item.createTime" placement="top">
          <el-card>
             <div v-if="item.xsContxtApper != null">审批人： <el-input v-model="item.xsContxtApper" placeholder="请输入修改内容(审批人)" /></div>
            <br>
             <div  v-if="item.xsContxtTeacher != null">附件： <el-button size="mini" type="primary" @click="downloadFujian(item.xsFile)" >点击 下载</el-button></div>
            <br>

            <div v-if="item.xsContxtTeacher != null">提交人： <el-input v-model="item.xsContxtTeacher" placeholder="请输入修改内容(提交人)" /></div>

          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <el-dialog title="重新提交" :visible.sync="chongXinTiJiao" width="800px" append-to-body>
      <el-form ref="formStudio" :model="formStudio" :rules="rules" label-width="80px">

        <el-form-item label="所属学院" prop="stioAcademy">
          <el-input v-model="formStudio.stioAcademy" placeholder="请输入所属学院" />
        </el-form-item>

        <el-form-item label="工作室名" prop="stioName">
          <el-input v-model="formStudio.stioName" placeholder="请输入工作室名" />
        </el-form-item>

        <el-form-item label="工作室所属老师" prop="stioTeacher">
          <el-input v-model="formStudio.stioTeacher" placeholder="请输入工作室所属老师" />
        </el-form-item>

        <el-form-item label="其他说明">
          <el-input v-model="formStudio.stioShuoming" placeholder="" />
        </el-form-item>

        <el-form-item label="工作室类型">
          <el-input v-model="formStudio.stioType" placeholder="" />
        </el-form-item>


        <el-form-item label="申请理由">
          <file-upload v-model="formStudio.stioReason" ref="upload" />
        </el-form-item>
      </el-form>
      <el-button @click="chongXinTiJiao = false">取 消</el-button>
      <el-button type="primary" @click="submitStudioForm">提 交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { listXs, getXs, delXs, addXs, updateXs } from "@/api/applications/xs/xs";
import {roleJiaoWu,studioAppInfo} from "@/api/applications/process";
import {downloadFujian} from "@/utils/request";
import { listUsers} from "@/api/system/user";
import { getStudio,updateStio } from '@/api/dept/stuPcosee'
export default {

  data() {
    return {
      chongXinTiJiao:false,
      formStudio: {
        hostId:null,
        stioAcademy:"人工智能学院",
        stioName:"xunl工作室",
        stioTeacher:"",
        stioReason:'',
        stioShuoming:null,
        stioType:null,
        ll:""
      },
      listUsers:'',
      rules: {

      },
      Xieopen:false,
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
      // 协商表格数据
      xsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        hostId: null,
        xsContxtApper: null,
        xsFile: null,
        xsContxtTeacher: null,
      },
      // 表单参数
      form: {},
      stioList:[
    {
      "xsId": 1,
      "id": 29,
      "hostId": 42,
      "xsContxtApper": "文件呢？",
      "xsFile": "0.txt",
      "xsContxtTeacher": null,
      "createTime": "2022-10-14T00:46:46.000+08:00"
    }
  ],
      timeline: [

      ],
      uploadFileUrl: process.env.VUE_APP_BASE_API,
      list:{
      "id": 6,
      "start": "通过",
      "hostId": 9,
      "appOrder": 1,
      "CreateTime": "2022-09-15",
      "stioName": "all工作室",
      "stioTeacher": 1,
      "stioReason": null,
      "stioAcademy": "继续教育学院",
      "stioOpinion": null,
      "stioAppover": 2,
      "createTime": "2022-09-15"
      },
      jiaoWu:'',
      serverAddress:this.$store.state.user.serverAddress
    }
  },
  created() {

    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.getList()
  },
  methods: {
    async getList(){
      const studioDate = await studioAppInfo();
      this.list = studioDate.data

      listUsers().then(res=>{
        this.listUsers = res.rows
      })
    },
    downloadFujian(fujian){
      downloadFujian(fujian);
    },
    addXs(row){
      this.form.id = row.id;
      this.form.hostId = row.hostId;
      this.open = true;
    },
    sQing(id){
      console.log(id)
      getStudio(id).then(res=>{
        this.formStudio = res.data
        this.chongXinTiJiao = true;
      })

    },
    submitStudioForm(){
      updateStio(this.formStudio).then(res=>{
        this.chongXinTiJiao = false;
        this.getList();
      })
    },
    download( fujian ){
      var fujians = fujian.split(",")
      for (const argument of fujians) {
        window.open(this.serverAddress+argument)
      }
    },
    cancel() {
      this.open = true;
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
      console.log(studentName)
      return studentName
    },
    // 表单重置
    reset() {
      this.form = {
        xsId: null,
        id: null,
        hostId: null,
        xsContxtApper: null,
        xsFile: null,
        xsContxtTeacher: null,
        createTime: null
      };
      this.resetForm("form");
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加协商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const xsId = row.xsId || this.ids
      getXs(xsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改协商";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.xsId != null) {
            updateXs(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXs(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    xieShan(item){
      this.queryParams.hostId = item.hostId;
      this.queryParams.id = item.id

      listXs(this.queryParams).then(response => {

        this.stioList = response.rows;
        this.Xieopen = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const xsIds = row.xsId || this.ids;
      this.$modal.confirm('是否确认删除协商编号为"' + xsIds + '"的数据项？').then(function() {
        return delXs(xsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xs/xs/export', {
        ...this.queryParams
      }, `xs_${new Date().getTime()}.xlsx`)
    },
  computed: {
  },
  }
}
</script>
