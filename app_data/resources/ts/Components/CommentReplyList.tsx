import React, { useState } from 'react';
import CommentItem from './Atoms/CommentItem';

import styles from 'scss/Components/CommentReplyList.modules.scss';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

type UpdateItem = ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);

type Props = {
    item: CommentItem;
    commentType: 'habit' | 'diary';
    updateItem: UpdateItem;
    index: number;
};

const CommentReplyList = ({ item, commentType, updateItem, index }: Props) => {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    // コメントに対する返信コメントを表示
    const renderReplyComment = (item: CommentItem, updateItem: UpdateItem) => {
        return item.children.map((itemChild) => {
            // 返信コメントにさらに返信がなければコンポーネント単体で表示
            if (itemChild.children.length === 0) {
                return (
                    <CommentItem
                        item={itemChild}
                        {...{ commentType, updateItem }}
                        key={itemChild.id}
                    />
                );
            }

            // 返信コメントに返信があればリスト形式で表示
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
        <div className={styles.reply_comments}>
            {isHidden ? null : (
                <li key={index}>
                    <ul>{renderReplyComment(item, updateItem)}</ul>
                </li>
            )}
            <div
                onClick={() => setIsHidden(!isHidden)}
                className={styles.toggle_render_reply_container}
            >
                {isHidden ? (
                    <div className={styles.toggle_render_reply}>
                        <ArrowDropDownIcon />
                        <span> 返信を表示</span>
                    </div>
                ) : (
                    <div className={styles.toggle_render_reply}>
                        <ArrowDropUpIcon />
                        <span>返信を非表示</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentReplyList;
