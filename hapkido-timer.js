console.log('Module: hapkido-timer.js loaded');
/**
 * Module: hapkido-timer.js
 * Temporizador Marcial de Tatami & Entrenamiento (FEVEHAPKIDO)
 * Modos: Combate Oficial, Tabata/HIIT, EMOM, Cronómetro Progresivo.
 * Sonidos 100% sintetizados con Web Audio API y comandos vocales en coreano con Web Speech API.
 */

HapkidoApp.prototype.initTatamiTimer = function() {
    if (this.tatamiTimerInitialized) return;
    this.tatamiTimerInitialized = true;

    this.timerState = {
        mode: 'combat',
        status: 'IDLE',
        workSeconds: 120,
        restSeconds: 30,
        totalRounds: 2,
        currentRound: 1,
        remainingSeconds: 120,
        intervalId: null,
        soundEnabled: true,
        voiceEnabled: true,
        isFullScreen: false,
        stopwatchSeconds: 0
    };

    this.updateTimerUI();
};

HapkidoApp.prototype.setTimerMode = function(mode) {
    if (!this.timerState) this.initTatamiTimer();
    this.pauseTatamiTimer();
    this.timerState.mode = mode;
    this.timerState.status = 'IDLE';
    this.timerState.currentRound = 1;
    this.timerState.stopwatchSeconds = 0;

    if (mode === 'combat') {
        this.timerState.workSeconds = parseInt(document.getElementById('timer-combat-work')?.value, 10) || 120;
        this.timerState.restSeconds = parseInt(document.getElementById('timer-combat-rest')?.value, 10) || 30;
        this.timerState.totalRounds = parseInt(document.getElementById('timer-combat-rounds')?.value, 10) || 2;
        this.timerState.remainingSeconds = this.timerState.workSeconds;
    } else if (mode === 'tabata') {
        this.timerState.workSeconds = 20;
        this.timerState.restSeconds = 10;
        this.timerState.totalRounds = 8;
        this.timerState.remainingSeconds = 20;
    } else if (mode === 'emom') {
        this.timerState.workSeconds = 60;
        this.timerState.restSeconds = 0;
        this.timerState.totalRounds = parseInt(document.getElementById('timer-emom-minutes')?.value, 10) || 10;
        this.timerState.remainingSeconds = 60;
    } else if (mode === 'stopwatch') {
        this.timerState.remainingSeconds = 0;
        this.timerState.stopwatchSeconds = 0;
    }

    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    const panelCombat = document.getElementById('timer-config-combat');
    const panelTabata = document.getElementById('timer-config-tabata');
    const panelEmom = document.getElementById('timer-config-emom');
    if (panelCombat) panelCombat.style.display = (mode === 'combat') ? 'flex' : 'none';
    if (panelTabata) panelTabata.style.display = (mode === 'tabata') ? 'flex' : 'none';
    if (panelEmom) panelEmom.style.display = (mode === 'emom') ? 'flex' : 'none';

    this.updateTimerUI();
};

HapkidoApp.prototype.applyTimerCustomSettings = function() {
    if (!this.timerState) this.initTatamiTimer();
    if (this.timerState.status === 'RUNNING') return;

    if (this.timerState.mode === 'combat') {
        this.timerState.workSeconds = parseInt(document.getElementById('timer-combat-work')?.value, 10) || 120;
        this.timerState.restSeconds = parseInt(document.getElementById('timer-combat-rest')?.value, 10) || 30;
        this.timerState.totalRounds = parseInt(document.getElementById('timer-combat-rounds')?.value, 10) || 2;
        this.timerState.remainingSeconds = this.timerState.workSeconds;
    } else if (this.timerState.mode === 'tabata') {
        this.timerState.workSeconds = parseInt(document.getElementById('timer-tabata-work')?.value, 10) || 20;
        this.timerState.restSeconds = parseInt(document.getElementById('timer-tabata-rest')?.value, 10) || 10;
        this.timerState.totalRounds = parseInt(document.getElementById('timer-tabata-cycles')?.value, 10) || 8;
        this.timerState.remainingSeconds = this.timerState.workSeconds;
    } else if (this.timerState.mode === 'emom') {
        this.timerState.workSeconds = 60;
        this.timerState.restSeconds = 0;
        this.timerState.totalRounds = parseInt(document.getElementById('timer-emom-minutes')?.value, 10) || 10;
        this.timerState.remainingSeconds = 60;
    }

    this.timerState.currentRound = 1;
    this.updateTimerUI();
};

HapkidoApp.prototype.toggleTatamiTimer = function() {
    if (!this.timerState) this.initTatamiTimer();
    if (this.timerState.status === 'RUNNING' || this.timerState.status === 'RESTING') {
        this.pauseTatamiTimer();
    } else {
        this.startTatamiTimer();
    }
};

