import styles from "./style";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

import HomePage from "./pages/HomePage";
import Students from "./pages/Dashboard/Students";
import AdminFakultas from "./pages/Dashboard/Admin/AdminFakultas";
import AdminWd3 from "./pages/Dashboard/Admin/AdminWd3";
import AdminBiro from "./pages/Dashboard/Admin/AdminBiro";
import ErrorPage from "./ErrorPage";

const App = () => (
  <Router>
    <div className={`bg-primary w-full overflow-hidden  `}>
      <div className={`${styles.boxWidth}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mahasiswa" element={<Students />} />
          <Route path="/adminfakultas" element={<AdminFakultas />} />
          <Route path="/wd3" element={<AdminWd3 />} />
          <Route path="/biro" element={<AdminBiro />} />
          <Route path="/forbidden" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
