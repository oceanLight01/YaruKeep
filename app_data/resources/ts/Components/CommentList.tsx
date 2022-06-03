import React from 'react';
import CommentItem from './Atoms/CommentItem';
import CommentReplyList from './CommentReplyList';

type Props = {
    item: CommentItem;
    commentType: 'habit' | 'diary';
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
    index: number;
};

const commentList = ({ item, commentType, updateItem, index }: Props) => {
    if (item.children.length === 0) {
        return <CommentItem {...{ item, commentType, updateItem }} key={index} />;
    }

    return (
        <React.Fragment key={index}>
            <CommentItem {...{ item, commentType, updateItem }} />
            <CommentReplyList
                item={item}
                updateItem={updateItem}
                commentType={commentType}
                index={index}
                key={`reply${index}`}
            />
        </React.Fragment>
    );
};

export default commentList;
