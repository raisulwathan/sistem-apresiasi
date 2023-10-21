import styles from "./style";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

import HomePage from "./pages/HomePage";
import Students from "./pages/Dashboard/Students";

const App = () => (
  <Router>
    <div className={`bg-primary w-full overflow-hidden  `}>
      <div className={`${styles.boxWidth}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mahasiswa" element={<Students />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
