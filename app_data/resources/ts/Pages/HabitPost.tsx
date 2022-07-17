import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../Components/Authenticate';
import { useMessage } from '../Components/FlashMessageContext';

import styles from 'scss/Pages/HabitPost.modules.scss';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '../Components/Atoms/Buttons/Button';
import FormVaridateMessage from '../Components/Atoms/FormVaridateMessage';
import ValidateCountInput from '../Components/Atoms/ValidateCountInput';

type HabitForm = {
    title: string;
    description: string;
    categoryId: number;
    isPrivate: string;
};

const HabitPost = () => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm<HabitForm>({ mode: 'onBlur' });

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<HabitForm> = async (data) => {
        setIsLoading(true);

        const habitData = {
            userId: auth?.userData?.id,
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            isPrivate: data.isPrivate === 'true',
        };

        try {
            await axios.post('/api/habits', habitData);
            if (!unmounted) {
                flashMessage?.setMessage('ハビットトラッカーを作成しました。');
                reset();
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'ハビットトラッカーの作成に失敗しました。',
                        error.response.status
                    );
                }
            }
        } finally {
            if (!unmounted) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className={styles.post_habit_container}>
            <div className={styles.post_habit_wrapper}>
                <h1 className={styles.title}>ハビットトラッカーを作成</h1>
                <div className={styles.description}>
                    <p>習慣付けたいことを決めてハビットトラッカーを作成しよう。</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.post_habit_form}>
                    <div className={styles.form_label}>
                        <label>目標</label>
                        <ValidateCountInput text={watch('title')} limit={50} />
                    </div>
                    <div className={styles.form_input}>
                        <Controller
                            name="title"
                            control={control}
                            render={() => (
                                <TextField
                                    type="text"
                                    margin="dense"
                                    placeholder="例: 本を最低10ページ以上読む"
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
                        <div className={styles.form_label}>
                            <label>詳細</label>
                            <ValidateCountInput text={watch('description')} limit={300} />
                        </div>
                        <Controller
                            name="description"
                            control={control}
                            render={() => (
                                <TextField
                                    type="text"
                                    margin="dense"
                                    placeholder={`目標に対する補足を記入しよう。\n\n例: 毎月本を３冊読破する！`}
                                    fullWidth
                                    multiline
                                    {...register('description', { maxLength: 300 })}
                                />
                            )}
                        />
                        {errors.description?.type === 'maxLength' && (
                            <FormVaridateMessage message="詳細は300文字以下で入力してください。" />
                        )}
                    </div>
                    <div className={styles.form_input}>
                        <div className={styles.form_label}>
                            <label>カテゴリー</label>
                        </div>
                        <div>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={() => (
                                    <Select
                                        defaultValue={1}
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
                    </div>
                    <div className={styles.form_input}>
                        <div className={styles.form_label}>
                            <label>公開状態</label>
                        </div>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={() => (
                                <RadioGroup defaultValue={'false'} row>
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
                    <div className={styles.form_button_wrapper}>
                        <Button type="submit" value="作成" disabled={isLoading} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitPost;
