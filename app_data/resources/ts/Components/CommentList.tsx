import React from 'react';
import CommentItem from './CommentItem';
import CommentReplyList from './CommentReplyList';

type Props = {
    item: CommentItem;
    updateHabit: (habitItem: HabitItem) => void;
    deleteComment: (commentId: number) => void;
    index: number;
};

const commentList = ({ item, updateHabit, deleteComment, index }: Props) => {
    if (item.children.length === 0) {
        return <CommentItem {...{ item, updateHabit, deleteComment }} key={index} />;
    }

    return (
        <React.Fragment key={index}>
            <CommentItem {...{ item, updateHabit, deleteComment }} />
            <CommentReplyList
                item={item}
                updateHabit={updateHabit}
                deleteComment={deleteComment}
                index={index}
                key={`reply${index}`}
            />
        </React.Fragment>
    );
};

export default commentList;
