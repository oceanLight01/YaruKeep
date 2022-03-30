import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';

type Diary = {
    text: string;
};

type Props = {
    id: number;
    text: string;
    habitId: number;
    updateDiary: (DiaryItem: any) => void;
};

const EditDiaryForm = (props: Props) => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Diary>();

    let unmounted = false;
    useEffect(() => {
        setValue('text', props.text);

        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<Diary> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            habitId: props.habitId,
            userId: auth?.userData?.id,
        };

        axios
            .put(`/api/diaries/${props.id}`, postData)
            .then((res) => {
                if (!unmounted) {
                    props.updateDiary(res.data.data);
                    flashMessage?.setMessage('日記を編集しました。');
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        '日記の編集に失敗しました。',
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
            <input type="submit" value="更新する" disabled={clicked} />
        </form>
    );
};

export default EditDiaryForm;
