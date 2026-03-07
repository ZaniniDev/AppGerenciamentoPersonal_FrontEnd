"use client"; // Define que este componente roda no navegador

import { useParams } from "next/navigation";
import { useState } from "react";

export default function CadastrarAluno() {
  
  // 1. Capturar o parâmetro da URL
  const params = useParams();
  const idAluno = params.idAluno;

  // 2. Estado para o formulário
  const [nome, setNome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Cadastrando aluno ID: ${idAluno}, Nome: ${nome}`);
    alert("Aluno cadastrado com sucesso!");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Cadastro de Aluno</h1>
      <p>A editar o perfil do ID: <strong>{idAluno}</strong></p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <label>
          Nome do Aluno:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Digite o nome completo"
          />
        </label>
        
        <button type="submit" style={{ padding: "10px", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}>
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
}