// Copa 2026 - App
var API_BASE = 'https://copa-2026.gitopsgarage.workers.dev';
var FALLBACK_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';
var CACHE_KEY = 'copa2026_cache';
var CACHE_TTL = 5 * 60 * 1000; // 5 minutos
var RATE_LIMIT_KEY = 'copa2026_ratelimit';
var TZ_OFFSET = -3; // UTC-3 Brasil

var TEAM_DATA = {
  Mexico: { flag: '🇲🇽', pt: 'México' },
  'South Africa': { flag: '🇿🇦', pt: 'África do Sul' },
  'South Korea': { flag: '🇰🇷', pt: 'Coreia do Sul' },
  'Czech Republic': { flag: '🇨🇿', pt: 'Tchéquia' },
  Argentina: { flag: '🇦🇷', pt: 'Argentina' },
  Canada: { flag: '🇨🇦', pt: 'Canadá' },
  Morocco: { flag: '🇲🇦', pt: 'Marrocos' },
  Croatia: { flag: '🇭🇷', pt: 'Croácia' },
  Brazil: { flag: '🇧🇷', pt: 'Brasil' },
  Serbia: { flag: '🇷🇸', pt: 'Sérvia' },
  Germany: { flag: '🇩🇪', pt: 'Alemanha' },
  Japan: { flag: '🇯🇵', pt: 'Japão' },
  Spain: { flag: '🇪🇸', pt: 'Espanha' },
  Colombia: { flag: '🇨🇴', pt: 'Colômbia' },
  France: { flag: '🇫🇷', pt: 'França' },
  Australia: { flag: '🇦🇺', pt: 'Austrália' },
  England: { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pt: 'Inglaterra' },
  Italy: { flag: '🇮🇹', pt: 'Itália' },
  Netherlands: { flag: '🇳🇱', pt: 'Holanda' },
  USA: { flag: '🇺🇸', pt: 'EUA' },
  Portugal: { flag: '🇵🇹', pt: 'Portugal' },
  Belgium: { flag: '🇧🇪', pt: 'Bélgica' },
  Uruguay: { flag: '🇺🇾', pt: 'Uruguai' },
  Switzerland: { flag: '🇨🇭', pt: 'Suíça' },
  Ecuador: { flag: '🇪🇨', pt: 'Equador' },
  Senegal: { flag: '🇸🇳', pt: 'Senegal' },
  Poland: { flag: '🇵🇱', pt: 'Polônia' },
  'Saudi Arabia': { flag: '🇸🇦', pt: 'Arábia Saudita' },
  Tunisia: { flag: '🇹🇳', pt: 'Tunísia' },
  Denmark: { flag: '🇩🇰', pt: 'Dinamarca' },
  Wales: { flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', pt: 'País de Gales' },
  Iran: { flag: '🇮🇷', pt: 'Irã' },
  Qatar: { flag: '🇶🇦', pt: 'Catar' },
  Cameroon: { flag: '🇨🇲', pt: 'Camarões' },
  Ghana: { flag: '🇬🇭', pt: 'Gana' },
  'Costa Rica': { flag: '🇨🇷', pt: 'Costa Rica' },
  Peru: { flag: '🇵🇪', pt: 'Peru' },
  Iceland: { flag: '🇮🇸', pt: 'Islândia' },
  Panama: { flag: '🇵🇦', pt: 'Panamá' },
  Egypt: { flag: '🇪🇬', pt: 'Egito' },
  Nigeria: { flag: '🇳🇬', pt: 'Nigéria' },
  'Korea Republic': { flag: '🇰🇷', pt: 'Coreia do Sul' },
  'Korea DPR': { flag: '🇰🇵', pt: 'Coreia do Norte' },
  Algeria: { flag: '🇩🇿', pt: 'Argélia' },
  Honduras: { flag: '🇭🇳', pt: 'Honduras' },
  Jamaica: { flag: '🇯🇲', pt: 'Jamaica' },
  Paraguay: { flag: '🇵🇾', pt: 'Paraguai' },
  Chile: { flag: '🇨🇱', pt: 'Chile' },
  Bolivia: { flag: '🇧🇴', pt: 'Bolívia' },
  Venezuela: { flag: '🇻🇪', pt: 'Venezuela' },
  'China PR': { flag: '🇨🇳', pt: 'China' },
  Iraq: { flag: '🇮🇶', pt: 'Iraque' },
  UAE: { flag: '🇦🇪', pt: 'EAU' },
  Oman: { flag: '🇴🇲', pt: 'Omã' },
  Thailand: { flag: '🇹🇭', pt: 'Tailândia' },
  Vietnam: { flag: '🇻🇳', pt: 'Vietnã' },
  Indonesia: { flag: '🇮🇩', pt: 'Indonésia' },
  Malaysia: { flag: '🇲🇾', pt: 'Malásia' },
  Philippines: { flag: '🇵🇭', pt: 'Filipinas' },
  'New Zealand': { flag: '🇳🇿', pt: 'Nova Zelândia' },
  Fiji: { flag: '🇫🇯', pt: 'Fiji' },
  'Solomon Islands': { flag: '🇸🇧', pt: 'Ilhas Salomão' },
  'Papua New Guinea': { flag: '🇵🇬', pt: 'Papua-Nova Guiné' },
  Guatemala: { flag: '🇬🇹', pt: 'Guatemala' },
  'El Salvador': { flag: '🇸🇻', pt: 'El Salvador' },
  'Trinidad and Tobago': { flag: '🇹🇹', pt: 'Trinidad e Tobago' },
  Curacao: { flag: '🇨🇼', pt: 'Curaçao' },
  Curaçao: { flag: '🇨🇼', pt: 'Curaçao' },
  Haiti: { flag: '🇭🇹', pt: 'Haiti' },
  Cuba: { flag: '🇨🇺', pt: 'Cuba' },
  Scotland: { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', pt: 'Escócia' },
  Turkey: { flag: '🇹🇷', pt: 'Turquia' },
  Norway: { flag: '🇳🇴', pt: 'Noruega' },
  Sweden: { flag: '🇸🇪', pt: 'Suécia' },
  'Ivory Coast': { flag: '🇨🇮', pt: 'Costa do Marfim' },
  Austria: { flag: '🇦🇹', pt: 'Áustria' },
  Jordan: { flag: '🇯🇴', pt: 'Jordânia' },
  'Bosnia & Herzegovina': { flag: '🇧🇦', pt: 'Bósnia e Herzegovina' },
  Uzbekistan: { flag: '🇺🇿', pt: 'Uzbequistão' },
  'DR Congo': { flag: '🇨🇩', pt: 'RD Congo' },
  'Cape Verde': { flag: '🇨🇻', pt: 'Cabo Verde' },
  'Al Ahly SC (EGY)': { flag: '🇪🇬', pt: 'Al Ahly SC (EGY)' },
  'Inter Miami CF (USA)': { flag: '🇺🇸', pt: 'Inter Miami CF (USA)' },
  'Palmeiras (BRA)': { flag: '🇧🇷', pt: 'Palmeiras (BRA)' },
  'FC Porto (POR)': { flag: '🇵🇹', pt: 'FC Porto (POR)' },
  'Chelsea FC (ENG)': { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pt: 'Chelsea FC (ENG)' },
  'Paris Saint-Germain (FRA)': { flag: '🇫🇷', pt: 'Paris Saint-Germain (FRA)' },
};

// Mapa de nomes ingles API football-data → nossos nomes
var NAME_MAP = {
  México: 'Mexico',
  'South Africa': 'South Africa',
  'South Korea': 'South Korea',
  Czechia: 'Czech Republic',
  'Czech Republic': 'Czech Republic',
  Argentina: 'Argentina',
  Canada: 'Canada',
  Morocco: 'Morocco',
  Croatia: 'Croatia',
  Brazil: 'Brazil',
  Serbia: 'Serbia',
  Germany: 'Germany',
  Japan: 'Japan',
  Spain: 'Spain',
  Colombia: 'Colombia',
  France: 'France',
  Australia: 'Australia',
  England: 'England',
  Italy: 'Italy',
  Netherlands: 'Netherlands',
  USA: 'USA',
  'United States': 'USA',
  'United States of America': 'USA',
  Portugal: 'Portugal',
  Belgium: 'Belgium',
  Uruguay: 'Uruguay',
  Switzerland: 'Switzerland',
  Ecuador: 'Ecuador',
  Senegal: 'Senegal',
  Poland: 'Poland',
  'Saudi Arabia': 'Saudi Arabia',
  Tunisia: 'Tunisia',
  Denmark: 'Denmark',
  Wales: 'Wales',
  Iran: 'Iran',
  Qatar: 'Qatar',
  Cameroon: 'Cameroon',
  Ghana: 'Ghana',
  'Costa Rica': 'Costa Rica',
  Peru: 'Peru',
  Iceland: 'Iceland',
  Panama: 'Panama',
  Egypt: 'Egypt',
  Nigeria: 'Nigeria',
  Algeria: 'Algeria',
  Honduras: 'Honduras',
  Jamaica: 'Jamaica',
  Paraguay: 'Paraguay',
  Chile: 'Chile',
  Bolivia: 'Bolivia',
  Venezuela: 'Venezuela',
  Iraq: 'Iraq',
  Thailand: 'Thailand',
  Vietnam: 'Vietnam',
  Indonesia: 'Indonesia',
  Malaysia: 'Malaysia',
  'New Zealand': 'New Zealand',
  Guatemala: 'Guatemala',
  'El Salvador': 'El Salvador',
  Haiti: 'Haiti',
  Cuba: 'Cuba',
  Scotland: 'Scotland',
  Türkiye: 'Turkey',
  Turkey: 'Turkey',
  Norway: 'Norway',
  Sweden: 'Sweden',
  "Côte d'Ivoire": 'Ivory Coast',
  'Ivory Coast': 'Ivory Coast',
  Austria: 'Austria',
  Jordan: 'Jordan',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Bosnia & Herzegovina': 'Bosnia & Herzegovina',
  Uzbekistan: 'Uzbekistan',
  'DR Congo': 'DR Congo',
  'Cape Verde': 'Cape Verde',
  'Cabo Verde': 'Cape Verde',
  'Trinidad and Tobago': 'Trinidad and Tobago',
};

// Status da API football-data → nosso tipo
var STATUS_MAP = {
  FINISHED: 'finished',
  IN_PLAY: 'live',
  PAUSED: 'live',
  TIMED: 'upcoming',
  SCHEDULED: 'upcoming',
  POSTPONED: 'upcoming',
  CANCELLED: 'cancelled',
  AWARDED: 'finished',
};

var allMatches = [];
var currentDate = new Date();
var calMonth = currentDate.getMonth();
var calYear = currentDate.getFullYear();
var teamPopulated = false;

function pt(name) {
  let info = TEAM_DATA[name];
  return info ? info.pt : name;
}
function flag(name) {
  let info = TEAM_DATA[name];
  return info ? info.flag : '🏳️';
}

function utcToBR(utcDateStr) {
  var d = new Date(utcDateStr);
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  var br = new Date(utc + TZ_OFFSET * 3600000);
  return br;
}

function fmtBRDate(d) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function resolveName(apiName) {
  return NAME_MAP[apiName] || apiName;
}

function dateStr(d) {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function fmtDate(d) {
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Converte resposta da API football-data pro nosso formato
function convertMatches(apiData) {
  var result = [];
  var matches = apiData.matches || [];
  for (var i = 0; i < matches.length; i++) {
    var m = matches[i];
    var t1 = resolveName(m.homeTeam.name);
    var t2 = resolveName(m.awayTeam.name);
    var apiStatus = m.status;
    var myStatus = STATUS_MAP[apiStatus] || 'upcoming';

    var score = null;
    if (m.score && m.score.fullTime && m.score.fullTime.home !== null) {
      score = { ft: [m.score.fullTime.home, m.score.fullTime.away] };
    } else if (m.score && m.score.halfTime && m.score.halfTime.home !== null) {
      score = { ht: [m.score.halfTime.home, m.score.halfTime.away] };
    }

    var kickOff = m.utcDate ? new Date(m.utcDate) : null;
    var timeStr = '';
    var matchDate = '';
    var matchDateBR = '';
    if (kickOff) {
      var brTime = utcToBR(m.utcDate);
      var hh = String(brTime.getHours()).padStart(2, '0');
      var mm = String(brTime.getMinutes()).padStart(2, '0');
      timeStr = hh + ':' + mm;
      matchDate = dateStr(brTime);
      matchDateBR = fmtBRDate(brTime);
    }

    var round = '';
    if (m.stage === 'GROUP_STAGE' && m.matchday) round = 'Rodada ' + m.matchday;
    if (m.stage === 'GROUP_STAGE' && !m.matchday) round = 'Fase de Grupos';
    if (m.stage === 'LAST_32') round = '16 Avos de Final';
    if (m.stage === 'LAST_16') round = 'Oitavas de Final';
    if (m.stage === 'QUARTER_FINALS') round = 'Quartas de Final';
    if (m.stage === 'SEMI_FINALS') round = 'Semifinal';
    if (m.stage === 'FINAL') round = 'Final';
    if (m.stage === 'THIRD_PLACE') round = 'Disputa de 3º Lugar';

    var group = '';
    if (m.group) {
      var gn = m.group.name || m.group;
      if (typeof gn === 'string' && gn.indexOf('GROUP_') !== -1) {
        group = 'Grupo ' + gn.replace('GROUP_', '');
      } else if (typeof gn === 'string') {
        group = gn;
      }
    }

    var venue = m.venue || '';

    result.push({
      team1: t1,
      team2: t2,
      date: matchDate,
      dateBR: matchDateBR,
      time: timeStr,
      score: score,
      round: round,
      group: group,
      ground: venue,
      status: myStatus,
      utcDate: m.utcDate,
    });
  }
  return result;
}

// Cache
function getCached() {
  try {
    var raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    var cache = JSON.parse(raw);
    // Se estamos em rate limit, estende TTL pra 15min
    var ttl = isRateLimited() ? 15 * 60 * 1000 : CACHE_TTL;
    if (Date.now() - cache.ts > ttl) return null;
    return cache.data;
  } catch (e) {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data }));
  } catch (e) {}
}

function isRateLimited() {
  try {
    var rl = localStorage.getItem(RATE_LIMIT_KEY);
    if (!rl) return false;
    return Date.now() - parseInt(rl, 10) < 60000; // 1 min cooldown
  } catch (e) {
    return false;
  }
}

function markRateLimited() {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  } catch (e) {}
}

