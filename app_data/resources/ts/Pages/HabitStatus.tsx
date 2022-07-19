import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Button from '../Components/Atoms/Buttons/Button';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/Molecules/Forms/CommentForm';
import commentList from '../Components/commentList';
import ContributionCalendar from '../Components/Atoms/ContributionCalendar';
import DiaryForm from '../Components/Molecules/Forms/DiaryForm';
import DiaryList from '../Components/DiaryList';
import EditHabitForm from '../Components/Molecules/Forms/EditHabitForm';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/Atoms/FormatText';
import LoginUserContent from '../Components/Atoms/LoginUserContent';
import Paginate from '../Components/Atoms/Paginate';
import Diary from './Diary';
import PageRender from './PageRender';

import styles from 'scss/Pages/HabitStatus.modules.scss';
import CategoryBadge from '../Components/Atoms/CategoryBadge';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Circular from '../Components/Atoms/Circular';

type Habit = {
    data: HabitItem;
};

type Diaries = {
    data: DiaryItem[];
    meta: {
        per_page: number;
        total: number;
        current_page: number;
    };
};

const HabitStatus = () => {
    const auth = useAuth();
    const flashMessage = useMessage();

    const [habitItem, setHabitItem] = useState<HabitItem | null>(null);
    const [diaries, setDiaries] = useState<DiaryItem[]>([]);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [diariesFetch, setDiariesFetch] = useState<boolean>(false);
    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);

    const params = useParams<{ screenName: string; id: string }>();
    const navigate = useNavigate();
    const userId = habitItem?.user?.id;

    let unmounted = false;

    useEffect(() => {
        Promise.all([fetchHabitItem(), fetchPaginateDiary(params.id, paginateData.currentPage)])
            .then(() => {
                setStatusCode(200);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => {
            unmounted = true;
        };
    }, []);

    // ハビットトラッカーを1つ取得
    const fetchHabitItem = async () => {
        const habit: AxiosResponse<Habit> = await axios.get(
            `/api/user/${params.screenName}/habits/${params.id}`
        );

        if (!unmounted) {
            setHabitItem(habit.data.data);
        }
    };

    // ハビットトラッカーの完了処理
    const doneHabit = async (habitId: number) => {
        try {
            const done: AxiosResponse = await axios.post('/api/habits/done', {
                userId: auth?.userData?.id,
                id: habitId,
            });

            if (!unmounted && done.status === 200) {
                setHabitItem({ ...habitItem!, is_done: true });
                flashMessage?.setMessage('今日の目標を達成しました🎉 お疲れ様です!');
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                if (!unmounted) {
                    flashMessage?.setErrorMessage('更新に失敗しました。', error!.response!.status);
                }
        }
    };

    // ハビットトラッカーを更新する
    const updateHabitItem = async (habitItem: HabitItem) => {
        if (!unmounted) {
            setHabitItem(habitItem);
            setEditing(false);
        }
    };

    // 日記フォームの表示切り替えs
    const toggleRenderDiaryForm = () => {
        if (habitItem) {
            setHabitItem({
                ...habitItem,
                can_post_diary: !habitItem.can_post_diary,
            });
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

    const fetchPaginateDiary = async (id?: string, page = paginateData.currentPage) => {
        setDiariesFetch(true);

        try {
            const diaries: AxiosResponse<Diaries> = await axios.get(
                `/api/habits/${id}/diaries?page=${page}`
            );

            if (!unmounted) {
                setDiaries(diaries.data.data);

                const paginate = diaries.data.meta;
                setPaginateData({
                    ...paginateData,
                    perPage: paginate.per_page,
                    totalItem: paginate.total,
                    currentPage: paginate.current_page,
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        '日記の取得に失敗しました。',
                        error!.response!.status
                    );
                }
            }
        }

        setDiariesFetch(false);
    };

    const paginateDiary = (page: number) => {
        fetchPaginateDiary(params.id, page);
    };

    // タブコンポーネントのstateHook
    const [tabValue, setTabValue] = useState('1');
    const handleChange = (event: any, newValue: string) => {
        setTabValue(newValue);
    };

    // モーダルウィンドウの処理
    const [modalActive, setModalActive] = useState<boolean>(true);
    let body = document.body;
    const modalActiveClass = styles.modal_active;

    function toggleModal() {
        if (modalActive) {
            setModalActive(false);

            body.classList.add(modalActiveClass);
            body.style.top = `-${window.scrollY}px`;
            body.style.position = 'fixed';
        } else {
            setModalActive(true);

            const scrolly = body.style.top;
            body.style.position = '';
            body.style.top = '';

            window.scroll({
                top: parseInt(scrolly || '0') * -1,
            });

            body.classList.remove(modalActiveClass);
        }
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return isLoading ? (
        <Circular />
    ) : (
        <PageRender status={statusCode}>
            <>
                {habitItem && (
                    <div className={styles.habit_status_container}>
                        <div className={styles.habit_status_wrapper}>
                            <div>
                                <h1 className={styles.habit_tracker_title}>{habitItem.title}</h1>
                                <p className={styles.habit_tracker_description}>
                                    {formatText(habitItem.description)}
                                </p>

                                <div className={styles.calendar_container}>
                                    <div className={styles.calendar_wrapper}>
                                        <ContributionCalendar values={habitItem.done_days_list} />
                                    </div>
                                    <div className={styles.habit_tracker_done_info}>
                                        <div>
                                            <div className={styles.done_title}>合計達成日数</div>
                                            <div className={styles.done_day}>
                                                <span>{habitItem.done_days_count}</span>日
                                            </div>
                                        </div>
                                        <div>
                                            <div className={styles.done_title}>
                                                最大連続達成日数
                                            </div>
                                            <div className={styles.done_day}>
                                                <span>{habitItem.max_done_day}</span>日
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.habit_tracker_category_and_private}>
                                    <CategoryBadge
                                        {...{
                                            category_id: habitItem.category_id,
                                            category_name: habitItem.category_name,
                                        }}
                                    />
                                    {habitItem.is_private && (
                                        <div className={styles.private}>
                                            <div>非公開</div>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.habit_tracker_created}>
                                    {habitItem.created_at}
                                </div>
                                <div className={styles.habit_tracker_user_name}>
                                    <Link to={`/user/${habitItem.user.screen_name}`}>
                                        {habitItem.user.name}
                                    </Link>
                                </div>
                                <LoginUserContent userId={userId!}>
                                    <div className={styles.habit_tracker_buttons}>
                                        <Button
                                            value="完了"
                                            clickHandler={() => doneHabit(habitItem.id)}
                                            disabled={habitItem.is_done}
                                        />
                                        <div>
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
                                                        toggleModal();
                                                    }}
                                                >
                                                    編集
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleClose();
                                                        deleteHabit(habitItem.id);
                                                    }}
                                                >
                                                    削除
                                                </MenuItem>
                                            </Menu>
                                        </div>
                                    </div>
                                </LoginUserContent>
                            </div>

                            <LoginUserContent userId={userId!}>
                                <EditHabitForm
                                    {...{
                                        title: habitItem.title,
                                        description: habitItem.description
                                            ? habitItem.description
                                            : '',
                                        categoryId: habitItem.category_id,
                                        isPrivate: habitItem.is_private ? 'true' : 'false',
                                        habitId: habitItem.id,
                                        activeModal: !modalActive,
                                        toggleModal: toggleModal,
                                        updateHabit: updateHabitItem,
                                    }}
                                />
                            </LoginUserContent>
                            <hr />
                            <Routes>
                                <Route
                                    path=""
                                    element={
                                        <>
                                            {habitItem.can_post_diary && (
                                                <LoginUserContent userId={userId!}>
                                                    <DiaryForm
                                                        habitId={habitItem.id}
                                                        updateDiaries={fetchPaginateDiary}
                                                        toggleRenderDiaryForm={
                                                            toggleRenderDiaryForm
                                                        }
                                                    />
                                                </LoginUserContent>
                                            )}

                                            <CommentForm
                                                {...{
                                                    userId: auth?.userData?.id!,
                                                    itemId: habitItem.id,
                                                    parentId: null,
                                                    commentType: 'habit',
                                                    updateItem: updateHabitItem,
                                                }}
                                                habitComment
                                            />

                                            <TabContext value={tabValue}>
                                                <Box
                                                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                                                >
                                                    <TabList onChange={handleChange}>
                                                        <Tab label="日記" value="1" />
                                                        <Tab label="コメント" value="2" />
                                                    </TabList>
                                                </Box>
                                                <TabPanel value="1">
                                                    <>
                                                        {diariesFetch ? (
                                                            <Circular />
                                                        ) : diaries.length > 0 ? (
                                                            <>
                                                                <DiaryList diaries={diaries} />

                                                                <Paginate
                                                                    perPage={paginateData.perPage}
                                                                    itemCount={
                                                                        paginateData.totalItem
                                                                    }
                                                                    currentPage={
                                                                        paginateData.currentPage
                                                                    }
                                                                    handleClick={paginateDiary}
                                                                />
                                                            </>
                                                        ) : (
                                                            <p>日記はありません。</p>
                                                        )}
                                                    </>
                                                </TabPanel>
                                                <TabPanel value="2">
                                                    <ul>
                                                        {habitItem.comments.map((item, index) => {
                                                            return commentList({
                                                                item,
                                                                updateItem: updateHabitItem,
                                                                commentType: 'habit',
                                                                index,
                                                            });
                                                        })}
                                                    </ul>
                                                </TabPanel>
                                            </TabContext>
                                        </>
                                    }
                                />
                                <Route
                                    path="diary/:did"
                                    element={
                                        <Diary
                                            updateDiaries={fetchPaginateDiary}
                                            toggleRenderDiaryForm={toggleRenderDiaryForm}
                                        />
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                )}
            </>
        </PageRender>
    );
};

export default HabitStatus;
