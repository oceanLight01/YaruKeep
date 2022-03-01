import React, { useState } from 'react';
import CommentItem from './CommentItem';

type UpdateItem = ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);

type Props = {
    item: CommentItem;
    commentType: 'habit' | 'diary';
    updateItem: UpdateItem;
    index: number;
};

const CommentReplyList = ({ item, commentType, updateItem, index }: Props) => {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    const renderReplyComment = (item: CommentItem, updateItem: UpdateItem) => {
        return item.children.map((itemChild) => {
            if (itemChild.children.length === 0) {
                return (
                    <CommentItem
                        item={itemChild}
                        {...{ commentType, updateItem }}
                        key={itemChild.id}
                    />
                );
            }

            return (
                <React.Fragment key={itemChild.id}>
                    <CommentItem
                        {...{ item: itemChild, commentType, updateItem }}
                        key={itemChild.id}
                    />
                    {itemChild.children.map((item) => {
                        if (item.children.length === 0) {
                            return (
                                <CommentItem {...{ item, commentType, updateItem }} key={item.id} />
                            );
                        } else {
                            return renderReplyComment(item, updateItem);
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
                    <ul>{renderReplyComment(item, updateItem)}</ul>
                </li>
            )}
            <p onClick={() => setIsHidden(!isHidden)}>{isHidden ? '返信を表示' : '返信を非表示'}</p>
        </>
    );
};

export default CommentReplyList;