HapkidoApp.prototype.startTatamiTimer = function() {
    if (!this.timerState) this.initTatamiTimer();
    if (this.timerState.intervalId) clearInterval(this.timerState.intervalId);

    const isResume = (this.timerState.status === 'PAUSED');

    if (!isResume && this.timerState.status === 'IDLE') {
        this.playBellSound();
        this.speakKoreanCommand('Sichak', 'Comiencen');
    }

    if (this.timerState.status !== 'RESTING') {
        this.timerState.status = 'RUNNING';
    }

    this.timerState.intervalId = setInterval(() => {
        this.tickTatamiTimer();
    }, 1000);

    this.updateTimerUI();
};

HapkidoApp.prototype.pauseTatamiTimer = function() {
    if (!this.timerState) this.initTatamiTimer();
    if (this.timerState.intervalId) {
        clearInterval(this.timerState.intervalId);
        this.timerState.intervalId = null;
    }

    if (this.timerState.status === 'RUNNING' || this.timerState.status === 'RESTING') {
        this.timerState.status = 'PAUSED';
        this.speakKoreanCommand('Kalyo', 'Tiempo');
    }

    this.updateTimerUI();
};

HapkidoApp.prototype.resetTatamiTimer = function() {
    if (!this.timerState) this.initTatamiTimer();
    this.pauseTatamiTimer();
    this.timerState.status = 'IDLE';
    this.timerState.currentRound = 1;
    this.timerState.stopwatchSeconds = 0;
    this.timerState.remainingSeconds = this.timerState.workSeconds;
    this.updateTimerUI();
};

HapkidoApp.prototype.skipToNextTimerPhase = function() {
    if (!this.timerState) this.initTatamiTimer();
    this.pauseTatamiTimer();

    if (this.timerState.status === 'RESTING') {
        this.timerState.currentRound++;
        this.timerState.remainingSeconds = this.timerState.workSeconds;
        this.timerState.status = 'IDLE';
    } else {
        if (this.timerState.currentRound < this.timerState.totalRounds) {
            if (this.timerState.restSeconds > 0) {
                this.timerState.status = 'RESTING';
                this.timerState.remainingSeconds = this.timerState.restSeconds;
                this.speakKoreanCommand('Hyusik', 'Descanso');
            } else {
                this.timerState.currentRound++;
                this.timerState.remainingSeconds = this.timerState.workSeconds;
                this.timerState.status = 'IDLE';
            }
        } else {
            this.timerState.status = 'FINISHED';
            this.playBellSound();
            this.speakKoreanCommand('Kuman', 'Finalizado');
        }
    }

    this.updateTimerUI();
};

HapkidoApp.prototype.tickTatamiTimer = function() {
    if (this.timerState.mode === 'stopwatch') {
        this.timerState.stopwatchSeconds++;
        this.updateTimerUI();
        return;
    }

    if (this.timerState.remainingSeconds > 0) {
        this.timerState.remainingSeconds--;

        if (this.timerState.status === 'RUNNING' && this.timerState.remainingSeconds === 10) {
            this.playWarningWoodSound();
        }

        if (this.timerState.remainingSeconds >= 1 && this.timerState.remainingSeconds <= 3) {
            this.playShortBeepSound();
        }

        this.updateTimerUI();
    } else {
        if (this.timerState.status === 'RUNNING') {
            this.playBellSound();

            if (this.timerState.currentRound < this.timerState.totalRounds) {
                if (this.timerState.restSeconds > 0) {
                    this.timerState.status = 'RESTING';
                    this.timerState.remainingSeconds = this.timerState.restSeconds;
                    this.speakKoreanCommand('Hyusik', 'Descanso');
                } else {
                    this.timerState.currentRound++;
                    this.timerState.remainingSeconds = this.timerState.workSeconds;
                    this.speakKoreanCommand('Sichak', 'Comiencen');
                }
            } else {
                this.timerState.status = 'FINISHED';
                if (this.timerState.intervalId) clearInterval(this.timerState.intervalId);
                this.timerState.intervalId = null;
                this.speakKoreanCommand('Kuman', 'Finalizado');
            }
        } else if (this.timerState.status === 'RESTING') {
            this.playBellSound();
            this.timerState.currentRound++;
            this.timerState.status = 'RUNNING';
            this.timerState.remainingSeconds = this.timerState.workSeconds;
            this.speakKoreanCommand('Sichak', 'Comiencen');
        }

        this.updateTimerUI();
    }
};

