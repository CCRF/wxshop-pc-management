<template>
  <div class="all">
    <div class="topItem">
      <el-select v-model="saleData" @change="choAll" placeholder="按可售状态筛选商品" class="selBox mr" clearable>
        <el-option v-for="item in saleOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-select v-model="typeData" @change="choAll" placeholder="按类型筛选商品" class="selBox mr" clearable>
        <el-option v-for="item in typeOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"></el-option>
      </el-select>
      <div class="no mr">
<!--        <el-input type="number" v-model="priceData" placeholder="按价格范围筛选商品"-->
<!--                  :min=priceLimit.min :max=priceLimit.max-->
<!--                  @blur="shuzi($event, priceData)" @clear="choAll" clearable-->
<!--                  :title="'筛选单价￥'+priceData+'以内的商品'"></el-input>-->
        <el-input-number v-model="priceData" placeholder="按价格筛选商品" controls-position="right"
                         :min=priceLimit.min :max=priceLimit.max :precision="2"
                         class="fll" style="width: 170px;" @blur="choAll" @click="priceData=''"
                         :title="'筛选单价￥'+priceData+'以内的商品'"></el-input-number>
      </div>
      <div class="queryInput no mr">
        <el-input type="text" v-model="queryData" @clear="choAll" placeholder="请输入查询关键字" clearable></el-input>
      </div>
      <el-button type="primary" @click="choAll">查询商品</el-button>
      <el-button type="primary"
                 @click="this.typeOptions.shift();this.insertVisible = true">新增商品</el-button>
      <el-button type="success" @click="TypeManagement">商品类型管理</el-button>
    </div>
    <div class="main">
      <el-table
          :data="goodsList.slice((pageInfo.currentPage - 1) * pageInfo.size, pageInfo.currentPage * pageInfo.size)"
          :row-style="{height: '95px'}"
          border>
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="type[0].name" label="商品类型" width="85" />
        <el-table-column prop="name" label="商品名称" width="180" />
        <el-table-column label="价格" width="85">
          <template v-slot="scope">
            ￥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="isSale" label="是否可销售" :formatter="isMarketable" width="95" />
        <el-table-column label="商品图" width="110" >
          <template v-slot="scope">
            <el-image :src="'https://g1.glypro19.com/img/'+scope.row.picture"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="商品描述" width="270" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="info" @click="update(scope.row)">编辑</el-button>
<!--            <el-button type="danger" @click="deleteGoods(scope.row)">删除</el-button>-->
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                confirm-button-type="danger"
                title="确认删除这条商品数据吗？"
                @confirm="deleteGoods(scope.row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-size="pageInfo.size"
          layout="prev, pager, next"
          :total="pageInfo.total"
          class="fenye" />
    </div>

    <el-dialog v-model="insertVisible" title="新增商品" width="500px" @close="close" center>
      <el-form :model="insertData" :rules="rules" label-width="100px" label-position="right">
<!--        <el-form-item label="编号">-->
<!--          取当前goodsList最后一个的编号+1-->
<!--        </el-form-item>-->
        <el-form-item label="商品类型：" prop="type">
          <el-select v-model="insertData.type" placeholder="请选择商品类型" clearable @change="getValue"
                     :disabled="show" title="上传商品图成功后，将不能再选择类型。若想修改类型需要删除上传的商品图后，再进行选择。">
            <el-option v-for="item in typeOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="insertData.name" type="text" placeholder="请输入商品名称" clearable/>
        </el-form-item>
        <el-form-item label="商品价格：" prop="price">
