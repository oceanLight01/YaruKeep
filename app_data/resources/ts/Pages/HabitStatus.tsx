import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HabitDeleteButton from '../Components/atoms/HabitDeleteButton';
import HabitDoneButton from '../Components/atoms/HabitDoneButton';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/CommentForm';
import commentList from '../Components/CommentList';
import DistributionCalendar from '../Components/ContributionCalendar';
import DiaryForm from '../Components/DiaryForm';
import DiaryList from '../Components/DiaryList';
import EditHabitForm from '../Components/EditHabitForm';
import formatText from '../Components/FormatText';
import Paginate from '../Components/Paginate';
import PageRender from './PageRender';

const HabitStatus = () => {
    const auth = useAuth();
    const [HabitItem, setHabitItem] = useState<HabitItem>({
        id: 0,
        title: '',
        description: '',
        category_id: 0,
        category_name: '',
        max_done_day: -1,
        done_days_count: -1,
        done_days_list: {},
        is_private: false,
        is_done: false,
        user: {
            id: 0,
            name: '',
            screen_name: '',
        },
        can_post_diary: false,
        comments: [],
        created_at: '',
        updated_at: '',
    });
    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);
    const [tab, setTab] = useState<'diary' | 'comment'>('diary');
    const params = useParams<{ screenName: string; id: string }>();
    const isLoginUser = auth?.userData?.id === HabitItem.user.id;
    const navigate = useNavigate();
    const [diaries, setDiaries] = useState<DiaryItem[]>([]);

    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    useEffect(() => {
        axios
            .get(`/api/user/${params.screenName}/habits/${params.id}`)
            .then((res) => {
                setHabitItem(res.data.data);
                setStatusCode(res.data.status);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
            });

        getDiary(params.id, paginateData.currentPage);
    }, []);

    const doneHabit = (habitId: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                setHabitItem(res.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const updateHabit = async (habitItem: HabitItem) => {
        await getDiary(params.id, paginateData.currentPage);
        setHabitItem(habitItem);
        setEditing(false);
    };

    const deleteHabit = (habitId: number) => {
        if (window.confirm('ハビットトラッカーを削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/habits/${habitId}`)
                .then(() => {
                    navigate(`/user/${auth?.userData?.screen_name}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const getDiary = async (id?: string, page = paginateData.currentPage) => {
        return axios
            .get(`/api/habits/${id}/diaries?page=${page}`)
            .then((res) => {
                const data = res.data.data;
                if (data.length > 0) {
                    setDiaries(data);

                    const paginate = res.data.meta;
                    setPaginateData({
                        ...paginateData,
                        perPage: paginate.per_page,
                        totalItem: paginate.total,
                        currentPage: paginate.current_page,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const paginateDiary = (page: number) => {
        getDiary(params.id, page);
    };

    return (
        <PageRender status={statusCode}>
            <>
                {!editing ? (
                    <div>
                        <h2>{HabitItem.title}</h2>
                        <p>{formatText(HabitItem.description)}</p>
                        <p>カテゴリ:{HabitItem.category_name}</p>
                        <p>総達成日数:{HabitItem.done_days_count}日</p>
                        <p>最大連続達成日数:{HabitItem.max_done_day}日</p>
                        <p>作成日:{HabitItem.created_at}</p>
                        <div>
                            <DistributionCalendar values={HabitItem.done_days_list} />
                        </div>
                        {isLoginUser ? (
                            <>
                                <HabitDoneButton
                                    doneHabit={doneHabit}
                                    id={HabitItem.id}
                                    isDone={HabitItem.is_done}
                                />
                                <HabitDeleteButton id={HabitItem.id} deleteHabit={deleteHabit} />
                                {HabitItem.can_post_diary ? (
                                    <DiaryForm habitId={HabitItem.id} updateHabit={updateHabit} />
                                ) : null}
                            </>
                        ) : null}
                    </div>
                ) : isLoginUser ? (
                    <EditHabitForm
                        {...{
                            title: HabitItem.title,
                            description: HabitItem.description ? HabitItem.description : '',
                            categoryId: HabitItem.category_id,
                            isPrivate: HabitItem.is_private ? 'true' : 'false',
                            habitId: HabitItem.id,
                            updateHabit: updateHabit,
                        }}
                    />
                ) : null}
                {isLoginUser ? (
                    <button onClick={() => setEditing(!editing)}>
                        {editing ? '戻る' : '編集する'}
                    </button>
                ) : null}
                <CommentForm
                    {...{
                        userId: auth?.userData?.id!,
                        itemId: HabitItem.id,
                        parentId: null,
                        commentType: 'habit',
                        updateItem: updateHabit,
                    }}
                    habitComment
                />

                <button onClick={() => setTab(tab === 'diary' ? 'comment' : 'diary')}>
                    {tab === 'diary' ? 'コメント' : '日記'}
                </button>
                {tab === 'diary' ? (
                    <>
                        <DiaryList diaries={diaries} />
                        {diaries.length > 0 ? (
                            <Paginate
                                perPage={paginateData.perPage}
                                itemCount={paginateData.totalItem}
                                getData={paginateDiary}
                            />
                        ) : (
                            <p>日記はありません。</p>
                        )}
                    </>
                ) : (
                    <ul>
                        {HabitItem.comments.map((item, index) => {
                            return commentList({
                                item,
                                updateItem: updateHabit,
                                commentType: 'habit',
                                index,
                            });
                        })}
                    </ul>
                )}
            </>
        </PageRender>
    );
};

export default HabitStatus;
