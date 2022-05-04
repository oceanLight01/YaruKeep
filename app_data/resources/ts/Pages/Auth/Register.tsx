import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/Authenticate';
import { useMessage } from '../../Components/FlashMessageContext';

import styles from './../../../scss/Register.modules.scss';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormVaridateMessage from '../../Components/atoms/FormVaridateMessage';
import FormRule from '../../Components/atoms/FormRule';

type RegisterForm = {
    name: string;
    screen_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type ErrorMessage = {
    email: string[];
    screen_name: string[];
};

const Register = () => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({ email: [], screen_name: [] });
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control,
    } = useForm<RegisterForm>({ mode: 'onBlur' });
    const navigate = useNavigate();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<RegisterForm> = (data) => {
        setIsLoading(true);

        auth?.register(data)
            .then(() => {
                navigate('/home');
            })
            .catch((error) => {
                const data = error.response.data.errors;
                if (error.response.status >= 500) {
                    flashMessage?.setErrorMessage('', error.response.status);
                } else {
                    setErrorMessage({
                        email: data.email ? data.email : [],
                        screen_name: data.screen_name ? data.screen_name : [],
                    });
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setIsLoading(false);
                }
            });
    };

    return (
        <div className={styles.register_container}>
            <div className={styles.register_wrapper}>
                <div className={styles.title}>
                    <h1>アカウント登録</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.register_form}>
                    <div className={styles.form_input}>
                        <Controller
                            name="email"
                            control={control}
                            render={() => (
                                <TextField
                                    label="アカウント名"
                                    type="text"
                                    maxLength={30}
                                    margin="dense"
                                    fullWidth
                                    {...register('name', { required: true, maxLength: 30 })}
                                />
                            )}
                        />
                        <FormRule rule={'・30文字以下'} />
                        {errors.name?.type === 'maxLength' && (
                            <FormVaridateMessage
                                message={'アカウント名は30文字以下で入力してください。'}
                            />
                        )}
                        {errors.name?.type === 'required' && (
                            <FormVaridateMessage message={'アカウント名を入力してください。'} />
                        )}
                    </div>
                    <div className={styles.form_input}>
                        <Controller
                            name="screen_name"
                            control={control}
                            render={() => (
                                <TextField
                                    label="アカウントID"
                                    type="text"
                                    maxLength={20}
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
                        <FormRule rule={'・20文字以下  ・使用可能文字：半角英数字'} />
                        {errors.screen_name?.type === 'required' && (
                            <FormVaridateMessage message={'アカウントIDを入力してください。'} />
                        )}
                        {errors.screen_name?.type === 'maxLength' && (
                            <FormVaridateMessage
                                message={'アカウントIDは20文字以下で入力してください。'}
                            />
                        )}
                        {errors.screen_name?.type === 'pattern' && (
                            <FormVaridateMessage
                                message={'アカウントIDは半角英数字のみ使用できます。'}
                            />
                        )}
                        {errorMessage.screen_name.map((str, index) => {
                            return <FormVaridateMessage message={str} key={index} />;
                        })}
                    </div>
                    <div className={styles.form_input}>
                        <Controller
                            name="email"
                            control={control}
                            render={() => (
                                <TextField
                                    label="メールアドレス"
                                    type="email"
                                    maxLength={255}
                                    margin="dense"
                                    fullWidth
                                    {...register('email', {
                                        required: true,
                                        maxLength: 255,
                                        pattern:
                                            /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                    })}
                                />
                            )}
                        />
                        {errors.email?.type === 'required' && (
                            <FormVaridateMessage message={'メールアドレスを入力してください。'} />
                        )}
                        {errors.email?.type === 'maxLength' && (
                            <FormVaridateMessage
                                message={'メールアドレスは255文字以下で入力してください。'}
                            />
                        )}
                        {errors.email?.type === 'pattern' && (
                            <FormVaridateMessage
                                message={'正しい形式のメールアドレスを入力してください。'}
                            />
                        )}
                        {errorMessage.email.map((str, index) => {
                            return <FormVaridateMessage message={str} key={index} />;
                        })}
                    </div>
                    <div className={styles.form_input}>
                        <Controller
                            name="password"
                            control={control}
                            render={() => (
                                <TextField
                                    label="パスワード"
                                    type="password"
                                    maxLength={64}
                                    margin="dense"
                                    fullWidth
                                    {...register('password', {
                                        required: true,
                                        minLength: 8,
                                        maxLength: 64,
                                        pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+$/,
                                    })}
                                />
                            )}
                        />
                        <FormRule
                            rule={
                                '・8文字以上64文字以下  ・半角英大文字、半角英小文字、半角数字をそれぞれ最低１つ含む'
                            }
                        />

                        {errors.password?.type === 'required' && (
                            <FormVaridateMessage message={'パスワードを入力してください。'} />
                        )}
                        {errors.password?.type === 'minLength' && (
                            <FormVaridateMessage
                                message={'パスワードは８文字以上入力してください。'}
                            />
                        )}
                        {errors.password?.type === 'maxLength' && (
                            <FormVaridateMessage
                                message={'パスワードは64文字以下で入力してください。'}
                            />
                        )}
                        {errors.password?.type === 'pattern' && (
                            <FormVaridateMessage
                                message={
                                    'パスワードは半角英大文字、英小文字、数字を最低１つずつ使用してください。'
                                }
                            />
                        )}
                    </div>
                    <div className={styles.form_input}>
                        <Controller
                            name="password_confirmation"
                            control={control}
                            render={() => (
                                <TextField
                                    label="パスワード確認"
                                    type="password"
                                    maxLength={64}
                                    margin="dense"
                                    fullWidth
                                    {...register('password_confirmation', {
                                        required: true,
                                        validate: (value) => value === getValues('password'),
                                    })}
                                />
                            )}
                        />
                        <FormRule rule={'・パスワードを再度入力'} />
                        {errors.password_confirmation?.type === 'required' && (
                            <FormVaridateMessage message={'確認用パスワードを入力してください。'} />
                        )}
                        {errors.password_confirmation?.type === 'validate' && (
                            <FormVaridateMessage message={'パスワードが一致しません。'} />
                        )}
                    </div>
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        登録
                    </Button>
                </form>
                <div className={styles.link}>
                    <Link to="/login" className={styles.link_name}>
                        ログイン
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
