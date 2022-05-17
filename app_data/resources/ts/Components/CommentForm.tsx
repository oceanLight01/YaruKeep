import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from './FlashMessageContext';

import styles from './../../scss/CommentForm.modules.scss';
import TextField from '@mui/material/TextField';
import Button from './atoms/Button';

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
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);
    const commentType = props.habitComment ? 'habit' : 'diary';
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
    } = useForm<CommentForm>();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

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

                if (!unmounted) {
                    flashMessage?.setMessage('コメントを投稿しました。');
                    setValue('comment', '');
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'コメントの投稿に失敗しました。',
                        error.response.status
                    );
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setClicked(false);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div>
                <label>コメント</label>
                <Controller
                    name="comment"
                    control={control}
                    render={() => (
                        <TextField
                            type="text"
                            margin="dense"
                            maxLength={300}
                            placeholder={'コメントを追加'}
                            multiline
                            fullWidth
                            {...register('comment', { required: true, maxLength: 300 })}
                        />
                    )}
                />
                {errors.comment?.type === 'maxLength' && (
                    <p>コメントは300文字以下で入力してください。</p>
                )}
                {errors.comment?.type === 'required' && <p>内容を入力してください。</p>}
            </div>
            <div className={styles.button_wrapper}>
                <Button value="コメント" type="submit" disabled={clicked} />
            </div>
        </form>
    );
};

export default CommentForm;
