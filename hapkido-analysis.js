console.log('Module: hapkido-analysis.js loaded');
/**
 * Module: hapkido-analysis.js
 * Deterministic Combat Analysis Engine + Subjective Combat Profile (instructor)
 * Part of Hapkido Athlete Measurement SPA
 *
 * All rules are transparent and deterministic (no LLM). Inputs:
 *  - Official combat records (type 'COMBATE', per-round data from the scoreboard)
 *  - Latest physical record (type 'FISICA') for physiological cross-reference
 *  - Optional subjective combat profile (athlete.combatProfile, instructor-captured)
 */

const COMBAT_PROFILE_CATALOG = [
    {
        id: 'explosividad',
        label: 'Explosividad',
        rubric: 'Capacidad de ejecución rápida y potente. 1-3: movimiento lento, poca potencia. 4-6: potencia moderada en técnicas aisladas. 7-10: arranque y golpeo explosivo constante desde cualquier posición.'
    },
    {
        id: 'derribos',
        label: 'Derribos / Proyecciones',
        rubric: 'Ejecución y efectividad de barridos y proyecciones. 1-3: intentos fallidos o ausentes. 4-6: derribos básicos con éxito intermitente. 7-10: dominio de derribos variados y efectivos bajo presión.'
    },
    {
        id: 'patadas',
        label: 'Patadas',
        rubric: '1-3: patadas básicas (p.ej. pwi chagui) repetitivas. 4-6: patadas avanzadas (360, con giro, hachas). 7-10: combinaciones de patadas variadas, precisas y efectivas de forma continua durante el ataque.'
    },
    {
        id: 'golpes',
        label: 'Golpes',
        rubric: 'Sin golpes a la cara (reglamento FEVEHAPKIDO). 1-3: golpes legales poco efectivos o inexistentes. 4-6: golpes legales correctos. 10: combina patadas y golpes legales con efectividad y fluidez.'
    },
    {
        id: 'disciplina',
        label: 'Disciplina / Temperamento',
        rubric: '1-3: pierde calma, acumula faltas, ignora la esquina. 4-6: control aceptable. 7-10: combatiente sereno, atento a las instrucciones incluso bajo fatiga o presión.'
    },
    {
        id: 'resistencia',
        label: 'Resistencia / Recuperación',
        rubric: 'Resistencia y recuperación percibida bajo exigencia. 1-3: se frena rápido y tarda en recuperar el ritmo. 4-6: sostiene rounds exigentes con descenso moderado. 7-10: mantiene la intensidad y recupera rápido incluso en round de desempate.'
    },
    {
        id: 'tactica',
        label: 'Lectura Táctica / Adaptación',
        rubric: 'Capacidad de leer al rival y ajustar. 1-3: lucha el mismo plan sin ajustar. 4-6: hace ajustes puntuales entre rounds. 7-10: lee al rival en tiempo real, adapta distancias y técnicas, y ejecuta la estrategia de la esquina.'
    },
    {
        id: 'guardia',
        label: 'Guardia / Defensa',
        rubric: 'Cuánto le anotan limpio. 1-3: recibe puntos con facilidad, guardia baja o predecible. 4-6: defensa correcta pero concede en intercambios. 7-10: guardia sólida, esquiva/bloqueo efectivo, pocas concesiones limpias.'
    }
];

HapkidoApp.prototype.getCombatProfileCatalog = function() {
    return COMBAT_PROFILE_CATALOG;
};

HapkidoApp.prototype.getCombatProfileIndex = function(athlete) {
    if (!athlete || !athlete.combatProfile || !athlete.combatProfile.scores) return null;
    const vals = COMBAT_PROFILE_CATALOG
        .map(m => athlete.combatProfile.scores[m.id])
        .filter(v => typeof v === 'number' && !isNaN(v));
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
};

HapkidoApp.prototype.getCombatProfileLabel = function(score) {
    if (score == null) return { label: 'Sin perfil', cls: 'neutral' };
    if (score >= 8.5) return { label: 'Nivel elite del dojang', cls: 'success' };
    if (score >= 7) return { label: 'Nivel avanzado', cls: 'success' };
    if (score >= 5) return { label: 'Nivel intermedio', cls: 'warning' };
    if (score >= 3) return { label: 'En desarrollo', cls: 'warning' };
    return { label: 'Nivel inicial', cls: 'neutral' };
};

