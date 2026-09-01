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
            if (lblPushups) lblPushups.innerHTML = 'Flexiones adaptadas (1 min) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'pushups\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputPushups) inputPushups.placeholder = "Ej: 15";
            if (lblSitups) lblSitups.innerHTML = 'Abdominales adaptados (1 min) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'situps\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputSitups) inputSitups.placeholder = "Ej: 20";
            if (lblCooper) lblCooper.innerHTML = 'Resistencia / Navette (m) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'cooper\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputCooper) inputCooper.placeholder = "Ej: 1200";
            if (lblJumpVertical) lblJumpVertical.innerHTML = 'Salto Vertical (cm) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'jump-vertical\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputJumpVertical) inputJumpVertical.placeholder = "Ej: 25";
            if (lblAgility) lblAgility.innerHTML = 'Velocidad 10m (seg) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'agility\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputAgility) inputAgility.placeholder = "Ej: 3.5";
            if (groupGrip) groupGrip.style.opacity = '1';
        } else {
            if (lblPushups) lblPushups.innerHTML = 'Flexiones de pecho (1 min) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'pushups\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputPushups) inputPushups.placeholder = "Ej: 35";
            if (lblSitups) lblSitups.innerHTML = 'Abdominales (1 min) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'situps\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputSitups) inputSitups.placeholder = "Ej: 40";
            if (lblCooper) lblCooper.innerHTML = 'Test de Cooper (Metros en 12 min) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'cooper\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputCooper) inputCooper.placeholder = "Ej: 2400";
            if (lblJumpVertical) lblJumpVertical.innerHTML = 'Salto Vertical / Sargent (cm) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'jump-vertical\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
            if (inputJumpVertical) inputJumpVertical.placeholder = "Ej: 45";
            if (lblAgility) lblAgility.innerHTML = 'Velocidad 10m Planos (seg) <button type="button" class="metric-help-btn" onclick="app.showMetricHelp(\'agility\')" title="Ver protocolo"><i class="fa-solid fa-circle-question"></i></button>';
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

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * ENCICLOPEDIA INTERACTIVA DE PROTOCOLOS DE MEDICIÓN FÍSICA
     * Guía paso a paso para entrenadores y atletas con enlaces a videos
     * ═══════════════════════════════════════════════════════════════════════
     */
    HapkidoApp.prototype.showMetricHelp = function(metricKey) {
        var protocols = {
            'height': {
                title: 'Estatura (cm)',
                icon: 'fa-ruler-vertical',
                category: 'Antropometría',
                objective: 'Establecer la talla del atleta para calcular el IMC, la Masa Grasa Relativa (RFM), el Índice Ape y las referencias de alcance biomecánico en combate.',
                steps: [
                    'El atleta se quita los zapatos y cualquier accesorio en la cabeza (gorra, moño alto, etc.).',
                    'Se coloca de pie con los pies juntos (talones unidos), espalda recta y apoyada contra la pared o el tallímetro.',
                    'Los talones, glúteos, parte superior de la espalda y la parte posterior de la cabeza deben estar en contacto con el plano vertical.',
                    'La cabeza se posiciona en el <strong>Plano de Frankfort</strong>: el borde inferior de la órbita del ojo debe estar a la misma altura que el trago del oído (mirada al frente, paralela al suelo).',
                    'El evaluador desciende la pieza móvil del tallímetro hasta que toque firmemente la coronilla de la cabeza.',
                    'La lectura se toma al final de una <strong>inspiración profunda</strong> (el atleta inspira y se mantiene erguido).',
                    'Registrar el valor en centímetros con un decimal (ej: 172.5 cm).'
                ],
                equipment: 'Tallímetro fijo de pared o estadiómetro portátil (precisión ±0.1 cm). Alternativa: cinta métrica rígida vertical fijada a la pared con una escuadra o libro como tope.',
                errors: [
                    'Medir con calzado puesto (agrega 2-3 cm de error).',
                    'No verificar el plano de Frankfort (mirada hacia arriba o abajo altera la medida).',
                    'Medir al final del día en lugar de la mañana (los discos vertebrales se comprimen ≈1-2 cm durante el día).'
                ],
                video: 'https://www.youtube.com/watch?v=nJKJoEfrOPI'
            },
            'weight': {
                title: 'Peso Corporal (kg)',
                icon: 'fa-weight-scale',
                category: 'Composición Corporal',
                objective: 'Monitorear la masa corporal total para seguimiento nutricional, encuadre en categorías de peso para torneos y cálculo de la potencia relativa del atleta.',
                steps: [
                    'Calibrar la báscula a cero antes de cada sesión de pesaje.',
                    'El atleta se pesa <strong>en ayunas</strong> o antes de la sesión de entrenamiento, idealmente a la misma hora del día para comparaciones fiables.',
                    'Vestimenta: descalzo y en <strong>ropa deportiva ligera</strong> (Dobok o pantalón corto y camiseta).',
                    'Bolsillos vacíos, sin relojes, cinturones ni accesorios.',
                    'El atleta sube a la báscula y se queda erguido, quieto, con el peso distribuido en ambos pies y los brazos a los costados.',
                    'Esperar a que el valor se estabilice (3-5 segundos) antes de registrar.',
                    'Anotar el valor en kilogramos con un decimal (ej: 72.3 kg).'
                ],
                equipment: 'Báscula digital calibrada (precisión ±0.1 kg). Idealmente colocada sobre superficie dura y plana (no sobre alfombra).',
                errors: [
                    'Pesarse después de comer o beber abundante agua (puede variar 1-3 kg).',
                    'Pesarse con ropa pesada o calzado.',
                    'Colocar la báscula sobre alfombra o superficie irregular.',
                    'No calibrar a cero la báscula antes de usar.'
                ],
                video: null
            },
            'waist': {
                title: 'Circunferencia de Cintura (cm)',
                icon: 'fa-tape',
                category: 'Composición Corporal',
                objective: 'Evaluar la distribución de grasa abdominal visceral, el riesgo cardiometabólico y calcular el Índice Cintura-Estatura (WHtR). Valores elevados indican mayor riesgo cardiovascular.',
                steps: [
                    'El atleta debe estar de pie, con el abdomen descubierto y los brazos relajados a los costados.',
                    'Localizar el <strong>punto medio</strong> entre el borde inferior de la última costilla palpable y la cresta ilíaca (parte superior del hueso de la cadera). Este es el punto anatómico estándar de la OMS.',
                    'Envolver la <strong>cinta métrica antropométrica</strong> alrededor del abdomen en ese punto, asegurándose de que esté <strong>horizontal y paralela al suelo</strong>.',
                    'La cinta debe estar en contacto con la piel pero <strong>sin comprimir</strong> el tejido blando.',
                    'Pedirle al atleta que respire normalmente. Tomar la lectura al final de una <strong>espiración normal y relajada</strong> (no forzada).',
                    'Registrar el valor en centímetros con un decimal.'
                ],
                equipment: 'Cinta métrica antropométrica flexible e inextensible (no usar cintas de costura elásticas). Opcionalmente un lápiz dermográfico para marcar el punto.',
                errors: [
                    'Medir sobre la ropa.',
                    'Medir en el ombligo en lugar del punto medio costilla-cadera (son ubicaciones diferentes).',
                    'Pedir al atleta que "meta la barriga" o contraiga el abdomen.',
                    'Colocar la cinta inclinada en lugar de horizontal.'
                ],
                video: 'https://www.youtube.com/watch?v=2jzqOmMOvps'
            },
            'fat': {
                title: 'Porcentaje de Grasa Corporal (%)',
                icon: 'fa-percent',
                category: 'Composición Corporal',
                objective: 'Determinar la proporción de masa grasa versus masa magra para optimizar el rendimiento en combate, la potencia relativa y la salud general del atleta.',
                steps: [
                    'Este valor se <strong>calcula automáticamente</strong> por el sistema combinando múltiples fórmulas validadas:',
                    '<strong>Fórmula YMCA</strong>: Utiliza peso y cintura para estimar grasa corporal (ajustada por sexo).',
                    '<strong>Masa Grasa Relativa (RFM)</strong>: Utiliza estatura y cintura con la fórmula: 64 - (20 × Estatura/Cintura) + factor de ajuste por sexo.',
                    'Si se ingresan los <strong>pliegues cutáneos</strong> (tríceps y abdomen), se integra una tercera estimación por plicometría.',
                    'El resultado final es el <strong>promedio ponderado</strong> de las fórmulas disponibles.',
                    'Para obtener la estimación más precisa posible, completa la estatura, el peso, la cintura y ambos pliegues cutáneos.'
                ],
                equipment: 'No requiere equipamiento adicional: el sistema lo calcula automáticamente a partir de las otras mediciones ingresadas.',
                errors: [
                    'No ingresar la cintura (la fórmula RFM no se puede calcular).',
                    'Ingresar datos incorrectos de estatura o peso (propaga el error a todos los índices derivados).'
                ],
                video: null
            },
            'wingspan': {
                title: 'Envergadura / Ape Index (cm)',
                icon: 'fa-arrows-left-right',
                category: 'Antropometría Marcial',
                objective: 'Medir el alcance biomecánico total de las extremidades superiores. El Ape Index (Envergadura/Estatura) determina ventajas de distancia en golpeo, agarres y la distancia efectiva de combate.',
                steps: [
                    'El atleta se coloca <strong>de pie con la espalda completamente apoyada contra la pared</strong>.',
                    'Extiende ambos brazos horizontalmente a 90° (en T), a la <strong>altura exacta de los hombros</strong>.',
                    'Las palmas deben estar abiertas y orientadas <strong>hacia el frente</strong>, con los dedos completamente extendidos.',
                    'Verificar que los <strong>hombros estén nivelados</strong> (no uno más alto que otro) y en contacto con la pared.',
                    'El evaluador mide la distancia en línea recta desde la <strong>punta del dedo medio de una mano</strong> hasta la <strong>punta del dedo medio de la otra mano</strong>.',
                    'Es útil marcar con cinta adhesiva en la pared la posición de cada dedo medio y luego medir la distancia entre las marcas.',
                    'El sistema calculará automáticamente el <strong>Ape Index</strong> = Envergadura ÷ Estatura. Un valor > 1.00 indica brazos proporcionalmente largos (ventaja en golpeo).'
                ],
                equipment: 'Pared lisa y cinta métrica de al menos 2.5m (o cinta de pintor marcada en la pared). Cinta adhesiva para marcar los puntos.',
                errors: [
                    'No apoyar la espalda contra la pared (el atleta puede inclinar el tronco y alterar la medida).',
                    'Brazos por encima o debajo de la horizontal de los hombros.',
                    'Dedos flexionados en lugar de totalmente extendidos.'
                ],
                video: 'https://www.youtube.com/watch?v=FSsggMqR06s'
            },
            'neck': {
                title: 'Circunferencia de Cuello (cm)',
                icon: 'fa-user',
                category: 'Antropometría Marcial',
                objective: 'Evaluar el desarrollo muscular del trapecio superior y esternocleidomastoideo. Un cuello fuerte es clave para absorber impactos en la cabeza y resistir estrangulaciones (Mok-kkeokgi) en Hapkido.',
                steps: [
                    'El atleta se coloca de pie, con la <strong>mirada al frente</strong> y el cuello en posición natural (sin flexionar hacia arriba ni hacia abajo).',
                    'El evaluador pasa la cinta métrica alrededor del cuello justo <strong>por debajo de la nuez de Adán</strong> (cartílago tiroides) en hombres.',
                    'En mujeres, se mide a la <strong>altura media del cuello</strong> (punto medio entre la base del cráneo y los hombros).',
                    'La cinta debe estar <strong>horizontal y perpendicular al eje del cuello</strong>, sin inclinarse.',
                    'Aplicar tensión firme pero sin comprimir. El atleta no debe tensar los músculos cervicales.',
                    'Registrar en centímetros con un decimal.'
                ],
                equipment: 'Cinta métrica flexible antropométrica.',
                errors: [
                    'El atleta tensa voluntariamente los músculos del cuello ("hinchando" el cuello).',
                    'Medir sobre el cuello de la camiseta o el Dobok.',
                    'No mantener la cinta horizontal.'
                ],
                video: null
            },
            'thigh': {
                title: 'Perímetro de Muslo (cm)',
                icon: 'fa-person',
                category: 'Antropometría Marcial',
                objective: 'Determinar el volumen y masa muscular del cuádriceps e isquiotibiales: los generadores primarios de potencia para patadas (Chagi), estabilidad en posiciones de combate y capacidad de absorción de impactos en piernas.',
                steps: [
                    'El atleta se coloca de pie con el <strong>peso distribuido uniformemente en ambas piernas</strong>, pies separados al ancho de hombros.',
                    'Localizar el <strong>borde superior de la rótula</strong> (parte alta de la rodilla).',
                    'Medir <strong>15 cm por encima</strong> de ese punto usando una regla o la propia cinta métrica.',
                    'Marcar ese punto con un lápiz dermográfico si es necesario.',
                    'Envolver la cinta métrica alrededor del muslo a esa altura, <strong>perpendicular al eje del fémur</strong>.',
                    'La cinta en contacto con la piel sin comprimir el tejido muscular.',
                    'Medir el <strong>muslo de la pierna dominante</strong> (la pierna con la que el atleta patea con más fuerza).',
                    'Registrar en centímetros con un decimal.'
                ],
                equipment: 'Cinta métrica antropométrica y opcionalmente un lápiz dermográfico o un marcador suave para señalar el punto.',
                errors: [
                    'El atleta contrae o flexiona el cuádriceps durante la medición.',
                    'No medir siempre en el mismo punto estandarizado (15 cm encima de la rótula).',
                    'Medir con pantalón grueso puesto.'
                ],
                video: null
            },
            'skinfold-tri': {
                title: 'Pliegue Cutáneo Tricipital (mm)',
                icon: 'fa-hand-dots',
                category: 'Plicometría',
                objective: 'Estimar el grosor del tejido adiposo subcutáneo en la región posterior del brazo. Se utiliza junto con el pliegue abdominal para calcular una estimación de grasa corporal por plicometría.',
                steps: [
                    'El atleta se coloca de pie con el brazo relajado colgando al lado del cuerpo.',
                    'Localizar el <strong>punto medio</strong> entre el acromion del hombro (punta del hombro) y el olécranon del codo. Marcar ese punto con un lápiz dermográfico.',
                    'El evaluador <strong>pellizca</strong> un pliegue vertical de piel y grasa subcutánea en ese punto usando el pulgar y el índice de la mano no dominante.',
                    'Separar suavemente el pliegue del músculo subyacente (solo piel + grasa).',
                    'Con la otra mano, aplicar las ramas del plicómetro <strong>a 1 cm de distancia de los dedos</strong>, perpendicular al pliegue.',
                    'Mantener la presión de los dedos sobre el pliegue durante toda la medición.',
                    'Leer el valor en el dial del plicómetro <strong>exactamente a los 2 segundos</strong> (si se espera más, la grasa se comprime y la lectura baja).',
                    'Realizar <strong>2 mediciones</strong> y promediar. Si difieren más de 1mm, tomar una tercera.',
                    'Registrar el promedio en milímetros.'
                ],
                equipment: 'Plicómetro (cáliper de pliegues cutáneos) calibrado. Modelos recomendados: Harpenden, Lange o Slim Guide. Lápiz dermográfico para marcar.',
                errors: [
                    'No separar correctamente el pliegue del músculo (se mide músculo + grasa, no solo grasa).',
                    'Leer el plicómetro después de 4-5 segundos (la lectura se comprime y es menor).',
                    'Pellizcar horizontalmente en lugar de verticalmente en el tríceps.',
                    'El atleta contrae el tríceps durante la medición.'
                ],
                video: 'https://www.youtube.com/watch?v=DsKrFa-hKiY'
            },
            'skinfold-abd': {
                title: 'Pliegue Cutáneo Abdominal (mm)',
                icon: 'fa-hand-dots',
                category: 'Plicometría',
                objective: 'Evaluar el grosor del panículo adiposo en la pared abdominal, una de las zonas de mayor acumulación de grasa en atletas masculinos.',
                steps: [
                    'El atleta se coloca de pie con el abdomen relajado y descubierto.',
                    'Localizar un punto <strong>2 cm a la derecha del ombligo</strong>.',
                    'Pellizcar un <strong>pliegue vertical</strong> de piel y grasa subcutánea en ese punto (dirección cefalo-caudal, paralelo a la línea media del cuerpo).',
                    'Asegurarse de separar el pliegue del músculo recto abdominal subyacente (solo piel + grasa).',
                    'Aplicar el plicómetro a 1 cm de los dedos, perpendicular al pliegue.',
                    'Leer el valor a los 2 segundos.',
                    'Promediar 2 mediciones. Si difieren más de 1mm, tomar una tercera.',
                    'Registrar el promedio en milímetros.'
                ],
                equipment: 'Plicómetro calibrado y lápiz dermográfico.',
                errors: [
                    'El atleta contrae el abdomen ("mete la barriga") durante la toma.',
                    'Pellizcar horizontalmente en lugar de verticalmente.',
                    'Incluir tejido muscular dentro del pliegue.'
                ],
                video: 'https://www.youtube.com/watch?v=DsKrFa-hKiY'
            },
            'rhr': {
                title: 'Frecuencia Cardíaca en Reposo (lpm)',
                icon: 'fa-heart-pulse',
                category: 'Cardiovascular',
                objective: 'Evaluar la eficiencia del miocardio y la condición aeróbica basal. Valores bajos (bradicardia atlética, menor a 60 lpm) reflejan un corazón más eficiente que bombea más sangre por latido.',
                steps: [
                    '<strong>Condiciones previas:</strong> El atleta no debe haber consumido cafeína, bebidas energéticas ni tabaco en las últimas 3 horas. No haber realizado ejercicio intenso en las últimas 2 horas.',
                    '<strong>Método ideal:</strong> Medir al despertar por la mañana, antes de levantarse de la cama, durante 60 segundos.',
                    '<strong>Método alternativo:</strong> El atleta se sienta en una silla en un ambiente silencioso y descansa durante <strong>5 minutos completos</strong> sin hablar ni moverse.',
                    '<strong>Medición con pulsioxímetro:</strong> Colocar el dispositivo en el dedo índice o medio y esperar a que la lectura sea estable (sin cambios durante 10 segundos).',
                    '<strong>Medición manual (arteria radial):</strong> Colocar los dedos índice y medio sobre la muñeca, en la cara interior (lado del pulgar), sobre la arteria radial. Contar los pulsos durante <strong>60 segundos completos</strong>.',
                    '<strong>Medición manual (arteria carótida):</strong> Alternativa: palpar el pulso en el cuello, en el surco lateral a la tráquea. Presionar suavemente (no apretar fuerte, puede causar reflejo vagal).',
                    'Registrar el número de pulsaciones por minuto (lpm).'
                ],
                equipment: 'Pulsioxímetro de dedo (recomendado), pulsómetro con banda pectoral, o conteo manual con cronómetro.',
                errors: [
                    'Medir después de subir escaleras, caminar rápido o estar agitado.',
                    'Contar el pulso solo durante 15 segundos y multiplicar por 4 (menor precisión).',
                    'El atleta habla, se mueve o mira el teléfono durante el reposo previo.',
                    'Presionar demasiado fuerte en la carótida (puede causar bradicardia refleja).'
                ],
                video: 'https://www.youtube.com/watch?v=5MmC0I6wHJM'
            },
            'ruffier': {
                title: 'Test de Ruffier-Dickson',
                icon: 'fa-heart-pulse',
                category: 'Adaptación Cardiovascular',
                objective: 'Medir la capacidad de adaptación cardíaca y la velocidad de recuperación cardiovascular ante un esfuerzo anaeróbico láctico estandarizado de 45 segundos.',
                steps: [
                    '<strong>Fase 1 - Reposo (P1):</strong> El atleta se sienta tranquilamente durante 5 minutos. Medir el pulso durante 15 segundos y multiplicar por 4. Este es <strong>P1</strong>.',
                    '<strong>Fase 2 - Esfuerzo:</strong> El atleta realiza exactamente <strong>30 sentadillas profundas en 45 segundos</strong> (ritmo de 1 sentadilla cada 1.5 segundos). El evaluador marca el ritmo con palmadas o metrónomo.',
                    '<em>Técnica de sentadilla:</em> Pies al ancho de hombros, flexionar rodillas hasta que los muslos estén paralelos al suelo (90°), espalda recta, brazos al frente para equilibrio. Extensión completa de rodillas al subir.',
                    '<strong>Fase 3 - Post-esfuerzo inmediato (P2):</strong> Inmediatamente al terminar la sentadilla 30, medir el pulso durante 15 segundos y multiplicar por 4. Este es <strong>P2</strong>.',
                    '<strong>Fase 4 - Recuperación (P3):</strong> El atleta se sienta y descansa exactamente <strong>1 minuto</strong>. Al cumplirse el minuto, medir el pulso durante 15 segundos y multiplicar por 4. Este es <strong>P3</strong>.',
                    '<strong>Fórmula:</strong> Índice de Ruffier = (P1 + P2 + P3 - 200) / 10.',
                    '<strong>Interpretación:</strong> Menor a 0 = Excelente | 0-5 = Bueno | 5-10 = Mediocre | 10-15 = Insuficiente | Mayor a 15 = Malo.'
                ],
                equipment: 'Cronómetro (imprescindible para los 45 segundos de sentadillas y el minuto de recuperación), pulsómetro o conteo manual de pulso.',
                errors: [
                    'No respetar el ritmo de 30 sentadillas en 45 segundos (hacerlas más rápido o lento).',
                    'Sentadillas incompletas (no bajar a 90°).',
                    'No cronometrar exactamente 1 minuto de recuperación.',
                    'Tardarse en comenzar a medir P2 (cada segundo de retraso distorsiona el resultado).'
                ],
                video: 'https://www.youtube.com/watch?v=JHoh0q5XWZ0'
            },
            'pushups': {
                title: 'Flexiones de Pecho en 1 Minuto',
                icon: 'fa-dumbbell',
                category: 'Fuerza-Resistencia Superior',
                objective: 'Evaluar la fuerza-resistencia de pectorales, tríceps y deltoides anterior. Musculatura fundamental para la potencia de puñetazos (Jireugi), empujones y bloqueos (Makgi).',
                steps: [
                    '<strong>Posición inicial:</strong> Plancha alta con las manos al ancho de los hombros (o ligeramente más separadas), dedos apuntando al frente.',
                    'El cuerpo forma una <strong>línea recta</strong> desde la cabeza hasta los talones: abdomen firme, glúteos contraídos, sin arquear la zona lumbar ni levantar la cadera.',
                    '<strong>Bajada:</strong> Flexionar los codos hasta que el pecho toque ligeramente el suelo o hasta que los codos formen un ángulo de 90°. El evaluador puede colocar su puño bajo el pecho como referencia de profundidad.',
                    '<strong>Subida:</strong> Extender los brazos completamente hasta la posición inicial (los codos deben estar totalmente rectos al final de cada repetición).',
                    'El evaluador cuenta <strong>solo las repeticiones válidas</strong> durante 60 segundos.',
                    'El atleta puede descansar en posición de plancha alta (no bajar las rodillas ni sentarse), pero el cronómetro sigue corriendo.',
                    '<strong>Adaptación infantil (menores de 13):</strong> Se permiten flexiones con rodillas apoyadas en el suelo.'
                ],
                equipment: 'Cronómetro y tatami o colchoneta.',
                errors: [
                    'Arquear la zona lumbar (espalda "hundida").',
                    'Elevar los glúteos por encima de la línea del cuerpo.',
                    'Extensión incompleta de los brazos (no valen "medias flexiones").',
                    'Rebote en el suelo sin control (no es una repetición válida).'
                ],
                video: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
            },
            'situps': {
                title: 'Abdominales en 1 Minuto',
                icon: 'fa-dumbbell',
                category: 'Fuerza del Core',
                objective: 'Medir la fuerza-resistencia de la pared abdominal y flexores de cadera, esenciales para la transferencia de fuerza del tren inferior al superior en patadas, protección del torso y absorción de impactos.',
                steps: [
                    '<strong>Posición inicial:</strong> Tumbado boca arriba sobre el tatami, rodillas flexionadas a 90°, plantas de los pies planas en el suelo.',
                    'Un compañero o el evaluador <strong>sujeta firmemente los pies</strong> del atleta contra el suelo.',
                    'Los brazos se cruzan sobre el pecho (manos tocando los hombros opuestos) o se colocan a los lados de la cabeza con las yemas de los dedos tocando las orejas.',
                    '<strong>Subida:</strong> Elevar el tronco contrayendo el abdomen hasta que los <strong>codos toquen las rodillas</strong> o los muslos.',
                    '<strong>Bajada:</strong> Descender de forma controlada hasta que las <strong>escápulas (omóplatos) toquen el suelo</strong>.',
                    'Contar solo las repeticiones completas y válidas en 60 segundos.',
                    'El atleta puede hacer pausas breves en posición tumbada, pero el cronómetro sigue corriendo.'
                ],
                equipment: 'Cronómetro, tatami o colchoneta.',
                errors: [
                    'Tirar del cuello con las manos (riesgo de lesión cervical y trampa).',
                    'Los glúteos se despegan del suelo durante la subida.',
                    'No tocar las rodillas con los codos (repetición incompleta).',
                    'No regresar las escápulas al suelo antes de iniciar la siguiente repetición.'
                ],
                video: 'https://www.youtube.com/watch?v=jDwoBqPH0jk'
            },
            'plank': {
                title: 'Plancha Prona Isométrica (seg)',
                icon: 'fa-stopwatch',
                category: 'Estabilidad del Core',
                objective: 'Evaluar la resistencia isométrica del core profundo (transverso abdominal, multífidos, glúteos y erectores). Clave para resistir proyecciones (Deonjigi), forcejeos (Kkeokgi) y mantener el equilibrio en combate.',
                steps: [
                    '<strong>Posición:</strong> Boca abajo, apoyado en los antebrazos y las puntas de los pies.',
                    'Los <strong>codos deben estar directamente debajo de los hombros</strong>, antebrazos paralelos entre sí apuntando al frente.',
                    'El cuerpo debe formar una <strong>línea perfectamente recta</strong> desde la parte posterior de la cabeza hasta los talones.',
                    'Abdomen firmemente contraído ("llevar el ombligo hacia la columna"), glúteos apretados.',
                    'La mirada apunta al suelo, a unos 30 cm por delante de las manos (cuello en posición neutra).',
                    'El evaluador inicia el cronómetro cuando el atleta adopta la posición correcta.',
                    '<strong>Criterio de finalización:</strong> El test se detiene cuando la cadera cae (se hunde hacia el suelo) o sube (se eleva en pico), rompiendo la línea recta. Se permite <strong>un aviso verbal</strong> para corregir; si en los siguientes 2 segundos no se corrige, se detiene.',
                    'Registrar el tiempo total en segundos.'
                ],
                equipment: 'Cronómetro y tatami o colchoneta.',
                errors: [
                    'Elevar los glúteos formando un triángulo ("pico" o "carpa").',
                    'Hundir la cadera y la zona lumbar.',
                    'Aguantar la respiración en lugar de respirar de forma continua y controlada.',
                    'Colocar los codos demasiado adelante o atrás de los hombros.'
                ],
                video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
            },
            'grip': {
                title: 'Suspensión en Barra (seg)',
                icon: 'fa-hand-back-fist',
                category: 'Fuerza de Agarre',
                objective: 'Medir la fuerza-resistencia isométrica de los flexores de los dedos y antebrazos. En Hapkido, la fuerza de agarre es determinante para controlar al oponente por el Dobok, las muñecas (Sonmok), y ejecutar luxaciones.',
                steps: [
                    'El atleta se posiciona debajo de una barra fija a una altura suficiente para que los pies no toquen el suelo cuando esté colgado.',
                    'Agarre en <strong>pronación</strong> (palmas mirando hacia el frente/lejos del cuerpo) con las manos al ancho de los hombros.',
                    'Subir a la posición colgante con <strong>brazos completamente extendidos</strong> y pies suspendidos.',
                    'El evaluador inicia el cronómetro cuando el atleta queda suspendido.',
                    'El atleta debe mantener el agarre el <strong>mayor tiempo posible</strong> sin balancearse, sin apoyarse en estructuras laterales, y sin subir o doblar las piernas sobre la barra.',
                    'El test <strong>finaliza</strong> cuando el atleta suelta la barra voluntariamente o se resbala y cae.',
                    'Registrar el tiempo total en segundos.',
                    '<strong>Alternativa con dinamómetro:</strong> Si se dispone de un dinamómetro de mano (Jamar), se puede medir la fuerza de agarre máxima en kg en 3 intentos por mano.'
                ],
                equipment: 'Barra de dominadas fija y estable, cronómetro. Alternativa: dinamómetro de mano.',
                errors: [
                    'Usar agarre supino (palmas hacia el cuerpo) en lugar de pronación.',
                    'Apoyar los pies en alguna estructura durante el test.',
                    'Balancearse para redistribuir el peso.',
                    'Usar magnesio o tiras/vendas de agarre (medir la fuerza "en crudo").'
                ],
                video: 'https://www.youtube.com/watch?v=bLoVkjGXcJQ'
            },
            'jump-vertical': {
                title: 'Salto Vertical / Sargent Jump (cm)',
                icon: 'fa-arrow-up',
                category: 'Potencia Explosiva',
                objective: 'Evaluar la potencia anaeróbica aláctica del tren inferior: cuádriceps, glúteos y pantorrillas. Capacidad fundamental para patadas en salto (Twieo Chagi) y despegues explosivos.',
                steps: [
                    '<strong>1. Alcance estático:</strong> El atleta se coloca de pie, lateral a la pared (hombro dominante hacia la pared). Extiende el brazo dominante hacia arriba lo más alto posible con los pies planos en el suelo.',
                    'Marcar con <strong>tiza o cinta adhesiva</strong> la altura máxima alcanzada por la punta de los dedos. Esta es la marca A.',
                    '<strong>2. Salto CMJ (Contramovimiento):</strong> Desde la posición de pie, el atleta flexiona las rodillas rápidamente (contramovimiento), balancea los brazos y salta <strong>verticalmente con máxima potencia</strong>.',
                    'En el punto más alto del salto, el atleta toca la pared o escala con la punta de los dedos untados en tiza. Esta es la marca B.',
                    '<strong>3. Resultado:</strong> Diferencia en centímetros entre la marca B (salto) y la marca A (alcance estático).',
                    'Realizar <strong>2 intentos</strong> con al menos 30 segundos de descanso entre cada uno.',
                    'Registrar el <strong>mejor resultado</strong> de los 2 intentos.'
                ],
                equipment: 'Pared lisa y alta (o escala Vertec/Jump meter), tiza de colores para marcar, cinta métrica fijada verticalmente en la pared.',
                errors: [
                    'Dar uno o más pasos de carrera antes de saltar (debe ser despegue estático con ambos pies).',
                    'No medir el alcance estático correctamente (brazo no completamente extendido).',
                    'Saltar y girar el cuerpo para alcanzar más alto con el brazo contrario.',
                    'Descanso insuficiente entre intentos (la fatiga reduce la potencia del segundo salto).'
                ],
                video: 'https://www.youtube.com/watch?v=RiS7afQBSWM'
            },
            'jump-horizontal': {
                title: 'Salto Horizontal a Pies Juntos (cm)',
                icon: 'fa-arrow-right',
                category: 'Potencia Explosiva',
                objective: 'Medir la fuerza explosiva horizontal combinada de cuádriceps, glúteos y gemelos. Indica la capacidad de desplazamiento explosivo para entradas de ataque, barridos y cambios de distancia.',
                steps: [
                    'Marcar una <strong>línea de batida</strong> en el tatami con cinta adhesiva. Extender la cinta métrica perpendicular a la línea.',
                    'El atleta se coloca detrás de la línea con los <strong>pies separados al ancho de hombros</strong>, las puntas de los pies justo detrás de la línea.',
                    'Puede flexionar las rodillas, balancear los brazos libremente y preparar el salto.',
                    'Saltar hacia adelante con <strong>despegue simultáneo de ambos pies</strong> (no se permite dar un paso previo).',
                    'Aterrizar con ambos pies y <strong>mantener el equilibrio sin caer hacia atrás</strong>.',
                    'Medir la distancia desde la línea de batida hasta el <strong>talón del pie más retrasado</strong> en el aterrizaje.',
                    'Si el atleta cae hacia atrás apoyando las manos o los glúteos, el salto es <strong>nulo</strong> y se repite.',
                    'Realizar 2 intentos y registrar el mejor resultado en centímetros.'
                ],
                equipment: 'Cinta métrica fijada en el tatami, cinta adhesiva para la línea de batida.',
                errors: [
                    'Dar un paso antes de saltar (solo despegue estático desde detrás de la línea).',
                    'No despegar simultáneamente con ambos pies.',
                    'Caer hacia atrás y apoyar las manos (salto nulo).',
                    'Medir desde el pie adelantado en lugar del retrasado.'
                ],
                video: 'https://www.youtube.com/watch?v=bpCmi8FMRG0'
            },
            'cooper': {
                title: 'Test de Cooper 12 Minutos (m)',
                icon: 'fa-person-running',
                category: 'Resistencia Aeróbica',
                objective: 'Estimar el consumo máximo de oxígeno (VO2 Máx) y la capacidad de resistencia cardiovascular. Fundamental para soportar múltiples combates en torneos y mantener la lucidez táctica bajo fatiga.',
                steps: [
                    '<strong>Preparación:</strong> Disponer de una pista o circuito de distancia conocida y medida (ideal: pista de atletismo de 400m). Marcar puntos cada 100m si se usa otro circuito.',
                    'El atleta realiza un <strong>calentamiento previo</strong> de 5-10 minutos (trote suave, movilidad articular).',
                    'A la señal del evaluador (silbato), el atleta comienza a correr y debe recorrer la <strong>mayor distancia posible en 12 minutos</strong> exactos.',
                    'Se permite <strong>alternar entre correr y trotar</strong>, pero se recomienda NO detenerse completamente ni caminar.',
                    'El evaluador debe informar el tiempo restante a los minutos 6, 9, 10 y 11.',
                    'A los 12 minutos exactos, el evaluador da un <strong>segundo silbato</strong> y el atleta se detiene inmediatamente en el punto donde se encuentre.',
                    'Medir la <strong>distancia total recorrida en metros</strong>.',
                    '<strong>VO2 Máx estimado</strong> = (Distancia en metros - 504.9) / 44.73.'
                ],
                equipment: 'Pista de atletismo o circuito medido con conos, cronómetro, silbato, planilla de registro.',
                errors: [
                    'No medir correctamente el circuito (error en la distancia final).',
                    'El atleta no calienta previamente (riesgo de lesión y rendimiento sub-óptimo).',
                    'Correr demasiado rápido al inicio y colapsar a los 5-6 minutos (la clave es ritmo sostenido).',
                    'Detenerse a caminar durante periodos prolongados.'
                ],
                video: 'https://www.youtube.com/watch?v=RQaVMWjXT5g'
            },
            'flexibility': {
                title: 'Flexibilidad Sit and Reach (cm)',
                icon: 'fa-child-reaching',
                category: 'Flexibilidad Posterior',
                objective: 'Evaluar la elasticidad de los isquiotibiales y la movilidad en flexión lumbopélvica. Buena flexibilidad posterior previene lesiones lumbares y permite fluidez en técnicas como Nakbeop (caídas) y Deonjigi (proyecciones).',
                steps: [
                    'El atleta se sienta en el suelo con las <strong>piernas completamente estiradas</strong> y juntas, las rodillas en extensión completa.',
                    'Los <strong>pies se apoyan contra el cajón de Sit and Reach</strong> (o contra una pared/caja). Las plantas deben estar perpendiculares al suelo.',
                    'El evaluador se arrodilla al lado y coloca una mano suavemente sobre las rodillas del atleta para asegurar que no se flexionen.',
                    'El atleta coloca una mano sobre la otra, con las palmas hacia abajo y los dedos superpuestos.',
                    'Lentamente, sin rebotes ni tirones, el atleta flexiona el tronco hacia adelante deslizando las yemas de los dedos sobre la regla del cajón.',
                    'Debe llegar lo más lejos posible y <strong>mantener la posición durante 2 segundos</strong>.',
                    'El punto 0 del cajón se fija al nivel de los pies. Valores positivos (+) indican que los dedos superan los pies; valores negativos (-) indican que no los alcanzan.',
                    'Realizar 2 intentos y registrar el <strong>mejor resultado</strong> en centímetros.'
                ],
                equipment: 'Cajón de Sit and Reach estandarizado. Alternativa casera: una caja resistente con una regla fijada encima sobresaliendo por el borde hacia los pies.',
                errors: [
                    'Flexionar las rodillas durante la prueba (invalida la medición).',
                    'Realizar rebotes o impulsos bruscos para ganar distancia (solo movimiento progresivo y continuo).',
                    'No calentar previamente (un calentamiento de 5 min mejora el resultado y previene tirones).',
                    'Colocar una mano más adelantada que la otra.'
                ],
                video: 'https://www.youtube.com/watch?v=bLCpuiBfbYQ'
            },
            'split': {
                title: 'Apertura de Piernas / Split (cm)',
                icon: 'fa-arrows-split-up-and-left',
                category: 'Flexibilidad Articular',
                objective: 'Medir la flexibilidad de los músculos aductores y la movilidad de la articulación coxofemoral (cadera). Esencial para patadas altas a la cabeza como Dollyo Chagi, Yeop Chagi y Naeryo Chagi.',
                steps: [
                    'El atleta debe realizar un <strong>calentamiento previo</strong> de al menos 5-10 minutos con énfasis en estiramientos dinámicos de piernas y caderas.',
                    'Sobre el tatami, el atleta realiza una <strong>apertura lateral máxima de piernas</strong> (split frontal/lateral), descendiendo lentamente hasta alcanzar su límite de apertura.',
                    'Las <strong>rodillas deben estar completamente extendidas</strong> y el torso erguido (no inclinado hacia adelante).',
                    'Las puntas de los pies pueden apuntar hacia arriba o hacia el frente, pero deben ser consistentes en todas las mediciones.',
                    'El evaluador mide con una regla o cinta métrica la <strong>distancia en centímetros desde el pubis hasta el suelo</strong>.',
                    '<strong>Interpretación:</strong> 0 cm = Split completo. Cuanto menor sea la distancia al suelo, mayor es la flexibilidad.',
                    'Registrar el valor en centímetros. Si el atleta logra un split completo (0 cm), se puede registrar como "Split total".'
                ],
                equipment: 'Tatami o superficie lisa, cinta métrica o regla rígida.',
                errors: [
                    'Realizar la prueba sin calentamiento previo (riesgo elevado de desgarro muscular).',
                    'Flexionar las rodillas para acercarse más al suelo (trampa y medición inválida).',
                    'Inclinarse hacia adelante para compensar la falta de apertura.',
                    'Forzar al atleta a bajar más allá de su límite (riesgo de lesión).'
                ],
                video: 'https://www.youtube.com/watch?v=3HvxWrOma-4'
            },
            'kick-flex': {
                title: 'Flexibilidad Activa de Patada (%)',
                icon: 'fa-person-walking',
                category: 'Flexibilidad Dinámica',
                objective: 'Evaluar el rango de movimiento activo dinámico y la fuerza de los flexores de cadera para elevar una patada sin asistencia externa. Mide la "altura funcional de patada" real del atleta.',
                steps: [
                    'Realizar un calentamiento previo con estiramientos dinámicos de piernas y caderas (5-10 minutos).',
                    'El atleta se coloca de pie lateral a una <strong>pared graduada</strong> (o pared con cinta métrica vertical).',
                    'Ejecuta una elevación de pierna <strong>estirada y lenta</strong> (Naeryo Chagi o Ap Chagi lento) de forma controlada, sin impulso ni rebote.',
                    'La pierna de apoyo debe permanecer <strong>recta y firme</strong>, la pierna de pateo con la <strong>rodilla completamente extendida</strong>.',
                    'Elevar la pierna a la <strong>máxima altura posible</strong> y mantener la posición 2 segundos.',
                    'El evaluador registra la altura alcanzada por el <strong>talón</strong> respecto a la escala en la pared.',
                    '<strong>Cálculo:</strong> (Altura del talón / Estatura del atleta) x 100 = % de la estatura.',
                    'Registrar el porcentaje. Valores mayores a 100% indican que el atleta puede patear por encima de su propia cabeza.'
                ],
                equipment: 'Pared con escala de altura graduada en centímetros, o cinta métrica vertical fijada a la pared.',
                errors: [
                    'Dar impulso o rebote para subir la pierna (debe ser movimiento controlado).',
                    'Flexionar la rodilla de la pierna de pateo.',
                    'Inclinar el tronco hacia atrás para compensar la elevación de la pierna.',
                    'No medir respecto a la estatura del atleta (la altura absoluta no es comparable entre atletas de diferentes tallas).'
                ],
                video: null
            },
            'balance': {
                title: 'Test del Flamenco / Equilibrio (seg)',
                icon: 'fa-person-praying',
                category: 'Equilibrio Propioceptivo',
                objective: 'Evaluar la estabilidad propioceptiva y el control postural en apoyo monopedal. Fundamental para encadenar secuencias de patadas en combate sin perder el centro de gravedad (Chungshim).',
                steps: [
                    'El atleta se quita los zapatos y se coloca <strong>de pie, descalzo, sobre el tatami</strong>.',
                    'Apoyarse sobre la <strong>pierna dominante</strong> (la pierna de apoyo habitual al patear).',
                    'Flexionar la otra pierna hacia atrás y sujetar el empeine con la <strong>mano del mismo lado</strong> (como un estiramiento de cuádriceps).',
                    'La otra mano se coloca en la cadera.',
                    'Los ojos permanecen <strong>abiertos</strong>, fijando la mirada en un punto al frente a la altura de los ojos.',
                    'El evaluador inicia el cronómetro cuando el atleta adopta la posición y levanta el pie.',
                    '<strong>El test finaliza cuando:</strong> el pie de apoyo se desplaza de su posición, el atleta salta, el pie suspendido toca el suelo, o la mano suelta el empeine.',
                    'Registrar el tiempo total en segundos.',
                    '<strong>Variante avanzada:</strong> Se puede realizar con ojos cerrados para medir el equilibrio vestibular puro (sin input visual).'
                ],
                equipment: 'Cronómetro y tatami o superficie plana y firme.',
                errors: [
                    'Realizar la prueba sobre superficie inestable o irregular.',
                    'El atleta fija la mirada en el suelo en lugar de al frente.',
                    'Usar zapatos (altera la propriocepción plantar).',
                    'No definir claramente cuál pierna es la de apoyo (debe ser siempre la misma en mediciones sucesivas).'
                ],
                video: 'https://www.youtube.com/watch?v=qSuFZJOMpOw'
            },
            'agility': {
                title: 'Sprint 10 Metros Planos (seg)',
                icon: 'fa-bolt-lightning',
                category: 'Velocidad y Aceleración',
                objective: 'Medir la capacidad de aceleración explosiva en distancias muy cortas. En artes marciales, los combates se deciden en distancias de 1-3 metros; esta prueba evalúa la explosividad de las entradas de ataque y la velocidad de esquive.',
                steps: [
                    'Marcar con conos o cinta adhesiva una <strong>línea de salida y una línea de llegada</strong> separadas exactamente por 10 metros, medidos con cinta métrica.',
                    'El atleta se coloca detrás de la línea de salida en <strong>posición de guardia de combate</strong> (no posición de velocista).',
                    'A la señal del evaluador (sonora: silbato o palmada; o visual: bajada de brazo), el atleta <strong>esprinta a máxima velocidad</strong> hasta cruzar la línea de los 10 metros.',
                    'El cronómetro se inicia en la señal y se detiene cuando el <strong>torso del atleta cruza la línea final</strong>.',
                    'Realizar <strong>2 intentos</strong> con un descanso mínimo de 60 segundos entre cada uno.',
                    'Registrar el <strong>mejor tiempo</strong> en segundos con 2 decimales.'
                ],
                equipment: 'Cronómetro digital (preferiblemente con fotocélulas para mayor precisión), conos de señalización, cinta métrica, silbato.',
                errors: [
                    'El atleta sale antes de la señal (falsa salida, se repite).',
                    'Medir los 10 metros de forma inexacta.',
                    'Iniciar el cronómetro con retraso respecto a la señal.',
                    'Detener el cronómetro cuando cruza el pie en lugar del torso.'
                ],
                video: null
            },
            'shuttle': {
                title: 'Shuttle Run 4x10m (seg)',
                icon: 'fa-person-running',
                category: 'Agilidad y Cambio de Dirección',
                objective: 'Evaluar la agilidad, coordinación dinámica y capacidad de frenado y cambio de dirección brusco a 180°. En combate, la habilidad de frenar, pivotar y contratacar es una ventaja decisiva.',
                steps: [
                    'Marcar <strong>2 líneas paralelas</strong> separadas por exactamente 10 metros con cinta adhesiva y conos.',
                    'El atleta se coloca detrás de la línea de salida en posición de guardia.',
                    'A la señal (silbato), el atleta corre a máxima velocidad hasta la línea opuesta (10m), <strong>toca el suelo detrás de la línea con la mano</strong>, y regresa corriendo al punto de partida (20m).',
                    'Nuevamente corre hasta la línea opuesta (30m), toca el suelo y regresa corriendo a la línea de partida (40m total).',
                    'El cronómetro se detiene cuando el atleta cruza la línea de partida por última vez.',
                    'Es <strong>obligatorio</strong> tocar el suelo con la mano detrás de cada línea en cada viraje (si no lo hace, el intento es nulo).',
                    'Registrar el tiempo total en segundos con 2 decimales.'
                ],
                equipment: 'Cronómetro, cinta adhesiva para líneas, al menos 4 conos de señalización, silbato.',
                errors: [
                    'No tocar el suelo detrás de la línea en cada viraje (intento nulo).',
                    'Realizar las curvas de forma muy amplia en lugar de frenos bruscos.',
                    'Distancia entre líneas no exacta (debe ser 10m precisos).',
                    'Iniciar la carrera antes de la señal.'
                ],
                video: 'https://www.youtube.com/watch?v=VbNxd0SoSMg'
            },
            'reaction': {
                title: 'Tiempo de Reacción (seg)',
                icon: 'fa-stopwatch-20',
                category: 'Reflejos de Combate',
                objective: 'Medir el tiempo de latencia neuromuscular desde que el atleta percibe un estímulo visual o auditivo de ataque hasta que inicia la respuesta motora de bloqueo o contraataque.',
                steps: [
                    '<strong>Método 1 - Test de la Regla de Nelson:</strong>',
                    'El evaluador sostiene una regla de 30 cm en posición vertical, con el extremo 0 cm hacia abajo.',
                    'El atleta extiende el brazo con la mano abierta a la altura de la marca 0 de la regla, sin tocarla, con el pulgar e índice a los lados.',
                    'Sin aviso previo, el evaluador <strong>suelta la regla</strong> y el atleta debe atraparla con los dedos lo más rápido posible.',
                    'Leer los centímetros donde el atleta atrapó la regla. Menor distancia = mejor reacción.',
                    '<strong>Conversión aprox.:</strong> Tiempo (s) = raíz cuadrada de (2 x distancia_cm / (100 x 9.81)).',
                    '<strong>Método 2 - Estímulo deportivo:</strong>',
                    'El evaluador sostiene un escudo de golpeo o presenta un estímulo sorpresivo (movimiento de palmeta, encendido de luz).',
                    'El atleta reacciona ejecutando un bloqueo o golpe predefinido.',
                    'El evaluador registra el tiempo con cronómetro deportivo (las apps de reacción en tablet también sirven).',
                    'Realizar <strong>3 repeticiones</strong>, descartar falsas salidas y registrar el <strong>promedio de las 3 mediciones válidas</strong>.'
                ],
                equipment: 'Regla de 30 cm (método Nelson), o dispositivo electrónico de reacción, o escudo de golpeo con cronómetro. Apps de reacción en tablet: "Reaction Time" o similares.',
                errors: [
                    'El atleta anticipa la caída (mira la mano del evaluador en lugar de la regla).',
                    'No descartar falsas salidas del promedio.',
                    'Pocas repeticiones (3 es el mínimo para un promedio fiable).',
                    'No estandarizar la distancia de la mano a la regla.'
                ],
                video: 'https://www.youtube.com/watch?v=1t_L4Iolw0c'
            },
            'kick-speed': {
                title: 'Vel. Patada FSKT (reps/10s)',
                icon: 'fa-shield-halved',
                category: 'Rendimiento de Combate',
                objective: 'Evaluar la frecuencia de impacto y velocidad de patadas circulares (Bandal Chagi) a potencia real. El FSKT (Frequency Speed of Kick Test) es un estándar en deportes de combate para medir la cadencia de patada efectiva.',
                steps: [
                    'El atleta se coloca en <strong>posición de guardia de combate</strong> frente a un escudo de golpeo sostenido firmemente por un compañero a la <strong>altura del abdomen</strong> del atleta.',
                    'La distancia es la distancia natural de alcance de patada circular (Bandal Chagi).',
                    'A la señal del evaluador, el atleta ejecuta la mayor cantidad posible de <strong>patadas Bandal Chagi alternadas (derecha-izquierda)</strong> durante exactamente <strong>10 segundos</strong>.',
                    'Cada patada debe impactar con <strong>potencia real</strong> sobre el escudo (no valen patadas al aire o sin fuerza).',
                    'El evaluador cuenta únicamente los <strong>impactos válidos</strong>: técnica correcta de recogida de rodilla (chambré), extensión de la pierna e impacto audible sobre el escudo.',
                    'Registrar el número total de patadas válidas.',
                    '<strong>Referencias orientativas:</strong> 12-15 = Principiante | 16-20 = Intermedio | 21-25 = Avanzado | Mayor a 25 = Élite.'
                ],
                equipment: 'Escudo de golpeo (pao) resistente, cronómetro, compañero que sostenga el escudo firmemente.',
                errors: [
                    'Patadas sin impacto o sin potencia ("tocar" el escudo en lugar de golpear).',
                    'No alternar piernas (patear solo con la pierna dominante).',
                    'El compañero que sostiene el escudo se aleja y cambia la distancia.',
                    'Contar patadas sin recogida de rodilla (pierna recta sin chambré).'
                ],
                video: 'https://www.youtube.com/watch?v=_V-D7Bvb0xg'
            },
            'anaerobic': {
                title: 'Ráfaga de Golpeo 30 seg (reps)',
                icon: 'fa-hand-fist',
                category: 'Potencia Anaeróbica',
                objective: 'Medir la potencia y capacidad anaeróbica láctica específica de combate. Evalúa la capacidad del atleta de sostener intercambios de alta intensidad y cadencia durante un round sin decaer.',
                steps: [
                    'El atleta se coloca en <strong>posición de guardia de combate</strong> frente a un saco de boxeo o escudo de golpeo.',
                    'El evaluador explica que durante 30 segundos debe ejecutar <strong>combinaciones libres y continuas de puño y patada</strong> a máxima intensidad y cadencia.',
                    'A la señal (silbato o palmada), el atleta comienza a golpear y patear el saco/escudo sin detenerse.',
                    'Se permiten todas las técnicas válidas: puñetazos directos (Jireugi), ganchos, patadas circulares (Bandal), patadas laterales (Yeop), patadas frontales (Ap Chagi), etc.',
                    'Cada impacto debe ser <strong>contundente y con potencia real</strong> (no vale tocar o empujar).',
                    'El evaluador cuenta el <strong>número total de impactos contundentes válidos</strong> durante los 30 segundos.',
                    'A los 30 segundos exactos, el evaluador da la señal de parar.',
                    '<strong>Se observa también:</strong> si el atleta mantiene la guardia, si la potencia decae significativamente en los últimos 10 segundos, y si mantiene la técnica bajo fatiga.'
                ],
                equipment: 'Saco de boxeo/Hapkido pesado (40-60 kg) o escudos de golpeo, cronómetro, silbato.',
                errors: [
                    'Golpes sin potencia o "palmaditas" que no cuentan como impactos válidos.',
                    'Detenerse durante los 30 segundos (pérdida de cadencia).',
                    'No mantener la guardia (manos abajo, mentón expuesto).',
                    'Mover el saco excesivamente sin control (el compañero debe sostenerlo firme).'
                ],
                video: null
            },
            'jump-long': {
                title: 'Salto Largo Deportivo (m)',
                icon: 'fa-person-running',
                category: 'Hapkido Deportivo',
                objective: 'Evaluar la potencia de salto con carrera previa para las modalidades competitivas de Hapkido Deportivo (exhibición, saltos deportivos, rompimientos en vuelo).',
                steps: [
                    'Disponer de una pista de salto con una <strong>línea o tabla de batida</strong> y una zona de caída con colchonetas o arena.',
                    'El atleta realiza una <strong>carrera de aproximación de 10 a 15 metros</strong> a velocidad creciente.',
                    'Justo antes de la línea de batida, el atleta despega con <strong>un solo pie</strong> (no debe pisar ni sobrepasar la línea).',
                    'En el aire, puede realizar movimientos técnicos de Hapkido si la prueba lo requiere.',
                    'Aterriza sobre la colchoneta o zona de caída.',
                    'Medir la <strong>distancia en metros</strong> desde la línea de batida hasta la marca más cercana dejada por cualquier parte del cuerpo en la caída.',
                    'Si el atleta sobrepasa la línea de batida, el salto es <strong>nulo</strong>.',
                    'Registrar el mejor de 2 intentos.'
                ],
                equipment: 'Pista de salto con zona de caída acolchada, cinta métrica, línea de batida marcada.',
                errors: [
                    'Sobrepasar la línea de batida (salto nulo).',
                    'Carrera de aproximación demasiado corta o lenta.',
                    'Caída sin control (riesgo de lesión).'
                ],
                video: null
            },
            'jump-high': {
                title: 'Salto Alto Deportivo (m)',
                icon: 'fa-arrow-up-right-dots',
                category: 'Hapkido Deportivo',
                objective: 'Evaluar la altura máxima alcanzada en saltos de exhibición con técnica de Hapkido (salto tijera, salto frontal, patada en vuelo) sobre obstáculos o listón.',
                steps: [
                    'Disponer de postes de salto alto con un <strong>listón elástico</strong> (o cinta que caiga fácilmente) y colchonetas de caída reglamentarias.',
                    'El atleta realiza una <strong>carrera de aproximación en arco</strong> hacia el listón.',
                    'Despega e intenta superar el listón limpiamente con la técnica de su preferencia.',
                    'Si el listón no cae, el salto es <strong>válido</strong>.',
                    'Se van subiendo las alturas progresivamente hasta que el atleta no pueda superar la altura.',
                    'Registrar la <strong>última altura superada limpiamente</strong> en metros.'
                ],
                equipment: 'Postes de salto alto con listón elástico, zona de caída con colchonetas reglamentarias, cinta métrica.',
                errors: [
                    'Caída sin colchonetas adecuadas (riesgo de lesión grave).',
                    'Listón rígido que no cede al contacto (usar listón elástico o cinta).',
                    'No calentar adecuadamente antes de intentar alturas altas.'
                ],
                video: null
            },
            'score-figures-sin': {
                title: 'Figuras Sin Armas (1.0 - 10.0)',
                icon: 'fa-medal',
                category: 'Técnica Tradicional',
                objective: 'Calificación de la perfección técnica, potencia, equilibrio, ritmo, respiración y espíritu marcial en la ejecución de Formas (Hyungs) tradicionales de Hapkido sin armas.',
                steps: [
                    'El atleta se presenta en el tatami oficial de competencia.',
                    'Ejecuta la <strong>forma (Hyung) oficial correspondiente a su grado</strong> de cinturón.',
                    'El panel de jueces evalúa los siguientes criterios:',
                    '<strong>Postura (Gubi):</strong> Posiciones correctas, estables y con arraigo.',
                    '<strong>Mirada (Shiseon):</strong> Dirección de la mirada correcta, transmitiendo intención.',
                    '<strong>Respiración (Ki):</strong> Coordinación de la respiración con las técnicas, Kihap adecuados.',
                    '<strong>Potencia:</strong> Cada técnica ejecutada con fuerza y contundencia.',
                    '<strong>Ritmo y Tempo:</strong> Alternancia correcta entre movimientos rápidos y pausas.',
                    'La calificación se otorga en escala de <strong>1.0 a 10.0</strong> según el reglamento oficial FEVEHAPKIDO.',
                    'Ingresar la calificación numérica del panel de jueces.'
                ],
                equipment: 'Tatami oficial de competencia.',
                errors: [
                    'Confundir la secuencia de la forma.',
                    'Perder el equilibrio durante la ejecución.',
                    'Falta de Kihap o Kihap en los momentos incorrectos.'
                ],
                video: null
            },
            'score-figures-con': {
                title: 'Figuras Con Armas (1.0 - 10.0)',
                icon: 'fa-award',
                category: 'Técnica con Armas',
                objective: 'Calificación de la destreza, control, fluidez y precisión en el manejo de armas tradicionales de Hapkido (Bong, Danbong, Ssangjeolbong, Daeryeon).',
                steps: [
                    'El atleta se presenta con el <strong>arma reglamentaria</strong> correspondiente a su grado.',
                    'Ejecuta el esquema técnico oficial con el arma.',
                    'El panel de jueces evalúa:',
                    '<strong>Control del arma:</strong> El arma no se escapa, no tiembla, los movimientos son precisos.',
                    '<strong>Trayectorias:</strong> Los cortes, bloqueos y golpes siguen las líneas correctas.',
                    '<strong>Retención:</strong> El agarre es firme y seguro en todo momento.',
                    '<strong>Balance corporal:</strong> El cuerpo se mantiene estable y coordinado con el arma.',
                    '<strong>Potencia y fluidez:</strong> Transiciones suaves entre técnicas con potencia audible.',
                    'Calificación en escala de <strong>1.0 a 10.0</strong> según reglamento oficial.',
                    'Ingresar la calificación numérica.'
                ],
                equipment: 'Arma reglamentaria (Bong, Danbong, Ssangjeolbong, etc.), tatami oficial.',
                errors: [
                    'Soltar el arma durante la ejecución.',
                    'Trayectorias imprecisas o descontroladas.',
                    'Falta de coordinación entre los movimientos del cuerpo y el arma.'
                ],
                video: null
            },
            'score-demo': {
                title: 'Defensa Personal (1.0 - 10.0)',
                icon: 'fa-user-shield',
                category: 'Hosinsul',
                objective: 'Calificación de la efectividad, realismo, control de luxaciones (Kkeokgi), proyecciones (Deonjigi), desequilibrios y neutralización ante agresiones simuladas.',
                steps: [
                    'El atleta se presenta con un <strong>compañero (Uke)</strong> que realizará los ataques.',
                    'El compañero ejecuta una serie de <strong>agresiones predefinidas</strong>: agarres al Dobok, agarres de muñeca (Sonmok), ataques de puño, patada, y opcionalmente con arma.',
                    'El atleta demuestra <strong>técnicas de defensa personal</strong> respondiendo con bloqueos, luxaciones, proyecciones y/o controles.',
                    'El panel evalúa:',
                    '<strong>Efectividad:</strong> Las técnicas funcionarían en una situación real.',
                    '<strong>Realismo:</strong> Los ataques y defensas son creíbles y con intención.',
                    '<strong>Control:</strong> Las luxaciones y proyecciones se ejecutan con seguridad para el compañero.',
                    '<strong>Fluidez:</strong> Transiciones naturales entre técnicas.',
                    '<strong>Variedad:</strong> Uso de un repertorio amplio de técnicas.',
                    'Calificación en escala de <strong>1.0 a 10.0</strong> según reglamento oficial.',
                    'Ingresar la calificación numérica.'
                ],
                equipment: 'Tatami reglamentario, Dobok, compañero de práctica.',
                errors: [
                    'Técnicas ensayadas que parecen coreografiadas y sin realismo.',
                    'Falta de control que pone en riesgo al compañero.',
                    'Repertorio técnico limitado o repetitivo.'
                ],
                video: null
            }
        };

        var p = protocols[metricKey];
        if (!p) {
            this.showAlert('No hay información detallada disponible para esta prueba.', 'info', 'Guía de Medición');
            return;
        }

        var stepsHTML = '<ol>';
        for (var i = 0; i < p.steps.length; i++) {
            stepsHTML += '<li>' + p.steps[i] + '</li>';
        }
        stepsHTML += '</ol>';

        var errorsHTML = '';
        if (p.errors && p.errors.length > 0) {
            errorsHTML = '<div class="warn-box"><strong><i class="fa-solid fa-triangle-exclamation"></i> Errores comunes a evitar:</strong><ul>';
            for (var j = 0; j < p.errors.length; j++) {
                errorsHTML += '<li>' + p.errors[j] + '</li>';
            }
            errorsHTML += '</ul></div>';
        }

        var videoHTML = '';
        if (p.video) {
            videoHTML = '<a href="' + p.video + '" target="_blank" rel="noopener noreferrer" class="video-link"><i class="fa-brands fa-youtube"></i> Ver video explicativo</a>';
        }

        var htmlContent = '<div class="protocol-guide">' +
            '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">' +
                '<span class="badge primary" style="font-size: 11px;"><i class="fa-solid ' + p.icon + '"></i> ' + p.category + '</span>' +
            '</div>' +
            '<p style="margin-bottom: 10px;">' +
                '<strong style="color: var(--primary);"><i class="fa-solid fa-bullseye"></i> Objetivo Fisiológico y Marcial:</strong><br>' +
                p.objective +
            '</p>' +
            '<div style="margin-bottom: 10px;">' +
                '<strong style="color: var(--accent);"><i class="fa-solid fa-clipboard-list"></i> Cómo realizar la medición (Paso a Paso):</strong>' +
                stepsHTML +
            '</div>' +
            '<div class="equip-box">' +
                '<p style="margin-bottom: 6px;">' +
                    '<strong style="color: #38bdf8;"><i class="fa-solid fa-toolbox"></i> Equipamiento necesario:</strong><br>' +
                    p.equipment +
                '</p>' +
            '</div>' +
            errorsHTML +
            videoHTML +
        '</div>';

        this.showAlert(htmlContent, 'info', p.title);
    };
