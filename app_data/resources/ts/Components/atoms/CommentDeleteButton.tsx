import React from 'react';

type Props = {
    id: number;
    deleteComment: (commentId: number) => void;
};

const CommentDeleteButton = (props: Props) => {
    return <button onClick={() => props.deleteComment(props.id)}>削除</button>;
};

export default CommentDeleteButton;
