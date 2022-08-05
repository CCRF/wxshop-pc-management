<template>

  <div>
    <n-button @click="getOrder(1)">
      查看当前订单
    </n-button>
    <n-button @click="getOrder(2)">
      查看历史订单
    </n-button>
    <n-button @click="deleteOrder">
      删除订单
    </n-button>
    <n-button @click="insertOrder">
      添加订单
    </n-button>

    <n-popconfirm
            @positive-click="handlePositiveClick"
            @negative-click="handleNegativeClick"
    >
      <template #trigger>
        <n-button type="info" id="saveButton">
          保存数据
        </n-button>
      </template>
      确认保存数据吗？
    </n-popconfirm>
    <n-p> 你选中了ID为 {{ checkedRowKeysRef }} ，共计{{checkedRowKeysRef.length}}条订单。</n-p>
    <n-data-table
            :columns="columns"
            :data="data"
            :pagination="pagination"
            :max-height="550"
            :scroll-x="1700"
            virtual-scroll
            :row-class-name="rowClassName"
            flex-height
            @update:checked-row-keys="handleCheck"
            ellipsis="EllipsisProps"
    >
      <n-checkbox v-model:checked="value"/>
    </n-data-table>
  </div>
</template>

<script setup>
    import {getCurrentInstance, h, onUpdated, onMounted, ref} from "vue";
    import {NInput, NSelect} from "naive-ui";
    import {ElNotification} from 'element-plus';

    const {proxy} = getCurrentInstance();
    let data = ref();
    let getOrderStatus = 0;
    let insertCount = 0;
    const warn = message => {
        ElNotification({
            title: '叮！',
            message: h('i', {style: 'color: teal'}, message),
        })
    }
    const checkedRowKeysRef = ref([]);
    const handleCheck = (rowKeys) => {
        if (rowKeys.length > 3)
            warn("一次最多只能选择三条数据！")
        else
            checkedRowKeysRef.value = rowKeys;
    }

    function handlePositiveClick() {
        //确认
        saveData()
    }

    function handleNegativeClick() {
        //取消
    }

    let modifyingDataArr = []
    const saveData = () => {
        console.log(modifyingDataArr);
        proxy.$api.order.modifyOrder("/order/modifyOrder",

            modifyingDataArr
        ).then(
            res => {
                if (!res.data)
                    warn("操作失败！")
                else warn("操作成功！")
            },
            err => {
                warn(err.reason)
            })
    }

    const insertOrder = () => {
        if(getOrderStatus === 0)
            warn("请先查询订单再添加！")
        else{
            let temp = [];
            proxy.$api.order.insertOrder("/order/insert",
                {
                    id: 0,
                    startTime: '',
                    list: '',
                    amount: 0,
                    orderStatus: 0,
                    message: '',
                    customerId: getOrderStatus
                }
            ).then(
                res => {
                    if (!res.data) {
                        warn("添加失败！")
                    } else {
                        for (let j = 0; j < res.data.length; j++) {
                            temp.push({
                                key: res.data[j].id,
                                list: res.data[j].list,
                                startTime: res.data[j].startTime,
                                customerId: res.data[j].customerId,
                                message: res.data[j].message,
                                orderStatus: res.data[j].orderStatus,
                                amount: res.data[j].amount,
                                id: res.data[j].id
                            })
                        }
                        data.value = temp
                        warn("添加了一条“进行中”订单！")
                    }
                },
                err => {
                    warn(err.reason)
                })
        }

    }
    const createColumns = () => [
        {
            type: "selection",
        },
        {
            title: "订单ID",
            key: "id",
            render(row, index) {
                return h(NInput, {
                    value: row.id,
                    // disabled:true,
                    onUpdateValue(v) {
                        warn("不支持修改订单ID！")
                        // data.value[index].id = v;
                    }
                });
            }
        },
        {
            title: "创建时间",
            key: "startTime",
            render(row, index) {
                return h(NInput, {
                    value: row.startTime,
                    onUpdateValue(v) {
                        data.value[index].startTime = v;
                        let temp = data.value[index]
                        delete temp.key
                        modifyingDataArr[row.id] = temp;
                    }
                });
            }
        },
        {
            title: "订单内容",
            key: "list",
            render(row, index) {
                return h(NInput, {
                    value: row.list,
                    onUpdateValue(v) {
                        data.value[index].list = v;
                        let temp = data.value[index]
                        delete temp.key
                        modifyingDataArr[row.id] = temp;
                    }
                });
            }
        },
        {
            title: "总金额",
            key: "amount",
            render(row, index) {
                return h(NInput, {
                    value: row.amount,
                    onUpdateValue(v) {
                        data.value[index].amount = v;
                        let temp = data.value[index]
                        delete temp.key
                        modifyingDataArr[row.id] = temp;
                    }
                });
            }
        },
        {
            title: "订单状态",
            key: "orderStatus",
            render(row, index) {
                return h(NSelect, {
                    options: [
                        {
                            value: 1,
                            label: "已完成"
                        },
                        {
                            value: -1,
                            label: "已失败"
                        },
                        {
                            value: 0,
                            label: "进行中"
                        },
                    ],
                    value: row.orderStatus,
                    onUpdateValue(v) {
                        data.value[index].orderStatus = v;
                        let temp = data.value[index]
                        delete temp.key
                        modifyingDataArr[row.id] = temp;
                    }
                });
            }
        },
        {
            title: "备注",
            key: "message",
            render(row, index) {
                return h(NInput, {
                    value: row.message,
                    onUpdateValue(v) {
                        data.value[index].message = v;
                        let temp = data.value[index]
                        delete temp.key
                        modifyingDataArr[row.id] = temp;
                    }
                });
            }
        },
        {
            title: "顾客ID",
            key: "customerId",
            render(row, index) {
                return h(NInput, {
                    value: row.customerId,
                    onUpdateValue(v) {
                        data.value[index].customerId = v;
                        let temp = data.value[index]
                        delete temp.key
                        modifyingDataArr[row.id] = temp;
                    }
                });
            }
        }
    ];

    onUpdated(() => {

    })
    const deleteOrder = () => {
        if(checkedRowKeysRef.value.length === 0)
            warn("请先选择要删除的订单！")
        else{
            let temp = [];
            proxy.$api.order.deleteOrder("/order/deleteOrder", {
                orderId: checkedRowKeysRef.value,
                status: getOrderStatus
            }).then(
                res => {
                    for (let j = 0; j < res.data.length; j++) {
                        temp.push({
                            key: res.data[j].id,
                            list: res.data[j].list,
                            startTime: res.data[j].startTime,
                            customerId: res.data[j].customerId,
                            message: res.data[j].message,
                            orderStatus: res.data[j].orderStatus,
                            amount: res.data[j].amount,
                            id: res.data[j].id
                        })
                    }
                    data.value = temp
                    checkedRowKeysRef.value.splice(0,checkedRowKeysRef.value.length)
                },
                err => {
                    warn(err.reason)
                })
        }
    }
    const rowClassName = (row) => {
        console.log(row)
        if (row.orderStatus === -1 || row.orderStatus === "-1") {
            return "too-old";
        }
        return "";
    }
    let columns = createColumns();
    onMounted(()=>{
        getOrder(1)
    })
    const getOrder = (i) => {
        getOrderStatus = i
        let temp = [];
        let status = ''
        if (i === 1)
            proxy.$api.order.getOrder("/order/getCurrentOrder").then(
                res => {
                    for (let j = 0; j < res.data.length; j++) {
                        temp.push({
                            key: res.data[j].id,
                            list: res.data[j].list,
                            startTime: res.data[j].startTime,
                            customerId: res.data[j].customerId,
                            message: res.data[j].message,
                            orderStatus: res.data[j].orderStatus,
                            amount: res.data[j].amount,
                            id: res.data[j].id
                        })
                    }
                    data.value = temp
                },
                err => {
                    warn(err.reason)
                })
        else proxy.$api.order.getOrder("/order/getHistoryOrder").then(
            res => {
                for (let j = 0; j < res.data.length; j++) {
                    temp.push({
                        key: res.data[j].id,
                        list: res.data[j].list,
                        startTime: res.data[j].startTime,
                        customerId: res.data[j].customerId,
                        message: res.data[j].message,
                        orderStatus: res.data[j].orderStatus,
                        amount: res.data[j].amount,
                        id: res.data[j].id
                    })
                }
                data.value = temp
            },
            err => {
                warn(err.reason)
            })
    }

    let pagination = {
        pageSize: 10
    }


</script>

<style scoped>
  .n-data-table {
    margin: 10px 30px;
    width: 1200px;
    height: 450px;
    box-shadow: 25px 25px 40px -23px grey;
    background-color: #ffffff;
  }

  .n-p {
    margin-left: 30px;
    position: absolute;
    right: 200px;
    top: 100px;
    z-index: 7;
  }

  .n-button {
    width: 120px;
    margin: 5px 5px 5px 30px;
  }

  #saveButton {
    width: 120px;
    float: right;
    margin-right: 40px;
  }

  :deep(.too-old td) {
    border: 1px solid #fc0017 !important;
    border-radius: 7px;
    animation: fade 1200ms;
  }

  :deep(.age) {
    background-color: rgba(0, 128, 0, 0.75) !important;
  }

  :deep(.too-old .age) {
    background-color: rgba(0, 0, 128, 0.75) !important;
  }


  @keyframes fade {
    from {

      opacity: 1.0;
    }
    50% {
      opacity: 0.0;
    }
    to {
      opacity: 1.0;
    }

  }
</style>

