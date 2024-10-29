import React, { useState, useEffect } from 'react'

/**
 * Reply type.
 */
type Reply = {
    id: number
    text: string
    userId: string
}

/**
 * Comment type.
 * Even though we repeat most of Reply type here I believe it is better to keep as a separate type for clarity.
 */
type Comment = {
    id: number
    text: string
    userId: string
    replies: Reply[]
}

/**
 * Generate a unique comment id.
 * For now we are using simple timestamps as ids, but in production we might want to use something more sophisticated.
 * We would also probably import that function from a utility library instead.
 */
const generateId = () => Date.now()

const CommentComponent: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([])
    const [commentText, setCommentText] = useState<string>('')
    const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({}) // A dictionary to keep track of replies for each comment
    const currentUserId = 'random-id' // To be replaced with actual user id in production

    /**
     * Fetch comments from local storage on component mount.
     * This could just as well be a local database or an API call
     * If the user is logged in and online we might want to fetch the comments from the server if localstorage is empty.
     */
    useEffect(() => {
        const savedComments = JSON.parse(localStorage.getItem('comments') || '[]')
        if (savedComments.length > 0) {
            setComments(savedComments)
        }
    }, [])

    /**
     * Save comments to local storage whenever the comments change.
     */
    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comments))
    }, [comments])

    /**
     * Add a new comment to the list of comments with empty array of replies.
     */
    const addComment = () => {
        if (commentText.trim()) {
            setComments([...comments, { id: generateId(), text: commentText, userId: currentUserId, replies: [] }])
            setCommentText('')
        }
    }

    /**
     * Delete a comment from the list of comments based on the id.
     * Only the user who created the comment can delete it.
     */
    const deleteComment = (id: number) => {
        setComments(comments.filter((comment) => comment.id !== id || comment.userId !== currentUserId))
    }

    /**
     * Add a reply to a comment, based on comment's id.
     */
    const addReply = (id: number) => {
        const replyTextValue = replyTexts[id]
        if (replyTextValue && replyTextValue.trim()) {
            const newComments = comments.map((comment) => {
                if (comment.id === id) {
                    return {
                        ...comment,
                        replies: [
                            ...comment.replies,
                            { text: replyTextValue, id: generateId(), userId: currentUserId },
                        ],
                    }
                }
                return comment
            })
            setComments(newComments) // Update the comments with the new reply
            setReplyTexts({ ...replyTexts, [id]: '' }) // Reset the reply text after adding the reply
        }
    }

    /**
     * Delete a reply from a comment.
     * The reply is deleted from the list of replies of the comment based on the reply id.
     * Only the user who created the reply can delete it.
     */
    const deleteReply = (commentId: number, replyId: number) => {
        const newComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: comment.replies.filter((reply) => reply.id !== replyId || reply.userId !== currentUserId),
                }
            }
            return comment
        })
        setComments(newComments)
    }

    /**
     * Handle reply text change for a comment.
     * This is used to update the reply text in the state as user types.
     * This is needed as we have multiple reply text inputs and we need to keep track of the text in each of them.
     */
    const handleReplyTextChangeForComment = (id: number, value: string) => {
        setReplyTexts({ ...replyTexts, [id]: value })
    }

    return (
        <div>
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <button onClick={addComment}>Add Comment</button>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        {comment.text}
                        {/* Only the user who created the comment sees the option to delete it */}
                        {comment.userId === currentUserId && (
                            <button onClick={() => deleteComment(comment.id)}>Delete</button>
                        )}
                        <div>
                            <input
                                type="text"
                                value={replyTexts[comment.id] || ''}
                                onChange={(e) => handleReplyTextChangeForComment(comment.id, e.target.value)}
                            />
                            <button onClick={() => addReply(comment.id)}>Reply</button>
                        </div>
                        <ul>
                            {comment.replies.map((reply) => (
                                <li key={reply.id}>
                                    {reply.text}
                                    {/* Only the user who created the reply sees the option to delete it */}
                                    {reply.userId === currentUserId && (
                                        <button onClick={() => deleteReply(comment.id, reply.id)}>Delete</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CommentComponent
