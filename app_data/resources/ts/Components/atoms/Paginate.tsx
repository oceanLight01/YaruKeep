import React from 'react';

import styles from './../../../scss/Paginate.modules.scss';

type Props = {
    currentPage: number;
    perPage: number;
    itemCount: number;
    handleClick: (pageNumber: number) => void;
};

const Paginate = ({ currentPage = 1, perPage = 1, itemCount = 1, handleClick }: Props) => {
    const PageCount = Math.ceil(itemCount / perPage);
    const CurrentPageRange = perPage;
    const BeforMarginCurrentPage = currentPage - Math.floor(CurrentPageRange / 2);
    const AfterMarginCurrentPage = currentPage + Math.floor(CurrentPageRange / 2);
    const MarginPagesDisplayed = 1;
    const ListEdgeRange = Math.ceil(CurrentPageRange / 2);

    const ActiveLink = (pageNumber: number) => {
        if (currentPage === pageNumber) {
            return styles.active;
        }
        return;
    };

    const handleChangePage = (number: number) => {
        if (currentPage === number) {
            return;
        }

        return handleClick(number);
    };

    const changePreviousPage = () => {
        if (currentPage === 1) {
            return;
        }

        return handleClick(currentPage - 1);
    };

    const changeNextPage = () => {
        if (currentPage === PageCount) {
            return;
        }

        return handleClick(currentPage + 1);
    };

    // 表示ページ番号とその前後のページ番号を表示するリスト
    const pageList: number[] = [];
    const pageListBefor: number[] = [];
    const pageListAfter: number[] = [];

    if (PageCount <= CurrentPageRange) {
        // 総ページ数が最大表示範囲以下の場合
        for (let i = 1; i <= PageCount; i++) {
            pageList.push(i);
        }
    } else {
        // 現在のページ番号とその前後の範囲のページ番号の表示
        if (currentPage > ListEdgeRange && currentPage <= PageCount - ListEdgeRange) {
            for (let i = BeforMarginCurrentPage; i <= AfterMarginCurrentPage; i++) {
                pageList.push(i);
            }
        }

        // 最先頭のページ番号の表示
        if (currentPage > ListEdgeRange) {
            if (PageCount >= CurrentPageRange + MarginPagesDisplayed) {
                for (let j = 1; j < BeforMarginCurrentPage; j++) {
                    if (j <= MarginPagesDisplayed) {
                        pageListBefor.push(j);
                    } else {
                        break;
                    }
                }
            } else {
                for (let j = 1; j <= PageCount - CurrentPageRange; j++) {
                    pageListBefor.push(j);
                }
            }
        }

        // 最後尾のページ番号の表示
        if (currentPage <= PageCount - ListEdgeRange) {
            if (PageCount >= CurrentPageRange + MarginPagesDisplayed) {
                for (let k = PageCount - MarginPagesDisplayed + 1; k <= PageCount; k++) {
                    if (k <= AfterMarginCurrentPage) {
                        continue;
                    } else {
                        pageListAfter.push(k);
                    }
                }
            } else {
                for (let k = CurrentPageRange + 1; k <= PageCount; k++) {
                    pageListAfter.push(k);
                }
            }
        }

        // 現在のページ番号が最大表示範囲の半分より小さい場合
        if (currentPage <= ListEdgeRange) {
            for (let i = 1; i <= CurrentPageRange; i++) {
                pageList.push(i);
            }
        }

        // 大きい場合
        if (currentPage > PageCount - ListEdgeRange) {
            for (let i = PageCount - CurrentPageRange + 1; i <= PageCount; i++) {
                pageList.push(i);
            }
        }
    }

    // 省略表示
    const isBreakBefor = pageList[0] - pageListBefor[pageListBefor.length - 1] > 1;
    const isBreakAfter = pageListAfter[0] - pageList[pageList.length - 1] > 1;

    return (
        <ul className={styles.container}>
            <li
                className={`${styles.previous_item} ${styles.page_item}`}
                onClick={changePreviousPage}
            >
                <a className={styles.page_link}>{'<'}</a>
            </li>

            {pageListBefor.map((number, index) => {
                return (
                    <li
                        key={index}
                        className={`${styles.page_item} ${ActiveLink(number)}`}
                        onClick={() => handleChangePage(number)}
                    >
                        <a className={styles.page_link}>{number}</a>
                    </li>
                );
            })}
            {isBreakBefor && <li className={styles.page_item}>...</li>}
            {pageList.map((number, index) => {
                return (
                    <li
                        key={index}
                        className={`${styles.page_item} ${ActiveLink(number)}`}
                        onClick={() => handleChangePage(number)}
                    >
                        <a className={styles.page_link}>{number}</a>
                    </li>
                );
            })}
            {isBreakAfter && <li className={styles.page_item}>...</li>}
            {pageListAfter.map((number, index) => {
                return (
                    <li
                        key={index}
                        className={`${styles.page_item} ${ActiveLink(number)}`}
                        onClick={() => handleChangePage(number)}
                    >
                        <a className={styles.page_link}>{number}</a>
                    </li>
                );
            })}
            <li className={`${styles.previous_item} ${styles.page_item}`} onClick={changeNextPage}>
                <a className={styles.page_link}>{'>'}</a>
            </li>
        </ul>
    );
};

export default Paginate;