/**
 * Classify fight style from deterministic stats. First matching rule wins.
 */
HapkidoApp.prototype.classifyFightStyle = function(s) {
    const ev = [];
    const pct = v => `${Math.round(v * 100)}%`;

    if (s.margin >= 8 && s.tech3Share >= 0.3) {
        ev.push(`Marcador abierto (+${s.margin} pts) con ${pct(s.tech3Share)} de puntos en técnicas de 3 pts.`);
        ev.push(`Ganó ${s.roundsWon} de ${s.roundsWon + s.roundsLost + s.roundsTied} rounds disputados.`);
        return { style: 'Dominante explosivo', cls: 'success', evidence: ev };
    }
    if (s.margin >= 5) {
        ev.push(`Superioridad clara en el marcador (+${s.margin} pts).`);
        if (s.effFouls <= 1) ev.push('Mantuvo la disciplina durante el combate.');
        return { style: 'Superioridad controlada', cls: 'success', evidence: ev };
    }
    if (s.tech3Share >= 0.35 && s.effFouls <= 1) {
        ev.push(`${pct(s.tech3Share)} de sus puntos provienen de técnicas de 3 pts (giros, barridos dobles, proyecciones).`);
        ev.push(`Solo ${s.effFouls} falta(s) efectiva(s).`);
        return { style: 'Explosivo técnico', cls: 'success', evidence: ev };
    }
    if (s.tech3Share >= 0.35 && s.effFouls >= 3) {
        ev.push(`Alta producción de técnicas de alto puntaje (${pct(s.tech3Share)} en 3 pts).`);
        ev.push(`${s.effFouls} faltas efectivas: la agresión le cedió puntos al rival.`);
        return { style: 'Explosivo indisciplinado', cls: 'warning', evidence: ev };
    }
    if (s.tech1Share >= 0.5 && s.totalOwn >= 4) {
        ev.push(`${pct(s.tech1Share)} de sus puntos son golpes/patadas simples de 1 pt.`);
        ev.push('Perfil de volumen y presión más que de alto puntaje.');
        return { style: 'Presión por volumen', cls: 'neutral', evidence: ev };
    }
    if (s.margin <= 0 && Math.abs(s.margin) <= 4 && s.effFouls <= 1) {
        ev.push(`Combate cerrado (${s.margin >= 0 ? '+' : ''}${s.margin} pts) con pocas faltas.`);
        ev.push('Patrón de lucha esperando el error del rival.');
        return { style: 'Contraataque defensivo', cls: 'neutral', evidence: ev };
    }
    if (s.roundsWon > s.roundsLost) {
        ev.push(`Ganó más rounds (${s.roundsWon}G / ${s.roundsLost}P) con margen ajustado (${s.margin >= 0 ? '+' : ''}${s.margin} pts).`);
        return { style: 'Técnico táctico (cerrado)', cls: 'neutral', evidence: ev };
    }
    ev.push('Sin rasgos dominantes suficientes para clasificar con las reglas actuales.');
    return { style: 'Perfil mixto', cls: 'neutral', evidence: ev };
};

/**
 * Analyze a single COMBATE record. Returns null if not a combat record.
 */
