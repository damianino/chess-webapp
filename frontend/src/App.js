import {
    Routes,
    Route
} from 'react-router-dom';

import GamePage from './pages/GamePage';
import StartPage from './pages/StartPage';

const App = () => {
    

    return (
        <>
            <Routes>
                <Route exact path='/' element={
                    <StartPage />
                } />
                <Route exact path='/game' element={
                    <GamePage />
                }/>
            </Routes>
        </>
    );
}

export default App;