// Funcoes de status/placar (adaptadas pro formato novo)
function parseTime(match) {
  if (match.utcDate) return new Date(match.utcDate);
  if (!match.time) return null;
  var parts = match.time.split(':');
  var h = parseInt(parts[0], 10);
  var m = parseInt(parts[1], 10);
  var d = new Date(match.date + 'T12:00:00');
  d.setHours(h, m, 0);
  return d;
}

function isLive(match) {
  return match.status === 'live';
}

function scoreHTML(match, type) {
  if (match.score && match.score.ft) {
    return match.score.ft[0] + ' <span class="separator">x</span> ' + match.score.ft[1];
  }
  if (match.score && match.score.ht) {
    return match.score.ht[0] + ' <span class="separator">x</span> ' + match.score.ht[1];
  }
  if (type === 'live') {
    return '<span class="score-live-label">Em andamento</span>';
  }
  return '<span class="separator">vs</span>';
}

function getMatchTimeBR(match) {
  if (match.utcDate) {
    var brTime = utcToBR(match.utcDate);
    return (
      String(brTime.getHours()).padStart(2, '0') +
      ':' +
      String(brTime.getMinutes()).padStart(2, '0')
    );
  }
  return match.time || '';
}

function statusInfo(match, type) {
  if (match.status === 'finished') return { cls: 'finished', text: 'Encerrado' };
  if (match.status === 'live') return { cls: 'live', text: 'AO VIVO' };
  if (match.status === 'cancelled') return { cls: 'finished', text: 'Cancelado' };
  if (type === 'today' || type === 'live') {
    var t = parseTime(match);
    if (t) {
      var now = new Date();
      var end = new Date(t.getTime() + 120 * 60000);
      if (t > now) return { cls: 'upcoming', text: getMatchTimeBR(match) };
      if (now <= end) return { cls: 'live', text: 'AO VIVO' };
      if (!match.score) return { cls: 'finished', text: 'Encerrado' };
    }
  }
  return { cls: 'upcoming', text: getMatchTimeBR(match) || 'A definir' };
}

