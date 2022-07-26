import Login from "@/views/Login.vue";
import Index from "@/views/Index.vue";
import UserManagement from "@/views/sys/UserManagement.vue";
import RoleManagement from "@/views/sys/RoleManagement.vue";
import Goods from "@/views/goods/Goods.vue";
import Order from "@/views/order/Order.vue";
import SetMeal from "@/views/setmeal/SetMeal.vue";
import MenuManagement from "../views/sys/MenuManagement";
import Customer from "../views/customer/Customer";
import Category from "@/views/goods/Category";
import {createRouter, createWebHistory} from "vue-router";

// 创建路由表
const routes = [
    {
        path: "/",
        name: "Login",
        component: Login
    },
    {
        path: "/index",
        name: "Index",
        component: Index,
        children: [
            {
                path: "user",
                name: "UserManagement",
                component: UserManagement,
            },
            {
                path: "role",
                name: "RoleManagement",
                component: RoleManagement,
            },
            {
                path: "menu",
                name: "MenuManagement",
                component: MenuManagement,
            },
            {
                path: "goods",
                name: "Goods",
                component: Goods
            },
            {
                path: "setmeal",
                name: "SetMeal",
                component: SetMeal,
            },
            {
                path: "order",
                name: "Order",
                component: Order,
            },
            {
                path: "customer",
                name: "Customer",
                component: Customer,
            },
            {
                path: "category",
                name: "Category",
                component: Category,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export {router};