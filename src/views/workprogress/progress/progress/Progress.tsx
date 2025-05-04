import { useState, useRef } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import Avatar, { AvatarProps } from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { HiCheck, HiOutlineEye, HiX, HiTag } from 'react-icons/hi'

type Comment = {
  id: string
  name: string
  img: string
  time: string
  comment: string
  actionType?: string
}

const TimelineAvatar = ({ children, ...rest }: AvatarProps) => {
  return (
    <Avatar {...rest} size={30} shape="circle">
      {children}
    </Avatar>
  )
}

const StatusTag = ({ status, time }: { status: string, time: string }) => {
  const getTagStyle = () => {
    switch (status.toLowerCase()) {
      case 'approval':
      case 'approved':
        return {
          bg: 'bg-emerald-500',
          icon: <HiCheck className="text-white" />,
          text: 'Approved'
        }
      case 'check':
      case 'checked':
        return {
          bg: 'bg-yellow-500',
          icon: <HiOutlineEye className="text-white" />,
          text: 'Checked'
        }
      case 'reject':
      case 'rejected':
        return {
          bg: 'bg-red-500',
          icon: <HiX className="text-white" />,
          text: 'Rejected'
        }
      default:
        return {
          bg: 'bg-blue-500',
          icon: <HiTag className="text-white" />,
          text: 'General'
        }
    }
  }

  const tagStyle = getTagStyle()

  return (
    <div className="flex items-center">
      <Tag
        prefix
        className={`${tagStyle.bg} text-white mr-2 rtl:ml-2`}
        prefixClass={tagStyle.bg}
      >
        <span className="flex items-center">
          <span className="mr-1">{tagStyle.icon}</span>
          {tagStyle.text}
        </span>
      </Tag>
      <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
    </div>
  )
}

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex mb-4">
      <div className="flex-shrink-0 mr-3">
        <TimelineAvatar src={comment.img} />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-semibold text-gray-900 dark:text-gray-100 mr-2">
            {comment.name}
          </span>
          <StatusTag status={comment.actionType || 'general'} time={comment.time} />
        </div>
        <p className="text-gray-800 dark:text-gray-200 pl-1">
          {comment.comment}
        </p>
      </div>
    </div>
  )
}

const Progress = ({ projectId }: { projectId: string }) => {
    const [loading, setLoading] = useState(false)
    const [commenting, setCommenting] = useState(false)
    const commentInput = useRef<HTMLInputElement>(null)
    
    // Fake data for comments
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            name: 'John Doe',
            img: '/img/avatars/thumb-1.jpg',
            time: '10:30 AM, 12 May',
            comment: 'Initial project setup completed',
            actionType: 'approved'
        },
        {
            id: '2',
            name: 'Jane Smith',
            img: '/img/avatars/thumb-2.jpg',
            time: '11:45 AM, 12 May',
            comment: 'Please review the design mockups',
            actionType: 'check'
        },
        {
            id: '3',
            name: 'Mike Johnson',
            img: '/img/avatars/thumb-3.jpg',
            time: '2:15 PM, 12 May',
            comment: 'The budget needs to be adjusted',
            actionType: 'rejected'
        },
        {
            id: '4',
            name: 'Sarah Williams',
            img: '/img/avatars/thumb-4.jpg',
            time: '4:30 PM, 12 May',
            comment: 'All dependencies have been installed',
            actionType: 'approved'
        }
    ])

    const submitComment = () => {
        const message = commentInput.current?.value
        if (!message?.trim()) return

        try {
            setCommenting(true)
            
            const newComment = {
                id: Date.now().toString(),
                name: 'You',
                img: '/img/avatars/thumb-1.jpg',
                time: 'just now',
                comment: message,
                actionType: 'general'
            }
            
            setComments(prev => [newComment, ...prev])
            if (commentInput.current) {
                commentInput.current.value = ''
            }
        } finally {
            setCommenting(false)
        }
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                <AdaptableCard bodyClass="p-5">
                    <h4 className="text-lg font-semibold mb-4">Work Progress</h4>
                    
                    <div className="mb-6">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                    
                    <div className="mt-6 mb-3 flex flex-auto">
                        <TimelineAvatar src="/img/avatars/thumb-1.jpg" />
                        <div className="ml-4 rtl:mr-4 w-full">
                            <Input
                                ref={commentInput}
                                textArea
                                placeholder="Leave a comment"
                                disabled={commenting}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <Button
                            variant="solid"
                            onClick={submitComment}
                            loading={commenting}
                            disabled={commenting}
                        >
                            Comment
                        </Button>
                    </div>
                </AdaptableCard>
            </Loading>
        </Container>
    )
}

export default Progress