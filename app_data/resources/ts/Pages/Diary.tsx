import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DiaryDeleteButton from '../Components/atoms/DiaryDeleteButton';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/CommentForm';
import commentList from '../Components/commentList';
import EditDiaryForm from '../Components/EditDiaryForm';
import formatText from '../Components/FormatText';
import LoginUserContent from '../Components/LoginUserContent';
import PageRender from './PageRender';

const Diary = () => {
    const initialData = {
        id: 0,
        habit_id: 0,
        text: '',
        user: {
            id: 0,
            screen_name: '',
            name: '',
        },
        comments: [],
        created_at: '',
    };

    const params = useParams<{ id: string; did: string }>();
    const locationPath = useLocation().pathname;
    const habitPath = locationPath.match(/\/user\/[\w]+\/habit\/[\d]+/);
    const navigate = useNavigate();

    const [diary, setDiary] = useState<DiaryItem>({ ...initialData });
    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);

    const auth = useAuth();

    useEffect(() => {
        setDiary({ ...initialData });

        axios
            .get(`/api/habits/${params.id}/diaries/${params.did}`)
            .then((res) => {
                setDiary(res.data.data);
                setStatusCode(res.data.status);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
            });
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
                <Link to={`${habitPath![0]}`}>戻る</Link>
                {!editing ? (
                    <div>
                        <p>{formatText(diary.text)}</p>
                        <p>{diary.created_at}</p>
                        <LoginUserContent userId={diary.user.id}>
                            <DiaryDeleteButton diaryId={diary.id} deleteDiary={deleteDiary} />
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
                            }}
                        />
                    </div>
                )}

                <LoginUserContent userId={diary.user.id}>
                    <button onClick={() => setEditing(!editing)}>
                        {editing ? '戻る' : '編集する'}
                    </button>
                </LoginUserContent>

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
