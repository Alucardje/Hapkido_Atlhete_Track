console.log('Module: hapkido-schools.js loaded');
/**
 * Module: hapkido-schools.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.populateAthleteSchoolsDropdown = function() {
        const select = document.getElementById('athlete-school');
        if (!select) return;

        select.innerHTML = '';
        
        if (this.currentUser && this.currentUser.role === 'admin') {
            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.textContent = '-- Seleccione una Escuela --';
            select.appendChild(optDefault);
        }

        const schools = this.data.schools || [];
        schools.forEach(sch => {
            const opt = document.createElement('option');
            opt.value = sch.name;
            opt.textContent = sch.name;
            select.appendChild(opt);
        });

        if (this.currentUser && this.currentUser.role !== 'admin') {
            select.value = this.currentUser.school || '';
            select.disabled = true;
        } else {
            select.disabled = false;
        }
    }


HapkidoApp.prototype.populateInstructorsDropdown = function() {
        const select = document.getElementById('school-instructor');
        if (!select) return;

        select.innerHTML = '';

        const maestros = [
            { name: "Maestro 1", role: "Maestro / Instructor" },
            { name: "Maestro 2", role: "Maestro / Instructor" }
        ];

        maestros.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.name;
            opt.textContent = `${m.name} (${m.role})`;
            select.appendChild(opt);
        });

        const athletes = this.data.athletes || [];
        const BELT_ORDER = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
        
        athletes.forEach(ath => {
            const isEligible = BELT_ORDER.indexOf(ath.belt) >= BELT_ORDER.indexOf("Verde");
            if (ath.isAyudante || isEligible) {
                const opt = document.createElement('option');
                opt.value = ath.name;
                opt.textContent = `${ath.name} (Instructor en Ent. - ${ath.belt})`;
                select.appendChild(opt);
            }
        });
    }


HapkidoApp.prototype.renderSchoolsList = function() {
        const tbody = document.querySelector('#schools-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const schools = this.data.schools || [];

        if (schools.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No hay escuelas registradas.</td></tr>`;
            return;
        }

        schools.forEach(sch => {
            const assoc = this.data.associations.find(a => a.id === sch.associationId);
            const assocName = assoc ? assoc.name : "Sin Asociación";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${sch.name}</strong></td>
                <td>${assocName}</td>
                <td>${sch.location}</td>
                <td>${sch.instructorName}</td>
                <td><span class="badge ${sch.instructorRole.includes('Maestro') ? 'success' : 'warning'}">${sch.instructorRole}</span></td>
                <td class="actions-cell">
                    <button class="icon-btn edit" onclick="app.openEditSchoolModal('${sch.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="app.deleteSchool('${sch.id}')" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


HapkidoApp.prototype.openNewSchoolModal = function() {
        const form = document.getElementById('school-form');
        if (form) form.reset();
        
        document.getElementById('school-id').value = '';
        document.getElementById('school-modal-title').textContent = 'Agregar Nueva Escuela';
        
        this.populateAssociationDropdowns();
        this.populateInstructorsDropdown();
        
        const modal = document.getElementById('school-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.openEditSchoolModal = function(id) {
        const sch = this.data.schools.find(s => s.id === id);
        if (!sch) return;

        document.getElementById('school-id').value = sch.id;
        document.getElementById('school-name').value = sch.name;
        
        this.populateAssociationDropdowns();
        document.getElementById('school-association').value = sch.associationId || '';

        document.getElementById('school-location').value = sch.location;

        this.populateInstructorsDropdown();
        document.getElementById('school-instructor').value = sch.instructorName;

        document.getElementById('school-modal-title').textContent = 'Editar Escuela / Dojang';
        
        const modal = document.getElementById('school-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.saveSchool = function(event) {
        if (event) event.preventDefault();

        const id = document.getElementById('school-id').value;
        const name = document.getElementById('school-name').value.trim();
        const associationId = document.getElementById('school-association').value;
        const location = document.getElementById('school-location').value.trim();
        const instructorName = document.getElementById('school-instructor').value;

        let instructorRole = "Maestro / Instructor";
        
        const athlete = this.data.athletes.find(a => a.name === instructorName);
        if (athlete) {
            instructorRole = "Instructor en Entrenamiento";
            athlete.isAyudante = true;
            athlete.school = name;
        }

        if (id) {
            const index = this.data.schools.findIndex(s => s.id === id);
            if (index !== -1) {
                this.data.schools[index] = { id, name, location, instructorName, instructorRole, associationId };
            }
        } else {
            const newSchool = {
                id: 'sch_' + Date.now(),
                name, location, instructorName, instructorRole, associationId
            };
            this.data.schools.push(newSchool);
        }

        this.saveData();
        
        const modal = document.getElementById('school-modal');
        if (modal) modal.classList.remove('active');

        this.renderSchoolsList();
        this.populateAthleteSchoolsDropdown();
    }


HapkidoApp.prototype.deleteSchool = function(id) {
        if (confirm("¿Está seguro de que desea eliminar esta escuela?")) {
            this.data.schools = this.data.schools.filter(s => s.id !== id);
            this.saveData();
            this.renderSchoolsList();
            this.populateAthleteSchoolsDropdown();
        }
    }


HapkidoApp.prototype.switchSchoolSubTab = function(subTab) {
        const tabBtnSchools = document.getElementById('subtab-btn-schools');
        const tabBtnAssoc = document.getElementById('subtab-btn-associations');
        const containerSchools = document.getElementById('subtab-schools-container');
        const containerAssoc = document.getElementById('subtab-associations-container');

        if (subTab === 'schools') {
            if (tabBtnSchools) tabBtnSchools.classList.add('active');
            if (tabBtnAssoc) tabBtnAssoc.classList.remove('active');
            if (containerSchools) containerSchools.style.display = 'block';
            if (containerAssoc) containerAssoc.style.display = 'none';
            this.renderSchoolsList();
        } else {
            if (tabBtnSchools) tabBtnSchools.classList.remove('active');
            if (tabBtnAssoc) tabBtnAssoc.classList.add('active');
            if (containerSchools) containerSchools.style.display = 'none';
            if (containerAssoc) containerAssoc.style.display = 'block';
            this.renderAssociationsList();
        }
    }


HapkidoApp.prototype.renderAssociationsList = function() {
        const tbody = document.querySelector('#associations-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const associations = this.data.associations || [];

        if (associations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No hay asociaciones registradas.</td></tr>`;
            return;
        }

        associations.forEach(asc => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${asc.name}</strong></td>
                <td>${asc.state}</td>
                <td><span class="badge success">${asc.federation}</span></td>
                <td class="actions-cell">
                    <button class="icon-btn edit" onclick="app.openEditAssociationModal('${asc.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="app.deleteAssociation('${asc.id}')" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


HapkidoApp.prototype.openNewAssociationModal = function() {
        const form = document.getElementById('association-form');
        if (form) form.reset();

        document.getElementById('association-id').value = '';
        document.getElementById('association-modal-title').textContent = 'Agregar Nueva Asociación Estatal';

        const modal = document.getElementById('association-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.openEditAssociationModal = function(id) {
        const asc = this.data.associations.find(a => a.id === id);
        if (!asc) return;

        document.getElementById('association-id').value = asc.id;
        document.getElementById('association-name').value = asc.name;
        document.getElementById('association-state').value = asc.state;

        document.getElementById('association-modal-title').textContent = 'Editar Asociación Estatal';

        const modal = document.getElementById('association-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.saveAssociation = function(event) {
        if (event) event.preventDefault();

        const id = document.getElementById('association-id').value;
        const name = document.getElementById('association-name').value.trim();
        const state = document.getElementById('association-state').value.trim();
        const federation = document.getElementById('association-federation').value;

        if (id) {
            const index = this.data.associations.findIndex(a => a.id === id);
            if (index !== -1) {
                this.data.associations[index] = { id, name, state, federation };
            }
        } else {
            const newAssoc = {
                id: 'asc_' + Date.now(),
                name, state, federation
            };
            this.data.associations.push(newAssoc);
        }

        this.saveData();

        const modal = document.getElementById('association-modal');
        if (modal) modal.classList.remove('active');

        this.renderAssociationsList();
    }


HapkidoApp.prototype.deleteAssociation = function(id) {
        const hasLinkedSchools = this.data.schools.some(s => s.associationId === id);
        if (hasLinkedSchools) {
            alert('No se puede eliminar esta asociación porque existen Dojangs vinculados a ella. Debes desvincularlos o eliminarlos primero.');
            return;
        }

        if (confirm("¿Está seguro de que desea eliminar esta asociación estatal?")) {
            this.data.associations = this.data.associations.filter(a => a.id !== id);
            this.saveData();
            this.renderAssociationsList();
        }
    }


HapkidoApp.prototype.populateAssociationDropdowns = function() {
        const select = document.getElementById('school-association');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccione una Asociación --</option>';
        const associations = this.data.associations || [];
        associations.forEach(asc => {
            const opt = document.createElement('option');
            opt.value = asc.id;
            opt.textContent = `${asc.name} (${asc.state})`;
            select.appendChild(opt);
        });
    }



