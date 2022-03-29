import { AxiosError } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Message = {
    type: 'success' | 'error' | 'none';
    message: string;
};

type MessageProps = {
    flashMessage: Message;
    nowTime: number;
    setMessage: (message: string) => void;
    setErrorMessage: (message: string, statusCode: number) => void;
    resetMessage: () => void;
};

type Props = {
    children: JSX.Element;
};

// フラッシュメッセージ用のコンテキスト
const FlashMessageContext = createContext<MessageProps | null>(null);
export const useMessage = () => {
    return useContext(FlashMessageContext);
};

const ProvideMessage = ({ children }: Props) => {
    const message = useProvideMessage();

    return <FlashMessageContext.Provider value={message}>{children}</FlashMessageContext.Provider>;
};

export default ProvideMessage;

const useProvideMessage = () => {
    const [flashMessage, setFlashMessage] = useState<Message>({ type: 'none', message: '' });
    const [nowTime, setNowtime] = useState(Date.now());

    const setMessage = (message: string) => {
        setFlashMessage({
            ...flashMessage,
            type: 'success',
            message: message,
        });
        setNowtime(Date.now());
    };

    const setErrorMessage = (message: string, statusCode: number) => {
        const errorMessage =
            statusCode >= 500
                ? 'サーバーエラーが発生しました。時間を置いて再度アクセスしてください。'
                : message;

        setFlashMessage({
            ...flashMessage,
            type: 'error',
            message: errorMessage,
        });
        setNowtime(Date.now());
    };

    const resetMessage = () => {
        setFlashMessage({
            ...flashMessage,
            type: 'none',
            message: '',
        });
    };

    return { flashMessage, nowTime, setMessage, setErrorMessage, resetMessage };
};

/**
 * フォームのデータを送信後の処理結果をフラッシュメッセージで表示する
 * 5秒後に非表示にする
 */
export const FlashMessage = () => {
    const flashMessage = useMessage();
    const message = flashMessage?.flashMessage;
    const startTime = flashMessage?.nowTime;

    useEffect(() => {
        const timer = setTimeout(() => {
            flashMessage?.resetMessage();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [startTime]);

    return message !== undefined && message.type !== 'none' ? (
        <p style={{ backgroundColor: message.type === 'success' ? 'lime' : 'red' }}>
            {flashMessage?.flashMessage.message}
        </p>
    ) : null;
};
