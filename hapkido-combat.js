console.log('Module: hapkido-combat.js loaded');
/**
 * Module: hapkido-combat.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.updateOpponentDropdown = function(selectedAthleteId) {
        const dropdownOpponent = document.getElementById('combate-opponent-select');
        if (!dropdownOpponent) return;

        dropdownOpponent.innerHTML = '<option value="">-- Seleccione un oponente --</option>';

        let athletes = this.data.athletes;
        if (this.currentUser && this.currentUser.role !== 'admin') {
            athletes = this.data.athletes.filter(a => a.school === this.currentUser.school);
        }

        athletes.filter(a => a.modalities && a.modalities.deportivo && a.id !== selectedAthleteId).forEach(ath => {
            const opt = document.createElement('option');
            opt.value = ath.id;
            opt.textContent = `${ath.name} (${this.calculateAgeCategory(ath.birthdate)})`;
            dropdownOpponent.appendChild(opt);
        });

        const dropdownExamen = document.getElementById('exam-athlete-select');
        if (dropdownExamen) {
            dropdownExamen.innerHTML = '<option value="">-- Seleccione un atleta --</option>';
            athletes.forEach(ath => {
                const opt = document.createElement('option');
                opt.value = ath.id;
                opt.textContent = `${ath.name} (Cinta: ${ath.belt})`;
                dropdownExamen.appendChild(opt);
            });
        }
    }


HapkidoApp.prototype.startCombatScoring = function() {
        const athleteId = document.getElementById('combate-athlete-select').value;
        const opponentId = document.getElementById('combate-opponent-select').value;
        const stage = document.getElementById('combate-stage').value;
        
        const athlete = this.data.athletes.find(a => a.id === athleteId);
        const opponent = this.data.athletes.find(a => a.id === opponentId);
        if (!athlete) return;

        const opponentName = opponent ? opponent.name : "OPONENTE ROJO";
        const ageCategory = this.calculateAgeCategory(athlete.birthdate);
        const isJunior = ageCategory.includes("Junior");
        
        // Define round duration according to FEVEHAPKIDO 2026 rules
        let durationMinutes = 2; // Default for Senior/Adult/Master eliminatorias is 2 mins
        if (isJunior) {
            durationMinutes = stage === "ELIMINATORIA" ? 1.5 : 2;
        } else {
            durationMinutes = stage === "ELIMINATORIA" ? 2 : 2.5;
        }

        this.activeCombat = {
            athleteId,
            opponentId,
            opponentName,
            stage,
            athleteName: athlete.name,
            ageCategory,
            weightDivision: this.getWeightDivision(athlete.birthdate, athlete.gender, athlete.weight),
            isJunior,
            maxRounds: stage === "FINAL" ? 2 : 2, // Default is 2 rounds, 3rd if tie
            currentRound: 1,
            roundDuration: durationMinutes * 60,
            roundsData: {
                1: { blueScore: 0, redScore: 0, blueKyongo: 0, blueGanchom: 0, redKyongo: 0, redGanchom: 0, log: [] },
                2: { blueScore: 0, redScore: 0, blueKyongo: 0, blueGanchom: 0, redKyongo: 0, redGanchom: 0, log: [] },
                3: { blueScore: 0, redScore: 0, blueKyongo: 0, blueGanchom: 0, redKyongo: 0, redGanchom: 0, log: [] }
            },
            winner: null,
            winReason: null
        };

        // UI Updates for scoreboard
        document.getElementById('score-category').textContent = `Categoría: ${ageCategory}`;
        document.getElementById('score-weight-div').textContent = `División: ${this.activeCombat.weightDivision}`;
        document.getElementById('score-blue-name').textContent = athlete.name.toUpperCase() + " (AZUL)";
        document.getElementById('score-red-name').textContent = opponentName.toUpperCase() + " (ROJO)";
        
        this.resetTimer();
        this.updateScoreboardUI();
        
        document.getElementById('scoreboard-container').classList.remove('hidden');
        document.querySelector('.combate-setup').classList.add('hidden');
        
        this.logCombatAction("INICIO", "Comienza el combate - Round 1");
    }


HapkidoApp.prototype.updateScoreboardUI = function() {
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        document.getElementById('score-round-title').textContent = `ROUND ${round}`;
        document.getElementById('score-blue-total').textContent = rData.blueScore;
        document.getElementById('score-red-total').textContent = rData.redScore;
        document.getElementById('score-blue-kyongo').textContent = rData.blueKyongo;
        document.getElementById('score-blue-ganchom').textContent = rData.blueGanchom;
        document.getElementById('score-red-kyongo').textContent = rData.redKyongo;
        document.getElementById('score-red-ganchom').textContent = rData.redGanchom;

        // Render log entries
        const logContainer = document.getElementById('combat-log-list');
        logContainer.innerHTML = '';
        if (rData.log.length === 0) {
            logContainer.innerHTML = '<div class="empty-list">No hay puntuaciones registradas en este round.</div>';
        } else {
            rData.log.slice().reverse().forEach(entry => {
                const div = document.createElement('div');
                div.className = 'log-entry';
                const sideClass = entry.side === 'blue' ? 'log-blue' : (entry.side === 'red' ? 'log-red' : '');
                
                div.innerHTML = `
                    <span class="log-time">${entry.time}</span>
                    <span class="${sideClass}">${entry.message}</span>
                `;
                logContainer.appendChild(div);
            });
        }

        // Enable/disable round buttons
        document.getElementById('btn-score-prev-round').disabled = round === 1;
        document.getElementById('btn-score-next-round').textContent = round === 3 ? "Finalizar" : "Siguiente Round";
    }


HapkidoApp.prototype.addScore = function(side, points, detail) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        if (side === 'blue') {
            rData.blueScore += points;
            this.logCombatAction("blue", `Punto +${points} (${detail})`);
        } else {
            rData.redScore += points;
            this.logCombatAction("red", `Punto +${points} (${detail})`);
        }

        this.updateScoreboardUI();
        this.checkCombatRules();
    }


HapkidoApp.prototype.addPenalty = function(side, type) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        if (side === 'blue') {
            if (type === 'kyongo') {
                rData.blueKyongo++;
                this.logCombatAction("blue", `Amonestación: Kyongo`);
                // 2 Kyongos = 1 Ganchom
                if (rData.blueKyongo % 2 === 0) {
                    rData.blueGanchom++;
                    rData.redScore += 1; // Penalty adds 1 point to opponent
                    this.logCombatAction("blue", `Dos Kyongos acumulados: Deducción Ganchom (+1 punto al rival)`);
                }
            } else {
                rData.blueGanchom++;
                rData.redScore += 1; // Ganchom adds 1 point to opponent
                this.logCombatAction("blue", `Deducción: Ganchom (+1 punto al rival)`);
            }
        } else {
            if (type === 'kyongo') {
                rData.redKyongo++;
                this.logCombatAction("red", `Amonestación: Kyongo`);
                if (rData.redKyongo % 2 === 0) {
                    rData.redGanchom++;
                    rData.blueScore += 1;
                    this.logCombatAction("red", `Dos Kyongos acumulados: Deducción Ganchom (+1 punto al rival)`);
                }
            } else {
                rData.redGanchom++;
                rData.blueScore += 1;
                this.logCombatAction("red", `Deducción: Ganchom (+1 punto al rival)`);
            }
        }

        this.updateScoreboardUI();
        this.checkCombatRules();
    }


HapkidoApp.prototype.logCombatAction = function(side, message) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const timeStr = this.formatTime(this.timerSeconds);
        
        this.activeCombat.roundsData[round].log.push({
            time: timeStr,
            side,
            message
        });
    }


HapkidoApp.prototype.checkCombatRules = function() {
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        // 1. Technical Superiority (Ley de doce - 12 points difference, Article 87)
        const diff = Math.abs(rData.blueScore - rData.redScore);
        if (diff >= 12) {
            this.pauseTimer();
            const winnerSide = rData.blueScore > rData.redScore ? "blue" : "red";
            const winnerName = winnerSide === "blue" ? this.activeCombat.athleteName : (this.activeCombat.opponentName || "OPONENTE ROJO");
            
            this.activeCombat.winner = winnerSide;
            this.activeCombat.winReason = "SUP_TECH";
            
            alert(`¡COMBATE FINALIZADO!\nGanador: ${winnerName}\nMotivo: Superioridad Técnica (Diferencia de 12 puntos, Art. 87)`);
            this.finishCombat();
            return;
        }

        // 2. Penalty Disqualification (Completing 4 Ganchoms, Article 105)
        if (rData.blueGanchom >= 4) {
            this.pauseTimer();
            this.activeCombat.winner = "red";
            this.activeCombat.winReason = "DISQ";
            alert(`¡COMBATE FINALIZADO!\nGanador: ${this.activeCombat.opponentName || "OPONENTE ROJO"}\nMotivo: Descalificación del atleta evaluado por acumular 4 Ganchoms (Art. 105)`);
            this.finishCombat();
            return;
        }

        if (rData.redGanchom >= 4) {
            this.pauseTimer();
            this.activeCombat.winner = "blue";
            this.activeCombat.winReason = "DISQ";
            alert(`¡COMBATE FINALIZADO!\nGanador: ${this.activeCombat.athleteName}\nMotivo: Descalificación de ${this.activeCombat.opponentName || "oponente"} por acumular 4 Ganchoms (Art. 105)`);
            this.finishCombat();
            return;
        }
    }

    /**
     * Timer controls
     */

