console.log('Module: hapkido-torneos.js loaded');
/**
 * Module: hapkido-torneos.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.populateTorneoModalDropdowns = function() {
        const schoolSelect = document.getElementById('torneo-school');
        const stateSelect = document.getElementById('torneo-state');
        
        if (schoolSelect) {
            schoolSelect.innerHTML = '<option value="">-- Seleccionar Escuela --</option>';
            const schools = this.data.schools || [];
            schools.forEach(sch => {
                const opt = document.createElement('option');
                opt.value = sch.name;
                opt.textContent = sch.name;
                schoolSelect.appendChild(opt);
            });
        }
        
        if (stateSelect) {
            stateSelect.innerHTML = '<option value="">-- Seleccionar Estado --</option>';
            const associations = this.data.associations || [];
            associations.forEach(asc => {
                const opt = document.createElement('option');
                opt.value = asc.state;
                opt.textContent = `${asc.state} (${asc.name})`;
                stateSelect.appendChild(opt);
            });
        }
    }


HapkidoApp.prototype.openNewTorneoModal = function() {
        const form = document.getElementById('torneo-form');
        if (form) form.reset();

        document.getElementById('torneo-id').value = '';
        document.getElementById('torneo-referee').value = '';
        document.getElementById('torneo-modal-title').textContent = 'Solicitar Tope / Torneo';

        this.populateTorneoModalDropdowns();

        if (this.currentUser && this.currentUser.school) {
            const schoolSelect = document.getElementById('torneo-school');
            if (schoolSelect) schoolSelect.value = this.currentUser.school;
        }

        const statusGroup = document.getElementById('torneo-status-group');
        if (statusGroup) {
            if (this.currentUser && this.currentUser.role === 'admin') {
                statusGroup.style.display = 'block';
                document.getElementById('torneo-status').value = 'Solicitado';
            } else {
                statusGroup.style.display = 'none';
            }
        }

        const modal = document.getElementById('torneo-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.openEditTorneoModal = function(id) {
        const trn = this.data.torneos.find(t => t.id === id);
        if (!trn) return;

        if (!this.currentUser || (this.currentUser.role !== 'admin' && this.currentUser.school !== trn.school)) {
            alert("No tiene permisos para modificar la solicitud de otra escuela.");
            return;
        }

        document.getElementById('torneo-id').value = trn.id;
        document.getElementById('torneo-name').value = trn.name;
        document.getElementById('torneo-type').value = trn.type;
        document.getElementById('torneo-date').value = trn.date;

        this.populateTorneoModalDropdowns();

        document.getElementById('torneo-school').value = trn.school || '';
        document.getElementById('torneo-state').value = trn.state || '';
        document.getElementById('torneo-guests').value = trn.guests || '';
        document.getElementById('torneo-referee').value = trn.referee || '';
        
        document.getElementById('torneo-mod-combate').checked = !!trn.modalities?.combate;
        document.getElementById('torneo-mod-saltos').checked = !!trn.modalities?.saltos;
        document.getElementById('torneo-mod-exhibicion').checked = !!trn.modalities?.exhibicion;
        document.getElementById('torneo-notes').value = trn.notes || '';

        const statusGroup = document.getElementById('torneo-status-group');
        if (statusGroup) {
            if (this.currentUser && this.currentUser.role === 'admin') {
                statusGroup.style.display = 'block';
                document.getElementById('torneo-status').value = trn.status || 'Solicitado';
            } else {
                statusGroup.style.display = 'none';
            }
        }

        document.getElementById('torneo-modal-title').textContent = 'Editar Solicitud de Torneo / Tope';

        const modal = document.getElementById('torneo-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.saveTorneo = function(event) {
        if (event) event.preventDefault();

        const id = document.getElementById('torneo-id').value;
        const name = document.getElementById('torneo-name').value.trim();
        const type = document.getElementById('torneo-type').value;
        const date = document.getElementById('torneo-date').value;
        const school = document.getElementById('torneo-school').value;
        const state = document.getElementById('torneo-state').value;
        const guests = document.getElementById('torneo-guests').value.trim();
        const referee = document.getElementById('torneo-referee').value.trim();
        
        const combate = document.getElementById('torneo-mod-combate').checked;
        const saltos = document.getElementById('torneo-mod-saltos').checked;
        const exhibicion = document.getElementById('torneo-mod-exhibicion').checked;
        const notes = document.getElementById('torneo-notes').value.trim();
        
        let status = 'Solicitado';
        if (this.currentUser && this.currentUser.role === 'admin') {
            status = document.getElementById('torneo-status').value;
        }

        if (!combate && !saltos && !exhibicion) {
            alert("Debe seleccionar al menos una modalidad para el evento.");
            return;
        }

        // --- ENFORCE HIERARCHY RULES ---
        const userRole = this.currentUser?.role || 'athlete';
        const userRank = (this.currentUser?.rank || '').toUpperCase();
        const isFederationUser = this.currentUser?.school === "Federación Venezolana de Hapkido (Sede Central)" || userRole === 'admin';
        const isAssociationUser = userRank.includes("ASOCIACION") || userRank.includes("ASOCIACIÓN") || userRank.includes("DELEGADO") || userRank.includes("PRESIDENTE") || userRank.includes("DIRECTIVA") || userRank.includes("DIRECTOR");

        // Rule 1: Torneos Nacionales can only be organized by the Federation
        if (type === 'Torneo Nacional' && !isFederationUser) {
            alert("Las solicitudes de Torneo Nacional están estrictamente reservadas para la Federación Venezolana de Hapkido.");
            return;
        }

        // Rule 2: Torneos Estadales and Topes Inter-estados can only be requested by Associations or the Federation
        if ((type === 'Torneo Estatal' || type === 'Tope Inter-estados') && !isFederationUser && !isAssociationUser) {
            alert("Las solicitudes de Torneo Estatal y Tope Inter-estados están reservadas para las Asociaciones Estatales autorizadas o la Federación.");
            return;
        }

        // Rule 3: School-level instructors and helpers can only request inter-school topes or friendly matches
        if (userRole === 'ayudante' && type !== 'Tope Inter-escuelas' && type !== 'Tope Amistoso') {
            alert("Como Instructor en Entrenamiento / Ayudante, solo tiene permitido solicitar Topes Inter-escuelas y Topes Amistosos Generales.");
            return;
        }

        // --- ENFORCE REFEREE RULES ---
        // Regional (State Tournament, Inter-state Tope) and National Tournaments must have a referee
        const isRegionalOrNational = ['Torneo Nacional', 'Torneo Estatal', 'Tope Inter-estados'].includes(type);
        if (isRegionalOrNational && !referee) {
            alert("Este evento (regional o nacional) requiere de forma obligatoria la asignación y participación de al menos un Árbitro Principal o Juez Federativo.");
            return;
        }

        if (id) {
            const index = this.data.torneos.findIndex(t => t.id === id);
            if (index !== -1) {
                const oldStatus = this.data.torneos[index].status;
                this.data.torneos[index] = {
                    id, name, type, date, school, state, guests, referee,
                    modalities: { combate, saltos, exhibicion },
                    notes,
                    status: (this.currentUser.role === 'admin') ? status : oldStatus
                };
            }
        } else {
            const newTorneo = {
                id: 'trn_' + Date.now(),
                name, type, date, school, state, guests, referee,
                modalities: { combate, saltos, exhibicion },
                notes,
                status
            };
            this.data.torneos.push(newTorneo);
        }

        this.saveData();

        const modal = document.getElementById('torneo-modal');
        if (modal) modal.classList.remove('active');

        this.renderTorneosList();
    }


HapkidoApp.prototype.deleteTorneo = function(id) {
        const trn = this.data.torneos.find(t => t.id === id);
        if (!trn) return;

        if (!this.currentUser || (this.currentUser.role !== 'admin' && this.currentUser.school !== trn.school)) {
            alert("No tiene permisos para eliminar la solicitud de otra escuela.");
            return;
        }

        if (confirm(`¿Está seguro de que desea eliminar el evento: "${trn.name}"?`)) {
            this.data.torneos = this.data.torneos.filter(t => t.id !== id);
            this.saveData();
            // Hide inscritos panel if this torneo was selected
            if (this.selectedTorneoId === id) {
                this.selectedTorneoId = null;
                const inscritosCard = document.getElementById('torneo-inscritos-card');
                if (inscritosCard) inscritosCard.style.display = 'none';
                // Remove selected-row highlight
                document.querySelectorAll('.selected-row').forEach(el => el.classList.remove('selected-row'));
            }
            this.renderTorneosList();
        }
    }


HapkidoApp.prototype.renderTorneosList = function() {
        const tbody = document.querySelector('#torneos-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const torneos = this.data.torneos || [];

        const solicitados = torneos.filter(t => t.status === 'Solicitado').length;
        const aprobados = torneos.filter(t => t.status === 'Aprobado').length;
        
        const statSolicitados = document.getElementById('stat-torneos-solicitados');
        if (statSolicitados) statSolicitados.textContent = solicitados;
        const statAprobados = document.getElementById('stat-torneos-aprobados');
        if (statAprobados) statAprobados.textContent = aprobados;
        const statTotal = document.getElementById('stat-torneos-total');
        if (statTotal) statTotal.textContent = torneos.length;

        if (torneos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No hay torneos o topes programados.</td></tr>`;
            return;
        }

        const sortedTorneos = [...torneos].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedTorneos.forEach(trn => {
            const tr = document.createElement('tr');
            
            const mods = [];
            if (trn.modalities?.combate) mods.push("Combate");
            if (trn.modalities?.saltos) mods.push("Saltos");
            if (trn.modalities?.exhibicion) mods.push("Exhibición");
            const modsText = mods.join(", ") || "Ninguna";

            let badgeClass = 'warning';
            if (trn.status === 'Aprobado') badgeClass = 'success';
            if (trn.status === 'Rechazado') badgeClass = 'danger';

            const isOwner = this.currentUser ? (this.currentUser.school === trn.school) : false;
            const isAdmin = this.currentUser ? (this.currentUser.role === 'admin') : false;
            const showEditDelete = isAdmin || isOwner;
            const canManageInscripcion = trn.status === 'Aprobado' && (isAdmin || isOwner);

            if (this.selectedTorneoId === trn.id) {
                tr.classList.add('selected-row');
            }

            tr.innerHTML = `
                <td>
                    <strong>${trn.name}</strong>
                    ${trn.referee ? `<br><small style="color: var(--cyan); display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;"><i class="fa-solid fa-scale-balanced"></i> Árbitro: ${trn.referee}</small>` : ''}
                </td>
                <td>${trn.type}</td>
                <td>${trn.date}</td>
                <td>${trn.school}</td>
                <td>${trn.state || 'N/A'}</td>
                <td>${modsText}</td>
                <td><span class="badge ${badgeClass}">${trn.status.toUpperCase()}</span></td>
                <td class="actions-cell">
                    ${canManageInscripcion ? `
                        <button class="icon-btn" onclick="app.selectTorneoForInscripcion('${trn.id}')" title="Atletas Inscritos" style="background: rgba(56, 189, 248, 0.15); color: var(--primary);"><i class="fa-solid fa-users"></i></button>
                    ` : ''}
                    ${showEditDelete ? `
                        <button class="icon-btn edit" onclick="app.openEditTorneoModal('${trn.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                        <button class="icon-btn delete" onclick="app.deleteTorneo('${trn.id}')" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
                    ` : (!canManageInscripcion ? '<span style="color: var(--text-muted); font-size: 11px;">Lectura</span>' : '')}
                </td>
            `;
            tbody.appendChild(tr);
        });
    };


HapkidoApp.prototype.selectTorneoForInscripcion = function(torneoId) {
        this.selectedTorneoId = torneoId;
        this.renderTorneosList();

        const trn = this.data.torneos.find(t => t.id === torneoId);
        if (!trn) return;

        const inscritosCard = document.getElementById('torneo-inscritos-card');
        const nameSpan = document.getElementById('inscritos-torneo-name');
        
        if (inscritosCard && nameSpan) {
            nameSpan.textContent = trn.name;
            inscritosCard.style.display = 'block';
            this.renderTorneoInscritosList(torneoId);
            
            // Smooth scroll to the registration list
            inscritosCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


HapkidoApp.prototype.renderTorneoInscritosList = function(torneoId) {
        const tbody = document.querySelector('#torneo-inscritos-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const trn = this.data.torneos.find(t => t.id === torneoId);
        if (!trn) return;

        const regs = trn.registrations || [];
        if (regs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No hay competidores inscritos en este evento. Presiona "Inscribir Competidor" para agregar uno.</td></tr>`;
            return;
        }

        regs.forEach(reg => {
            const tr = document.createElement('tr');
            
            const cats = [];
            if (reg.categories?.combate) cats.push('<span class="badge warning">Combate</span>');
            if (reg.categories?.saltoLargo) cats.push('<span class="badge success">Salto Largo</span>');
            if (reg.categories?.saltoAlto) cats.push('<span class="badge success">Salto Alto</span>');
            if (reg.categories?.figurasSin) cats.push('<span class="badge info">Figuras Sin Armas</span>');
            if (reg.categories?.figurasCon) cats.push('<span class="badge info">Figuras Con Armas</span>');
            if (reg.categories?.demos) cats.push('<span class="badge danger">Demostración DP</span>');
            const catsText = cats.join(" ") || '<span style="color: var(--text-muted);">Ninguna</span>';

            const formattedWeight = reg.weight ? `${reg.weight} kg` : 'N/A';

            tr.innerHTML = `
                <td><strong>${reg.athleteName}</strong></td>
                <td>${reg.belt}</td>
                <td>${reg.age} años / ${reg.gender}</td>
                <td>${formattedWeight} <br><small style="color: var(--cyan); font-weight: bold;">${reg.division}</small></td>
                <td><div style="display: flex; gap: 4px; flex-wrap: wrap;">${catsText}</div></td>
                <td class="actions-cell">
                    <button class="icon-btn delete" onclick="app.deleteTorneoInscripcion('${trn.id}', '${reg.athleteId}')" title="Eliminar Inscripción"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };


HapkidoApp.prototype.openTorneoInscripcionModal = function(torneoId) {
        const id = torneoId || this.selectedTorneoId;
        if (!id) {
            alert("Por favor seleccione un torneo primero.");
            return;
        }

        const trn = this.data.torneos.find(t => t.id === id);
        if (!trn) return;

        // Reset form
        const form = document.getElementById('torneo-inscripcion-form');
        if (form) form.reset();

        document.getElementById('inscripcion-athlete-info').style.display = 'none';

        // Filter and fill eligible athletes dropdown (must have at least 1 physical test)
        const select = document.getElementById('inscripcion-athlete-select');
        if (select) {
            select.innerHTML = '<option value="">-- Seleccionar Practicante --</option>';
            
            const eligible = this.data.athletes.filter(a => 
                this.data.records.some(r => r.athleteId === a.id && r.type === 'FISICA')
            );

            // Filter further by school if user is not admin
            const filtered = (this.currentUser && this.currentUser.role !== 'admin')
                ? eligible.filter(a => a.school === this.currentUser.school)
                : eligible;

            filtered.forEach(ath => {
                const opt = document.createElement('option');
                opt.value = ath.id;
                opt.textContent = `${ath.name} (${ath.belt} - ${ath.school})`;
                select.appendChild(opt);
            });
        }

        // Toggle category labels based on tournament modalities
        const hasCombate = !!trn.modalities?.combate;
        const hasSaltos = !!trn.modalities?.saltos;
        const hasExhibicion = !!trn.modalities?.exhibicion;

        document.getElementById('lbl-ins-combate').style.display = hasCombate ? 'block' : 'none';
        document.getElementById('lbl-ins-salto-largo').style.display = hasSaltos ? 'block' : 'none';
        document.getElementById('lbl-ins-salto-alto').style.display = hasSaltos ? 'block' : 'none';
        document.getElementById('lbl-ins-figuras-sin').style.display = hasExhibicion ? 'block' : 'none';
        document.getElementById('lbl-ins-figuras-con').style.display = hasExhibicion ? 'block' : 'none';
        document.getElementById('lbl-ins-demos').style.display = hasExhibicion ? 'block' : 'none';

        // Open modal
        document.getElementById('torneo-inscripcion-modal').classList.add('active');
    };


HapkidoApp.prototype.handleInscripcionAthleteChange = function(e) {
        const athleteId = e.target.value;
        const infoBlock = document.getElementById('inscripcion-athlete-info');
        
        if (!athleteId) {
            infoBlock.style.display = 'none';
            return;
        }

        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        // Get latest physical test weight
        const physRecords = this.data.records
            .filter(r => r.athleteId === athleteId && r.type === 'FISICA')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const latest = physRecords[physRecords.length - 1];
        const weight = latest ? latest.physicalDetails.weight : null;
        const age = this.calculateAge(athlete.birthdate);
        const division = this.getWeightDivision(athlete.birthdate, athlete.gender, weight);

        document.getElementById('ins-info-age').textContent = age;
        document.getElementById('ins-info-gender').textContent = athlete.gender;
        document.getElementById('ins-info-belt').textContent = athlete.belt;
        document.getElementById('ins-info-weight').textContent = weight !== null ? weight : 'Sin Registrar';
        document.getElementById('ins-info-division').textContent = division;

        infoBlock.style.display = 'block';
    };


HapkidoApp.prototype.saveTorneoInscripcion = function(event) {
        if (event) event.preventDefault();

        const id = this.selectedTorneoId;
        const trn = this.data.torneos.find(t => t.id === id);
        if (!trn) return;

        const athleteId = document.getElementById('inscripcion-athlete-select').value;
        if (!athleteId) {
            alert("Por favor seleccione un atleta.");
            return;
        }

        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        const combate = document.getElementById('ins-cat-combate').checked;
        const saltoLargo = document.getElementById('ins-cat-salto-largo').checked;
        const saltoAlto = document.getElementById('ins-cat-salto-alto').checked;
        const figurasSin = document.getElementById('ins-cat-figuras-sin').checked;
        const figurasCon = document.getElementById('ins-cat-figuras-con').checked;
        const demos = document.getElementById('ins-cat-demos').checked;

        if (!combate && !saltoLargo && !saltoAlto && !figurasSin && !figurasCon && !demos) {
            alert("Debe seleccionar al menos una categoría de competencia.");
            return;
        }

        // Get latest physical test weight
        const physRecords = this.data.records
            .filter(r => r.athleteId === athleteId && r.type === 'FISICA')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const latest = physRecords[physRecords.length - 1];
        const weight = latest ? latest.physicalDetails.weight : null;

        // Weight verification for Combates
        if (combate && (weight === null || weight === undefined || isNaN(weight) || weight === '')) {
            alert("Para inscribirse en la modalidad de Combate, es obligatorio que el atleta cuente con un peso corporal registrado en su última evaluación física.");
            return;
        }

        const age = this.calculateAge(athlete.birthdate);
        const division = this.getWeightDivision(athlete.birthdate, athlete.gender, weight);

        trn.registrations = trn.registrations || [];

        // Check if already registered
        const existingIdx = trn.registrations.findIndex(r => r.athleteId === athleteId);
        const regData = {
            athleteId,
            athleteName: athlete.name,
            belt: athlete.belt,
            age,
            gender: athlete.gender,
            weight,
            division,
            categories: { combate, saltoLargo, saltoAlto, figurasSin, figurasCon, demos }
        };

        if (existingIdx !== -1) {
            trn.registrations[existingIdx] = regData;
        } else {
            trn.registrations.push(regData);
        }

        this.saveData();
        
        // Close modal
        document.getElementById('torneo-inscripcion-modal').classList.remove('active');
        
        // Refresh registered list
        this.renderTorneoInscritosList(id);
    };


HapkidoApp.prototype.deleteTorneoInscripcion = function(torneoId, athleteId) {
        const trn = this.data.torneos.find(t => t.id === torneoId);
        if (!trn) return;

        if (confirm("¿Está seguro de que desea retirar la inscripción de este competidor en el evento?")) {
            trn.registrations = (trn.registrations || []).filter(r => r.athleteId !== athleteId);
            this.saveData();
            this.renderTorneoInscritosList(torneoId);
        }
    };




