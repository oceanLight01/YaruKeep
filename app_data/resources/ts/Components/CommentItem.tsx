import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentDeleteButton from './atoms/CommentDeleteButton';
import { useAuth } from './Authenticate';
import CommentForm from './CommentForm';
import formatText from './FormatText';

type Props = {
    item: CommentItem;
    updateHabit: (habitItem: HabitItem) => void;
    deleteComment: (commentId: number) => void;
};

const CommentItem = ({ item, updateHabit, deleteComment }: Props) => {
    const auth = useAuth();
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

    return (
        <li>
            <p>{formatText(item.comment)}</p>
            <p>
                <Link to={`/user/${item.user.screen_name}`}>{item.user.name}</Link>
            </p>
            <div>
                {showCommentForm ? (
                    <CommentForm
                        {...{
                            id: item.id,
                            userId: auth?.userData?.id!,
                            itemId: item.item_id,
                            parentId: item.parent_id,
                            updateHabit: updateHabit,
                        }}
                    />
                ) : null}
                <button onClick={() => setShowCommentForm(!showCommentForm)}>
                    {showCommentForm ? '戻る' : 'コメントする'}
                </button>
                {auth?.userData?.id === item.user.id && (
                    <CommentDeleteButton id={item.id} deleteComment={deleteComment} />
                )}
            </div>
        </li>
    );
};

export default CommentItem;
