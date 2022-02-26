import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DiaryDeleteButton from '../Components/atoms/DiaryDeleteButton';
import { useAuth } from '../Components/Authenticate';
import EditDiaryForm from '../Components/EditDiaryForm';
import formatText from '../Components/FormatText';
import PageRender from './PageRender';

type Diary = {
    id: number;
    habit_id: number;
    text: string;
    user_id: number;
    created_at: string;
};

const Diary = () => {
    const params = useParams<{ id: string; did: string }>();
    const [diary, setDiary] = useState<Diary>({
        id: 0,
        habit_id: 0,
        text: '',
        user_id: 0,
        created_at: '',
    });
    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);
    const navigate = useNavigate();
    const auth = useAuth();
    const isUser = auth?.userData?.id === diary.user_id;

    useEffect(() => {
        axios
            .get(`/api/habits/${params.id}/diaries/${params.did}`)
            .then((res) => {
                setDiary(res.data.data);
                setStatusCode(res.data.status);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
            });
    }, []);

    const updateDiary = (diaryItem: Diary) => {
        setDiary(diaryItem);
        setEditing(false);
    };

    const deleteDiary = (diaryId: number) => {
        if (window.confirm('日記を削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/diaries/${diaryId}`)
                .then(() => {
                    navigate(`/user/${auth?.userData?.screen_name}/habit/${diary.habit_id}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <PageRender status={statusCode}>
            <>
                {!editing ? (
                    <div>
                        <p>{formatText(diary.text)}</p>
                        <p>{diary.created_at}</p>

                        {isUser && (
                            <DiaryDeleteButton diaryId={diary.id!} deleteDiary={deleteDiary} />
                        )}
                    </div>
                ) : (
                    <div>
                        <EditDiaryForm
                            {...{
                                id: diary.id,
                                text: diary.text,
                                habitId: diary.habit_id,
                                updateDiary: updateDiary,
                            }}
                        />
                    </div>
                )}
                {isUser && (
                    <button onClick={() => setEditing(!editing)}>
                        {editing ? '戻る' : '編集する'}
                    </button>
                )}
            </>
        </PageRender>
    );
};

export default Diary;
