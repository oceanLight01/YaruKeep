import React from 'react';
import axios from 'axios';
import { useMessage } from '../FlashMessageContext';

type Props = {
    id: number;
    commentType: 'habit' | 'diary';
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
};

const CommentDeleteButton = (props: Props) => {
    const flashMessage = useMessage();

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

    return <button onClick={() => deleteComment(props.id)}>削除</button>;
};

export default CommentDeleteButton;
