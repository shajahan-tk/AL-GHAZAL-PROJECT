import { useState, useMemo, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiUser } from 'react-icons/fi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import UserDeleteConfirmation from './UserDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { fetchUser } from '../../api/api'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import Input from '@/components/ui/Input'

type User = {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneNumbers: string[]
    role: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    createdBy: string
    __v: number
}

type Pagination = {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

const userStatusColor = {
    true: {
        label: 'Active',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    false: {
        label: 'Inactive',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    }
}

const ActionColumn = ({ row }: { row: User }) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/app/users/user-edit/${row._id}`)
    }

    const onDelete = () => {
        // Handle delete directly here or use a context/state management
        console.log('Delete user:', row._id)
    }

    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onEdit}
            >
                <HiOutlinePencil />
            </span>
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onDelete}
            >
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const UserColumn = ({ row }: { row: User }) => {
    return (
        <div className="flex items-center">
            <Avatar icon={<FiUser />} />
            <span className="ml-2 rtl:mr-2 font-semibold">
                {row.firstName} {row.lastName}
            </span>
        </div>
    )
}

const UserTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
    })
    
    const { data: response, isLoading, error, refetch } = useQuery({
        queryKey: ['users', pagination.page, pagination.limit, searchTerm],
        queryFn: () => fetchUser({
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm
        }),
    })

    // Update your fetchUser function in api.ts to accept params:
    /*
    export const fetchUser = async (params?: {
        page?: number
        limit?: number
        search?: string
    }) => {
        try {
            const response = await BaseService.get("/user", { params })
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    */

    const users = response?.data?.users || []
    const paginationData = response?.data?.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    }

    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            setSearchTerm(value)
            setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page on search
        }, 500),
        []
    )

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value)
    }

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => <UserColumn row={props.row.original} />,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => <span>{props.row.original.email}</span>,
            },
            {
                header: 'Phone Number',
                accessorKey: 'phoneNumbers',
                cell: (props) => (
                    <span>{props.row.original.phoneNumbers?.[0] || 'N/A'}</span>
                ),
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: (props) => (
                    <span className="capitalize">{props.row.original.role}</span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const isActive = props.row.original.isActive
                    const status = userStatusColor[isActive.toString() as keyof typeof userStatusColor]
                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={status.dotClass} />
                            <span className={`capitalize font-semibold ${status.textClass}`}>
                                {status.label}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }))
    }

    const onSelectChange = (limit: number) => {
        setPagination(prev => ({ page: 1, limit })) // Reset to first page when changing page size
    }

    if (error) {
        return <div>Error loading users: {(error as Error).message}</div>
    }

    return (
        <>
            <div className="mb-4">
                <Input
                    placeholder="Search users..."
                    onChange={handleSearchChange}
                    className="max-w-md"
                />
            </div>
            
            <DataTable
                ref={tableRef}
                columns={columns}
                data={users}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={isLoading}
                pagingData={{
                    total: paginationData.total,
                    pageIndex: paginationData.page,
                    pageSize: paginationData.limit,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
            />
            <UserDeleteConfirmation />
        </>
    )
}

export default UserTable