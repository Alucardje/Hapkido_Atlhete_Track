console.log('Module: hapkido-athletes.js loaded');
/**
 * Module: hapkido-athletes.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.calculateAge = function(birthdateStr) {
        const birthDate = new Date(birthdateStr);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


HapkidoApp.prototype.calculateAgeCategory = function(birthdateStr) {
        const age = this.calculateAge(birthdateStr);
        if (age < 12) return "Infantil (Menor de 12)";
        if (age >= 12 && age <= 14) return "Junior (12-14 años)";
        if (age >= 15 && age <= 17) return "Juvenil (15-17 años)";
        if (age >= 18 && age <= 35) return "Mayores / Adulto (18-35 años)";
        if (age >= 36 && age <= 45) return "Senior (36-45 años)";
        return "Máster (46 años en adelante)";
    }


HapkidoApp.prototype.getWeightDivision = function(birthdateStr, gender, weight) {
        if (weight === null || weight === undefined || isNaN(weight) || weight === '') {
            return "Sin Peso Registrado";
        }
        const age = this.calculateAge(birthdateStr);
        const w = parseFloat(weight);

        if (age < 12) {
            return "Categoría Infantil (Sin divisiones oficiales)";
        }

        // JUNIOR (12-14 años)
        if (age >= 12 && age <= 14) {
            if (gender === "MASCULINO") {
                if (w < 40) return "-40 Kg";
                if (w < 45) return "-45 Kg";
                if (w < 50) return "-50 Kg";
                if (w < 55) return "-55 Kg";
                if (w < 60) return "-60 Kg";
                return "+60 Kg";
            } else {
                if (w < 38) return "-38 Kg";
                if (w < 43) return "-43 Kg";
                if (w < 48) return "-48 Kg";
                if (w < 53) return "-53 Kg";
                if (w < 58) return "-58 Kg";
                return "+58 Kg";
            }
        }

        // JUVENIL (15-17 años)
        if (age >= 15 && age <= 17) {
            if (gender === "MASCULINO") {
                if (w < 45) return "-45 Kg";
                if (w < 50) return "-50 Kg";
                if (w < 55) return "-55 Kg";
                if (w < 60) return "-60 Kg";
                if (w < 65) return "-65 Kg";
                if (w < 70) return "-70 Kg";
                if (w < 75) return "-75 Kg";
                return "+75 Kg";
            } else {
                if (w < 43) return "-43 Kg";
                if (w < 48) return "-48 Kg";
                if (w < 53) return "-53 Kg";
                if (w < 58) return "-58 Kg";
                if (w < 63) return "-63 Kg";
                if (w < 68) return "-68 Kg";
                if (w < 73) return "-73 Kg";
                return "+73 Kg";
            }
        }

        // MAYORES, SENIOR, MASTER (18+ años)
        if (gender === "MASCULINO") {
            if (w < 55) return "-55 Kg";
            if (w < 60) return "-60 Kg";
            if (w < 65) return "-65 Kg";
            if (w < 70) return "-70 Kg";
            if (w < 75) return "-75 Kg";
            if (w < 80) return "-80 Kg";
            if (w < 85) return "-85 Kg";
            if (w < 92) return "-92 Kg";
            return "-120 Kg";
        } else {
            if (w < 50) return "-50 Kg";
            if (w < 55) return "-55 Kg";
            if (w < 60) return "-60 Kg";
            if (w < 65) return "-65 Kg";
            if (w < 70) return "-70 Kg";
            if (w < 75) return "-75 Kg";
            if (w < 80) return "-80 Kg";
            return "+80 Kg";
        }
    }

    /**
     * Athlete Management Views & Forms
     */

/**
     * Returns an array of alert objects for a given athlete based on their
     * physical measurement history and profile completeness.
     * Each alert: { type: 'danger'|'warning'|'info', icon: 'fa-...', message: '...' }
     */
