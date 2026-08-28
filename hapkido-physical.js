console.log('Module: hapkido-physical.js loaded');
/**
 * Module: hapkido-physical.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.updatePhysicalFormLabels = function(isInfantil) {
        const lblPushups = document.querySelector('label[for="fit-pushups"]');
        const inputPushups = document.getElementById('fit-pushups');
        const lblSitups = document.querySelector('label[for="fit-situps"]');
        const inputSitups = document.getElementById('fit-situps');
        const lblCooper = document.querySelector('label[for="fit-cooper"]');
        const inputCooper = document.getElementById('fit-cooper');
        const lblJumpVertical = document.querySelector('label[for="fit-jump-vertical"]');
        const inputJumpVertical = document.getElementById('fit-jump-vertical');
        const lblAgility = document.querySelector('label[for="fit-agility"]');
        const inputAgility = document.getElementById('fit-agility');
        const gripInput = document.getElementById('fit-grip');
        const groupGrip = gripInput ? gripInput.closest('.form-group') : null;

        if (isInfantil) {
            if (lblPushups) lblPushups.textContent = "Flexiones adaptadas (1 min - reps)";
            if (inputPushups) inputPushups.placeholder = "Ej: 15";
            if (lblSitups) lblSitups.textContent = "Abdominales adaptados (1 min - reps)";
            if (inputSitups) inputSitups.placeholder = "Ej: 20";
            if (lblCooper) lblCooper.textContent = "Resistencia / Navette o Carrera (metros)";
            if (inputCooper) inputCooper.placeholder = "Ej: 1200";
            if (lblJumpVertical) lblJumpVertical.textContent = "Salto Vertical (cm)";
            if (inputJumpVertical) inputJumpVertical.placeholder = "Ej: 25";
            if (lblAgility) lblAgility.textContent = "Velocidad 10m (segundos)";
            if (inputAgility) inputAgility.placeholder = "Ej: 3.5";
            if (groupGrip) groupGrip.style.opacity = '1';
        } else {
            if (lblPushups) lblPushups.textContent = "Flexiones de pecho (1 min - reps)";
            if (inputPushups) inputPushups.placeholder = "Ej: 35";
            if (lblSitups) lblSitups.textContent = "Abdominales (1 min - reps)";
            if (inputSitups) inputSitups.placeholder = "Ej: 40";
            if (lblCooper) lblCooper.textContent = "Test de Cooper (Distancia recorrida en metros)";
            if (inputCooper) inputCooper.placeholder = "Ej: 2400";
            if (lblJumpVertical) lblJumpVertical.textContent = "Salto Vertical / Sargent Jump (cm)";
            if (inputJumpVertical) inputJumpVertical.placeholder = "Ej: 45";
            if (lblAgility) lblAgility.textContent = "Test de Velocidad/Agilidad 10m (segundos)";
            if (inputAgility) inputAgility.placeholder = "Ej: 2.85";
            if (groupGrip) groupGrip.style.opacity = '1';
        }
    }


HapkidoApp.prototype.calculateLiveBodyFat = function() {
        const athleteId = document.getElementById('physical-athlete-select').value;
        if (!athleteId) {
            document.getElementById('fit-fat').value = '';
            return;
        }
        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        const height = parseFloat(document.getElementById('fit-height').value);
        const weight = parseFloat(document.getElementById('fit-weight').value);
        const waist = parseFloat(document.getElementById('fit-waist').value);

        if (isNaN(height) || isNaN(weight) || isNaN(waist) || height <= 0 || weight <= 0 || waist <= 0) {
            document.getElementById('fit-fat').value = '';
            return;
        }

        const isMale = athlete.gender === 'MASCULINO';
        
        // RFM (Relative Fat Mass)
        const rfm = isMale ? (64 - 20 * (height / waist)) : (76 - 20 * (height / waist));

        // YMCA Formula
        const waistIn = waist / 2.54;
        const weightLbs = weight * 2.20462;
        let ymca = 0;
        if (isMale) {
            ymca = ((1.634 * waistIn - 0.1082 * weightLbs - 98.42) / weightLbs) * 100;
        } else {
            ymca = ((1.634 * waistIn - 0.0823 * weightLbs - 76.76) / weightLbs) * 100;
        }

        let finalFat = 0;
        if (ymca > 0) {
            finalFat = (rfm + ymca) / 2;
        } else {
            finalFat = rfm;
        }

        const skinfoldTri = parseFloat(document.getElementById('fit-skinfold-tri')?.value);
        const skinfoldAbd = parseFloat(document.getElementById('fit-skinfold-abd')?.value);
        if (!isNaN(skinfoldTri) && !isNaN(skinfoldAbd) && skinfoldTri > 0 && skinfoldAbd > 0) {
            const sumSkinfolds = skinfoldTri + skinfoldAbd;
            const skinfoldFat = isMale ? (0.735 * sumSkinfolds + 1.0) : (0.610 * sumSkinfolds + 5.1);
            if (skinfoldFat > 2 && skinfoldFat < 60) {
                finalFat = (finalFat + skinfoldFat) / 2;
            }
        }

        finalFat = Math.max(2, Math.min(60, finalFat));
        document.getElementById('fit-fat').value = finalFat.toFixed(1);
    }

    /**
     * Physical Test Save Operations
     */

HapkidoApp.prototype.savePhysicalTest = function() {
        const athleteId = document.getElementById('physical-athlete-select').value;
        const date = document.getElementById('physical-date').value;
        
        const pulseP1 = parseInt(document.getElementById('pulse-p1').value);
        const pulseP2 = parseInt(document.getElementById('pulse-p2').value);
        const pulseP3 = parseInt(document.getElementById('pulse-p3').value);

        if (!athleteId || !date || isNaN(pulseP1) || isNaN(pulseP2) || isNaN(pulseP3)) {
            alert("Por favor rellene todos los campos obligatorios.");
            return;
        }

        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        const ruffierIndex = ((pulseP1 + pulseP2 + pulseP3) - 200) / 10;
        let ruffierLevel = "Malo";
        if (ruffierIndex <= 0) ruffierLevel = "Excelente";
        else if (ruffierIndex <= 5) ruffierLevel = "Bueno";
        else if (ruffierIndex <= 10) ruffierLevel = "Medio";
        else if (ruffierIndex <= 15) ruffierLevel = "Insuficiente";

        const height = parseFloat(document.getElementById('fit-height').value) || null;
        const weight = parseFloat(document.getElementById('fit-weight').value) || null;
        const waist = parseFloat(document.getElementById('fit-waist').value) || null;
        const fat = parseFloat(document.getElementById('fit-fat').value) || null;

        const wingspan = parseFloat(document.getElementById('fit-wingspan').value) || null;
        const neck = parseFloat(document.getElementById('fit-neck').value) || null;
        const thigh = parseFloat(document.getElementById('fit-thigh').value) || null;
        const skinfoldTri = parseFloat(document.getElementById('fit-skinfold-tri').value) || null;
        const skinfoldAbd = parseFloat(document.getElementById('fit-skinfold-abd').value) || null;
        const rhr = parseInt(document.getElementById('fit-rhr').value) || null;

        const pushups = parseInt(document.getElementById('fit-pushups').value) || null;
        const situps = parseInt(document.getElementById('fit-situps').value) || null;
        const plank = parseInt(document.getElementById('fit-plank').value) || null;
        const grip = parseFloat(document.getElementById('fit-grip').value) || null;

        const jumpVertical = parseFloat(document.getElementById('fit-jump-vertical').value) || null;
        const jumpHorizontal = parseFloat(document.getElementById('fit-jump-horizontal').value) || null;
        const cooper = parseInt(document.getElementById('fit-cooper').value) || null;

        const flexibility = parseInt(document.getElementById('fit-flexibility').value) || null;
        const split = parseFloat(document.getElementById('fit-split').value) || null;
        const kickFlex = parseFloat(document.getElementById('fit-kick-flex').value) || null;
        const balance = parseInt(document.getElementById('fit-balance').value) || null;

        const agility = parseFloat(document.getElementById('fit-agility').value) || null;
        const shuttle = parseFloat(document.getElementById('fit-shuttle').value) || null;
        const reaction = parseFloat(document.getElementById('fit-reaction').value) || null;

        const kickSpeed = parseInt(document.getElementById('fit-kick-speed').value) || null;
        const anaerobic = parseInt(document.getElementById('fit-anaerobic').value) || null;

        // Technical martial aspects (Hyungs/Hosinsul/Weapons) are evaluated in belt exams (hapkido-exams.js)
        const scoreHyungs = null;
        const scoreHosinsul = null;
        const scoreWeapons = null;

        // Update athlete profile dynamically
        if (height) athlete.height = height;
        if (weight) athlete.weight = weight;

        const physicalDetails = {
            pulseP1, pulseP2, pulseP3,
            ruffierIndex, ruffierLevel,
            rhr,
            height,
            weight,
            waist,
            fat,
            wingspan,
            neck,
            thigh,
            skinfoldTri,
            skinfoldAbd,
            pushups,
            situps,
            plank,
            grip,
            jumpVertical,
            jumpHorizontal,
            cooper,
            flexibility,
            split,
            kickFlex,
            balance,
            agility,
            shuttle,
            reaction,
            kickSpeed,
            anaerobic,
            scoreHyungs,
            scoreHosinsul,
            scoreWeapons
        };

        // Deportivas specific fields, only if deportivo modality is active
        if (athlete.modalities && athlete.modalities.deportivo) {
            physicalDetails.jumpLong = parseFloat(document.getElementById('jump-long').value) || null;
            physicalDetails.jumpHigh = parseFloat(document.getElementById('jump-high').value) || null;
            physicalDetails.scoreFiguresSin = parseFloat(document.getElementById('score-figures-sin').value) || null;
            physicalDetails.scoreFiguresCon = parseFloat(document.getElementById('score-figures-con').value) || null;
            physicalDetails.scoreDemo = parseFloat(document.getElementById('score-demo').value) || null;
        }

        // Run physical metrics evaluation
        const age = this.calculateAge(athlete.birthdate);
        physicalDetails.evalResults = this.evaluatePhysicalMetrics(age, athlete.gender, physicalDetails, athlete);

        const record = {
            id: 'rec_' + Date.now(),
            athleteId,
            date,
            type: 'FISICA',
            physicalDetails
        };

        this.data.records.push(record);
        this.saveData();

        document.getElementById('physical-test-form').reset();
        document.getElementById('ruffier-result-panel').innerHTML = `
            <span>Índice de Ruffier: <strong id="ruffier-index-val">--</strong></span>
            <span class="badge" id="ruffier-level-badge">Estado: --</span>
        `;

        // Check if first physical test to auto-display the training plan
        const isFirstTest = this.data.records.filter(r => r.athleteId === athleteId && r.type === 'FISICA').length === 1;
        if (isFirstTest) {
            const planHTML = this.generateTrainingPlanHTML(athlete, record);
            document.getElementById('plan-modal-body').innerHTML = planHTML;
            document.getElementById('plan-modal').classList.add('active');
            
            // Set listener for modal close to redirect
            document.getElementById('close-plan-modal').onclick = () => {
                document.getElementById('plan-modal').classList.remove('active');
                this.navigateTo('historial');
                document.getElementById('analysis-athlete-select').value = athleteId;
                this.loadAthleteAnalysis(athleteId);
            };
            
            const acceptBtn = document.querySelector('#plan-modal .primary-btn');
            if (acceptBtn) {
                acceptBtn.onclick = () => {
                    document.getElementById('plan-modal').classList.remove('active');
                    this.navigateTo('historial');
                    document.getElementById('analysis-athlete-select').value = athleteId;
                    this.loadAthleteAnalysis(athleteId);
                };
            }
        } else {
            alert("Ficha de evaluación fisiológica y técnica registrada con éxito.");
            this.navigateTo('historial');
            document.getElementById('analysis-athlete-select').value = athleteId;
            this.loadAthleteAnalysis(athleteId);
        }
    }

    /**
     * Motor de Evaluación de Rendimiento Físico
     */

