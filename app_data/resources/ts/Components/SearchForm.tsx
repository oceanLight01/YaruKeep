import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import styles from './../../scss/SearchForm.modules.scss';
import TextField from '@mui/material/TextField';
import FormVaridateMessage from './atoms/FormVaridateMessage';
import Button from './atoms/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type SearchForm = {
    keyword: string;
    categories: string;
};

type Props = {
    searchHabit: (data: SearchForm) => void;
    disabled: boolean;
};

const SearchForm = (props: Props) => {
    const option: { value: string; name: string }[] = [
        { value: '1', name: 'ビジネススキル' },
        { value: '2', name: '自己啓発' },
        { value: '3', name: 'プログラミング・開発' },
        { value: '4', name: 'スキルアップ' },
        { value: '5', name: '資格取得' },
        { value: '6', name: '外国語学習' },
        { value: '7', name: '読書' },
        { value: '8', name: '芸術' },
        { value: '9', name: 'ゲーム' },
        { value: '10', name: '創作' },
        { value: '11', name: '趣味' },
        { value: '12', name: '学習' },
        { value: '13', name: '運動・スポーツ' },
        { value: '14', name: '料理' },
        { value: '15', name: '健康・美容' },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        control,
    } = useForm<SearchForm>({ defaultValues: { categories: '' }, reValidateMode: 'onSubmit' });

    const onSubmit: SubmitHandler<SearchForm> = (data) => {
        props.searchHabit(data);
    };

    const handleCheck = (option: { value: string }, event: React.ChangeEvent<{}>) => {
        let categories: string[] = getValues('categories').split(',') || [];
        categories = categories.filter((value) => value);

        let newCategories: string[] = [];
        if ((event.target as HTMLInputElement).checked) {
            newCategories = [...(categories ?? []), option.value];
        } else {
            newCategories = categories?.filter((value) => value !== option.value);
        }

        setValue('categories', newCategories.join(','));
        return newCategories.join(',');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.search_form}>
            <div className={styles.form_input}>
                <label>キーワード</label>
                <Controller
                    name="keyword"
                    control={control}
                    render={() => (
                        <TextField
                            type="search"
                            margin="dense"
                            fullWidth
                            {...register('keyword', {
                                validate: (value) =>
                                    value.length > 0 || getValues('categories').length > 0,
                            })}
                        />
                    )}
                />
                {errors.keyword?.type === 'validate' && errors.categories?.type === 'validate' && (
                    <FormVaridateMessage message="キーワードかカテゴリを入力してください。" />
                )}
            </div>
            <div className={styles.form_input}>
                <label>カテゴリ</label>
                <div>
                    <Controller
                        name="categories"
                        control={control}
                        rules={{
                            validate: (value) =>
                                value.length > 0 || getValues('keyword').length > 0,
                        }}
                        render={({ field }) => {
                            return (
                                <>
                                    {option.map((categoryValue, index) => {
                                        return (
                                            <div className={styles.checkbox_item}>
                                                <FormControlLabel
                                                    {...field}
                                                    key={index}
                                                    label={categoryValue.name}
                                                    onChange={(event) => {
                                                        field.onChange(
                                                            handleCheck(categoryValue, event)
                                                        );
                                                    }}
                                                    control={<Checkbox />}
                                                />
                                            </div>
                                        );
                                    })}
                                </>
                            );
                        }}
                    />
                </div>
            </div>

            <div className={styles.form_button_wrapper}>
                <Button type="submit" value="検索" disabled={props.disabled} />
            </div>
        </form>
    );
};

export default SearchForm;