HapkidoApp.prototype.getAthleteAlerts = function(athlete) {
        const alerts = [];
        const age = this.calculateAge(athlete.birthdate);
        const isYoung = age < 18;
        const now = new Date();

        // Alert: no weight on profile
        if (athlete.weight === null || athlete.weight === undefined) {
            alerts.push({ type: 'danger', icon: 'fa-weight-scale', message: 'Sin peso registrado en el perfil.' });
        }

        // Get physical records sorted by date desc
        const physRecords = (this.data.records || [])
            .filter(r => r.athleteId === athlete.id && r.type === 'FISICA')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (physRecords.length === 0) {
            alerts.push({ type: 'danger', icon: 'fa-triangle-exclamation', message: 'Sin evaluación física registrada.' });
            return alerts;
        }

        const latest = physRecords[0];
        const lastDate = new Date(latest.date);
        const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        // Alert: stale full evaluation (> 90 days for everyone)
        if (daysSince > 90) {
            alerts.push({ type: 'warning', icon: 'fa-clock-rotate-left', message: `Evaluación física vencida (hace ${daysSince} días).` });
        }

        // Alert: stale weight in physical record
        const lastWeight = latest.physicalDetails ? latest.physicalDetails.weight : null;
        const weightThreshold = isYoung ? 21 : 45; // days
        if (!lastWeight && daysSince > weightThreshold) {
            alerts.push({ type: 'warning', icon: 'fa-weight-scale', message: `Peso no registrado en última evaluación.` });
        } else if (lastWeight && daysSince > weightThreshold) {
            const label = isYoung ? `${weightThreshold} días (menor de edad)` : `${weightThreshold} días`;
            alerts.push({ type: 'warning', icon: 'fa-weight-scale', message: `Peso desactualizado (hace ${daysSince} días; límite: ${label}).` });
        }

        // Alert: stale height for young athletes (> 90 days)
        if (isYoung) {
            const lastHeight = latest.physicalDetails ? latest.physicalDetails.height : null;
            if (!lastHeight || daysSince > 90) {
                alerts.push({ type: 'info', icon: 'fa-ruler-vertical', message: `Talla sin actualizar (menor de edad, hace ${daysSince} días).` });
            }
        }

        return alerts;
    }


