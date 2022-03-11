import React, { useState } from 'react';
import SearchForm from '../Components/SearchForm';

const Search = () => {
    const [searchResult, setSearchResult] = useState<HabitItem[]>([]);

    return (
        <>
            <h1>検索ページ</h1>
            <SearchForm />
            <hr />
        </>
    );
};

export default Search;
