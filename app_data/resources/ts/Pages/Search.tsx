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

    const mapHabitItem = (props: any): HabitItem => {
        return {
            id: props.id,
            title: props.title,
            description: props.description,
            categoryId: props.category_id,
            categoryName: props.category_name,
            maxDoneDay: props.max_done_day,
            doneDaysCount: props.done_days_count,
            doneDaysList: props.done_days_list,
            isPrivate: props.is_private,
            isDone: props.is_done,
            user: {
                id: props.user.id,
                name: props.user.name,
                screenName: props.user.screen_name,
            },
            diaries: props.diaries,
            canPostDiary: props.can_post_diary,
            comments: props.comments,
            created_at: props.created_at,
            updated_at: props.updated_at,
        };
    };

    const searchHabit = (data: SearchFormData) => {
        setSearchResult([]);
        setSearching(true);
        setNoContent(false);

        axios
            .post('/api/search', data)
            .then((res) => {
                const data = res.data.data;
                if (data !== undefined) {
                    setSearchResult(
                        data.map((item: HabitItem) => {
                            return mapHabitItem(item);
                        })
                    );
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
                const data = mapHabitItem(res.data.data);
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
