import React from 'react';
import axios from 'axios';

type Props = {
    id: number;
    commentType: 'habit' | 'diary';
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
};

const CommentDeleteButton = (props: Props) => {
    const deleteComment = (commentId: number) => {
        if (window.confirm('コメントを削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/comments/${commentId}/${props.commentType}`)
                .then((res) => {
                    props.updateItem(res.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return <button onClick={() => deleteComment(props.id)}>削除</button>;
};

export default CommentDeleteButton;
