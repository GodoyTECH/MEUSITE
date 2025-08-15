// script.js
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menuLateral');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function () {
      menu.classList.toggle('ativo');
    });
  }
});


// Função para ativar/desativar a cena de fundo
function toggleBackground() {
  const bg = document.getElementById('background-scene');
  if (bg) {
    bg.style.display = (bg.style.display === 'none') ? 'block' : 'none';
  }
}

// Exemplo: Adicionar mais partículas dinamicamente
function generateParticles(qtd = 10) {
  const container = document.querySelector('.particles');
  if (!container) return;

  for (let i = 0; i < qtd; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(particle);
  }
}

// Função para iniciar tudo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  console.log("🧠 Fundo animado carregado.");
  generateParticles(15); // Gera partículas extras
});

// ========== SISTEMA DE CONTATO ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const nome = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const mensagem = form.querySelector('textarea[name="message"]');

    if (!nome.value.trim() || !email.value.trim() || !mensagem.value.trim()) {
      alert("Por favor, preencha todos os campos.");
      e.preventDefault();
      return;
    }

    // Mensagem opcional de carregamento
    form.querySelector('button[type="submit"]').innerText = "Enviando...";

    // Estética de envio (opcional)
    form.style.opacity = "0.6";
  });
});


// ========== SISTEMA DE NOTÍCIAS ==========
class NewsSystem {
  constructor(containerId, sources) {
    this.container = document.getElementById(containerId);
    this.sources = sources;
    this.cache = [];
  }

  async init() {
    try {
      const articles = await this.fetchNews();
      this.display(articles);
    } catch (e) {
      console.error("Erro ao carregar notícias:", e);
      const fallback = this.sources.find(s => !s.url)?.parser() || [];
      this.display(fallback);
    }
  }

  async fetchNews() {
    for (const s of this.sources) {
      if (!s.url) continue;
      try {
        const r = await fetch(s.url);
        if (!r.ok) continue;
        const d = await r.json();
        const arr = s.parser(d);
        if (arr.length) return arr;
      } catch (err) {
        console.warn(`Erro na fonte ${s.url}:`, err);
      }
    }
    throw new Error('Nenhuma fonte de notícias disponível');
  }

  display(articles) {
    if (!this.container) return;
    this.container.innerHTML = articles.map(a =>
      `<div class="news-card">
         <img src="${a.image || 'assets/images/default-news.jpg'}" alt="${a.title}" class="news-thumb">
         <h3>${a.title}</h3>
         <p>${a.description || ''}</p>
         <a href="${a.url}" target="_blank" class="news-link">Ler mais →</a>
       </div>`
    ).join('');
  }
}


// ========== SISTEMA DE RANKING (GOOGLE SHEETS) ==========
function carregarRanking() {
  const sheetURL = `https://opensheet.elk.sh/1isrjaaOEUJqwLTIbzV3KzZHlpZYC6r4f0mtS28PL6YI/form1`;
  const lista = document.getElementById("ranking-list");
  if (!lista) return;

  fetch(sheetURL)
    .then(r => r.json())
    .then(data => {
      lista.innerHTML = '';
      [...data].reverse().forEach(entry => {
        const nome = entry.Nome?.trim() || 'Anônimo';
        const valor = parseFloat(entry['Valor do apoio (R$)']) || 0;
        const li = document.createElement('li');
        li.innerHTML = `<strong>${nome}</strong> – R$${valor.toLocaleString('pt-BR')}<br><em>${entry.Comentários || ''}</em>`;
        lista.appendChild(li);
      });
    })
    .catch(() => {
      lista.innerHTML = "<li>Erro ao carregar dados dos apoiadores.</li>";
    });
}


// ========== MENU HAMBÚRGUER ==========
document.addEventListener('DOMContentLoaded', () => {
  const botao = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menuLateral');

  if (!botao || !menu) return;

  // Abre/fecha o menu ao clicar no botão
  botao.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('ativo');
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    const clicouFora = !menu.contains(e.target) && !botao.contains(e.target);
    if (clicouFora) {
      menu.classList.remove('ativo');
    }
  });

  // Fecha o menu ao clicar em qualquer link dentro dele
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('ativo');
    });
  });
});


// ========== INICIALIZAÇÃO GLOBAL ==========
document.addEventListener('DOMContentLoaded', () => {
  const sources = [
    {
      url: 'https://gnews.io/api/v4/top-headlines?category=technology&lang=pt&max=6&apikey=f7295ef44d4b435a16e3210b96b72176',
      parser: d => d.articles || []
    },
    {
      url: null,
      parser: () => [
        {
          title: "Godoy Solutions Expande Serviços",
          description: "Nova linha de consultoria em IA para pequenas empresas já disponível.",
          url: "#",
          image: "assets/images/default-news.jpg"
        },
        {
          title: "Workshop Gratuito: JavaScript Moderno",
          description: "Participe do evento online gratuito no dia 20/10.",
          url: "#",
          image: "assets/images/default-news.jpg"
        }
      ]
    }
  ];

  const noticiasContainer = document.getElementById('news-cards');
  if (noticiasContainer) {
    new NewsSystem('news-cards', sources).init();
  }

  carregarRanking();
  setInterval(carregarRanking, 20000);
});


// ========== FUNÇÃO GLOBAL OPCIONAL ==========
function toggleMenu() {
  const menu = document.getElementById('menuLateral');
  menu.classList.toggle('ativo');
}

