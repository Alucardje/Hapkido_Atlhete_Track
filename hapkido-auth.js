console.log('Module: hapkido-auth.js loaded');
/**
 * Module: hapkido-auth.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.login = function(event) {
        if (event) event.preventDefault();
        const username = document.getElementById('login-username').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();
        
        let user = null;
        let matchedUser = this.data.users.find(u => u.username === username);
        
        // Bulletproof admin override
        if (username === 'admin' && password === '123') {
            if (!matchedUser) {
                matchedUser = { id: "usr_admin", username: "admin", password: "123", role: "admin", name: "Administrador", school: null, athleteId: null, rank: "Administrador Central" };
                this.data.users.push(matchedUser);
                this.saveData();
            } else if (matchedUser.password !== '123' || matchedUser.role !== 'admin' || !matchedUser.rank) {
                matchedUser.password = '123';
                matchedUser.role = 'admin';
                matchedUser.rank = "Administrador Central";
                this.saveData();
            }
        }
        
        if (matchedUser && matchedUser.password === password) {
            if (matchedUser.athleteId) {
                const ath = this.data.athletes.find(a => a.id === matchedUser.athleteId);
                if (ath) {
                    user = {
                        username: matchedUser.username,
                        role: ath.isAyudante ? 'ayudante' : 'athlete',
                        name: ath.name,
                        school: ath.school,
                        athleteId: ath.id,
                        belt: ath.belt,
                        rank: ath.belt
                    };
                } else {
                    user = { ...matchedUser };
                }
            } else {
                user = { ...matchedUser };
            }
        }

        if (user) {
            this.currentUser = user;
            localStorage.setItem('hapkido_current_user', JSON.stringify(user));
            document.body.className = 'role-' + user.role;
            
            const errorMsg = document.getElementById('login-error-msg');
            if (errorMsg) errorMsg.classList.add('hidden');
            
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.remove('active');
            
            document.getElementById('login-form').reset();
            
            const manualSelect = document.getElementById('manual-program-belt');
            if (manualSelect) {
                manualSelect.value = '';
                this.renderTechnicalSyllabus('');
            }
            
            this.updateDashboardStats();
            this.renderAthletesList();
            this.populateAthleteDropdowns();
            this.populateManualBeltsDropdown();
            this.renderSchoolsList();
            
            this.updateUserSessionHeader();
            
            window.location.hash = '#dashboard';
            this.handleRouting();
        } else {
            const errorMsg = document.getElementById('login-error-msg');
            if (errorMsg) errorMsg.classList.remove('hidden');
        }
    };

    /**
     * Acceso Rápido por Rol para Evaluadores y Maestros (Sin Clave / Beta Testing)
     */
    HapkidoApp.prototype.selectPresentationRole = function(role) {
        const customName = document.getElementById('welcome-trainer-name')?.value?.trim();
        let user = null;

        if (role === 'admin') {
            user = {
                username: 'maestro_director',
                role: 'admin',
                name: customName || 'Maestro Evaluador',
                school: null,
                athleteId: null,
                rank: 'Comisión Técnica / Maestro'
            };
        } else if (role === 'instructor') {
            user = {
                username: 'instructor_tatami',
                role: 'instructor',
                name: customName || 'Instructor Principal',
                school: (this.data.schools && this.data.schools[0]) ? this.data.schools[0].name : 'Dojang Central',
                athleteId: null,
                rank: 'Instructor de Dojang'
            };
        } else if (role === 'ayudante') {
            user = {
                username: 'mesa_tecnica',
                role: 'ayudante',
                name: customName || 'Mesa Técnica / Juez',
                school: null,
                athleteId: null,
                rank: 'Árbitro / Cronometrador'
            };
        } else if (role === 'athlete') {
            const sampleAthlete = (this.data.athletes && this.data.athletes[0]) ? this.data.athletes[0] : null;
            user = {
                username: 'atleta_demo',
                role: 'athlete',
                name: sampleAthlete ? sampleAthlete.name : (customName || 'Atleta en Evaluación'),
                school: sampleAthlete ? sampleAthlete.school : 'Dojang Central',
                athleteId: sampleAthlete ? sampleAthlete.id : null,
                belt: sampleAthlete ? sampleAthlete.belt : 'Cinturón Azul',
                rank: sampleAthlete ? sampleAthlete.belt : 'Cinturón Azul'
            };
        }

        if (user) {
            this.currentUser = user;
            localStorage.setItem('hapkido_current_user', JSON.stringify(user));
            document.body.className = 'role-' + user.role;

            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.remove('active');

            this.updateDashboardStats();
            this.renderAthletesList();
            this.populateAthleteDropdowns();
            this.populateManualBeltsDropdown();
            this.renderSchoolsList();
            this.updateUserSessionHeader();

            window.location.hash = '#dashboard';
            this.handleRouting();
        }
    };


