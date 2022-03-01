import React from 'react';
import CommentItem from './CommentItem';
import CommentReplyList from './CommentReplyList';

type Props = {
    item: CommentItem;
    updateHabit: (habitItem: HabitItem) => void;
    index: number;
};

const commentList = ({ item, updateHabit, index }: Props) => {
    if (item.children.length === 0) {
        return <CommentItem {...{ item, updateHabit }} key={index} />;
    }

    return (
        <React.Fragment key={index}>
            <CommentItem {...{ item, updateHabit }} />
            <CommentReplyList
                item={item}
                updateHabit={updateHabit}
                index={index}
                key={`reply${index}`}
            />
        </React.Fragment>
    );
};

export default commentList;
