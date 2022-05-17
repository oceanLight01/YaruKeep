import React from 'react';
import ReactPaginate from 'react-paginate';

import styles from './../../scss/Paginate.modules.scss';

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
            onPageChange={handlePageClick}
            containerClassName={styles.paginate}
            pageClassName={styles.page_item}
            pageLinkClassName={styles.page_link}
            activeClassName={styles.active}
            activeLinkClassName={styles.active_link}
            previousLabel="<"
            previousClassName={styles.previous_item}
            previousLinkClassName={styles.page_link}
            nextLabel=">"
            nextClassName={styles.next_item}
            nextLinkClassName={styles.page_link}
            breakLabel="..."
            breakClassName={styles.page_item}
            breakLinkClassName={styles.page_link}
            disabledClassName={styles.disabled}
        />
    );
};

export default Paginate;