HapkidoApp.prototype.analyzeCombatRecord = function(record) {
    if (!record || record.type !== 'COMBATE' || !record.combatDetails) return null;
    const cd = record.combatDetails;
    const rounds = cd.rounds || {};

    const isRoundFought = rd => {
        if (!rd) return false;
        return !!(rd.blueScore || rd.redScore ||
            rd.blueTech3 || rd.blueTech2 || rd.blueTech1 ||
            rd.redTech3 || rd.redTech2 || rd.redTech1 ||
            rd.blueKyongo || rd.redKyongo ||
            rd.blueDirectGanchom || rd.redDirectGanchom ||
            (rd.log && rd.log.length));
    };

    const roundKeys = Object.keys(rounds)
        .map(Number)
        .filter(n => !isNaN(n) && isRoundFought(rounds[n]))
        .sort((a, b) => a - b);

    let totalOwn = 0, totalOpp = 0, tech3 = 0, tech2 = 0, tech1 = 0;
    let kyongo = 0, ganchomDirect = 0;
    let roundsWon = 0, roundsLost = 0, roundsTied = 0;
    const ownPerRound = [], oppPerRound = [];

    roundKeys.forEach(n => {
        const rd = rounds[n];
        const own = rd.blueScore || 0;
        const opp = rd.redScore || 0;
        totalOwn += own;
        totalOpp += opp;
        tech3 += rd.blueTech3 || 0;
        tech2 += rd.blueTech2 || 0;
        tech1 += rd.blueTech1 || 0;
        kyongo += rd.blueKyongo || 0;
        ganchomDirect += rd.blueDirectGanchom || 0;
        if (own > opp) roundsWon++;
        else if (own < opp) roundsLost++;
        else roundsTied++;
        ownPerRound.push(own);
        oppPerRound.push(opp);
    });

    const effFouls = ganchomDirect + Math.floor(kyongo / 2);
    const margin = totalOwn - totalOpp;
    const isWin = cd.winner === 'blue';
    const tech3Share = totalOwn > 0 ? tech3 / totalOwn : 0;
    const tech2Share = totalOwn > 0 ? tech2 / totalOwn : 0;
    const tech1Share = totalOwn > 0 ? tech1 / totalOwn : 0;

    // Fatigue curve: R2 vs R1 production
    let fatigue = { delta: null, pct: null, label: 'Sin datos suficientes (1 round)', cls: 'neutral' };
    if (ownPerRound.length >= 2) {
        const r1 = ownPerRound[0];
        const r2 = ownPerRound[1];
        const delta = r2 - r1;
        const pct = r1 > 0 ? (delta / r1) * 100 : (r2 > 0 ? 100 : 0);
        fatigue.delta = delta;
        fatigue.pct = pct;
        if (pct <= -35) {
            fatigue.label = 'Caída marcada de rendimiento en R2';
            fatigue.cls = 'danger';
        } else if (pct <= -15) {
            fatigue.label = 'Descenso leve de rendimiento en R2';
            fatigue.cls = 'warning';
        } else if (pct >= 15) {
            fatigue.label = 'Mejora en R2 (arranque lento, buen cierre)';
            fatigue.cls = 'success';
        } else {
            fatigue.label = 'Rendimiento estable entre rounds';
            fatigue.cls = 'success';
        }
    }

    // Discipline
    let discipline;
    if (effFouls >= 4) {
        discipline = { label: 'Riesgo alto de descalificación (4+ gamchoms efectivos)', cls: 'danger' };
    } else if (effFouls >= 2) {
        discipline = { label: 'Faltas moderadas: conviene controlar la agresividad', cls: 'warning' };
    } else {
        discipline = { label: 'Disciplina excelente (≤1 falta efectiva)', cls: 'success' };
    }

    const styleStats = { totalOwn, totalOpp, margin, tech3Share, tech2Share, tech1Share, effFouls, roundsWon, roundsLost, roundsTied };
    const style = this.classifyFightStyle(styleStats);

    // Strengths
    const strengths = [];
    if (margin > 0) strengths.push(`Controló el marcador (+${margin} pts; ${totalOwn} a ${totalOpp}).`);
    if (roundsWon >= 2) strengths.push(`Ganó la mayoría de los rounds (${roundsWon} de ${roundKeys.length}).`);
    if (tech3Share >= 0.3 && totalOwn > 0) strengths.push(`Alta producción de técnicas de 3 pts (${Math.round(tech3Share * 100)}% de sus puntos).`);
    if (effFouls <= 1) strengths.push(`Disciplina ejemplar (${effFouls} falta(s) efectiva(s)).`);
    if (ownPerRound.length >= 2 && ownPerRound[1] > ownPerRound[0]) strengths.push('Mejoró su producción en el segundo round.');

    // Weaknesses
    const weaknesses = [];
    if (margin < 0) weaknesses.push(`Perdió el marcador (${totalOwn} a ${totalOpp}; ${margin} pts).`);
    if (fatigue.cls === 'danger') weaknesses.push(`Caída de producción en R2 (${Math.round(fatigue.pct)}%).`);
    if (effFouls >= 3) weaknesses.push(`Alta acumulación de faltas (${effFouls} efectivas; restan puntos al rival).`);
    if (tech3Share < 0.1 && totalOwn > 0) weaknesses.push('Pocas técnicas de alto puntaje: techo de puntuación limitado.');
    if (roundsLost >= 1 && ownPerRound.length >= 2 && ownPerRound[1] < oppPerRound[1]) weaknesses.push('El rival le ganó el segundo round: riesgo de fatiga o pérdida de enfoque.');

    // Recommendations (deterministic rule → suggestion)
    const recommendations = [];
    if (fatigue.cls === 'danger') recommendations.push('Trabajar recuperación entre rounds: intervalos 2-2 min con reactivación rápida de guardia.');
    if (effFouls >= 3) recommendations.push('Reducir faltas: mantener distancia legal y evitar clinch prolongado sin intención de ataque.');
    if (tech3Share >= 0.35 && isWin) recommendations.push('Mantener el arsenal de técnicas de alto puntaje (giros, barridos dobles, proyecciones): es su ventaja competitiva.');
    if (tech3Share < 0.1 && totalOwn >= 4) recommendations.push('Incorporar al menos una técnica de 2-3 puntos por round para elevar el techo de puntuación.');
    if (roundsLost >= 1 && ownPerRound.length >= 2 && ownPerRound[1] < oppPerRound[1]) recommendations.push('Cerrar mejor el segundo round: ritmo alto desde el inicio del round y seguir las indicaciones de la esquina.');
    if (margin <= -5) recommendations.push('Revisar la estrategia defensiva: el rival controló la distancia y el intercambio.');

    return {
        date: record.date,
        opponentName: cd.opponentName || 'Sin nombre',
        stage: cd.stage || '',
        winner: cd.winner,
        winReason: cd.winReason || '',
        isWin,
        totalOwn, totalOpp, margin,
        roundsWon, roundsLost, roundsTied,
        roundsFought: roundKeys.length,
        tech3Share, tech2Share, tech1Share,
        kyongo, ganchomDirect, effFouls,
        ownPerRound, oppPerRound,
        fatigue, discipline, style,
        strengths, weaknesses, recommendations
    };
};

