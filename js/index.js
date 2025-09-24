const instrucoes = {
  // Anticoagulantes
  AAS: {
    suspender: "Manter a medicação",
    retornar: "Manter a medicação"
  },
  Plavix: {
    suspender: "7 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Brilinta: {
    suspender: "5 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Rivaroxaban: {
    suspender: "2 dias antes do exame",
    retornar: "No 2º dia após o exame"
  },

  // Perda de peso
  Semaglutida: {
    suspender: "21 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Dulaglutida: {
    suspender: "10 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Liraglutida: {
    suspender: "3 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Tirzepatida: {
    suspender: "14 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Naltrexona: {
    suspender: "3 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Dapagliflozina: {
    suspender: "3 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  },
  Empagliflozina: {
    suspender: "3 dias antes do exame",
    retornar: "No dia seguinte ao exame"
  }
};

// ---------------- Funções Auxiliares ----------------
function getRadioValue(name) {
  const selecionado = document.querySelector(`input[name="${name}"]:checked`);
  return selecionado ? selecionado.value : "Não informado";
}

function getSelectValue(id) {
  const select = document.getElementById(id);
  return select && select.value ? select.value : "";
}

function coletarDados() {
  const coagulacao = getRadioValue("coagulacao");
  const peso = getRadioValue("peso");

  const medCoagulacao = getSelectValue("medicamentoCoagulacao");
  const medPeso = getSelectValue("medicamentoPeso");

  let texto = `
Problema cardíaco: ${getRadioValue("coracao")}
Problema renal: ${getRadioValue("renal")}
Alergia: ${getRadioValue("alergia")}
Problema respiratório: ${getRadioValue("respiratorio")}

Coagulação: ${coagulacao}
Medicamento coagulação: ${medCoagulacao || "Não informado"}
`;

  if (medCoagulacao && instrucoes[medCoagulacao]) {
    texto += `
Suspensão: ${instrucoes[medCoagulacao].suspender}
Retorno: ${instrucoes[medCoagulacao].retornar}
`;
  }

  texto += `
Uso de remédio para perda de peso: ${peso}
Medicamento peso: ${medPeso || "Não informado"}
`;

  if (medPeso && instrucoes[medPeso]) {
    texto += `
Suspensão: ${instrucoes[medPeso].suspender}
Retorno: ${instrucoes[medPeso].retornar}
`;
  }

  texto += `
Unidade preferida: ${getRadioValue("unidade")}
`;

  return texto.trim();
}

// ---------------- Função Mostrar/Esconder ----------------
function configurarPergunta(radioSim, radioNao, select, respostaId) {
  const respostaDiv = document.createElement("div");
  respostaDiv.id = respostaId;
  respostaDiv.classList.add("resposta");
  respostaDiv.style.display = "none";
  select.insertAdjacentElement("afterend", respostaDiv);

  radioSim.addEventListener("change", () => {
    if (radioSim.checked) {
      select.style.display = "block";
    }
  });

  radioNao.addEventListener("change", () => {
    if (radioNao.checked) {
      select.style.display = "none";
      respostaDiv.style.display = "none";
      select.value = "";
    }
  });

  select.addEventListener("change", () => {
    const valor = select.value;
    if (instrucoes[valor]) {
      respostaDiv.innerHTML = `
        <div style="color:#b22222; margin-bottom:5px; border:1px solid #b22222; padding:8px; border-radius:5px; background:#ffe5e5;">
          Suspender medicação: <strong>${instrucoes[valor].suspender}</strong>
        </div>
        <div style="color:#006400; border:1px solid #006400; padding:8px; border-radius:5px; background:#e6ffe6;">
          Retornar a medicação: <strong>${instrucoes[valor].retornar}</strong>
        </div>
      `;
      respostaDiv.style.display = "block";
    } else {
      respostaDiv.style.display = "none";
    }
  });

  // Inicial: esconder select
  select.style.display = "none";
}

// ---------------- Inicialização ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Configurar selects condicionais
  configurarPergunta(
    document.getElementById("respostaCoagulacaoSim"),
    document.getElementById("respostaCoagulacaoNao"),
    document.getElementById("medicamentoCoagulacao"),
    "respostaAnticoagulante"
  );

  configurarPergunta(
    document.getElementById("respostaPesoSim"),
    document.getElementById("respostaPesoNao"),
    document.getElementById("medicamentoPeso"),
    "respostaPeso"
  );

  // Botão Copiar
  document.getElementById("btnCopiar").addEventListener("click", () => {
    const dados = coletarDados();
    navigator.clipboard.writeText(dados).then(() => {
      alert("Dados copiados para a área de transferência!");
    }).catch(err => {
      console.error("Erro ao copiar: ", err);
    });
  });

  // Botão Limpar
  document.getElementById("btnLimpar").addEventListener("click", () => {
    document.getElementById("formulario").reset();
    document.querySelectorAll(".resposta").forEach(div => (div.style.display = "none"));
    document.querySelectorAll("select").forEach(select => (select.style.display = "none"));
  });
});
