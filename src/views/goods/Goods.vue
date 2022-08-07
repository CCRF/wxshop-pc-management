<template>
  <div>
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
      <el-button type="primary" @click="this.typeOptions.shift(); this.insertVisible = true">新增商品</el-button>
      <el-button type="success" @click="insertType">商品类型管理</el-button>
    </div>
    <div class="main">
      <el-table
          :data="goodsList.slice((pageInfo.currentPage - 1) * pageInfo.size, pageInfo.currentPage * pageInfo.size)"
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
        <el-table-column prop="remark" label="商品描述" width="260" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="info" @click="update(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="insertVisible" title="新增商品" width="500px" @close="close" center>
      <el-form :model="insertData" :rules="rules" label-width="100px" label-position="right">
<!--        <el-form-item label="编号">-->
<!--          取当前goodsList长度+1-->
<!--        </el-form-item>-->
        <el-form-item label="商品类型：" prop="type">
          <el-select v-model="this.insertData.type" placeholder="请选择商品类型" clearable>
            <el-option v-for="item in typeOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="this.insertData.name" type="text" placeholder="请输入商品名称" clearable/>
        </el-form-item>
        <el-form-item label="商品价格：" prop="price">
<!--          <el-input v-model="this.insertData.price" type="number"-->
<!--                    :min=priceLimit.min :max=priceLimit.max-->
<!--                    @blur="shuzi($event, this.insertData.price)" clearable/>-->
          <el-input-number v-model="this.insertData.price" :precision="2" class="fll" placeholder="￥"
                           :min=priceLimit.min :max=priceLimit.max></el-input-number>
        </el-form-item>
        <el-form-item label="是否可销售：">
          <el-radio-group v-model="this.insertData.isSale" type="number">
            <el-radio v-model="this.insertData.isSale" :label="1">是</el-radio>
            <el-radio v-model="this.insertData.isSale" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品图：">
          <el-input v-model="this.insertData.picture" type="file" clearable/>
<!--          v-model储存文件路径-->
        </el-form-item>
        <el-form-item label="商品描述：">
          <el-input v-model="this.insertData.remark" type="textarea" rows="3" resize="none"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='insertGoods' class="ml">提交</el-button>
          <el-button type="info" @click='insertData = ""'>重置</el-button>
          <el-button type="info" @click='close; insertVisible = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="updateVisible" title="编辑商品信息" width="500px" @close="close" center>
      <el-form :model="updateData" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="编号：">
          <el-input v-model="this.updateData.id" type="text" readonly/>
        </el-form-item>
        <el-form-item label="商品类型：" prop="type">
          <el-select v-model="this.updateData.type" placeholder="请选择商品类型" clearable>
            <el-option v-for="item in typeOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="this.updateData.name" type="text" placeholder="请输入商品名称" clearable/>
        </el-form-item>
        <el-form-item label="商品价格：" prop="price">
<!--          <el-input v-model="this.updateData.price" type="number" prefix-icon="prefix-icon" @input="formatNum(this.updateData.price)">-->
<!--                    :min=priceLimit.min :max=priceLimit.max-->
<!--                    @blur="shuzi($event, this.updateData.price)" clearable>-->
<!--          </el-input>-->
          <el-input-number v-model="this.updateData.price" :precision="2" class="fll" placeholder="￥"
                           :min=priceLimit.min :max=priceLimit.max></el-input-number>
        </el-form-item>
        <el-form-item label="是否可销售：">
          <el-radio-group v-model="this.updateData.isSale">
            <el-radio v-model="this.updateData.isSale" :label="1" type="number">是</el-radio>
            <el-radio v-model="this.updateData.isSale" :label="0" type="number">否</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        图片暂不能修改-->
<!--        <el-form-item label="商品图：">-->
<!--          <el-input v-model="this.updateData.picture" type="file" clearable/>-->
<!--          &lt;!&ndash;          v-model储存文件路径&ndash;&gt;-->
<!--        </el-form-item>-->
        <el-form-item label="商品描述：">
          <el-input v-model="this.updateData.remark" type="textarea" rows="3" resize="none"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='updateGoods' class="ml">保存</el-button>
          <el-button type="info" @click='updateData = ""'>重置</el-button>
          <el-button type="info" @click='close; updateVisible = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currentPage"
      :page-size="pageInfo.size"
      layout="prev, pager, next"
      :total="pageInfo.total"
      class="fenye" />
</template>

<script>
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
            // {required: false, message: '请输入价格', trigger: 'blur'},
            {min: 0, max: 200, message: '允许输入的价格范围在￥0至￥200以内', trigger: 'blur',
              pattern:/^[0-9]*$/}
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
          // id:"",
          // type:"",
          // name:"",
          // price:"",
          // isSale:"",
          // picture:"",
          // remark:""
        }
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
              // console.log(this.typeOptions);
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
        this.$router.go(0)
        // 成功提示....................................
      },
      close() {
        this.getAllType()
        // this.insertVisible = false
      }
    }
}
</script>

<style>
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
    margin: 12px 0 5px 0;
  }
  .queryInput{
    width: 215px;
  }
  .main{
    width: 85%;
  }
  .fenye {
    margin-top: 5px;
    margin-left: 32%;
  }
</style>