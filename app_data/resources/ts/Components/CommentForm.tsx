import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
    id?: number;
    userId: number;
    itemId: number;
    parentId: number | null;
    comment?: string;
    updateHabit: (habitItem: HabitItem) => void;
};

type CommentForm = {
    comment: string;
};

const CommentForm = (props: Props) => {
    const [clicked, setClicked] = useState<boolean>(false);
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
            habitId: props.itemId,
            parentId: props.id,
        };

        axios
            .post('/api/comment/habit', postData)
            .then((res) => {
                props.updateHabit(res.data.data);
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