HapkidoApp.prototype.evaluatePhysicalMetrics = function(age, gender, details, athlete) {
        // Age brackets
        let ageGroup = "ADULTO";
        if (age < 12) ageGroup = "INFANTIL";
        else if (age <= 14) ageGroup = "JUNIOR";
        else if (age <= 17) ageGroup = "JUVENIL";
        else if (age <= 35) ageGroup = "ADULTO";
        else ageGroup = "SENIOR";

        const evalMetric = (val, brackets) => {
            if (val === null || val === undefined || isNaN(val)) return null;
            if (val >= brackets.excel) return { score: 10, level: "Excelente", cls: "success" };
            if (val >= brackets.good) {
                const range = brackets.excel - brackets.good;
                const score = range > 0 ? 8 + ((val - brackets.good) / range) * 1.9 : 9;
                return { score: Math.round(score * 10) / 10, level: "Bueno", cls: "success" };
            }
            if (val >= brackets.avg) {
                const range = brackets.good - brackets.avg;
                const score = range > 0 ? 6 + ((val - brackets.avg) / range) * 1.9 : 7;
                return { score: Math.round(score * 10) / 10, level: "Medio", cls: "warning" };
            }
            if (val >= brackets.poor) {
                const range = brackets.avg - brackets.poor;
                const score = range > 0 ? 4 + ((val - brackets.poor) / range) * 1.9 : 5;
                return { score: Math.round(score * 10) / 10, level: "Insuficiente", cls: "danger" };
            }
            const score = Math.max(1, (val / brackets.poor) * 3.9);
            return { score: Math.round(score * 10) / 10, level: "Deficiente", cls: "danger" };
        };

        const evalMetricReverse = (val, brackets) => {
            if (val === null || val === undefined || isNaN(val)) return null;
            if (val <= brackets.excel) return { score: 10, level: "Excelente", cls: "success" };
            if (val <= brackets.good) {
                const range = brackets.good - brackets.excel;
                const score = range > 0 ? 8 + ((brackets.good - val) / range) * 1.9 : 9;
                return { score: Math.round(score * 10) / 10, level: "Bueno", cls: "success" };
            }
            if (val <= brackets.avg) {
                const range = brackets.avg - brackets.good;
                const score = range > 0 ? 6 + ((brackets.avg - val) / range) * 1.9 : 7;
                return { score: Math.round(score * 10) / 10, level: "Medio", cls: "warning" };
            }
            if (val <= brackets.poor) {
                const range = brackets.poor - brackets.avg;
                const score = range > 0 ? 4 + ((brackets.poor - val) / range) * 1.9 : 5;
                return { score: Math.round(score * 10) / 10, level: "Insuficiente", cls: "danger" };
            }
            const score = Math.max(1, 4 - ((val - brackets.poor) / brackets.poor) * 3);
            return { score: Math.round(score * 10) / 10, level: "Deficiente", cls: "danger" };
        };

        const evalTechnicalScore = (val) => {
            if (val === null || val === undefined || isNaN(val)) return null;
            let level = "Medio";
            let cls = "warning";
            if (val >= 8.5) { level = "Excelente"; cls = "success"; }
            else if (val >= 7.0) { level = "Bueno"; cls = "success"; }
            else if (val >= 5.0) { level = "Medio"; cls = "warning"; }
            else if (val >= 3.5) { level = "Insuficiente"; cls = "danger"; }
            else { level = "Deficiente"; cls = "danger"; }
            return { score: val, level, cls };
        };

        const baremos = {
            pushups: {
                INFANTIL: { MASCULINO: { excel: 25, good: 15, avg: 8, poor: 4 }, FEMENINO: { excel: 25, good: 15, avg: 8, poor: 4 } },
                JUNIOR: { MASCULINO: { excel: 35, good: 25, avg: 15, poor: 8 }, FEMENINO: { excel: 25, good: 15, avg: 10, poor: 5 } },
                JUVENIL: { MASCULINO: { excel: 45, good: 35, avg: 20, poor: 12 }, FEMENINO: { excel: 30, good: 20, avg: 12, poor: 6 } },
                ADULTO: { MASCULINO: { excel: 55, good: 40, avg: 25, poor: 15 }, FEMENINO: { excel: 35, good: 25, avg: 15, poor: 8 } },
                SENIOR: { MASCULINO: { excel: 40, good: 30, avg: 20, poor: 10 }, FEMENINO: { excel: 25, good: 18, avg: 10, poor: 5 } }
            },
            situps: {
                INFANTIL: { MASCULINO: { excel: 30, good: 20, avg: 12, poor: 6 }, FEMENINO: { excel: 30, good: 20, avg: 12, poor: 6 } },
                JUNIOR: { MASCULINO: { excel: 40, good: 30, avg: 20, poor: 12 }, FEMENINO: { excel: 30, good: 20, avg: 12, poor: 8 } },
                JUVENIL: { MASCULINO: { excel: 45, good: 35, avg: 25, poor: 15 }, FEMENINO: { excel: 35, good: 25, avg: 15, poor: 10 } },
                ADULTO: { MASCULINO: { excel: 50, good: 40, avg: 30, poor: 20 }, FEMENINO: { excel: 40, good: 30, avg: 20, poor: 12 } },
                SENIOR: { MASCULINO: { excel: 38, good: 28, avg: 18, poor: 10 }, FEMENINO: { excel: 28, good: 18, avg: 10, poor: 6 } }
            },
            flexibility: {
                INFANTIL: { MASCULINO: { excel: 12, good: 6, avg: 0, poor: -5 }, FEMENINO: { excel: 12, good: 6, avg: 0, poor: -5 } },
                JUNIOR: { MASCULINO: { excel: 10, good: 3, avg: -4, poor: -10 }, FEMENINO: { excel: 16, good: 8, avg: 1, poor: -5 } },
                JUVENIL: { MASCULINO: { excel: 12, good: 5, avg: -2, poor: -9 }, FEMENINO: { excel: 18, good: 10, avg: 3, poor: -4 } },
                ADULTO: { MASCULINO: { excel: 15, good: 7, avg: 0, poor: -8 }, FEMENINO: { excel: 20, good: 12, avg: 4, poor: -3 } },
                SENIOR: { MASCULINO: { excel: 10, good: 4, avg: -3, poor: -10 }, FEMENINO: { excel: 15, good: 8, avg: 1, poor: -6 } }
            },
            cooper: {
                INFANTIL: { MASCULINO: { excel: 2000, good: 1600, avg: 1300, poor: 1000 }, FEMENINO: { excel: 2000, good: 1600, avg: 1300, poor: 1000 } },
                JUNIOR: { MASCULINO: { excel: 2500, good: 2100, avg: 1700, poor: 1400 }, FEMENINO: { excel: 2100, good: 1700, avg: 1400, poor: 1100 } },
                JUVENIL: { MASCULINO: { excel: 2700, good: 2300, avg: 1900, poor: 1500 }, FEMENINO: { excel: 2300, good: 1900, avg: 1600, poor: 1300 } },
                ADULTO: { MASCULINO: { excel: 2800, good: 2400, avg: 2000, poor: 1600 }, FEMENINO: { excel: 2400, good: 2000, avg: 1700, poor: 1400 } },
                SENIOR: { MASCULINO: { excel: 2400, good: 2000, avg: 1600, poor: 1300 }, FEMENINO: { excel: 2000, good: 1600, avg: 1300, poor: 1000 } }
            },
            jumpLong: {
                INFANTIL: { MASCULINO: { excel: 1.5, good: 1.2, avg: 1.0, poor: 0.8 }, FEMENINO: { excel: 1.5, good: 1.2, avg: 1.0, poor: 0.8 } },
                JUNIOR: { MASCULINO: { excel: 1.9, good: 1.6, avg: 1.3, poor: 1.1 }, FEMENINO: { excel: 1.6, good: 1.3, avg: 1.1, poor: 0.9 } },
                JUVENIL: { MASCULINO: { excel: 2.2, good: 1.9, avg: 1.6, poor: 1.3 }, FEMENINO: { excel: 1.8, good: 1.5, avg: 1.2, poor: 1.0 } },
                ADULTO: { MASCULINO: { excel: 2.4, good: 2.1, avg: 1.8, poor: 1.5 }, FEMENINO: { excel: 2.0, good: 1.7, avg: 1.4, poor: 1.1 } },
                SENIOR: { MASCULINO: { excel: 2.0, good: 1.7, avg: 1.4, poor: 1.1 }, FEMENINO: { excel: 1.6, good: 1.3, avg: 1.1, poor: 0.9 } }
            },
            jumpHigh: {
                INFANTIL: { MASCULINO: { excel: 0.7, good: 0.55, avg: 0.4, poor: 0.3 }, FEMENINO: { excel: 0.7, good: 0.55, avg: 0.4, poor: 0.3 } },
                JUNIOR: { MASCULINO: { excel: 0.95, good: 0.8, avg: 0.65, poor: 0.5 }, FEMENINO: { excel: 0.75, good: 0.6, avg: 0.45, poor: 0.35 } },
                JUVENIL: { MASCULINO: { excel: 1.15, good: 0.95, avg: 0.8, poor: 0.65 }, FEMENINO: { excel: 0.9, good: 0.75, avg: 0.6, poor: 0.45 } },
                ADULTO: { MASCULINO: { excel: 1.3, good: 1.1, avg: 0.9, poor: 0.7 }, FEMENINO: { excel: 1.0, good: 0.85, avg: 0.7, poor: 0.55 } },
                SENIOR: { MASCULINO: { excel: 1.0, good: 0.85, avg: 0.7, poor: 0.55 }, FEMENINO: { excel: 0.8, good: 0.65, avg: 0.5, poor: 0.4 } }
            },
            jumpVertical: {
                INFANTIL: { MASCULINO: { excel: 35, good: 28, avg: 21, poor: 14 }, FEMENINO: { excel: 35, good: 28, avg: 21, poor: 14 } },
                JUNIOR: { MASCULINO: { excel: 45, good: 37, avg: 29, poor: 20 }, FEMENINO: { excel: 38, good: 31, avg: 24, poor: 16 } },
                JUVENIL: { MASCULINO: { excel: 55, good: 45, avg: 35, poor: 25 }, FEMENINO: { excel: 45, good: 37, avg: 29, poor: 20 } },
                ADULTO: { MASCULINO: { excel: 55, good: 45, avg: 35, poor: 25 }, FEMENINO: { excel: 45, good: 37, avg: 29, poor: 20 } },
                SENIOR: { MASCULINO: { excel: 45, good: 37, avg: 29, poor: 20 }, FEMENINO: { excel: 35, good: 28, avg: 21, poor: 14 } }
            },
            agility: {
                INFANTIL: { MASCULINO: { excel: 3.5, good: 4.0, avg: 4.8, poor: 5.5 }, FEMENINO: { excel: 3.6, good: 4.2, avg: 5.0, poor: 5.8 } },
                JUNIOR: { MASCULINO: { excel: 3.1, good: 3.5, avg: 4.1, poor: 4.8 }, FEMENINO: { excel: 3.3, good: 3.7, avg: 4.3, poor: 5.0 } },
                JUVENIL: { MASCULINO: { excel: 2.8, good: 3.2, avg: 3.8, poor: 4.5 }, FEMENINO: { excel: 3.0, good: 3.4, avg: 4.0, poor: 4.7 } },
                ADULTO: { MASCULINO: { excel: 2.7, good: 3.1, avg: 3.7, poor: 4.4 }, FEMENINO: { excel: 2.9, good: 3.3, avg: 3.9, poor: 4.6 } },
                SENIOR: { MASCULINO: { excel: 3.0, good: 3.5, avg: 4.2, poor: 5.0 }, FEMENINO: { excel: 3.2, good: 3.7, avg: 4.4, poor: 5.2 } }
            },
            grip: {
                INFANTIL: { MASCULINO: { excel: 45, good: 30, avg: 20, poor: 10 }, FEMENINO: { excel: 40, good: 25, avg: 15, poor: 8 } },
                JUNIOR: { MASCULINO: { excel: 60, good: 45, avg: 30, poor: 15 }, FEMENINO: { excel: 50, good: 35, avg: 22, poor: 12 } },
                JUVENIL: { MASCULINO: { excel: 80, good: 60, avg: 40, poor: 20 }, FEMENINO: { excel: 65, good: 45, avg: 30, poor: 15 } },
                ADULTO: { MASCULINO: { excel: 90, good: 70, avg: 45, poor: 25 }, FEMENINO: { excel: 75, good: 55, avg: 35, poor: 20 } },
                SENIOR: { MASCULINO: { excel: 70, good: 50, avg: 35, poor: 15 }, FEMENINO: { excel: 60, good: 40, avg: 25, poor: 12 } }
            },
            split: {
                INFANTIL: { MASCULINO: { excel: 5, good: 12, avg: 20, poor: 30 }, FEMENINO: { excel: 4, good: 10, avg: 18, poor: 26 } },
                JUNIOR: { MASCULINO: { excel: 8, good: 15, avg: 24, poor: 35 }, FEMENINO: { excel: 6, good: 12, avg: 20, poor: 30 } },
                JUVENIL: { MASCULINO: { excel: 10, good: 18, avg: 28, poor: 40 }, FEMENINO: { excel: 8, good: 15, avg: 24, poor: 35 } },
                ADULTO: { MASCULINO: { excel: 12, good: 20, avg: 30, poor: 45 }, FEMENINO: { excel: 10, good: 16, avg: 25, poor: 38 } },
                SENIOR: { MASCULINO: { excel: 15, good: 25, avg: 35, poor: 50 }, FEMENINO: { excel: 12, good: 20, avg: 30, poor: 42 } }
            },
            plank: {
                INFANTIL: { MASCULINO: { excel: 60, good: 45, avg: 30, poor: 15 }, FEMENINO: { excel: 60, good: 45, avg: 30, poor: 15 } },
                JUNIOR: { MASCULINO: { excel: 90, good: 65, avg: 45, poor: 25 }, FEMENINO: { excel: 80, good: 55, avg: 35, poor: 20 } },
                JUVENIL: { MASCULINO: { excel: 120, good: 90, avg: 60, poor: 35 }, FEMENINO: { excel: 100, good: 75, avg: 50, poor: 25 } },
                ADULTO: { MASCULINO: { excel: 150, good: 110, avg: 75, poor: 45 }, FEMENINO: { excel: 120, good: 90, avg: 60, poor: 35 } },
                SENIOR: { MASCULINO: { excel: 90, good: 65, avg: 45, poor: 25 }, FEMENINO: { excel: 75, good: 50, avg: 30, poor: 15 } }
            },
            jumpHorizontal: {
                INFANTIL: { MASCULINO: { excel: 160, good: 130, avg: 100, poor: 70 }, FEMENINO: { excel: 160, good: 130, avg: 100, poor: 70 } },
                JUNIOR: { MASCULINO: { excel: 200, good: 170, avg: 140, poor: 110 }, FEMENINO: { excel: 175, good: 145, avg: 120, poor: 95 } },
                JUVENIL: { MASCULINO: { excel: 235, good: 205, avg: 175, poor: 145 }, FEMENINO: { excel: 195, good: 170, avg: 145, poor: 115 } },
                ADULTO: { MASCULINO: { excel: 250, good: 220, avg: 190, poor: 155 }, FEMENINO: { excel: 210, good: 180, avg: 150, poor: 125 } },
                SENIOR: { MASCULINO: { excel: 210, good: 180, avg: 150, poor: 120 }, FEMENINO: { excel: 170, good: 140, avg: 115, poor: 90 } }
            },
            kickFlex: {
                INFANTIL: { MASCULINO: { excel: 115, good: 100, avg: 85, poor: 70 }, FEMENINO: { excel: 115, good: 100, avg: 85, poor: 70 } },
                JUNIOR: { MASCULINO: { excel: 125, good: 110, avg: 95, poor: 80 }, FEMENINO: { excel: 125, good: 110, avg: 95, poor: 80 } },
                JUVENIL: { MASCULINO: { excel: 130, good: 115, avg: 100, poor: 85 }, FEMENINO: { excel: 130, good: 115, avg: 100, poor: 85 } },
                ADULTO: { MASCULINO: { excel: 130, good: 115, avg: 100, poor: 85 }, FEMENINO: { excel: 130, good: 115, avg: 100, poor: 85 } },
                SENIOR: { MASCULINO: { excel: 115, good: 100, avg: 85, poor: 70 }, FEMENINO: { excel: 115, good: 100, avg: 85, poor: 70 } }
            },
            balance: {
                INFANTIL: { MASCULINO: { excel: 35, good: 25, avg: 15, poor: 7 }, FEMENINO: { excel: 35, good: 25, avg: 15, poor: 7 } },
                JUNIOR: { MASCULINO: { excel: 50, good: 35, avg: 22, poor: 12 }, FEMENINO: { excel: 50, good: 35, avg: 22, poor: 12 } },
                JUVENIL: { MASCULINO: { excel: 60, good: 45, avg: 30, poor: 15 }, FEMENINO: { excel: 60, good: 45, avg: 30, poor: 15 } },
                ADULTO: { MASCULINO: { excel: 60, good: 45, avg: 30, poor: 15 }, FEMENINO: { excel: 60, good: 45, avg: 30, poor: 15 } },
                SENIOR: { MASCULINO: { excel: 40, good: 28, avg: 18, poor: 8 }, FEMENINO: { excel: 40, good: 28, avg: 18, poor: 8 } }
            },
            shuttle: {
                INFANTIL: { MASCULINO: { excel: 9.8, good: 11.2, avg: 13.0, poor: 15.5 }, FEMENINO: { excel: 10.2, good: 11.6, avg: 13.5, poor: 16.0 } },
                JUNIOR: { MASCULINO: { excel: 9.2, good: 10.4, avg: 11.8, poor: 13.8 }, FEMENINO: { excel: 9.8, good: 11.0, avg: 12.5, poor: 14.5 } },
                JUVENIL: { MASCULINO: { excel: 8.8, good: 9.8, avg: 11.0, poor: 12.8 }, FEMENINO: { excel: 9.4, good: 10.5, avg: 11.8, poor: 13.6 } },
                ADULTO: { MASCULINO: { excel: 8.8, good: 9.8, avg: 11.0, poor: 12.8 }, FEMENINO: { excel: 9.4, good: 10.5, avg: 11.8, poor: 13.6 } },
                SENIOR: { MASCULINO: { excel: 9.8, good: 11.2, avg: 12.8, poor: 14.8 }, FEMENINO: { excel: 10.5, good: 12.0, avg: 13.8, poor: 15.8 } }
            },
            reaction: {
                INFANTIL: { MASCULINO: { excel: 0.38, good: 0.48, avg: 0.65, poor: 0.88 }, FEMENINO: { excel: 0.38, good: 0.48, avg: 0.65, poor: 0.88 } },
                JUNIOR: { MASCULINO: { excel: 0.30, good: 0.38, avg: 0.50, poor: 0.70 }, FEMENINO: { excel: 0.30, good: 0.38, avg: 0.50, poor: 0.70 } },
                JUVENIL: { MASCULINO: { excel: 0.26, good: 0.34, avg: 0.45, poor: 0.62 }, FEMENINO: { excel: 0.26, good: 0.34, avg: 0.45, poor: 0.62 } },
                ADULTO: { MASCULINO: { excel: 0.26, good: 0.34, avg: 0.45, poor: 0.62 }, FEMENINO: { excel: 0.26, good: 0.34, avg: 0.45, poor: 0.62 } },
                SENIOR: { MASCULINO: { excel: 0.32, good: 0.42, avg: 0.55, poor: 0.72 }, FEMENINO: { excel: 0.32, good: 0.42, avg: 0.55, poor: 0.72 } }
            },
            kickSpeed: {
                INFANTIL: { MASCULINO: { excel: 18, good: 14, avg: 10, poor: 6 }, FEMENINO: { excel: 18, good: 14, avg: 10, poor: 6 } },
                JUNIOR: { MASCULINO: { excel: 22, good: 18, avg: 13, poor: 8 }, FEMENINO: { excel: 20, good: 16, avg: 12, poor: 7 } },
                JUVENIL: { MASCULINO: { excel: 26, good: 21, avg: 16, poor: 11 }, FEMENINO: { excel: 24, good: 19, avg: 14, poor: 9 } },
                ADULTO: { MASCULINO: { excel: 26, good: 21, avg: 16, poor: 11 }, FEMENINO: { excel: 24, good: 19, avg: 14, poor: 9 } },
                SENIOR: { MASCULINO: { excel: 20, good: 15, avg: 11, poor: 7 }, FEMENINO: { excel: 18, good: 14, avg: 10, poor: 6 } }
            },
            anaerobic: {
                INFANTIL: { MASCULINO: { excel: 36, good: 28, avg: 20, poor: 12 }, FEMENINO: { excel: 36, good: 28, avg: 20, poor: 12 } },
                JUNIOR: { MASCULINO: { excel: 46, good: 36, avg: 26, poor: 16 }, FEMENINO: { excel: 42, good: 32, avg: 22, poor: 14 } },
                JUVENIL: { MASCULINO: { excel: 54, good: 44, avg: 32, poor: 22 }, FEMENINO: { excel: 48, good: 38, avg: 28, poor: 18 } },
                ADULTO: { MASCULINO: { excel: 54, good: 44, avg: 32, poor: 22 }, FEMENINO: { excel: 48, good: 38, avg: 28, poor: 18 } },
                SENIOR: { MASCULINO: { excel: 40, good: 30, avg: 22, poor: 14 }, FEMENINO: { excel: 36, good: 26, avg: 18, poor: 12 } }
            }
        };

        const g = gender === "FEMENINO" ? "FEMENINO" : "MASCULINO";
        const isInf = ageGroup === "INFANTIL";

        // Child specific baremos overrides
        const childBaremos = {
            longJump: { excel: 160, good: 130, avg: 100, poor: 70 },
            plank: { excel: 60, good: 45, avg: 30, poor: 15 },
            navette: { excel: 9.5, good: 11.0, avg: 13.0, poor: 16.0 },
            flamenco: { excel: 30, good: 20, avg: 12, poor: 5 },
            reaction: { excel: 0.35, good: 0.45, avg: 0.60, poor: 0.85 }
        };
        
        const pushupsEval = evalMetric(details.pushups, baremos.pushups[ageGroup][g]);

        const situpsEval = evalMetric(details.situps, baremos.situps[ageGroup][g]);

        const plankEval = evalMetric(details.plank, baremos.plank[ageGroup][g]);

        const flexibilityEval = evalMetric(details.flexibility, baremos.flexibility[ageGroup][g]);

        const cooperEval = evalMetric(details.cooper, baremos.cooper[ageGroup][g]);

        let jumpLongEval = null;
        let jumpHighEval = null;
        if (athlete.modalities && athlete.modalities.deportivo) {
            if (details.jumpLong !== null && details.jumpLong !== undefined && !isNaN(details.jumpLong)) {
                jumpLongEval = evalMetric(details.jumpLong, baremos.jumpLong[ageGroup][g]);
            }
            if (details.jumpHigh !== null && details.jumpHigh !== undefined && !isNaN(details.jumpHigh)) {
                jumpHighEval = evalMetric(details.jumpHigh, baremos.jumpHigh[ageGroup][g]);
            }
        }

        const idx = details.ruffierIndex;
        let ruffierEval = { score: 1, level: "Deficiente", cls: "danger" };
        if (idx <= 0) ruffierEval = { score: 10, level: "Excelente", cls: "success" };
        else if (idx <= 2) ruffierEval = { score: 9, level: "Excelente", cls: "success" };
        else if (idx <= 5) ruffierEval = { score: 8, level: "Bueno", cls: "success" };
        else if (idx <= 7.5) ruffierEval = { score: 7, level: "Bueno", cls: "success" };
        else if (idx <= 10) ruffierEval = { score: 6, level: "Medio", cls: "warning" };
        else if (idx <= 12.5) ruffierEval = { score: 5, level: "Medio", cls: "warning" };
        else if (idx <= 15) ruffierEval = { score: 4, level: "Insuficiente", cls: "danger" };
        else if (idx <= 17.5) ruffierEval = { score: 3, level: "Insuficiente", cls: "danger" };
        else if (idx <= 20) ruffierEval = { score: 2, level: "Deficiente", cls: "danger" };
        else ruffierEval = { score: 1, level: "Deficiente", cls: "danger" };

        // Evaluation of new combat metrics
        const rhrBrackets = { excel: 50, good: 60, avg: 72, poor: 85 };
        const rhrEval = evalMetricReverse(details.rhr, rhrBrackets);

        const jumpVerticalEval = isInf
            ? evalMetric(details.jumpVertical, childBaremos.flamenco)
            : evalMetric(details.jumpVertical, baremos.jumpVertical[ageGroup][g]);

        const jumpHorizontalEval = evalMetric(details.jumpHorizontal, baremos.jumpHorizontal[ageGroup][g]);

        const agilityEval = isInf
            ? evalMetricReverse(details.agility, childBaremos.reaction)
            : evalMetricReverse(details.agility, baremos.agility[ageGroup][g]);

        const shuttleEval = evalMetricReverse(details.shuttle, baremos.shuttle[ageGroup][g]);
        const reactionEval = evalMetricReverse(details.reaction, baremos.reaction[ageGroup][g]);

        const gripEval = evalMetric(details.grip, baremos.grip[ageGroup][g]);
        const splitEval = evalMetricReverse(details.split, baremos.split[ageGroup][g]);
        const kickFlexEval = evalMetric(details.kickFlex, baremos.kickFlex[ageGroup][g]);
        const balanceEval = evalMetric(details.balance, baremos.balance[ageGroup][g]);

        const kickSpeedEval = evalMetric(details.kickSpeed, baremos.kickSpeed[ageGroup][g]);
        const anaerobicEval = evalMetric(details.anaerobic, baremos.anaerobic[ageGroup][g]);

        const hyungsEval = evalTechnicalScore(details.scoreHyungs);
        const hosinsulEval = evalTechnicalScore(details.scoreHosinsul);
        const weaponsEval = evalTechnicalScore(details.scoreWeapons);

        const scoreFiguresSinEval = evalTechnicalScore(details.scoreFiguresSin);
        const scoreFiguresConEval = evalTechnicalScore(details.scoreFiguresCon);
        const scoreDemoEval = evalTechnicalScore(details.scoreDemo);

        // Body Composition & Anthropometry Indexes
        let imc = null;
        let imcLevel = "";
        let imcClass = "warning";
        if (details.weight && details.height) {
            const hMeters = details.height / 100;
            imc = details.weight / (hMeters * hMeters);
            if (imc < 18.5) { imcLevel = "Bajo Peso"; imcClass = "warning"; }
            else if (imc < 25.0) { imcLevel = "Normal"; imcClass = "success"; }
            else if (imc < 30.0) { imcLevel = "Sobrepeso"; imcClass = "warning"; }
            else { imcLevel = "Obesidad"; imcClass = "danger"; }
        }

        let whtr = null;
        let whtrLevel = "";
        let whtrClass = "warning";
        if (details.waist && details.height) {
            whtr = details.waist / details.height;
            if (whtr < 0.43) { whtrLevel = "Excelente (Muy Bajo Riesgo)"; whtrClass = "success"; }
            else if (whtr <= 0.45) { whtrLevel = "Bueno (Bajo Riesgo)"; whtrClass = "success"; }
            else if (whtr <= 0.52) { whtrLevel = "Moderado (Riesgo Moderado)"; whtrClass = "warning"; }
            else if (whtr <= 0.57) { whtrLevel = "Elevado (Alto Riesgo)"; whtrClass = "danger"; }
            else { whtrLevel = "Muy Elevado (Muy Alto Riesgo)"; whtrClass = "danger"; }
        }

        // Ape Index (Envergadura vs Estatura)
        let apeIndex = null;
        let apeLevel = "";
        if (details.wingspan && details.height) {
            apeIndex = details.wingspan / details.height;
            if (apeIndex >= 1.03) apeLevel = "Alcance Superior (+3%)";
            else if (apeIndex >= 1.00) apeLevel = "Alcance Proporcional";
            else apeLevel = "Alcance Compacto";
        }

        const scores = [];
        if (pushupsEval) scores.push(pushupsEval.score);
        if (situpsEval) scores.push(situpsEval.score);
        if (plankEval) scores.push(plankEval.score);
        if (flexibilityEval) scores.push(flexibilityEval.score);
        if (cooperEval) scores.push(cooperEval.score);
        if (ruffierEval) scores.push(ruffierEval.score);
        if (rhrEval) scores.push(rhrEval.score);
        if (jumpLongEval) scores.push(jumpLongEval.score);
        if (jumpHighEval) scores.push(jumpHighEval.score);
        if (jumpVerticalEval) scores.push(jumpVerticalEval.score);
        if (jumpHorizontalEval) scores.push(jumpHorizontalEval.score);
        if (agilityEval) scores.push(agilityEval.score);
        if (shuttleEval) scores.push(shuttleEval.score);
        if (reactionEval) scores.push(reactionEval.score);
        if (gripEval) scores.push(gripEval.score);
        if (splitEval) scores.push(splitEval.score);
        if (kickFlexEval) scores.push(kickFlexEval.score);
        if (balanceEval) scores.push(balanceEval.score);
        if (kickSpeedEval) scores.push(kickSpeedEval.score);
        if (anaerobicEval) scores.push(anaerobicEval.score);

        const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        let globalLevel = "Medio";
        let globalCls = "warning";
        if (avgScore >= 8.5) { globalLevel = "Excelente"; globalCls = "success"; }
        else if (avgScore >= 7.0) { globalLevel = "Bueno"; globalCls = "success"; }
        else if (avgScore >= 4.5) { globalLevel = "Medio"; globalCls = "warning"; }
        else if (avgScore >= 3.0) { globalLevel = "Insuficiente"; globalCls = "danger"; }
        else { globalLevel = "Deficiente"; globalCls = "danger"; }

        return {
            pushups: pushupsEval,
            situps: situpsEval,
            plank: plankEval,
            flexibility: flexibilityEval,
            cooper: cooperEval,
            ruffier: ruffierEval,
            rhr: rhrEval,
            jumpLong: jumpLongEval,
            jumpHigh: jumpHighEval,
            jumpVertical: jumpVerticalEval,
            jumpHorizontal: jumpHorizontalEval,
            agility: agilityEval,
            shuttle: shuttleEval,
            reaction: reactionEval,
            grip: gripEval,
            split: splitEval,
            kickFlex: kickFlexEval,
            balance: balanceEval,
            kickSpeed: kickSpeedEval,
            anaerobic: anaerobicEval,
            hyungs: hyungsEval,
            hosinsul: hosinsulEval,
            weapons: weaponsEval,
            scoreFiguresSin: scoreFiguresSinEval,
            scoreFiguresCon: scoreFiguresConEval,
            scoreDemo: scoreDemoEval,
            imc,
            imcLevel,
            imcClass,
            whtr,
            whtrLevel,
            whtrClass,
            apeIndex,
            apeLevel,
            ageGroup,
            globalScore: Math.round(avgScore * 10) / 10,
            globalLevel,
            globalCls
        };
    }

    /**
     * Generar HTML de la Ficha de Rendimiento Físico
     */


