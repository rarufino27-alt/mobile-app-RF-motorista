window.DataManager = {

  /* =========================
     CONFIGURAÇÃO GLOBAL
  ========================== */

  TAXA_PLATAFORMA: 0.15, // 15%

  /* =========================
     CRÉDITOS
  ========================== */

  getCreditos(){
    return parseFloat(localStorage.getItem("rf_creditos")) || 0;
  },

  setCreditos(valor){
    const numero = parseFloat(valor) || 0;
    localStorage.setItem("rf_creditos", numero.toFixed(2));
  },

  adicionarCreditos(valor){
    const atual = this.getCreditos();
    this.setCreditos(atual + parseFloat(valor));
  },

  descontarCreditos(valor){
    const atual = this.getCreditos();
    const novo = Math.max(0, atual - parseFloat(valor));
    this.setCreditos(novo);
  },

  validarCreditoParaCorrida(valorCorrida){
    const taxa = valorCorrida * this.TAXA_PLATAFORMA;
    return this.getCreditos() >= taxa;
  },

  aplicarTaxaCorrida(valorCorrida){
    const taxa = valorCorrida * this.TAXA_PLATAFORMA;
    this.descontarCreditos(taxa);
    return taxa;
  },

  /* =========================
     STATUS ONLINE
  ========================== */

  setOnline(status){
    localStorage.setItem("rf_online", status ? "1" : "0");
  },

  isOnline(){
    const status = localStorage.getItem("rf_online");
    return status === "1";
  },

  /* =========================
     GANHOS DO DIA
  ========================== */

  atualizarGanhos(valor){

    const hoje = new Date().toDateString();
    const dataSalva = localStorage.getItem("rf_data_ganhos");

    if(dataSalva !== hoje){
      localStorage.setItem("rf_ganhos_dia", "0.00");
      localStorage.setItem("rf_data_ganhos", hoje);
    }

    const atual = parseFloat(localStorage.getItem("rf_ganhos_dia")) || 0;
    const novo = atual + parseFloat(valor);

    localStorage.setItem("rf_ganhos_dia", novo.toFixed(2));
  },

  getGanhosHoje(){
    return parseFloat(localStorage.getItem("rf_ganhos_dia")) || 0;
  },

  /* =========================
     CORRIDA ATUAL (VERSÃO DEFINITIVA)
  ========================== */

  setCorridaAtual(dados){
    localStorage.setItem("rf_corrida_atual", JSON.stringify(dados));
  },

  getCorridaAtual(){
    const dados = localStorage.getItem("rf_corrida_atual");
    return dados ? JSON.parse(dados) : null;
  },

  atualizarStatusCorridaAtual(status){
    const corrida = this.getCorridaAtual();
    if(!corrida) return;

    corrida.status = status;
    localStorage.setItem("rf_corrida_atual", JSON.stringify(corrida));
  },

  limparCorridaAtual(){
    localStorage.removeItem("rf_corrida_atual");
  },

  /* =========================
     CORRIDA SIMULADA (PARA HOME)
  ========================== */

  criarCorridaSimulada(){

    if(this.getCorridaAtual()) return null;

    const corrida = {
      id: Date.now(),
      valor: 20 + Math.floor(Math.random() * 30),
      origem: "Centro da Cidade",
      destino: "Shopping Principal",
      status: "pendente"
    };

    this.setCorridaAtual(corrida);
    return corrida;
  }

};
