import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';

const ProfileImageForm = () => {
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);
    const [clicked, setClicked] = useState<boolean>(false);

    const auth = useAuth();
    const flashMessage = useMessage();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const getImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files!.length === 0) {
            return;
        }

        const image = e.target.files![0];
        setImage(image);
        setPreview(window.URL.createObjectURL(image));
        setErrorMessage([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (image === undefined) {
            setErrorMessage(['画像を選択してください。']);
            return;
        }

        setClicked(true);

        const data = new FormData();
        data.append('profile_image', image!);
        data.append('user_id', String(auth?.userData?.id));

        const headers = { 'content-type': 'multipart/form-data' };

        try {
            await axios
                .post('/api/user/image', data, { headers })
                .then(() => {
                    if (!unmounted) {
                        setPreview('');
                        flashMessage?.setMessage('プロフィール画像を変更しました。');
                    }
                    auth?.getUser();
                })
                .finally(() => {
                    setClicked(false);
                });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response !== undefined) {
                if (!unmounted) {
                    if (error.response.status === 413) {
                        setErrorMessage([
                            'プロフィール画像のファイルサイズは1MB以下にしてください。',
                        ]);
                    } else {
                        const errorList = error.response.data.errors.profile_image;
                        if (errorList.length > 0) {
                            setErrorMessage(errorList.map((message: string) => message));
                        } else {
                            flashMessage?.setErrorMessage(
                                'プロフィール画像の変更に失敗しました。',
                                error.response.status
                            );
                        }
                    }
                }
            }
        }
    };

    return (
        <>
            {errorMessage.length > 0 &&
                errorMessage.map((message, index) => <p key={index}>{message}</p>)}
            {preview && <img src={preview} alt="プロフィール画像のプレビュー" />}
            <img
                src={`/storage/profiles/${auth?.userData?.profile_image}`}
                alt="現在設定されているプロフィール画像"
            />
            <div>
                <ul>
                    <li>形式: jpg, png</li>
                    <li>ファイルサイズ: 最大1MB</li>
                    <li>1辺の長さ: 最大1000ピクセル×1000ピクセル</li>
                </ul>
            </div>
            <form name="profile_img">
                <label htmlFor="profile_img">プロフィール画像</label>
                <br />
                <input
                    type="file"
                    name="profile_img"
                    accept=".png, .jpg, .jpeg"
                    onChange={getImage}
                />
                <input
                    type="button"
                    value="送信"
                    onClick={(e) => handleSubmit(e)}
                    disabled={clicked}
                />
            </form>
        </>
    );
};

export default ProfileImageForm;
