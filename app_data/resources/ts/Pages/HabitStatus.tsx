import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Button from '../Components/atoms/Button';
import { useAuth } from '../Components/Authenticate';
import CommentForm from '../Components/CommentForm';
import commentList from '../Components/commentList';
import ContributionCalendar from '../Components/ContributionCalendar';
import DiaryForm from '../Components/DiaryForm';
import DiaryList from '../Components/DiaryList';
import EditHabitForm from '../Components/EditHabitForm';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/FormatText';
import LoginUserContent from '../Components/LoginUserContent';
import Paginate from '../Components/Paginate';
import Diary from './Diary';
import PageRender from './PageRender';

import styles from './../../scss/HabitStatus.modules.scss';
import CategoryBadge from '../Components/atoms/CategoryBadge';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';

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
            await setHabitItem(habitItem);
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

    // タブコンポーネントのstateHook
    const [tabValue, setTabValue] = useState('1');
    const handleChange = (event: any, newValue: string) => {
        setTabValue(newValue);
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

                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange}>
                            <Tab label="日記" value="1" />
                            <Tab label="コメント" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
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
                    </TabPanel>
                    <TabPanel value="2">
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
                    </TabPanel>
                </TabContext>
            </>
        );
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

    return (
        <div className={styles.habit_status_container}>
            <div className={styles.habit_status_wrapper}>
                <PageRender status={statusCode}>
                    <>
                        <div>
                            <h1 className={styles.habit_tracker_title}>{HabitItem.title}</h1>
                            <p className={styles.habit_tracker_description}>
                                {formatText(HabitItem.description)}
                            </p>

                            <div className={styles.calendar_container}>
                                <div className={styles.calendar_wrapper}>
                                    <ContributionCalendar values={HabitItem.done_days_list} />
                                </div>
                                <div className={styles.habit_tracker_done_info}>
                                    <div>
                                        <div className={styles.done_title}>合計達成日数</div>
                                        <div className={styles.done_day}>
                                            <span>{HabitItem.done_days_count}</span>日
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.done_title}>最大連続達成日数</div>
                                        <div className={styles.done_day}>
                                            <span>{HabitItem.max_done_day}</span>日
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.habit_tracker_category_and_private}>
                                <CategoryBadge
                                    {...{
                                        category_id: HabitItem.category_id,
                                        category_name: HabitItem.category_name,
                                    }}
                                />
                                {HabitItem.is_private && (
                                    <div className={styles.private}>
                                        <div>非公開</div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.habit_tracker_created}>
                                {HabitItem.created_at}
                            </div>
                            <div className={styles.habit_tracker_user_name}>
                                <Link to={`/user/${HabitItem.user.screen_name}`}>
                                    {HabitItem.user.name}
                                </Link>
                            </div>
                            <LoginUserContent userId={userId}>
                                <div className={styles.habit_tracker_buttons}>
                                    <Button
                                        value="完了"
                                        clickHandler={() => doneHabit(HabitItem.id)}
                                        disabled={HabitItem.is_done}
                                    />
                                    <div>
                                        <IconButton onClick={handleClick}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
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
                                                    deleteHabit(HabitItem.id);
                                                }}
                                            >
                                                削除
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </LoginUserContent>
                        </div>

                        <LoginUserContent userId={userId}>
                            <EditHabitForm
                                {...{
                                    title: HabitItem.title,
                                    description: HabitItem.description ? HabitItem.description : '',
                                    categoryId: HabitItem.category_id,
                                    isPrivate: HabitItem.is_private ? 'true' : 'false',
                                    habitId: HabitItem.id,
                                    activeModal: !modalActive,
                                    toggleModal: toggleModal,
                                    updateHabit: updateHabit,
                                }}
                            />
                        </LoginUserContent>
                        <hr />
                        <Routes>
                            <Route path="" element={<TabContents />} />
                            <Route path="diary/:did" element={<Diary />} />
                        </Routes>
                    </>
                </PageRender>
            </div>
        </div>
    );
};

export default HabitStatus;