<!--          <el-input v-model="this.insertData.price" type="number"-->
<!--                    :min=priceLimit.min :max=priceLimit.max-->
<!--                    @blur="shuzi($event, this.insertData.price)" clearable/>-->
          <el-input-number v-model="insertData.price" :precision="2" class="fll" placeholder="￥"
                           :min=priceLimit.min :max=priceLimit.max></el-input-number>
        </el-form-item>
        <el-form-item label="是否可销售：">
          <el-radio-group v-model="insertData.isSale" type="number">
            <el-radio v-model="insertData.isSale" :label="1">是</el-radio>
            <el-radio v-model="insertData.isSale" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品图：">
          <el-upload
              ref="upload"
              :class="{dis: uploadDisabled}"
              :disabled="typeDisabled"
              action="http://localhost:8090/goods/upload"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :headers="header"
              @click="getValue"
              :data="{type: uploadValue}"
              :on-success="successUpload"
              :on-change="handleChange"
              :on-remove="handleRemove">
            <template #trigger>
              <el-button type="primary">上传图片</el-button>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述：">
          <el-input v-model="insertData.remark" type="textarea" rows="3" resize="none"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='insertGoods' class="ml">提交</el-button>
          <el-button type="info" @click='insertData = this.$options.data().insertData'>重置</el-button>
          <el-button type="info" @click='close; insertVisible = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="updateVisible" title="编辑商品信息" width="500px" @close="close" center>
      <el-form :model="updateData" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="编号：">
          <el-input v-model="updateData.id" type="text" readonly/>
        </el-form-item>
        <el-form-item label="商品类型：" prop="type">
          <el-select v-model="updateData.type" placeholder="请选择商品类型" clearable @change="getValue"
                     :disabled="Ushow" title="上传商品图成功后，将不能再选择类型。若想修改类型需要删除上传的商品图后，再进行选择。">
            <el-option v-for="item in typeOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="updateData.name" type="text" placeholder="请输入商品名称" clearable/>
        </el-form-item>
        <el-form-item label="商品价格：" prop="price">
<!--          <el-input v-model="this.updateData.price" type="number" prefix-icon="prefix-icon" @input="formatNum(this.updateData.price)">-->
<!--                    :min=priceLimit.min :max=priceLimit.max-->
<!--                    @blur="shuzi($event, this.updateData.price)" clearable>-->
<!--          </el-input>-->
          <el-input-number v-model="updateData.price" :precision="2" class="fll" placeholder="￥"
                           :min=priceLimit.min :max=priceLimit.max></el-input-number>
        </el-form-item>
        <el-form-item label="是否可销售：">
          <el-radio-group v-model="updateData.isSale">
            <el-radio v-model="updateData.isSale" :label="1" type="number">是</el-radio>
            <el-radio v-model="updateData.isSale" :label="0" type="number">否</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        图片暂不能修改-->
        <el-form-item label="商品图：">
<!--          <el-input v-model="this.updateData.picture" type="file" clearable/>-->
<!--          &lt;!&ndash;          v-model储存文件路径&ndash;&gt;-->
          <el-upload
              ref="upload"
              :class="{dis: UuploadDisabled}"
              :disabled="UtypeDisabled"
              action="http://localhost:8090/goods/upload"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :headers="header"
              @click="UgetValue"
              :data="{type: UuploadValue}"
              :on-success="UsuccessUpload"
              :on-change="UhandleChange"
              :on-remove="UhandleRemove">
            <el-image :src="'https://g1.glypro19.com/img/'+updateData.picture"></el-image>
