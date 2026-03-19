/* =========================================================
   RF DRIVER — TABELA CENTRAL DE TAXAS
   ========================================================= */

const Taxas = {

  tipoViagem: {
    ida: 0,
    bateVolta: 1,
    idaVolta: 1,
    idaVoltaEspera: 1.2
  },

  noturno: {
    inicio: "22:30",
    fim: "05:00",
    valorFixo: 4.99,
    percentual: 0.35
  },

  desvioRotaSimples: 4.99,
  voltaPraia: 9.99,
  feira: 4.99,

  animal: {
    pequeno: 4.99,
    medio: 6.99,
    grande: 9.99,
    longa: 19.90
  },

  veiculo6Lugares: {
    percentual: 0.5
  },

  espera: {
    minutosGratis: 4,
    valorInicial: 3,
    valorPorMinuto: 0.59
  }
};


/* =========================================================
   MOTOR CENTRAL DE CÁLCULO
   ========================================================= */

function calcularValorFinal({ 
  valorBase,
  tipoViagem = "ida",
  categoriaMult = 1,
  categoriaNome = "",
  adicionais = {}
}) {

  let total = valorBase;

  /* ================= TIPO DE VIAGEM ================= */
  if (Taxas.tipoViagem[tipoViagem]) {
    total += valorBase * Taxas.tipoViagem[tipoViagem];
  }

  /* ================= ADICIONAIS ================= */
  if (adicionais.feira) total += Taxas.feira;
  if (adicionais.voltaPraia) total += Taxas.voltaPraia;
  if (adicionais.desvio) total += Taxas.desvioRotaSimples;

  if (adicionais.animal) {
    total += Taxas.animal[adicionais.animal] || 0;
  }

  /* ================= NOTURNO AUTOMÁTICO ================= */

  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const horarioAtual = hora * 60 + minuto;

  const [hIni, mIni] = Taxas.noturno.inicio.split(":").map(Number);
  const [hFim, mFim] = Taxas.noturno.fim.split(":").map(Number);

  const inicioMin = hIni * 60 + mIni;
  const fimMin = hFim * 60 + mFim;

  let noturnoAtivo = false;

  if (inicioMin > fimMin) {
    // faixa atravessa meia-noite
    noturnoAtivo = horarioAtual >= inicioMin || horarioAtual <= fimMin;
  } else {
    noturnoAtivo = horarioAtual >= inicioMin && horarioAtual <= fimMin;
  }

  if (noturnoAtivo) {
    total += Taxas.noturno.valorFixo;
    total += total * Taxas.noturno.percentual;
  }

  /* ================= VEÍCULO 6 LUGARES ================= */

  if (categoriaNome.includes("6")) {
    total += total * Taxas.veiculo6Lugares.percentual;
  }

  /* ================= CATEGORIA ================= */

  total *= categoriaMult;

  /* ================= DINÂMICO ================= */

  if (typeof Dinamico !== "undefined" && Dinamico.ativo) {
    total *= Dinamico.multiplicador;
  }

  return Number(total.toFixed(2));
}