HapkidoApp.prototype.renderAthletesList = function() {
        const tbody = document.querySelector('#athletes-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        // Active athletes only
        let athletes = this.data.athletes.filter(a => a.status !== 'inactivo');
        if (this.currentUser && this.currentUser.role !== 'admin') {
            athletes = athletes.filter(a => a.school === this.currentUser.school);
        }

        if (athletes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: var(--text-muted);">
                        No hay atletas registrados. Haz clic en "Nuevo Atleta" para comenzar.
                    </td>
                </tr>
            `;
            return;
        }

        athletes.forEach(ath => {
            const tr = document.createElement('tr');
            const age = this.calculateAge(ath.birthdate);
            const category = this.calculateAgeCategory(ath.birthdate);
            const division = this.getWeightDivision(ath.birthdate, ath.gender, ath.weight);
            
            let modText = [];
            if (ath.modalities && ath.modalities.tradicional) modText.push("Tradicional");
            if (ath.modalities && ath.modalities.deportivo) modText.push("Deportivo");

            // Alert badges for this athlete
            const athAlerts = this.getAthleteAlerts(ath);
            let alertBadge = '';
            if (athAlerts.length > 0) {
                const topAlert = athAlerts[0];
                const colorMap = { danger: '#ef4444', warning: '#f59e0b', info: '#38bdf8' };
                const color = colorMap[topAlert.type] || '#f59e0b';
                alertBadge = `<span title="${athAlerts.map(a => a.message).join('\n')}" style="color:${color}; margin-left:6px; cursor:help;"><i class="fa-solid ${topAlert.icon}"></i> ${athAlerts.length > 1 ? `(${athAlerts.length})` : ''}</span>`;
            }

            // Weight display – never show "null kg"
            const weightDisplay = ath.weight ? `${ath.weight} kg${ath.height ? ` / ${ath.height} cm` : ''}` : `<span style="color:var(--warning);">Sin peso${ath.height ? ` / ${ath.height} cm` : ''}</span>`;

            tr.innerHTML = `
                <td><strong>${ath.name}</strong>${alertBadge}</td>
                <td>${age} años</td>
                <td>${ath.gender}</td>
                <td>${ath.belt}</td>
                <td>${weightDisplay}</td>
                <td><span class="badge ${(ath.modalities && ath.modalities.deportivo) ? 'success' : 'warning'}">${modText.join(' / ')}</span></td>
                <td>${category} (${division})</td>
                <td class="actions-cell">
                    <button class="icon-btn edit" onclick="app.openEditAthleteModal('${ath.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="app.deleteAthlete('${ath.id}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Render inactive athletes section
        this.renderInactiveAthletesList();
    }


HapkidoApp.prototype.populateAthleteDropdowns = function() {
        if (!this.currentUser) return;

        let athletes = this.data.athletes.filter(a => a.status !== 'inactivo');
        if (this.currentUser.role !== 'admin') {
            athletes = athletes.filter(a => a.school === this.currentUser.school);
        }

        const dropdownCombate = document.getElementById('combate-athlete-select');
        const dropdownFisica = document.getElementById('physical-athlete-select');
        const dropdownAnalisis = document.getElementById('analysis-athlete-select');

        if (dropdownCombate) {
            dropdownCombate.innerHTML = '<option value="">-- Seleccione un atleta deportivo --</option>';
            athletes.filter(a => a.modalities && a.modalities.deportivo).forEach(ath => {
                const opt = document.createElement('option');
                opt.value = ath.id;
                opt.textContent = `${ath.name} (${this.calculateAgeCategory(ath.birthdate)})`;
                dropdownCombate.appendChild(opt);
            });
            // Update opponent dropdown based on current combat selection
            this.updateOpponentDropdown(dropdownCombate.value);
        }

        if (dropdownFisica) {
            dropdownFisica.innerHTML = '<option value="">-- Seleccione un atleta --</option>';
            athletes.forEach(ath => {
                const opt = document.createElement('option');
                opt.value = ath.id;
                opt.textContent = ath.name;
                dropdownFisica.appendChild(opt);
            });
        }

        if (dropdownAnalisis) {
            dropdownAnalisis.innerHTML = '<option value="">-- Seleccione un atleta --</option>';
            athletes.forEach(ath => {
                const opt = document.createElement('option');
                opt.value = ath.id;
                opt.textContent = ath.name;
                dropdownAnalisis.appendChild(opt);
            });
        }
    }


HapkidoApp.prototype.openNewAthleteModal = function() {
        const form = document.getElementById('athlete-form');
        form.reset();
        document.getElementById('athlete-id').value = '';
        document.getElementById('athlete-height').value = '';
        
        // Populate and lock/unlock schools
        this.populateAthleteSchoolsDropdown();
        
        // Hide Assistant Instructor checkbox by default for new athletes
        document.getElementById('athlete-is-ayudante').checked = false;
        document.getElementById('ayudante-group').style.display = 'none';
        
        document.getElementById('athlete-modal-title').textContent = 'Agregar Nuevo Atleta';
        document.getElementById('athlete-modal').classList.add('active');
    }


HapkidoApp.prototype.openEditAthleteModal = function(id) {
        const ath = this.data.athletes.find(a => a.id === id);
        if (!ath) return;

        document.getElementById('athlete-id').value = ath.id;
        document.getElementById('athlete-name').value = ath.name;
        document.getElementById('athlete-birthdate').value = ath.birthdate;
        document.getElementById('athlete-gender').value = ath.gender;
        document.getElementById('athlete-belt').value = ath.belt;
        document.getElementById('athlete-weight').value = ath.weight;
        document.getElementById('athlete-height').value = ath.height || '';
        document.getElementById('athlete-experience').value = ath.experience;
        
        // Populate schools dropdown and select the athlete's school
        this.populateAthleteSchoolsDropdown();
        document.getElementById('athlete-school').value = ath.school || '';
        
        // Set Assistant Instructor checkbox state based on eligibility (belt >= Green)
        const isAyudante = ath.isAyudante || false;
        document.getElementById('athlete-is-ayudante').checked = isAyudante;
        
        const BELT_ORDER = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
        const isEligible = BELT_ORDER.indexOf(ath.belt) >= BELT_ORDER.indexOf("Verde");
        const ayudanteGrp = document.getElementById('ayudante-group');
        if (ayudanteGrp) ayudanteGrp.style.display = isEligible ? 'flex' : 'none';
        
        const hasTradicional = ath.modalities ? ath.modalities.tradicional : false;
        const hasDeportivo = ath.modalities ? ath.modalities.deportivo : false;
        document.getElementById('mod-tradicional').checked = hasTradicional;
        document.getElementById('mod-deportivo').checked = hasDeportivo;

        document.getElementById('athlete-modal-title').textContent = 'Editar Atleta';
        document.getElementById('athlete-modal').classList.add('active');
    }


HapkidoApp.prototype.saveAthlete = function() {
        const id = document.getElementById('athlete-id').value;
        const name = document.getElementById('athlete-name').value.trim();
        const birthdate = document.getElementById('athlete-birthdate').value;
        const gender = document.getElementById('athlete-gender').value;
        const belt = document.getElementById('athlete-belt').value;
        const weightVal = document.getElementById('athlete-weight').value;
        const weight = weightVal ? parseFloat(weightVal) : null;
        const heightVal = document.getElementById('athlete-height').value;
        const height = heightVal ? parseFloat(heightVal) : null;
        const experience = document.getElementById('athlete-experience').value;
        const school = document.getElementById('athlete-school').value;
        const isAyudante = document.getElementById('athlete-is-ayudante').checked;
        
        const modTradicional = document.getElementById('mod-tradicional').checked;
        const modDeportivo = document.getElementById('mod-deportivo').checked;

        if (!modTradicional && !modDeportivo) {
            alert("Debe seleccionar al menos una modalidad (Tradicional o Deportivo).");
            return;
        }

        if (id) {
            // Edit mode
            const index = this.data.athletes.findIndex(a => a.id === id);
            if (index !== -1) {
                this.data.athletes[index] = {
                    id, name, birthdate, gender, belt, weight, height, experience, school, isAyudante,
                    modalities: { tradicional: modTradicional, deportivo: modDeportivo }
                };
                // Sync user.rank when belt changes
                const linkedUser = this.data.users.find(u => u.athleteId === id);
                if (linkedUser) {
                    linkedUser.rank = belt;
                    linkedUser.role = isAyudante ? 'ayudante' : 'athlete';
                    linkedUser.school = school;
                }
            }
        } else {
            // New mode
            const newAthlete = {
                id: 'ath_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name, birthdate, gender, belt, weight, height, experience, school, isAyudante,
                modalities: { tradicional: modTradicional, deportivo: modDeportivo }
            };
            this.data.athletes.push(newAthlete);
            
            // Auto-generate username: lowercase, remove accents, spaces, and special characters
            let baseUsername = name.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^a-z0-9]/g, ""); // Keep alphanumeric only
            
            // Handle duplicate usernames
            let finalUsername = baseUsername;
            let counter = 1;
            while (this.data.users.some(u => u.username === finalUsername)) {
                finalUsername = baseUsername + counter;
                counter++;
            }
            
            const userPassword = "123456";

            const newUser = {
                id: 'usr_' + Date.now(),
                username: finalUsername,
                name: name,
                password: userPassword,
                role: isAyudante ? 'ayudante' : 'athlete',
                school: school,
                athleteId: newAthlete.id,
                rank: belt
            };
            
            this.data.users.push(newUser);

            // Notify user of auto-generated account
            setTimeout(() => {
                alert(`¡Atleta registrado exitosamente!\n\nSe ha creado automáticamente una cuenta de usuario para que el atleta pueda ver su progreso y planes de entrenamiento:\n\n• Usuario: ${finalUsername}\n• Contraseña temporal: ${userPassword}\n\nPor favor comparta estas credenciales con el practicante.`);
            }, 150);
        }

        // Non-blocking weight alert
        if (!weight) {
            setTimeout(() => {
                alert("⚠️ Aviso: Este atleta no tiene peso registrado.\n\nRecuerde tomarlo en la próxima sesión. El peso es necesario para asignar divisiones de combate y evaluar el índice de masa corporal.");
            }, id ? 50 : 500);
        }

        this.saveData();
        document.getElementById('athlete-modal').classList.remove('active');
        this.renderAthletesList();
        this.populateAthleteDropdowns();
    }


HapkidoApp.prototype.deleteAthlete = function(id) {
        const ath = this.data.athletes.find(a => a.id === id);
        if (!ath) return;

        if (confirm(`¿Está seguro de que desea desactivar a "${ath.name}"?\n\nEl atleta quedará inactivo y podrá ser reactivado más adelante. Su historial de mediciones físicas se conservará para uso futuro.\n\nSu cuenta de acceso y sus inscripciones en torneos serán eliminadas.`)) {
            // Soft delete: mark as inactive
            const index = this.data.athletes.findIndex(a => a.id === id);
            if (index !== -1) {
                this.data.athletes[index].status = 'inactivo';
                this.data.athletes[index].deactivatedAt = new Date().toISOString().split('T')[0];
            }
            // Cascade: remove linked user account
            this.data.users = this.data.users.filter(u => u.athleteId !== id);
            // Cascade: remove from tournament registrations
            (this.data.torneos || []).forEach(t => {
                if (t.registrations) {
                    t.registrations = t.registrations.filter(r => r.athleteId !== id);
                }
            });
            // NOTE: physical records (this.data.records) are intentionally kept for historical purposes

            this.saveData();
            this.renderAthletesList();
            this.populateAthleteDropdowns();
        }
    }


HapkidoApp.prototype.reactivateAthlete = function(id) {
        const ath = this.data.athletes.find(a => a.id === id);
        if (!ath) return;

        if (confirm(`¿Desea reactivar a "${ath.name}"?\n\nSe restaurará su perfil y todo el historial de mediciones físicas. Se creará una nueva cuenta de acceso.`)) {
            ath.status = 'activo';
            delete ath.deactivatedAt;

            // Re-create user account
            let baseUsername = ath.name.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "");
            let finalUsername = baseUsername;
            let counter = 1;
            while (this.data.users.some(u => u.username === finalUsername)) {
                finalUsername = baseUsername + counter;
                counter++;
            }
            const newUser = {
                id: 'usr_' + Date.now(),
                username: finalUsername,
                name: ath.name,
                password: "123456",
                role: ath.isAyudante ? 'ayudante' : 'athlete',
                school: ath.school,
                athleteId: ath.id,
                rank: ath.belt
            };
            this.data.users.push(newUser);

            this.saveData();
            this.renderAthletesList();
            this.populateAthleteDropdowns();

            setTimeout(() => {
                alert(`✅ Atleta "${ath.name}" reactivado exitosamente.\n\nNueva cuenta de acceso:\n• Usuario: ${finalUsername}\n• Contraseña temporal: 123456`);
            }, 150);
        }
    }