function matchCard(match, type) {
  var s = statusInfo(match, type);
  var live = type === 'live' || s.cls === 'live';
  var h = '<div class="match-card ' + s.cls + (live ? ' match-card-live' : '') + '">';
  if (live) h += '<div class="live-indicator"><span class="live-dot"></span> AO VIVO</div>';
  h += '<div class="match-info">';
  h +=
    '<span class="match-round">' +
    (match.dateBR || match.date || '') +
    (match.round ? ' · ' + match.round : '') +
    '</span>';
  if (!live) h += '<span class="match-status ' + s.cls + '">' + s.text + '</span>';
  h += '</div>';
  h += '<div class="match-teams">';
  h +=
    '<div class="team" style="justify-content:flex-end"><span class="team-name">' +
    pt(match.team1) +
    '</span><span class="team-flag">' +
    flag(match.team1) +
    '</span></div>';
  h += '<div class="score">' + scoreHTML(match, type) + '</div>';
  h +=
    '<div class="team"><span class="team-flag">' +
    flag(match.team2) +
    '</span><span class="team-name">' +
    pt(match.team2) +
    '</span></div>';
  h += '</div>';
  h +=
    '<div class="match-details"><span>' +
    (match.ground || '') +
    '</span><span>' +
    (match.group || '') +
    '</span></div>';
  h += '</div>';
  return h;
}

