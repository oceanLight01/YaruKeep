import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from 'scss/Pages/Top.modules.scss';

const Top = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.description}>
                    <h2>継続は力なり</h2>
                    <p>
                        スキルを身につけたい、資格を取得したい、生活をより良くしたい
                        <br />
                        何か目標を達成するために習慣をつけたいが中々続かない...
                    </p>
                    <h2>Yarukeepとは</h2>
                    <p>
                        日々の習慣を記録するハビットトラッカー式のアプリケーションです。
                        過去の記録を一目で確認できて習慣継続のモチベーションが維持できます。
                        １０種類以上のカテゴリで様々な分野での習慣化に利用できます。
                        またハビットトラッカーごとに1日1つ日記を記録できます。
                        その日の成果や出来事、思ったことなど好きなことを記入しましょう。
                    </p>
                    <p>
                        ハビットトラッカーは他のユーザのものも閲覧できます。
                        そしてハビットトラッカーや日記にコメントすることができます。
                        似たような習慣や同じカテゴリで頑張っている人たちと一緒に目標達成を目指しましょう。
                    </p>
                    <p>
                        ちょっとしたことも積み重ねで次第に大きくなっていきます。あなたも今日から習慣化を始めて目標達成を目指しましょう！
                    </p>
                </div>
                <div className={styles.buttons_container}>
                    <div className={styles.button_wrapper}>
                        <Button variant="contained">
                            <Link to="register">新規登録</Link>
                        </Button>
                    </div>
                    <div className={styles.button_wrapper}>
                        <Button variant="contained">
                            <Link to="login">ログイン</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Top;
