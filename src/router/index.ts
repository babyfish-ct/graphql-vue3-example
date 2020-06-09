import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import DepartmentManagement from '../department/ManagementView';
import EmployeeManagement from '../department/ManagementView';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'deparmtents',
        redirect: '/departments'
    },
    {
        path: '/departments',
        name: 'deparmtents',
        component: DepartmentManagement
    },
    {
        path: '/employees',
        name: 'employees',
        component: EmployeeManagement
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
