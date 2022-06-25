import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Authenticate';
import TopPageHabit from '../Components/TopPageHabit';

import styles from 'scss/Pages/Home.modules.scss';
import Button from '../Components/Atoms/Buttons/Button';

const Home = () => {
    const auth = useAuth();
    const navigation = useNavigate();

    const navigatePage = (page: string) => {
        navigation(page);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.section_container}>
                    <p>達成したい目標を決めてハビットトラッカーを作成しましょう。</p>
                    <Button
                        value="ハビットトラッカーを作成"
                        clickHandler={() => {
                            navigatePage('/post/habit');
                        }}
                    />
                </div>
                <div className={styles.section_container}>
                    <p>作成したハビットトラッカーを管理します。</p>
                    <Button
                        value="マイページ"
                        clickHandler={() => {
                            navigatePage(`/user/${auth?.userData?.screen_name}`);
                        }}
                    />
                </div>
                <TopPageHabit />
            </div>
        </div>
    );
};

export default Home;
