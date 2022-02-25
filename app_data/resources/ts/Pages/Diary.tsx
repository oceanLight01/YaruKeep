import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DiaryDeleteButton from '../Components/atoms/DiaryDeleteButton';
import { useAuth } from '../Components/Authenticate';
import PageRender from './PageRender';

type Diary = {
    id: number;
    habit_id: number;
    text: string;
    created_at: string;
};

const Diary = () => {
    const params = useParams<{ id: string; did: string }>();
    const [diary, setDiary] = useState<Diary>();
    const [statusCode, setStatusCode] = useState<number>(0);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        axios
            .get(`/api/habits/${params.id}/diaries/${params.did}`)
            .then((res) => {
                setDiary(res.data);
                setStatusCode(res.data.status);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
            });
    }, []);

    const deleteDiary = (diaryId: number) => {
        if (window.confirm('日記を削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/diaries/${diaryId}`)
                .then(() => {
                    navigate(`/user/${auth?.userData?.screen_name}/habit/${diary?.habit_id}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <PageRender status={statusCode}>
            <>
                <p>{diary?.text}</p>
                <p>{diary?.created_at}</p>
                <DiaryDeleteButton diaryId={diary?.id!} deleteDiary={deleteDiary} />
            </>
        </PageRender>
    );
};

export default Diary;
