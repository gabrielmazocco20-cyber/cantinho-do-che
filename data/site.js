/* ==========================================================================
   CANTINHO DO CHEF — DADOS DO SITE
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para colocar os dados reais
   do restaurante. Tudo o que está vazio ("") aparece no site como "A informar"
   (ou simplesmente não aparece) até ser preenchido.

   Quando tudo estiver preenchido, troque modoDemonstracao para false.
   ========================================================================== */

window.SITE = {

  /* true  = mostra avisos de "exemplo" (pratos, preços e serviços de demonstração)
     false = site no ar, sem nenhum aviso */
  modoDemonstracao: true,

  nome: "Cantinho do Chef",

  descricaoCurta:
    "Comida caseira, ambiente acolhedor e refeições preparadas com atenção aos detalhes.",

  /* ---------- CONTATO ---------- */
  contato: {
    /* WhatsApp oficial, só números, com país e DDD. Ex.: "5566999999999"
       Enquanto estiver vazio, os botões de WhatsApp avisam que falta configurar. */
    whatsapp: "5566996480573",
    telefone: "5566996480573",               // Ex.: "(66) 3000-0000"
    mensagemPadrao: "Olá! Gostaria de fazer um pedido."
  },

  /* ---------- ENDEREÇO ---------- */
  endereco: {
    linha1: "",                 // Ex.: "Rua das Flores, 123 - Centro"
    linha2: "",                 // Ex.: "Cidade - UF, CEP 00000-000"
    /* Link do Google Maps. Se ficar vazio, o site monta o link a partir do endereço acima. */
    mapsUrl: "",
    /* Opcional: endereço do mapa incorporado. No Google Maps: Compartilhar > Incorporar um mapa >
       copie apenas o valor de src="..." do iframe. */
    mapsEmbedUrl: ""
  },

  /* ---------- HORÁRIOS ---------- */
  horarios: [
    { dias: "Segunda a sexta", horas: "" },   // Ex.: "11h às 15h"
    { dias: "Sábado",         horas: "" },
    { dias: "Domingo",        horas: "" }
  ],

  /* ---------- RETIRADA E ENTREGA ----------
     Deixe ativo: true apenas para o que o restaurante realmente oferece. */
  servicos: {
    retirada: {
      ativo: true,
      texto: "Faça o pedido pelo WhatsApp e retire no restaurante."
    },
    entrega: {
      ativo: true,
      texto: "Consulte área atendida, prazo e taxa pelo WhatsApp."
    }
  },

  /* ---------- PEDIDO ONLINE (opcional) ----------
     O site NÃO processa pedidos nem pagamentos. Se o restaurante tiver um link de
     pedido online (iFood, cardápio digital, etc.), coloque aqui e mude ativo para true. */
  pedidoOnline: {
    ativo: false,
    url: "",
    rotulo: "Pedir online"
  },

  /* ---------- REDES SOCIAIS ----------
     Cole o link completo do perfil. Redes vazias não aparecem. */
  redes: {
    instagram: "",    // Ex.: "https://instagram.com/cantinhodochef"
    facebook: "",
    tiktok: "",
    youtube: ""
  },

  /* ---------- FOTOGRAFIAS ----------
     1. Coloque as fotos em assets/img/ (JPG ou WebP, até ~200 KB cada).
     2. Informe o caminho em "src" e descreva a imagem em "alt" (acessibilidade).
     Enquanto "src" estiver vazio, aparece um espaço reservado para a foto. */
  imagens: {
    hero: {
      src: "",   // Ex.: "assets/img/hero.jpg"  (sugestão: 1200 x 960 px)
      alt: "Prato caseiro com arroz, feijão, carne e salada",
      legenda: "Foto: refeição caseira brasileira"
    },
    sobre: {
      src: "",   // Ex.: "assets/img/sobre.jpg"  (sugestão: 900 x 1100 px)
      alt: "Cozinha e ambiente do restaurante",
      legenda: "Foto: cozinha ou ambiente do restaurante"
    },
    destaque: {
      src: "",   // Ex.: "assets/img/destaque.jpg"  (sugestão: 1600 x 700 px)
      alt: "Prato caseiro servido na mesa",
      legenda: "Foto: prato caseiro em destaque"
    }
  },

  /* ---------- SOBRE O RESTAURANTE (opcional) ----------
     Números ou fatos reais, quando o restaurante quiser divulgar.
     Ex.: { valor: "Desde 2015", rotulo: "na cozinha" } — vazio = não aparece. */
  sobre: {
    fatos: []
  },

  /* ---------- CARDÁPIO ----------
     itensNaHome: quantos pratos de cada categoria aparecem na página inicial.
     A página cardapio.html mostra todos.

     Cada prato:
       nome, descricao, preco (número, ex.: 24.9 — ou "" para "Consulte"),
       foto (caminho em assets/img/pratos/, ou "" para espaço reservado),
       exemplo (true = é dado de demonstração; tire essa linha ao colocar o prato real).
  */
  itensNaHome: 4,

  categorias: [
    {
      id: "pratos-do-dia",
      nome: "Pratos do dia",
      itens: [
        { nome: "Frango assado com batatas", descricao: "Coxa e sobrecoxa douradas, batatas assadas e arroz branco.", preco: 24.9, foto: "", exemplo: true },
        { nome: "Bife acebolado", descricao: "Bife grelhado com cebola refogada, arroz, feijão e salada.", preco: 26.9, foto: "", exemplo: true },
        { nome: "Strogonoff de frango", descricao: "Cremoso, servido com arroz branco e batata palha.", preco: 25.9, foto: "", exemplo: true },
        { nome: "Feijoada da casa", descricao: "Feijão preto com carnes, couve, farofa, laranja e arroz.", preco: 32.9, foto: "", exemplo: true },
        { nome: "Costela cozida", descricao: "Costela macia com mandioca, arroz e vinagrete.", preco: 34.9, foto: "", exemplo: true }
      ]
    },
    {
      id: "refeicoes-completas",
      nome: "Refeições completas",
      itens: [
        { nome: "Prato feito tradicional", descricao: "Arroz, feijão, mistura do dia, salada e farofa.", preco: 22.9, foto: "", exemplo: true },
        { nome: "Executivo de carne", descricao: "Carne grelhada, arroz, feijão, legumes e salada.", preco: 28.9, foto: "", exemplo: true },
        { nome: "Executivo de frango", descricao: "Filé de frango grelhado, arroz, feijão, legumes e salada.", preco: 26.9, foto: "", exemplo: true },
        { nome: "Peixe grelhado", descricao: "Filé de peixe, arroz, purê e salada fresca.", preco: 31.9, foto: "", exemplo: true },
        { nome: "Marmita da casa", descricao: "Porção individual para levar, com a mistura do dia.", preco: 21.9, foto: "", exemplo: true }
      ]
    },
    {
      id: "porcoes-e-acompanhamentos",
      nome: "Porções e acompanhamentos",
      itens: [
        { nome: "Arroz branco", descricao: "Porção soltinha, feita na hora.", preco: 8.0, foto: "", exemplo: true },
        { nome: "Feijão caseiro", descricao: "Temperado com alho e cebola.", preco: 8.0, foto: "", exemplo: true },
        { nome: "Farofa da casa", descricao: "Farofa crocante com bacon e cebola.", preco: 9.0, foto: "", exemplo: true },
        { nome: "Batata frita", descricao: "Porção para compartilhar.", preco: 18.0, foto: "", exemplo: true },
        { nome: "Mandioca frita", descricao: "Dourada por fora, macia por dentro.", preco: 18.0, foto: "", exemplo: true },
        { nome: "Salada da estação", descricao: "Folhas, tomate e cenoura com tempero da casa.", preco: 10.0, foto: "", exemplo: true }
      ]
    },
    {
      id: "bebidas",
      nome: "Bebidas",
      itens: [
        { nome: "Suco natural de laranja", descricao: "Copo de 400 ml, sem açúcar adicionado.", preco: 9.0, foto: "", exemplo: true },
        { nome: "Suco de maracujá", descricao: "Copo de 400 ml.", preco: 9.0, foto: "", exemplo: true },
        { nome: "Limonada", descricao: "Jarra individual, bem gelada.", preco: 8.0, foto: "", exemplo: true },
        { nome: "Refrigerante lata", descricao: "Consulte os sabores disponíveis.", preco: 6.0, foto: "", exemplo: true },
        { nome: "Água mineral", descricao: "Com ou sem gás.", preco: 4.0, foto: "", exemplo: true },
        { nome: "Café coado", descricao: "Café fresco, para fechar a refeição.", preco: 4.5, foto: "", exemplo: true }
      ]
    },
    {
      id: "sobremesas",
      nome: "Sobremesas",
      itens: [
        { nome: "Pudim de leite", descricao: "Fatia generosa com calda de caramelo.", preco: 12.0, foto: "", exemplo: true },
        { nome: "Mousse de maracujá", descricao: "Cremosa e levemente azedinha.", preco: 10.0, foto: "", exemplo: true },
        { nome: "Doce de leite caseiro", descricao: "Servido com queijo fresco.", preco: 11.0, foto: "", exemplo: true },
        { nome: "Banana com canela", descricao: "Banana assada com canela e açúcar.", preco: 9.0, foto: "", exemplo: true }
      ]
    }
  ]
};