HapkidoApp.prototype.renderInactiveAthletesList = function() {
        const section = document.getElementById('inactive-athletes-section');
        if (!section) return;

        let inactives = this.data.athletes.filter(a => a.status === 'inactivo');
        if (this.currentUser && this.currentUser.role !== 'admin') {
            inactives = inactives.filter(a => a.school === this.currentUser.school);
        }

        if (inactives.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        const tbody = section.querySelector('tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        inactives.forEach(ath => {
            const physCount = (this.data.records || []).filter(r => r.athleteId === ath.id && r.type === 'FISICA').length;
            const tr = document.createElement('tr');
            tr.style.opacity = '0.7';
            tr.innerHTML = `
                <td><strong>${ath.name}</strong></td>
                <td>${ath.belt}</td>
                <td>${ath.school || '—'}</td>
                <td>${ath.deactivatedAt || '—'}</td>
                <td><span class="badge">${physCount} evaluaciones</span></td>
                <td class="actions-cell">
                    <button class="icon-btn edit" title="Reactivar atleta" onclick="app.reactivateAthlete('${ath.id}')">
                        <i class="fa-solid fa-user-check"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


HapkidoApp.prototype.renderAthleteDashboard = function() {
        if (!this.currentUser || this.currentUser.role !== 'athlete') {
            const athView = document.getElementById('athlete-dashboard-view');
            if (athView) athView.style.display = 'none';
            return;
        }

        const athView = document.getElementById('athlete-dashboard-view');
        if (athView) athView.style.display = 'block';

        const athlete = this.data.athletes.find(a => a.id === this.currentUser.athleteId);
        if (!athlete) return;

        document.getElementById('ath-dash-name').textContent = athlete.name;
        
        const beltBadge = document.getElementById('ath-dash-belt');
        if (beltBadge) {
            beltBadge.className = `badge belt-${athlete.belt.toLowerCase().replace(/ /g, '-')}`;
            beltBadge.textContent = `Cinturón ${athlete.belt}`;
        }
        
        document.getElementById('ath-dash-school').textContent = athlete.school || 'Sin Escuela';

        const age = this.calculateAge(athlete.birthdate);
        const ageCat = this.calculateAgeCategory(athlete.birthdate);
        document.getElementById('ath-dash-age').textContent = `${age} años (${ageCat})`;
        document.getElementById('ath-dash-gender').textContent = athlete.gender;
        document.getElementById('ath-dash-weight').textContent = athlete.weight ? `${athlete.weight} kg` : 'Sin registrar';
        document.getElementById('ath-dash-exp').textContent = athlete.experience || 'No especificada';

        // Show active tournament inscriptions instead of stale profile categories
        let catText = "";
        if (athlete.modalities && athlete.modalities.deportivo) {
            const activeInscriptions = [];
            (this.data.torneos || []).forEach(t => {
                if (t.registrations) {
                    const reg = t.registrations.find(r => r.athleteId === athlete.id);
                    if (reg) {
                        const catList = [];
                        if (reg.categories.combate) catList.push("Combate");
                        if (reg.categories.saltoLargo) catList.push("Salto Largo");
                        if (reg.categories.saltoAlto) catList.push("Salto Alto");
                        if (reg.categories.figurasSin) catList.push("Figuras sin Armas");
                        if (reg.categories.figurasCon) catList.push("Figuras con Armas");
                        if (reg.categories.demos) catList.push("Demostración");
                        activeInscriptions.push(`${t.name}: ${catList.join(", ")}`);
                    }
                }
            });
            catText = activeInscriptions.length > 0
                ? activeInscriptions.join(" | ")
                : "Deportivo (sin torneos inscritos actualmente)";
        } else {
            catText = "Tradicional / Defensa Personal";
        }
        document.getElementById('ath-dash-category').textContent = catText;

        const physRecords = this.data.records
            .filter(r => r.athleteId === athlete.id && r.type === 'FISICA')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const physSummary = document.getElementById('ath-dash-phys-summary');
        const planCard = document.getElementById('ath-dash-plan-card');
        const planContent = document.getElementById('ath-dash-plan-content');

        if (physRecords.length > 0) {
            const latest = physRecords[0];
            const details = latest.physicalDetails;

            physSummary.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div>
                        <p style="margin-bottom: 6px; color: var(--primary); font-weight: 600;"><i class="fa-solid fa-heart-pulse"></i> Cardiovascular</p>
                        <p><strong>Fecha:</strong> ${latest.date}</p>
                        <p><strong>Índice Ruffier:</strong> <span class="badge ${details.ruffierIndex > 10 ? 'danger' : (details.ruffierIndex > 5 ? 'warning' : 'success')}">${details.ruffierIndex.toFixed(1)} (${details.ruffierLevel})</span></p>
                        ${details.rhr ? `<p><strong>FC Reposo:</strong> ${details.rhr} lpm (${details.evalResults?.rhr?.level || 'N/A'})</p>` : ''}
                        ${details.evalResults?.globalScore ? `<p style="margin-top: 8px;"><strong>Rendimiento General:</strong> <span class="badge ${details.evalResults.globalCls}">${details.evalResults.globalScore.toFixed(1)}/10 (${details.evalResults.globalLevel})</span></p>` : ''}
                    </div>
                    <div>
                        <p style="margin-bottom: 6px; color: var(--primary); font-weight: 600;"><i class="fa-solid fa-dumbbell"></i> Fuerza & Core</p>
                        <p><strong>Flexiones:</strong> ${details.pushups ?? '--'} reps (${details.evalResults?.pushups?.level || 'N/A'})</p>
                        <p><strong>Abdominales:</strong> ${details.situps ?? '--'} reps (${details.evalResults?.situps?.level || 'N/A'})</p>
                        ${details.plank ? `<p><strong>Plancha Prona:</strong> ${details.plank} seg (${details.evalResults?.plank?.level || 'N/A'})</p>` : ''}
                        ${details.grip ? `<p><strong>Agarre:</strong> ${details.grip} seg (${details.evalResults?.grip?.level || 'N/A'})</p>` : ''}
                    </div>
                    <div>
                        <p style="margin-bottom: 6px; color: var(--primary); font-weight: 600;"><i class="fa-solid fa-bolt"></i> Combate & Potencia</p>
                        ${details.kickSpeed ? `<p><strong>Pateo FSKT:</strong> ${details.kickSpeed} reps/10s (${details.evalResults?.kickSpeed?.level || 'N/A'})</p>` : ''}
                        ${details.anaerobic ? `<p><strong>Ráfaga 30s:</strong> ${details.anaerobic} reps (${details.evalResults?.anaerobic?.level || 'N/A'})</p>` : ''}
                        ${details.reaction ? `<p><strong>Reacción:</strong> ${details.reaction} seg (${details.evalResults?.reaction?.level || 'N/A'})</p>` : ''}
                        ${details.balance ? `<p><strong>Equilibrio:</strong> ${details.balance} seg (${details.evalResults?.balance?.level || 'N/A'})</p>` : ''}
                        ${details.kickFlex ? `<p><strong>Flex. Patada:</strong> ${details.kickFlex}% (${details.evalResults?.kickFlex?.level || 'N/A'})</p>` : ''}
                        ${details.jumpHorizontal ? `<p><strong>Salto Horizontal:</strong> ${details.jumpHorizontal} cm (${details.evalResults?.jumpHorizontal?.level || 'N/A'})</p>` : ''}
                        ${details.shuttle ? `<p><strong>Shuttle 4x10m:</strong> ${details.shuttle} seg (${details.evalResults?.shuttle?.level || 'N/A'})</p>` : ''}
                    </div>
                </div>
            `;

            planCard.style.display = 'block';
            planContent.innerHTML = this.generateTrainingPlanHTML(athlete, latest);
        } else {
            physSummary.innerHTML = `
                <div class="empty-list">
                    <i class="fa-solid fa-circle-info" style="font-size: 24px; margin-bottom: 8px; color: var(--accent);"></i>
                    <p>No tienes evaluaciones físicas registradas en el sistema todavía.</p>
                    <p style="font-size: 12px; color: var(--text-muted);">Tu instructor o maestro debe realizarte una evaluación física completa para activar tu plan de entrenamiento personalizado adaptado.</p>
                </div>
            `;
            planCard.style.display = 'none';
            planContent.innerHTML = '';
        }
    }


HapkidoApp.prototype.loadAthleteAnalysis = function(athleteId) {
    const chartContainer = document.getElementById('progress-charts-container');
    if (!athleteId) {
        chartContainer.classList.add('hidden');
        return;
    }

    const athlete = this.data.athletes.find(a => a.id === athleteId);
    if (!athlete) return;

    // Filter physical records for this athlete, sorted by date
    const athleteRecords = this.data.records
        .filter(r => r.athleteId === athleteId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Show charts container
    chartContainer.classList.remove('hidden');

    // Toggle cards depending on modalities
    document.getElementById('card-chart-jumps').style.display = athlete.modalities.deportivo ? 'block' : 'none';
    document.getElementById('card-chart-scores').style.display = athlete.modalities.deportivo ? 'block' : 'none';
    document.getElementById('card-chart-technical').style.display = athlete.modalities.tradicional ? 'block' : 'none';

    // Render tabular history
    this.renderAthleteHistoryTable(athleteId);

    // Extract dates and values for charts
    const physRecords = athleteRecords.filter(r => r.type === 'FISICA');
    const dates = physRecords.map(r => r.date);

    if (physRecords.length > 0) {
        const latestPhysRecord = physRecords[physRecords.length - 1];
        if (latestPhysRecord.physicalDetails.evalResults) {
            this.renderPhysicalProfileChart('chart-physical-profile', latestPhysRecord.physicalDetails.evalResults);
        }
    } else {
        // Clear/destroy radar chart if there are no physical records
        if (this.charts['chart-physical-profile']) {
            this.charts['chart-physical-profile'].destroy();
            delete this.charts['chart-physical-profile'];
        }
    }

    // Chart 1: Ruffier Index
    const ruffierData = physRecords.map(r => r.physicalDetails.ruffierIndex);
    this.renderLineChart('chart-ruffier', dates, [{
        label: 'Índice de Ruffier-Dickson (menor es mejor)',
        data: ruffierData,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 2,
        tension: 0.3
    }]);

    // Chart 2: Fuerza y Resistencia
    const pushupsData = physRecords.map(r => r.physicalDetails.pushups);
    const situpsData = physRecords.map(r => r.physicalDetails.situps);
    const gripData = physRecords.map(r => r.physicalDetails.grip);
    const plankData = physRecords.map(r => r.physicalDetails.plank);
    this.renderLineChart('chart-strength', dates, [
        {
            label: 'Lagartijas (reps)',
            data: pushupsData,
            borderColor: '#fb923c',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Abdominales (reps)',
            data: situpsData,
            borderColor: '#facc15',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Suspensión Barra (seg)',
            data: gripData,
            borderColor: '#22d3ee',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Plancha Prona (seg)',
            data: plankData,
            borderColor: '#a78bfa',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        }
    ]);

    // Chart 3: Flexibilidad, Equilibrio y Agilidad
    const flexibilityData = physRecords.map(r => r.physicalDetails.flexibility);
    const splitData = physRecords.map(r => r.physicalDetails.split);
    const kickFlexData = physRecords.map(r => r.physicalDetails.kickFlex);
    const balanceData = physRecords.map(r => r.physicalDetails.balance);
    const agilityData = physRecords.map(r => r.physicalDetails.agility);
    const shuttleData = physRecords.map(r => r.physicalDetails.shuttle);
    this.renderLineChart('chart-flex-agility', dates, [
        {
            label: 'Sit & Reach (cm)',
            data: flexibilityData,
            borderColor: '#e879f9',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Apertura Split (cm)',
            data: splitData,
            borderColor: '#f43f5e',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Flex. Patada (%)',
            data: kickFlexData,
            borderColor: '#fb923c',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Equilibrio (seg)',
            data: balanceData,
            borderColor: '#facc15',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Velocidad 10m (seg)',
            data: agilityData,
            borderColor: '#34d399',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Shuttle 4×10m (seg)',
            data: shuttleData,
            borderColor: '#22d3ee',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        }
    ]);

    // Chart 4: Resistencia Aeróbica, Potencia y Combate
    const cooperData = physRecords.map(r => r.physicalDetails.cooper);
    const jumpVerticalData = physRecords.map(r => r.physicalDetails.jumpVertical);
    const jumpHorizontalData = physRecords.map(r => r.physicalDetails.jumpHorizontal);
    const kickSpeedData = physRecords.map(r => r.physicalDetails.kickSpeed);
    const anaerobicData = physRecords.map(r => r.physicalDetails.anaerobic);
    const reactionData = physRecords.map(r => r.physicalDetails.reaction);
    const rhrData = physRecords.map(r => r.physicalDetails.rhr);
    this.renderLineChart('chart-aerobic-jump', dates, [
        {
            label: 'Test Cooper (m)',
            data: cooperData,
            borderColor: '#60a5fa',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Salto Vertical (cm)',
            data: jumpVerticalData,
            borderColor: '#a78bfa',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Salto Horizontal (cm)',
            data: jumpHorizontalData,
            borderColor: '#34d399',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Pateo FSKT (reps/10s)',
            data: kickSpeedData,
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Ráfaga 30s (reps)',
            data: anaerobicData,
            borderColor: '#ec4899',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'Reacción (seg)',
            data: reactionData,
            borderColor: '#14b8a6',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        },
        {
            label: 'FC Reposo (lpm)',
            data: rhrData,
            borderColor: '#f43f5e',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
        }
    ]);

    // Jumps Chart (Deportivo)
    if (athlete.modalities.deportivo) {
        const longJumps = physRecords.map(r => r.physicalDetails.jumpLong);
        const highJumps = physRecords.map(r => r.physicalDetails.jumpHigh);
        
        this.renderLineChart('chart-jumps', dates, [
            {
                label: 'Salto Largo (m)',
                data: longJumps,
                borderColor: '#f59e0b',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Salto Alto (m)',
                data: highJumps,
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            }
        ]);

        // Scores Chart (Deportivo Figures/Demo)
        const figuresSin = physRecords.map(r => r.physicalDetails.scoreFiguresSin);
        const figuresCon = physRecords.map(r => r.physicalDetails.scoreFiguresCon);
        const demos = physRecords.map(r => r.physicalDetails.scoreDemo);
        
        this.renderLineChart('chart-scores', dates, [
            {
                label: 'Figuras Sin Armas (1-10)',
                data: figuresSin,
                borderColor: '#fb7185',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Figuras Con Armas (1-10)',
                data: figuresCon,
                borderColor: '#a78bfa',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Demostración DP (1-10)',
                data: demos,
                borderColor: '#f43f5e',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            }
        ]);
    }

    // Technical Traditional (Exámenes)
    if (athlete.modalities.tradicional) {
        const locks = physRecords.map(r => r.physicalDetails.tradJointLocks);
        const throws = physRecords.map(r => r.physicalDetails.tradThrows);
        const strikes = physRecords.map(r => r.physicalDetails.tradStrikes);
        const composure = physRecords.map(r => r.physicalDetails.tradComposure);

        this.renderLineChart('chart-technical', dates, [
            {
                label: 'Llaves/Luxaciones',
                data: locks,
                borderColor: '#fb923c',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.2
            },
            {
                label: 'Proyecciones/Barridos',
                data: throws,
                borderColor: '#a3e635',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.2
            },
            {
                label: 'Golpes/Defensas',
                data: strikes,
                borderColor: '#22d3ee',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.2
            },
            {
                label: 'Control de Estrés',
                data: composure,
                borderColor: '#e879f9',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.2
            }
        ]);
    }

    // Combat Progress Chart
    const combatRecords = athleteRecords.filter(r => r.type === 'COMBATE');
    if (combatRecords.length > 0) {
        document.getElementById('card-chart-combat').style.display = 'block';
        const combatDates = combatRecords.map(r => r.date);
        const combatPoints = combatRecords.map(r => r.combatDetails.totalBlue);
        const opponentPoints = combatRecords.map(r => r.combatDetails.totalRed);

        this.renderLineChart('chart-combat', combatDates, [
            {
                label: 'Puntos Atleta (Azul)',
                data: combatPoints,
                borderColor: '#38bdf8',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Puntos Oponente (Rojo)',
                data: opponentPoints,
                borderColor: '#ef4444',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3
            }
        ]);
    } else {
        document.getElementById('card-chart-combat').style.display = 'none';
    }
}


HapkidoApp.prototype.renderLineChart = function(canvasId, labels, datasets) {
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
    
    this.charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b' },
                    grid: { color: 'rgba(255,255,255,0.03)' }
                },
                y: {
                    ticks: { color: '#64748b' },
                    grid: { color: 'rgba(255,255,255,0.03)' }
                }
            }
        }
    });
}


