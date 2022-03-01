import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Authenticate';
import CommentForm from './CommentForm';
import formatText from './FormatText';

type Props = {
    item: CommentItem;
    updateHabit: (habitItem: HabitItem) => void;
};

const CommentItem = ({ item, updateHabit }: Props) => {
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
            </div>
        </li>
    );
};

export default CommentItem;
