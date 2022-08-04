<template>
  <div>
    <el-input type="text" placeholder="请输入查询关键字" clearable></el-input>
    <el-button class="setext" type="primary">查询商品</el-button>
    <el-button class="setext" type="primary">新增商品</el-button>
    <el-table
        :data="goods"
        border>
      <el-table-column prop="id" label="编号" width="60" />
      <el-table-column prop="type[0].name" label="商品类型" width="85" />
      <el-table-column prop="name" label="商品名" width="170" />
      <el-table-column prop="price" label="价格" width="70" />
      <el-table-column prop="isSale" label="是否可销售" :formatter="isMarketable" width="95" />
      <el-table-column prop="remark" label="备注信息" width="200" />
      <el-table-column label="商品图" width="180" >
        <template v-slot="scope">
          <el-image :src="scope.row.picture"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
    name: "GoodsPage",
    created() {
      this.$api.goods.findAllGoods("/goods/findAllGoods").then(res => {
            console.log("获取成功")
            this.goods = res.data
            console.log("返回的数据为：", res.data)
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
    },
    data(){
      return {
        PageSize: 10,
        currentPage: 1,
        goods: []
      }
    },
    methods: {
      isMarketable(row) {
        return row.isSale==1 ? '是' : '否';
      }
    }
}
</script>

<style>

</style>