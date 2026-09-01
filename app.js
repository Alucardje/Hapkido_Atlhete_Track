console.log('Module: app.js loaded');
/**
 * MEDICIÓN DEL ATLETA DE HAPKIDO - CORE LOGIC
 * FEVEHAPKIDO 2026 Regulations Compliance
 */

class HapkidoApp {
    constructor() {
        this.currentUser = null;
        this.data = this.loadData();
        this.currentAthleteId = null;
        
        // Active Combat State
        this.activeCombat = null;
        this.combatTimer = null;
        this.timerSeconds = 0;
        this.isTimerRunning = false;
        
        // Chart instances
        this.charts = {};

        // Load vocabulary
        this.initVocabulary();

        this.init();
    }

    /**
     * Initialize the Application
     */

    init() {
        // Setup current date in header
        const dateSpan = document.getElementById('current-date');
        if (dateSpan) {
            const today = new Date();
            dateSpan.textContent = today.toLocaleDateString('es-VE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Load user session from persistent localStorage
        const sessionUser = localStorage.getItem('hapkido_current_user');
        if (sessionUser) {
            this.currentUser = JSON.parse(sessionUser);
            document.body.className = 'role-' + this.currentUser.role;
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.remove('active');
        } else {
            this.currentUser = null;
            document.body.className = '';
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.add('active');
        }
        this.updateUserSessionHeader();

        // SPA Navigation Routing
        window.addEventListener('hashchange', () => this.handleRouting());
        this.handleRouting();

        // Event Listeners setup
        this.setupEventListeners();

        // Restore sidebar collapsed state from localStorage
        this.restoreSidebarState();
        
        // Load initial lists
        this.updateDashboardStats();
        this.renderAthletesList();
        this.populateAthleteDropdowns();
        this.populateManualBeltsDropdown();
        this.renderSchoolsList();
        this.renderTorneosList();
    }

    /**
     * LocalStorage Operations
     */

    handleRouting() {
        // Enforce login overlay if not logged in
        if (!this.currentUser) {
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.add('active');
            document.body.className = '';
            return;
        }

        const hash = window.location.hash || '#dashboard';

        // RBAC Access Control & Redirects
        if (this.currentUser.role === 'athlete') {
            const allowedHashes = ['#dashboard', '#historial', '#manual', '#torneos'];
            if (!allowedHashes.includes(hash)) {
                this.navigateTo('#dashboard');
                return;
            }
        } else if (this.currentUser.role === 'instructor' || this.currentUser.role === 'ayudante') {
            const forbiddenHashes = ['#ajustes', '#escuelas', '#usuarios'];
            if (forbiddenHashes.includes(hash)) {
                this.navigateTo('#dashboard');
                return;
            }
        }

        const sectionId = 'section-' + hash.substring(1);
        
        // Hide all sections
        document.querySelectorAll('.app-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show active section
        const activeSec = document.getElementById(sectionId);
        if (activeSec) {
            activeSec.classList.add('active');
        }

        // Update Nav Menu Highlight and Groups Expansion
        document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNav = document.getElementById('nav-' + hash.substring(1));
        if (activeNav) {
            activeNav.classList.add('active');
            
            // Auto-expand parent group if this is a sub-item
            const parentGroup = activeNav.closest('.nav-group');
            if (parentGroup) {
                parentGroup.classList.add('open');
            }
        }
        
        // Collapse other groups that don't contain the active item
        document.querySelectorAll('.nav-group').forEach(g => {
            if (activeNav && g.contains(activeNav)) {
                // Keep open
            } else {
                g.classList.remove('open');
            }
        });

        // Update Page Title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const titles = {
                '#dashboard': 'Dashboard de Rendimiento',
                '#atletas': 'Gestión de Atletas',
                '#combate': 'Planilla de Puntuación de Combate',
                '#fisica': 'Ficha Cardiovascular y Pruebas Técnicas',
                '#examenes': 'Exámenes de Cinta y Currículum Técnico',
                '#historial': 'Historial de Rendimiento y Gráficos',
                '#manual': 'Manual de Estudio y Reglamento Oficial 2026',
                '#torneos': 'Calendario de Torneos y Topes',
                '#ajustes': 'Respaldos y Configuración',
                '#escuelas': 'Gestión de Escuelas y Dojangs',
                '#usuarios': 'Gestión de Cuentas de Usuario'
            };
            pageTitle.textContent = titles[hash] || 'Dashboard';
        }

        // Route specific logic
        if (hash === '#torneos') {
            this.renderTorneosList();
        }

        if (hash === '#dashboard') {
            if (this.currentUser.role === 'athlete') {
                this.renderAthleteDashboard();
            } else {
                this.updateDashboardStats();
            }
        }

        if (hash === '#atletas') {
            this.renderAthletesList();
        }

        if (hash === '#examenes') {
            this.renderExamHistoryTable();
            this.populateAthleteDropdowns();
        }

        if (hash === '#manual') {
            this.populateManualBeltsDropdown();
            this.renderManualVocabulary();
        }

        if (hash === '#escuelas' && this.currentUser.role === 'admin') {
            this.switchSchoolSubTab('schools');
        }

        if (hash === '#usuarios' && this.currentUser.role === 'admin') {
            this.renderUsersList();
        }

        if (hash === '#historial') {
            if (this.currentUser.role === 'athlete') {
                setTimeout(() => {
                    this.loadAthleteAnalysis(this.currentUser.athleteId);
                }, 50);
            } else {
                this.populateAthleteDropdowns();
            }
        }

        // Reset timer if leaving combat screen
        if (hash !== '#combate' && this.isTimerRunning) {
            this.pauseTimer();
        }

        // Auto-close sidebar on mobile after navigation
        this.closeSidebarMobile();
    }


    navigateTo(hash) {
        window.location.hash = hash;
    }

    /**
     * Sidebar Responsive Controls (Unified Desktop Collapse & Mobile Drawer)
     */

    toggleSidebar() {
        if (window.innerWidth > 992) {
            this.toggleDesktopCollapse();
        } else {
            const sidebar = document.querySelector('.sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');
            const btn = document.getElementById('menu-toggle-btn');
            if (!sidebar) return;
            const isOpen = sidebar.classList.toggle('mobile-open');
            if (backdrop) backdrop.classList.toggle('active', isOpen);
            if (btn) btn.classList.toggle('active', isOpen);
        }
    }

    closeSidebarMobile() {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        const btn = document.getElementById('menu-toggle-btn');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
        if (btn) btn.classList.remove('active');
    }

    toggleDesktopCollapse() {
        const container = document.querySelector('.app-container');
        if (!container) return;
        const isCollapsed = container.classList.toggle('sidebar-collapsed');
        localStorage.setItem('hapkido_sidebar_collapsed', isCollapsed ? '1' : '0');
        
        const collapseBtnIcon = document.querySelector('#desktop-collapse-btn i');
        if (collapseBtnIcon) {
            collapseBtnIcon.className = isCollapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left';
        }

        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        if (menuToggleBtn) {
            menuToggleBtn.classList.toggle('active', isCollapsed);
        }
    }

    restoreSidebarState() {
        const collapsed = localStorage.getItem('hapkido_sidebar_collapsed') === '1';
        if (collapsed && window.innerWidth > 992) {
            const container = document.querySelector('.app-container');
            if (container) container.classList.add('sidebar-collapsed');
            const collapseBtnIcon = document.querySelector('#desktop-collapse-btn i');
            if (collapseBtnIcon) collapseBtnIcon.className = 'fa-solid fa-angles-right';
            const menuToggleBtn = document.getElementById('menu-toggle-btn');
            if (menuToggleBtn) menuToggleBtn.classList.add('active');
        }
    }

    /**
     * Dashboard Statistics
     */

    updateDashboardStats() {
        if (!this.currentUser) return;

        let athletes = this.data.athletes;
        let records = this.data.records;

        if (this.currentUser.role !== 'admin') {
            athletes = this.data.athletes.filter(a => a.school === this.currentUser.school);
            const athleteIds = new Set(athletes.map(a => a.id));
            records = this.data.records.filter(r => athleteIds.has(r.athleteId));
        }

        const total = athletes.length;
        const deportivo = athletes.filter(a => a.modalities && a.modalities.deportivo).length;
        const tradicional = athletes.filter(a => a.modalities && a.modalities.tradicional).length;
        const mediciones = records.length;

        const totalEl = document.getElementById('stat-total-atletas');
        if (totalEl) totalEl.textContent = total;
        const depEl = document.getElementById('stat-atletas-deportivo');
        if (depEl) depEl.textContent = deportivo;
        const tradEl = document.getElementById('stat-atletas-tradicional');
        if (tradEl) tradEl.textContent = tradicional;
        const medEl = document.getElementById('stat-total-mediciones');
        if (medEl) medEl.textContent = mediciones;

        // Render recent athletes list on dashboard
        const recentList = document.getElementById('recent-athletes-list');
        if (recentList) {
            recentList.innerHTML = '';
            if (athletes.length === 0) {
                recentList.innerHTML = '<li class="empty-list">No hay atletas registrados en esta escuela. ¡Registra uno en la pestaña Atletas!</li>';
                return;
            }

            const sorted = [...athletes].reverse().slice(0, 5);
            sorted.forEach(ath => {
                const li = document.createElement('li');
                li.className = 'recent-item';
                
                let modBadge = '';
                if (ath.modalities && ath.modalities.tradicional && ath.modalities.deportivo) {
                    modBadge = '<span class="recent-badge ambas">Ambas</span>';
                } else if (ath.modalities && ath.modalities.deportivo) {
                    modBadge = '<span class="recent-badge deportivo">Deportivo</span>';
                } else {
                    modBadge = '<span class="recent-badge tradicional">Defensa Personal</span>';
                }

                const cat = this.calculateAgeCategory(ath.birthdate);
                
                li.innerHTML = `
                    <div class="recent-info">
                        <h4>${ath.name}</h4>
                        <p>${cat} • Grado: ${ath.belt} • Peso: ${ath.weight ? ath.weight + ' kg' : 'Sin registrar'}</p>
                    </div>
                    ${modBadge}
                `;
                recentList.appendChild(li);
            });
        }

        // Render athletes requiring attention
        this.renderAthletesAttentionList(athletes);
    }

    renderAthletesAttentionList(athletes) {
        const container = document.getElementById('athletes-attention-list');
        if (!container) return;

        const withAlerts = athletes
            .filter(a => a.status !== 'inactivo')
            .map(a => ({ athlete: a, alerts: this.getAthleteAlerts(a) }))
            .filter(x => x.alerts.length > 0);

        const card = document.getElementById('athletes-attention-card');
        if (!card) return;

        if (withAlerts.length === 0) {
            card.style.display = 'none';
            return;
        }

        card.style.display = 'block';
        container.innerHTML = '';

        withAlerts.forEach(({ athlete, alerts }) => {
            const colorMap = { danger: '#ef4444', warning: '#f59e0b', info: '#38bdf8' };
            const topAlert = alerts[0];
            const color = colorMap[topAlert.type] || '#f59e0b';

            const item = document.createElement('div');
            item.style.cssText = 'display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-color);';
            item.innerHTML = `
                <i class="fa-solid ${topAlert.icon}" style="color:${color}; font-size:18px; margin-top:2px; flex-shrink:0;"></i>
                <div>
                    <strong style="color:var(--text-primary);">${athlete.name}</strong>
                    <span style="color:var(--text-muted); font-size:12px; margin-left:8px;">${athlete.belt} · ${athlete.school || ''}</span>
                    <ul style="margin:4px 0 0 0; padding-left:16px; font-size:12px; color:var(--text-muted);">
                        ${alerts.map(a => `<li>${a.message}</li>`).join('')}
                    </ul>
                </div>
            `;
            container.appendChild(item);
        });
    }

    /**
     * Calculate Age Category & Weight Division according to FEVEHAPKIDO 2026 rules
     */

    setupEventListeners() {
        const modal = document.getElementById('athlete-modal');
        const btnNew = document.getElementById('btn-new-athlete');
        const btnClose = document.getElementById('close-athlete-modal');
        const btnCancel = document.getElementById('btn-cancel-athlete');
        const formAthlete = document.getElementById('athlete-form');

        if (btnNew && modal) btnNew.onclick = () => this.openNewAthleteModal();
        if (btnClose && modal) btnClose.onclick = () => modal.classList.remove('active');
        if (btnCancel && modal) btnCancel.onclick = () => modal.classList.remove('active');

        if (formAthlete) {
            formAthlete.onsubmit = (e) => {
                e.preventDefault();
                this.saveAthlete();
            };
        }

        const beltSelect = document.getElementById('athlete-belt');
        if (beltSelect) {
            beltSelect.onchange = () => {
                const belt = beltSelect.value;
                const ayudanteGroup = document.getElementById('ayudante-group');
                const BELT_ORDER = ["Blanco", "Amarillo", "Naranja", "Verde", "Azul", "Morado", "Rojo", "Marrón", "Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan", "Negro 4to Dan", "Negro 5to Dan", "Negro 6to Dan", "Negro 7mo Dan", "Negro 8vo Dan", "Negro 9no Dan"];
                
                const isEligible = BELT_ORDER.indexOf(belt) >= BELT_ORDER.indexOf("Verde");
                if (ayudanteGroup) {
                    ayudanteGroup.style.display = isEligible ? 'flex' : 'none';
                    if (!isEligible) {
                        document.getElementById('athlete-is-ayudante').checked = false;
                    }
                }

                // Update experience level automatically based on belt
                const expSelect = document.getElementById('athlete-experience');
                if (expSelect) {
                    if (["Blanco", "Amarillo", "Naranja", "Verde"].includes(belt)) {
                        expSelect.value = "PRINCIPIANTE";
                    } else if (["Azul", "Morado", "Rojo", "Marrón"].includes(belt)) {
                        expSelect.value = "INTERMEDIO";
                    } else if (["Negro 1er Dan", "Negro 2do Dan", "Negro 3er Dan"].includes(belt)) {
                        expSelect.value = "AVANZADO";
                    } else if (belt.startsWith("Negro")) {
                        expSelect.value = "MASTER";
                    }
                }
            };
        }

        // Inscription athlete selection change
        const inscripcionSelect = document.getElementById('inscripcion-athlete-select');
        if (inscripcionSelect) {
            inscripcionSelect.onchange = (e) => this.handleInscripcionAthleteChange(e);
        }

        // Belt Exam selection actions
        const examSelect = document.getElementById('exam-athlete-select');
        const btnLoadExam = document.getElementById('btn-load-exam');
        if (examSelect && btnLoadExam) {
            examSelect.onchange = () => {
                btnLoadExam.disabled = !examSelect.value;
            };
            btnLoadExam.onclick = () => this.loadBeltExam();
        }

        // Belt Exam form submit
        const examForm = document.getElementById('belt-exam-form');
        if (examForm) {
            examForm.onsubmit = (e) => {
                e.preventDefault();
                this.saveBeltExam();
            };
        }

        // Toggle test blocks in physical tests form based on selected athlete's competitive categories
        const physSelect = document.getElementById('physical-athlete-select');
        if (physSelect) {
            physSelect.onchange = (e) => {
                const athleteId = e.target.value;
                const depBlock = document.getElementById('deportivo-tests-block');
                
                if (!athleteId) {
                    depBlock.style.display = 'none';
                    this.updatePhysicalFormLabels(false);
                    return;
                }

                const athlete = this.data.athletes.find(a => a.id === athleteId);
                if (athlete) {
                    // Autofill height and weight
                    document.getElementById('fit-height').value = athlete.height || '';
                    document.getElementById('fit-weight').value = athlete.weight || '';
                    this.calculateLiveBodyFat();

                    const isInf = this.calculateAge(athlete.birthdate) < 12;
                    this.updatePhysicalFormLabels(isInf);

                    if (athlete.modalities && athlete.modalities.deportivo) {
                        depBlock.style.display = 'block';
                        document.getElementById('group-jump-long').style.display = 'block';
                        document.getElementById('group-jump-high').style.display = 'block';
                        document.getElementById('group-score-figures-sin').style.display = 'block';
                        document.getElementById('group-score-figures-con').style.display = 'block';
                        document.getElementById('group-score-demo').style.display = 'block';
                    } else {
                        depBlock.style.display = 'none';
                    }
                }
            };
        }

        // Pulse inputs live index calculation
        const p1 = document.getElementById('pulse-p1');
        const p2 = document.getElementById('pulse-p2');
        const p3 = document.getElementById('pulse-p3');
        const calcRuffier = () => {
            const val1 = parseInt(p1.value);
            const val2 = parseInt(p2.value);
            const val3 = parseInt(p3.value);
            
            if (val1 && val2 && val3) {
                const ruffier = ((val1 + val2 + val3) - 200) / 10;
                document.getElementById('ruffier-index-val').textContent = ruffier.toFixed(1);
                
                const badge = document.getElementById('ruffier-level-badge');
                badge.className = 'badge';
                
                if (ruffier <= 0) {
                    badge.textContent = "Excelente (Alto Nivel)";
                    badge.classList.add('success');
                } else if (ruffier <= 5) {
                    badge.textContent = "Bueno";
                    badge.classList.add('success');
                } else if (ruffier <= 10) {
                    badge.textContent = "Medio";
                    badge.classList.add('warning');
                } else if (ruffier <= 15) {
                    badge.textContent = "Insuficiente";
                    badge.classList.add('danger');
                } else {
                    badge.textContent = "Malo / Peligroso";
                    badge.classList.add('danger');
                }
            }
        };

        if (p1) p1.oninput = calcRuffier;
        if (p2) p2.oninput = calcRuffier;
        if (p3) p3.oninput = calcRuffier;

        // Body fat live calculation
        const fitHeight = document.getElementById('fit-height');
        const fitWeight = document.getElementById('fit-weight');
        const fitWaist = document.getElementById('fit-waist');
        const fitSkinfoldTri = document.getElementById('fit-skinfold-tri');
        const fitSkinfoldAbd = document.getElementById('fit-skinfold-abd');
        const calcFat = () => this.calculateLiveBodyFat();

        if (fitHeight) fitHeight.oninput = calcFat;
        if (fitWeight) fitWeight.oninput = calcFat;
        if (fitWaist) fitWaist.oninput = calcFat;
        if (fitSkinfoldTri) fitSkinfoldTri.oninput = calcFat;
        if (fitSkinfoldAbd) fitSkinfoldAbd.oninput = calcFat;

        // Physical Test Form submit
        const physicalForm = document.getElementById('physical-test-form');
        if (physicalForm) {
            physicalForm.onsubmit = (e) => {
                e.preventDefault();
                this.savePhysicalTest();
            };
        }

        // Combat start setup
        const combSelect = document.getElementById('combate-athlete-select');
        const opponentSelect = document.getElementById('combate-opponent-select');
        const btnStartFight = document.getElementById('btn-start-scoring');
        
        const checkStartFightButton = () => {
            if (combSelect && opponentSelect && btnStartFight) {
                btnStartFight.disabled = !(combSelect.value && opponentSelect.value);
            }
        };

        if (combSelect && opponentSelect) {
            combSelect.onchange = () => {
                this.updateOpponentDropdown(combSelect.value);
                checkStartFightButton();
            };
            opponentSelect.onchange = () => {
                checkStartFightButton();
            };
        }
        if (btnStartFight) {
            btnStartFight.onclick = () => this.startCombatScoring();
        }

        // Timer actions
        const btnPlay = document.getElementById('btn-timer-play');
        const btnReset = document.getElementById('btn-timer-reset');
        if (btnPlay) btnPlay.onclick = () => this.toggleTimer();
        if (btnReset) btnReset.onclick = () => this.resetTimer();

        // Round navigation buttons
        const btnPrevRound = document.getElementById('btn-score-prev-round');
        const btnNextRound = document.getElementById('btn-score-next-round');
        const btnEndFight = document.getElementById('btn-score-end-fight');

        if (btnPrevRound) btnPrevRound.onclick = () => this.changeRound(-1);
        if (btnNextRound) btnNextRound.onclick = () => this.changeRound(1);
        if (btnEndFight) btnEndFight.onclick = () => this.finishCombat();

        // Analysis Dropdown Selection
        const analysisSelect = document.getElementById('analysis-athlete-select');
        if (analysisSelect) {
            analysisSelect.onchange = (e) => {
                this.loadAthleteAnalysis(e.target.value);
            };
        }

        // Close nav groups when clicking outside (especially on mobile/tablets)
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-group')) {
                if (window.innerWidth <= 1024) {
                    document.querySelectorAll('.nav-group').forEach(g => {
                        g.classList.remove('open');
                    });
                }
            }
        });

        // Android Back Button / Escape key handling for Sidebar & Modals
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close sidebar first if open on mobile
                const sidebar = document.querySelector('.sidebar.mobile-open');
                if (sidebar) {
                    this.closeSidebarMobile();
                    return;
                }
                const activeOverlay = document.querySelector('.app-modal-overlay.active, .modal.active');
                if (activeOverlay && activeOverlay.id !== 'login-overlay') {
                    activeOverlay.classList.remove('active');
                }
            }
        });

        window.addEventListener('popstate', () => {
            const activeModal = document.querySelector('.app-modal-overlay.active, .modal.active');
            if (activeModal && activeModal.id !== 'login-overlay') {
                activeModal.classList.remove('active');
            }
        });
    }

    toggleNavGroup(groupId) {
        const group = document.getElementById(groupId);
        if (!group) return;
        
        const isOpen = group.classList.contains('open');
        
        // Collapse all other groups (accordion style)
        document.querySelectorAll('.nav-group').forEach(g => {
            g.classList.remove('open');
        });
        
        if (!isOpen) {
            group.classList.add('open');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UNIVERSAL MODAL SYSTEM (Replaces blocking alert/confirm)
    // ═══════════════════════════════════════════════════════════════════════════
    showAlert(message, type = 'info', title = null) {
        return new Promise(resolve => {
            const overlay = document.getElementById('app-modal-overlay');
            const iconWrap = document.getElementById('app-modal-icon');
            const titleEl = document.getElementById('app-modal-title');
            const bodyEl = document.getElementById('app-modal-body');
            const cancelBtn = document.getElementById('app-modal-cancel-btn');
            const confirmBtn = document.getElementById('app-modal-confirm-btn');

            if (!overlay) {
                console.log(message);
                resolve();
                return;
            }

            // Detect type from content if default
            if (type === 'info') {
                if (/éxito|aprobado|exitosamente|guardad/i.test(message)) type = 'success';
                else if (/error|falló|incorrect/i.test(message)) type = 'error';
                else if (/atención|aviso|advertencia|obligatorio|requerid/i.test(message)) type = 'warning';
            }

            iconWrap.className = 'app-modal-icon type-' + type;
            const icons = {
                info: '<i class="fa-solid fa-circle-info"></i>',
                success: '<i class="fa-solid fa-circle-check"></i>',
                warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
                error: '<i class="fa-solid fa-circle-xmark"></i>',
                question: '<i class="fa-solid fa-circle-question"></i>'
            };
            iconWrap.innerHTML = icons[type] || icons.info;

            const defaultTitles = {
                info: 'Información',
                success: 'Operación Exitosa',
                warning: 'Atención',
                error: 'Error',
                question: 'Confirmación'
            };
            titleEl.textContent = title || defaultTitles[type] || 'Mensaje';
            if (message && message.includes('<') && message.includes('>')) {
                bodyEl.innerHTML = message;
            } else {
                bodyEl.textContent = message;
            }

            cancelBtn.style.display = 'none';
            confirmBtn.textContent = 'Entendido';

            const handleConfirm = () => {
                overlay.classList.remove('active');
                confirmBtn.removeEventListener('click', handleConfirm);
                resolve();
            };

            confirmBtn.addEventListener('click', handleConfirm);
            overlay.classList.add('active');
        });
    }

    showConfirm(message, title = '¿Estás seguro?', type = 'question') {
        return new Promise(resolve => {
            const overlay = document.getElementById('app-modal-overlay');
            const iconWrap = document.getElementById('app-modal-icon');
            const titleEl = document.getElementById('app-modal-title');
            const bodyEl = document.getElementById('app-modal-body');
            const cancelBtn = document.getElementById('app-modal-cancel-btn');
            const confirmBtn = document.getElementById('app-modal-confirm-btn');

            if (!overlay) {
                resolve(true);
                return;
            }

            iconWrap.className = 'app-modal-icon type-' + type;
            iconWrap.innerHTML = '<i class="fa-solid fa-circle-question"></i>';

            titleEl.textContent = title;
            bodyEl.textContent = message;

            cancelBtn.style.display = 'inline-flex';
            cancelBtn.textContent = 'Cancelar';
            confirmBtn.textContent = 'Aceptar';

            const cleanup = () => {
                overlay.classList.remove('active');
                confirmBtn.removeEventListener('click', onConfirm);
                cancelBtn.removeEventListener('click', onCancel);
            };

            const onConfirm = () => {
                cleanup();
                resolve(true);
            };

            const onCancel = () => {
                cleanup();
                resolve(false);
            };

            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
            overlay.classList.add('active');
        });
    }

}

// Global hook to route standard alerts to the App Modal
window.alert = function(msg) {
    if (window.app && typeof window.app.showAlert === 'function') {
        window.app.showAlert(msg);
    } else {
        console.log('[ALERT]', msg);
    }
};
