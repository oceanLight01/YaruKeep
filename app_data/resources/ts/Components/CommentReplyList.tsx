import React, { useState } from 'react';
import CommentItem from './CommentItem';

type Props = {
    item: CommentItem;
    updateHabit: (habitItem: HabitItem) => void;
    index: number;
};

const CommentReplyList = ({ item, updateHabit, index }: Props) => {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    const renderReplyComment = (item: CommentItem, updateHabit: (habitItem: HabitItem) => void) => {
        return item.children.map((itemChild) => {
            if (itemChild.children.length === 0) {
                return <CommentItem item={itemChild} {...{ updateHabit }} key={itemChild.id} />;
            }

            return (
                <React.Fragment key={itemChild.id}>
                    <CommentItem {...{ item: itemChild, updateHabit }} key={itemChild.id} />
                    {itemChild.children.map((item) => {
                        if (item.children.length === 0) {
                            return <CommentItem {...{ item, updateHabit }} key={item.id} />;
                        } else {
                            return renderReplyComment(item, updateHabit);
                        }
                    })}
                </React.Fragment>
            );
        });
    };

    return (
        <>
            {isHidden ? null : (
                <li key={index}>
                    <ul>{renderReplyComment(item, updateHabit)}</ul>
                </li>
            )}
            <p onClick={() => setIsHidden(!isHidden)}>{isHidden ? '返信を表示' : '返信を非表示'}</p>
        </>
    );
};

export default CommentReplyList;
