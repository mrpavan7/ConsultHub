import "./App.css";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import DoctorsPage from "./Pages/DoctorsPage";

function App() {
  return (
    <>
      <div className="banner">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
