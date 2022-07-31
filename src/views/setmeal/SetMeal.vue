<template>
    <div>
      <el-input placeholder="请输入你想要查询的套餐名称" v-model="Mealname"/>&nbsp;
      <el-button @click="selectByName" class="select">点击查询</el-button>

      <el-popover v-model:visible="visible" placement="top" :width="160">
        <p>你想要新加一份套餐吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="dialogVisible = true"
          >是的，我想要</el-button
          >
        </div>
        <template #reference>
          <el-button @click="visible = true">新增</el-button>
        </template>
      </el-popover>
      <!--新增套餐（遮罩层）-->
        <el-dialog v-model="dialogVisible" title="Tips" width="30%" draggable>
          <span>请输入你想要添加/修改的套餐信息吧</span>
          <br><br>
          <el-form
              label-width="100px"
              :model="newSetMeal"
              style="max-width: 460px"
          >
            <el-form-item label="套 餐 名 称">
              <el-input v-model="newSetMeal.meal_name" />
            </el-form-item>
            <el-form-item label="套 餐 价 格">
              <el-input v-model="newSetMeal.price" />
            </el-form-item>
            <el-form-item label="月 销 量">
              <el-input v-model="newSetMeal.sale" />
            </el-form-item>
            <el-form-item label="他 人 评 价">
              <el-input v-model="newSetMeal.description" />
            </el-form-item>
            <el-form-item label="口 味">
              <el-input v-model="newSetMeal.flavor" />
            </el-form-item>
            <el-form-item label="套 餐 内 容">
              <el-input v-model="newSetMeal.contain" />
            </el-form-item>
          </el-form>
          <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMeal"
        >提 交</el-button
        >
      </span>
          </template>
        </el-dialog>

      <!--主要展示界面-->
      <el-table :data="this.SetMeal">
        <el-table-column prop="meal_name" width="180" label="套餐名称"/>
        <el-table-column prop="description" label="套餐描述" />
        <el-table-column prop="price" label="套餐价格" />
        <el-table-column prop="sale" label="月销售量" />
        <el-table-column prop="flavor" label="口味" />
        <el-table-column prop="contain" label="套餐内容" />
        <el-table-column align="left">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
            >修改套餐</el-button
            >
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除套餐</el-button
            >
          </template>
        </el-table-column>
      </el-table>


    </div>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Main",

  data(){

    return{
      SetMeal:[],
      Mealname:"",//查询的套餐名称

      visible : false,
      dialogVisible:false,//新增可视化
      //新增的套餐数据
      newSetMeal:{meal_name:"", price:"", contain:"", description:"", sale:"", flavor:""}
    }
  },
  methods:{

    //模糊查询（通过套餐名称）
    selectByName(){
      if (this.Mealname=="")
      {
        console.log("输入的内容为：",this.Mealname)
        location.reload()
      }else {
        this.$api.SetMeal.findSetMeal(`/setMeal/selectByName/${this.Mealname}`)
            .then(res=>{
                  console.log("查询到的结果为：",res)
                  this.SetMeal = res
                },err=>{
                  console.log("查询失败",err)
                }
            )
        this.Mealname = ""

      }
      },

    //通过id查询到数据回显在更新框中
    handleEdit(row){
      if (confirm("确认要修改吗？")){
        this.dialogVisible = true
        console.log(row.id)
          this.$api.SetMeal.findById(`/setMeal/selectById/${row.id}`)
        .then(res=>{
              // newSetMeal:{meal_name:"", price:"", contain:"", description:"", sale:"", flavor:""}
          this.newSetMeal.meal_name = res.meal_name
          this.newSetMeal.price = res.price
          this.newSetMeal.contain = res.contain
          this.newSetMeal.description = res.description
          this.newSetMeal.sale = res.sale
          this.newSetMeal.flavor = res.flavor
          console.log("返回的数据为",res)
        },err=>{
          console.log("出错了",err)
            }
        )
      }else {

      }
    },


    //删除信息
    handleDelete(msg){
      if (confirm("确定要删除吗")){
        // console.log(msg)
        console.log("11111",msg.id)
        this.$api.SetMeal.deleteById("/setMeal/deleteById",msg.id)
        location.reload()
      }
    },

    //提交数据
    submitMeal(){
      let data = {meal_name:"", price:"", contain:"", description:"", sale:"", flavor:""}
      data.sale = this.newSetMeal.sale
      data.price = this.newSetMeal.price
      data.meal_name = this.newSetMeal.meal_name
      data.contain = this.newSetMeal.contain
      data.flavor = this.newSetMeal.flavor
      data.description = this.newSetMeal.description

      // console.log(this.newSetMeal)
      // console.log(data)
      this.dialogVisible = false
      this.$api.SetMeal.addMeal("/setMeal/insert",data)
      .then(res=>{
        console.log("11111")
        location.reload()
      },err=>{
        console.log("发生错误了",err)
          }
      )
    }

  },

  //页面开始时遍历数据
  mounted() {
    // this.$api.menu.findSetMeal("/setMeal")
    this.$api.SetMeal.findSetMeal("/setMeal")
    .then(res=>{
      console.log("获取套餐菜单成功")
      this.SetMeal = res
      console.log("返回的数据为：",res)
      },err=>{
        console.log("获取套餐失败")
        console.log(err)
        }
    )
  }


}
</script>

<style>
.select{
  display: block;
}
</style>