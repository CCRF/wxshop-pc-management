<template>
  <div>
    <div class="topItem">
      <el-select v-model="saleData" @change="choAll" placeholder="按可售状态筛选商品" class="selBox" clearable>
        <el-option v-for="item in saleOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-select v-model="typeData" @change="choAll" placeholder="按类型筛选商品" class="selBox" clearable>
        <el-option v-for="item in typeOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"></el-option>
      </el-select>
      <div class="selBox no">
        <el-input type="number" v-model="priceData" placeholder="按价格范围筛选商品"
                  min="0" max="200" @blur="shuzi" @clear="choAll" clearable
                  :title="'筛选单价￥'+priceData+'以内的商品'"></el-input>
      </div>
      <div class="queryInput no">
        <el-input type="text" v-model="queryData" @clear="choAll" placeholder="请输入查询关键字" clearable></el-input>
      </div>
      <el-button type="primary" @click="choAll">查询商品</el-button>
      <el-button type="primary" @click="insertGoods">新增商品</el-button>
      <el-button type="success" @click="insertType">商品类型管理</el-button>
    </div>
    <div class="main">
      <el-table
          :data="goodsList.slice((pageInfo.currentPage - 1) * pageInfo.size, pageInfo.currentPage * pageInfo.size)"
          border>
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="type[0].name" label="商品类型" width="85" />
        <el-table-column prop="name" label="商品名" width="180" />
        <el-table-column label="价格" width="85">
          <template v-slot="scope">
            ￥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="isSale" label="是否可销售" :formatter="isMarketable" width="95" />
        <el-table-column label="商品图" width="110" >
          <template v-slot="scope">
            <el-image :src="'http://localhost:8090/images/'+scope.row.picture"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="商品描述" width="260" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="info" @click="updateGoods">编辑</el-button>
            <el-button type="danger" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
        saleData: '',
        saleOptions: [
          {label: '所有状态', value: '-1'},
          {label: '可以销售', value: '1'},
          {label: '不可销售', value: '0'}
        ],
        typeData: '',
        typeOptions: [
        ],
        priceData: '',
        queryData: ''
      }
    },
    methods: {
      getAll() {
        this.$api.goods.findGoods("/goods/findAllGoods").then(res => {
              console.log("获取成功")
              this.goodsList = res.data
              // this.goodsList[i].picture = 1
              this.pageInfo.total = res.data.length
              console.log("返回的数据为：", res)
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
        if (sd == -1) {
          sd = "";
        }
        if (td == -1) {
          td = "";
        }
        this.$api.goods.findGoods("/goods/selectGoodsByAllMsg",
            {isSale: sd, typeId: td, price: this.priceData, msg: this.queryData})
            .then(res => {
              console.log(this.saleData,'@',this.typeData,'@',this.priceData,'@',this.queryData)
              console.log("通过All获取商品", res)
              this.goodsList = res.data
              this.pageInfo.total = res.data.length
            }, err => {
              console.log("获取失败")
              console.log(err)
            }
        )
      },
      shuzi(e) {
        let t = this.priceData;
        if (t.length > 3) {
          this.priceData = t.slice(0, 3);
          e.target.value = this.priceData;
        }
        if (t < 0) {
          this.priceData = 0;
          e.target.value = 0;
        }
        else if (t > 200) {
          this.priceData = 200;
          e.target.value = 200;
        }
        else if (this.priceData != '') {
          this.choAll()
        }
      },
      deleteGoods(row) {
        // console.log(row.id);
        // 确认提示...................................
        // this.$api.goods.modifyGoods("/goods/deleteGoods", row.id).then(res => {
        //       console.log(row.id, "删除成功", res)
        //     }, err => {
        //       console.log("获取失败")
        //       console.log(err)
        //     }
        // )
        this.$router.go(0)
        // 成功提示....................................
      }
    }
}
</script>

<style>
  .no{
    display: inline-block;
  }
  .selBox{
    width: 170px;
    margin-right: 10px;
  }
  .topItem{
    margin: 12px 0 5px 0;
  }
  .queryInput{
    width: 215px;
    margin-right: 10px;
  }
  .main{
    width: 85%;
  }
  .fenye {
    margin-top: 5px;
    margin-left: 32%;
  }
</style>