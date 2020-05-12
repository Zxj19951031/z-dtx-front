import Vue from 'vue'
import Router from 'vue-router'
import DatabaseManager from "@/components/database/DatabaseManager";
import Rule from '@/components/rule/Rule'
import Transport from "@/components/transport/Transport";
import AddOrEditTransport from "@/components/transport/AddOrEditTransport";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/components/database/DatabaseManager',
            name: 'DatabaseManager',
            component: DatabaseManager
        },
        {
            path: '/components/rule/Rule',
            name: 'Rule',
            component: Rule
        },
        {
            path: '/components/data/Transport',
            name: 'Transport',
            component: Transport
        },
        {
            path: '/components/transport/AddOrEditTransport',
            name: 'AddOrEditTransport',
            component: AddOrEditTransport
        }
    ]
})