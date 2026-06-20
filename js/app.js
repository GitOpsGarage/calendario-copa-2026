// Copa 2026 - App
var API_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

var FLAGS = {
    'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czech Republic':'🇨🇿',
    'Argentina':'🇦🇷','Canada':'🇨🇦','Morocco':'🇲🇦','Croatia':'🇭🇷',
    'Brazil':'🇧🇷','Serbia':'🇷🇸','Germany':'🇩🇪','Japan':'🇯🇵',
    'Spain':'🇪🇸','Colombia':'🇨🇴','France':'🇫🇷','Australia':'🇦🇺',
    'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Italy':'🇮🇹','Netherlands':'🇳🇱','USA':'🇺🇸',
    'Portugal':'🇵🇹','Belgium':'🇧🇪','Uruguay':'🇺🇾','Switzerland':'🇨🇭',
    'Ecuador':'🇪🇨','Senegal':'🇸🇳','Poland':'🇵🇱','Saudi Arabia':'🇸🇦',
    'Tunisia':'🇹🇳','Denmark':'🇩🇰','Wales':'🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'Iran':'🇮🇷','Qatar':'🇶🇦','Cameroon':'🇨🇲','Ghana':'🇬🇭',
    'Costa Rica':'🇨🇷','Peru':'🇵🇪','Iceland':'🇮🇸','Panama':'🇵🇦',
    'Egypt':'🇪🇬','Nigeria':'🇳🇬','Korea Republic':'🇰🇷','Korea DPR':'🇰🇵',
    'Algeria':'🇩🇿','Honduras':'🇭🇳','Jamaica':'🇯🇲','Paraguay':'🇵🇾',
    'Chile':'🇨🇱','Bolivia':'🇧🇴','Venezuela':'🇻🇪','China PR':'🇨🇳',
    'Iraq':'🇮🇶','UAE':'🇦🇪','Oman':'🇴🇲','Thailand':'🇹🇭',
    'Vietnam':'🇻🇳','Indonesia':'🇮🇩','Malaysia':'🇲🇾','Philippines':'🇵🇭',
    'New Zealand':'🇳🇿','Fiji':'🇫🇯','Solomon Islands':'🇸🇧','Papua New Guinea':'🇵🇬',
    'Guatemala':'🇬🇹','El Salvador':'🇸🇻','Trinidad and Tobago':'🇹🇹',
    'Curacao':'🇨🇼','Curaçao':'🇨🇼','Haiti':'🇭🇹','Cuba':'🇨🇺',
    'Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Turkey':'🇹🇷','Norway':'🇳🇴','Sweden':'🇸🇪',
    'Ivory Coast':'🇨🇮','Austria':'🇦🇹','Jordan':'🇯🇴',
    'Bosnia & Herzegovina':'🇧🇦','Uzbekistan':'🇺🇿','DR Congo':'🇨🇩',
    'Cape Verde':'🇨🇻',
    'Al Ahly SC (EGY)':'🇪🇬','Inter Miami CF (USA)':'🇺🇸','Palmeiras (BRA)':'🇧🇷',
    'FC Porto (POR)':'🇵🇹','Chelsea FC (ENG)':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Paris Saint-Germain (FRA)':'🇫🇷'
};

var PT = {
    'Mexico':'México','South Africa':'África do Sul','South Korea':'Coreia do Sul',
    'Czech Republic':'Tchéquia','Argentina':'Argentina','Canada':'Canadá',
    'Morocco':'Marrocos','Croatia':'Croácia','Brazil':'Brasil','Serbia':'Sérvia',
    'Germany':'Alemanha','Japan':'Japão','Spain':'Espanha','Colombia':'Colômbia',
    'France':'França','Australia':'Austrália','England':'Inglaterra','Italy':'Itália',
    'Netherlands':'Holanda','USA':'EUA','Portugal':'Portugal','Belgium':'Bélgica',
    'Uruguay':'Uruguai','Switzerland':'Suíça','Ecuador':'Equador','Senegal':'Senegal',
    'Poland':'Polônia','Saudi Arabia':'Arábia Saudita','Tunisia':'Tunísia',
    'Denmark':'Dinamarca','Wales':'País de Gales','Iran':'Irã','Qatar':'Catar',
    'Cameroon':'Camarões','Ghana':'Gana','Costa Rica':'Costa Rica','Peru':'Peru',
    'Iceland':'Islândia','Panama':'Panamá','Egypt':'Egito','Nigeria':'Nigéria',
    'Korea Republic':'Coreia do Sul','Korea DPR':'Coreia do Norte','Algeria':'Argélia',
    'Honduras':'Honduras','Jamaica':'Jamaica','Paraguay':'Paraguai','Chile':'Chile',
    'Bolivia':'Bolívia','Venezuela':'Venezuela','China PR':'China','Iraq':'Iraque',
    'UAE':'EAU','Oman':'Omã','Thailand':'Tailândia','Vietnam':'Vietnã',
    'Indonesia':'Indonésia','Malaysia':'Malásia','Philippines':'Filipinas',
    'New Zealand':'Nova Zelândia','Fiji':'Fiji','Solomon Islands':'Ilhas Salomão',
    'Papua New Guinea':'Papua-Nova Guiné','Guatemala':'Guatemala',
    'El Salvador':'El Salvador','Trinidad and Tobago':'Trinidad e Tobago',
    'Curacao':'Curaçao','Curaçao':'Curaçao','Haiti':'Haiti','Cuba':'Cuba',
    'Scotland':'Escócia','Turkey':'Turquia','Norway':'Noruega','Sweden':'Suécia',
    'Ivory Coast':'Costa do Marfim','Austria':'Áustria','Jordan':'Jordânia',
    'Bosnia & Herzegovina':'Bósnia e Herzegovina','Uzbekistan':'Uzbequistão',
    'DR Congo':'RD Congo','Cape Verde':'Cabo Verde'
};

