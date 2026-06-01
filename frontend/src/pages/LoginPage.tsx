import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface FormErrors {
    email?: string;
    senha?: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState("");

    const navigate = useNavigate();

    function validate(): boolean {
        const e: FormErrors = {};

        if (!email.trim())
            e.email = "O e-mail é obrigatório.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = "Informe um e-mail válido.";

        if (!senha)
            e.senha = "A senha é obrigatória.";
        else if (senha.length < 6)
            e.senha = "A senha deve ter no mínimo 6 caracteres.";

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validate()) return;
        
        setApiError("");
        try {
            const response = await api.post("/Auth/login", {
                email,
                senha
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("nome", response.data.nome);

            console.log("LOGIN OK");
            console.log(response.data);

            if (response.data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/usuario");
            }

        } catch (error: any) {
            console.error("ERRO:", error);

            if (error.response) {
                console.log("STATUS:", error.response.status);
                console.log("DADOS:", error.response.data);
            }

            alert("Erro ao realizar login. Verifique seus dados e tente novamente.");
        }
    };

    return (
        <main>
            <h1>Login</h1>

            {apiError && <p style={{ color: "red", fontWeight: "bold" }}>{apiError}</p>}

            <form onSubmit={handleLogin} noValidate>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span style={{ color: "red", display: "block" }}>{errors.email}</span>}
                </div>

                <div>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    {errors.senha && <span style={{ color: "red", display: "block" }}>{errors.senha}</span>}
                </div>

                <button
                    type="submit"
                >
                    Entrar
                </button>
            </form>
        </main>
    );
}