HapkidoApp.prototype.renderAthleteHistoryTable = function(athleteId) {
        const tbody = document.querySelector('#athlete-history-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        // Filter records for this athlete (reversed chronologically)
        const sortedRecords = this.data.records
            .filter(r => r.athleteId === athleteId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedRecords.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted);">
                        No hay registros históricos para este atleta.
                    </td>
                </tr>
            `;
            return;
        }

        sortedRecords.forEach(rec => {
            const tr = document.createElement('tr');
            
            let typeCell = '';
            let valCell = '';
            let detailCell = '';

            if (rec.type === 'COMBATE') {
                typeCell = '<span class="badge success">Combate Deportivo</span>';
                let opponentStr = rec.combatDetails.opponentName ? ` vs ${rec.combatDetails.opponentName}` : '';
                valCell = `<strong>${rec.combatDetails.totalBlue} Pts</strong> vs ${rec.combatDetails.totalRed} Pts${opponentStr}`;
                
                let winLabel = rec.combatDetails.winner === 'blue' ? 'Victoria' : 'Derrota';
                let reason = '';
                switch(rec.combatDetails.winReason) {
                    case 'POINTS': reason = 'por Puntos'; break;
                    case 'SUP_TECH': reason = 'por Superioridad Técnica'; break;
                    case 'DISQ': reason = 'por Faltas/Descalificación'; break;
                    case 'DECISION': reason = 'por Decisión Arbitral'; break;
                }
                
                detailCell = `${winLabel} ${reason} (${rec.combatDetails.stage})`;
            } else {
                typeCell = '<span class="badge warning">Ficha Fisiológica</span>';
                valCell = `Ruffier: <strong>${rec.physicalDetails.ruffierIndex.toFixed(1)}</strong>`;
                
                const level = rec.physicalDetails.ruffierLevel;
                let details = `P1: ${rec.physicalDetails.pulseP1}, P2: ${rec.physicalDetails.pulseP2}, P3: ${rec.physicalDetails.pulseP3} (${level})`;
                
                if (rec.physicalDetails.jumpLong) {
                    details += ` | Saltos: L:${rec.physicalDetails.jumpLong}m, A:${rec.physicalDetails.jumpHigh}m`;
                }
                
                detailCell = details;
            }

            let actionBtn = '';
            if (rec.type === 'FISICA') {
                actionBtn = `<button type="button" class="btn btn-sm btn-secondary" onclick="app.showPhysicalReportPrintModal('${rec.id}')" title="Imprimir / Exportar Ficha Oficial en PDF" style="margin-right: 6px; padding: 4px 8px; font-size: 11px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;"><i class="fa-solid fa-file-pdf" style="color: var(--primary);"></i> Ficha</button>`;
            }

            tr.innerHTML = `
                <td>${rec.date}</td>
                <td>${typeCell}</td>
                <td>${valCell}</td>
                <td><small>${detailCell}</small></td>
                <td>
                    ${actionBtn}
                    <button class="icon-btn delete" onclick="app.deleteRecord('${rec.id}', '${athleteId}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }



