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
                1: { blueScore: 0, redScore: 0, blueKyongo: 0, blueDirectGanchom: 0, blueGanchom: 0, redKyongo: 0, redDirectGanchom: 0, redGanchom: 0, blueTech3: 0, blueTech2: 0, blueTech1: 0, redTech3: 0, redTech2: 0, redTech1: 0, log: [] },
                2: { blueScore: 0, redScore: 0, blueKyongo: 0, blueDirectGanchom: 0, blueGanchom: 0, redKyongo: 0, redDirectGanchom: 0, redGanchom: 0, blueTech3: 0, blueTech2: 0, blueTech1: 0, redTech3: 0, redTech2: 0, redTech1: 0, log: [] },
                3: { blueScore: 0, redScore: 0, blueKyongo: 0, blueDirectGanchom: 0, blueGanchom: 0, redKyongo: 0, redDirectGanchom: 0, redGanchom: 0, blueTech3: 0, blueTech2: 0, blueTech1: 0, redTech3: 0, redTech2: 0, redTech1: 0, log: [] }
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
    };


    HapkidoApp.prototype.updateScoreboardUI = function() {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        // Total effective Gamchoms = direct Gamchoms + floor(Kyongos / 2)
        const blueKyongo = rData.blueKyongo || 0;
        const blueDirect = rData.blueDirectGanchom || 0;
        const blueKyongoDeductions = Math.floor(blueKyongo / 2);
        const blueEffectiveGanchom = blueDirect + blueKyongoDeductions;
        rData.blueGanchom = blueEffectiveGanchom; // backward compatibility

        const redKyongo = rData.redKyongo || 0;
        const redDirect = rData.redDirectGanchom || 0;
        const redKyongoDeductions = Math.floor(redKyongo / 2);
        const redEffectiveGanchom = redDirect + redKyongoDeductions;
        rData.redGanchom = redEffectiveGanchom; // backward compatibility

        document.getElementById('score-round-title').textContent = `ROUND ${round}`;
        document.getElementById('score-blue-total').textContent = rData.blueScore;
        document.getElementById('score-red-total').textContent = rData.redScore;

        // Blue penalties
        const blueKyongoEl = document.getElementById('score-blue-kyongo');
        if (blueKyongoEl) blueKyongoEl.textContent = blueKyongo;
        const blueKyongoHintEl = document.getElementById('score-blue-kyongo-hint');
        if (blueKyongoHintEl) {
            blueKyongoHintEl.textContent = `${blueKyongoDeductions} ${blueKyongoDeductions === 1 ? 'deducción' : 'deducciones'}`;
        }

        const blueGanchomEl = document.getElementById('score-blue-ganchom');
        if (blueGanchomEl) blueGanchomEl.textContent = blueDirect;
        const blueGanchomHintEl = document.getElementById('score-blue-ganchom-hint');
        if (blueGanchomHintEl) {
            blueGanchomHintEl.textContent = `${blueDirect} ${blueDirect === 1 ? 'directa' : 'directas'}`;
        }

        const bluePenaltyTotalEl = document.getElementById('score-blue-penalty-total');
        if (bluePenaltyTotalEl) {
            bluePenaltyTotalEl.textContent = `-${blueEffectiveGanchom} Pts`;
        }

        const blueDqStatusEl = document.getElementById('score-blue-dq-status');
        if (blueDqStatusEl) {
            blueDqStatusEl.textContent = `${blueEffectiveGanchom}/4 Gamchoms`;
            blueDqStatusEl.className = `dq-risk-label risk-${blueEffectiveGanchom >= 4 ? 'dq' : blueEffectiveGanchom}`;
        }

        // Red penalties
        const redKyongoEl = document.getElementById('score-red-kyongo');
        if (redKyongoEl) redKyongoEl.textContent = redKyongo;
        const redKyongoHintEl = document.getElementById('score-red-kyongo-hint');
        if (redKyongoHintEl) {
            redKyongoHintEl.textContent = `${redKyongoDeductions} ${redKyongoDeductions === 1 ? 'deducción' : 'deducciones'}`;
        }

        const redGanchomEl = document.getElementById('score-red-ganchom');
        if (redGanchomEl) redGanchomEl.textContent = redDirect;
        const redGanchomHintEl = document.getElementById('score-red-ganchom-hint');
        if (redGanchomHintEl) {
            redGanchomHintEl.textContent = `${redDirect} ${redDirect === 1 ? 'directa' : 'directas'}`;
        }

        const redPenaltyTotalEl = document.getElementById('score-red-penalty-total');
        if (redPenaltyTotalEl) {
            redPenaltyTotalEl.textContent = `-${redEffectiveGanchom} Pts`;
        }

        const redDqStatusEl = document.getElementById('score-red-dq-status');
        if (redDqStatusEl) {
            redDqStatusEl.textContent = `${redEffectiveGanchom}/4 Gamchoms`;
            redDqStatusEl.className = `dq-risk-label risk-${redEffectiveGanchom >= 4 ? 'dq' : redEffectiveGanchom}`;
        }

        // Render log entries
        const logContainer = document.getElementById('combat-log-list');
        if (logContainer) {
            logContainer.innerHTML = '';
            if (rData.log.length === 0) {
                logContainer.innerHTML = '<div class="empty-list">No hay puntuaciones ni faltas registradas en este round.</div>';
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
        }

        // Enable/disable round buttons
        const prevBtn = document.getElementById('btn-score-prev-round');
        if (prevBtn) prevBtn.disabled = round === 1;
        const nextBtn = document.getElementById('btn-score-next-round');
        if (nextBtn) nextBtn.textContent = round === 3 ? "Finalizar Combate" : "Siguiente Round";
    };


    HapkidoApp.prototype.addScore = function(side, points, detail) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        if (side === 'blue') {
            rData.blueScore += points;
            if (points === 3) rData.blueTech3 = (rData.blueTech3 || 0) + 1;
            else if (points === 2) rData.blueTech2 = (rData.blueTech2 || 0) + 1;
            else if (points === 1) rData.blueTech1 = (rData.blueTech1 || 0) + 1;
            this.logCombatAction("blue", `Punto +${points} (${detail})`);
        } else {
            rData.redScore += points;
            if (points === 3) rData.redTech3 = (rData.redTech3 || 0) + 1;
            else if (points === 2) rData.redTech2 = (rData.redTech2 || 0) + 1;
            else if (points === 1) rData.redTech1 = (rData.redTech1 || 0) + 1;
            this.logCombatAction("red", `Punto +${points} (${detail})`);
        }

        this.updateScoreboardUI();
        this.checkCombatRules();
    };

    /**
     * Corrección de puntos (restar punto marcado por error)
     */
    HapkidoApp.prototype.removeScore = function(side, points = 1) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        if (side === 'blue') {
            if (rData.blueScore >= points) {
                rData.blueScore -= points;
                this.logCombatAction("blue", `Corrección: Restado -${points} punto`);
            }
        } else {
            if (rData.redScore >= points) {
                rData.redScore -= points;
                this.logCombatAction("red", `Corrección: Restado -${points} punto`);
            }
        }

        this.updateScoreboardUI();
    };

    /**
     * Registro de Amonestaciones (Kyongo) y Deducciones (Gamchom)
     */
    HapkidoApp.prototype.addPenalty = function(side, type) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        if (side === 'blue') {
            if (type === 'kyongo') {
                rData.blueKyongo = (rData.blueKyongo || 0) + 1;
                // Si el número de kyongos es par (2, 4, 6...), se convierte en una deducción Gamchom y le da +1 punto al rival
                if (rData.blueKyongo % 2 === 0) {
                    rData.redScore += 1;
                    this.logCombatAction("blue", `Amonestación Kyongo #${rData.blueKyongo} (2 Kyongos acumulados = Deducción Gamchom, +1 Pto al rival)`);
                } else {
                    this.logCombatAction("blue", `Amonestación Kyongo #${rData.blueKyongo} (Falta leve)`);
                }
            } else {
                rData.blueDirectGanchom = (rData.blueDirectGanchom || 0) + 1;
                rData.redScore += 1; // Gamchom directo da +1 punto al rival
                this.logCombatAction("blue", `Deducción Gamchom Directo #${rData.blueDirectGanchom} (Falta grave, +1 Pto al rival)`);
            }
        } else {
            if (type === 'kyongo') {
                rData.redKyongo = (rData.redKyongo || 0) + 1;
                if (rData.redKyongo % 2 === 0) {
                    rData.blueScore += 1;
                    this.logCombatAction("red", `Amonestación Kyongo #${rData.redKyongo} (2 Kyongos acumulados = Deducción Gamchom, +1 Pto al rival)`);
                } else {
                    this.logCombatAction("red", `Amonestación Kyongo #${rData.redKyongo} (Falta leve)`);
                }
            } else {
                rData.redDirectGanchom = (rData.redDirectGanchom || 0) + 1;
                rData.blueScore += 1; // Gamchom directo da +1 punto al rival
                this.logCombatAction("red", `Deducción Gamchom Directo #${rData.redDirectGanchom} (Falta grave, +1 Pto al rival)`);
            }
        }

        this.updateScoreboardUI();
        this.checkCombatRules();
    };

    /**
     * Corrección de Faltas (deshacer amonestación o deducción marcada por error)
     */
    HapkidoApp.prototype.removePenalty = function(side, type) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const rData = this.activeCombat.roundsData[round];

        if (side === 'blue') {
            if (type === 'kyongo' && (rData.blueKyongo || 0) > 0) {
                // Si estaba en un número par, se retira el punto otorgado al oponente
                if (rData.blueKyongo % 2 === 0 && rData.redScore > 0) {
                    rData.redScore = Math.max(0, rData.redScore - 1);
                }
                rData.blueKyongo--;
                this.logCombatAction("blue", `Corrección: Retirado 1 Kyongo`);
            } else if (type === 'ganchom' && (rData.blueDirectGanchom || 0) > 0) {
                rData.blueDirectGanchom--;
                rData.redScore = Math.max(0, rData.redScore - 1);
                this.logCombatAction("blue", `Corrección: Retirada 1 Deducción Gamchom`);
            }
        } else {
            if (type === 'kyongo' && (rData.redKyongo || 0) > 0) {
                if (rData.redKyongo % 2 === 0 && rData.blueScore > 0) {
                    rData.blueScore = Math.max(0, rData.blueScore - 1);
                }
                rData.redKyongo--;
                this.logCombatAction("red", `Corrección: Retirado 1 Kyongo`);
            } else if (type === 'ganchom' && (rData.redDirectGanchom || 0) > 0) {
                rData.redDirectGanchom--;
                rData.blueScore = Math.max(0, rData.blueScore - 1);
                this.logCombatAction("red", `Corrección: Retirada 1 Deducción Gamchom`);
            }
        }

        this.updateScoreboardUI();
    };


    HapkidoApp.prototype.logCombatAction = function(side, message) {
        if (!this.activeCombat) return;
        const round = this.activeCombat.currentRound;
        const timeStr = this.formatTime(this.timerSeconds);
        
        this.activeCombat.roundsData[round].log.push({
            time: timeStr,
            side,
            message
        });
    };


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

        // 2. Penalty Disqualification (Completing 4 Gamchoms / Deducciones efectivas, Article 105)
        const blueEffectiveGamchom = (rData.blueDirectGanchom || 0) + Math.floor((rData.blueKyongo || 0) / 2);
        const redEffectiveGamchom = (rData.redDirectGanchom || 0) + Math.floor((rData.redKyongo || 0) / 2);

        if (blueEffectiveGamchom >= 4) {
            this.pauseTimer();
            this.activeCombat.winner = "red";
            this.activeCombat.winReason = "DISQ";
            alert(`¡COMBATE FINALIZADO POR DESCALIFICACIÓN!\nGanador: ${this.activeCombat.opponentName || "OPONENTE ROJO"}\nMotivo: Descalificación del competidor Azul por acumular 4 Gamchoms / deducciones (Art. 105)`);
            this.finishCombat();
            return;
        }

        if (redEffectiveGamchom >= 4) {
            this.pauseTimer();
            this.activeCombat.winner = "blue";
            this.activeCombat.winReason = "DISQ";
            alert(`¡COMBATE FINALIZADO POR DESCALIFICACIÓN!\nGanador: ${this.activeCombat.athleteName} (AZUL)\nMotivo: Descalificación del competidor Rojo por acumular 4 Gamchoms / deducciones (Art. 105)`);
            this.finishCombat();
            return;
        }
    };

    /**
     * Finalización oficial del combate con sistema de desempate FEVEHAPKIDO 2026 (Art. 8)
     */
    HapkidoApp.prototype.finishCombat = function() {
        this.pauseTimer();
        if (!this.activeCombat) return;

        // Calculate totals across rounds
        let totalBlue = 0;
        let totalRed = 0;
        let totalFoulsBlue = 0;
        let totalFoulsRed = 0;
        let tech3Blue = 0;
        let tech3Red = 0;
        let tech2Blue = 0;
        let tech2Red = 0;

        for (let r = 1; r <= 3; r++) {
            const rd = this.activeCombat.roundsData[r];
            totalBlue += (rd.blueScore || 0);
            totalRed += (rd.redScore || 0);
            totalFoulsBlue += ((rd.blueKyongo || 0) + (rd.blueDirectGanchom || 0));
            totalFoulsRed += ((rd.redKyongo || 0) + (rd.redDirectGanchom || 0));
            tech3Blue += (rd.blueTech3 || 0);
            tech3Red += (rd.redTech3 || 0);
            tech2Blue += (rd.blueTech2 || 0);
            tech2Red += (rd.redTech2 || 0);
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
                // TIE - APLICACIÓN DEL REGLAMENTO OFICIAL FEVEHAPKIDO 2026 (ART. 8)
                // 1. Menor número de faltas acumuladas (Gamchom y/o Kyongos)
                if (totalFoulsBlue !== totalFoulsRed) {
                    const foulWinner = totalFoulsBlue < totalFoulsRed ? "blue" : "red";
                    const foulWinnerName = foulWinner === "blue" ? this.activeCombat.athleteName : this.activeCombat.opponentName;
                    const minFouls = Math.min(totalFoulsBlue, totalFoulsRed);
                    const maxFouls = Math.max(totalFoulsBlue, totalFoulsRed);
                    
                    this.activeCombat.winner = foulWinner;
                    this.activeCombat.winReason = "MENOR_FALTAS";
                    alert(`¡DESEMPATE POR FALTAS (Art. 8, Par. 1)!\n\nEmpate en puntos (${totalBlue} - ${totalRed}).\nGanador: ${foulWinnerName} (${foulWinner === 'blue' ? 'Azul' : 'Rojo'})\nMotivo: Menor cantidad de faltas acumuladas (${minFouls} faltas vs ${maxFouls} del rival).`);
                } else {
                    // 2. Si persiste el empate en faltas, disputar 3er Round de desempate (1 minuto)
                    if (this.activeCombat.currentRound < 3) {
                        if (confirm(`Empate total en puntos (${totalBlue}) y faltas (${totalFoulsBlue}).\n\n¿Deseas disputar el 3er Round de desempate de 1 minuto (Art. 8, Par. 2)?`)) {
                            this.activeCombat.currentRound = 3;
                            this.activeCombat.roundDuration = 60; // 1 minute desempate
                            this.resetTimer();
                            this.updateScoreboardUI();
                            this.logCombatAction("SISTEMA", "Inicia Round 3 de desempate por igualdad técnica y de faltas");
                            return;
                        }
                    }

                    // 3. Superioridad Técnica por técnicas de 3 y 2 puntos (Art. 8, Par. 3)
                    if (tech3Blue !== tech3Red) {
                        const techWinner = tech3Blue > tech3Red ? "blue" : "red";
                        const techWinnerName = techWinner === "blue" ? this.activeCombat.athleteName : this.activeCombat.opponentName;
                        this.activeCombat.winner = techWinner;
                        this.activeCombat.winReason = "SUP_TECNICA_3PTS";
                        alert(`¡DESEMPATE POR SUPERIORIDAD TÉCNICA (Art. 8, Par. 3)!\n\nGanador: ${techWinnerName} (${techWinner === 'blue' ? 'Azul' : 'Rojo'})\nMotivo: Mayor cantidad de técnicas de 3 puntos (${Math.max(tech3Blue, tech3Red)} vs ${Math.min(tech3Blue, tech3Red)}).`);
                    } else if (tech2Blue !== tech2Red) {
                        const techWinner = tech2Blue > tech2Red ? "blue" : "red";
                        const techWinnerName = techWinner === "blue" ? this.activeCombat.athleteName : this.activeCombat.opponentName;
                        this.activeCombat.winner = techWinner;
                        this.activeCombat.winReason = "SUP_TECNICA_2PTS";
                        alert(`¡DESEMPATE POR SUPERIORIDAD TÉCNICA (Art. 8, Par. 3)!\n\nGanador: ${techWinnerName} (${techWinner === 'blue' ? 'Azul' : 'Rojo'})\nMotivo: Mayor cantidad de técnicas de 2 puntos (${Math.max(tech2Blue, tech2Red)} vs ${Math.min(tech2Blue, tech2Red)}).`);
                    } else {
                        // 4. Decisión arbitral final (Usi-Seung)
                        const decision = confirm(`Empate absoluto tras evaluar puntos, faltas y técnicas.\n\n¿El cuerpo arbitral declara ganador al atleta AZUL (${this.activeCombat.athleteName}) por decisión de tatami (Usi-Seung)?`);
                        this.activeCombat.winner = decision ? "blue" : "red";
                        this.activeCombat.winReason = "DECISION_ARBITRAL";
                    }
                }
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
                totalFoulsBlue,
                totalFoulsRed,
                rounds: {
                    1: this.activeCombat.roundsData[1],
                    2: this.activeCombat.roundsData[2],
                    3: this.activeCombat.roundsData[3]
                }
            }
        };

        this.data.records.push(record);
        this.saveData();

        alert(`Combate registrado con éxito.\nResultado final:\n${this.activeCombat.athleteName} (Azul): ${totalBlue} Pts (${totalFoulsBlue} faltas)\n${this.activeCombat.opponentName} (Rojo): ${totalRed} Pts (${totalFoulsRed} faltas)\nGanador: ${this.activeCombat.winner === 'blue' ? 'Azul' : 'Rojo'} [${this.activeCombat.winReason}]`);
        
        // Reset Combat UI
        this.activeCombat = null;
        document.getElementById('scoreboard-container').classList.add('hidden');
        document.querySelector('.combate-setup').classList.remove('hidden');
        
        // Redirect to analysis page
        this.navigateTo('historial');
        this.populateAthleteDropdowns();
    };



