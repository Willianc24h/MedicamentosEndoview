const instrucoes = {
  // Anticoagulantes
  AAS: { suspender: "Manter a medicação", retornar: "Manter a medicação" },
  Aspirina: { suspender: "Manter a medicação", retornar: "Manter a medicação" },
  Plavix: { suspender: "7 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Clopidogrel: { suspender: "7 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Brilinta: { suspender: "5 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Marevan: { suspender: "5 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Coumadin: { suspender: "5 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Rivaroxaban: { suspender: "2 dias antes do exame", retornar: "No 2º dia após o exame" },
  Apixaban: { suspender: "2 dias antes do exame", retornar: "No 2º dia após o exame" },
  Edoxaban: { suspender: "2 dias antes do exame", retornar: "No 2º dia após o exame" },
  Dabigatran: { suspender: "2 dias antes do exame", retornar: "No 2º dia após o exame" },

  // Perda de peso
  Semaglutida: { suspender: "21 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Dulaglutida: { suspender: "10 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Liraglutida: { suspender: "3 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Tirzepatida: { suspender: "14 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Naltrexona: { suspender: "3 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Dapagliflozina: { suspender: "3 dias antes do exame", retornar: "No dia seguinte ao exame" },
  Empagliflozina: { suspender: "3 dias antes do exame", retornar: "No dia seguinte ao exame" },
};

// ---------------- Funções Auxiliares ----------------
function getRadioValue(name) {
  const selecionado = document.querySelector(`input[name="${name}"]:checked`);
  return selecionado ? selecionado.value : "";
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
  const descricaoAlergia = document.getElementById("descricaoAlergia").value.trim();

  let texto = `
Problema cardíaco: ${getRadioValue("coracao")}
Problema renal: ${getRadioValue("renal")}
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
Problema respiratório: ${getRadioValue("respiratorio")}
Alergia: ${getRadioValue("alergia")}
Descrição da alergia: ${descricaoAlergia || "Não se aplica"}
Uso de remédio para perda de peso: ${peso}
Medicamento peso: ${medPeso || "Não informado"}
`;

  if (medPeso && instrucoes[medPeso]) {
    texto += `
Suspensão: ${instrucoes[medPeso].suspender}
Retorno: ${instrucoes[medPeso].retornar}
`;
  }

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

  select.style.display = "none";
}

// --------- Função específica para ALERGIA ------------
function configurarAlergia(radioSim, radioNao, input) {
  radioSim.addEventListener("change", () => {
    if (radioSim.checked) {
      input.style.display = "block";
    }
  });

  radioNao.addEventListener("change", () => {
    if (radioNao.checked) {
      input.style.display = "none";
      input.value = "";
    }
  });

  input.style.display = "none";
}

// ---------------- Validação ----------------
function validarFormulario() {
  const perguntas = [
    { nome: "coracao", numero: 1 },
    { nome: "renal", numero: 2 },
    {
      nome: "coagulacao",
      numero: 3,
      medicamento: "medicamentoCoagulacao",
      tipo: "coagulação",
    },
    { nome: "respiratorio", numero: 4 },
    { nome: "alergia", 
      numero: 5,
      medicamento: "descricaoAlergia",
      tipo: "alergia",
    },
    {
      nome: "peso",
      numero: 7,
      medicamento: "medicamentoPeso",
      tipo: "perda de peso",
    },
  ];

  for (const p of perguntas) {
    const resposta = getRadioValue(p.nome);
    if (!resposta) {
      alert(`Responda a pergunta ${p.numero}.`);
      return false;
    }

    if (resposta === "Sim" && p.medicamento) {
      const med = getSelectValue(p.medicamento);
      if (!med) {
        alert(`Indique o medicamento para ${p.tipo}.`);
        return false;
      }
    }
  }

  return true;
}

// ---------------- Inicialização ----------------
document.addEventListener("DOMContentLoaded", () => {
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

  configurarAlergia(
    document.getElementById("respostaAlergiaSim"),
    document.getElementById("respostaAlergiaNao"),
    document.getElementById("descricaoAlergia")
  );

  // Botão Copiar com validação
  document.getElementById("btnCopiar").addEventListener("click", () => {
    if (!validarFormulario()) return;

    const dados = coletarDados();
    navigator.clipboard
      .writeText(dados)
      .then(() => {
        alert("Dados copiados para a área de transferência!");
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err);
      });
  });

  // Botão Limpar
  document.getElementById("btnLimpar").addEventListener("click", () => {
    document.getElementById("formulario").reset();
    document
      .querySelectorAll(".resposta")
      .forEach((div) => (div.style.display = "none"));
    document
      .querySelectorAll("select, input[type='text']")
      .forEach((el) => (el.style.display = "none"));
  });
});
