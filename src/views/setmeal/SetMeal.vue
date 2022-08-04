<template>
    <el-input placeholder="请输入你想要查询的套餐名称" v-model="Mealname"/>&nbsp;
    <el-button @click="selectByName" class="select">点击查询</el-button>

    <el-popover v-model:visible="visible" placement="top" :width="160" v-if="roleFunction">
      <p>你想要新加一份套餐吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="small" text @click="visible = false">取消</el-button>
        <el-button size="small" type="primary" @click="m1"
        >是的，我想要</el-button
        >
      </div>
      <template #reference>
        <el-button @click="visible = true">新增</el-button>
      </template>
    </el-popover>
    <!--新增套餐（遮罩层）-->
    <el-dialog v-model="dialogVisible" title="Tips" width="30%" draggable>
      <span>请输入你想要添加的套餐信息吧</span>
      <br><br>
      <el-form
          label-width="100px"
          :model="newList"
          style="max-width: 460px"
      >
        <el-form-item label="套 餐 名 称">
          <el-input v-model="newList.name" />
        </el-form-item>
        <el-form-item label="套 餐 价 格">
          <el-input v-model="newList.price" />
        </el-form-item>
        <el-form-item label="月 销 量">
          <el-input v-model="newList.sale" />
        </el-form-item>
        <el-form-item label="他 人 评 价">
          <el-input v-model="newList.description" />
        </el-form-item>
        <el-form-item label="口 味">
          <el-input v-model="newList.flavor" />
        </el-form-item>
        <el-form-item label="套 餐 图 片">
          <el-select v-model="value" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in imageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-image style="width: 100px; height: 100px" :src="this.value" fit="cover" v-show="value" alt="图片暂时没有加载出来哦"/>
        </el-form-item>
        <el-form-item label="套 餐 内 容">
          <el-checkbox-group
              v-model="goodsValue"
              @change="handleCheckedCitiesChange($event)"
          >
            <el-checkbox v-for="good in goods" :key="goods.id" :label="good.name" :model-value="good">{{
                good.name
              }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="额 外 添 加：">
          <el-input v-model="newList.contain" />
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

    <!--更新套餐（遮罩层）-->
    <el-dialog v-model="updateVisible" title="Tips" width="30%" draggable>
      <span>请输入你想要修改的套餐信息吧</span>
      <br><br>
      <el-form
          label-width="100px"
          :model="newSetMeal"
          style="max-width: 460px"
      >
        <el-form-item label="套 餐 名 称">
          <el-input v-model="newList.name" />
        </el-form-item>
        <el-form-item label="套 餐 价 格">
          <el-input v-model="newList.price" />
        </el-form-item>
        <el-form-item label="月 销 量">
          <el-input v-model="newList.sale" />
        </el-form-item>
        <el-form-item label="他 人 评 价">
          <el-input v-model="newList.description" />
        </el-form-item>
        <el-form-item label="口 味">
          <el-input v-model="newList.flavor" />
        </el-form-item>
<!--        <el-form-item label="套 餐 内 容">-->
<!--          <el-input v-model="newList.contain" />-->
<!--        </el-form-item>-->
        <el-form-item label="套 餐 图 片">
          <el-select v-model="value" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in imageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-image style="width: 100px; height: 100px" :src="this.value" fit="cover" alt="图片暂时没有加载出来哦"/>
        </el-form-item>
        <el-form-item label="套 餐 内 容">
          <el-checkbox-group
              v-model="goodsValue"
              @change="handleCheckedCitiesChange($event)"
          >
            <el-checkbox v-for="good in goods" :key="goods.id" :label="good.name" :model-value="good">{{
                good.name
              }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="原 有 内 容：">
          <el-input v-model="newList.contain" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMeal"
        >提 交</el-button
        >
      </span>
      </template>
    </el-dialog>


    <!--主要展示界面-->
    <!--max-height="580"-->
    <el-table :data="list">
      <el-table-column label="参 考 图 片" prop="picture">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.picture" fit="cover" alt="图片暂时没有加载出来哦"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="套 餐 名 称"/>
      <el-table-column prop="description" label="套 餐 描 述" />
      <el-table-column prop="price" label="套 餐 价 格" />
      <el-table-column prop="sale" label="月 销 售 量" />
      <el-table-column prop="flavor" label="口 味" />
      <el-table-column prop="contain" label="套 餐 内 容" />
      <el-table-column align="left" fixed="right" v-if="roleFunction">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
          >修改套餐
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              style="margin: 10px 0 0 0"
          >删除套餐</el-button
          >
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalPage"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleSizeChange"
      />
</template>
<script>
import {toRaw} from "vue";
import {ElMessage} from "element-plus";
export default {
  name: "Main",
  data(){
    return{
      list:[],//查询返回的套餐列表
      Mealname:"",//查询的套餐名称
      updateVisible:false,
      visible : false,
      dialogVisible:false,//新增可视化
      //新增的套餐数据
      newList:{id:"",name:"", price:"", contain:"", description:"", sale:"", flavor:"",picture:""},
      mode:{},
      file:"",
      modeList:[],
      //这些是与图片相关的,选择器（选择套餐图片的样式）
      value:"",
      imageList:[
        {
          value:"https://s2.loli.net/2022/08/02/OEPktUJ1aZWoHbV.png",
          label:"套餐1"
        },
        {
          value:"https://s2.loli.net/2022/08/02/DKLyhJH7aUfdGTz.png",
          label:"套餐2"
        },
        {
          value:"https://s2.loli.net/2022/08/02/B9Ni8Z7Yh1v6xIH.png",
          label:"套餐3"
        },
        {
          value:"https://s2.loli.net/2022/08/02/apqzbBIDWJRCMgw.png",
          label:"套餐4"
        },
        {
          value: "https://s2.loli.net/2022/08/02/MhJSiaqb36YFtyp.png",
          label: "套餐5"
        },
        {
          value: "https://s2.loli.net/2022/08/02/hStp3TeylELDrNn.png",
          label: "套餐6"
        },
        {
          value: "https://s2.loli.net/2022/08/02/jN5SdIrYc8FHQfe.png",
          label: "套餐7"
        },
      ],
      roleFunction : true,//判断用户是否有权限来显示功能操作
      goods:[
      ],
      goodsValue:[],
      uploadValue:"",

      currentPage:1,
      totalPage:20,
      pageSize: 4,
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
                  this.list = res.data
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
        this.goodsValue=[]
        this.updateVisible = true
        console.log(row.id)
        this.$api.SetMeal.findById(`/setMeal/selectById/${row.id}`)
            .then(res=>{
                  this.newList.id = res.id
                  this.newList.name = res.name
                  this.newList.price = res.price
                  this.newList.contain = res.contain
                  this.newList.description = res.description
                  this.newList.sale = res.sale
                  this.newList.flavor = res.flavor
                  this.value = res.picture
                  console.log("返回的数据为",res)
                },err=>{
                  console.log("出错了",err)
                }
            )
      }
    },
    //删除信息
    handleDelete(msg){
      if (confirm("确定要删除吗")){
        // console.log(msg)
        console.log("11111",msg.id)
        this.$api.SetMeal.deleteById("/setMeal/deleteById",msg.id)
        .then(res=>{
          console.log("返回的结果为：",res)
        })
        location.reload()
      }
    },
    //提交数据
    submitMeal() {
      let data = {name: "", price: "", contain: "", description: "", sale: "", flavor: "",picture:""}
      if (this.newList.sale == null || this.newList.name==null || this.newList.price==null ){
          ElMessage({
            message:"信息没有填写完全喔",
            type:"warning"
          })
      }
      else {
        data.sale = this.newList.sale
        data.price = this.newList.price
        data.name = this.newList.name
        data.contain = this.uploadValue+'、'+this.newList.contain
        // console.log("结合起来的数据为：",data.contain)
        data.contain = this.uploadValue
        data.flavor = this.newList.flavor
        data.description = this.newList.description
        console.log(this.value)
        data.picture = this.value
        this.dialogVisible = false
        this.$api.SetMeal.addMeal("/setMeal/insert",data)
            .then(res=>{
                  console.log("11111")
                  ElMessage({
                    message:"提交成功",
                    type:'success'
                  })
                  location.reload()
                },err=>{
                  console.log("发生错误了",err)
                }
            )
      }
    },
    //更新数据
    updateMeal(){
      console.log(this.uploadValue)
      let data = {id:"" ,name: "", price: "", contain: "", description: "", sale: "", flavor: "",picture:""}
      data.id = this.newList.id
      data.sale = this.newList.sale
      data.price = this.newList.price
      data.name = this.newList.name
      data.contain = this.uploadValue+ '、'+ this.newList.contain
      data.flavor = this.newList.flavor
      data.description = this.newList.description
      data.picture = this.value
        this.dialogVisible = false
        this.$api.SetMeal.addMeal("/setMeal/update",data)
            .then(res=>{
                  console.log("22222")
              console.log(res)
                  ElMessage({
                    message:"修改成功",
                    type:'success'
                  })
                  location.reload()
                },err=>{
                  console.log("发生错误了",err)
                }
            )

    },
    m1(){
      this.dialogVisible = true
      this.newList=[]
      this.value =""
      this.goodsValue = []
    },
    //多选框发生变化调用方法
    handleCheckedCitiesChange(event){
      const m2 = toRaw(event)
      console.log("m2的值为",m2)
      let m1 = event.join('、')
      console.log("m1的值为",m1)
      this.uploadValue = m1
      console.log(this.uploadValue)
    },

    handleSizeChange(val){
      this.currentPage = val
      this.$api.SetMeal.findSetMeal(`/setMeal/page/${this.currentPage}/${this.pageSize}`)
        .then(res=>{
          this.list = res.data.rows
          console.log("返回的数据为11111",res.data)
        })
    }
  },
  //页面开始时遍历数据
  mounted() {
    this.$api.SetMeal.findSetMeal(`/setMeal/page/${1}/${4}`)
        .then(res=>{
              console.log("挂载返回的数据为：",res)
              // this.list = res.data
           this.list = res.data.rows
            console.log(res.data.length)
            this.totalPage = res.data.totalCount
            let role = sessionStorage.getItem("username")
            if (role!="admin"){
              this.roleFunction = false
            }
          },err=>{
            console.log("获取套餐失败")
            console.log(err)
          }
        );
    this.$api.goods.findAllGoods("/goods/findAllGoods")
      .then(res=>{
        console.log("商品信息为：",res.data)
        this.goods = res.data
      })
  },
}
</script>
<style>
.select{
  display: block;
}
</style>