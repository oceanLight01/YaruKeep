import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from './FlashMessageContext';

import styles from './../../scss/DiaryForm.modules.scss';
import TextField from '@mui/material/TextField';
import Button from './atoms/Button';

type Diary = {
    text: string;
};

type Props = {
    habitId: number;
    updateHabit: (habitItem: HabitItem) => void;
};

const DiaryForm = (props: Props) => {
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<Diary>();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<Diary> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            habitId: props.habitId,
        };

        axios
            .post('/api/diaries', postData)
            .then((res) => {
                if (!unmounted) {
                    props.updateHabit(res.data.data);
                    flashMessage?.setMessage('日記を投稿しました。');
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        '日記の投稿に失敗しました。',
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
                <label>日記</label>
                <Controller
                    name="text"
                    control={control}
                    render={() => (
                        <TextField
                            type="text"
                            margin="dense"
                            maxLength={1000}
                            placeholder={'今日のことを日記に書こう'}
                            multiline
                            fullWidth
                            {...register('text', { required: true, maxLength: 300 })}
                        />
                    )}
                />
                {errors.text?.type === 'maxLength' && <p>日記は1000文字以下で入力してください。</p>}
                {errors.text?.type === 'required' && <p>内容を入力してください。</p>}
            </div>
            <div className={styles.button_wrapper}>
                <Button value="投稿" type="submit" disabled={clicked} />
            </div>
        </form>
    );
};

export default DiaryForm;
