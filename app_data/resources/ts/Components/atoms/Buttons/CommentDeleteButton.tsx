import React, { useEffect } from 'react';
import axios from 'axios';
import { useMessage } from '../../FlashMessageContext';

import styles from 'scss/Components/Atoms/Buttons/CommentDeleteButton.modules.scss';

type Props = {
    id: number;
    commentType: 'habit' | 'diary';
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
};

const CommentDeleteButton = (props: Props) => {
    const flashMessage = useMessage();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const deleteComment = (commentId: number) => {
        if (window.confirm('コメントを削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/comments/${commentId}/${props.commentType}`)
                .then((res) => {
                    flashMessage?.setMessage('コメントを削除しました。');
                    props.updateItem(res.data.data);
                })
                .catch((error) => {
                    flashMessage?.setErrorMessage(
                        'コメントの削除に失敗しました。',
                        error.response.status
                    );
                });
        }
    };

    return (
        <div onClick={() => deleteComment(props.id)} className={styles.comment_delete_button}>
            削除
        </div>
    );
};

export default CommentDeleteButton;
