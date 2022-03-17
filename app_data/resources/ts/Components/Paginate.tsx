import React from 'react';
import ReactPaginate from 'react-paginate';

type Props = {
    perPage: number;
    itemCount: number;
    getData: (page: number) => void;
};

const Paginate = ({ perPage = 1, itemCount = 1, getData }: Props) => {
    const handlePageClick = (selectedItem: { selected: number }) => {
        const selectPage = selectedItem.selected + 1;
        getData(selectPage);
    };

    const calculatePageCount = (itemCount: number, perPage: number) => {
        return Math.ceil(itemCount / perPage);
    };

    return (
        <ReactPaginate
            pageCount={calculatePageCount(itemCount, perPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            onPageChange={handlePageClick}
        />
    );
};

export default Paginate;
