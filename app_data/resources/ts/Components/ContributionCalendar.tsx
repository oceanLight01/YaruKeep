import React from 'react';
import Calendar from 'react-github-contribution-calendar';

type Props = {
    values: { [date: string]: number };
};

const DistributionCalendar = (props: Props) => {
    const date = new Date();
    const until = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const values = props.values;
    const weekNames = ['', 'M', '', 'W', '', 'F', ''];
    const monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const panelColors = ['#EEEEEE', '#F78A23'];
    const panelAttributes = { rx: 2, ry: 2 };

    return (
        <Calendar
            values={values}
            until={until}
            weekNames={weekNames}
            monthNames={monthNames}
            panelColors={panelColors}
            dateFormat={'YYYY-MM-DD'}
            weekLabelAttributes={{}}
            monthLabelAttributes={{}}
            panelAttributes={panelAttributes}
        />
    );
};

export default DistributionCalendar;
