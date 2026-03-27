# Escola de Saúde Pública do Piauí (ESPPI)

Site institucional estático atualizado com encoding corrigido e funcionalidades testadas.

## 🚀 Implantação e Deploy

### 1. Hospedagem Gratuita (Recomendada)
**GitHub Pages:**
```
1. Push para GitHub repo
2. Settings > Pages > Deploy from branch 'main'
3. Site live em https://username.github.io/Escola-de-Saude
```

**Netlify:**
```
1. Arraste pasta para netlify.com/drop
2. Site instantâneo com HTTPS
```

**Vercel:**
```
1. vercel.com > Import Git repo
2. Deploy automático
```

### 2. Servidor Local para Testes
```bash
# VS Code Live Server (extensão)
# Ou
npx live-server --port=3000
# Acesse http://localhost:3000
```

### 3. Servidor Python/Node
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

## ✅ Teste Funcionalidades

**Execute `npx live-server` e valide:**
- [x] **Carousel**: Auto-slide + touch + dots/buttons
- [x] **Menu Mobile**: Hamburger toggle + backdrop close
- [x] **Modals**: Team, Login (localStorage persist), Image gallery click
- [x] **Forms**: Contact (Formspree), Login demo
- [x] **Filtros**: Cursos por status
- [x] **Responsivo**: Mobile/tablet/desktop
- [x] **Links/Imagens**: Todos válidos (paths verificados)

## 📁 Estrutura de Arquivos

```
Escola de Saúde/
├── index.html (página inicial)
├── cursos.html (catálogo + filtro)
├── noticias.html + noticias/*.html
├── galeria.html + 06032026.html
├── script.js (todas interações)
├── css/styles.css
├── imagem/ (completa)
└── README.md
```

## 🛠️ Manutenção

**Adicionar notícia:**
```
1. noticias/nova-data.html (cópia de 260320226_1100.html)
2. Atualize noticias.html grid
3. Adicione imagem em imagem/noticia/
```

**Novo curso:**
```
1. Adicione card em cursos.html
2. Crie cursos/novo.html se detalhe
```

**Deploy contínuo:**
GitHub auto-deploys on push.

## 📊 Status Final
- ✅ Encoding corrigido (UTF-8 BOM removido, chars fixos)
- ✅ Links/imagens validados
- ✅ Funcionalidades testáveis via live-server
- ✅ README atualizado

**Pronto para produção!** `npx live-server` para demo local.

## Autor

Desenvolvimento atribuído no projeto a David Perfeito Leôncio.
