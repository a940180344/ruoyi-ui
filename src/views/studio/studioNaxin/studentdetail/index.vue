<template>
  <div class="app-container">
    <div style="margin-left: 600px">
      <el-col :span="10" :xs="24">
        <user-card :user="user" />
      </el-col>
    </div>

  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import { getUser} from "@/api/system/user";
import { mapGetters } from 'vuex'
export default {
  name: "studentdetail",
  components:{UserCard,Timeline},
  data() {
    return{
      activeTab: 'timeline',
      userId:'',
      user:{
        userId:"",
        avatar:"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        email:"admin@test.com",
        name:"Super Admin",
        role:"admin",
      }
    }
  },
  methods:{

  },
  created() {
    this.userId = this.$route.query.userId;
    this.user.userId = this.userId
    console.log(this.userId)
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
}
</script>
