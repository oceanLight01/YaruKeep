import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import HabitDeleteButton from '../Components/atoms/HabitDeleteButton';
import HabitDoneButton from '../Components/atoms/HabitDoneButton';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/CommentForm';
import commentList from '../Components/commentList';
import DistributionCalendar from '../Components/ContributionCalendar';
import DiaryForm from '../Components/DiaryForm';
import DiaryList from '../Components/DiaryList';
import EditHabitForm from '../Components/EditHabitForm';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/FormatText';
import LoginUserContent from '../Components/LoginUserContent';
import Paginate from '../Components/Paginate';
import Diary from './Diary';
import PageRender from './PageRender';

const HabitStatus = () => {
    const auth = useAuth();
    const flashMessage = useMessage();

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
    const [diaries, setDiaries] = useState<DiaryItem[]>([]);
    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);
    const [tab, setTab] = useState<'diary' | 'comment'>('diary');

    const params = useParams<{ screenName: string; id: string }>();
    const navigate = useNavigate();
    const userId = HabitItem.user.id;

    let unmounted = false;

    useEffect(() => {
        axios
            .get(`/api/user/${params.screenName}/habits/${params.id}`)
            .then((res) => {
                if (!unmounted) {
                    setHabitItem(res.data.data);
                    setStatusCode(res.data.status);
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    setStatusCode(error.response.status);
                }
            });

        getDiary(params.id, paginateData.currentPage);

        return () => {
            unmounted = true;
        };
    }, []);

    const doneHabit = (habitId: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                if (!unmounted) {
                    flashMessage?.setMessage('今日の目標を達成しました🎉 お疲れ様です!');
                    setHabitItem(res.data.data);
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage('更新に失敗しました。', error.response.status);
                }
            });
    };

    const updateHabit = async (habitItem: HabitItem) => {
        await getDiary(params.id, paginateData.currentPage);
        if (!unmounted) {
            setHabitItem(habitItem);
            setEditing(false);
        }
    };

    const deleteHabit = (habitId: number) => {
        if (window.confirm('ハビットトラッカーを削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/habits/${habitId}`)
                .then(() => {
                    if (!unmounted) {
                        flashMessage?.setMessage('ハビットトラッカーを削除しました。');
                        navigate(`/user/${auth?.userData?.screen_name}`);
                    }
                })
                .catch((error) => {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            'ハビットトラッカーの削除に失敗しました。',
                            error.response.status
                        );
                    }
                });
        }
    };

    const getDiary = async (id?: string, page = paginateData.currentPage) => {
        return axios
            .get(`/api/habits/${id}/diaries?page=${page}`)
            .then((res) => {
                if (!unmounted) {
                    const data = res.data.data;
                    if (data) {
                        setDiaries(data);

                        const paginate = res.data.meta;
                        setPaginateData({
                            ...paginateData,
                            perPage: paginate.per_page,
                            totalItem: paginate.total,
                            currentPage: paginate.current_page,
                        });
                    }
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        '日記の取得に失敗しました。',
                        error.response.status
                    );
                }
            });
    };

    const paginateDiary = (page: number) => {
        getDiary(params.id, page);
    };

    const TabContents = () => {
        return (
            <>
                {HabitItem.can_post_diary && (
                    <LoginUserContent userId={userId}>
                        <DiaryForm habitId={HabitItem.id} updateHabit={updateHabit} />
                    </LoginUserContent>
                )}
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
        );
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
                        <p>
                            <Link to={`/user/${HabitItem.user.screen_name}`}>
                                {HabitItem.user.name}
                            </Link>
                        </p>
                        <p>作成日:{HabitItem.created_at}</p>
                        <div>
                            <DistributionCalendar values={HabitItem.done_days_list} />
                        </div>
                        <LoginUserContent userId={userId}>
                            <>
                                <HabitDoneButton
                                    doneHabit={doneHabit}
                                    id={HabitItem.id}
                                    isDone={HabitItem.is_done}
                                />
                                <HabitDeleteButton id={HabitItem.id} deleteHabit={deleteHabit} />
                            </>
                        </LoginUserContent>
                    </div>
                ) : (
                    <LoginUserContent userId={userId}>
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
                    </LoginUserContent>
                )}

                <LoginUserContent userId={HabitItem.user.id}>
                    <button onClick={() => setEditing(!editing)}>
                        {editing ? '戻る' : '編集する'}
                    </button>
                </LoginUserContent>
                <hr />
                <Routes>
                    <Route path="" element={<TabContents />} />
                    <Route path="diary/:did" element={<Diary />} />
                </Routes>
            </>
        </PageRender>
    );
};

export default HabitStatus;
