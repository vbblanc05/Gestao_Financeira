import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../components/AdminPage.css";

// 1. Interface para tipar o formato da Conta que vem da API
interface Conta {
    id: number;
    nome: string;
    saldo: number;
}

export default function AdminPage() {
    // Pegamos o nome salvo no login para dar boas-vindas
    const nomeUsuario = localStorage.getItem("nome");

    // 2. Estados para controlar os dados na tela
    const [contas, setContas] = useState<Conta[]>([]);
    const [nome, setNome] = useState("");
    const [saldo, setSaldo] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    // 3. useEffect para buscar as contas assim que a página abre (READ)
    useEffect(() => {
        carregarContas();
    }, []);

    async function carregarContas() {
        try {
            // O interceptor que criamos lá atrás vai colocar o token aqui automaticamente!
            const response = await api.get("/Contas");
            setContas(response.data);
        } catch (error) {
            console.error("Erro ao carregar contas:", error);
        }
    }

    // 4. Função para criar uma nova conta (CREATE)
    const handleCriarConta = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        // Validação simples
        if (!nome.trim() || saldo === "") {
            setErro("Preencha o nome e o saldo inicial.");
            return;
        }

        setErro("");
        setLoading(true);

        try {
            await api.post("/Contas", {
                nome,
                saldo: Number(saldo)
            });
            
            // Limpa o formulário após criar
            setNome("");
            setSaldo("");
            
            // Recarrega a lista para a nova conta aparecer instantaneamente
            carregarContas();
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            setErro("Erro ao criar a conta no servidor.");
        } finally {
            setLoading(false);
        }
    };

    // 5. Função para excluir uma conta (DELETE)
    const handleExcluirConta = async (id: number) => {
        // Pede confirmação antes de apagar
        if (!window.confirm("Tem certeza que deseja excluir esta conta?")) return;

        try {
            await api.delete(`/Contas/${id}`);
            // Recarrega a lista para remover a conta da tela
            carregarContas(); 
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
            alert("Erro ao excluir a conta. Ela pode ter transações vinculadas.");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />

            <main className="admin-content">
                <h1>Painel Administrativo</h1>
                <p>Bem-vindo, <strong>{nomeUsuario}</strong></p>

                <hr style={{ margin: "20px 0" }} />

                {/* Formulário de Criação (CREATE) */}
                <section>
                    <h2>Nova Conta</h2>
                    {erro && <p style={{ color: "red" }}>{erro}</p>}
                    
                    <form onSubmit={handleCriarConta} noValidate style={{ marginBottom: "30px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px" }}>Nome da Conta</label>
                                <input 
                                    type="text" 
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Carteira"
                                    style={{ padding: "8px" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px" }}>Saldo Inicial (R$)</label>
                                <input 
                                    type="number" 
                                    value={saldo}
                                    onChange={(e) => setSaldo(e.target.value === "" ? "" : Number(e.target.value))}
                                    placeholder="0.00"
                                    style={{ padding: "8px" }}
                                />
                            </div>
                            <button type="submit" disabled={loading} style={{ padding: "9px 15px", cursor: "pointer" }}>
                                {loading ? "Criando..." : "Criar Conta"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Tabela de Listagem (READ e DELETE) */}
                <section>
                    <h2>Minhas Contas</h2>
                    {contas.length === 0 ? (
                        <p>Nenhuma conta cadastrada ainda.</p>
                    ) : (
                        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", marginTop: "10px" }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>ID</th>
                                    <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Nome</th>
                                    <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Saldo</th>
                                    <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contas.map(conta => (
                                    <tr key={conta.id}>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{conta.id}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{conta.nome}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>R$ {conta.saldo.toFixed(2)}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                                            <button 
                                                onClick={() => handleExcluirConta(conta.id)} 
                                                style={{ color: "red", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </div>
    );
}