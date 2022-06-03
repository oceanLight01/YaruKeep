import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../Authenticate';
import { useMessage } from '../../FlashMessageContext';

import styles from 'scss/Components/Molecules/Forms/EditHabitForm.modules.scss';
import Button from '../../Atoms/Buttons/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormVaridateMessage from '../../Atoms/FormVaridateMessage';

type HabitForm = {
    title: string;
    description: string;
    categoryId: number;
    isPrivate: string;
    habitId: number;
    activeModal: boolean;
    toggleModal: () => void;
    updateHabit: (HabitItem: HabitItem) => void;
};

const EditHabitForm = (props: HabitForm) => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
    } = useForm<HabitForm>({ mode: 'onBlur' });

    let unmounted = false;
    useEffect(() => {
        setValue('isPrivate', props.isPrivate);

        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<HabitForm> = (data) => {
        setIsLoading(true);

        const habitData = {
            userId: auth?.userData?.id,
            habitId: props.habitId,
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            isPrivate: data.isPrivate === 'true',
        };

        axios
            .put(`/api/habits/${props.habitId}`, habitData)
            .then(async (res) => {
                if (!unmounted) {
                    await props.updateHabit(res.data.data);
                    flashMessage?.setMessage('ハビットトラッカーを編集しました。');
                    props.toggleModal();
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'ハビットトラッカーの編集に失敗しました。',
                        error.response.status
                    );
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setIsLoading(false);
                }
            });
    };

    return (
        <div
            className={`${styles.habit_edit_form_container} ${props.activeModal && styles.active}`}
        >
            <div className={styles.habit_edit_form_wrapper}>
                <div className={styles.habit_edit_form}>
                    <h3 className={styles.title}>ハビットトラッカーの編集</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.form_input}>
                            <label className={styles.form_label}>目標</label>
                            <Controller
                                name="title"
                                control={control}
                                render={() => (
                                    <TextField
                                        type="text"
                                        margin="dense"
                                        maxLength={50}
                                        defaultValue={props.title}
                                        fullWidth
                                        {...register('title', { required: true, maxLength: 50 })}
                                    />
                                )}
                            />
                            {errors.title?.type === 'maxLength' && (
                                <FormVaridateMessage message="目標は50文字以下で入力してください。" />
                            )}

                            {errors.title?.type === 'required' && (
                                <FormVaridateMessage message="目標を入力してください。" />
                            )}
                        </div>
                        <div className={styles.form_input}>
                            {errors.description?.type === 'maxLength' && (
                                <FormVaridateMessage message="説明文は300文字以下で入力してください。" />
                            )}
                            <label className={styles.form_label}>説明文</label>
                            <Controller
                                name="description"
                                control={control}
                                render={() => (
                                    <TextField
                                        type="text"
                                        margin="dense"
                                        maxLength={300}
                                        defaultValue={props.description}
                                        multiline
                                        fullWidth
                                        {...register('description', { maxLength: 300 })}
                                    />
                                )}
                            />
                        </div>
                        <div className={styles.form_input}>
                            <label className={styles.form_label}>カテゴリー</label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={() => (
                                    <Select
                                        defaultValue={props.categoryId}
                                        fullWidth
                                        {...register('categoryId', { required: true })}
                                    >
                                        <MenuItem value={1}>ビジネススキル</MenuItem>
                                        <MenuItem value={2}>自己啓発</MenuItem>
                                        <MenuItem value={3}>プログラミング・開発</MenuItem>
                                        <MenuItem value={4}>スキルアップ</MenuItem>
                                        <MenuItem value={5}>資格取得</MenuItem>
                                        <MenuItem value={6}>外国語学習</MenuItem>
                                        <MenuItem value={7}>読書</MenuItem>
                                        <MenuItem value={8}>芸術</MenuItem>
                                        <MenuItem value={9}>ゲーム</MenuItem>
                                        <MenuItem value={10}>創作</MenuItem>
                                        <MenuItem value={11}>趣味</MenuItem>
                                        <MenuItem value={12}>学習</MenuItem>
                                        <MenuItem value={13}>運動・スポーツ</MenuItem>
                                        <MenuItem value={14}>料理</MenuItem>
                                        <MenuItem value={15}>健康・美容</MenuItem>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className={styles.form_input}>
                            <label className={styles.form_label}>公開状態</label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={() => (
                                    <RadioGroup defaultValue={props.isPrivate} row>
                                        <FormControlLabel
                                            value="false"
                                            control={<Radio />}
                                            label="公開"
                                            {...register('isPrivate', { required: true })}
                                        />
                                        <FormControlLabel
                                            value="true"
                                            control={<Radio />}
                                            label="非公開"
                                            {...register('isPrivate', { required: true })}
                                        />
                                    </RadioGroup>
                                )}
                            />
                            {errors.isPrivate?.type === 'required' && (
                                <FormVaridateMessage message="公開状態を入力してください。" />
                            )}
                        </div>
                        <div className={styles.form_buttons}>
                            <div className={styles.button_wrapper}>
                                <Button value="更新" type="submit" disabled={isLoading} />
                            </div>
                            <div className={styles.button_wrapper}>
                                <Button
                                    value="戻る"
                                    variant="outlined"
                                    clickHandler={() => props.toggleModal()}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditHabitForm;
