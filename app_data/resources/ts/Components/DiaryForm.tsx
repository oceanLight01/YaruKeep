import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from './FlashMessageContext';

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
    } = useForm<Diary>();

    const onSubmit: SubmitHandler<Diary> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            habitId: props.habitId,
        };

        axios
            .post('/api/diaries', postData)
            .then((res) => {
                props.updateHabit(res.data.data);
                flashMessage?.setMessage('日記を投稿しました。');
            })
            .catch((error) => {
                flashMessage?.setErrorMessage('日記の投稿に失敗しました。', error.response.status);
            })
            .finally(() => {
                setClicked(false);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                {errors.text?.type === 'maxLength' && <p>日記は1000文字以下で入力してください。</p>}
                {errors.text?.type === 'required' && <p>内容を入力してください。</p>}
                <label>日記</label>
                <textarea
                    maxLength={1000}
                    autoComplete="off"
                    {...register('text', { required: true, maxLength: 300 })}
                />
            </div>
            <input type="submit" value="投稿" disabled={clicked} />
        </form>
    );
};

export default DiaryForm;
