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
    <n-button @click="activate">
      日期筛选
    </n-button>
    <n-input v-model:value="search" type="text" placeholder="根据订单内容搜索" style="width: 180px;margin-left: 10px"/>
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
            :data="filterTableData"
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
    <n-drawer v-model:show="active" :width="502" placement="top" style="height: 500px;">
      <n-drawer-content title="请选择筛选的日期区间">
        <n-calendar
                id="cal1"
                v-model:value="calendarValue"
                #="{ year, month, date }"
                @update:value="handleUpdateValue"
                style="width: 500px;height: 320px;"
        >
          {{ year }}-{{ month }}-{{ date }}
        </n-calendar>
        <n-calendar
                id="cal2"
                v-model:value="calendarValue2"
                #="{ year, month, date }"
                @update:value="handleUpdateValue2"
                style="width: 500px;height: 320px;"
        >
          {{ year }}-{{ month }}-{{ date }}
        </n-calendar>
        <n-button @click="confirmDate" type="info">
          提交
        </n-button>
      </n-drawer-content>

    </n-drawer>
  </div>
</template>

<script setup>
    import {computed, getCurrentInstance, h, onMounted, onUpdated, ref} from "vue";
    import {NInput, NSelect} from "naive-ui";
    import {addDays} from "date-fns/esm";
    import {ElNotification} from 'element-plus';

    const {proxy} = getCurrentInstance();
    let data = ref([])
    let getOrderStatus = 0;
    let insertCount = 0;
    let deleteStatus = false
    let calendarValue = ref(addDays(Date.now(), 1).valueOf());
    let calendarValue2 = ref(addDays(Date.now(), 1).valueOf());
    let chosenDate = ref([])
    let total = []
    let date1 = ''
    let date2 = ''
    const handleUpdateValue = (_, {year, month, date}) => {
        chosenDate.value[0] = `${year}-${month}-${date}`
    };
    const handleUpdateValue2 = (_, {year, month, date}) => {
        chosenDate.value[1] = `${year}-${month}-${date}`
        // console.log(chosenDate.value)
    };
    let filterTableData = computed(() =>
        data.value.filter(
            d => {
                return !search.value || d.list.indexOf(search.value) !== -1
                // betweenDates(d.startTime)
            }
        )
    )
    const confirmDate = () => {
        if (!chosenDate.value[0] || !chosenDate.value[1]) warn("请先选择日期")
        else {
            date1 = new Date(chosenDate.value[0]);
            date2 = new Date(chosenDate.value[1]);

            data.value = data.value.filter(
                d => {
                    return betweenDates(d.startTime)
                }
            )
            active.value = false
        }
    };
    const betweenDates = date => {
        date = date.split(" ")[0]
        if (date1 && date2) {
            let ch = new Date(date)
            return date1 < ch && ch < date2;
        }
        return false;
    }
    const active = ref(false);
    const activate = () => {
        active.value = true;
        data.value = total
    };
    const warn = message => {
        ElNotification({
            title: '叮！',
            message: h('i', {style: 'color: teal'}, message),
        })
    }

    const search = ref('')

    const checkedRowKeysRef = ref([]);
    const handleCheck = (rowKeys) => {
        if (deleteStatus) {
            rowKeys.splice(0, rowKeys.length - 1)
            deleteStatus = false
        }
        if (rowKeys.length > 3) {
            warn("一次最多只能选择三条数据！")
            rowKeys.pop()
        } else {
            // warn("")
            checkedRowKeysRef.value = rowKeys;
        }

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
        // console.log(modifyingDataArr);
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
        if (getOrderStatus === 0)
            warn("请先查询订单再添加！")
        else {
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
                        let temp = data.value[index];
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
        if (checkedRowKeysRef.value.length === 0)
            warn("请先选择要删除的订单！")
        else {
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
                    checkedRowKeysRef.value.splice(0, checkedRowKeysRef.value.length)
                    deleteStatus = true
                },
                err => {
                    warn(err.reason)
                })
        }
    }
    const rowClassName = (row) => {
        // console.log(row)
        if (row.orderStatus === -1 || row.orderStatus === "-1") {
            return "too-old";
        }
        return "";
    }
    let columns = createColumns();
    onMounted(() => {
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
                    total = temp
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
                total = temp
            },
            err => {
                warn(err.reason)
            })
    }

    let pagination = {
        pageSize: 10
    }


</script>

<style scoped lang="less">
  .n-data-table {
    margin: 10px 30px;
    width: 1200px;
    height: 577px;
    box-shadow: 25px 25px 40px -23px grey;
    background-color: #ffffff;
  }

  .n-p {
    margin-left: 30px;
    position: absolute;
    right: 200px;
    top: 93px;
    z-index: 7;
    font-weight: 600;
    font-size: 16px;
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
    /*border: 1px solid #fc0017 !important;*/
    /*border-radius: 7px;*/
    animation: fade 1200ms;

    input {
      color: red;
    }

    div {
      color: red;
    }
  }

  :deep(.age) {
    background-color: rgba(0, 128, 0, 0.75) !important;
  }

  :deep(.too-old .age) {
    background-color: rgba(0, 0, 128, 0.75) !important;
  }

  .n-drawer {
    position: relative;

    #cal1 {
      position: absolute;
      top: 0;
      left: 310px;
    }

    #cal2 {
      position: absolute;
      top: 0;
      left: 840px;
    }

    .n-button {
      position: absolute;
      right: 1%;
      bottom: 1%;
    }

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

