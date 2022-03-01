import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
    id?: number;
    userId: number;
    itemId: number;
    parentId: number | null;
    comment?: string;
    habitComment?: boolean;
    updateItem: ((habitItem: HabitItem) => void) | ((diaryItem: DiaryItem) => void);
};

type CommentForm = {
    comment: string;
};

const CommentForm = (props: Props) => {
    const [clicked, setClicked] = useState<boolean>(false);
    const commentType = props.habitComment ? 'habit' : 'diary';
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CommentForm>();

    const onSubmit: SubmitHandler<CommentForm> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            userId: props.userId,
            itemId: props.itemId,
            parentId: props.id,
        };

        axios
            .post(`/api/comments/${commentType}`, postData)
            .then((res) => {
                props.updateItem(res.data.data);

                setValue('comment', '');
            })
            .catch((error) => {
                console.error(error);
                setClicked(false);
            })
            .finally(() => {
                setClicked(false);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                {errors.comment?.type === 'maxLength' && (
                    <p>コメントは300文字以下で入力してください。</p>
                )}
                {errors.comment?.type === 'required' && <p>内容を入力してください。</p>}
                <label>コメント</label>
                <textarea
                    maxLength={300}
                    autoComplete="off"
                    {...register('comment', { required: true, maxLength: 300 })}
                />
            </div>
            <input type="submit" value="投稿" disabled={clicked} />
        </form>
    );
};

export default CommentForm;
