import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';

type SettingsForm = {
    name: string;
    screen_name: string;
    profile: string;
    email: string;
};

type Props = {
    setShowSettingsForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserSettingsForm = (props: Props) => {
    const auth = useAuth();
    const [clicked, setClicked] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SettingsForm>({ mode: 'onBlur' });

    useEffect(() => {
        setValue('name', auth?.userData?.name!);
        setValue('screen_name', auth?.userData?.screen_name!);
        setValue('email', auth?.userData?.email!);
        setValue('profile', auth?.userData?.profile!);
    }, []);

    const onSubmit: SubmitHandler<SettingsForm> = (data) => {
        setClicked(true);

        const editData = {
            ...data,
            id: auth?.userData?.id,
        };

        auth?.edit(editData)
            .then(() => {
                props.setShowSettingsForm(false);
            })
            .catch((error) => {
                console.error(error);
                setClicked(false);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                {errors.name?.type === 'maxLength' && (
                    <p>アカウント名は30文字以下で入力してください。</p>
                )}
                {errors.name?.type === 'required' && <p>アカウント名を入力してください。</p>}
                <label>アカウント名</label>
                <input
                    type="text"
                    maxLength={30}
                    autoComplete="on"
                    {...register('name', { required: true, maxLength: 30 })}
                />
            </div>
            <div>
                {errors.screen_name?.type === 'required' && <p>アカウントIDを入力してください。</p>}
                {errors.screen_name?.type === 'maxLength' && (
                    <p>アカウントIDは20文字以下で入力してください。</p>
                )}
                {errors.screen_name?.type === 'pattern' && (
                    <p>アカウントIDは半角英数字のみ使用できます。</p>
                )}
                <label>アカウントID</label>
                <input
                    type="text"
                    maxLength={20}
                    autoComplete="on"
                    {...register('screen_name', {
                        required: true,
                        maxLength: 20,
                        pattern: /^(?=.*?[a-zA-Z\d])[a-zA-Z\d]+$/,
                    })}
                />
            </div>
            <div>
                {errors.email?.type === 'required' && <p>メールアドレスを入力してください。</p>}
                {errors.email?.type === 'maxLength' && (
                    <p>メールアドレスは255文字以下で入力してください。</p>
                )}
                {errors.email?.type === 'pattern' && (
                    <p>正しい形式のメールアドレスを入力してください。</p>
                )}
                <label>メールアドレス</label>
                <input
                    type="email"
                    maxLength={255}
                    autoComplete="on"
                    {...register('email', {
                        required: true,
                        maxLength: 255,
                        pattern:
                            /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    })}
                />
            </div>
            <div>
                {errors.profile?.type === 'maxLength' && (
                    <p>プロフィールは300文字以下で入力してください。</p>
                )}
                <label>プロフィール</label>
                <textarea maxLength={300} {...register('profile', { maxLength: 300 })} />
            </div>
            <input type="submit" value="変更" disabled={clicked} />
        </form>
    );
};

export default UserSettingsForm;
