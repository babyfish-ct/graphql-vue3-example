import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import DepartmentManagement from '../department/ManagementView';
import EmployeeManagement from '../employee/ManagementView';

Vue.use(VueRouter)

export const DEPARTMENTS = "departments";
export const EMPLOYEES = "employees";

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: '',
        redirect: `/${DEPARTMENTS}`
    },
    {
        path: `/${DEPARTMENTS}`,
        name: DEPARTMENTS,
        component: DepartmentManagement
    },
    {
        path: `/${EMPLOYEES}`,
        name: EMPLOYEES,
        component: EmployeeManagement
    }
]

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
