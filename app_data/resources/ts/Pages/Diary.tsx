import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DiaryDeleteButton from '../Components/atoms/DiaryDeleteButton';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/CommentForm';
import commentList from '../Components/commentList';
import EditDiaryForm from '../Components/EditDiaryForm';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/FormatText';
import LoginUserContent from '../Components/LoginUserContent';
import PageRender from './PageRender';

import styles from './../../scss/Diary.modules.scss';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Diary = () => {
    const initialData = {
        id: 0,
        habit_id: 0,
        text: '',
        user: {
            id: 0,
            screen_name: '',
            name: '',
            profile_image: '',
        },
        comments: [],
        created_at: '',
    };

    const params = useParams<{ id: string; did: string }>();
    const locationPath = useLocation().pathname;
    const navigate = useNavigate();

    const [diary, setDiary] = useState<DiaryItem>({ ...initialData });
    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);

    const auth = useAuth();
    const flashMessage = useMessage();
    let unmounted = false;

    useEffect(() => {
        setDiary({ ...initialData });

        axios
            .get(`/api/habits/${params.id}/diaries/${params.did}`)
            .then((res) => {
                if (!unmounted) {
                    setDiary(res.data.data);
                    setStatusCode(res.data.status);
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    setStatusCode(error.response.status);
                }
            });

        return () => {
            unmounted = true;
        };
    }, [locationPath]);

    const updateDiary = (diaryItem: DiaryItem) => {
        setDiary(diaryItem);
        setEditing(false);
    };

    const deleteDiary = (diaryId: number) => {
        if (window.confirm('日記を削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/diaries/${diaryId}`)
                .then(() => {
                    if (!unmounted) {
                        flashMessage?.setMessage('日記を削除しました。');
                        navigate(`/user/${auth?.userData?.screen_name}/habit/${diary.habit_id}`);
                    }
                })
                .catch((error) => {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            '日記の削除に失敗しました。',
                            error.response.status
                        );
                    }
                });
        }
    };

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
                                    <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
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
        </PageRender>
    );
};

export default Diary;