function renderInto(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function noGames(msg) {
  return '<div class="no-matches"><div class="icon">📅</div><p>' + msg + '</p></div>';
}

function sortByTime(matches) {
  return matches.sort(function (a, b) {
    var aLive = isLive(a) ? 0 : 1;
    var bLive = isLive(b) ? 0 : 1;
    if (aLive !== bLive) return aLive - bLive;
    var ta = a.utcDate ? new Date(a.utcDate).getTime() : parseTime(a) ? parseTime(a).getTime() : 0;
    var tb = b.utcDate ? new Date(b.utcDate).getTime() : parseTime(b) ? parseTime(b).getTime() : 0;
    return ta - tb;
  });
}

function renderAll() {
  renderLiveSection();
  renderCalendarGrid();
  if (!teamPopulated) {
    populateTeamSelect();
    teamPopulated = true;
  }
}

function renderLiveSection() {
  var today = dateStr(currentDate);
  var yest = dateStr(new Date(currentDate.getTime() - 86400000));
  var todayAll = allMatches.filter(function (m) {
    return m.date === today;
  });
  var yestAll = allMatches.filter(function (m) {
    return m.date === yest;
  });
  var liveNow = todayAll.filter(isLive);
  var notLive = todayAll.filter(function (m) {
    return !isLive(m);
  });

  var hl = document.getElementById('live-highlight');
  if (liveNow.length > 0) {
    hl.style.display = 'block';
    renderInto(
      'live-highlight-matches',
      liveNow
        .map(function (m) {
          return matchCard(m, 'live');
        })
        .join(''),
    );
  } else {
    hl.style.display = 'none';
  }

  if (notLive.length > 0) {
    renderInto(
      'live-matches',
      sortByTime(notLive)
        .map(function (m) {
          return matchCard(m, 'today');
        })
        .join(''),
    );
  } else {
    renderInto('live-matches', noGames('Nenhum jogo hoje'));
  }

  if (yestAll.length > 0) {
    renderInto(
      'yesterday-matches',
      sortByTime(yestAll)
        .map(function (m) {
          return matchCard(m, 'yesterday');
        })
        .join(''),
    );
  } else {
    renderInto('yesterday-matches', noGames('Nenhum jogo ontem'));
  }
}

function renderCalendarGrid() {
  var grid = document.getElementById('calendar-grid');
  if (!grid) return;
  var months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  var days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  document.getElementById('calendar-month-label').textContent = months[calMonth] + ' ' + calYear;

  var first = new Date(calYear, calMonth, 1).getDay();
  var total = new Date(calYear, calMonth + 1, 0).getDate();
  var sel = dateStr(currentDate);
  var today = new Date();
  var html = '';
  var i;

  for (i = 0; i < 7; i++) html += '<div class="cal-day-header">' + days[i] + '</div>';
  for (i = 0; i < first; i++) html += '<div class="cal-day empty"></div>';

  for (var d = 1; d <= total; d++) {
    var ds =
      calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var cls = 'cal-day';
    if (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear())
      cls += ' today';
    if (ds === sel) cls += ' selected';
    if (
      allMatches.some(function (m) {
        return m.date === ds;
      })
    )
      cls += ' has-match';
    html += '<div class="' + cls + '" data-date="' + ds + '">' + d + '</div>';
  }

  grid.innerHTML = html;

  var clickables = grid.querySelectorAll('.cal-day[data-date]');
  for (i = 0; i < clickables.length; i++) {
    clickables[i].addEventListener('click', function () {
      currentDate = new Date(this.getAttribute('data-date') + 'T12:00:00');
      calMonth = currentDate.getMonth();
      calYear = currentDate.getFullYear();
      renderCalendarGrid();
      renderCalendarMatches();
    });
  }
}

function renderCalendarMatches() {
  var sel = dateStr(currentDate);
  var matches = sortByTime(
    allMatches.filter(function (m) {
      return m.date === sel;
    }),
  );
  var label = document.getElementById('calendar-selected-date');
  if (label) label.textContent = fmtDate(currentDate);
  if (matches.length === 0) {
    renderInto('calendar-matches', noGames('Nenhum jogo nesta data'));
  } else {
    renderInto(
      'calendar-matches',
      matches
        .map(function (m) {
          return matchCard(m, 'calendar');
        })
        .join(''),
    );
  }
}

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCalendarGrid();
}

