import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

    return (
        <PageRender status={statusCode}>
            <>
                <p>{diary?.text}</p>
                <p>{diary?.created_at}</p>
            </>
        </PageRender>
    );
};

export default Diary;
