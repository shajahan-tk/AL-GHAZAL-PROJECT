import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const appsNavigationConfig: NavigationTree[] = [
    {
        key: 'apps',
        path: '',
        title: 'APPS',
        translateKey: 'nav.apps',
        icon: 'apps',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        subMenu: [
             {
                        key: 'apps.dashboard',
                        path: `${APP_PREFIX_PATH}/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.apps.dashboard',
                        icon: 'project',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
           },
        
            {
                key: 'apps.estimation',
                path: '',
                title: 'Estimation',
                translateKey: 'nav.appsEstimation.estimation',
                icon: 'crm',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    
                    {
                        key: 'appsEstimation.estimationList',
                        path: `${APP_PREFIX_PATH}/estimation-list`,
                        title: 'List Estimation ',
                        translateKey: 'nav.appsEstimation.estimationList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appsEstimationCreation.estimationCreation',
                        path: `${APP_PREFIX_PATH}/create-estimation`,
                        title: 'Create Estimation ',
                        translateKey: 'nav.appsEstimationCreation.estimationCreation',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    
                ],
            },
            
            {
                key: 'apps.users',
                path: '',
                title: 'Users',
                translateKey: 'nav.appsUsers.users',
                icon: 'crm',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    
                    {
                        key: 'appsUsers.usersList',
                        path: `${APP_PREFIX_PATH}/user-list`,
                        title: ' User List',
                        translateKey: 'nav.appsUsers.usersList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appsUsers.userNew',
                        path: `${APP_PREFIX_PATH}/user-new`,
                        title: ' User New',
                        translateKey: 'nav.appsUsers.userNew',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                  
                    
                ],
            },

            {
                key: 'apps.clients',
                path: '',
                title: 'Clients',
                translateKey: 'nav.appsClients.clients',
                icon: 'crm',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    
                    {
                        key: 'appsClients.clientsList',
                        path: `${APP_PREFIX_PATH}/client-list`,
                        title: ' Client List',
                        translateKey: 'nav.appsClients.clientsList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appsClients.ClientNew',
                        path: `${APP_PREFIX_PATH}/client-new`,
                        title: 'Client New',
                        translateKey: 'nav.appsClients.ClientNew',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                  
                    
                ],
            },
            {
                key: 'apps.project',
                path: '',
                title: 'Project',
                translateKey: 'nav.appsProjectNew.project',
                icon: 'crm',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    
                    {
                        key: 'appsProjectNew.projectNew',
                        path: `${APP_PREFIX_PATH}/project-new`,
                        title: ' Project New',
                        translateKey: 'nav.appsProjectNew.projectNew',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    // {
                    //     key: 'appsClients.ClientNew',
                    //     path: `${APP_PREFIX_PATH}/client-new`,
                    //     title: 'Client New',
                    //     translateKey: 'nav.appsClients.ClientNew',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [ADMIN, USER],
                    //     subMenu: [],
                    // },
                  
                    
                ],
            },
        ],
    },
]

export default appsNavigationConfig
