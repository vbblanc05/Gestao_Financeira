import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactElement;
}

export default function RequireAuth({ children }: Props) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}