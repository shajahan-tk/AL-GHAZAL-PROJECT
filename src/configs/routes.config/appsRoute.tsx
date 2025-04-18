import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'apps.dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        component: lazy(() => import('@/views/project/ProjectDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsEstimation.estimationList',
        path: `${APP_PREFIX_PATH}/estimation-list`,
        component: lazy(() => import('@/views/estimation/estimationlist/EstimationList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsEstimationCreation.estimationCreation',
        path: `${APP_PREFIX_PATH}/create-estimation`,
        component: lazy(() => import('@/views/estimation/estimationcreation/EstimationCreations')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsEstimation.estimationView',
        path: `${APP_PREFIX_PATH}/estimation/:id`,
        component: lazy(() => import('@/views/estimation/estimationView/EstimationView')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsUsers.userNew',
        path: `${APP_PREFIX_PATH}/user-new`,
        component: lazy(() => import('@/views/users/UserNew/UserNew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsUsers.usersList',
        path: `${APP_PREFIX_PATH}/user-list`,
        component: lazy(() => import('@/views/users/UserList/UserList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsClients.clientsList',
        path: `${APP_PREFIX_PATH}/client-list`,
        component: lazy(() => import('@/views/client/ClientList/ClientList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsClients.ClientNew',
        path: `${APP_PREFIX_PATH}/client-new`,
        component: lazy(() => import('@/views/client/ClientNew/ClientNew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProjectNew.projectNew',
        path: `${APP_PREFIX_PATH}/project-new`,
        component: lazy(() => import('@/views/projectNew/ProjectNew/ProjectForm')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProjectList.ProjectList',
        path: `${APP_PREFIX_PATH}/project-list`,
        component: lazy(() => import('@/views/projectNew/ProjectList/components/ProjectTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProjectView.ProjectView',
        path: `${APP_PREFIX_PATH}/project-view/:id`,
        component: lazy(() => import('@/views/ProjectView/ProjectView/Wallets')),
        authority: [ADMIN, USER],
    },
    
    
]

export default appsRoute
