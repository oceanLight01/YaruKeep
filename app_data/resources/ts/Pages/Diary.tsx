import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/Molecules/Forms/CommentForm';
import commentList from '../Components/commentList';
import EditDiaryForm from '../Components/Molecules/Forms/EditDiaryForm';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/Atoms/FormatText';
import LoginUserContent from '../Components/Atoms/LoginUserContent';
import PageRender from './PageRender';

import styles from 'scss/Pages/Diary.modules.scss';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

type Props = {
    updateDiaries: (id?: string, page?: number) => Promise<void>;
    toggleRenderDiaryForm: () => void;
};

type Diary = {
    data: DiaryItem;
};

const Diary = ({ updateDiaries, toggleRenderDiaryForm }: Props) => {
    const params = useParams<{ id: string; did: string }>();
    const locationPath = useLocation().pathname;
    const navigate = useNavigate();

    const [diary, setDiary] = useState<DiaryItem | null>(null);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);

    const auth = useAuth();
    const flashMessage = useMessage();
    let unmounted = false;

    useEffect(() => {
        const fetchDiaryItem = async () => {
            try {
                const diaryItem: AxiosResponse<Diary> = await axios.get(
                    `/api/habits/${params.id}/diaries/${params.did}`
                );
                if (!unmounted) {
                    setDiary(diaryItem.data.data);
                    setStatusCode(diaryItem.status);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (!unmounted) {
                        setStatusCode(error.response.status);
                    }
                }
            }
        };

        fetchDiaryItem();

        return () => {
            unmounted = true;
        };
    }, [locationPath]);

    // 日記のデータを受け取ってstateを更新
    const updateDiary = (diaryItem: DiaryItem) => {
        setDiary(diaryItem);
        setEditing(false);
    };

    const deleteDiary = async (diaryId: number) => {
        if (window.confirm('日記を削除します。もとに戻せませんがよろしいですか？')) {
            try {
                await axios.delete(`/api/diaries/${diaryId}`);

                if (!unmounted) {
                    toggleRenderDiaryForm();
                    flashMessage?.setMessage('日記を削除しました。');

                    // 日記のリストを更新
                    updateDiaries(String(diary?.habit_id)).catch((error) => {
                        flashMessage?.setErrorMessage(
                            '情報の取得に失敗しました。',
                            error.response.status
                        );
                    });
                }

                navigate(`/user/${auth?.userData?.screen_name}/habit/${diary!.habit_id}`);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            '日記の削除に失敗しました。',
                            error!.response!.status
                        );
                    }
                }
            }
        }
    };

    // 設定
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <PageRender status={statusCode}>
            <>
                <h2>日記</h2>
                {diary && (
                    <>
                        {!editing ? (
                            <div className={styles.diary_container}>
                                <p>{formatText(diary.text)}</p>
                                <div className={styles.created}>{diary.created_at}</div>
                                <LoginUserContent userId={diary.user.id}>
                                    <div className={styles.diary_settings_container}>
                                        <div className={styles.diary_settings}>
                                            <IconButton onClick={handleClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                open={open}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                            >
                                                <MenuItem
                                                    onClick={() => {
                                                        handleClose();
                                                        setEditing(!editing);
                                                    }}
                                                >
                                                    編集
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleClose();
                                                        deleteDiary(diary.id);
                                                    }}
                                                >
                                                    削除
                                                </MenuItem>
                                            </Menu>
                                        </div>
                                    </div>
                                </LoginUserContent>
                            </div>
                        ) : (
                            <div>
                                <EditDiaryForm
                                    {...{
                                        id: diary.id,
                                        text: diary.text,
                                        habitId: diary.habit_id,
                                        updateDiary: updateDiary,
                                        setEditing: setEditing,
                                    }}
                                />
                            </div>
                        )}
                        <h2>日記のコメント</h2>
                        <CommentForm
                            {...{
                                userId: auth?.userData?.id!,
                                itemId: diary.id,
                                parentId: null,
                                updateItem: updateDiary,
                            }}
                        />
                        <ul>
                            {diary.comments.map((item, index) => {
                                return commentList({
                                    item,
                                    updateItem: updateDiary,
                                    commentType: 'diary',
                                    index,
                                });
                            })}
                        </ul>
                    </>
                )}
            </>
        </PageRender>
    );
};

export default Diary;
