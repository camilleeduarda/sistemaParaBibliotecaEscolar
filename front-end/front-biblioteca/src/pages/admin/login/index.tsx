import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Assegure-se de que o arquivo de estilo esteja no caminho correto
import "./style.css";

// Estes caminhos de imagem são mantidos, mas você pode substituí-los por ícones SVG
import logo from "../../../assets/cedup-logo.png";
import bookIcon from "../../../assets/book-icon.png";

// Interface para a resposta do backend
interface AuthResponse {
  mensagem: string;
  tipoAcesso: "ADMIN" | "MASTER" | null;
}

function AdminLogin() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (senha.trim() === "") {
      setErro("Por favor, digite a senha.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/bibliotecaria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senha }),
      });

      // Lê a resposta JSON, independentemente do status (401, 200, etc.)
      const data: AuthResponse = await response.json();

      if (response.ok) {
        const tipoAcesso = data?.tipoAcesso;

        if (tipoAcesso === "ADMIN") {
          navigate("/home/admin");
        } else if (tipoAcesso === "MASTER") {
          navigate("/home/master");
        } else {
          setErro(data?.mensagem || "Login realizado, mas tipo de acesso desconhecido.");
        }
      } else {
        // Usa a mensagem de erro do backend (ex: "Senha incorreta")
        setErro(data?.mensagem || "Erro na autenticação. Verifique a senha.");
      }
    } catch (error) {
      console.error("Erro de conexão ou processamento:", error);
      setErro("Erro de conexão com o servidor. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="CEDUP Hermann Hering" className="login-logo" />

        <div className="login-title">
          <img src={bookIcon} alt="Ícone de livro" className="book-icon" />
          <h1>Bem-vindo(a)!</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />

          {erro && <p className="login-error">{erro}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="login-footer">Acesso exclusivo para administradores</p>
      </div>
    </div>
  );
}

export default AdminLogin;