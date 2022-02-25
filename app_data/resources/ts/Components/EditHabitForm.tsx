import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';

type HabitForm = {
    title: string;
    description: string;
    categoryId: number;
    isPrivate: string;
    habitId: number;
    updateHabit: (HabitItem: HabitItem) => void;
};

const EditHabitForm = (props: HabitForm) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const auth = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<HabitForm>({ mode: 'onBlur' });

    useEffect(() => {
        setValue('title', props.title);
        setValue('description', props.description);
        setValue('categoryId', props.categoryId);
        setValue('isPrivate', props.isPrivate);
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
            .then((res) => props.updateHabit(res.data.data))
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>目標</label>
                {errors.title?.type === 'maxLength' && <p>目標は50文字以下で入力してください。</p>}
                {errors.title?.type === 'required' && <p>目標を入力してください。</p>}
                <input
                    type="text"
                    maxLength={50}
                    autoComplete="on"
                    {...register('title', { required: true, maxLength: 50 })}
                />
            </div>
            <div>
                <label>説明文</label>
                {errors.description?.type === 'maxLength' && (
                    <p>説明文は300文字以下で入力してください。</p>
                )}
                <textarea
                    maxLength={300}
                    autoComplete="off"
                    {...register('description', { maxLength: 300 })}
                />
            </div>
            <div>
                <select {...register('categoryId', { required: true })}>
                    <option value="1">ビジネススキル</option>
                    <option value="2">自己啓発</option>
                    <option value="3">プログラミング・開発</option>
                    <option value="4">スキルアップ</option>
                    <option value="5">資格取得</option>
                    <option value="6">外国語学習</option>
                    <option value="7">読書</option>
                    <option value="8">芸術</option>
                    <option value="9">ゲーム</option>
                    <option value="10">創作</option>
                    <option value="11">趣味</option>
                    <option value="12">学習</option>
                    <option value="13">運動・スポーツ</option>
                    <option value="14">料理</option>
                    <option value="15">健康・美容</option>
                </select>
            </div>
            <div>
                <label>公開状態</label>
                {errors.isPrivate?.type === 'required' && <p>公開状態を入力してください。</p>}
                <label htmlFor="public">公開</label>
                <input
                    id="public"
                    type="radio"
                    value="false"
                    {...register('isPrivate', { required: true })}
                />
                <label htmlFor="private">非公開</label>
                <input
                    id="private"
                    type="radio"
                    value="true"
                    {...register('isPrivate', { required: true })}
                />
            </div>
            <input type="submit" value="更新する" disabled={isLoading} />
        </form>
    );
};

export default EditHabitForm;