/* ==========================================================================
   Cantinho do Chef — comportamento e componentes do site
   Lê os dados de window.SITE (arquivo data/site.js) e monta:
   cabeçalho, rodapé, cardápio, horários, contato, fotos e botões de WhatsApp.
   ========================================================================== */
(() => {
  'use strict';

  const S = window.SITE;
  if (!S) return;

  const page = document.body.dataset.page || 'home';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (v) =>
    String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const MSG_PENDENTE_WA =
    'O número de WhatsApp ainda não foi configurado. Defina "contato.whatsapp" no arquivo data/site.js.';

  /* ------------------------------------------------------------------ */
  /* Dados derivados                                                    */
  /* ------------------------------------------------------------------ */
  const contato = S.contato || {};
  const end = S.endereco || {};
  const numero = String(contato.whatsapp || '').replace(/\D/g, '');
  const waAtivo = numero.length >= 10;
  const telefone = String(contato.telefone || '').trim();
  const enderecoTxt = [end.linha1, end.linha2].filter(Boolean).join(', ');
  const mapsLink =
    end.mapsUrl ||
    (enderecoTxt ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoTxt)}` : '');

  function formatarWhatsApp(d) {
    if (!d) return '';
    if (d.startsWith('55') && d.length >= 12) {
      const local = d.slice(2);
      const ddd = local.slice(0, 2);
      const resto = local.slice(2);
      const cortar = resto.length === 9 ? 5 : 4;
      return `(${ddd}) ${resto.slice(0, cortar)}-${resto.slice(cortar)}`;
    }
    return d;
  }

  /* ------------------------------------------------------------------ */
  /* Ícones (sprite SVG embutido)                                       */
  /* ------------------------------------------------------------------ */
  const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" focusable="false">
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></symbol>
  <symbol id="i-seta" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>
  <symbol id="i-fechar" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
  <symbol id="i-relogio" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-telefone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
  <symbol id="i-sacola" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
  <symbol id="i-entrega" viewBox="0 0 24 24"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></symbol>
  <symbol id="i-prato" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/></symbol>
  <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/></symbol>
  <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>
  <symbol id="i-youtube" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><path d="m9.75 15.02 5.75-3.27-5.75-3.27z"/></symbol>
  <symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></symbol>
</svg>`;

  const icon = (nome) =>
    `<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-${nome}"/></svg>`;

  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  function aplicarIcones(root = document) {
    $$('[data-icon-before]', root).forEach((el) => {
      if (!el.querySelector(':scope > .icon')) el.insertAdjacentHTML('afterbegin', icon(el.dataset.iconBefore));
    });
    $$('[data-icon-after]', root).forEach((el) => {
      if (!el.querySelector(':scope > .icon')) el.insertAdjacentHTML('beforeend', icon(el.dataset.iconAfter));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Avisos (toast) para o que ainda não foi configurado                */
  /* ------------------------------------------------------------------ */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 6500);
  }

  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-pendente]');
    if (alvo) {
      e.preventDefault();
      toast(alvo.dataset.pendente);
    }
  });

  /* ------------------------------------------------------------------ */
  /* WhatsApp                                                           */
  /* ------------------------------------------------------------------ */
  function ativarWhatsApp(root = document) {
    $$('[data-wa]', root).forEach((a) => {
      const msg = a.dataset.wa || contato.mensagemPadrao || '';
      if (waAtivo) {
        a.href = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.removeAttribute('data-pendente');
      } else {
        a.href = '#';
        a.dataset.pendente = MSG_PENDENTE_WA;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Pequenos blocos reutilizáveis                                      */
  /* ------------------------------------------------------------------ */
  const pendente = (txt) => `<span class="pendente">${esc(txt)}</span>`;

  function horariosHTML() {
    const lista = S.horarios || [];
    if (!lista.length) return pendente('Horários a informar');
    return `<dl class="horarios">${lista
      .map(
        (h) =>
          `<div><dt>${esc(h.dias)}</dt><dd>${h.horas ? esc(h.horas) : pendente('A informar')}</dd></div>`
      )
      .join('')}</dl>`;
  }

  const REDES = [
    ['instagram', 'Instagram'],
    ['facebook', 'Facebook'],
    ['tiktok', 'TikTok'],
    ['youtube', 'YouTube']
  ];

  function redesHTML() {
    const ativas = REDES.filter(([k]) => S.redes && S.redes[k]);
    if (!ativas.length) return pendente('Redes sociais a configurar');
    return `<ul class="redes">${ativas
      .map(
        ([k, nome]) =>
          `<li><a class="rede" href="${esc(S.redes[k])}" target="_blank" rel="noopener noreferrer" aria-label="${nome} (abre em nova aba)">${icon(k)}<span>${nome}</span></a></li>`
      )
      .join('')}</ul>`;
  }

  /* ------------------------------------------------------------------ */
  /* Fotografias (com espaço reservado enquanto não houver arquivo)     */
  /* ------------------------------------------------------------------ */
  function fotoInterior({ src, alt, legenda, prioridade }) {
    const vazio = `<div class="foto__vazio" aria-hidden="true">${icon('prato')}<span>${esc(legenda || 'Espaço para foto')}</span></div>`;
    const img = src
      ? `<img src="${esc(src)}" alt="${esc(alt || '')}" loading="${prioridade ? 'eager' : 'lazy'}" decoding="async"${prioridade ? ' fetchpriority="high"' : ''}>`
      : '';
    return vazio + img;
  }

  function vigiarImagens(root = document) {
    $$('.foto img', root).forEach((img) => {
      const falhou = () => img.remove(); // volta para o espaço reservado
      img.addEventListener('error', falhou, { once: true });
      if (img.complete && img.naturalWidth === 0) falhou();
    });
  }

  function montarFotos() {
    $$('[data-foto]').forEach((el) => {
      const cfg = (S.imagens && S.imagens[el.dataset.foto]) || {};
      el.classList.add('foto');
      el.innerHTML = fotoInterior({ ...cfg, prioridade: el.hasAttribute('data-prioridade') });
    });
    vigiarImagens();
  }

  /* ------------------------------------------------------------------ */
  /* Cabeçalho                                                          */
  /* ------------------------------------------------------------------ */
  const home = page === 'home';
  const LINKS = [
    ['Início', home ? '#inicio' : 'index.html', 'inicio'],
    ['Nosso Restaurante', home ? '#restaurante' : 'index.html#restaurante', 'restaurante'],
    ['Cardápio', home ? '#cardapio' : 'cardapio.html', 'cardapio'],
    ['Contato', home ? '#contato' : 'index.html#contato', 'contato']
  ];

  function renderHeader() {
    const el = $('#site-header');
    if (!el) return;
    el.innerHTML = `
      <div class="container header__inner">
        <a class="brand" href="${home ? '#inicio' : 'index.html'}">
          <img src="assets/img/logo-escura.png" width="426" height="435" alt="${esc(S.nome)}, página inicial">
        </a>
        <nav class="nav" id="nav" aria-label="Principal">
          <ul class="nav__list">
            ${LINKS.map(
              ([rotulo, href, id]) =>
                `<li><a class="nav__link" href="${href}" data-secao="${id}"${!home && id === 'cardapio' ? ' aria-current="page"' : ''}>${rotulo}</a></li>`
            ).join('')}
          </ul>
        </nav>
        <div class="header__acoes">
          <a class="btn btn--primary btn--sm" href="${home ? '#cardapio' : '#conteudo'}">Ver Cardápio</a>
          <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu">${icon('menu')}</button>
        </div>
      </div>`;

    const header = el;
    const toggle = $('.nav__toggle', el);
    const nav = $('#nav', el);

    const abrir = (aberto) => {
      nav.classList.toggle('is-open', aberto);
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      toggle.innerHTML = icon(aberto ? 'fechar' : 'menu');
    };

    toggle.addEventListener('click', () => abrir(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) abrir(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        abrir(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) abrir(false);
    });

    const marcarRolagem = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    marcarRolagem();
    window.addEventListener('scroll', marcarRolagem, { passive: true });
  }

  /* Destaca no menu a seção que está na tela */
  function observarSecoes() {
    if (!home || !('IntersectionObserver' in window)) return;
    const links = new Map($$('.nav__link[data-secao]').map((a) => [a.dataset.secao, a]));
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.removeAttribute('aria-current'));
          const a = links.get(en.target.id);
          if (a) a.setAttribute('aria-current', 'location');
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    ['inicio', 'restaurante', 'cardapio', 'contato'].forEach((id) => {
      const s = document.getElementById(id);
      if (s) obs.observe(s);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cardápio                                                           */
  /* ------------------------------------------------------------------ */
  const categorias = (S.categorias || []).filter((c) => c.itens && c.itens.length);

  function pratoHTML(item) {
    const preco =
      typeof item.preco === 'number' ? BRL.format(item.preco) : item.preco ? esc(item.preco) : 'Consulte';
    const exemplo = S.modoDemonstracao && item.exemplo;
    const foto = fotoInterior({ src: item.foto, alt: item.nome, legenda: 'Foto do prato' });
    return `
      <article class="prato">
        <div class="foto foto--prato">${foto}${exemplo ? '<span class="tag">Exemplo</span>' : ''}</div>
        <div class="prato__corpo">
          <div class="prato__topo">
            <h3>${esc(item.nome)}</h3>
            <span class="preco">${preco}</span>
          </div>
          <p>${esc(item.descricao)}</p>
          <a class="btn btn--soft btn--sm prato__pedir" data-wa="${esc(`Olá! Gostaria de pedir: ${item.nome}.`)}" data-icon-before="chat" aria-label="Pedir ${esc(item.nome)} pelo WhatsApp">Pedir pelo WhatsApp</a>
        </div>
      </article>`;
  }

  function renderMenuHome() {
    const raiz = $('#menu-home');
    if (!raiz || !categorias.length) return;
    const limite = S.itensNaHome || 4;

    raiz.innerHTML = `
      <div class="tabs" role="tablist" aria-label="Categorias do cardápio">
        ${categorias
          .map(
            (c, i) =>
              `<button class="tab" type="button" role="tab" id="tab-${esc(c.id)}" aria-controls="painel-${esc(c.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(c.nome)}</button>`
          )
          .join('')}
      </div>
      ${categorias
        .map(
          (c, i) => `
        <div class="painel" role="tabpanel" id="painel-${esc(c.id)}" aria-labelledby="tab-${esc(c.id)}"${i ? ' hidden' : ''}>
          <div class="pratos">${c.itens.slice(0, limite).map(pratoHTML).join('')}</div>
        </div>`
        )
        .join('')}`;

    const abas = $$('.tab', raiz);
    const paineis = $$('.painel', raiz);

    const selecionar = (i, foco) => {
      abas.forEach((a, j) => {
        a.setAttribute('aria-selected', String(i === j));
        a.tabIndex = i === j ? 0 : -1;
        paineis[j].hidden = i !== j;
      });
      if (foco) abas[i].focus();
      abas[i].scrollIntoView({ block: 'nearest', inline: 'center' });
    };

    abas.forEach((aba, i) => {
      aba.addEventListener('click', () => selecionar(i, false));
      aba.addEventListener('keydown', (e) => {
        const ultimo = abas.length - 1;
        const mapa = {
          ArrowRight: i === ultimo ? 0 : i + 1,
          ArrowLeft: i === 0 ? ultimo : i - 1,
          Home: 0,
          End: ultimo
        };
        if (e.key in mapa) {
          e.preventDefault();
          selecionar(mapa[e.key], true);
        }
      });
    });

    ativarWhatsApp(raiz);
    aplicarIcones(raiz);
    vigiarImagens(raiz);
  }

  function renderMenuCompleto() {
    const raiz = $('#menu-completo');
    const chips = $('#chips');
    if (!raiz || !categorias.length) return;

    chips.innerHTML = categorias
      .map((c) => `<a class="chip" href="#cat-${esc(c.id)}" data-cat="${esc(c.id)}">${esc(c.nome)}</a>`)
      .join('');

    raiz.innerHTML = categorias
      .map(
        (c) => `
      <section class="grupo" id="cat-${esc(c.id)}" aria-labelledby="titulo-${esc(c.id)}">
        <h2 id="titulo-${esc(c.id)}">${esc(c.nome)}</h2>
        <div class="pratos">${c.itens.map(pratoHTML).join('')}</div>
      </section>`
      )
      .join('');

    ativarWhatsApp(raiz);
    aplicarIcones(raiz);
    vigiarImagens(raiz);

    if ('IntersectionObserver' in window) {
      const links = new Map($$('.chip', chips).map((a) => [a.dataset.cat, a]));
      const obs = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((en) => {
            if (!en.isIntersecting) return;
            links.forEach((a) => a.removeAttribute('aria-current'));
            const a = links.get(en.target.id.replace('cat-', ''));
            if (a) {
              a.setAttribute('aria-current', 'true');
              a.scrollIntoView({ block: 'nearest', inline: 'center' });
            }
          });
        },
        { rootMargin: '-30% 0px -65% 0px' }
      );
      $$('.grupo', raiz).forEach((g) => obs.observe(g));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Seções da página inicial                                           */
  /* ------------------------------------------------------------------ */
  function renderSobreFatos() {
    const el = $('#sobre-fatos');
    const fatos = ((S.sobre && S.sobre.fatos) || []).filter((f) => f && f.valor);
    if (!el || !fatos.length) return;
    el.innerHTML = `<div class="fatos">${fatos
      .map((f) => `<div class="fato"><strong>${esc(f.valor)}</strong><span>${esc(f.rotulo || '')}</span></div>`)
      .join('')}</div>`;
  }

  function renderPedidos() {
    const hor = $('#horarios-pedidos');
    if (hor) hor.innerHTML = horariosHTML();

    const lista = $('#servicos');
    if (lista) {
      const sv = S.servicos || {};
      const itens = [
        ['retirada', 'sacola', 'Retirada no local'],
        ['entrega', 'entrega', 'Entrega']
      ]
        .filter(([k]) => sv[k] && sv[k].ativo)
        .map(
          ([k, ic, titulo]) =>
            `<li>${icon(ic)}<div><strong>${titulo}</strong><span>${esc(sv[k].texto || '')}</span></div></li>`
        );
      lista.innerHTML = itens.join('');
      lista.hidden = !itens.length;
    }

    const online = $('#pedido-online');
    const po = S.pedidoOnline || {};
    if (online && po.ativo && po.url) {
      online.innerHTML = `<a class="btn btn--light" href="${esc(po.url)}" target="_blank" rel="noopener noreferrer">${esc(po.rotulo || 'Pedir online')}${icon('seta')}</a>`;
    }
  }

  function infoItem(ic, titulo, conteudo) {
    return `<li class="info"><span class="info__icone">${icon(ic)}</span><div><h3>${titulo}</h3>${conteudo}</div></li>`;
  }

  function renderContato() {
    const info = $('#contato-info');
    if (info) {
      const endHTML = enderecoTxt
        ? `<address>${[end.linha1, end.linha2].filter(Boolean).map(esc).join('<br>')}</address>`
        : pendente('Endereço a informar');
      const telHTML = telefone
        ? `<a class="link" href="tel:${esc(telefone.replace(/[^\d+]/g, ''))}">${esc(telefone)}</a>`
        : pendente('Telefone a informar');
      const waHTML = waAtivo
        ? `<a class="link" data-wa>${esc(formatarWhatsApp(numero))}</a>`
        : pendente('WhatsApp a informar');

      info.innerHTML = `
        <ul class="infos">
          ${infoItem('pin', 'Endereço', endHTML)}
          ${infoItem('relogio', 'Horários de funcionamento', horariosHTML())}
          ${infoItem('telefone', 'Telefone', telHTML)}
          ${infoItem('chat', 'WhatsApp', waHTML)}
        </ul>
        <div class="contato__redes">
          <h3>Redes sociais</h3>
          ${redesHTML()}
        </div>`;
      ativarWhatsApp(info);
    }

    const mapa = $('#contato-mapa');
    if (mapa) {
      const embed = end.mapsEmbedUrl
        ? `<iframe src="${esc(end.mapsEmbedUrl)}" title="Mapa com a localização de ${esc(S.nome)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
        : `<div class="mapa__vazio">${icon('pin')}<p>${enderecoTxt ? 'Veja a localização e a rota no Google Maps.' : 'O mapa aparece aqui depois que o endereço for informado.'}</p></div>`;
      const botao = mapsLink
        ? `<a class="btn btn--outline" href="${esc(mapsLink)}" target="_blank" rel="noopener noreferrer" data-icon-before="pin">Abrir no Google Maps</a>`
        : `<a class="btn btn--outline" href="#" data-pendente="O endereço ainda não foi configurado. Defina &quot;endereco&quot; no arquivo data/site.js." data-icon-before="pin">Abrir no Google Maps</a>`;
      mapa.innerHTML = `<div class="mapa">${embed}</div><div class="mapa__acoes">${botao}</div>`;
      aplicarIcones(mapa);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Rodapé                                                             */
  /* ------------------------------------------------------------------ */
  function renderFooter() {
    const el = $('#site-footer');
    if (!el) return;
    const ano = new Date().getFullYear();
    el.innerHTML = `
      <div class="container footer__grid">
        <div class="footer__marca">
          <img class="footer__logo" src="assets/img/logo-clara.png" width="426" height="435" alt="${esc(S.nome)}">
          <p>${esc(S.descricaoCurta || '')}</p>
        </div>
        <nav aria-label="Rodapé">
          <h2 class="footer__titulo">Navegue</h2>
          <ul class="footer__lista">
            ${LINKS.map(([rotulo, href]) => `<li><a href="${href}">${rotulo}</a></li>`).join('')}
          </ul>
        </nav>
        <div>
          <h2 class="footer__titulo">Contato</h2>
          <ul class="footer__lista footer__lista--contato">
            <li>${icon('pin')}<span>${enderecoTxt ? esc(enderecoTxt) : pendente('Endereço a informar')}</span></li>
            <li>${icon('telefone')}<span>${telefone ? `<a href="tel:${esc(telefone.replace(/[^\d+]/g, ''))}">${esc(telefone)}</a>` : pendente('Telefone a informar')}</span></li>
            <li>${icon('chat')}<span>${waAtivo ? `<a data-wa>${esc(formatarWhatsApp(numero))}</a>` : pendente('WhatsApp a informar')}</span></li>
          </ul>
        </div>
        <div>
          <h2 class="footer__titulo">Redes sociais</h2>
          ${redesHTML()}
        </div>
      </div>
      <div class="footer__base">
        <div class="container">
          <p>&copy; ${ano} ${esc(S.nome)}. Todos os direitos reservados.</p>
        </div>
      </div>`;
    ativarWhatsApp(el);
  }

  /* ------------------------------------------------------------------ */
  /* SEO: dados estruturados só com o que está preenchido               */
  /* ------------------------------------------------------------------ */
  function injetarJsonLd() {
    const dados = { '@context': 'https://schema.org', '@type': 'Restaurant', name: S.nome, servesCuisine: 'Brasileira' };
    if (telefone) dados.telephone = telefone;
    if (enderecoTxt) dados.address = enderecoTxt;
    const redes = REDES.map(([k]) => S.redes && S.redes[k]).filter(Boolean);
    if (redes.length) dados.sameAs = redes;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(dados);
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  /* Inicialização                                                      */
  /* ------------------------------------------------------------------ */
  renderHeader();
  renderFooter();
  montarFotos();
  renderSobreFatos();
  renderMenuHome();
  renderMenuCompleto();
  renderPedidos();
  renderContato();
  ativarWhatsApp();
  aplicarIcones();
  observarSecoes();
  injetarJsonLd();

  if (S.modoDemonstracao) $$('[data-demo]').forEach((el) => (el.hidden = false));
})();
