import React from 'react';

import styles from 'scss/Components/Atoms/FormVaridateMessage.modules.scss';

type Props = {
    message: string;
};

const FormVaridateMessage = ({ message }: Props) => {
    return <p className={styles.varidate_text}>{message}</p>;
};

export default FormVaridateMessage;
