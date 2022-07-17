import TextField from '@mui/material/TextField';
import axios, { AxiosResponse } from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../Atoms/Buttons/Button';
import { useAuth } from '../../Authenticate';
import { useMessage } from '../../FlashMessageContext';

import styles from 'scss/Components/Molecules/Forms/EditDiaryForm.modules.scss';

type Diary = {
    text: string;
};

type Props = {
    id: number;
    text: string;
    habitId: number;
    updateDiary: (DiaryItem: any) => void;
    setEditing: Dispatch<SetStateAction<boolean>>;
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
        control,
    } = useForm<Diary>();

    let unmounted = false;
    useEffect(() => {
        setValue('text', props.text);

        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<Diary> = async (data) => {
        setClicked(true);

        const postData = {
            ...data,
            habitId: props.habitId,
            userId: auth?.userData?.id,
        };

        try {
            const diary: AxiosResponse = await axios.put(`/api/diaries/${props.id}`, postData);

            if (!unmounted) {
                props.updateDiary(diary.data.data);
                flashMessage?.setMessage('日記を編集しました。');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        '日記の編集に失敗しました。',
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.form_input}>
                <Controller
                    name="text"
                    control={control}
                    render={() => (
                        <TextField
                            type="text"
                            margin="dense"
                            fullWidth
                            multiline
                            {...register('text', { required: true })}
                        />
                    )}
                />
                {errors.text?.type === 'maxLength' && <p>日記は1000文字以下で入力してください。</p>}
                {errors.text?.type === 'required' && <p>内容を入力してください。</p>}
            </div>
            <div className={styles.form_buttons}>
                <div className={styles.button_wrapper}>
                    <Button type="submit" value="更新" disabled={clicked} />
                </div>
                <div className={styles.button_wrapper}>
                    <Button
                        variant="outlined"
                        value="戻る"
                        clickHandler={() => props.setEditing(false)}
                        disabled={clicked}
                    />
                </div>
            </div>
        </form>
    );
};

export default EditDiaryForm;
