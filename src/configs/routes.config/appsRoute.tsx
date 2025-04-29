import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, ENGINEER, SUPERADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'apps.dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        component: lazy(() => import('@/views/project/ProjectDashboard')),
        authority: [ADMIN, USER,ENGINEER,SUPERADMIN],
    },
    {
        key: 'appsEstimation.estimationList',
        path: `${APP_PREFIX_PATH}/estimation-list`,
        component: lazy(() => import('@/views/estimation/estimationlist/EstimationList')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsEstimationCreation.estimationCreation',
        path: `${APP_PREFIX_PATH}/create-estimation`,
        component: lazy(() => import('@/views/estimation/estimationcreation/EstimationCreations')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsEstimation.estimationView',
        path: `${APP_PREFIX_PATH}/estimation/:id`,
        component: lazy(() => import('@/views/estimation/estimationView/EstimationView')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsEstimationView.estimationView',
        path: `${APP_PREFIX_PATH}/estimation-view/:id`,
        component: lazy(() => import('@/views/estimation/estimationViews/EstimationView')),
        authority: [ADMIN, USER,SUPERADMIN],
    },    
    {
        key: 'appsUsers.userNew',
        path: `${APP_PREFIX_PATH}/user-new`,
        component: lazy(() => import('@/views/users/UserNew/UserNew')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsUsers.userForm',
        path: `${APP_PREFIX_PATH}/user-form/:id?`, // Make id optional
        component: lazy(() => import('@/views/users/UserNew/UserNew')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsUsers.usersList',
        path: `${APP_PREFIX_PATH}/user-list`,
        component: lazy(() => import('@/views/users/UserList/UserList')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsUserView.UserView',
        path: `${APP_PREFIX_PATH}/user-view/:id`,
        component: lazy(() => import('@/views/users/CustomerDetail/CustomerDetail')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsClients.clientsList',
        path: `${APP_PREFIX_PATH}/client-list`,
        component: lazy(() => import('@/views/client/ClientList/ClientList')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsClients.ClientNew',
        path: `${APP_PREFIX_PATH}/client-new`,
        component: lazy(() => import('@/views/client/ClientNew/ClientNew')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsClients.clientForm',
        path: `${APP_PREFIX_PATH}/client-form/:id?`, // Make id optional
        component: lazy(() => import('@/views/client/ClientNew/ClientNew')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsClients.clientView',
        path: `${APP_PREFIX_PATH}/client-view/:id?`, // Make id optional
        component: lazy(() => import('@/views/client/CustomerDetail/CustomerDetail')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsProjectNew.projectNew',
        path: `${APP_PREFIX_PATH}/project-new`,
        component: lazy(() => import('@/views/projectNew/ProjectNew/ProjectForm')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsProjectEdit.projectEdit',
        path: `${APP_PREFIX_PATH}/project-edit/:id`,
        component: lazy(() => import('@/views/projectNew/ProjectNew/ProjectForm')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsProjectList.ProjectList',
        path: `${APP_PREFIX_PATH}/project-list`,
        component: lazy(() => import('@/views/projectNew/ProjectList/components/ProjectTable')),
        authority: [ADMIN, USER,SUPERADMIN],
    },

    {
        key: 'appsProjectView.ProjectView',
        path: `${APP_PREFIX_PATH}/project-view/:id`,
        component: lazy(() => import('@/views/ProjectView/ProjectView/Wallets')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsQuotation.quotationNew',
        path: `${APP_PREFIX_PATH}/quotation-new`,
        component: lazy(() => import('@/views/quotation/quotationcreation/QuotationCreations')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'apps.ongoingworks',
        path: `${APP_PREFIX_PATH}/ongoingworks`,
        component: lazy(() => import('@/views/workstatus/ProjectDashboard/ProjectDashboard')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    {
        key: 'appsQuotationView.QuotationView',
        path: `${APP_PREFIX_PATH}/quotation-view`,
        component: lazy(() => import('@/views/quotation/quotationview/QuotationView')),
        authority: [ADMIN, USER,SUPERADMIN],
    },
    
    
]

export default appsRoute
