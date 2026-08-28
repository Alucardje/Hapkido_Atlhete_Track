console.log('Module: hapkido-exams.js loaded');
/**
 * Module: hapkido-exams.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.loadBeltExam = function() {
        const athleteId = document.getElementById('exam-athlete-select').value;
        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        const BELTS = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
        const currentIdx = BELTS.indexOf(athlete.belt);
        let targetBelt = "";
        
        if (currentIdx === -1) {
            targetBelt = "Amarillo";
        } else if (currentIdx >= BELTS.length - 1) {
            targetBelt = BELTS[BELTS.length - 1]; // Already 9th Dan
            alert("El atleta ya ostenta el grado máximo (Negro 9no Dan).");
            return;
        } else {
            targetBelt = BELTS[currentIdx + 1];
        }

        // Authorization check for Assistant Instructors (Ayudantes)
        if (this.currentUser && this.currentUser.role === 'ayudante') {
            const indexCurrentUser = BELTS.indexOf(this.currentUser.belt);
            const indexTarget = BELTS.indexOf(targetBelt);
            if (indexTarget >= indexCurrentUser) {
                alert(`No tienes permisos para evaluar este examen. Tu rango actual es Cinturón ${this.currentUser.belt} y solo puedes evaluar exámenes de grados estrictamente inferiores.`);
                document.getElementById('exam-evaluation-panel').classList.add('hidden');
                return;
            }
        }

        document.getElementById('exam-current-belt').textContent = `Cinta Actual: ${athlete.belt}`;
        document.getElementById('exam-target-belt').textContent = `Siguiente Cinta: ${targetBelt}`;
        document.getElementById('exam-title-text').textContent = `Examen de Cinta para: ${athlete.name}`;

        // Get technical curriculum guidelines
        const curriculum = this.getCurriculumDetails(targetBelt);
        document.getElementById('curriculum-strikes-info').textContent = "Golpes: " + curriculum.strikes;
        document.getElementById('curriculum-kicks-info').textContent = "Patadas: " + curriculum.kicks;
        document.getElementById('curriculum-locks-info').textContent = "Llaves: " + curriculum.locks;
        document.getElementById('curriculum-throws-info').textContent = "Proyecciones: " + curriculum.throws;
        document.getElementById('curriculum-nakbeop-info').textContent = "Repaso: " + curriculum.nakbeop;

        // Generate curriculum checklist HTML
        const checklistHTML = this.generateCurriculumChecklist(athlete.belt, targetBelt);
        document.getElementById('exam-curriculum-checklist').innerHTML = checklistHTML;

        document.getElementById('exam-evaluation-panel').classList.remove('hidden');
    }


HapkidoApp.prototype.generateCurriculumChecklist = function(currentBelt, targetBelt) {
        const BELTS = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
        const currentIdx = BELTS.indexOf(currentBelt);

        const targetCurr = this.getCurriculumDetails(targetBelt);
        const currentCurr = currentIdx >= 0 ? this.getCurriculumDetails(currentBelt) : null;

        let html = '';

        // Section 1: Target Belt Requisites (Required checkboxes)
        html += `
            <div class="curriculum-section">
                <div class="curriculum-checklist-title"><i class="fa-solid fa-award"></i> Técnicas del Cinturón Objetivo (${targetBelt})</div>
                <div class="curriculum-checklist-items">
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Golpes]</strong> <span class="tech-desc">${targetCurr.strikes}</span></span>
                    </label>
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Patadas]</strong> <span class="tech-desc">${targetCurr.kicks}</span></span>
                    </label>
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Llaves]</strong> <span class="tech-desc">${targetCurr.locks}</span></span>
                    </label>
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Proyecciones]</strong> <span class="tech-desc">${targetCurr.throws}</span></span>
                    </label>
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Caídas]</strong> <span class="tech-desc">${targetCurr.nakbeop}</span></span>
                    </label>
                    ${targetCurr.weapons ? `
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Armas/Formas]</strong> <span class="tech-desc">${targetCurr.weapons}</span></span>
                    </label>` : ''}
                    ${targetCurr.theory ? `
                    <label class="curriculum-item-check">
                        <input type="checkbox">
                        <span><strong class="tech-tag">[Teoría/Filosofía]</strong> <span class="tech-desc">${targetCurr.theory}</span></span>
                    </label>` : ''}
                </div>
            </div>
        `;

        // Section 2: Review Current Belt
        if (currentCurr) {
            html += `
                <div class="curriculum-section mt-20" style="border-top: 1px dashed var(--border-color); padding-top: 16px;">
                    <div class="curriculum-checklist-title" style="color: var(--accent);"><i class="fa-solid fa-arrows-spin"></i> Repaso Obligatorio del Cinturón Actual (${currentBelt})</div>
                    <div class="curriculum-checklist-items">
                        <label class="curriculum-item-check">
                            <input type="checkbox">
                            <span><strong class="tech-tag">[Repaso Golpes/Pateo]</strong> <span class="tech-desc">${currentCurr.strikes} | ${currentCurr.kicks}</span></span>
                        </label>
                        <label class="curriculum-item-check">
                            <input type="checkbox">
                            <span><strong class="tech-tag">[Repaso Defensa/Lances]</strong> <span class="tech-desc">${currentCurr.locks} | ${currentCurr.throws}</span></span>
                        </label>
                        <label class="curriculum-item-check">
                            <input type="checkbox">
                            <span><strong class="tech-tag">[Repaso Caídas]</strong> <span class="tech-desc">${currentCurr.nakbeop}</span></span>
                        </label>
                    </div>
                </div>
            `;
        }

        // Section 3: Review Inferior Belts
        const inferiorBelts = [];
        for (let i = 0; i < currentIdx; i++) {
            inferiorBelts.push(BELTS[i]);
        }

        if (inferiorBelts.length > 0) {
            html += `
                <div class="curriculum-section mt-20" style="border-top: 1px dashed var(--border-color); padding-top: 16px;">
                    <div class="curriculum-checklist-title" style="color: var(--text-secondary);"><i class="fa-solid fa-layer-group"></i> Repaso Acumulativo de Rangos Inferiores</div>
                    <div class="curriculum-checklist-items">
                        <label class="curriculum-item-check">
                            <input type="checkbox">
                            <span><strong class="tech-tag">[Acumulado]</strong> <span class="tech-desc">Saber todo el currículum técnico previo de: <strong>${inferiorBelts.join(', ')}</strong> (leyes de movimiento circular, caídas fundamentales, patadas de base y llaves básicas de escape).</span></span>
                        </label>
                    </div>
                </div>
            `;
        }

        return html;
    }


HapkidoApp.prototype.getCurriculumDetails = function(targetBelt) {
        const curriculum = {
            "Amarillo": {
                strikes: "Básico cuadrado en Juchum seogi (posición de jineta) con Arae, Momtong y Eolgul Makgi (bloqueos bajo, medio, alto). Defensa en movimiento. Patrón de guardia 1.",
                kicks: "Dwichuk cha-olligi (elevación de pierna), Dwichuk bakkat-dari chagi (abanico exterior), Dwichuk an-dari chagi (abanico interior), Dwichuk chagi (patada con talón), Ap chagi (de frente), Dollyeo chagi (circular) y Baldeung chagi (empeine).",
                locks: "Salidas de agarre (6 técnicas). Puño contra puño (10 técnicas de defensa personal básica).",
                throws: "Desequilibrio de cadera básico, proyecciones simples.",
                nakbeop: "Nakbeop (caídas) básicas: Jeonbang (adelante), Cheokbang (lateral), Hubang (atrás). Gureugi (rodada cruzada corta).",
                weapons: "Básicos de Ssangjeolbong (nunchaku - err. fon. Sancholbong) 1-15 y palo largo (Bong) 1-15. Pumsae: Joong Do il dan.",
                theory: "Posiciones (Juchum seogi, Ap seogi, Dwit-gubi, Beom seogi). Bloqueos (Arae, Momtong, Eolgul). Conteo del 1 al 10. Significado de Hapkido y Dojunim (Fundador)."
            },
            "Naranja": {
                strikes: "Básico cuadrado en Juchum seogi con Batangson chigi (golpe con talón de palma) y Sonnal mok-chigi (canto al cuello). Combate prometido 1, 2, 3. Patrón de patada 1.",
                kicks: "Chokdo jireugi (empuje con filo de pie), An-dari cha-neotki (abanico adentro penetrante), Mureup chagi (rodillazo), Yeop chagi (lateral), Kkeokneun chagi (patada de torsión/fractura - err. fon. Cokenne) y Dwit-dollyeo chagi (cañoncito con talón).",
                locks: "Defensa personal: Puño contra patada (10). Agarre de muñeca (1-10 de las 57 técnicas oficiales).",
                throws: "Desequilibrios dinámicos de cadera y derribos de cadera básicos.",
                nakbeop: "Gureugi (rollo largo al frente), Nakbeop básico completo, caída simple con obstáculo atrás/lateral, rueda estrella.",
                weapons: "Básicos de Ssangjeolbong y palo largo hasta el 30. Pumsae: Bon sho dan.",
                theory: "Básico de respiración hasta el 25. Son Do il dan. Conteo 10-20. Juramento del Hapkido. Los 3 principios (Hwa [Armonía], Won [Círculo], Yu [Agua]). Rompimiento básico."
            },
            "Verde": {
                strikes: "Básicos en Dwit-gubi y Ap-gubi 1-6. Patrón de guardia 2. Pumsae: Joong Do i dan.",
                kicks: "Dwitkumchi nak-chyeo chagi (gancho a corva con talón), Mit-chuk chagi (patada al cóccix), Yeop cha-neotki (lateral penetrante), Dora yeop chagi (lateral con giro), Dora dwi chagi (atrás con giro), Huryeo chagi (látigo/gancho - err. fon. Feyon), Anja dollyeo chagi (circular agachado) y Anja huryeo chagi (látigo agachado).",
                locks: "Defensa personal: Puño contra llave. Agarre de muñeca (11-20 de las 57).",
                throws: "Proyecciones con llave y barridos simples en clinch (cuerpo a cuerpo).",
                nakbeop: "Parada de manos, Jeonbang nakbeop (caída frontal/gato), Hubang nakbeop, Cheokbang nakbeop, Woljang nakbeop (caída de gotera/salto de pared), Gongjung hwejeon nakbeop (salto mortal aéreo) y Meolli gureugi (rollo de tigre largo).",
                weapons: "Pumsae de Ssangjeolbong (nunchaku) Nº 1.",
                theory: "Respiración completa. Zonas del cuerpo en coreano. Conteo 1-30. 3 movimientos en coreano. Rompimiento doble. Banderas del arbitraje."
            },
            "Azul": {
                strikes: "Básico anclado 1 y 2. Bloqueos: Kawi makgi (tijeras), Nulleo makgi (presión), Geodeureo makgi (asistido), Jebipum sonnal mok-chigi, Pyeon jumok (puño plano) y Batangson momtong nulleo makgi.",
                kicks: "Patrón de patadas 2. Dora yeop cha-neotki (lateral giratoria penetrante), Chokdo dollyegi (filo girando abajo), Chokdo olligi (filo arriba) y Chokdo cha-naeryegi (filo descendente).",
                locks: "Agarres de muñeca (21-30 de las 57). Protocolo de saludo y etiqueta marcial del Dojang.",
                throws: "Lanzamientos con barridos de pierna posteriores (derribos avanzados).",
                nakbeop: "Jeonbang nakbeop (caída frontal desde altura), rueda estrella a una mano.",
                weapons: "Pumsae: Bon i dan. Combate prometido con palo largo (Bong).",
                theory: "Respiración abdominal y flujo de energía (Danjeon hoheup: apeu-ro [adelante], yeopeu-ro [lado], wi-ro [arriba], mit-eu-ro [abajo]). Son Do i dan. Conteo 1-50. Rompimiento doble. Arbitraje (planillas y faltas)."
            },
            "Morado": {
                strikes: "Bloqueos: Geodeureo momtong arae makgi, Otgoreo eolgul sonnal makgi, Palgup chigi (codos: dollyeo, ollyeo, yeop-eu-ro, dwi-ro, naeryeo), Geumgang makgi (bloqueo diamante).",
                kicks: "Bitureo chagi (patada torcida hacia afuera), Dwitkumchi cha-naeryegi (descendente con talón), patadas combinadas (Ap chagi + Dollyeo chagi).",
                locks: "Defensa contra agarre de solapa (31-40 de las 57).",
                throws: "Barrido interior con flexión profunda (Anja) y sumisión en el suelo.",
                nakbeop: "Caída lateral alta y repaso completo de caídas anteriores.",
                weapons: "Figura de Ssangjeolbong Nº 2. Defensa con palo largo (10). Pumsae: Joong Do sam dan.",
                theory: "Meditación de 3 horas. Vocabulario y señas oficiales del árbitro central. Deberes de árbitros laterales. Rompimiento con giro."
            },
            "Rojo": {
                strikes: "Describir un básico completo en coreano y ejecutarlo. Golpes a puntos vulnerables (Geupso - err. fon. Kupso).",
                kicks: "Patadas combinadas con desplazamiento avanzado, Jejari bandal chagi (media luna en el sitio / trompito).",
                locks: "Agarres e inmovilizaciones (41-57 de las 57). Sentado y defensa contra abrazos de oso.",
                throws: "Tijeretas completas a la cadera (Art. 14 del reglamento) y proyecciones de cadera dinámicas.",
                nakbeop: "Twieo hubang nakbeop (caída atrás alta), Twieo jeonbang nakbeop (caída frente alta), Twieo cheokbang nakbeop (lateral alta con obstáculo y punto de apoyo).",
                weapons: "Palo largo (Bong) 3. Puntos de ataque con bastón corto (Danbong - 30). Cortes con sable/espada (Gum). Pumsae: Joong Do sa dan.",
                theory: "Historia completa del Hapkido. Ubicar y nombrar 10 puntos vulnerables (Geupso). Simulación de arbitraje real. Rompimiento combinado con salto."
            },
            "Marrón": {
                strikes: "Salidas de Judo. Aplicaciones y contraataque. Movimientos fluidos de Son Do sa dan.",
                kicks: "Twieo huryeo chagi (látigo saltando), Jejari twieo huryeo chagi, patadas dobles saltando.",
                locks: "Defensas avanzadas, luxaciones contra bastón curvo (Danjang), llaves en movimiento.",
                throws: "Lanzamientos de sacrificio catapultando al rival (Art. 13) y derribos rápidos.",
                nakbeop: "Twieo cheokbang nakbeop (lateral alta sobre obstáculos sin apoyo), caída atrás alta a objetivo, caída lateral aérea con obstáculo.",
                weapons: "Defensa con abanico (Puche). Básicos de doble nunchaku (Ssangjeolbong). Defensas con bastón corto (Danbong - 13). Pumsae: Joong Do o dan.",
                theory: "Meditación de 5 horas. Vocabulario general completo. Rompimiento libre de alto grado. Faltas de árbitro central y señas."
            },
            "Negro 1er Dan": {
                strikes: "Maestría en bloque completo de Kwonbeop (mano abierta y puño) tradicional.",
                kicks: "Pateo acrobático de exhibición, saltos y patadas múltiples de combate real.",
                locks: "Defensa libre con cinturón (Tti - 10), defensa contra cuchillo (Dangom - 10) y agresores múltiples.",
                throws: "Proyecciones dinámicas directas con control absoluto y sometimiento en el suelo.",
                nakbeop: "Dominio absoluto del Nakbeop y escapes de llaves avanzadas.",
                weapons: "Nunchaku doble 1 (Pumsae), bastón corto (Danbong 1 - Pumsae), abanico (10). Joong Do o dan con música. Defensa de Danbong contra espada de bambú/práctica (Shinai).",
                theory: "Trabajo escrito de Hapkido (mínimo 4 hojas). Arbitraje como árbitro central. Reglamento completo de FEVEHAPKIDO."
            }
        };

        if (targetBelt.includes("Negro 2do Dan")) {
            return {
                strikes: "Combinaciones avanzadas de golpes a mano abierta (Kwonbeop) y contra-ataques.",
                kicks: "Patadas múltiples en suspensión, patadas acrobáticas aéreas en giro.",
                locks: "Defensa contra agarres dobles y sumisiones avanzadas de codo (Palgup) y hombro (Eokkae).",
                throws: "Lanzamientos avanzados utilizando puntos de apoyo y sacrificio corporal.",
                nakbeop: "Caídas de alta velocidad sobre superficies duras y escapes rápidos.",
                weapons: "Pumsae avanzado de sable (Gum) y bastón corto (Danbong / Tambó).",
                theory: "Principios de la enseñanza de las artes marciales y primeros auxilios en combate."
            };
        } else if (targetBelt.includes("Negro 3er Dan")) {
            return {
                strikes: "Maestría en puntos de presión (Geupso - err. Jap. Kyusho) combinados con golpes rápidos.",
                kicks: "Pateo continuo al vuelo y técnicas de interceptación en el aire.",
                locks: "Desarmes contra armas contundentes, cortopunzantes y agarres complejos.",
                throws: "Proyecciones de barrido de cadera y derribos desde guardia defensiva.",
                nakbeop: "Caídas acrobáticas sin manos y control del centro de gravedad.",
                weapons: "Formas avanzadas con abanico (Puche) y nunchakus dobles (Ssangjeolbong).",
                theory: "Historia de la federación y desarrollo filosófico del estudiante avanzado."
            };
        } else if (targetBelt.startsWith("Negro")) {
            const danMatch = targetBelt.match(/Negro (\d+)/);
            const danNum = danMatch ? danMatch[1] : "4to a 9no";
            return {
                strikes: `Maestría del ${danNum}to Dan: Aplicación de la fuerza interna en golpeo y defensas libres.`,
                kicks: `Pateo marcial avanzado adaptado a la anatomía del oponente, golpes de precisión extrema.`,
                locks: `Control de sumisión inmediata mediante palancas y luxaciones microscópicas. Defensas de alto riesgo.`,
                throws: `Proyecciones de control absoluto con dirección de caída controlada.`,
                nakbeop: `Control cinético absoluto del cuerpo en caídas y proyecciones de sacrificio.`,
                weapons: `Dominio de todas las armas del currículum (Cinturón [Tti], Sable [Gum], Bastón Curvo [Danjang], Palo Largo [Bong], Nunchaku [Ssangjeolbong]).`,
                theory: `Proyecto de investigación, tesis de maestría o desarrollo pedagógico para la difusión del Hapkido.`
            };
        }

        return curriculum[targetBelt] || {
            strikes: "Maestría técnica superior del Dan correspondiente.",
            kicks: "Pateo acrobático de combate y saltos avanzados.",
            locks: "Defensa libre y escapes complejos en situaciones de combate y defensa.",
            throws: "Lanzamientos de sacrificio y barridos complejos.",
            nakbeop: "Evaluación y repaso del curriculum completo de todos los cinturones."
        };
    }


HapkidoApp.prototype.saveBeltExam = function() {
        const athleteId = document.getElementById('exam-athlete-select').value;
        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        const strikes = parseFloat(document.getElementById('exam-strikes').value);
        const kicks = parseFloat(document.getElementById('exam-kicks').value);
        const locks = parseFloat(document.getElementById('exam-locks').value);
        const throws = parseFloat(document.getElementById('exam-throws').value);
        const nakbeop = parseFloat(document.getElementById('exam-nakbeop').value);
        const hyungs = parseFloat(document.getElementById('exam-hyungs').value) || null;
        const hosinsul = parseFloat(document.getElementById('exam-hosinsul').value) || null;
        const weapons = parseFloat(document.getElementById('exam-weapons').value) || null;
        const notes = document.getElementById('exam-notes').value.trim();

        if (isNaN(strikes) || isNaN(kicks) || isNaN(locks) || isNaN(throws) || isNaN(nakbeop)) {
            alert("Por favor rellene todos los campos de calificación obligatorios.");
            return;
        }

        const BELTS = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
        const currentIdx = BELTS.indexOf(athlete.belt);
        let targetBelt = "";
        
        if (currentIdx === -1) {
            targetBelt = "Amarillo";
        } else if (currentIdx >= BELTS.length - 1) {
            alert("El atleta ya ostenta el grado máximo.");
            return;
        } else {
            targetBelt = BELTS[currentIdx + 1];
        }

        let sum = strikes + kicks + locks + throws + nakbeop;
        let count = 5;
        if (hyungs !== null && !isNaN(hyungs)) { sum += hyungs; count++; }
        if (hosinsul !== null && !isNaN(hosinsul)) { sum += hosinsul; count++; }
        if (weapons !== null && !isNaN(weapons)) { sum += weapons; count++; }
        const avgScore = sum / count;
        const passed = avgScore >= 7.0;

        if (!passed) {
            alert(`El examen no ha sido aprobado. La calificación promedio es de ${avgScore.toFixed(1)}/10 (Se requiere mínimo 7.0/10). El estudiante debe seguir repasando su rango.`);
            return;
        }

        // Save Promotion Record
        const record = {
            id: 'rec_' + Date.now(),
            athleteId,
            date: new Date().toISOString().split('T')[0],
            type: 'EXAMEN',
            examDetails: {
                currentBelt: athlete.belt,
                targetBelt,
                avgScore,
                strikes,
                kicks,
                locks,
                throws,
                nakbeop,
                hyungs,
                hosinsul,
                weapons,
                notes,
                passed
            }
        };

        this.data.records.push(record);
        athlete.belt = targetBelt;
        
        // Update experience logic
        const princBelts = ["Blanco", "Amarillo", "Naranja", "Verde"];
        const interBelts = ["Azul", "Morado", "Rojo", "Marrón"];
        
        if (princBelts.includes(targetBelt)) athlete.experience = "PRINCIPIANTE";
        else if (interBelts.includes(targetBelt)) athlete.experience = "INTERMEDIO";
        else athlete.experience = "AVANZADO";

        this.saveData();

        alert(`¡EXAMEN APROBADO!\nEl estudiante ${athlete.name} ha sido promovido exitosamente a ${targetBelt}.`);
        
        document.getElementById('belt-exam-form').reset();
        document.getElementById('exam-evaluation-panel').classList.add('hidden');
        document.getElementById('exam-athlete-select').value = '';
        document.getElementById('btn-load-exam').disabled = true;

        this.renderExamHistoryTable();
        this.renderAthletesList();
        this.populateAthleteDropdowns();
    }


HapkidoApp.prototype.renderExamHistoryTable = function() {
        const tbody = document.querySelector('#exam-history-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const examRecords = this.data.records
            .filter(r => r.type === 'EXAMEN')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (examRecords.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No hay registros.</td></tr>`;
            return;
        }

        examRecords.forEach(rec => {
            const athlete = this.data.athletes.find(a => a.id === rec.athleteId);
            const athleteName = athlete ? athlete.name : "Atleta Eliminado";
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rec.date}</td>
                <td><strong>${athleteName}</strong></td>
                <td><span class="badge">${rec.examDetails.currentBelt}</span></td>
                <td><span class="badge success">${rec.examDetails.targetBelt}</span></td>
                <td><strong>${rec.examDetails.avgScore.toFixed(1)}/10</strong></td>
                <td><span class="badge success">Aprobado</span></td>
                <td><small>${rec.examDetails.notes || "-"}</small></td>
            `;
            tbody.appendChild(tr);
        });
    }

    /**
     * Metodología de Entrenamiento - Generación Dinámica del Plan Personalizado
     */

