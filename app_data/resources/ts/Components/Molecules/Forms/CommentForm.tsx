import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from '../../FlashMessageContext';

import styles from 'scss/Components/Molecules/Forms/CommentForm.modules.scss';
import TextField from '@mui/material/TextField';
import Button from '../../Atoms/Buttons/Button';
import FormVaridateMessage from '../../Atoms/FormVaridateMessage';

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
        reset,
        control,
    } = useForm<CommentForm>();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<CommentForm> = async (data) => {
        setClicked(true);

        const postData = {
            ...data,
            userId: props.userId,
            itemId: props.itemId,
            parentId: props.id,
        };

        try {
            const comment: AxiosResponse = await axios.post(
                `/api/comments/${commentType}`,
                postData
            );
            props.updateItem(comment.data.data);

            flashMessage?.setMessage('コメントを投稿しました。');
            reset();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'コメントの投稿に失敗しました。',
                        error.response.status
                    );
                }
            }
        } finally {
            if (!unmounted) {
                setClicked(false);
            }
        }
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
                    <FormVaridateMessage message="コメントは300文字以下で入力してください。" />
                )}
                {errors.comment?.type === 'required' && (
                    <FormVaridateMessage message="内容を入力してください。" />
                )}
            </div>
            <div className={styles.button_wrapper}>
                <Button value="コメント" type="submit" disabled={clicked} />
            </div>
        </form>
    );
};

export default CommentForm;
