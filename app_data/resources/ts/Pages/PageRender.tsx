import React from 'react';

type Props = {
    children: JSX.Element;
    status: number;
};

const PageRender = ({ children, status }: Props) => {
    switch (status) {
        case 404:
            return <p>お探しのページは存在しません。すでに削除された可能性があります。</p>;
        case 500:
            return <p>サーバーエラーが発生しました。時間を置いて再度アクセスしてください。</p>;
        default:
            return children;
    }
};

export default PageRender;