HapkidoApp.prototype.updateTimerUI = function() {
    const displayEl = document.getElementById('tatami-timer-digits');
    const statusBadgeEl = document.getElementById('tatami-phase-badge');
    const roundBadgeEl = document.getElementById('tatami-round-badge');
    const koreanSubtitleEl = document.getElementById('tatami-korean-subtitle');
    const toggleBtnEl = document.getElementById('btn-timer-toggle');
    const screenEl = document.getElementById('tatami-timer-screen');

    if (!displayEl || !statusBadgeEl) return;

    const secs = (this.timerState.mode === 'stopwatch') ? this.timerState.stopwatchSeconds : this.timerState.remainingSeconds;
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
    displayEl.textContent = timeStr;

    if (screenEl) {
        screenEl.className = 'tatami-timer-screen';
        if (this.timerState.status === 'RUNNING') {
            if (this.timerState.remainingSeconds <= 10) screenEl.classList.add('state-warning');
            else screenEl.classList.add('state-work');
        } else if (this.timerState.status === 'RESTING') {
            screenEl.classList.add('state-rest');
        } else if (this.timerState.status === 'PAUSED') {
            screenEl.classList.add('state-paused');
        } else if (this.timerState.status === 'FINISHED') {
            screenEl.classList.add('state-finished');
        }
    }

    let phaseText = "LISTO (JUNBI)";
    let phaseClass = "badge-idle";
    let koreanSub = "준비 (Junbi) - ¡En Guardia!";

    if (this.timerState.status === 'RUNNING') {
        phaseText = (this.timerState.remainingSeconds <= 10) ? "¡10 SEGUNDOS!" : "COMBATE (SICHAK)";
        phaseClass = (this.timerState.remainingSeconds <= 10) ? "badge-warning" : "badge-work";
        koreanSub = "시작 (Sichak) - ¡Combate / Trabajo en Curso!";
    } else if (this.timerState.status === 'RESTING') {
        phaseText = "DESCANSO (HYUSIK)";
        phaseClass = "badge-rest";
        koreanSub = "휴식 (Hyusik) - Recuperación";
    } else if (this.timerState.status === 'PAUSED') {
        phaseText = "PAUSA (KALYO)";
        phaseClass = "badge-paused";
        koreanSub = "갈려 (Kalyo) - ¡Separarse / Pausa!";
    } else if (this.timerState.status === 'FINISHED') {
        phaseText = "FINALIZADO (KUMAN)";
        phaseClass = "badge-finished";
        koreanSub = "그만 (Kuman) - ¡Fin del Encuentro!";
    }

    statusBadgeEl.textContent = phaseText;
    statusBadgeEl.className = `tatami-badge ${phaseClass}`;
    if (koreanSubtitleEl) koreanSubtitleEl.textContent = koreanSub;

    if (roundBadgeEl) {
        if (this.timerState.mode === 'stopwatch') {
            roundBadgeEl.textContent = 'CRONÓMETRO LIBRE';
        } else if (this.timerState.mode === 'tabata') {
            roundBadgeEl.textContent = `CICLO ${this.timerState.currentRound} / ${this.timerState.totalRounds}`;
        } else {
            roundBadgeEl.textContent = `ROUND ${this.timerState.currentRound} / ${this.timerState.totalRounds}`;
        }
    }

    if (toggleBtnEl) {
        if (this.timerState.status === 'RUNNING' || this.timerState.status === 'RESTING') {
            toggleBtnEl.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar (Kalyo)';
            toggleBtnEl.className = 'timer-action-btn btn-pause';
        } else {
            toggleBtnEl.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar (Sichak)';
            toggleBtnEl.className = 'timer-action-btn btn-start';
        }
    }
};

HapkidoApp.prototype.toggleTimerFullScreen = function() {
    const screen = document.getElementById('section-timer');
    if (!screen) return;

    if (!document.fullscreenElement) {
        if (screen.requestFullscreen) screen.requestFullscreen();
        else if (screen.webkitRequestFullscreen) screen.webkitRequestFullscreen();
        this.timerState.isFullScreen = true;
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        this.timerState.isFullScreen = false;
    }
};

HapkidoApp.prototype.playBellSound = function() {
    if (!this.timerState?.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const freqs = [440, 880, 1320, 1760];
        const gains = [0.5, 0.25, 0.12, 0.06];

        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);

            gain.gain.setValueAtTime(gains[idx], now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 2.3);
        });
    } catch (e) {
        console.warn('[Timer Audio] Bell sound synthesis failed:', e);
    }
};

HapkidoApp.prototype.playWarningWoodSound = function() {
    if (!this.timerState?.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        [0, 0.18].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(750, now + delay);
            osc.frequency.exponentialRampToValueAtTime(320, now + delay + 0.08);

            gain.gain.setValueAtTime(0.6, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.09);
        });
    } catch (e) {
        console.warn('[Timer Audio] Warning sound synthesis failed:', e);
    }
};

HapkidoApp.prototype.playShortBeepSound = function() {
    if (!this.timerState?.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    } catch (e) {}
};

HapkidoApp.prototype.speakKoreanCommand = function(koreanText, spanishMeaning) {
    if (!this.timerState?.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(koreanText);
        utter.rate = 1.0;
        utter.pitch = 1.0;
        utter.volume = 1.0;

        const voices = window.speechSynthesis.getVoices() || [];
        const koVoice = voices.find(v => v.lang.startsWith('ko'));
        if (koVoice) {
            utter.voice = koVoice;
            utter.lang = 'ko-KR';
            utter.text = koreanText;
        } else {
            utter.lang = 'es-ES';
            utter.text = `${koreanText}! ${spanishMeaning || ''}`;
        }

        window.speechSynthesis.speak(utter);
    } catch (e) {
        console.warn('[Timer Voice] Speech synthesis failed:', e);
    }
};