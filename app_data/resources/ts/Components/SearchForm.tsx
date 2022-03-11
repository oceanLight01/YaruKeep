import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type SearchForm = {
    keyword: string;
    categoryies: string[];
};

const SearchForm = () => {
    const category = [
        'ビジネススキル',
        '自己啓発',
        'プログラミング',
        'スキルアップ',
        '資格取得',
        '外国語学習',
        '読書',
        '芸術',
        'ゲーム',
        '創作',
        '趣味',
        '学習',
        '運動・スポーツ',
        '料理',
        '健康・美容',
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<SearchForm>({ defaultValues: { categoryies: [] }, reValidateMode: 'onSubmit' });

    const onSubmit: SubmitHandler<SearchForm> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                {errors.keyword?.type === 'validate' && errors.categoryies?.type === 'validate' && (
                    <p>キーワードかカテゴリを入力してください。</p>
                )}
                <label>キーワード</label>
                <input
                    type="search"
                    {...register('keyword', {
                        validate: (value) =>
                            value.length > 0 || getValues('categoryies').length > 0,
                    })}
                />
            </div>
            <div>
                <label>カテゴリ</label>
                <div>
                    {category.map((item, index) => {
                        return (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={index + 1}
                                    {...register('categoryies', {
                                        validate: (value) =>
                                            value.length > 0 || getValues('keyword').length > 0,
                                    })}
                                />
                                {item}
                            </label>
                        );
                    })}
                </div>
            </div>
            <input type="submit" value="検索" />
        </form>
    );
};

export default SearchForm;