function changeDate(delta) {
  currentDate.setDate(currentDate.getDate() + delta);
  calMonth = currentDate.getMonth();
  calYear = currentDate.getFullYear();
  document.getElementById('today-date').textContent = fmtDate(currentDate);
  document.getElementById('yesterday-date').textContent = fmtDate(
    new Date(currentDate.getTime() - 86400000),
  );
  renderCalendarGrid();
  renderCalendarMatches();
}

function populateTeamSelect() {
  var teams = {};
  allMatches.forEach(function (m) {
    if (m.team1 && !m.team1.match(/^[WL\d]/)) teams[m.team1] = 1;
    if (m.team2 && !m.team2.match(/^[WL\d]/)) teams[m.team2] = 1;
  });
  var list = Object.keys(teams).sort(function (a, b) {
    return pt(a).localeCompare(pt(b), 'pt-BR');
  });
  var sel = document.getElementById('team-select');
  list.forEach(function (t) {
    var opt = document.createElement('option');
    opt.value = t;
    opt.textContent = flag(t) + ' ' + pt(t);
    sel.appendChild(opt);
  });
}

function renderTeamMatches(team) {
  var container = document.getElementById('team-matches');
  if (!team) {
    container.innerHTML = '<div class="loading">Selecione uma seleção</div>';
    return;
  }
  var matches = allMatches.filter(function (m) {
    return m.team1 === team || m.team2 === team;
  });
  if (matches.length === 0) {
    container.innerHTML = noGames('Nenhum jogo encontrado para ' + pt(team));
    return;
  }
  var today = dateStr(new Date());
  var past = [];
  var future = [];
  matches.forEach(function (m) {
    if (isLive(m)) {
      future.unshift(m);
    } else if (m.score && m.score.ft) {
      past.push(m);
    } else if (m.date < today) {
      past.push(m);
    } else {
      future.push(m);
    }
  });
  var html = '';
  if (past.length > 0) {
    html += '<h3 style="margin:1rem 0 0.5rem;color:var(--text-muted)">Jogos Anteriores</h3>';
    html += sortByTime(past)
      .map(function (m) {
        return matchCard(m, 'past');
      })
      .join('');
  }
  if (future.length > 0) {
    html += '<h3 style="margin:1rem 0 0.5rem;color:var(--text-muted)">Próximos Jogos</h3>';
    html += sortByTime(future)
      .map(function (m) {
        return matchCard(m, 'future');
      })
      .join('');
  }
  container.innerHTML = html || noGames('Nenhum jogo encontrado');
}

