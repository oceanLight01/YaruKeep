import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentDeleteButton from './atoms/CommentDeleteButton';
import { useAuth } from './Authenticate';
import CommentForm from './CommentForm';
import formatText from './FormatText';

type Props = {
    item: CommentItem;
    commentType: 'habit' | 'diary';
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
};

const CommentItem = ({ item, updateItem, commentType }: Props) => {
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
                            updateItem: updateItem,
                        }}
                    />
                ) : null}
                <button onClick={() => setShowCommentForm(!showCommentForm)}>
                    {showCommentForm ? '戻る' : 'コメントする'}
                </button>
                {auth?.userData?.id === item.user.id && (
                    <CommentDeleteButton
                        id={item.id}
                        updateItem={updateItem}
                        commentType={commentType}
                    />
                )}
            </div>
        </li>
    );
};

export default CommentItem;
