<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="学生姓名" prop="studentName">
                <el-input
                    v-model="queryParams.studentName"
                    placeholder="请输入学生姓名"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="学生id" prop="studentId">
                <el-input
                    v-model="queryParams.studentId"
                    placeholder="请输入学生id"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="积分" prop="jifen">
                <el-input
                    v-model="queryParams.jifen"
                    placeholder="请输入积分"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="教务审批人员" prop="jiaowu">
                <el-input
                    v-model="queryParams.jiaowu"
                    placeholder="请输入教务审批人员"
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
                    v-hasPermi="['jifenspi:jifenspi:export']"
                >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jifenspiList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="id" align="center" prop="id" />
            <el-table-column label="学生姓名" align="center" prop="studentName" />
            <el-table-column label="学生id" align="center" prop="studentId" />
            <el-table-column label="积分" align="center" prop="jifen" />
            <el-table-column label="获奖材料" align="center" prop="cailiao" >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="downloadFujian(scope.row.cailiao)"
                    >下载附件</el-button>
                </template>
                </el-table-column>
            <el-table-column label="状态" align="center" prop="state" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <div v-if="scope.row.state == '待审批'">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="submitForm1(scope.row)"
                            v-hasPermi="['jifenspi:jifenspi:edit']"
                        >通过</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="submitForm2(scope.row)"
                            v-hasPermi="['jifenspi:jifenspi:remove']"
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

        <!-- 添加或修改jifenspi对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="学生姓名" prop="studentName">
                    <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
                </el-form-item>
                <el-form-item label="学生id" prop="studentId">
                    <el-input v-model="form.studentId" placeholder="请输入学生id" />
                </el-form-item>
                <el-form-item label="积分" prop="jifen">
                    <el-input v-model="form.jifen" placeholder="请输入积分" />
                </el-form-item>
                <el-form-item label="获奖材料">
                    <file-upload v-model="form.cailiao"/>
                </el-form-item>
                <el-form-item label="教务审批人员" prop="jiaowu">
                    <el-input v-model="form.jiaowu" placeholder="请输入教务审批人员" />
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
import { listJifenspi, getJifenspi, delJifenspi, addJifenspi, updateJifenspi } from "@/api/jifenspi/jifenspi";
import {downloadFujian} from "@/utils/request";
export default {
    name: "Jifenspi",
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
            // jifenspi表格数据
            jifenspiList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                studentName: null,
                studentId: null,
                jifen: null,
                cailiao: null,
                jiaowu: null,
                state: null
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
        downloadFujian(fujian){
            downloadFujian(fujian);
        },
        /** 查询jifenspi列表 */
        getList() {
            this.loading = true;
            listJifenspi(this.queryParams).then(response => {
                this.jifenspiList = response.rows;
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
                studentName: null,
                studentId: null,
                jifen: null,
                cailiao: null,
                createTime: null,
                jingsai: null,
                jiangxiang: null,
                jiaowu: null,
                state: null
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
            this.title = "添加jifenspi";
        },
        /** 修改按钮操作 */
        handleUpdateTong(row) {
            this.reset();
            const id = row.id || this.ids
            getJifenspi(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改jifenspi";
            });
        },
        /** 修改按钮操作 */
        handleUpdateJue(row) {
            this.reset();
            const id = row.id || this.ids
            getJifenspi(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改jifenspi";
            });
        },
        submitForm1(row) {
            this.form = row


                        this.form.state = "通过"
                        updateJifenspi(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.getList();
                        });

        },
        submitForm2(row) {
            this.form = row
                    if (this.form.id != null) {
                        this.form.state = "拒绝"
                        updateJifenspi(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addJifenspi(this.form).then(response => {
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
                        updateJifenspi(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addJifenspi(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除jifenspi编号为"' + ids + '"的数据项？').then(function() {
                return delJifenspi(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('jifenspi/jifenspi/export', {
                ...this.queryParams
            }, `jifenspi_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
