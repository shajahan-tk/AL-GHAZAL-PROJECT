import { useState, useRef, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import Avatar, { AvatarProps } from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import ProgressBar from './ProgressBar'
import { HiCheck, HiOutlineEye, HiX, HiTag, HiOutlineArrowUp } from 'react-icons/hi'
import { apiGetProjectProgressUpdates, apiPostProjectProgressUpdate } from '../../api/api'
import { useParams } from 'react-router-dom'

type Comment = {
  id: string
  name: string
  img: string
  time: string
  comment: string
  actionType?: string
  progress?: number
}

const TimelineAvatar = ({ children, ...rest }: AvatarProps) => {
  return (
    <Avatar {...rest} size={36} shape="circle" className="ring-2 ring-white dark:ring-gray-800">
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
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          icon: <HiCheck className="text-emerald-600 dark:text-emerald-400" />,
          text: 'Approved',
          textColor: 'text-emerald-600 dark:text-emerald-400'
        }
      case 'check':
      case 'checked':
        return {
          bg: 'bg-amber-100 dark:bg-amber-500/20',
          icon: <HiOutlineEye className="text-amber-600 dark:text-amber-400" />,
          text: 'Checked',
          textColor: 'text-amber-600 dark:text-amber-400'
        }
      case 'reject':
      case 'rejected':
        return {
          bg: 'bg-red-100 dark:bg-red-500/20',
          icon: <HiX className="text-red-600 dark:text-red-400" />,
          text: 'Rejected',
          textColor: 'text-red-600 dark:text-red-400'
        }
      case 'progress_update':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-500/20',
          icon: <HiOutlineArrowUp className="text-indigo-600 dark:text-indigo-400" />,
          text: 'Progress Update',
          textColor: 'text-indigo-600 dark:text-indigo-400'
        }
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-500/20',
          icon: <HiTag className="text-blue-600 dark:text-blue-400" />,
          text: 'General',
          textColor: 'text-blue-600 dark:text-blue-400'
        }
    }
  }

  const tagStyle = getTagStyle()

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tagStyle.bg} ${tagStyle.textColor}`}>
        <span className="mr-1">{tagStyle.icon}</span>
        {tagStyle.text}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
    </div>
  )
}

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex mb-6 group">
      <div className="flex flex-col items-center mr-4">
        <TimelineAvatar src={comment.img} />
        <div className="w-px h-full bg-gray-200 dark:bg-gray-600 mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {comment.name}
          </span>
          <StatusTag status={comment.actionType || 'general'} time={comment.time} />
        </div>
        {comment.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {comment.progress}%
              </span>
            </div>
            <ProgressBar 
              percent={comment.progress} 
              showInfo={false}
              strokeColor="#4f46e5" // indigo-600
              trailColor="#e0e7ff" // indigo-100
              className="h-2"
            />
          </div>
        )}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200">
            {comment.comment}
          </p>
        </div>
      </div>
    </div>
  )
}

const Progress = () => {
    const [loading, setLoading] = useState(true)
    const [commenting, setCommenting] = useState(false)
    const [progress, setProgress] = useState(0)
    const commentInput = useRef<HTMLInputElement>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const {projectId}=useParams()
    
    useEffect(() => {
      const fetchProgressUpdates = async () => {
        try {
          setLoading(true)
          const response = await apiGetProjectProgressUpdates(projectId)
          if (response.data) {
            const formattedComments = response.data.map((item: any) => ({
              id: item._id,
              name: item.user?.firstName 
                ? `${item.user.firstName} ${item.user.lastName}`
                : 'Unknown User',
              img: item.user?.profileImage || '/img/avatars/thumb-1.jpg',
              time: new Date(item.createdAt).toLocaleString(),
              comment: item.content,
              actionType: item.actionType,
              progress: item.progress
            }))
            setComments(formattedComments)
            
            if (formattedComments.length > 0 && formattedComments[0].progress !== undefined) {
              setProgress(formattedComments[0].progress)
            }
          }
        } catch (error) {
          console.error('Failed to fetch progress updates:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchProgressUpdates()
    }, [projectId])

    const submitComment = async () => {
        const message = commentInput.current?.value
        if (!message?.trim()) return

        try {
            setCommenting(true)
            
            const response = await apiPostProjectProgressUpdate({
              projectId,
              progress,
              comment: message
            })
            
            if (response.data) {
              const newComment = {
                id: response.data._id,
                name: 'You',
                img: '/img/avatars/thumb-1.jpg',
                time: 'just now',
                comment: message,
                actionType: 'progress_update',
                progress: progress
              }
              
              setComments(prev => [newComment, ...prev])
              if (commentInput.current) {
                commentInput.current.value = ''
              }
            }
        } catch (error) {
            console.error('Failed to submit progress update:', error)
        } finally {
            setCommenting(false)
        }
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                <AdaptableCard bodyClass="p-6">
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Project Progress</h4>
                        <p className="text-gray-500 dark:text-gray-400">Track and update the current status of the project</p>
                    </div>
                    
                    <Card className="mb-8" bordered>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="text-md font-semibold">Current Progress</h5>
                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                    {progress}%
                                </span>
                            </div>
                            <ProgressBar 
                                percent={progress} 
                                showInfo={false}
                                className="mb-4"
                                strokeColor="#4f46e5"
                                trailColor="#e0e7ff"
                                className="h-3"
                            />
                            <div className="flex items-center gap-4">
                                <Input 
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={progress}
                                    onChange={(e) => setProgress(Number(e.target.value))}
                                    className="flex-1"
                                />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-12 text-center">
                                    {progress}%
                                </span>
                            </div>
                        </div>
                    </Card>
                    
                    <div className="mb-6">
                        <h5 className="text-md font-semibold mb-4">Progress History</h5>
                        {comments.length > 0 ? (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} />
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-8 border-dashed">
                                <p className="text-gray-500 dark:text-gray-400">No progress updates yet</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                    Be the first to update the progress
                                </p>
                            </Card>
                        )}
                    </div>
                    
                    <Card bordered>
                        <div className="p-5">
                            <div className="flex gap-4">
                                <TimelineAvatar src="/img/avatars/thumb-1.jpg" />
                                <div className="flex-1">
                                    <h6 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Add Progress Update
                                    </h6>
                                    <Input
                                        ref={commentInput}
                                        textArea
                                        placeholder="Describe what's been completed, any challenges, or next steps..."
                                        disabled={commenting}
                                        rows={3}
                                    />
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Progress will be saved with your comment
                                        </span>
                                        <Button
                                            variant="solid"
                                            onClick={submitComment}
                                            loading={commenting}
                                            disabled={commenting}
                                            icon={<HiOutlineArrowUp />}
                                        >
                                            Post Update
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </AdaptableCard>
            </Loading>
        </Container>
    )
}

export default Progress