<!--            <template #trigger>-->
<!--              <el-image :src="'https://g1.glypro19.com/img/'+updateData.picture"></el-image>-->
<!--              <el-button type="primary">上传图片</el-button>-->
<!--            </template>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述：">
          <el-input v-model="updateData.remark" type="textarea" rows="3" resize="none"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='updateGoods' class="ml">保存</el-button>
          <el-button type="info" @click='updateData = this.$options.data().updateData'>重置</el-button>
          <el-button type="info" @click='close; updateVisible = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
    name: "GoodsPage",
    created() {
      this.getAll()
      this.getAllType()
    },
    data(){
      return {
        goodsList: [],
        pageInfo: {
          size: 5,
          currentPage: 1,
          total: 0
        },
        priceLimit: {
          min: 0,
          max: 200
        },
        saleData: '',
        saleOptions: [
          {label: '所有状态', value: '-1'},
          {label: '可以销售', value: '1'},
          {label: '不可销售', value: '0'}
        ],
        typeData: '',
        typeOptions: [
        ],
        priceData: undefined,
        queryData: '',
        rules: {
          type: [
            {required: true, message: '请选择商品类型', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          price: [
            // {required: false, message: '请输入价格', trigger: 'blur'},没用....自写
            // {min: 0, max: 200, message: '允许输入的价格范围在￥0至￥200以内',
            //   pattern:/^\d+\.?\d{0,2}$/, trigger: 'blur'}
          ]
        },
        insertVisible: false,
        insertData: {
          id:"",
          type:"",
          name:"",
          price:"",
          isSale:1,
          picture:"",
          remark:""
        },
        updateVisible: false,
        updateData: {
        },
        header: {
          token:sessionStorage.getItem("token")
        },
        uploadValue: '',
        UuploadValue: '',
        typeDisabled: true,
        UtypeDisabled: true,
        uploadDisabled: false,
        UuploadDisabled: false,
        show: false,
        Ushow: false
      }
    },
    methods: {
      getAll() {
        this.$api.goods.findGoods("/goods/findAllGoods").then(res => {
              console.log("获取成功", res)
              this.goodsList = res.data
              // this.goodsList[i].picture = 1
              this.pageInfo.total = res.data.length
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
      },
      getAllType() {
        this.$api.goods.findGoods("/goods/findAllType").then(res => {
              // console.log("获取类型成功", res)
              this.typeOptions = res.data;
              // unshift从头部插入数据
              this.typeOptions.unshift({id: -1, name:'所有类型'})
              // this.typeOptions.label = res.data.name
              // this.typeOptions.value = res.data.id
              // console.log('类型：', this.typeOptions);
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
      },
      isMarketable(row) {
        return row.isSale==1 ? '是' : '否';
      },
      handleCurrentChange(val) {
        this.pageInfo.currentPage = val
      },
      choAll() {
        let sd = this.saleData;
        let td = this.typeData;
        let pd = this.priceData;
        if (sd == -1) {
          sd = "";
        }
        if (td == -1) {
          td = "";
        }
        if (pd == undefined) {
          pd = "";
        }
        this.$api.goods.findGoods("/goods/selectGoodsByAllMsg",
            {isSale: sd, typeId: td, price: pd, msg: this.queryData})
            .then(res => {
              // console.log(this.saleData,'@',this.typeData,'@',this.priceData,'@',this.queryData)
              console.log("通过All获取商品", res)
              this.goodsList = res.data
              this.pageInfo.total = res.data.length
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
      },
      // shuzi(e, data) {
      //   let t = data;
      //   if (t.length > 3) {
      //     data = t.slice(0, 3);
      //     e.target.value = data;
      //   }
      //   if (t < 0) {
      //     data = 0;
      //     e.target.value = 0;
      //   }
      //   else if (t > 200) {
      //     data = 200;
      //     e.target.value = 200;
      //   }
      //   else if (data != '') {
      //     this.choAll()
      //   }
      // },
      insertGoods() {
        // console.log(this.insertData)
        // console.log(this.goodsList.pop().id)
        let data = this.insertData
        this.$api.goods.modifyGoods("/goods/insertGoods",
            {"id": this.goodsList.pop().id+1, "type": data.type, "name": data.name, "price": data.price,
              "isSale": data.isSale, "picture": data.picture, "remark": data.remark}).then(res => {
              console.log("新增商品", res)
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
        this.close()
        this.insertVisible = false
        this.insertData = this.$options.data().insertData
        this.$router.go(0)
      },
      update(row) {
        this.$api.goods.findGoods("/goods/selectGoodsById", {id: row.id}).then(res => {
              console.log("编辑获取", res)
              this.updateData = res.data
              this.updateData.type = res.data.type[0].id
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
        this.typeOptions.shift()
        this.updateVisible = true
      },
      updateGoods() {
        console.log(this.updateData)
        let ud = this.updateData;
        this.$api.goods.modifyGoods("/goods/updateGoods",
            {"id": ud.id, "type": [{"id": ud.type}], "name": ud.name, "price": ud.price,
             "isSale": ud.isSale, "remark": ud.remark, "picture": ud.picture}).then(res => {
              console.log("修改成功", res)
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
        this.close()
        this.updateVisible = false
        this.updateData = this.$options.data().updateData
        this.$router.go(0)
      },
      deleteGoods(row) {
        console.log(row.id);
        // 确认提示...................................
        this.$api.goods.modifyGoods("/goods/deleteGoods", row.id).then(res => {
              console.log(row.id, "删除成功", res)
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
        // 成功提示....................................
        ElMessage({
          type:'success',
          message:"删除成功"
        })
        this.$router.go(0)
      },
      close() {
        this.getAllType()
        // this.insertVisible = false
      },
      getValue() {
        // console.log(this.typeOptions[this.insertData.type-1].nickname);
        let v = this.typeOptions[this.insertData.type-1]
        if (v === undefined) {
          ElMessage({
            type: 'warning',
            message: "请先选择商品类型"
          })
          this.typeDisabled = true
        }
        else {
          this.typeDisabled = false
          this.uploadValue = v.nickname
        }
      },
      UgetValue() {
        // console.log(this.typeOptions[this.insertData.type-1].nickname);
        let v = this.typeOptions[this.updateData.type-1]
        if (v === undefined) {
          ElMessage({
            type: 'warning',
            message: "请先选择商品类型"
          })
          this.UtypeDisabled = true
        }
        else {
          this.UtypeDisabled = false
          this.UuploadValue = v.nickname
        }
      },
      beforeUpload(file){
        console.log("file文件为", file)
        const isJPG = file.type === "image/jpeg";
        const isJPG2 = file.type === "image/jpg";
        const isPNG = file.type === "image/png";
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isJPG2 && !isPNG) {
          ElMessage({
            type:"error",
            message:"仅支持上传jpg、jpeg或png格式图片"
          })
        }
        if (!isLt5M) {
          ElMessage({
            type:"error",
            message:"仅支持上传5MB以内的图片"
          })
        }
        this.uploadImage = file
        return (isJPG || isJPG2 || isPNG) && isLt5M;
      },
      successUpload(response) {
        if (response.code == 200) {
          let m = response.msg.split("/")
          this.insertData.picture = m[3]+"/"+m[4]
          // this.insertData.picture = m.substr(m.lastIndexOf("/")+1, m.length)
          console.log("返回的路径为", response.msg, this.insertData.picture)
          ElMessage({
            type:'success',
            message:"上传成功"
          })
        }
      },
      // 图片更改
      handleChange() {
        this.show = true
        this.uploadDisabled = true;
      },
      // 删除图片
      handleRemove() {
        this.show = false
        this.uploadDisabled = false;
      },
      UsuccessUpload(response) {
        if (response.code == 200) {
          let m = response.msg.split("/")
          this.updateData.picture = m[3]+"/"+m[4]
          console.log("U返回的路径为", response.msg, this.updateData.picture)
          ElMessage({
            type:'success',
            message:"上传成功"
          })
        }
      },
      // 图片更改
      UhandleChange() {
        this.Ushow = true
        this.UuploadDisabled = true;
      },
      // 删除图片
      UhandleRemove() {
        this.Ushow = false
        this.UuploadDisabled = false;
      },
      TypeManagement() {
        this.$router.push('category')
      }
    }
}
</script>

<style>
  .all{
    margin-left: 2.5%;
  }
  .fll{
    margin-left: 0;
  }
  .no{
    display: inline-block;
  }
  .ml{
    margin-left: 130px;
  }
  .mr{
    margin-right: 10px;
  }
  .selBox{
    width: 170px;
  }
  .topItem{
    margin: 10px 0 5px 0;
  }
  .queryInput{
    width: 215px;
  }
  .main{
    width: 88%;
    background-color: white;
    box-shadow: 25px 25px 40px -23px grey;
  }
  .fenye{
    margin-top: 5px;
    margin-left: 34%;
  }
  .dis .el-upload--picture-card {
    display: none;
  }
  .el-image {
    /*width: 85px;*/
    /*height: 85px;*/
  }
</style>