import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Dash from "./Dash";
import Notify from "./Notify"
import Manage from "./Manage";
import Setting from "./Set";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Home (Landing Page) */}
        <Route path="/" element={<Home />} />
        {/* Route for Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/notify" element={<Notify />} />
        <Route path="/topics" element={<Manage />} />
        <Route path="/set" element={<Setting />} />
      </Routes>
    </Router>
  );
};

export default App;
