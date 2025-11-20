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


// ========== FUNDO ==========
function toggleBackground() {
  const bg = document.getElementById('background-scene');
  if (bg) {
    bg.style.display = (bg.style.display === 'none') ? 'block' : 'none';
  }
}

// ========== PARTÍCULAS ==========
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

document.addEventListener('DOMContentLoaded', () => {
  console.log("🧠 Fundo animado carregado.");
  generateParticles(15);
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

    form.querySelector('button[type="submit"]').innerText = "Enviando...";
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


// ========== SISTEMA DE RANKING ==========
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


document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('news-cards'); 

  if (!container) {
    console.error("ERRO: Elemento #news-cards não existe no HTML.");
    return;
  }

  // SUA API APITUBE
  const API_KEY = "api_live_srjLpIrGeerqzyHZh7AMdWDXBp2LhO3GHTBZNav0lJc";

  // 🚀 ENDPOINT CORRETO
  const sources = [
    {
      url: `https://apitube.io/api/v1/articles?apikey=${API_KEY}&category=technology&lang=pt`,
      parser: d => Array.isArray(d.data) ? d.data : []
    }
  ];

  async function loadNews() {
    container.innerHTML = '<p style="color:#fff;">Carregando notícias tecnológicas...</p>';

    let allNews = [];

    for (const src of sources) {
      try {
        const res = await fetch(src.url);
        const data = await res.json();

        console.log("API response:", data);

        if (!data.success) {
          console.error("Erro da API:", data.message);
          continue;
        }

        const parsed = src.parser(data);

        parsed.forEach(item => {
          allNews.push({
            title: item.title,
            url: item.url,
            img: item.thumbnail || item.image || '',
            desc: item.excerpt || 'Clique para ler mais.'
          });
        });

      } catch (err) {
        console.error("Erro ao carregar:", src.url, err);
      }
    }

    renderNews(allNews);
  }

  function renderNews(newsList) {
    container.innerHTML = '';

    if (newsList.length === 0) {
      container.innerHTML = '<p style="color:#fff;">Nenhuma notícia encontrada no momento.</p>';
      return;
    }

    newsList.slice(0, 6).forEach(n => {
      const card = document.createElement('div');
      card.className = 'news-card';

      card.innerHTML = `
        <img src="${n.img || 'https://via.placeholder.com/450x250?text=Tech'}" />
        <h3>${n.title}</h3>
        <p>${n.desc}</p>
        <a href="${n.url}" target="_blank">Ler mais</a>
      `;

      container.appendChild(card);
    });
  }

  loadNews();
  setInterval(loadNews, 1000 * 60 * 5);
});