HapkidoApp.prototype.logout = function() {
        this.currentUser = null;
        localStorage.removeItem('hapkido_current_user');
        document.body.className = '';

        // Close mobile drawer if open
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('mobile-backdrop');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');

        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.classList.add('active');
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.reset();
        const errorMsg = document.getElementById('login-error-msg');
        if (errorMsg) errorMsg.classList.add('hidden');

        this.updateUserSessionHeader();

        window.location.hash = '#dashboard';
    };


    HapkidoApp.prototype.updateUserSessionHeader = function() {
        const badge = document.getElementById('header-user-badge');
        const nameSpan = document.getElementById('header-user-name');
        const metaSpan = document.getElementById('header-user-meta');
        const headerLogoutBtn = document.getElementById('header-logout-btn');
        const sidebarUserCard = document.getElementById('sidebar-user-card');
        const sidebarUserName = document.getElementById('sidebar-user-name');
        const sidebarUserRole = document.getElementById('sidebar-user-role');
        const sidebarUserIcon = document.getElementById('sidebar-user-icon');
        
        if (this.currentUser) {
            const roleMap = {
                'admin': 'Administrador / Maestro',
                'instructor': 'Instructor / Entrenador',
                'ayudante': 'Mesa Técnica / Juez',
                'athlete': 'Atleta / Alumno'
            };
            const roleIcons = {
                'admin': 'fa-crown',
                'instructor': 'fa-user-ninja',
                'ayudante': 'fa-stopwatch-20',
                'athlete': 'fa-medal'
            };
            const roleText = roleMap[this.currentUser.role] || this.currentUser.role || 'Usuario';
            
            let rankText = '';
            if (this.currentUser.athleteId) {
                const ath = this.data.athletes.find(a => a.id === this.currentUser.athleteId);
                rankText = ath ? ath.belt : (this.currentUser.belt || this.currentUser.rank || 'Sin Rango');
            } else {
                rankText = this.currentUser.rank || 'Sin Rango';
            }
            
            const displayName = this.currentUser.name || 'Usuario';

            if (nameSpan) nameSpan.textContent = displayName;
            if (metaSpan) metaSpan.textContent = `${roleText} • ${rankText}`;
            if (badge) badge.style.display = 'flex';
            if (headerLogoutBtn) headerLogoutBtn.style.display = 'inline-flex';

            // Sidebar card update
            if (sidebarUserName) sidebarUserName.textContent = displayName;
            if (sidebarUserRole) sidebarUserRole.textContent = `${roleText}`;
            if (sidebarUserCard) sidebarUserCard.style.display = 'flex';
            if (sidebarUserIcon) {
                sidebarUserIcon.className = `fa-solid ${roleIcons[this.currentUser.role] || 'fa-user-ninja'}`;
            }
        } else {
            if (badge) badge.style.display = 'none';
            if (headerLogoutBtn) headerLogoutBtn.style.display = 'none';
            if (sidebarUserCard) sidebarUserCard.style.display = 'none';
        }
    };


