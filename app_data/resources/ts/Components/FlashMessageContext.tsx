import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import styles from 'scss/Components/FlashMessage.modules.scss';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
    const renderFlg = useRef(false);

    useEffect(() => {
        if (renderFlg.current) {
            const timer = setTimeout(() => {
                flashMessage?.resetMessage();
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        } else {
            renderFlg.current = true;
        }
    }, [startTime]);

    const icon =
        message?.type === 'success' ? (
            <CheckCircleOutlineIcon fontSize="large" />
        ) : (
            <ErrorOutlineIcon fontSize="large" />
        );
    const color = message?.type === 'success' ? styles.success : styles.error;

    return message !== undefined && message.type !== 'none' ? (
        <div className={`${styles.container} ${color}`}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.message}>{flashMessage?.flashMessage.message}</div>
        </div>
    ) : null;
};