function switchTab(name) {
  var i;
  var tabs = document.querySelectorAll('.tab');
  for (i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  var secs = document.querySelectorAll('.section');
  for (i = 0; i < secs.length; i++) secs[i].classList.remove('active');
  document.querySelector('[data-tab="' + name + '"]').classList.add('active');
  document.getElementById(name).classList.add('active');
  if (name === 'calendar') {
    renderCalendarGrid();
    renderCalendarMatches();
  }
}

function loadMatches() {
  // 1. Mostra cache imediatamente (zero delay)
  var cached = getCached();
  if (cached) {
    allMatches = cached;
    renderAll();
    // Se tem cache valido e NAO esta em rate limit, tenta atualizar em background
    if (!isRateLimited()) {
      refreshInBackground();
    }
    return;
  }

  // 2. Sem cache → tenta API, senao fallback
  if (isRateLimited()) {
    loadFallback();
    return;
  }

  fetchAPI();
}

function processAPIData(data) {
  allMatches = convertMatches(data);
  setCache(allMatches);
  renderAll();
}

function fetchFromAPI(onError) {
  fetch(API_BASE)
    .then(function (r) {
      if (r.status === 429) {
        markRateLimited();
        throw new Error('Rate limited');
      }
      if (!r.ok) throw new Error('API ' + r.status);
      return r.json();
    })
    .then(processAPIData)
    .catch(onError);
}

function refreshInBackground() {
  fetchFromAPI(function () {});
}

function fetchAPI() {
  fetchFromAPI(function (err) {
    console.warn('football-data.org falhou, tentando fallback:', err);
    loadFallback();
  });
}

function loadFallback() {
  fetch(FALLBACK_URL + '?_t=' + Date.now())
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      var raw = data.matches || [];
      allMatches = raw.map(function (m) {
        var score = null;
        if (m.score && m.score.ft) {
          score = { ft: m.score.ft };
        } else if (m.score && m.score.ht) {
          score = { ht: m.score.ht };
        }

        // Converte horario openfootball (ex: "18:00 UTC-4") pra BRT
        var timeBR = '';
        var dateBR = m.date || '';
        if (m.time) {
          var parts = m.time.split(' ');
          var hm = parts[0].split(':');
          var h = parseInt(hm[0], 10);
          var min = parseInt(hm[1], 10);
          var tz = parts[1] || '';
          var off = 0;
          if (tz.indexOf('UTC') !== -1) {
            off = parseInt(tz.replace('UTC', ''), 10) || 0;
          }
          // Horario do jogo em UTC: local_time - offset
          var utcH = h - off;
          // Converte UTC pra BRT (UTC-3)
          var brH = utcH + TZ_OFFSET;
          var brDay = 0;
          if (brH < 0) {
            brH += 24;
            brDay = -1;
          }
          if (brH >= 24) {
            brH -= 24;
            brDay = 1;
          }
          timeBR = String(brH).padStart(2, '0') + ':' + String(min).padStart(2, '0');
          if (brDay !== 0 && m.date) {
            var d = new Date(m.date + 'T12:00:00');
            d.setDate(d.getDate() + brDay);
            dateBR = dateStr(d);
          }
        }

        return {
          team1: m.team1,
          team2: m.team2,
          date: m.date,
          dateBR: dateBR,
          time: timeBR,
          score: score,
          round: m.round || '',
          group: m.group || '',
          ground: m.ground || '',
          status: score && score.ft ? 'finished' : 'upcoming',
          utcDate: null,
        };
      });
      setCache(allMatches);
      renderAll();
    })
    .catch(function (err2) {
      console.error('Fallback tambem falhou:', err2);
      if (allMatches.length === 0) {
        renderInto(
          'live-matches',
          '<div class="no-matches"><div class="icon">⚠️</div><p>Erro ao carregar dados. Tente novamente.</p></div>',
        );
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  currentDate.setHours(12, 0, 0, 0);
  document.getElementById('today-date').textContent = fmtDate(currentDate);
  document.getElementById('yesterday-date').textContent = fmtDate(
    new Date(currentDate.getTime() - 86400000),
  );

  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
      switchTab(this.getAttribute('data-tab'));
    });
  }

  var prevBtn = document.getElementById('prev-day');
  var nextBtn = document.getElementById('next-day');
  if (prevBtn)
    prevBtn.addEventListener('click', function () {
      changeDate(-1);
    });
  if (nextBtn)
    nextBtn.addEventListener('click', function () {
      changeDate(1);
    });

  var teamSel = document.getElementById('team-select');
  if (teamSel)
    teamSel.addEventListener('change', function () {
      renderTeamMatches(this.value);
    });

  loadMatches();
  // Refresh a cada 5min (respeita limite 10/min)
  setInterval(loadMatches, CACHE_TTL);
});
