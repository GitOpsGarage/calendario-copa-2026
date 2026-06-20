# Copa do Mundo 2026 - Ao Vivo

Aplicativo web para acompanhar os jogos da Copa do Mundo FIFA 2026 em tempo real.

## Funcionalidades

- **Ao Vivo**: Jogos de hoje com placar em tempo real
- **Resultados**: Jogos finalizados de hoje e ontem
- **Calendário**: Seletor de data para ver jogos de qualquer dia
- **Por Seleção**: Filtro para ver todos os jogos de uma seleção específica

## Como Usar

1. Abra o arquivo `index.html` no navegador
2. Navegue pelas tabs para ver diferentes seções
3. Use o calendário para selecionar datas específicas
4. Selecione uma seleção no dropdown para ver seu histórico

## Estrutura

```
app-copa/
├── index.html      # Página principal
├── css/
│   └── style.css   # Estilos
└── js/
    └── app.js      # Lógica e API
```

## API Utilizada

- **openfootball/worldcup.json**: Dados públicos da Copa do Mundo 2026
- URL: `https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json`
- Sem necessidade de API key

## Características

- Interface responsiva (mobile-first)
- Tema escuro
- Atualização automática a cada 60 segundos
- Horários convertidos para o fuso horário local

## Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com a internet

## Dados da Copa 2026

- **Localização**: EUA, Canadá e México
- **Período**: 11 de junho a 19 de julho de 2026
- **Formato**: 48 seleções, 12 grupos de 4
