import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';

const ProfileImageForm = () => {
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const auth = useAuth();
    const flashMessage = useMessage();

    const getImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const image = e.target.files[0];
        setImage(image);
        setPreview(window.URL.createObjectURL(image));
        setErrorMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (image === undefined) {
            setErrorMessage('画像を選択してください。');
            return;
        }

        const data = new FormData();
        data.append('profile_image', image!);
        data.append('user_id', String(auth?.userData?.id));

        const headers = { 'content-type': 'multipart/form-data' };
        await axios
            .post('/api/user/image', data, { headers })
            .then(() => {
                setPreview('');
                flashMessage?.setMessage('プロフィール画像を変更しました。');
            })
            .catch((error) => {
                flashMessage?.setErrorMessage(
                    'プロフィール画像の変更に失敗しました。',
                    error.response.status
                );
            });

        auth?.getUser();
    };

    return (
        <>
            {errorMessage.length > 0 && <p>{errorMessage}</p>}
            {preview && <img src={preview} alt="プロフィール画像のプレビュー" />}
            <img
                src={`/storage/profiles/${auth?.userData?.profile_image}`}
                alt="現在設定されているプロフィール画像"
            />
            <form name="profile_img">
                <label htmlFor="profile_img">プロフィール画像</label>
                <br />
                <input
                    type="file"
                    name="profile_img"
                    accept="image/*,.png,.jpg"
                    onChange={getImage}
                />
                <input type="button" value="送信" onClick={(e) => handleSubmit(e)} />
            </form>
        </>
    );
};

export default ProfileImageForm;
