import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../Components/Authenticate';
import HabitTracker from '../Components/HabitTracker';
import Paginate from '../Components/Paginate';
import SearchForm from '../Components/SearchForm';

type SearchFormData = {
    keyword: string;
    categories: string[];
};

const Search = () => {
    const [searchResult, setSearchResult] = useState<HabitItem[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [noContent, setNoContent] = useState<boolean>(false);
    const [searchData, setSearchData] = useState<SearchFormData>({ keyword: '', categories: [] });

    const auth = useAuth();

    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    const setSearchInfo = (data: SearchForm) => {
        setSearchData(data);
        setSearchResult([]);
        setSearching(true);
        setNoContent(false);
        searchHabit(1, data);
    };

    const searchHabit = (page = paginateData.currentPage, searchFormData?: SearchForm) => {
        const data = searchFormData === undefined ? searchData : searchFormData;
        const searchInfo = {
            ...data,
            page: page,
        };

        axios
            .post('/api/search', searchInfo)
            .then((res) => {
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
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setSearching(false);
            });
    };

    const doneHabit = (habitId: number, index?: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                const data = res.data.data;
                if (index !== undefined) {
                    setSearchResult(
                        searchResult.map((habit, key) => {
                            return key === index ? data : habit;
                        })
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <h1>検索ページ</h1>
            <SearchForm searchHabit={setSearchInfo} />
            <hr />
            {noContent && <p>検索結果はありませんでした。</p>}
            <div>
                {searching ? (
                    <p>検索中...</p>
                ) : (
                    <>
                        <ul>
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
                    </>
                )}
                {searchResult.length > 0 ? (
                    <Paginate
                        perPage={paginateData.perPage}
                        itemCount={paginateData.totalItem}
                        getData={searchHabit}
                    />
                ) : null}
            </div>
        </>
    );
};

export default Search;