/**
 * Aggregate combat form for an athlete (optionally timeframe-filtered).
 */
HapkidoApp.prototype.analyzeAthleteCombatForm = function(athleteId, timeframe = 'all') {
    let records = this.data.records
        .filter(r => r.athleteId === athleteId && r.type === 'COMBATE')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (timeframe === '3m') {
        const cut = new Date(); cut.setMonth(cut.getMonth() - 3);
        records = records.filter(r => new Date(r.date) >= cut);
    } else if (timeframe === '6m') {
        const cut = new Date(); cut.setMonth(cut.getMonth() - 6);
        records = records.filter(r => new Date(r.date) >= cut);
    } else if (timeframe === '1y') {
        const cut = new Date(); cut.setFullYear(cut.getFullYear() - 1);
        records = records.filter(r => new Date(r.date) >= cut);
    }

    const analyses = records.map(r => this.analyzeCombatRecord(r)).filter(Boolean);
    if (analyses.length === 0) return null;

    const n = analyses.length;
    const wins = analyses.filter(a => a.isWin).length;
    const losses = n - wins;
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const avgOwn = avg(analyses.map(a => a.totalOwn));
    const avgOpp = avg(analyses.map(a => a.totalOpp));
    const avgMargin = avg(analyses.map(a => a.margin));
    const avgTech3Share = avg(analyses.map(a => a.tech3Share));
    const avgFouls = avg(analyses.map(a => a.effFouls));

    // Form trend from last up-to-3 margins
    const lastMargins = analyses.slice(-3).map(a => a.margin);
    let formTrend = { label: 'Sin tendencia clara', cls: 'neutral' };
    if (lastMargins.length >= 2) {
        const first = lastMargins[0];
        const last = lastMargins[lastMargins.length - 1];
        if (last - first >= 4) formTrend = { label: 'En ascenso', cls: 'success' };
        else if (first - last >= 4) formTrend = { label: 'En descenso', cls: 'danger' };
        else formTrend = { label: 'Irregular / estable', cls: 'warning' };
    }

    // Dominant style (mode)
    const styleCounts = {};
    analyses.forEach(a => {
        styleCounts[a.style.style] = (styleCounts[a.style.style] || 0) + 1;
    });
    const dominantStyleName = Object.keys(styleCounts).sort((a, b) => styleCounts[b] - styleCounts[a])[0];
    const dominantStyle = analyses.slice().reverse().find(a => a.style.style === dominantStyleName).style;

    // Aggregate strengths/weaknesses/recommendations (keep items present in ≥40% of combats)
    const collect = (key, minRatio) => {
        const counts = {};
        analyses.forEach(a => (a[key] || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
        const min = Math.max(1, Math.ceil(n * minRatio));
        return Object.keys(counts).filter(t => counts[t] >= min).sort((a, b) => counts[b] - counts[a]).slice(0, 4);
    };
    const strengths = collect('strengths', 0.4);
    const weaknesses = collect('weaknesses', 0.4);
    const recommendations = collect('recommendations', 0.34);

    // Physical cross-reference (latest FISICA record)
    const physRecords = this.data.records
        .filter(r => r.athleteId === athleteId && r.type === 'FISICA')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const physNotes = [];
    if (physRecords.length > 0) {
        const pd = physRecords[0].physicalDetails || {};
        if (pd.ruffierIndex != null) {
            if (pd.ruffierIndex <= 5) physNotes.push(`Recuperación cardiovascular buena (Ruffier ${pd.ruffierIndex.toFixed(1)}): soporta ritmo alto sostenido.`);
            else if (pd.ruffierIndex <= 10) physNotes.push(`Recuperación cardiovascular media (Ruffier ${pd.ruffierIndex.toFixed(1)}): priorizar intervalos de recuperación en el plan.`);
            else physNotes.push(`Recuperación cardiovascular deficiente (Ruffier ${pd.ruffierIndex.toFixed(1)}): trabajar base aeróbica antes de exigir alta intensidad.`);
        }
        if (pd.kickSpeed != null && pd.evalResults && pd.evalResults.kickSpeed) {
            const lvl = pd.evalResults.kickSpeed.level || '';
            if (/Excelente|Bueno/i.test(lvl)) physNotes.push(`Cadencia de patada (${pd.kickSpeed} reps/10s, ${lvl}): soporta combina de patadas.`);
            else if (/Deficiente|Bajo/i.test(lvl)) physNotes.push(`Cadencia de patada baja (${pd.kickSpeed} reps/10s, ${lvl}): limita el volumen de ataque con patadas.`);
        }
        if (pd.anaerobic != null && pd.evalResults && pd.evalResults.anaerobic) {
            const lvl = pd.evalResults.anaerobic.level || '';
            if (/Deficiente|Bajo/i.test(lvl)) physNotes.push(`Ráfaga 30s ${lvl}: posible origen de la caída de producción en rounds finales.`);
        }
    }

    return {
        count: n,
        wins, losses,
        avgOwn, avgOpp, avgMargin, avgTech3Share, avgFouls,
        formTrend,
        dominantStyle,
        dominantStyleCount: styleCounts[dominantStyleName],
        strengths, weaknesses, recommendations,
        physNotes,
        analyses
    };
};

/**
 * Orientativa prediction index blending subjective profile + recent form.
 * Explicitly a heuristic aid, never a guarantee.
 */
HapkidoApp.prototype.getCombatPrediction = function(athlete, formSummary) {
    const clamp = v => Math.max(1, Math.min(10, v));
    const profIdx = this.getCombatProfileIndex(athlete);
    const factors = [];
    let score = null;

    if (profIdx != null && formSummary) {
        const formScore = clamp(5 + formSummary.avgMargin);
        score = profIdx * 0.5 + formScore * 0.5;
        factors.push(`Perfil subjetivo del entrenador: ${profIdx.toFixed(1)}/10.`);
        factors.push(`Forma reciente (margen promedio ${formSummary.avgMargin >= 0 ? '+' : ''}${formSummary.avgMargin.toFixed(1)} pts en ${formSummary.count} combate(s)).`);
    } else if (profIdx != null) {
        score = profIdx;
        factors.push('Solo evaluación subjetiva del entrenador (sin combates oficiales recientes).');
    } else if (formSummary && formSummary.count >= 2) {
        score = clamp(5 + formSummary.avgMargin);
        factors.push(`Solo forma oficial reciente (${formSummary.count} combates; sin perfil subjetivo).`);
    } else {
        return null;
    }

    let label, cls;
    if (score >= 7.5) { label = 'Favorito claro'; cls = 'success'; }
    else if (score >= 6) { label = 'Favorito leve'; cls = 'success'; }
    else if (score >= 4.5) { label = 'Paridad'; cls = 'warning'; }
    else if (score >= 3) { label = 'Desventaja leve'; cls = 'warning'; }
    else { label = 'En desventaja'; cls = 'danger'; }

    return {
        score: Math.round(score * 10) / 10,
        label, cls, factors,
        disclaimer: 'Estimación orientativa basada en evaluación subjetiva + forma reciente. No sustituye el análisis del entrenador ni garantiza resultados.'
    };
};

/**
 * Combat Profile Modal (instructor/admin only)
 */
HapkidoApp.prototype.openCombatProfileModal = function(athleteId) {
    if (!this.currentUser || (this.currentUser.role !== 'instructor' && this.currentUser.role !== 'admin')) {
        this.showToast('Solo el entrenador o administrador pueden evaluar el perfil de combate.', 'error');
        return;
    }
    const athlete = this.data.athletes.find(a => a.id === athleteId);
    if (!athlete) return;

    const modal = document.getElementById('combat-profile-modal');
    if (!modal) return;

    document.getElementById('cp-athlete-id').value = athlete.id;
    document.getElementById('cp-athlete-display').innerHTML =
        `<strong>${this.escapeHTML(athlete.name)}</strong> · Cinta: ${this.escapeHTML(athlete.belt)} · ${this.escapeHTML(this.calculateAgeCategory(athlete.birthdate))}`;

    const cp = athlete.combatProfile || {};
    const scores = cp.scores || {};
    const metricsContainer = document.getElementById('combat-profile-metrics');
    metricsContainer.innerHTML = COMBAT_PROFILE_CATALOG.map(m => {
        const val = typeof scores[m.id] === 'number' ? scores[m.id] : 5;
        return `
            <div class="cp-metric">
                <div class="cp-metric-head">
                    <label for="cp-score-${m.id}">${this.escapeHTML(m.label)}</label>
                    <span class="cp-metric-value" id="cp-val-${m.id}">${val}</span>
                </div>
                <input type="range" id="cp-score-${m.id}" class="cp-range" min="1" max="10" step="1" value="${val}">
                <small class="cp-rubric">${this.escapeHTML(m.rubric)}</small>
            </div>
        `;
    }).join('');

    COMBAT_PROFILE_CATALOG.forEach(m => {
        const range = document.getElementById('cp-score-' + m.id);
        const valEl = document.getElementById('cp-val-' + m.id);
        if (range) {
            range.oninput = () => { valEl.textContent = range.value; };
        }
    });

    document.getElementById('cp-notes').value = cp.notes || '';

    const btnSave = document.getElementById('btn-save-combat-profile');
    const btnCancel = document.getElementById('btn-cancel-combat-profile');
    const btnClose = document.getElementById('close-combat-profile-modal');
    btnSave.onclick = () => this.saveCombatProfile();
    btnCancel.onclick = () => this.closeCombatProfileModal();
    btnClose.onclick = () => this.closeCombatProfileModal();

    modal.classList.add('active');
};

HapkidoApp.prototype.saveCombatProfile = function() {
    if (!this.currentUser || (this.currentUser.role !== 'instructor' && this.currentUser.role !== 'admin')) {
        this.showToast('Permiso denegado para guardar el perfil de combate.', 'error');
        return;
    }
    const athleteId = document.getElementById('cp-athlete-id').value;
    const athlete = this.data.athletes.find(a => a.id === athleteId);
    if (!athlete) return;

    const scores = {};
    COMBAT_PROFILE_CATALOG.forEach(m => {
        const el = document.getElementById('cp-score-' + m.id);
        const v = el ? parseInt(el.value, 10) : 5;
        scores[m.id] = Math.max(1, Math.min(10, isNaN(v) ? 5 : v));
    });

    athlete.combatProfile = {
        scores,
        notes: document.getElementById('cp-notes').value.trim(),
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: this.currentUser.name || this.currentUser.username || ''
    };

    this.saveData();
    this.closeCombatProfileModal();
    this.showToast(`Perfil de combate de ${athlete.name} guardado.`, 'success');

    // Refresh analysis panel if this athlete is currently selected
    const histSelect = document.getElementById('analysis-athlete-select');
    if (histSelect && histSelect.value === athleteId) {
        this.renderCombatAnalysisPanel(athleteId, this._lastHistTimeframe || 'all');
    }
};

HapkidoApp.prototype.closeCombatProfileModal = function() {
    const modal = document.getElementById('combat-profile-modal');
    if (modal) modal.classList.remove('active');
};

/**
 * Render the deterministic combat analysis panel in #section-historial.
 */
HapkidoApp.prototype.renderCombatAnalysisPanel = function(athleteId, timeframe = 'all') {
    const container = document.getElementById('athlete-combat-analysis-content');
    if (!container) return;

    const athlete = this.data.athletes.find(a => a.id === athleteId);
    if (!athlete) {
        container.innerHTML = '';
        return;
    }

    const form = this.analyzeAthleteCombatForm(athleteId, timeframe);
    const profile = athlete.combatProfile || null;
    const profIdx = this.getCombatProfileIndex(athlete);
    const profLabel = this.getCombatProfileLabel(profIdx);
    const prediction = this.getCombatPrediction(athlete, form);

    if (!form && !profile) {
        container.innerHTML = `
            <div class="empty-list">
                <i class="fa-solid fa-people-martial-arts" style="font-size: 24px; margin-bottom: 8px; color: var(--accent);"></i>
                <p>Sin datos de combate ni perfil de combate registrado para este atleta.</p>
                <p style="font-size: 12px; color: var(--text-muted);">Registra combates en la sección <strong>Combate</strong> o evalúa el perfil subjetivo desde el listado de atletas (entrenador).</p>
            </div>
        `;
        return;
    }

    let html = '';

    // Subjective combat profile block
    if (profile && profile.scores) {
        const bars = COMBAT_PROFILE_CATALOG.map(m => {
            const v = typeof profile.scores[m.id] === 'number' ? profile.scores[m.id] : 0;
            const barColor = v >= 7 ? 'var(--success, #22c55e)' : (v >= 4 ? 'var(--warning, #f59e0b)' : 'var(--text-muted)');
            return `
                <div class="cp-bar-row">
                    <span>${this.escapeHTML(m.label)}</span>
                    <div class="cp-bar-track"><div class="cp-bar-fill" style="width: ${v * 10}%; background: ${barColor};"></div></div>
                    <strong>${v}/10</strong>
                </div>
            `;
        }).join('');

        html += `
            <div class="ca-card ca-full" style="margin-bottom: 14px;">
                <h4><i class="fa-solid fa-clipboard-user"></i> Perfil de Combate (evaluación del entrenador)</h4>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                    <span class="badge ${profLabel.cls}">Índice: ${profIdx.toFixed(1)}/10 — ${profLabel.label}</span>
                    ${profile.updatedAt ? `<small style="color: var(--text-muted);">Actualizado: ${this.escapeHTML(profile.updatedAt)}${profile.updatedBy ? ' por ' + this.escapeHTML(profile.updatedBy) : ''}</small>` : ''}
                </div>
                ${bars}
                ${profile.notes ? `<p style="margin-top: 10px; font-size: 13px;"><em>Observaciones: ${this.escapeHTML(profile.notes)}</em></p>` : ''}
            </div>
        `;
    }

    if (form) {
        // Summary chips
        html += `
            <div class="ca-summary-row">
                <div class="ca-chip"><span>Combates</span><strong>${form.count}</strong></div>
                <div class="ca-chip"><span>Récord (V-D)</span><strong>${form.wins}-${form.losses}</strong></div>
                <div class="ca-chip"><span>Margen prom.</span><strong>${form.avgMargin >= 0 ? '+' : ''}${form.avgMargin.toFixed(1)} pts</strong></div>
                <div class="ca-chip"><span>Pts prom. (F-C)</span><strong>${form.avgOwn.toFixed(1)} - ${form.avgOpp.toFixed(1)}</strong></div>
                <div class="ca-chip"><span>Faltas prom.</span><strong>${form.avgFouls.toFixed(1)}</strong></div>
                <div class="ca-chip"><span>Tendencia</span><strong class="ca-trend-${form.formTrend.cls}">${form.formTrend.label}</strong></div>
            </div>
        `;

        // Style card
        html += `
            <div class="ca-grid">
                <div class="ca-card">
                    <h4><i class="fa-solid fa-shield-halved"></i> Estilo de pelea</h4>
                    <p style="margin: 0 0 8px;"><span class="badge ${form.dominantStyle.cls}">${this.escapeHTML(form.dominantStyle.style)}</span>
                    <small style="color: var(--text-muted);">(${form.dominantStyleCount} de ${form.count} combates)</small></p>
                    <ul>${form.dominantStyle.evidence.map(e => `<li>${this.escapeHTML(e)}</li>`).join('')}</ul>
                </div>
                <div class="ca-card">
                    <h4><i class="fa-solid fa-battery-half"></i> Curva de fatiga</h4>
                    <p style="margin: 0;"><span class="badge ${form.analyses[form.analyses.length - 1].fatigue.cls}">${this.escapeHTML(form.analyses[form.analyses.length - 1].fatigue.label)}</span></p>
                    <ul>${form.analyses.slice(-3).map(a => `<li>${this.escapeHTML(a.date)} vs ${this.escapeHTML(a.opponentName)}: R1 ${a.ownPerRound[0] != null ? a.ownPerRound[0] : '--'} pts → R2 ${a.ownPerRound[1] != null ? a.ownPerRound[1] : '--'} pts</li>`).join('') || '<li>Sin datos por round.</li>'}</ul>
                </div>
                <div class="ca-card">
                    <h4><i class="fa-solid fa-scale-balanced"></i> Disciplina</h4>
                    <p style="margin: 0 0 8px;"><span class="badge warning">${form.avgFouls.toFixed(1)} faltas efectivas prom.</span></p>
                    <ul>${form.analyses.slice(-3).map(a => `<li>${this.escapeHTML(a.date)}: ${a.effFouls} efectiva(s) (${a.kyongo} kyongo, ${a.ganchomDirect} gamchom directo)</li>`).join('')}</ul>
                </div>
                <div class="ca-card">
                    <h4 style="color: var(--success, #22c55e);"><i class="fa-solid fa-circle-check"></i> Fortalezas</h4>
                    <ul>${form.strengths.length ? form.strengths.map(t => `<li>${this.escapeHTML(t)}</li>`).join('') : '<li style="color: var(--text-muted);">Sin fortalezas recurrentes aún.</li>'}</ul>
                </div>
                <div class="ca-card">
                    <h4 style="color: var(--warning, #f59e0b);"><i class="fa-solid fa-triangle-exclamation"></i> Debilidades</h4>
                    <ul>${form.weaknesses.length ? form.weaknesses.map(t => `<li>${this.escapeHTML(t)}</li>`).join('') : '<li style="color: var(--text-muted);">Sin debilidades recurrentes detectadas.</li>'}</ul>
                </div>
                ${form.physNotes.length ? `
                <div class="ca-card">
                    <h4><i class="fa-solid fa-heart-pulse"></i> Cruce físico</h4>
                    <ul>${form.physNotes.map(t => `<li>${this.escapeHTML(t)}</li>`).join('')}</ul>
                </div>` : ''}
                <div class="ca-card ca-full">
                    <h4><i class="fa-solid fa-list-check"></i> Recomendaciones (motor de reglas)</h4>
                    <ul>${form.recommendations.length ? form.recommendations.map(t => `<li>${this.escapeHTML(t)}</li>`).join('') : '<li style="color: var(--text-muted);">Sin recomendaciones automáticas: los combates registrados no activaron reglas de mejora.</li>'}</ul>
                </div>
            </div>
        `;
    }

    if (prediction) {
        html += `
            <div class="ca-card ca-prediction" style="margin-top: 14px;">
                <h4><i class="fa-solid fa-dice"></i> Predicción orientativa</h4>
                <p style="margin: 0 0 8px;"><span class="badge ${prediction.cls}">Índice ${prediction.score}/10 — ${this.escapeHTML(prediction.label)}</span></p>
                <ul>${prediction.factors.map(f => `<li>${this.escapeHTML(f)}</li>`).join('')}</ul>
                <small style="color: var(--text-muted);"><i class="fa-solid fa-circle-info"></i> ${this.escapeHTML(prediction.disclaimer)}</small>
            </div>
        `;
    }

    html += `
        <p style="margin-top: 12px; font-size: 11.5px; color: var(--text-muted);">
            <i class="fa-solid fa-gears"></i> Motor determinista: todas las conclusiones provienen de reglas transparentes sobre los datos del marcador y la ficha física.
            Combates registrados sin desglose de técnicas (tech1/2/3) degradan el análisis de riesgo de puntuación.
        </p>
    `;

    container.innerHTML = html;
};
