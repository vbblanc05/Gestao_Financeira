import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import UsuarioPage from "./pages/UsuarioPage";
import RequireAuth from "./components/RequireAuth";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={
                    <RequireAuth>
                        <AdminPage />
                    </RequireAuth>
                } />
                <Route path="/usuario" element={
                    <RequireAuth>
                        <UsuarioPage />
                    </RequireAuth>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;