HapkidoApp.prototype.validateUserPrivilege = function(role, rankOrBelt) {
        if (!rankOrBelt) {
            if (role === 'admin' || role === 'instructor') {
                return { valid: false, message: `El rol '${role === 'admin' ? 'Administrador' : 'Maestro / Instructor'}' requiere especificar un rango o cinturón válido (mínimo Cinturón Negro o rango administrativo).` };
            }
            return { valid: true };
        }
        
        const rankUpper = rankOrBelt.toUpperCase();
        
        const isBlackBelt = rankUpper.includes('NEGRO') || rankUpper.includes('DAN');
        const isMasterRank = rankUpper.includes('SABEOM') || rankUpper.includes('MAESTRO') || rankUpper.includes('4TO DAN') || rankUpper.includes('5TO DAN') || rankUpper.includes('6TO DAN') || rankUpper.includes('7MO DAN') || rankUpper.includes('8VO DAN') || rankUpper.includes('9NO DAN');
        const isFederationOrAdminRank = rankUpper.includes('ADMIN') || rankUpper.includes('FEDERACION') || rankUpper.includes('DIRECTOR') || rankUpper.includes('PRESIDENTE') || rankUpper.includes('ARBITRO') || rankUpper.includes('JUEZ') || rankUpper.includes('JUNTA') || rankUpper.includes('DIRECTIVA');
        
        if (role === 'admin') {
            if (isFederationOrAdminRank || isMasterRank) {
                return { valid: true };
            }
            return { valid: false, message: "El rol 'Administrador' está restringido a miembros directivos de la Federación, directores o Maestros de alto rango (mínimo 4to Dan / Sabeomnim)." };
        }
        
        if (role === 'instructor') {
            if (isBlackBelt || isMasterRank || rankUpper.includes('KYOSA') || rankUpper.includes('PROFESOR') || isFederationOrAdminRank) {
                return { valid: true };
            }
            return { valid: false, message: "El rol 'Maestro / Instructor' requiere rango de cinturón Negro (1er Dan o superior) o rango docente equivalente." };
        }
        
        if (role === 'ayudante') {
            const juniorBelts = ["BLANCO", "AMARILLO", "NARANJA"];
            const isJunior = juniorBelts.some(b => rankUpper === b);
            if (isJunior) {
                return { valid: false, message: "El rol 'Instructor en Ent. / Ayudante' requiere rango mínimo de Cinturón Verde." };
            }
        }
        return { valid: true };
    }


