import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentDeleteButton from './Buttons/CommentDeleteButton';
import { useAuth } from '../Authenticate';
import CommentForm from '../Molecules/Forms/CommentForm';
import formatText from './FormatText';

import styles from 'scss/Components/Atoms/CommentItem.modules.scss';
import Avatar from '@mui/material/Avatar';

type Props = {
    item: CommentItem;
    commentType: 'habit' | 'diary';
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
};

const CommentItem = ({ item, updateItem, commentType }: Props) => {
    const auth = useAuth();
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

    const isHabitComment = commentType === 'habit';

    return (
        <li className={styles.comment_item}>
            <div className={styles.user_info_container}>
                <div className={styles.user_info_wapper}>
                    <Link to={`/user/${item.user.screen_name}`}>
                        <div className={styles.user_info}>
                            <Avatar
                                alt={item.user.name}
                                src={`/storage/profiles/${item.user.profile_image}`}
                            />
                            <div className={styles.username}>{item.user.name}</div>
                        </div>
                    </Link>
                </div>
            </div>
            <p className={styles.comment}>{formatText(item.comment)}</p>
            <div>
                {showCommentForm ? (
                    <CommentForm
                        {...{
                            id: item.id,
                            userId: auth?.userData?.id!,
                            itemId: item.item_id,
                            parentId: item.parent_id,
                            updateItem: updateItem,
                            habitComment: isHabitComment,
                        }}
                    />
                ) : null}
                <div onClick={() => setShowCommentForm(!showCommentForm)} className={styles.reply}>
                    {showCommentForm ? '戻る' : '返信'}
                </div>

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