HapkidoApp.prototype.generatePhysicalReportHTML = function(athlete, rec) {
        const evalResults = rec.physicalDetails.evalResults;
        if (!evalResults) return `
            <div class="empty-list">
                <p>No hay datos de evaluación física disponibles para esta prueba.</p>
            </div>
        `;

        const renderMetricRow = (name, rawVal, unit, evalObj) => {
            if (!evalObj) return '';
            return `
                <div class="physical-metric-row">
                    <div class="physical-metric-info">
                        <span class="physical-metric-name">${name}</span>
                        <span class="physical-metric-raw">Registro: ${rawVal} ${unit}</span>
                    </div>
                    <div class="physical-metric-score-display">
                        <span class="physical-metric-score-num">${evalObj.score.toFixed(1)}/10</span>
                        <span class="badge ${evalObj.cls}" style="font-size: 10px; padding: 2px 6px;">${evalObj.level}</span>
                    </div>
                </div>
            `;
        };

        const details = rec.physicalDetails;
        const isInf = evalResults.ageGroup === "INFANTIL";

        let namePushups = "Flexiones de pecho (1 min - reps)";
        let unitPushups = "reps";
        let nameSitups = "Abdominales (1 min - reps)";
        let unitSitups = "reps";
        let nameCooper = "Test de Cooper (Distancia)";
        let unitCooper = "m";
        let nameJump = "Salto Vertical / Sargent Jump";
        let unitJump = "cm";
        let nameAgility = "Test de Velocidad/Agilidad 10m";

        if (isInf) {
            namePushups = "Flexiones adaptadas (reps)";
            unitPushups = "reps";
            nameSitups = "Abdominales adaptados (reps)";
            unitSitups = "reps";
            nameCooper = "Resistencia (Navette)";
            unitCooper = "etapas";
            nameJump = "Salto Vertical";
            unitJump = "cm";
            nameAgility = "Velocidad 10m";
        }

        return `
            <div class="physical-score-summary">
                <div class="physical-global-score-container">
                    <span class="physical-global-score-val">${evalResults.globalScore.toFixed(1)}</span>
                    <span class="physical-global-score-label">Rendimiento General</span>
                    <span class="badge ${evalResults.globalCls}" style="margin-top: 8px; font-weight: 700; padding: 4px 12px; font-size: 13px;">${evalResults.globalLevel}</span>
                </div>
                <div class="physical-metrics-details">
                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Composición Corporal</div>
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Índice de Masa Corporal (IMC)</span>
                            <span class="physical-metric-raw">Registro: ${details.weight ? `${details.weight.toFixed(1)} kg` : '--'} / ${details.height ? `${details.height} cm` : '--'}</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${evalResults.imc ? evalResults.imc.toFixed(2) : '--'}</span>
                            <span class="badge ${evalResults.imcClass || ''}" style="font-size: 10px; padding: 2px 6px;">${evalResults.imcLevel || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Relación Cintura-Estatura (WHtR)</span>
                            <span class="physical-metric-raw">Cintura: ${details.waist ? `${details.waist} cm` : '--'}</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${evalResults.whtr ? evalResults.whtr.toFixed(3) : '--'}</span>
                            <span class="badge ${evalResults.whtrClass || ''}" style="font-size: 10px; padding: 2px 6px;">${evalResults.whtrLevel || 'N/A'}</span>
                        </div>
                    </div>
                    ${details.fat ? `
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Grasa Corporal</span>
                            <span class="physical-metric-raw">Registro: ${details.fat.toFixed(1)}%</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${details.fat.toFixed(1)}%</span>
                            <span class="badge success" style="font-size: 10px; padding: 2px 6px;">Medido</span>
                        </div>
                    </div>
                    ` : ''}
                    ${details.wingspan ? `
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Envergadura de Brazos (Alcance)</span>
                            <span class="physical-metric-raw">Registro: ${details.wingspan} cm (Ape Index: ${evalResults.apeIndex ? evalResults.apeIndex.toFixed(2) : '--'})</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${details.wingspan} cm</span>
                            <span class="badge success" style="font-size: 10px; padding: 2px 6px;">${evalResults.apeLevel || 'Medido'}</span>
                        </div>
                    </div>
                    ` : ''}
                    ${details.neck ? `
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Circunferencia de Cuello</span>
                            <span class="physical-metric-raw">Registro: ${details.neck} cm</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${details.neck} cm</span>
                            <span class="badge success" style="font-size: 10px; padding: 2px 6px;">Medido</span>
                        </div>
                    </div>
                    ` : ''}
                    ${details.thigh ? `
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Perímetro de Muslo</span>
                            <span class="physical-metric-raw">Registro: ${details.thigh} cm</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${details.thigh} cm</span>
                            <span class="badge success" style="font-size: 10px; padding: 2px 6px;">Medido</span>
                        </div>
                    </div>
                    ` : ''}
                    ${(details.skinfoldTri || details.skinfoldAbd) ? `
                    <div class="physical-metric-row">
                        <div class="physical-metric-info">
                            <span class="physical-metric-name">Pliegues Cutáneos (Tríceps / Abd)</span>
                            <span class="physical-metric-raw">${details.skinfoldTri || '--'} mm / ${details.skinfoldAbd || '--'} mm</span>
                        </div>
                        <div class="physical-metric-score-display">
                            <span class="physical-metric-score-num">${((details.skinfoldTri || 0) + (details.skinfoldAbd || 0)).toFixed(1)} mm</span>
                            <span class="badge warning" style="font-size: 10px; padding: 2px 6px;">Antropometría</span>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Evaluación Cardiovascular & Basal</div>
                    ${isInf ? '' : renderMetricRow("Capacidad Cardiovascular (Test Ruffier)", details.ruffierIndex, "Index", evalResults.ruffier)}
                    ${renderMetricRow("FC en Reposo Basal", details.rhr, "lpm", evalResults.rhr)}

                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Fuerza, Core y Resistencia Muscular</div>
                    ${renderMetricRow(namePushups, details.pushups, unitPushups, evalResults.pushups)}
                    ${renderMetricRow(nameSitups, details.situps, unitSitups, evalResults.situps)}
                    ${renderMetricRow("Plancha Prona Isométrica", details.plank, "seg", evalResults.plank)}
                    ${isInf ? '' : renderMetricRow("Fuerza Agarre (Dead Hang)", details.grip, "seg", evalResults.grip)}

                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Potencia Explosiva y Saltabilidad</div>
                    ${renderMetricRow(nameJump, details.jumpVertical, unitJump, evalResults.jumpVertical)}
                    ${renderMetricRow("Salto Horizontal a Pies Juntos", details.jumpHorizontal, "cm", evalResults.jumpHorizontal)}
                    ${renderMetricRow(nameCooper, details.cooper, unitCooper, evalResults.cooper)}

                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Flexibilidad, Movilidad y Equilibrio</div>
                    ${renderMetricRow("Flexibilidad (Sit & Reach)", details.flexibility, "cm", evalResults.flexibility)}
                    ${renderMetricRow("Flexibilidad Abductora (Split)", details.split, "cm", evalResults.split)}
                    ${renderMetricRow("Flexibilidad Activa de Patada", details.kickFlex, "%", evalResults.kickFlex)}
                    ${renderMetricRow("Test del Flamenco / Equilibrio", details.balance, "seg", evalResults.balance)}

                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Velocidad, Agilidad y Reflejos</div>
                    ${renderMetricRow(nameAgility, details.agility, "seg", evalResults.agility)}
                    ${renderMetricRow("Agilidad Shuttle Run 4×10m", details.shuttle, "seg", evalResults.shuttle)}
                    ${renderMetricRow("Tiempo de Reacción Técnica", details.reaction, "seg", evalResults.reaction)}

                    ${(evalResults.kickSpeed || evalResults.anaerobic) ? `
                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Rendimiento Específico en Combate</div>
                    ${renderMetricRow("Velocidad de Patada (FSKT 10s)", details.kickSpeed, "reps", evalResults.kickSpeed)}
                    ${renderMetricRow("Potencia Anaeróbica Ráfaga 30s", details.anaerobic, "reps", evalResults.anaerobic)}
                    ` : ''}

                    ${(evalResults.jumpLong || evalResults.jumpHigh || evalResults.scoreFiguresSin || evalResults.scoreFiguresCon || evalResults.scoreDemo) ? `
                    <div style="grid-column: 1 / -1; border-bottom: 1px solid rgba(255,255,255,0.08); padding-top: 10px; padding-bottom: 5px; margin-bottom: 5px; font-weight: 600; color: var(--primary);">Pruebas Competitivas Deportivas</div>
                    ${renderMetricRow("Salto Largo", details.jumpLong, "m", evalResults.jumpLong)}
                    ${renderMetricRow("Salto Alto", details.jumpHigh, "m", evalResults.jumpHigh)}
                    ${renderMetricRow("Figuras Sin Armas", details.scoreFiguresSin, "Pts", evalResults.scoreFiguresSin)}
                    ${renderMetricRow("Figuras Con Armas", details.scoreFiguresCon, "Pts", evalResults.scoreFiguresCon)}
                    ${renderMetricRow("Demostraciones", details.scoreDemo, "Pts", evalResults.scoreDemo)}
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Data Analysis & Visualizations (Chart.js Integration)
     */

HapkidoApp.prototype.renderPhysicalProfileChart = function(canvasId, evalResults) {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded.');
            return;
        }
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const isInf = evalResults.ageGroup === "INFANTIL";
        
        let labels = [];
        let data = [];
        
        if (isInf) {
            const metricsMap = [
                { label: 'Velocidad', evalObj: evalResults.agility },
                { label: 'Flexibilidad', evalObj: evalResults.flexibility || evalResults.split },
                { label: 'Equilibrio', evalObj: evalResults.balance },
                { label: 'Fuerza', evalObj: evalResults.pushups },
                { label: 'Core', evalObj: evalResults.plank || evalResults.situps },
                { label: 'Reacción', evalObj: evalResults.reaction },
                { label: 'Explosividad', evalObj: evalResults.jumpHorizontal || evalResults.jumpVertical },
                { label: 'Pateo', evalObj: evalResults.kickSpeed }
            ];

            const activeMetrics = metricsMap.filter(m => m.evalObj && m.evalObj.score !== null && m.evalObj.score !== undefined);
            labels = activeMetrics.map(m => m.label);
            data = activeMetrics.map(m => m.evalObj.score);
        } else {
            const metricsMap = [
                { label: 'Cardio', evalObj: evalResults.ruffier },
                { label: 'Fuerza Sup.', evalObj: evalResults.pushups },
                { label: 'Core / Plancha', evalObj: evalResults.plank || evalResults.situps },
                { label: 'Resistencia', evalObj: evalResults.cooper },
                { label: 'Flexibilidad', evalObj: evalResults.flexibility || evalResults.split },
                { label: 'Flex. Patada', evalObj: evalResults.kickFlex },
                { label: 'Explosividad', evalObj: evalResults.jumpHorizontal || evalResults.jumpVertical },
                { label: 'Velocidad 10m', evalObj: evalResults.agility },
                { label: 'Agilidad 4x10m', evalObj: evalResults.shuttle },
                { label: 'Reacción', evalObj: evalResults.reaction },
                { label: 'Equilibrio', evalObj: evalResults.balance },
                { label: 'Pateo FSKT', evalObj: evalResults.kickSpeed },
                { label: 'Potencia 30s', evalObj: evalResults.anaerobic },
                { label: 'Agarre', evalObj: evalResults.grip }
            ];

            const activeMetrics = metricsMap.filter(m => m.evalObj && m.evalObj.score !== null && m.evalObj.score !== undefined);
            labels = activeMetrics.map(m => m.label);
            data = activeMetrics.map(m => m.evalObj.score);
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Puntaje de Capacidad (1-10)',
                    data: data,
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    borderColor: '#38bdf8',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                        pointLabels: {
                            color: '#e2e8f0',
                            font: { family: "'Outfit', sans-serif", size: 11 }
                        },
                        ticks: {
                            color: '#94a3b8',
                            backdropColor: 'transparent',
                            stepSize: 2
                        },
                        min: 0,
                        max: 10
                    }
                }
            }
        });
    }


HapkidoApp.prototype.deleteRecord = function(recordId, athleteId) {
        if (confirm("¿Está seguro de que desea eliminar este registro?")) {
            this.data.records = this.data.records.filter(r => r.id !== recordId);
            this.saveData();
            this.loadAthleteAnalysis(athleteId);
        }
    }

    /**
     * Database backups: export/import
     */

HapkidoApp.prototype.generateTrainingPlanHTML = function(athlete, physRecord) {
        const ageCategory = this.calculateAgeCategory(athlete.birthdate);
        const age = this.calculateAge(athlete.birthdate);
        const ruffier = physRecord.physicalDetails.ruffierIndex;
        const level = physRecord.physicalDetails.ruffierLevel;
        
        let cardioRecommendation = "";
        let cardioClass = "success";
        let cardioIcon = "fa-circle-check";
        
        if (ruffier <= 0) {
            cardioRecommendation = "<strong>Excelente adaptación cardiovascular (Atleta de alto nivel).</strong> Su corazón responde de manera sobresaliente al esfuerzo. Apto para cargas de potencia e intensidad máxima sin restricciones. Enfoque láctico puro en temporada.";
            cardioClass = "success";
            cardioIcon = "fa-circle-check";
        } else if (ruffier <= 5) {
            cardioRecommendation = "<strong>Buena adaptación cardiovascular.</strong> Nivel aeróbico e índice de recuperación óptimos. Puede realizar entrenamientos de potencia e intervalos de alta intensidad.";
            cardioClass = "success";
            cardioIcon = "fa-circle-check";
        } else if (ruffier <= 10) {
            cardioRecommendation = "<strong>Adaptación cardiovascular promedio/regular.</strong> Fatiga moderada o falta de base. Se sugiere incorporar 2 sesiones semanales de carrera continua regenerativa (Zona 2, 30 min) para acelerar la recuperación entre rounds y combates.";
            cardioClass = "warning";
            cardioIcon = "fa-circle-exclamation";
        } else if (ruffier <= 15) {
            cardioRecommendation = "<strong>Adaptación insuficiente.</strong> ¡Alerta de fatiga! Evitar entrenamientos intensos continuos. Enfoque primario en re-acondicionamiento aeróbico (carreras muy suaves a 120-135 lpm por 3 semanas) antes de simular combates completos.";
            cardioClass = "danger";
            cardioIcon = "fa-triangle-exclamation";
        } else {
            cardioRecommendation = "<strong>Adaptación deficiente o peligrosa.</strong> ¡Cuidado cardiovascular! Excluir sparrings intensos y sprints máximos. Realizar chequeo médico y entrenar únicamente a intensidad aeróbica regenerativa suave con descansos prolongados.";
            cardioClass = "danger";
            cardioIcon = "fa-triangle-exclamation";
        }

        // Determinar fortalezas y debilidades a partir del motor de evaluación
        let strengths = [];
        let weaknesses = [];
        let correctiveFocus = [];

        const evalResults = physRecord.physicalDetails.evalResults;
        if (evalResults) {
            const checkStrength = (evalObj, name) => {
                if (evalObj && evalObj.score >= 8.5) {
                    strengths.push(`${name}: Excelente (${evalObj.score.toFixed(1)}/10 - ${evalObj.level})`);
                }
            };
            const checkWeakness = (evalObj, name) => {
                if (evalObj && evalObj.score < 5.0) {
                    weaknesses.push(`${name}: Deficiente (${evalObj.score.toFixed(1)}/10 - ${evalObj.level})`);
                }
            };

            checkStrength(evalResults.ruffier, "Cardio");
            checkWeakness(evalResults.ruffier, "Cardio");

            checkStrength(evalResults.pushups, "Tren Superior (Flexiones)");
            checkWeakness(evalResults.pushups, "Tren Superior (Flexiones)");

            checkStrength(evalResults.situps, "Core (Abdominales)");
            checkWeakness(evalResults.situps, "Core (Abdominales)");

            checkStrength(evalResults.flexibility, "Flexibilidad");
            checkWeakness(evalResults.flexibility, "Flexibilidad");

            checkStrength(evalResults.cooper, "Resistencia (Cooper)");
            checkWeakness(evalResults.cooper, "Resistencia (Cooper)");

            checkStrength(evalResults.jumpLong, "Salto Largo");
            checkWeakness(evalResults.jumpLong, "Salto Largo");

            checkStrength(evalResults.jumpHigh, "Salto Alto");
            checkWeakness(evalResults.jumpHigh, "Salto Alto");

            checkStrength(evalResults.jumpVertical, "Salto Vertical");
            checkWeakness(evalResults.jumpVertical, "Salto Vertical");

            checkStrength(evalResults.agility, "Agilidad (10m)");
            checkWeakness(evalResults.agility, "Agilidad (10m)");

            checkStrength(evalResults.grip, "Fuerza de Agarre (Grip)");
            checkWeakness(evalResults.grip, "Fuerza de Agarre (Grip)");

            checkStrength(evalResults.split, "Split Lateral");
            checkWeakness(evalResults.split, "Split Lateral");

            checkStrength(evalResults.hyungs, "Hyungs (Formas)");
            checkWeakness(evalResults.hyungs, "Hyungs (Formas)");

            checkStrength(evalResults.hosinsul, "Hosinsul (Defensa Personal)");
            checkWeakness(evalResults.hosinsul, "Hosinsul (Defensa Personal)");

            checkStrength(evalResults.weapons, "Mu Do (Manejo de Armas)");
            checkWeakness(evalResults.weapons, "Mu Do (Manejo de Armas)");

            // New combat metrics
            checkStrength(evalResults.plank, "Plancha Prona (Core Isométrico)");
            checkWeakness(evalResults.plank, "Plancha Prona (Core Isométrico)");

            checkStrength(evalResults.rhr, "FC en Reposo (Adaptación Cardíaca)");
            checkWeakness(evalResults.rhr, "FC en Reposo (Adaptación Cardíaca)");

            checkStrength(evalResults.jumpHorizontal, "Salto Horizontal (Potencia Explosiva)");
            checkWeakness(evalResults.jumpHorizontal, "Salto Horizontal (Potencia Explosiva)");

            checkStrength(evalResults.kickFlex, "Flexibilidad Activa de Patada");
            checkWeakness(evalResults.kickFlex, "Flexibilidad Activa de Patada");

            checkStrength(evalResults.balance, "Equilibrio Unipodal (Flamenco)");
            checkWeakness(evalResults.balance, "Equilibrio Unipodal (Flamenco)");

            checkStrength(evalResults.shuttle, "Agilidad Shuttle Run 4×10m");
            checkWeakness(evalResults.shuttle, "Agilidad Shuttle Run 4×10m");

            checkStrength(evalResults.reaction, "Tiempo de Reacción Técnica");
            checkWeakness(evalResults.reaction, "Tiempo de Reacción Técnica");

            checkStrength(evalResults.kickSpeed, "Velocidad de Patada (FSKT)");
            checkWeakness(evalResults.kickSpeed, "Velocidad de Patada (FSKT)");

            checkStrength(evalResults.anaerobic, "Potencia Anaeróbica Ráfaga 30s");
            checkWeakness(evalResults.anaerobic, "Potencia Anaeróbica Ráfaga 30s");

            // Corrective focuses for scores below 6.0
            if (evalResults.ruffier && evalResults.ruffier.score < 6.0) {
                correctiveFocus.push({
                    title: "Acondicionamiento Cardiovascular (Ruffier bajo)",
                    desc: "Implementar 2 sesiones semanales de carrera continua regenerativa a intensidad moderada (Zona 2 - 130 lpm) durante 40 minutos para mejorar la velocidad de recuperación entre asaltos y reducir el índice de fatiga."
                });
            }
            if (evalResults.pushups && evalResults.pushups.score < 6.0) {
                correctiveFocus.push({
                    title: "Fuerza Tren Superior (Flexiones bajo)",
                    desc: "Incorporar rutinas de empuje en días alternos: 4 series de flexiones al fallo técnico (con rodillas apoyadas si es necesario para acumular volumen). Trabajar fondos en banco para fortalecer tríceps y deltoides."
                });
            }
            if (evalResults.situps && evalResults.situps.score < 6.0) {
                correctiveFocus.push({
                    title: "Fuerza del Core / Estabilidad (Abdominales bajo)",
                    desc: "Realizar planchas isométricas frontales y laterales (3 series de 45 segundos), elevación de piernas colgado para el abdomen inferior, y rotaciones con banda elástica (anti-rotación) para estabilizar el centro corporal."
                });
            }
            if (evalResults.flexibility && evalResults.flexibility.score < 6.0) {
                correctiveFocus.push({
                    title: "Flexibilidad Dinámica y PNF (Flexibilidad bajo)",
                    desc: "Realizar sesiones de estiramiento pasivo asistido y facilitación neuromuscular propioceptiva (FNP) post-entrenamiento (foco en isquiotibiales y cadera). Esto liberará la musculatura para lograr patadas altas fluidas."
                });
            }
            if (evalResults.cooper && evalResults.cooper.score < 6.0) {
                correctiveFocus.push({
                    title: "Capacidad Aeróbica y VO2 Máx (Cooper bajo)",
                    desc: "Añadir entrenamientos de intervalos extensos: 4 series de 800 metros a ritmo exigente (80% FCM) con 2 minutos de descanso activo caminando. Aumentará la resistencia pulmonar y tolerancia al cansancio en el round final."
                });
            }
            if ((evalResults.jumpLong && evalResults.jumpLong.score < 6.0) || (evalResults.jumpHigh && evalResults.jumpHigh.score < 6.0)) {
                correctiveFocus.push({
                    title: "Pliometría y Fuerza Explosiva (Saltos bajo)",
                    desc: "Incorporar multisaltos, saltos al cajón (Box Jumps de 50-60cm) y sentadillas explosivas con salto (Jump Squats) en días de potencia. Enfocarse en la fase de amortiguación y el despegue inmediato para activar fibras de contracción rápida."
                });
            }
            if (evalResults.jumpVertical && evalResults.jumpVertical.score < 6.0) {
                correctiveFocus.push({
                    title: "Potencia Vertical y Reactividad (Salto Vertical bajo)",
                    desc: "Realizar ejercicios de pliometría vertical: saltos de profundidad (Depth Jumps), saltos repetitivos sobre obstáculos y sentadillas búlgaras con salto para mejorar la reactividad y fuerza concéntrica."
                });
            }
            if (evalResults.agility && evalResults.agility.score < 6.0) {
                correctiveFocus.push({
                    title: "Drills de Agilidad y Coordinación (Agilidad baja)",
                    desc: "Realizar ejercicios en escalera de coordinación (skipping, lateral shuffle, ickey shuffle) y drills de cambio de dirección rápido (test T, sprint de ida y vuelta 10m) para optimizar la velocidad y el balance dinámico."
                });
            }
            if (evalResults.grip && evalResults.grip.score < 6.0) {
                correctiveFocus.push({
                    title: "Fuerza de Agarre / Resistencia (Fuerza de Agarre baja)",
                    desc: "Implementar colgamientos pasivos en barra (Dead Hang) de 3 series al fallo y caminatas de granjero (Farmer's Walk) con peso progresivo para fortalecer la musculatura flexora del antebrazo, vital para el Hosinsul."
                });
            }
            if (evalResults.split && evalResults.split.score < 6.0) {
                correctiveFocus.push({
                    title: "Flexibilidad Lateral y Estiramiento de Aductores (Split bajo)",
                    desc: "Realizar estiramientos específicos de aductores (estiramiento de rana, split asistido con bloques) y ejercicios de movilidad de cadera activa 3 veces por semana para mejorar la distancia del split y la altura de patadas laterales."
                });
            }
            if (evalResults.hyungs && evalResults.hyungs.score < 6.0) {
                correctiveFocus.push({
                    title: "Puesta a Punto de Hyungs / Formas (Hyungs bajo)",
                    desc: "Practicar las formas frente al espejo prestando especial atención al eje de giro, transiciones y balance. Realizar pausas isométricas de 3 segundos en posiciones bajas para fortalecer la estabilidad postural."
                });
            }
            if (evalResults.hosinsul && evalResults.hosinsul.score < 6.0) {
                correctiveFocus.push({
                    title: "Tiempo de Reacción y Centro de Gravedad en Hosinsul (Hosinsul bajo)",
                    desc: "Ejecutar defensas ante agarres con ojos cerrados (reacción táctil), practicando la redirección de fuerza del oponente sin oponer resistencia directa, enfocándose en romper su centro de gravedad y eje."
                });
            }
            if (evalResults.weapons && evalResults.weapons.score < 6.0) {
                correctiveFocus.push({
                    title: "Precisión y Control de Armas - Mu Do (Armas bajo)",
                    desc: "Realizar cortes y bloqueos repetitivos en bastón corto (Dan Bong) o sable (Gum) frente a un espejo, buscando fluidez, alineación del arma con la muñeca y control de la desaceleración del arma."
                });
            }
            // New combat-specific corrective focuses
            if (evalResults.plank && evalResults.plank.score < 6.0) {
                correctiveFocus.push({
                    title: "Estabilidad del Core Isométrico (Plancha Prona baja)",
                    desc: "Realizar series progresivas de plancha frontal y lateral: comenzar con 3×30s e incrementar 5s por semana hasta alcanzar 90s. Incluir variantes con elevación de pierna y brazo alterno para activar los estabilizadores profundos del tronco, fundamentales para proyecciones (Deonjigi)."
                });
            }
            if (evalResults.rhr && evalResults.rhr.score < 6.0) {
                correctiveFocus.push({
                    title: "Adaptación Cardiovascular Basal (FC en Reposo elevada)",
                    desc: "Implementar 3 sesiones semanales de cardio regenerativo en Zona 2 (caminar rápido, trote suave, bicicleta) de 30-45 minutos para desarrollar la eficiencia del músculo cardíaco. Monitorear la FC matutina semanalmente como indicador de sobreentrenamiento."
                });
            }
            if (evalResults.jumpHorizontal && evalResults.jumpHorizontal.score < 6.0) {
                correctiveFocus.push({
                    title: "Potencia Horizontal del Tren Inferior (Salto Horizontal bajo)",
                    desc: "Incorporar sentadillas explosivas con salto hacia adelante (Broad Jumps) de 4 series × 5 repeticiones, saltos de rana progresivos y trabajo excéntrico de cuádriceps para fortalecer la fase de despegue. Esto mejorará el impulso necesario para técnicas de derribo y Naeryo Chagi."
                });
            }
            if (evalResults.kickFlex && evalResults.kickFlex.score < 6.0) {
                correctiveFocus.push({
                    title: "Rango Activo de Pateo (Flexibilidad Activa de Patada baja)",
                    desc: "Realizar elevaciones de pierna controladas (front raises, side raises) de 3×10 por pierna cada sesión. Complementar con estiramiento dinámico de isquiotibiales y flexores de cadera antes de cada entrenamiento. El objetivo es alcanzar al menos el 100% de la estatura con patada frontal."
                });
            }
            if (evalResults.balance && evalResults.balance.score < 6.0) {
                correctiveFocus.push({
                    title: "Propiocepción y Equilibrio Unipodal (Test del Flamenco bajo)",
                    desc: "Practicar posiciones de una pierna con ojos cerrados (30s × 3 series por pierna), ejercicios sobre plataforma inestable (bosu, cojín) y patadas lentas sostenidas a media altura durante 5 segundos. Esto estabilizará la base para patadas altas y posiciones de combate."
                });
            }
            if (evalResults.shuttle && evalResults.shuttle.score < 6.0) {
                correctiveFocus.push({
                    title: "Agilidad y Cambio de Dirección (Shuttle Run 4×10m alto)",
                    desc: "Realizar drills de agilidad en T-test, escalera de coordinación (skipping, lateral shuffle, carioca) y ejercicios de deceleración controlada 3 veces por semana. Simular desplazamientos defensivos de combate con cambios bruscos de dirección en distancias cortas."
                });
            }
            if (evalResults.reaction && evalResults.reaction.score < 6.0) {
                correctiveFocus.push({
                    title: "Velocidad de Reacción Motriz (Tiempo de Reacción alto)",
                    desc: "Entrenar reflejos con compañero usando señales visuales y auditivas: caída de regla, paleta de reacción, o esquive ante ataques sorpresa de Bandal Chagi. Implementar juegos de reacción tipo 'palo loco' donde se deben atrapar objetos caídos o interceptar ataques aleatorios."
                });
            }
            if (evalResults.kickSpeed && evalResults.kickSpeed.score < 6.0) {
                correctiveFocus.push({
                    title: "Frecuencia de Pateo (FSKT bajo)",
                    desc: "Realizar series de patadas circulares (Bandal Chagi) al escudo de mano en intervalos de 10s máximos × 6 series con 30s de descanso. Enfocar el trabajo de cadera (rotación rápida) y contracción del recto femoral. Complementar con sprints cortos de 10m para velocidad neuromuscular."
                });
            }
            if (evalResults.anaerobic && evalResults.anaerobic.score < 6.0) {
                correctiveFocus.push({
                    title: "Capacidad Anaeróbica de Combate (Potencia Ráfaga 30s baja)",
                    desc: "Implementar entrenamientos de HIIT específico para combate: encadenamientos de Bandal + Yop + Ap Chagi durante 30s máximos × 5 series con 60s de recuperación activa (desplazamientos suaves). El objetivo es acumular volumen en zona láctica para tolerar la fatiga competitiva de rounds continuos."
                });
            }
        }

        if (strengths.length === 0) strengths.push("Desarrollo general balanceado en su nivel de inicio");
        if (weaknesses.length === 0) weaknesses.push("No se identificaron debilidades críticas en esta primera evaluación");

        // Rutinas metodológicas según edad biológica
        let offSeasonPlan = [];
        let inSeasonPlan = [];

        if (age < 12) {
            offSeasonPlan = [
                "Drills de coordinación motora fina y propiocepción (juegos de balance).",
                "Estiramiento suave y lúdico para preservar flexibilidad de cadera.",
                "Práctica de caídas básicas de frente, lado y espalda (Nakbeop).",
                "Golpes al aire controlando el equilibrio corporal."
            ];
            inSeasonPlan = [
                "Juegos de velocidad de reacción rápida con silbato/compañero.",
                "Combates adaptados sin contacto severo, usando protecciones completas.",
                "Simulaciones divertidas de salto de Rana para salto de longitud.",
                "Figuras infantiles cortas de exhibición."
            ];
        } else if (age >= 12 && age <= 14) {
            offSeasonPlan = [
                "Calistenia sistemática (flexiones, sentadillas, dominadas asistidas).",
                "Flexibilidad dinámica guiada para patadas altas.",
                "Luxaciones básicas de muñeca y codo ante agarres comunes.",
                "Lanzamientos sencillos por desequilibrio (cadera)."
            ];
            inSeasonPlan = [
                "Sprints cortos (15-20 metros) para velocidad alactácida.",
                "Saltos verticales y horizontales midiendo marcas semanalmente.",
                "Táctica deportiva: combinaciones de patada al tórax y golpe de mano.",
                "Combate simulado con pausas tácticas de 20 segundos de descanso."
            ];
        } else if (age >= 15 && age <= 17) {
            offSeasonPlan = [
                "Fuerza muscular de base con pesas ligeras (60% 1RM) 2 veces por semana.",
                "Entrenamiento profundo de flexibilidad PNF para acortar piernas.",
                "Luxaciones avanzadas en suelo y defensa personal tradicional.",
                "Técnicas tradicionales de lances y caídas complejas con rodamiento."
            ];
            inSeasonPlan = [
                "HIIT específico para resistencia láctica (30s de ráfagas x 30s descanso).",
                "Entrenamiento de pliometría de piernas (saltos al cajón alto).",
                "Combates de 2 rounds de 2 minutos continuos con protecciones.",
                "Táctica competitiva en clinch: lances y barridos rápidos en menos de 8s."
            ];
        } else if (age >= 18 && age <= 35) {
            offSeasonPlan = [
                "Fuerza máxima y potencia muscular (pesas 75-85% 1RM, sentadillas, press).",
                "Desarrollo máximo de flexibilidad y split estático completo.",
                "Defensa personal contra ataques sorpresa, armas blancas y agarres múltiples.",
                "Llaves de sumisión en suelo (Arm locks, asfixias con chaqueta, Art. 15/16)."
            ];
            inSeasonPlan = [
                "Entrenamiento láctico intermitente simulando el ritmo de rounds continuos de 2.5 min.",
                "Pliometría máxima reactiva y velocidad explosiva de reacción.",
                "Táctica competitiva: búsqueda de Ley de doce (12 pts de superioridad).",
                "Focalizar en salto alto y largo buscando romper registros históricos."
            ];
        } else {
            offSeasonPlan = [
                "Fuerza funcional (core, espalda baja y hombros) para estabilidad articular.",
                "Movilidad articular dinámica y estiramiento activo controlado.",
                "Luxaciones avanzadas aplicando desvíos y economía de movimiento.",
                "Figuras marciales tradicionales con armas (sable, bastón corto)."
            ];
            inSeasonPlan = [
                "Intervalos cardiovasculares controlados para mantener resistencia de base.",
                "Figuras con armas tradicionales puliendo la exactitud de corte/impacto.",
                "Táctica de combate inteligente: control de distancia media y clinch táctico.",
                "Saltos de baja altura para evitar impactos severos en articulaciones."
            ];
        }

        let correctiveHTML = "";
        if (correctiveFocus.length > 0) {
            correctiveHTML = `
                <div class="panel-card mt-20" style="background-color: rgba(245, 158, 11, 0.03); border-color: rgba(245, 158, 11, 0.15); box-shadow: none;">
                    <h3 style="color: var(--accent); font-size: 14px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <i class="fa-solid fa-screwdriver-wrench"></i> Foco Correctivo de Metodología de Entrenamiento
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${correctiveFocus.map(item => `
                            <div style="border-left: 3px solid var(--accent); padding-left: 12px;">
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">${item.title}</h4>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4; margin: 0;">${item.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        const imc = evalResults ? evalResults.imc : null;
        let overweightJointWarningHTML = "";
        if (imc && imc > 27) {
            overweightJointWarningHTML = `
                <div class="panel-card mt-20" style="background-color: rgba(239, 68, 68, 0.04); border-color: rgba(239, 68, 68, 0.2); box-shadow: none;">
                    <h3 style="color: var(--danger); font-size: 14px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <i class="fa-solid fa-triangle-exclamation"></i> ADVERTENCIA: Protección Articular (IMC Elevado)
                    </h3>
                    <p style="font-size: 13px; color: var(--text-primary); line-height: 1.5; margin-bottom: 8px;">
                        El Índice de Masa Corporal del atleta es de <strong>${imc.toFixed(2)}</strong> (mayor a 27.0). Esto incrementa significativamente el impacto sobre las rodillas, tobillos y columna durante caídas y saltos de gran altura.
                    </p>
                    <ul class="plan-list" style="margin-top: 5px; margin-bottom: 0;">
                        <li><strong>Pliometría de Bajo Impacto:</strong> Sustituir saltos desde alturas elevadas por saltos al cajón amortiguados, saltos en piso con flexión suave de rodillas y pliometría asistida con bandas.</li>
                        <li><strong>Defensa Personal (Hosinsul):</strong> Priorizar técnicas de combate en distancia corta (clinch), palancas articulares y desequilibrios directos, reduciendo lances de proyección de gran amplitud.</li>
                        <li><strong>Control de Carga:</strong> Monitorear la recuperación después de sesiones intensas de patadas. Se aconseja un ligero déficit calórico supervisado para optimizar la relación potencia-peso.</li>
                    </ul>
                </div>
            `;
        }

        return `
            <p class="plan-header-desc">
                Plan generado para el atleta <strong>${athlete.name}</strong>, de <strong>${age} años</strong> y <strong>${athlete.weight} kg</strong> (${athlete.gender}).
            </p>
            <div class="plan-feedback-section ${cardioClass}">
                <h4><i class="fa-solid ${cardioIcon}"></i> Estado Fisiológico (Test de Ruffier: ${ruffier.toFixed(1)} - ${level})</h4>
                <p>${cardioRecommendation}</p>
            </div>
            
            <div class="plan-grid mt-20">
                <div class="plan-col">
                    <h3><i class="fa-solid fa-umbrella-beach"></i> Fuera de Temporada (Enfoque Marcial)</h3>
                    <ul class="plan-list">
                        ${offSeasonPlan.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="plan-col trad">
                    <h3><i class="fa-solid fa-trophy"></i> Temporada de Torneos (Hapkido Deportivo)</h3>
                    <ul class="plan-list">
                        ${inSeasonPlan.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="plan-grid">
                <div class="plan-col" style="background-color: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2);">
                    <h3 style="color: var(--success);"><i class="fa-solid fa-star"></i> Puntos Fuertes Detectados</h3>
                    <ul class="plan-list" style="color: var(--text-primary);">
                        ${strengths.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="plan-col" style="background-color: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
                    <h3 style="color: var(--danger);"><i class="fa-solid fa-circle-exclamation"></i> Puntos Débiles (Enfoque Correctivo)</h3>
                    <ul class="plan-list" style="color: var(--text-primary);">
                        ${weaknesses.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            ${correctiveHTML}
            ${overweightJointWarningHTML}
        `;
    }