HapkidoApp.prototype.populateManualBeltsDropdown = function() {
        const select = document.getElementById('manual-program-belt');
        if (!select) return;

        const BELTS = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
        
        let visibleBelts = BELTS;
        
        if (this.currentUser) {
            if (this.currentUser.role === 'athlete') {
                const idx = BELTS.indexOf(this.currentUser.belt);
                visibleBelts = idx !== -1 ? BELTS.slice(0, idx + 1) : ["Blanco"];
            } else if (this.currentUser.role === 'ayudante') {
                const idx = BELTS.indexOf(this.currentUser.belt);
                visibleBelts = idx !== -1 ? BELTS.slice(0, idx) : [];
            }
        }

        select.innerHTML = '<option value="">-- Seleccione un Grado --</option>';
        visibleBelts.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.textContent = b;
            select.appendChild(opt);
        });

        const container = document.getElementById('manual-program-content');
        if (container) container.classList.add('hidden');
    }


HapkidoApp.prototype.renderTechnicalSyllabus = function(belt) {
        const container = document.getElementById('manual-program-content');
        if (!container) return;

        if (!belt) {
            container.classList.add('hidden');
            container.innerHTML = '';
            return;
        }

        container.classList.remove('hidden');
        const curriculum = this.getCurriculumDetails(belt);

        let html = `
            <div class="syllabus-header mb-20" style="padding-bottom: 12px; border-bottom: 2px solid var(--accent); display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 700; margin: 0;">Currículum Oficial - Cinturón ${belt}</h3>
                <span class="badge belt-${belt.toLowerCase().replace(/ /g, '-')}" style="font-size: 13px;">Grado Técnico</span>
            </div>
            <div class="syllabus-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="syllabus-col">
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-hand-fist"></i> Golpes / Bloqueos (Kwonbeop)</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.strikes}</p>
                    </div>
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-shoe-prints"></i> Técnicas de Patada (Chagi)</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.kicks}</p>
                    </div>
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-person-running"></i> Caídas (Nakbeop)</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.nakbeop}</p>
                    </div>
                </div>
                <div class="syllabus-col">
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-arrows-spin"></i> Llaves y Defensas (Kkeokgi)</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.locks}</p>
                    </div>
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-child"></i> Proyecciones y Derribos (Deonjigi)</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.throws}</p>
                    </div>
                    ${curriculum.weapons ? `
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-shield-halved"></i> Armas / Formas (Pumsae)</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.weapons}</p>
                    </div>` : ''}
                    ${curriculum.theory ? `
                    <div class="syllabus-item-block mb-15">
                        <h4 style="color: var(--accent); margin-bottom: 5px;"><i class="fa-solid fa-brain"></i> Teoría / Filosofía</h4>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary);">${curriculum.theory}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    // ==========================================================================
    // MULTIUSER PORTAL AND PASSWORD MANAGEMENT (ADMIN ONLY CRUD)
    // ==========================================================================



