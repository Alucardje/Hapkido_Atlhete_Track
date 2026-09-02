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

        this.populateH2HDropdowns();
    };


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

    /**
     * Sub-navegación dentro de Historial (Evolución vs H2H)
     */
    HapkidoApp.prototype.switchHistorySubTab = function(subTab) {
        const btnProgreso = document.getElementById('subtab-btn-hist-progreso');
        const btnH2H = document.getElementById('subtab-btn-hist-h2h');
        const contProgreso = document.getElementById('subtab-hist-progreso-container');
        const contH2H = document.getElementById('subtab-hist-h2h-container');

        if (!btnProgreso || !btnH2H || !contProgreso || !contH2H) return;

        if (subTab === 'h2h') {
            btnProgreso.classList.remove('active');
            btnH2H.classList.add('active');
            contProgreso.classList.add('hidden');
            contH2H.classList.remove('hidden');
            this.populateH2HDropdowns();
        } else {
            btnProgreso.classList.add('active');
            btnH2H.classList.remove('active');
            contProgreso.classList.remove('hidden');
            contH2H.classList.add('hidden');
        }
    };

    /**
     * Filtrar Historial por Período Temporal (3m, 6m, 1y, all)
     */
    HapkidoApp.prototype.filterHistoryTimeframe = function(period, btnEl) {
        document.querySelectorAll('.btn-timeframe').forEach(b => b.classList.remove('active'));
        if (btnEl) btnEl.classList.add('active');

        const select = document.getElementById('analysis-athlete-select');
        if (select && select.value) {
            this.loadAthleteAnalysis(select.value, period);
        }
    };

    /**
     * Población de Atletas en Comparador Cara a Cara
     */
    HapkidoApp.prototype.populateH2HDropdowns = function() {
        const selectBlue = document.getElementById('h2h-select-blue');
        const selectRed = document.getElementById('h2h-select-red');
        if (!selectBlue || !selectRed) return;

        let athletes = this.data.athletes || [];
        if (this.currentUser && this.currentUser.role !== 'admin') {
            athletes = athletes.filter(a => a.school === this.currentUser.school);
        }

        const optionsHTML = '<option value="">-- Seleccione Atleta --</option>' +
            athletes.map(a => `<option value="${a.id}">${a.name} (${a.belt} - ${a.school || 'Dojang'})</option>`).join('');

        const currentBlue = selectBlue.value;
        const currentRed = selectRed.value;

        selectBlue.innerHTML = optionsHTML;
        selectRed.innerHTML = optionsHTML;

        if (currentBlue) selectBlue.value = currentBlue;
        if (currentRed) selectRed.value = currentRed;
    };

    HapkidoApp.prototype.loadAthleteAnalysis = function(athleteId, timeframe = 'all') {
        const chartContainer = document.getElementById('progress-charts-container');
        if (!athleteId) {
            chartContainer.classList.add('hidden');
            const tfFilters = document.getElementById('hist-timeframe-filters');
            if (tfFilters) tfFilters.style.display = 'none';
            return;
        }

        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        // Filter physical records for this athlete, sorted by date
        let athleteRecords = this.data.records
            .filter(r => r.athleteId === athleteId)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Timeframe filtering
        const now = new Date();
        if (timeframe === '3m') {
            const cut = new Date(); cut.setMonth(now.getMonth() - 3);
            athleteRecords = athleteRecords.filter(r => new Date(r.date) >= cut);
        } else if (timeframe === '6m') {
            const cut = new Date(); cut.setMonth(now.getMonth() - 6);
            athleteRecords = athleteRecords.filter(r => new Date(r.date) >= cut);
        } else if (timeframe === '1y') {
            const cut = new Date(); cut.setFullYear(now.getFullYear() - 1);
            athleteRecords = athleteRecords.filter(r => new Date(r.date) >= cut);
        }

        // Show timeframe filter buttons
        const tfFilters = document.getElementById('hist-timeframe-filters');
        if (tfFilters) tfFilters.style.display = 'flex';

        // Render Evolution Highlights Banner (Deltas)
        const allPhys = this.data.records
            .filter(r => r.athleteId === athleteId && r.type === 'FISICA')
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const bannerEl = document.getElementById('athlete-evolution-banner');
        if (bannerEl && allPhys.length >= 1) {
            const first = allPhys[0].physicalDetails;
            const last = allPhys[allPhys.length - 1].physicalDetails;

            // Ruffier delta
            const ruffierDiff = (last.ruffierIndex - first.ruffierIndex);
            const ruffierGood = ruffierDiff <= 0;
            const ruffierTxt = ruffierDiff === 0 ? "Sin cambio" : (ruffierGood ? `${Math.abs(ruffierDiff).toFixed(1)} pts mejor` : `+${ruffierDiff.toFixed(1)} pts`);

            // Fat delta
            let fatTxt = "--";
            let fatGood = true;
            if (first.fat && last.fat) {
                const fatDiff = last.fat - first.fat;
                fatGood = fatDiff <= 0;
                fatTxt = fatDiff === 0 ? "0.0%" : (fatGood ? `-${Math.abs(fatDiff).toFixed(1)}%` : `+${fatDiff.toFixed(1)}%`);
            }

            // Kick Speed / FSKT delta
            let kickTxt = "--";
            let kickGood = true;
            if (first.kickSpeed !== undefined && last.kickSpeed !== undefined) {
                const kickDiff = last.kickSpeed - first.kickSpeed;
                kickGood = kickDiff >= 0;
                kickTxt = kickDiff === 0 ? "0 reps" : (kickGood ? `+${kickDiff} reps` : `${kickDiff} reps`);
            }

            // Global Score
            const firstScore = allPhys[0].physicalDetails?.evalResults?.globalScore || 5.0;
            const lastScore = allPhys[allPhys.length - 1].physicalDetails?.evalResults?.globalScore || 5.0;
            const scoreDiff = lastScore - firstScore;
            const scoreGood = scoreDiff >= 0;

            bannerEl.innerHTML = `
                <div class="evolution-delta-card ${scoreGood ? 'positive' : 'neutral'}">
                    <div class="delta-label">Rendimiento General</div>
                    <div class="delta-val">${lastScore.toFixed(1)}/10</div>
                    <div class="delta-trend">${scoreDiff >= 0 ? '▲ +' + scoreDiff.toFixed(1) : '▼ ' + scoreDiff.toFixed(1)} pts vs inicio</div>
                </div>
                <div class="evolution-delta-card ${ruffierGood ? 'positive' : 'negative'}">
                    <div class="delta-label">Índice Ruffier</div>
                    <div class="delta-val">${last.ruffierIndex.toFixed(1)}</div>
                    <div class="delta-trend">${ruffierGood ? '▲ ' : '▼ '}${ruffierTxt}</div>
                </div>
                <div class="evolution-delta-card ${fatGood ? 'positive' : 'negative'}">
                    <div class="delta-label">% Grasa Corporal</div>
                    <div class="delta-val">${last.fat ? last.fat.toFixed(1) + '%' : '--'}</div>
                    <div class="delta-trend">${fatTxt !== '--' ? (fatGood ? '▲ ' : '▼ ') + fatTxt + ' vs inicio' : 'Monitoreo regular'}</div>
                </div>
                <div class="evolution-delta-card ${kickGood ? 'positive' : 'negative'}">
                    <div class="delta-label">Cadencia Pateo FSKT</div>
                    <div class="delta-val">${last.kickSpeed !== undefined ? last.kickSpeed + ' reps' : '--'}</div>
                    <div class="delta-trend">${kickTxt !== '--' ? (kickGood ? '▲ ' : '▼ ') + kickTxt + ' en 10s' : 'Prueba de combate'}</div>
                </div>
            `;
        }

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
    };

    /**
     * Comparador Frente a Frente (Head-to-Head Matchup)
     */
    HapkidoApp.prototype.renderH2HComparison = function() {
        const selectBlue = document.getElementById('h2h-select-blue');
        const selectRed = document.getElementById('h2h-select-red');
        const resultsContainer = document.getElementById('h2h-results-container');
        if (!selectBlue || !selectRed || !resultsContainer) return;

        const blueId = selectBlue.value;
        const redId = selectRed.value;

        if (!blueId || !redId) {
            resultsContainer.classList.add('hidden');
            return;
        }

        if (blueId === redId) {
            this.showAlert('Por favor seleccione dos atletas diferentes para la comparativa cara a cara.', 'warning', 'Atletas Duplicados');
            resultsContainer.classList.add('hidden');
            return;
        }

        const athleteBlue = this.data.athletes.find(a => a.id === blueId);
        const athleteRed = this.data.athletes.find(a => a.id === redId);
        if (!athleteBlue || !athleteRed) return;

        resultsContainer.classList.remove('hidden');

        // Get latest physical tests for both athletes
        const bluePhys = this.data.records.filter(r => r.athleteId === blueId && r.type === 'FISICA').sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.physicalDetails || {};
        const redPhys = this.data.records.filter(r => r.athleteId === redId && r.type === 'FISICA').sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.physicalDetails || {};

        const blueEval = bluePhys.evalResults || {};
        const redEval = redPhys.evalResults || {};

        const blueAge = this.calculateAge(athleteBlue.birthdate);
        const redAge = this.calculateAge(athleteRed.birthdate);

        const blueReach = bluePhys.wingspan || athleteBlue.height || 170;
        const redReach = redPhys.wingspan || athleteRed.height || 170;
        const reachDiff = (blueReach - redReach).toFixed(1);

        // Render Biometrics & Reach
        document.getElementById('h2h-biometrics-content').innerHTML = `
            <div class="h2h-biometrics-grid">
                <div class="h2h-athlete-col blue">
                    <div class="h2h-ath-name">${athleteBlue.name}</div>
                    <span class="badge belt-${athleteBlue.belt.toLowerCase().replace(/ /g, '-')}">Cinturón ${athleteBlue.belt}</span>
                    <p class="h2h-ath-school">${athleteBlue.school || 'Dojang Central'}</p>
                    <div class="h2h-bio-stat"><span>Edad:</span> <strong>${blueAge} años</strong></div>
                    <div class="h2h-bio-stat"><span>Peso:</span> <strong>${athleteBlue.weight ? athleteBlue.weight + ' kg' : '--'}</strong></div>
                    <div class="h2h-bio-stat"><span>Estatura:</span> <strong>${bluePhys.height || '--'} cm</strong></div>
                    <div class="h2h-bio-stat"><span>Envergadura (Alcance):</span> <strong>${bluePhys.wingspan || '--'} cm</strong></div>
                    <div class="h2h-bio-stat"><span>Ape Index:</span> <strong>${blueEval.apeIndex ? blueEval.apeIndex.toFixed(3) : '--'}</strong></div>
                </div>

                <div class="h2h-advantage-center">
                    <div class="h2h-diff-badge ${reachDiff > 0 ? 'blue-lead' : (reachDiff < 0 ? 'red-lead' : 'equal')}">
                        <i class="fa-solid fa-arrows-left-right"></i>
                        <span>${reachDiff > 0 ? `Azul +${reachDiff} cm Alcance` : (reachDiff < 0 ? `Rojo +${Math.abs(reachDiff)} cm Alcance` : 'Alcance Igualado')}</span>
                    </div>
                    <div class="h2h-global-vs">
                        <span class="blue-score">${blueEval.globalScore ? blueEval.globalScore.toFixed(1) : '5.0'}</span>
                        <span class="score-vs">Score</span>
                        <span class="red-score">${redEval.globalScore ? redEval.globalScore.toFixed(1) : '5.0'}</span>
                    </div>
                </div>

                <div class="h2h-athlete-col red">
                    <div class="h2h-ath-name">${athleteRed.name}</div>
                    <span class="badge belt-${athleteRed.belt.toLowerCase().replace(/ /g, '-')}">Cinturón ${athleteRed.belt}</span>
                    <p class="h2h-ath-school">${athleteRed.school || 'Dojang Central'}</p>
                    <div class="h2h-bio-stat"><span>Edad:</span> <strong>${redAge} años</strong></div>
                    <div class="h2h-bio-stat"><span>Peso:</span> <strong>${athleteRed.weight ? athleteRed.weight + ' kg' : '--'}</strong></div>
                    <div class="h2h-bio-stat"><span>Estatura:</span> <strong>${redPhys.height || '--'} cm</strong></div>
                    <div class="h2h-bio-stat"><span>Envergadura (Alcance):</span> <strong>${redPhys.wingspan || '--'} cm</strong></div>
                    <div class="h2h-bio-stat"><span>Ape Index:</span> <strong>${redEval.apeIndex ? redEval.apeIndex.toFixed(3) : '--'}</strong></div>
                </div>
            </div>
        `;

        // Render Dual Radar
        this.renderDualRadarChart('chart-h2h-radar', blueEval, redEval, athleteBlue.name, athleteRed.name);

        // Render Metric-by-Metric Table
        const metrics = [
            { name: "Resistencia Cardiovascular (Ruffier)", bVal: bluePhys.ruffierIndex?.toFixed(1) ?? '--', rVal: redPhys.ruffierIndex?.toFixed(1) ?? '--', bScore: blueEval.ruffier?.score ?? 5, rScore: redEval.ruffier?.score ?? 5, lowerBetter: true },
            { name: "Fuerza Superior (Flexiones)", bVal: bluePhys.pushups ? bluePhys.pushups + ' reps' : '--', rVal: redPhys.pushups ? redPhys.pushups + ' reps' : '--', bScore: blueEval.pushups?.score ?? 5, rScore: redEval.pushups?.score ?? 5 },
            { name: "Fuerza de Core (Plancha)", bVal: bluePhys.plank ? bluePhys.plank + ' seg' : '--', rVal: redPhys.plank ? redPhys.plank + ' seg' : '--', bScore: blueEval.plank?.score ?? 5, rScore: redEval.plank?.score ?? 5 },
            { name: "Flexibilidad (Split / Sit & Reach)", bVal: bluePhys.split ? bluePhys.split + ' cm' : (bluePhys.flexibility ? bluePhys.flexibility + ' cm' : '--'), rVal: redPhys.split ? redPhys.split + ' cm' : (redPhys.flexibility ? redPhys.flexibility + ' cm' : '--'), bScore: blueEval.split?.score ?? blueEval.flexibility?.score ?? 5, rScore: redEval.split?.score ?? redEval.flexibility?.score ?? 5 },
            { name: "Potencia de Piernas (Salto)", bVal: bluePhys.jumpHorizontal ? bluePhys.jumpHorizontal + ' cm' : (bluePhys.jumpVertical ? bluePhys.jumpVertical + ' cm' : '--'), rVal: redPhys.jumpHorizontal ? redPhys.jumpHorizontal + ' cm' : (redPhys.jumpVertical ? redPhys.jumpVertical + ' cm' : '--'), bScore: blueEval.jumpHorizontal?.score ?? blueEval.jumpVertical?.score ?? 5, rScore: redEval.jumpHorizontal?.score ?? redEval.jumpVertical?.score ?? 5 },
            { name: "Velocidad de Reacción", bVal: bluePhys.reaction ? bluePhys.reaction + ' seg' : '--', rVal: redPhys.reaction ? redPhys.reaction + ' seg' : '--', bScore: blueEval.reaction?.score ?? 5, rScore: redEval.reaction?.score ?? 5, lowerBetter: true },
            { name: "Velocidad de Pateo (FSKT)", bVal: bluePhys.kickSpeed ? bluePhys.kickSpeed + ' reps' : '--', rVal: redPhys.kickSpeed ? redPhys.kickSpeed + ' reps' : '--', bScore: blueEval.kickSpeed?.score ?? 5, rScore: redEval.kickSpeed?.score ?? 5 },
            { name: "Potencia Anaeróbica (30s)", bVal: bluePhys.anaerobic ? bluePhys.anaerobic + ' reps' : '--', rVal: redPhys.anaerobic ? redPhys.anaerobic + ' reps' : '--', bScore: blueEval.anaerobic?.score ?? 5, rScore: redEval.anaerobic?.score ?? 5 }
        ];

        document.getElementById('h2h-metrics-table-content').innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="color: #38bdf8; width: 28%;"><i class="fa-solid fa-shield"></i> ${athleteBlue.name} (Azul)</th>
                        <th style="text-align: center; width: 44%;">Capacidad Evaluada</th>
                        <th style="color: #ef4444; text-align: right; width: 28%;">${athleteRed.name} (Rojo) <i class="fa-solid fa-shield-halved"></i></th>
                    </tr>
                </thead>
                <tbody>
                    ${metrics.map(m => {
                        const blueWins = m.bScore > m.rScore;
                        const redWins = m.rScore > m.bScore;
                        return `
                            <tr>
                                <td style="color: ${blueWins ? '#38bdf8' : '#8b949e'}; font-weight: ${blueWins ? '700' : '400'};">
                                    ${blueWins ? '<i class="fa-solid fa-crown" style="color:#f59e0b; font-size:11px; margin-right:4px;"></i>' : ''}
                                    ${m.bVal} <small>(${m.bScore.toFixed(1)}/10)</small>
                                </td>
                                <td style="text-align: center; font-weight: 600; color: #f0f6fc;">${m.name}</td>
                                <td style="text-align: right; color: ${redWins ? '#ef4444' : '#8b949e'}; font-weight: ${redWins ? '700' : '400'};">
                                    <small>(${m.rScore.toFixed(1)}/10)</small> ${m.rVal}
                                    ${redWins ? '<i class="fa-solid fa-crown" style="color:#f59e0b; font-size:11px; margin-left:4px;"></i>' : ''}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        // Direct combat encounters
        const combatRecords = (this.data.records || []).filter(r => r.type === 'COMBATE' && (
            (r.athleteId === blueId && r.combatDetails?.opponentId === redId) ||
            (r.athleteId === redId && r.combatDetails?.opponentId === blueId)
        ));

        const fightsCard = document.getElementById('h2h-fights-card');
        const fightsContent = document.getElementById('h2h-fights-content');
        if (combatRecords.length > 0) {
            fightsCard.style.display = 'block';
            fightsContent.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Fase / Ronda</th>
                            <th>Puntos Azul (${athleteBlue.name})</th>
                            <th>Puntos Rojo (${athleteRed.name})</th>
                            <th>Ganador Oficial</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${combatRecords.map(c => `
                            <tr>
                                <td>${c.date}</td>
                                <td>${c.combatDetails.stage || 'Tope'}</td>
                                <td><strong style="color: #38bdf8;">${c.combatDetails.totalBlue} Pts</strong></td>
                                <td><strong style="color: #ef4444;">${c.combatDetails.totalRed} Pts</strong></td>
                                <td><span class="badge ${c.combatDetails.winner === 'blue' ? 'primary' : 'danger'}">${c.combatDetails.winner === 'blue' ? athleteBlue.name : athleteRed.name}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            fightsCard.style.display = 'block';
            fightsContent.innerHTML = `
                <div class="empty-list" style="padding: 16px;">
                    <i class="fa-solid fa-handshake" style="font-size: 24px; color: var(--accent); margin-bottom: 6px;"></i>
                    <p>No hay combates previos registrados entre estos dos atletas en el sistema.</p>
                </div>
            `;
        }

        // Tactical martial recommendation
        let blueAdv = [];
        let redAdv = [];
        if (reachDiff > 3) blueAdv.push(`Mayor alcance (+${reachDiff} cm)`);
        else if (reachDiff < -3) redAdv.push(`Mayor alcance (+${Math.abs(reachDiff)} cm)`);

        if ((blueEval.ruffier?.score || 5) > (redEval.ruffier?.score || 5) + 1) blueAdv.push("Mejor recuperación cardiovascular (Ruffier)");
        else if ((redEval.ruffier?.score || 5) > (blueEval.ruffier?.score || 5) + 1) redAdv.push("Mejor recuperación cardiovascular (Ruffier)");

        if ((blueEval.kickSpeed?.score || 5) > (redEval.kickSpeed?.score || 5) + 1) blueAdv.push("Mayor velocidad y cadencia de pateo (FSKT)");
        else if ((redEval.kickSpeed?.score || 5) > (blueEval.kickSpeed?.score || 5) + 1) redAdv.push("Mayor velocidad y cadencia de pateo (FSKT)");

        if ((blueEval.pushups?.score || 5) + (blueEval.plank?.score || 5) > (redEval.pushups?.score || 5) + (redEval.plank?.score || 5) + 1) blueAdv.push("Mayor fuerza muscular y estabilidad de core");
        else if ((redEval.pushups?.score || 5) + (redEval.plank?.score || 5) > (blueEval.pushups?.score || 5) + (blueEval.plank?.score || 5) + 1) redAdv.push("Mayor fuerza muscular y estabilidad de core");

        document.getElementById('h2h-tactical-content').innerHTML = `
            <div class="h2h-tactical-grid">
                <div class="tactical-column blue-tactics">
                    <h4 style="color: #38bdf8;"><i class="fa-solid fa-chess"></i> Estrategia para ${athleteBlue.name} (Azul)</h4>
                    <ul>
                        ${blueAdv.length > 0 ? blueAdv.map(a => `<li><i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> <strong>Fortaleza:</strong> ${a}</li>`).join('') : '<li>Perfil físico equilibrado frente al oponente.</li>'}
                        <li><i class="fa-solid fa-bullseye" style="color: #38bdf8;"></i> <strong>Plan Táctico:</strong> ${reachDiff > 0 ? 'Mantener distancia larga con Bandal Chagi y Yeop Chagi de contención. Evitar el combate cuerpo a cuerpo prolongado.' : 'Presionar en distancia media, castigar con combinaciones rápidas de puño-patada y buscar clinch.'}</li>
                    </ul>
                </div>
                <div class="tactical-column red-tactics">
                    <h4 style="color: #ef4444;"><i class="fa-solid fa-chess"></i> Estrategia para ${athleteRed.name} (Rojo)</h4>
                    <ul>
                        ${redAdv.length > 0 ? redAdv.map(a => `<li><i class="fa-solid fa-circle-check" style="color: #ef4444;"></i> <strong>Fortaleza:</strong> ${a}</li>`).join('') : '<li>Perfil físico equilibrado frente al oponente.</li>'}
                        <li><i class="fa-solid fa-bullseye" style="color: #ef4444;"></i> <strong>Plan Táctico:</strong> ${reachDiff < 0 ? 'Explotar la ventaja de alcance, lanzar ataques directos lineales y cerrar con bloqueo firme.' : 'Romper la distancia con pasos laterales, cortar los ángulos y buscar proyecciones o barridos en el cuerpo a cuerpo.'}</li>
                    </ul>
                </div>
            </div>
        `;
    };



