import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../Components/Authenticate';
import HabitTracker from '../Components/HabitTracker';
import SearchForm from '../Components/SearchForm';

type SearchFormData = {
    keyword: string;
    categories: string[];
};

const Search = () => {
    const [searchResult, setSearchResult] = useState<HabitItem[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [noContent, setNoContent] = useState<boolean>(false);
    const auth = useAuth();

    const searchHabit = (data: SearchFormData) => {
        setSearchResult([]);
        setSearching(true);
        setNoContent(false);

        axios
            .post('/api/search', data)
            .then((res) => {
                const data = res.data.data;
                if (data !== undefined) {
                    setSearchResult(data);
                } else {
                    setNoContent(true);
                }
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
            <SearchForm searchHabit={searchHabit} />
            <hr />
            {noContent && <p>検索結果はありませんでした。</p>}
            <div>
                {searching ? (
                    <p>検索中...</p>
                ) : (
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
                )}
            </div>
        </>
    );
};

export default Search;
