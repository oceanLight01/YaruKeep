import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
        <>
            <h1>Yarukeep</h1>
        </>
    );
};

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