var allMatches = [];
var currentDate = new Date();
var calMonth = currentDate.getMonth();
var calYear = currentDate.getFullYear();
var teamPopulated = false;

function pt(name) { return PT[name] || name; }
function flag(name) { return FLAGS[name] || '🏳️'; }

function dateStr(d) {
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

function fmtDate(d) {
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function parseTime(match) {
    if (!match.time) return null;
    var parts = match.time.split(' ');
    var hm = parts[0].split(':');
    var h = parseInt(hm[0], 10);
    var m = parseInt(hm[1], 10);
    var tz = parts[1] || '';
    var d = new Date(match.date + 'T12:00:00');
    if (tz.indexOf('UTC') !== -1) {
        var off = parseInt(tz.replace('UTC', ''), 10) || 0;
        d.setUTCHours(h - off, m, 0);
    } else {
        d.setHours(h, m, 0);
    }
    return d;
}

function isLive(match) {
    if (match.score && match.score.ft) return false;
    var t = parseTime(match);
    if (!t) return false;
    var now = new Date();
    var end = new Date(t.getTime() + 120 * 60000);
    return t <= now && now <= end;
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

function statusInfo(match, type) {
    if (match.score && match.score.ft) {
        return { cls: 'finished', text: 'Encerrado' };
    }
    if (type === 'today' || type === 'live') {
        var t = parseTime(match);
        if (!t) return { cls: 'upcoming', text: 'A definir' };
        var now = new Date();
        var end = new Date(t.getTime() + 120 * 60000);
        if (t > now) return { cls: 'upcoming', text: t.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
        if (now <= end) return { cls: 'live', text: 'AO VIVO' };
        return { cls: 'finished', text: 'Encerrado' };
    }
    return { cls: 'upcoming', text: match.time || 'A definir' };
}

function matchCard(match, type) {
    var s = statusInfo(match, type);
    var live = type === 'live' || s.cls === 'live';
    var h = '<div class="match-card ' + s.cls + (live ? ' match-card-live' : '') + '">';
    if (live) h += '<div class="live-indicator"><span class="live-dot"></span> AO VIVO</div>';
    h += '<div class="match-info"><span class="match-round">' + (match.round || 'Fase de Grupos') + '</span>';
    if (!live) h += '<span class="match-status ' + s.cls + '">' + s.text + '</span>';
    h += '</div>';
    h += '<div class="match-teams">';
    h += '<div class="team" style="justify-content:flex-end"><span class="team-name">' + pt(match.team1) + '</span><span class="team-flag">' + flag(match.team1) + '</span></div>';
    h += '<div class="score">' + scoreHTML(match, type) + '</div>';
    h += '<div class="team"><span class="team-flag">' + flag(match.team2) + '</span><span class="team-name">' + pt(match.team2) + '</span></div>';
    h += '</div>';
    h += '<div class="match-details"><span>' + (match.ground || '') + '</span><span>' + (match.group || '') + '</span></div>';
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

function renderLiveSection() {
    var today = dateStr(currentDate);
    var yest = dateStr(new Date(currentDate.getTime() - 86400000));
    var todayAll = allMatches.filter(function(m) { return m.date === today; });
    var yestAll = allMatches.filter(function(m) { return m.date === yest; });
    var liveNow = todayAll.filter(isLive);
    var notLive = todayAll.filter(function(m) { return !isLive(m); });

    var hl = document.getElementById('live-highlight');
    if (liveNow.length > 0) {
        hl.style.display = 'block';
        renderInto('live-highlight-matches', liveNow.map(function(m) { return matchCard(m, 'live'); }).join(''));
    } else {
        hl.style.display = 'none';
    }

    if (notLive.length > 0) {
        renderInto('live-matches', notLive.map(function(m) { return matchCard(m, 'today'); }).join(''));
    } else {
        renderInto('live-matches', noGames('Nenhum jogo hoje'));
    }

    if (yestAll.length > 0) {
        renderInto('yesterday-matches', yestAll.map(function(m) { return matchCard(m, 'yesterday'); }).join(''));
    } else {
        renderInto('yesterday-matches', noGames('Nenhum jogo ontem'));
    }
}

function renderCalendarGrid() {
    var grid = document.getElementById('calendar-grid');
    if (!grid) return;
    var months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    var days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
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
        var ds = calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        var cls = 'cal-day';
        if (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()) cls += ' today';
        if (ds === sel) cls += ' selected';
        if (allMatches.some(function(m) { return m.date === ds; })) cls += ' has-match';
        html += '<div class="' + cls + '" data-date="' + ds + '">' + d + '</div>';
    }

    grid.innerHTML = html;

    var clickables = grid.querySelectorAll('.cal-day[data-date]');
    for (i = 0; i < clickables.length; i++) {
        clickables[i].addEventListener('click', function() {
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
    var matches = allMatches.filter(function(m) { return m.date === sel; });
    var label = document.getElementById('calendar-selected-date');
    if (label) label.textContent = fmtDate(currentDate);
    if (matches.length === 0) {
        renderInto('calendar-matches', noGames('Nenhum jogo nesta data'));
    } else {
        renderInto('calendar-matches', matches.map(function(m) { return matchCard(m, 'calendar'); }).join(''));
    }
}

function changeMonth(delta) {
    calMonth += delta;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendarGrid();
}

function changeDate(delta) {
    currentDate.setDate(currentDate.getDate() + delta);
    calMonth = currentDate.getMonth();
    calYear = currentDate.getFullYear();
    document.getElementById('today-date').textContent = fmtDate(currentDate);
    document.getElementById('yesterday-date').textContent = fmtDate(new Date(currentDate.getTime() - 86400000));
    renderCalendarGrid();
    renderCalendarMatches();
}

function populateTeamSelect() {
    var teams = {};
    allMatches.forEach(function(m) {
        if (m.team1 && !m.team1.match(/^[WL\d]/)) teams[m.team1] = 1;
        if (m.team2 && !m.team2.match(/^[WL\d]/)) teams[m.team2] = 1;
    });
    var list = Object.keys(teams).sort(function(a, b) {
        return pt(a).localeCompare(pt(b), 'pt-BR');
    });
    var sel = document.getElementById('team-select');
    list.forEach(function(t) {
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
    var matches = allMatches.filter(function(m) { return m.team1 === team || m.team2 === team; });
    if (matches.length === 0) {
        container.innerHTML = noGames('Nenhum jogo encontrado para ' + pt(team));
        return;
    }
    var today = dateStr(new Date());
    var past = [];
    var future = [];
    matches.forEach(function(m) {
        if (isLive(m)) { future.unshift(m); }
        else if (m.score && m.score.ft) { past.push(m); }
        else if (m.date < today) { past.push(m); }
        else { future.push(m); }
    });
    var html = '';
    if (past.length > 0) {
        html += '<h3 style="margin:1rem 0 0.5rem;color:var(--text-muted)">Jogos Anteriores</h3>';
        html += past.map(function(m) { return matchCard(m, 'past'); }).join('');
    }
    if (future.length > 0) {
        html += '<h3 style="margin:1rem 0 0.5rem;color:var(--text-muted)">Próximos Jogos</h3>';
        html += future.map(function(m) { return matchCard(m, 'future'); }).join('');
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
    if (name === 'calendar') { renderCalendarGrid(); renderCalendarMatches(); }
}

function loadMatches() {
    fetch(API_URL + '?_t=' + Date.now())
        .then(function(r) { return r.json(); })
        .then(function(data) {
            allMatches = data.matches || [];
            renderLiveSection();
            renderCalendarGrid();
            if (!teamPopulated) {
                populateTeamSelect();
                teamPopulated = true;
            }
        })
        .catch(function(err) {
            console.error('Erro ao buscar jogos:', err);
            renderInto('live-matches', '<div class="no-matches"><div class="icon">⚠️</div><p>Erro ao carregar dados</p></div>');
        });
}

document.addEventListener('DOMContentLoaded', function() {
    currentDate.setHours(12, 0, 0, 0);
    document.getElementById('today-date').textContent = fmtDate(currentDate);
    document.getElementById('yesterday-date').textContent = fmtDate(new Date(currentDate.getTime() - 86400000));

    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() { switchTab(this.getAttribute('data-tab')); });
    }

    var prevBtn = document.getElementById('prev-day');
    var nextBtn = document.getElementById('next-day');
    if (prevBtn) prevBtn.addEventListener('click', function() { changeDate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { changeDate(1); });

    var teamSel = document.getElementById('team-select');
    if (teamSel) teamSel.addEventListener('change', function() { renderTeamMatches(this.value); });

    loadMatches();
    setInterval(loadMatches, 30000);
});
