const DataManager = {

  rotas: [],

  arquivos: [

    "./data/Padaria-de-Gilberto-Cruzeiro.json",
    "./data/aguia-american-club-br-101.json",
    "./data/bairro-baixo.json",
    "./data/bairro-alto.json",
    "./data/calhetas.json",
    "./data/centro-do-cabo.json",
    "./data/cohab.json",
    "./data/condominio-porto-do-cabo.json",
    "./data/dharma-ville.json",
    "./data/enseadas.json",
    "./data/gaibu.json",
    "./data/longas.json",
    "./data/itapuama.json",
    "./data/lote-garapu2-lote-dona-amara.json",
    "./data/setor-4.json",
    "./data/shopping-costinha.json",
    "./data/xareu.json"

  ],

  async carregar(){

    try{

      const respostas = await Promise.all(

        this.arquivos.map(a =>
          fetch(a + "?v=" + Date.now())
          .then(r => {

            if(!r.ok){
              throw new Error("Falha ao carregar " + a)
            }

            return r.json()

          })
        )

      )

      let dados = []

      // 🔥 SUPORTE AOS 3 FORMATOS
      respostas.forEach(bloco => {

        // 🥇 FORMATO 1: ARRAY NORMAL
        if(Array.isArray(bloco)){
          dados.push(...bloco)
        }

        // 🥈 e 🥉 OBJETOS
        else{

          for(const chave in bloco){

            const valor = bloco[chave]

            // 🥉 FORMATO 3: DESTINO COM GRUPO DE ORIGENS
            if(valor && Array.isArray(valor.origens)){

              valor.origens.forEach(origem => {
                dados.push({
                  origem: origem,
                  destino: chave,
                  valor: Number(valor.valor),
                  regiao: "Cabo"
                })
              })

            }

            // 🥈 FORMATO 2: POR ORIGEM
            else if(Array.isArray(valor)){

              valor.forEach(item => {
                dados.push({
                  origem: chave,
                  destino: item.destino,
                  valor: Number(item.valor),
                  regiao: item.regiao || "Cabo"
                })
              })

            }

          }

        }

      })

      // 🔥 VALIDAÇÃO
      dados = this.validarESanitizar(dados)

      this.rotas = dados

      this.criarIndice()

      console.log("✅ Rotas carregadas:", this.rotas.length)

    }catch(e){

      console.error("❌ Erro ao carregar rotas:", e)

    }

  },

  // 🔥 VALIDADOR PROFISSIONAL
  validarESanitizar(lista){

    const erros = []
    const avisos = []
    const vistos = new Set()
    const resultado = []

    lista.forEach((item, index)=>{

      if(
        !item ||
        typeof item.origem !== "string" ||
        typeof item.destino !== "string" ||
        item.valor === undefined ||
        typeof item.regiao !== "string"
      ){
        erros.push(`Item inválido no índice ${index}`)
        return
      }

      const origem = item.origem.trim()
      const destino = item.destino.trim()
      const valor = Number(item.valor)

      if(isNaN(valor)){
        erros.push(`Valor inválido em ${origem} -> ${destino}`)
        return
      }

      const chave = origem.toLowerCase() + "|" + destino.toLowerCase()

      if(vistos.has(chave)){
        avisos.push(`Duplicado ignorado: ${origem} -> ${destino}`)
        return
      }

      vistos.add(chave)

      if(origem.toLowerCase() === destino.toLowerCase()){
        avisos.push(`Origem igual destino: ${origem}`)
      }

      if(valor <= 0){
        avisos.push(`Valor suspeito (<=0): ${origem} -> ${destino}`)
      }

      resultado.push({
        origem,
        destino,
        valor,
        regiao: item.regiao.trim()
      })

    })

    if(erros.length){
      console.error("❌ ERROS GRAVES NO JSON:")
      erros.forEach(e => console.error(e))
    }

    if(avisos.length){
      console.warn("⚠️ AVISOS NO JSON:")
      avisos.forEach(a => console.warn(a))
    }

    console.log(`📊 Validação concluída: ${resultado.length} válidos / ${lista.length} total`)

    return resultado

  },

  indice:{},

  criarIndice(){

    this.indice = {}

    this.rotas.forEach(r=>{

      if(!this.indice[r.origem]){
        this.indice[r.origem] = {}
      }

      this.indice[r.origem][r.destino] = r.valor

      if(!this.indice[r.destino]){
        this.indice[r.destino] = {}
      }

      this.indice[r.destino][r.origem] = r.valor

    })

  },

  listarOrigens(){

    return Object.keys(this.indice).sort()

  },

  listarDestinos(origem){

    if(!this.indice[origem]) return []

    return Object.keys(this.indice[origem]).sort()

  },

  buscarValor(origem,destino){

    if(this.indice[origem] && this.indice[origem][destino]){
      return this.indice[origem][destino]
    }

    return null

  }

}
