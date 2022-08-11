<template>
  <div>
  <div class="Search">
    <el-input placeholder="请输入你想要查询的套餐名称" v-model="Mealname" />&nbsp;
  </div>
  <div class="SearchButton">
    <el-button @click="selectByName" class="select" type="primary">点击查询</el-button>
    <el-popover v-model:visible="visible" placement="top" :width="160">
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
  </div>
  </div>

  <!--新增套餐（遮罩层）-->
  <el-dialog v-model="dialogVisible" title="Tips" width="50%" draggable>
    <span>请输入你想要添加的套餐信息吧</span>
    <br><br>
    <el-form
        label-width="100px"
        :model="newList"
        style="max-width: 660px"
    >
      <el-form-item label="套 餐 名 称">
        <el-input v-model="newList.name" />
      </el-form-item>
      <el-form-item label="套 餐 价 格">
        <el-input v-model="this.PriceCount" />
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
      <el-form-item label="套 餐 内 容">
        <el-button type="primary" @click="SecondaryMaskLayer = true">点击与原有商品组合</el-button>
        <el-dialog v-model="SecondaryMaskLayer" title="Tips" width="60%" draggable>
          <el-table :data="goods" height="450" style="width: 100%">
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column prop="value" label="数量" width="180">
              <template #default="scope">
                <el-input-number
                    style="right: 60px"
                    v-model="scope.row.value"
                    size="small"
                    :min="0"
                    :max="10"
                    @change="(currentValue, oldValue)=>changeAction(currentValue,
                  oldValue,scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" />
          </el-table>

          <hr>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="CommoditySynthesis">提交</el-button>
        </el-dialog>
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
        <el-image style="width: 100px; height: 100px" :src="'https://g1.glypro19.com/img/setMeal/'+value" fit="cover" v-show="value" alt="图片暂时没有加载出来哦"/>
        <br>
      </el-form-item>
      <el-form-item label="点我上传自己的图片">
<!--        action="http://localhost:8090/setMeal/upload"-->

          <el-upload
              action="https://g1.glypro19.com/setMeal/upload"
              method="post"
              show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :headers="header"
              name="file"
              :multiple="false"
              :on-success="successUpload"
          >
            <el-button>点击上传</el-button>
            <el-image style="width: 100px; height: 100px" :src="'https://g1.glypro19.com/img/setMeal/'+this.uploadImage" fit="cover" v-show="false" alt="图片暂时没有加载出来哦"/>
          </el-upload>
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
  <el-dialog v-model="updateVisible" title="Tips" width="50%" draggable>
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
      <el-form-item label="套 餐 图 片">
        <el-select v-model="updateValue" class="m-2" placeholder="Select" size="large" clearable>
          <el-option
              v-for="item in imageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-image style="width: 100px; height: 100px" :src="this.value" fit="cover" alt="图片暂时没有加载出来哦"/>
        <el-image style="height: 100px;width: 100px" fit="cover" :src="updateValue" v-show="updateValue"/>
      </el-form-item>
      <el-form-item label="套 餐 内 容">
        <el-button type="primary" @click="SecondaryMaskLayer = true">点击与原有商品组合</el-button>
        <el-dialog v-model="SecondaryMaskLayer" title="组 合" width="45%" draggable>

          <el-table :data="goods" height="450" style="width: 100%">
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column prop="value" label="数量" width="180">
              <template #default="scope">
                <el-input-number
                    style="right: 60px"
                    v-model="scope.row.value"
                    size="small"
                    :min="0"
                    :max="10"
                    @change="(currentValue, oldValue)=>changeAction(currentValue,
                  oldValue,scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" />
          </el-table>

          <hr>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="CommoditySynthesis">确定</el-button>
        </el-dialog>
      </el-form-item>
      <el-form-item label="点我上传自己的图片">
        <el-upload
            action="https://g1.glypro19.com/setMeal/upload"
            method="post"
            show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :headers="header"
            name="file"
            :multiple="false"
            :on-success="successUpload"
        >
          <el-button>点击上传</el-button>
          <el-image style="width: 100px; height: 100px" :src="this.uploadImage" fit="cover" v-show="false" alt="图片暂时没有加载出来哦"/>
        </el-upload>
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
  <div class="MainDisplay">
    <el-table :data="list" height="530px" style="border: rgba(159,156,156,0.5) 1px solid" >
      <el-table-column label="参 考 图 片" prop="picture" align="center">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="'https://g1.glypro19.com/img/setmeal/'+scope.row.picture" fit="cover" alt="图片暂时没有加载出来哦"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="套 餐 名 称" align="center"/>
      <el-table-column prop="description" label="套 餐 描 述" align="center"/>
      <el-table-column prop="price" label="套 餐 价 格" align="center" />
      <el-table-column prop="sale" label="月 销 售 量" align="center" />
      <el-table-column prop="flavor" label="口 味" align="center"/>
      <el-table-column prop="contain" label="套 餐 内 容" align="center" show-overflow-tooltip/>
      <el-table-column align="center" fixed="right" label="功能" >
        <template #default="scope">

          <el-button size="small" @click="handleEdit(scope.row)"
          >修改套餐
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="deleteSetMeal(scope.row)"
              style="margin: 10px 0 0 0"
          >删除套餐</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="删 除" v-model="DeleteRequest" width="30%">
      确认要删除吗？<br><br><br>
      <el-button @click="DeleteRequest=false">取消</el-button>
      <el-button type="danger" @click="handleDelete">确定</el-button>
    </el-dialog>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="totalPage"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleSizeChange"
    />
  </div>


