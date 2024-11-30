import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import CreateUser from './CreateUser';
import LogoutPage from './LogoutPage';
import RecoveryPage from './RecoveryPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/home/:userID" element={<HomePage />}></Route>
          <Route path="/create" element={<CreateUser />}></Route>
          <Route path="/logout" element={<LogoutPage />}></Route>
          <Route path="/forgot" element={<RecoveryPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
