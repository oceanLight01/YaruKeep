import React from 'react';

import styles from './../../../scss/FormRule.modules.scss';

type Props = {
    rule: string;
};

const FormRule = ({ rule }: Props) => {
    return <p className={styles.form_rule}>{rule}</p>;
};

export default FormRule;