HapkidoApp.prototype.renderUsersList = function() {
        const tbody = document.querySelector('#users-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const users = this.data.users || [];

        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No hay usuarios registrados.</td></tr>`;
            return;
        }

        users.forEach(usr => {
            const athleteName = usr.athleteId ? (this.data.athletes.find(a => a.id === usr.athleteId)?.name || 'Desconocido') : 'Ninguno';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${usr.username}</strong></td>
                <td>${usr.name}</td>
                <td><span class="badge ${usr.role === 'admin' ? 'success' : (usr.role === 'instructor' ? 'info' : 'warning')}">${usr.role.toUpperCase()}</span></td>
                <td>${usr.school || 'Ninguna'}</td>
                <td>${athleteName}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit" onclick="app.openEditUserModal('${usr.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="app.deleteUser('${usr.id}')" title="Eliminar" ${usr.username === 'admin' ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


HapkidoApp.prototype.populateUserFormDropdowns = function() {
        const schoolSelect = document.getElementById('user-school');
        if (schoolSelect) {
            schoolSelect.innerHTML = '<option value="">-- Sin Escuela (Solo Admin) --</option>';
            const schools = this.data.schools || [];
            schools.forEach(sch => {
                const opt = document.createElement('option');
                opt.value = sch.name;
                opt.textContent = sch.name;
                schoolSelect.appendChild(opt);
            });
        }
        this.populateUserAthleteDropdown();
    }


HapkidoApp.prototype.populateUserAthleteDropdown = function() {
        const athleteSelect = document.getElementById('user-athlete-select');
        if (!athleteSelect) return;

        athleteSelect.innerHTML = '<option value="">-- Seleccionar Atleta Perfil --</option>';
        const athletes = this.data.athletes || [];
        athletes.forEach(ath => {
            const opt = document.createElement('option');
            opt.value = ath.id;
            opt.textContent = `${ath.name} (${ath.belt} - ${ath.school})`;
            athleteSelect.appendChild(opt);
        });
    }


HapkidoApp.prototype.onUserRoleChange = function() {
        const role = document.getElementById('user-role').value;
        const schoolGroup = document.getElementById('user-school-group');
        const athleteGroup = document.getElementById('user-athlete-group');
        
        if (role === 'admin') {
            if (schoolGroup) schoolGroup.style.display = 'none';
            if (athleteGroup) athleteGroup.style.display = 'none';
        } else if (role === 'instructor') {
            if (schoolGroup) schoolGroup.style.display = 'block';
            if (athleteGroup) athleteGroup.style.display = 'none';
        } else {
            if (schoolGroup) schoolGroup.style.display = 'block';
            if (athleteGroup) athleteGroup.style.display = 'block';
            this.populateUserAthleteDropdown();
        }
    }


HapkidoApp.prototype.openNewUserModal = function(autofillData) {
        const form = document.getElementById('user-form');
        if (form) form.reset();

        document.getElementById('user-id').value = '';
        document.getElementById('user-username').disabled = false;
        document.getElementById('user-password').required = true;
        document.getElementById('user-password-help').textContent = 'La contraseña es obligatoria para nuevos usuarios.';
        document.getElementById('user-modal-title').textContent = 'Registrar Nuevo Usuario';

        this.populateUserFormDropdowns();

        if (autofillData) {
            if (autofillData.name) document.getElementById('user-fullname').value = autofillData.name;
            if (autofillData.role) document.getElementById('user-role').value = autofillData.role;
            
            this.onUserRoleChange(); // trigger show/hide groups first

            if (autofillData.school) {
                const schoolSelect = document.getElementById('user-school');
                if (schoolSelect) schoolSelect.value = autofillData.school;
            }
            if (autofillData.athleteId) {
                const athleteSelect = document.getElementById('user-athlete-select');
                if (athleteSelect) {
                    athleteSelect.value = autofillData.athleteId;
                    this.onUserAthleteChange();
                }
            }
            // generate dynamic username based on name
            const usernameInput = document.getElementById('user-username');
            if (usernameInput && autofillData.name) {
                usernameInput.value = autofillData.name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);
            }
        } else {
            this.onUserRoleChange();
        }

        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.openEditUserModal = function(id) {
        const usr = this.data.users.find(u => u.id === id);
        if (!usr) return;

        document.getElementById('user-id').value = usr.id;
        document.getElementById('user-username').value = usr.username;
        document.getElementById('user-username').disabled = (usr.username === 'admin');
        
        document.getElementById('user-fullname').value = usr.name;
        document.getElementById('user-password').value = '';
        document.getElementById('user-password').required = false;
        document.getElementById('user-password-help').textContent = 'Deja este campo vacío para mantener la contraseña actual.';
        
        document.getElementById('user-role').value = usr.role;

        const rankInput = document.getElementById('user-rank');
        if (rankInput) {
            if (usr.athleteId) {
                const athlete = this.data.athletes.find(a => a.id === usr.athleteId);
                rankInput.value = athlete ? (athlete.belt || '') : (usr.rank || '');
            } else {
                rankInput.value = usr.rank || '';
            }
        }

        this.populateUserFormDropdowns();
        
        const schoolSelect = document.getElementById('user-school');
        if (schoolSelect) schoolSelect.value = usr.school || '';

        const athleteSelect = document.getElementById('user-athlete-select');
        if (athleteSelect) athleteSelect.value = usr.athleteId || '';

        this.onUserRoleChange();

        document.getElementById('user-modal-title').textContent = 'Editar Usuario';
        
        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.add('active');
    }


HapkidoApp.prototype.saveUser = function(event) {
        if (event) event.preventDefault();

        const id = document.getElementById('user-id').value;
        const username = document.getElementById('user-username').value.trim().toLowerCase();
        const name = document.getElementById('user-fullname').value.trim();
        const password = document.getElementById('user-password').value;
        const role = document.getElementById('user-role').value;
        const school = (role !== 'admin') ? document.getElementById('user-school').value : null;
        const athleteId = (role === 'ayudante' || role === 'athlete') ? document.getElementById('user-athlete-select').value : null;
        const rank = document.getElementById('user-rank').value.trim();

        // Enforce school affiliation for non-admins
        if (role !== 'admin' && !school) {
            alert('Por favor seleccione una Escuela / Dojang Asociado para este usuario.');
            return;
        }

        const duplicate = this.data.users.find(u => u.username === username && u.id !== id);
        if (duplicate) {
            alert('El nombre de usuario ya está registrado por otra cuenta. Por favor elige otro.');
            return;
        }

        // Validate privileges based on rank/belt
        let rankOrBelt = rank;
        if (athleteId) {
            const ath = this.data.athletes.find(a => a.id === athleteId);
            if (ath) rankOrBelt = ath.belt;
        }
        const validation = this.validateUserPrivilege(role, rankOrBelt);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        if (athleteId) {
            const athleteObj = this.data.athletes.find(a => a.id === athleteId);
            if (athleteObj) {
                if (role === 'ayudante') {
                    athleteObj.isAyudante = true;
                }
                if (school) {
                    athleteObj.school = school;
                }
            }
        }

        if (id) {
            const index = this.data.users.findIndex(u => u.id === id);
            if (index !== -1) {
                const existingPassword = this.data.users[index].password;
                this.data.users[index] = {
                    id,
                    username: this.data.users[index].username,
                    name,
                    password: password ? password : existingPassword,
                    role,
                    school,
                    athleteId,
                    rank
                };
            }
        } else {
            if (!password) {
                alert('La contraseña es requerida para registrar un nuevo usuario.');
                return;
            }
            const newUser = {
                id: 'usr_' + Date.now(),
                username,
                name,
                password,
                role,
                school,
                athleteId,
                rank
            };
            this.data.users.push(newUser);
        }

        this.saveData();

        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.remove('active');

        this.renderUsersList();
        
        this.renderAthletesList();
        this.populateAthleteDropdowns();
    }


HapkidoApp.prototype.deleteUser = function(id) {
        const usr = this.data.users.find(u => u.id === id);
        if (!usr) return;

        if (usr.username === 'admin') {
            alert('No puedes eliminar la cuenta del Administrador principal.');
            return;
        }

        if (confirm(`¿Está seguro de que desea eliminar la cuenta del usuario "${usr.username}"?`)) {
            this.data.users = this.data.users.filter(u => u.id !== id);
            this.saveData();
            this.renderUsersList();
        }
    }

    // ==========================================================================
    // STATE ASSOCIATIONS (NIVEL 2) CRUD & TAB SWITCHING
    // ==========================================================================


HapkidoApp.prototype.onUserAthleteChange = function() {
        const athleteId = document.getElementById('user-athlete-select').value;
        if (!athleteId) return;

        const athlete = this.data.athletes.find(a => a.id === athleteId);
        if (!athlete) return;

        // Autofill name, school, rank/belt from the selected athlete
        const nameInput = document.getElementById('user-fullname');
        if (nameInput) nameInput.value = athlete.name;

        const schoolSelect = document.getElementById('user-school');
        if (schoolSelect) schoolSelect.value = athlete.school || '';

        const rankInput = document.getElementById('user-rank');
        if (rankInput) rankInput.value = athlete.belt || '';
    }



