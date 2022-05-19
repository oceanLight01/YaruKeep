import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';

import styles from './../../scss/UserSettingsForm.modules.scss';
import TextField from '@mui/material/TextField';
import Button from './atoms/Button';
import FormVaridateMessage from './atoms/FormVaridateMessage';
import ValidateCountInput from './ValidateCountInput';

type SettingsForm = {
    name: string;
    screen_name: string;
    profile: string;
};

type ErrorMessage = {
    screen_name: string[];
};

type Props = {
    setShowSettingsForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserSettingsForm = (props: Props) => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({ screen_name: [] });
    const [clicked, setClicked] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm<SettingsForm>({ mode: 'onBlur' });

    let unmounted = false;
    useEffect(() => {
        if (!unmounted) {
            setValue('name', auth?.userData?.name!);
            setValue('screen_name', auth?.userData?.screen_name!);
            setValue('profile', auth?.userData?.profile!);
        }

        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<SettingsForm> = (data) => {
        setClicked(true);

        const editData = {
            ...data,
            id: auth?.userData?.id,
        };

        auth?.edit(editData)
            .then((value) => {
                if (!unmounted) {
                    if (value[0] === undefined) {
                        props.setShowSettingsForm(false);
                        flashMessage?.setMessage('ユーザー情報を更新しました。');
                    } else {
                        setErrorMessage({
                            screen_name: value[0].screen_name ? value[0].screen_name : [],
                        });
                    }
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'ユーザー情報の更新に失敗しました。',
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
            <div className={styles.form_input}>
                <div className={styles.form_label}>
                    <label>アカウント名</label>
                    <ValidateCountInput text={watch('name')} limit={30} />
                </div>
                <Controller
                    name="name"
                    control={control}
                    render={() => (
                        <TextField
                            type="text"
                            margin="dense"
                            fullWidth
                            {...register('name', { required: true, maxLength: 30 })}
                        />
                    )}
                />
                {errors.name?.type === 'maxLength' && (
                    <FormVaridateMessage message="アカウント名は30文字以下で入力してください。" />
                )}
                {errors.name?.type === 'required' && (
                    <FormVaridateMessage message="アカウント名を入力してください。" />
                )}
            </div>
            <div className={styles.form_input}>
                <div className={styles.form_label}>
                    <label>アカウントID</label>
                    <ValidateCountInput text={watch('screen_name')} limit={20} />
                </div>
                <Controller
                    name="screen_name"
                    control={control}
                    render={() => (
                        <TextField
                            type="text"
                            margin="dense"
                            fullWidth
                            {...register('screen_name', {
                                required: true,
                                maxLength: 20,
                                pattern: /^(?=.*?[a-zA-Z\d])[a-zA-Z\d]+$/,
                            })}
                        />
                    )}
                />
                {errors.screen_name?.type === 'required' && (
                    <FormVaridateMessage message="アカウントIDを入力してください。" />
                )}
                {errors.screen_name?.type === 'maxLength' && (
                    <FormVaridateMessage message="アカウントIDは20文字以下で入力してください。" />
                )}
                {errors.screen_name?.type === 'pattern' && (
                    <FormVaridateMessage message="アカウントIDは半角英数字のみ使用できます。" />
                )}
                {errorMessage.screen_name.map((str, index) => {
                    return <FormVaridateMessage message={str} key={index} />;
                })}
            </div>
            <div className={styles.form_input}>
                <div className={styles.form_label}>
                    <label>プロフィール</label>
                    <ValidateCountInput text={watch('profile')} limit={300} />
                </div>
                <Controller
                    name="profile"
                    control={control}
                    render={() => (
                        <TextField
                            type="text"
                            margin="dense"
                            fullWidth
                            multiline
                            {...register('profile', { maxLength: 300 })}
                        />
                    )}
                />
                {errors.profile?.type === 'maxLength' && (
                    <FormVaridateMessage message="プロフィールは300文字以下で入力してください。" />
                )}
            </div>
            <div className={styles.form_button_wrapper}>
                <Button type="submit" value="変更" disabled={clicked} />
            </div>
        </form>
    );
};

export default UserSettingsForm;