</template>
<script>
import {toRaw} from "vue";
import {ElMessage} from "element-plus";
import {deleteFile} from "../../http/modules/SetMeal";

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
      SecondaryMaskLayer: false,//二级遮罩层（组合原有商品）
      num:0,

      newList:{id:"",name:"", price:"", contain:"", description:"", sale:"", flavor:"",picture:""},
      mode:{},
      file:"",
      modeList:[],
      //这些是与图片相关的,选择器（选择套餐图片的样式）
      value:"",//新增套餐的图片值
      updateValue:"",//修改套餐的值

      imageList:[],//套餐图片列表
      // roleFunction : true,//判断用户是否有权限来显示功能操作
      goods:[],
      goodCount:[],//套餐包含的内容（数组形式)
      countGood:"",//最后上传的套餐内容,用来提交
      PriceCount:0,//商品总价(自动计算)
      //分页
      currentPage:1,
      totalPage:20,
      pageSize: 4,
      DeleteRequest:false,//删除请求框
      delSetmeal:{},
      uploadImage:"",//上传返回的图片url
      header:{
        token:sessionStorage.getItem("token"),
        // 'Content-Type':'multipart/form-data' //这里不能加这个注释，不然会报错400
      },
      clickAddButton: false,
      clickDeleteButton: false,
      clickUpdateButton: false,
      clickButton: false,
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
        this.$api.SetMeal.findSetMeal(`/setMeal/selectByName/${this.Mealname}/${this.currentPage}/${this.pageSize}`)
            .then(res=>{
                if (res.code==200){
                  this.$message({type:"success",message:"查找成功"})
                  console.log("查询到的结果为：",res)
                  this.list = res.data.rows
                  this.totalPage = res.data.totalCount
                }
                },err=>{
                  console.log("查询失败",err)
                }
            )

      }
    },

    //通过id查询到数据回显在更新框中
    handleEdit(row){
        this.updateVisible = true
        for (let i = 0; i < this.goods.length; i++) {
          this.goods[i].value=0
        }
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

    },
    deleteSetMeal(msg){//删除提示
      this.DeleteRequest = true
      this.delSetmeal = msg;

    },
    //删除信息
    handleDelete(){
      this.DeleteRequest = false
        const msg = this.delSetmeal

        // console.log(msg)
        console.log("11111",msg.id)
        console.log("图片路径为",msg.picture)
        const deleteSetMeal =new FormData()
        deleteSetMeal.append("id",msg.id)
        deleteSetMeal.append("imageUrl",msg.picture)
        this.$api.SetMeal.deleteById("/setMeal/deleteById",deleteSetMeal)
            .then(res=>{
                  console.log("返回的结果为：",res)
              if (res.code==200){
                this.$message({message:'删除成功',type:'success'})
                location.reload()
              }
                },err=>{
                  console.log(err)
                  this.$message.error('删除失败')
                }
            )
      this.reload()

    },

    //提交数据
    submitMeal() {
      let data = {name: "", price: "", contain: "", description: "", sale: "", flavor: "",picture:""}
      if (this.newList.sale == null || this.newList.name==null || this.PriceCount==null ){
        ElMessage({
          message:"信息没有填写完全喔",
          type:"warning"
        })
      }
      else {
        data.sale = this.newList.sale
        data.price = this.PriceCount
        data.name = this.newList.name
        data.contain = this.countGood
        data.flavor = this.newList.flavor
        data.description = this.newList.description
        if (this.uploadImage==""){
          data.picture = this.value
        }else {
          data.picture = this.uploadImage
        }
        this.dialogVisible = false
        this.$api.SetMeal.addMeal("/setMeal/insert",data)
            .then(res=>{
                  console.log(res)
                  if (res.code==200){
                    this.$message.success("提交成功")
                    // this.$message({message:'提交成功',type:'success'})
                    this.uploadImage==""
                  }else {
                    this.$message({message:"提交失败！",type:'error'})
                    this.uploadImage==""
                  }
                },
                location.reload()
            )
      }
      this.reload()
    },
    //更新数据
    updateMeal(){
      this.FindImageList()
      let data = {id:"" ,name: "", price: "", contain: "", description: "", sale: "", flavor: "",picture:""}
      data.id = this.newList.id
      data.sale = this.newList.sale
      if (this.countGood==null){
        //判断用户是否上传文件，上传了就使用用户的文件
        data.contain = this.newList.contain
        data.price = this.newList.price
      }else {
        data.contain = this.countGood
        data.price = this.PriceCount
      }
      data.name = this.newList.name
      data.flavor = this.newList.flavor
      data.description = this.newList.description
      console.log("选择框的值为",this.updateValue)
      if (this.uploadImage==""){//上传的值
        if (this.updateValue==""){//原本更新选择框的值
          data.picture=this.value//原来回显的值
          console.log("this.value",this.value)
        }else {
          data.picture = this.updateValue
          console.log("this.updateValue",this.updateValue)
          console.log("原来的图片数据为：",this.updateValue)
        }

      }else {
        console.log("上传的值",this.uploadImage)
        data.picture = this.uploadImage
        console.log("原来的图片数据为：",this.value)
        this.$api.SetMeal.deleteFile("/setMeal/deleteFile",this.value)
        .then(res=>{
          console.log(res)
          if (res.code==200){
            console.log("删除成功")
          }
        })
      }
      this.updateVisible = false
      this.$api.SetMeal.addMeal("/setMeal/update",data)
          .then(res=>{
                console.log(res)
            if (res.code==200){
              this.$message({message:'更新成功',type:'success'})
            }else {
              this.$message.error("发生错误了，请重试")
            }
            this.uploadImage = ""
              }
          )
      this.reload()
    },

    m1(){
      this.dialogVisible = true
      this.newList=[]
      this.value =""
      this.uploadImage = ""//让上传的图片路径为空
      console.log(this.goodCount)
      for (let i = 0; i < this.goods.length; i++) {
        this.goods[i].value=0
      }
      this.PriceCount=0
      console.log("调用方法：FindImageList")
      this.FindImageList()
      console.log("成功调用：FindImageList")
    },

    changeAction: function (currentValue, oldValue, row) {
      const price = row.price
      const name = row.name
      const m1 = {name,currentValue,price}
      let array = toRaw(this.goodCount)
      if (currentValue==0){
        for (let i = 0; i < array.length; i++) {
          if (m1.name==array[i].name){
            this.goodCount.splice(i,1)
          }
        }
      }else{
        let x = true
        for (let i = 0; i < this.goodCount.length; i++) {
          if (name==array[i].name){
            this.goodCount.splice(i,1,m1)
            x = false
          }
        }
        if (x){
          this.goodCount.splice(this.goodCount.length,1,m1)
        }
      }
      const m2 = toRaw(this.goodCount)
      let goodList = ""
      let priceCount = 0
      //字符串拼接
      for (let i = 0; i < m2.length; i++) {
        const count = m2[i].name+"×"+m2[i].currentValue
        priceCount = priceCount+m2[i].currentValue*m2[i].price
        goodList = goodList+count+"\n"
      }
      this.PriceCount = priceCount
      this.countGood = goodList
    },

    CommoditySynthesis(){
      this.newList.price = this.PriceCount
      this.SecondaryMaskLayer = false
    },

    cancel(){
      this.SecondaryMaskLayer = false
    },
    reload(){
      this.$api.SetMeal.findSetMeal(`/setMeal/selectByName/${this.Mealname}/${this.pageSize}`)
          .then(res=> {
            if (res.code === 200) {
              this.$message({type: 'success', message: "查找成功"})
              this.totalPage = res.data.totalCount
              this.list = res.data.rows
            } else {
              this.$message({type: 'error', message: "查找失败，请重试"})
            }
          })
    },
    handleSizeChange(val){
      this.currentPage = val
      console.log("输入的数据为",this.Mealname)
      if (this.Mealname!=""){
        this.$api.SetMeal.findSetMeal(`/setMeal/selectByName/${this.Mealname}/${val}/${this.pageSize}`)
        .then(res=>{
          if(res.code===200){
            this.$message({type:'success',message:"查找成功"})
            this.totalPage = res.data.totalCount
            this.list = res.data.rows
          }else {
            this.$message({type:'error',message:"查找失败，请重试"})
          }
          console.log(res)
        })

      }else {
        this.$api.SetMeal.findSetMeal(`/setMeal/page/${val}/${this.pageSize}`)
            .then(res=>{
              this.list = res.data.rows
              console.log("返回的数据为11111",res.data)
            })
      }
    },
    Upload(aa){
      console.log("此时uploadImag为",this.uploadImage)
    },
    //成功上传调用
    successUpload(response){
      if (response.code==200){
        this.uploadImage = response.msg
          console.log("返回的路径为",this.uploadImage)
          ElMessage({
          type:'success',
          message:"上传成功"
        })

      }
    },
    //文件上传前进行类型、大小检验
    beforeAvatarUpload(file){
      console.log("file文件为",file)

      const isJPG = file.type === "image/jpeg";
      const isJPG2 = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isJPG2 && !isPNG) {
        ElMessage({
          type:"warning",
          message:"只支持jpg或png格式图片"
        })
      }
      if (!isLt5M) {
        ElMessage({
          type:"warning",
          message:"请上传5MB以内的图片!"
        })
      }
      this.uploadImage = file
      return (isJPG || isJPG2 || isPNG) && isLt5M;
    },

    FindImageList(){
      //拿到图片列表
      this.$api.SetMeal.FindImages("/setMeal/image")
          .then(response=>{
            if (response.code==200){
              const list = [response.data.length]
              console.log("lilili",response.data)
              for (let i = 0; i < response.data.length; i++) {
                if (response.data[i]==null){
                  response.data.push(i)
                }else {
                  console.log(response.data[i])
                  list.push({"label":"套餐"+[i],"value":'https://g1.glypro19.com/img/setMeal/'+response.data[i]})
                }
              }
              console.log("列表为",list)
              this.imageList = list
            }
          },err=>{
            console.log("失败了",err)
          })
    }

  },
  //页面开始时遍历数据
  mounted() {
    this.$api.SetMeal.findSetMeal(`/setMeal/page/${1}/${4}`)
        .then(res=>{
              console.log("挂载返回的数据为：",res)
              this.list = res.data.rows
              this.totalPage = res.data.totalCount
            },err=>{
              console.log("获取套餐失败",err)
            }
        );

    this.$api.goods.findGoods("/goods/findAllGoods")
        .then(res=>{
          console.log("res为",res)
          const arr = res.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].value = "0"
          }
          this.goods = arr
        })
    this.FindImageList()
  },
}
</script>
<style>
.select{
  display: block;
}
.Search{
  width: 40%;
  margin: 20px 0 0px 30px;
  float: left;
}
.MainDisplay{
  width: 95%;
  padding: 30px;
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow:2px 2px 10px #909090;
}
.SearchButton{
  display: block;
  float: left;
  margin: 20px 0 10px 30px;
}
</style>