HapkidoApp.prototype.toggleTimer = function() {
        if (this.isTimerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }


HapkidoApp.prototype.startTimer = function() {
        if (this.isTimerRunning) return;
        this.isTimerRunning = true;
        document.getElementById('btn-timer-play').innerHTML = '<i class="fa-solid fa-pause"></i>';
        
        this.combatTimer = setInterval(() => {
            if (this.timerSeconds > 0) {
                this.timerSeconds--;
                document.getElementById('timer-display').textContent = this.formatTime(this.timerSeconds);
            } else {
                this.pauseTimer();
                this.logCombatAction("SISTEMA", "¡Tiempo finalizado en este round!");
                alert("¡Tiempo finalizado!");
            }
        }, 1000);
    }


HapkidoApp.prototype.pauseTimer = function() {
        this.isTimerRunning = false;
        clearInterval(this.combatTimer);
        document.getElementById('btn-timer-play').innerHTML = '<i class="fa-solid fa-play"></i>';
    }


HapkidoApp.prototype.resetTimer = function() {
        this.pauseTimer();
        this.timerSeconds = this.activeCombat.roundDuration;
        document.getElementById('timer-display').textContent = this.formatTime(this.timerSeconds);
    }


HapkidoApp.prototype.formatTime = function(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }


HapkidoApp.prototype.changeRound = function(offset) {
        this.pauseTimer();
        const nextRound = this.activeCombat.currentRound + offset;
        
        if (nextRound > 3) {
            this.finishCombat();
            return;
        }

        this.activeCombat.currentRound = nextRound;
        this.resetTimer();
        this.updateScoreboardUI();
        this.logCombatAction("SISTEMA", `Inicia el Round ${nextRound}`);
    }


HapkidoApp.prototype.finishCombat = function() {
        this.pauseTimer();
        if (!this.activeCombat) return;

        // Calculate totals across rounds
        let totalBlue = 0;
        let totalRed = 0;
        for (let r = 1; r <= 3; r++) {
            totalBlue += this.activeCombat.roundsData[r].blueScore;
            totalRed += this.activeCombat.roundsData[r].redScore;
        }

        // Determine winner if not already set by DQ or Superiority
        if (!this.activeCombat.winner) {
            if (totalBlue > totalRed) {
                this.activeCombat.winner = "blue";
                this.activeCombat.winReason = "POINTS";
            } else if (totalRed > totalBlue) {
                this.activeCombat.winner = "red";
                this.activeCombat.winReason = "POINTS";
            } else {
                // TIE - Article 8. Ask if they fought a 3rd round
                if (this.activeCombat.currentRound < 3) {
                    if (confirm("El combate terminó en empate. ¿Deseas disputar un 3er Round de desempate (de 1 minuto, Art. 8)?")) {
                        this.activeCombat.currentRound = 3;
                        this.activeCombat.roundDuration = 60; // 1 minute desempate
                        this.resetTimer();
                        this.updateScoreboardUI();
                        this.logCombatAction("SISTEMA", "Inicia Round 3 de desempate por empate");
                        return;
                    }
                }
                
                // If it remains a tie after round 3, resolve by decision
                const decision = confirm("¿El arbitraje declaró ganador al ATLETA EVALUADO (AZUL) por superioridad técnica/etiqueta?");
                this.activeCombat.winner = decision ? "blue" : "red";
                this.activeCombat.winReason = "DECISION";
            }
        }

        // Save Record
        const record = {
            id: 'rec_' + Date.now(),
            athleteId: this.activeCombat.athleteId,
            date: new Date().toISOString().split('T')[0],
            type: 'COMBATE',
            combatDetails: {
                opponentId: this.activeCombat.opponentId,
                opponentName: this.activeCombat.opponentName,
                stage: this.activeCombat.stage,
                winner: this.activeCombat.winner,
                winReason: this.activeCombat.winReason,
                totalBlue,
                totalRed,
                rounds: {
                    1: this.activeCombat.roundsData[1],
                    2: this.activeCombat.roundsData[2],
                    3: this.activeCombat.roundsData[3]
                }
            }
        };

        this.data.records.push(record);
        this.saveData();

        alert(`Combate registrado con éxito.\nResultado final:\n${this.activeCombat.athleteName} (Azul): ${totalBlue} Pts\n${this.activeCombat.opponentName} (Rojo): ${totalRed} Pts\nGanador: ${this.activeCombat.winner === 'blue' ? 'Azul' : 'Rojo'}`);
        
        // Reset Combat UI
        this.activeCombat = null;
        document.getElementById('scoreboard-container').classList.add('hidden');
        document.querySelector('.combate-setup').classList.remove('hidden');
        
        // Redirect to analysis page
        this.navigateTo('historial');
        this.populateAthleteDropdowns();
    }



