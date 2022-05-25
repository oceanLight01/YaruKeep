import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Components/Authenticate';
import { useMessage } from '../Components/FlashMessageContext';
import HabitTracker from '../Components/HabitTracker';
import Paginate from '../Components/Paginate';
import SearchForm from '../Components/SearchForm';
import Circular from '../Components/atoms/Circular';

import styles from './../../scss/Search.modules.scss';

type SearchFormData = {
    keyword: string;
    categories: string;
};

const Search = () => {
    const [searchResult, setSearchResult] = useState<HabitItem[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [noContent, setNoContent] = useState<boolean>(false);
    const [searchData, setSearchData] = useState<SearchFormData>({ keyword: '', categories: '' });

    const auth = useAuth();
    const flashMessage = useMessage();
    let unmounted = false;

    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    // フォームに入力された検索情報を保存
    const setSearchInfo = (data: SearchForm) => {
        setSearchData(data);
        setSearchResult([]);
        setSearching(true);
        setNoContent(false);
        searchHabit(1, data);
    };

    // 検索情報をもとにデータを取得
    const searchHabit = (page = paginateData.currentPage, searchFormData?: SearchForm) => {
        setSearching(true);

        const data = searchFormData === undefined ? searchData : searchFormData;
        const keyword = data.keyword;
        const categoriesId =
            data.categories.length === 0 ? [] : data.categories.split(',').map((id) => Number(id));
        const searchInfo = {
            keyword: keyword,
            categories: categoriesId,
            page: page,
        };

        axios
            .post('/api/search', searchInfo)
            .then((res) => {
                if (!unmounted) {
                    const data = res.data.habits;
                    if (data !== undefined) {
                        setSearchResult(data);
                    } else {
                        setNoContent(true);
                    }

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
                if (!unmounted) {
                    flashMessage?.setErrorMessage('検索に失敗しました。', error.response.status);
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setSearching(false);
                }
            });
    };

    const doneHabit = (habitId: number, index?: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                flashMessage?.setMessage('今日の目標を達成しました🎉 お疲れ様です!');
                if (!unmounted) {
                    const data = res.data.data;
                    if (index !== undefined) {
                        setSearchResult(
                            searchResult.map((habit, key) => {
                                return key === index ? data : habit;
                            })
                        );
                    }
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage('更新に失敗しました。', error.response.status);
                }
            });
    };

    return (
        <div className={styles.search_container}>
            <div className={styles.search_wrapper}>
                <h1 className={styles.title}>ハビットトラッカー検索</h1>
                <SearchForm searchHabit={setSearchInfo} disabled={searching} />
                {searchResult.length > 0 && <hr />}
                {noContent && <p>検索結果はありませんでした。</p>}
                <div className={styles.search_result}>
                    {searching ? (
                        <Circular />
                    ) : (
                        <ul className={styles.habit_list}>
                            {searchResult.map((item, index) => {
                                return (
                                    <HabitTracker
                                        item={item}
                                        index={index}
                                        doneHabit={doneHabit}
                                        key={index}
                                    />
                                );
                            })}
                        </ul>
                    )}
                    {searchResult.length > 0 && (
                        <Paginate
                            perPage={paginateData.perPage}
                            itemCount={paginateData.totalItem}
                            getData={searchHabit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
