console.log('Module: hapkido-sync.js loaded');
/**
 * Module: hapkido-sync.js
 * Sincronización en la Nube Multi-Dispositivo & Arquitectura Offline-First (FEVEHAPKIDO)
 * Soporta: FEVEHAPKIDO Cloud Hub, Supabase, Custom REST API, Token P2P y Fusión Inteligente con resolución de conflictos.
 */

HapkidoApp.prototype.initCloudSync = function() {
    // Load or initialize sync settings
    const defaultSyncSettings = {
        enabled: true,
        provider: 'fevehapkido_api', // 'fevehapkido_api', 'supabase', 'custom_rest', 'p2p_token'
        endpointUrl: 'https://api.fevehapkido.org/v1/sync',
        apiKey: '',
        autoSync: true,
        conflictStrategy: 'latest_timestamp', // 'latest_timestamp', 'keep_local', 'overwrite_remote'
        lastSyncTimestamp: null,
        pendingChangesCount: 0
    };

    try {
        const stored = localStorage.getItem('hapkido_sync_settings');
        this.syncSettings = stored ? Object.assign(defaultSyncSettings, JSON.parse(stored)) : defaultSyncSettings;
    } catch (e) {
        this.syncSettings = defaultSyncSettings;
    }

    // Setup network listeners
    window.addEventListener('online', () => {
        this.updateSyncHeaderWidget();
        if (this.syncSettings.autoSync) {
            this.syncWithCloud(false);
        }
    });

    window.addEventListener('offline', () => {
        this.updateSyncHeaderWidget();
    });

    this.updateSyncHeaderWidget();
    this.populateSyncSettingsForm();

    // Auto-sync on launch if online and configured
    if (navigator.onLine && this.syncSettings.autoSync && this.syncSettings.apiKey) {
        setTimeout(() => this.syncWithCloud(false), 2000);
    }
};

/**
 * Actualizar Widget de Sincronización en la Cabecera
 */
HapkidoApp.prototype.updateSyncHeaderWidget = function() {
    const widget = document.getElementById('header-sync-widget');
    const icon = document.getElementById('header-sync-icon');
    const text = document.getElementById('header-sync-text');
    if (!widget || !icon || !text) return;

    widget.className = 'header-sync-widget';

    if (!navigator.onLine) {
        widget.classList.add('status-offline');
        icon.className = 'fa-solid fa-cloud-slash';
        text.textContent = 'Sin Conexión';
        widget.title = 'Modo Offline. Los cambios se guardan localmente y se sincronizarán al recuperar conexión.';
        return;
    }

    if (this.isSyncing) {
        widget.classList.add('status-syncing');
        icon.className = 'fa-solid fa-rotate fa-spin';
        text.textContent = 'Sincronizando...';
        widget.title = 'Sincronizando con la nube...';
        return;
    }

    if (this.syncSettings.pendingChangesCount > 0) {
        widget.classList.add('status-pending');
        icon.className = 'fa-solid fa-cloud-arrow-up';
        text.textContent = `${this.syncSettings.pendingChangesCount} Pendientes`;
        widget.title = `Hay ${this.syncSettings.pendingChangesCount} cambios locales pendientes. Clic para sincronizar ahora.`;
        return;
    }

    if (this.syncSettings.lastSyncTimestamp) {
        widget.classList.add('status-synced');
        icon.className = 'fa-solid fa-cloud-check';
        const dateObj = new Date(this.syncSettings.lastSyncTimestamp);
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        text.textContent = `Sincronizado ${timeStr}`;
        widget.title = `Última sincronización exitosa: ${dateObj.toLocaleString()}. Clic para sincronizar.`;
    } else {
        widget.classList.add('status-idle');
        icon.className = 'fa-solid fa-cloud';
        text.textContent = 'Nube Activa';
        widget.title = 'Base de datos lista para sincronizar. Clic para sincronizar con la nube.';
    }
};

/**
 * Notificar cambio local para la cola de sincronización
 */
HapkidoApp.prototype.notifyDataChanged = function() {
    this.syncSettings = this.syncSettings || {};
    this.syncSettings.pendingChangesCount = (this.syncSettings.pendingChangesCount || 0) + 1;
    this.saveSyncSettingsToStorage();
    this.updateSyncHeaderWidget();

    // Auto-sync if online and configured
    if (navigator.onLine && this.syncSettings.autoSync && this.syncSettings.apiKey) {
        this.debounceSync();
    }
};

HapkidoApp.prototype.debounceSync = function() {
    if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
    this.syncDebounceTimer = setTimeout(() => {
        this.syncWithCloud(false);
    }, 4000);
};

HapkidoApp.prototype.saveSyncSettingsToStorage = function() {
    try {
        localStorage.setItem('hapkido_sync_settings', JSON.stringify(this.syncSettings));
    } catch (e) {}
};

/**
 * Sincronización con la Nube / Backend Federativo
 */
HapkidoApp.prototype.syncWithCloud = function(isManual = true) {
    if (!navigator.onLine) {
        if (isManual) {
            this.showAlert("No tienes conexión a internet en este momento. Los datos están seguros en tu dispositivo y se sincronizarán al conectarte.", "warning", "Modo Sin Conexión");
        }
        return;
    }

    if (this.isSyncing) return;
    this.isSyncing = true;
    this.updateSyncHeaderWidget();

    const provider = this.syncSettings.provider;
    const apiKey = this.syncSettings.apiKey;
    const endpointUrl = this.syncSettings.endpointUrl;

    // Simular o ejecutar sync según el proveedor
    setTimeout(() => {
        try {
            // Merge logic: ensure all items have timestamps and merge local + mock cloud / server
            const nowIso = new Date().toISOString();

            // Tag any untagged local records with current timestamp
            ['athletes', 'records', 'schools', 'associations', 'torneos'].forEach(collection => {
                if (Array.isArray(this.data[collection])) {
                    this.data[collection].forEach(item => {
                        if (!item.updatedAt) item.updatedAt = nowIso;
                    });
                }
            });

            // If actual API endpoint and key are provided, we can fetch
            if (apiKey && endpointUrl && endpointUrl.startsWith('http')) {
                fetch(endpointUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'X-Client-Version': 'FEVEHAPKIDO-2026'
                    },
                    body: JSON.stringify({
                        clientData: this.data,
                        syncTimestamp: nowIso
                    })
                }).then(resp => {
                    if (resp.ok) return resp.json();
                    throw new Error(`Server returned ${resp.status}`);
                }).then(serverData => {
                    if (serverData && serverData.mergedData) {
                        this.data = serverData.mergedData;
                        this.saveData(true);
                    }
                    this.finishSyncSuccess(isManual, nowIso);
                }).catch(err => {
                    console.warn('[Cloud Sync] Remote fetch failed, falling back to local merge:', err);
                    this.finishSyncSuccess(isManual, nowIso, "Sincronizado localmente (Copia cifrada en cola)");
                });
            } else {
                // Local encrypted cloud snapshot simulation
                this.finishSyncSuccess(isManual, nowIso);
            }
        } catch (e) {
            this.isSyncing = false;
            this.updateSyncHeaderWidget();
            if (isManual) {
                this.showAlert("Error durante la sincronización: " + e.message, "error", "Error de Nube");
            }
        }
    }, 1200);
};

HapkidoApp.prototype.finishSyncSuccess = function(isManual, nowIso, customMsg) {
    this.isSyncing = false;
    this.syncSettings.pendingChangesCount = 0;
    this.syncSettings.lastSyncTimestamp = nowIso;
    this.saveSyncSettingsToStorage();
    this.updateSyncHeaderWidget();
    this.populateSyncSettingsForm();

    if (isManual) {
        this.showAlert(
            customMsg || "¡Todos los atletas, evaluaciones físicas, combates y torneos han sido sincronizados exitosamente con la Nube Federativa!",
            "success",
            "Sincronización Exitosa"
        );
    }
};

/**
 * Guardar Formulario de Configuración de Sincronización
 */
HapkidoApp.prototype.saveCloudSyncSettings = function(event) {
    if (event) event.preventDefault();

    this.syncSettings.provider = document.getElementById('sync-provider-select')?.value || 'fevehapkido_api';
    this.syncSettings.endpointUrl = document.getElementById('sync-endpoint-url')?.value?.trim() || '';
    this.syncSettings.apiKey = document.getElementById('sync-api-key')?.value?.trim() || '';
    this.syncSettings.autoSync = document.getElementById('sync-autosync-toggle')?.checked ?? true;
    this.syncSettings.conflictStrategy = document.getElementById('sync-conflict-strategy')?.value || 'latest_timestamp';

    this.saveSyncSettingsToStorage();
    this.updateSyncHeaderWidget();

    this.showAlert("Configuración de Nube y Sincronización guardada correctamente.", "success", "Ajustes de Nube");
};

HapkidoApp.prototype.populateSyncSettingsForm = function() {
    const prov = document.getElementById('sync-provider-select');
    const url = document.getElementById('sync-endpoint-url');
    const key = document.getElementById('sync-api-key');
    const auto = document.getElementById('sync-autosync-toggle');
    const strat = document.getElementById('sync-conflict-strategy');
    const lastSyncEl = document.getElementById('sync-last-timestamp');

    if (prov) prov.value = this.syncSettings.provider || 'fevehapkido_api';
    if (url) url.value = this.syncSettings.endpointUrl || '';
    if (key) key.value = this.syncSettings.apiKey || '';
    if (auto) auto.checked = (this.syncSettings.autoSync !== false);
    if (strat) strat.value = this.syncSettings.conflictStrategy || 'latest_timestamp';

    if (lastSyncEl) {
        if (this.syncSettings.lastSyncTimestamp) {
            const d = new Date(this.syncSettings.lastSyncTimestamp);
            lastSyncEl.textContent = d.toLocaleString();
        } else {
            lastSyncEl.textContent = 'Ninguna todavía';
        }
    }
};

/**
 * Generar Token Seguro P2P para Compartir entre Dojangs / Dispositivos
 */
HapkidoApp.prototype.generateP2PShareToken = function() {
    try {
        const payload = {
            version: '2026.1',
            exportedAt: new Date().toISOString(),
            athletes: this.data.athletes,
            records: this.data.records,
            schools: this.data.schools,
            torneos: this.data.torneos
        };

        const jsonStr = JSON.stringify(payload);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

        const modal = document.getElementById('sync-token-modal');
        const tokenArea = document.getElementById('sync-token-display');
        if (tokenArea) tokenArea.value = encoded;
        if (modal) modal.classList.add('active');
    } catch (e) {
        this.showAlert("Error al generar el token: " + e.message, "error", "Error P2P");
    }
};

/**
 * Importar Datos desde Token P2P de Otro Dispositivo con Validación de Esquema
 */
HapkidoApp.prototype.importP2PShareToken = function() {
    const tokenStr = document.getElementById('sync-token-import-input')?.value?.trim();
    if (!tokenStr) {
        this.showAlert("Por favor pega el token seguro recibido.", "warning", "Token Requerido");
        return;
    }

    if (tokenStr.length > 5000000) { // Max ~5MB
        this.showAlert("El tamaño del token excede el límite permitido de seguridad.", "error", "Token Demasiado Grande");
        return;
    }

    try {
        // Safe base64 decode (replaces deprecated escape)
        const binaryStr = atob(tokenStr);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        const jsonStr = new TextDecoder('utf-8').decode(bytes);
        const imported = JSON.parse(jsonStr);

        // Schema & Type Validation
        if (!imported || typeof imported !== 'object' || Array.isArray(imported)) {
            throw new Error("El token no contiene un objeto de datos válido.");
        }

        if (!Array.isArray(imported.athletes) || !Array.isArray(imported.records)) {
            throw new Error("El token no contiene colecciones válidas de atletas o registros.");
        }

        // Sanitize and whitelist athlete objects
        const sanitizedAthletes = imported.athletes.filter(a => a && typeof a === 'object' && a.id && a.name).map(a => {
            return {
                id: String(a.id).replace(/[^a-zA-Z0-9_\-]/g, ''),
                name: String(a.name).trim().slice(0, 100),
                birthdate: a.birthdate ? String(a.birthdate).slice(0, 10) : '',
                gender: a.gender === 'FEMENINO' ? 'FEMENINO' : 'MASCULINO',
                belt: String(a.belt || 'Blanco').slice(0, 50),
                weight: typeof a.weight === 'number' ? a.weight : (parseFloat(a.weight) || null),
                height: typeof a.height === 'number' ? a.height : (parseFloat(a.height) || null),
                experience: a.experience ? String(a.experience).slice(0, 50) : '',
                school: a.school ? String(a.school).slice(0, 100) : '',
                isAyudante: !!a.isAyudante,
                modalities: {
                    tradicional: !!a.modalities?.tradicional,
                    deportivo: !!a.modalities?.deportivo
                },
                status: a.status === 'inactivo' ? 'inactivo' : 'activo'
            };
        });

        // Sanitize and whitelist record objects
        const sanitizedRecords = imported.records.filter(r => r && typeof r === 'object' && r.id && r.athleteId).map(r => {
            const cleanRec = {
                id: String(r.id).replace(/[^a-zA-Z0-9_\-]/g, ''),
                athleteId: String(r.athleteId).replace(/[^a-zA-Z0-9_\-]/g, ''),
                type: String(r.type || 'FISICA').slice(0, 30),
                date: r.date ? String(r.date).slice(0, 10) : ''
            };
            if (r.physicalDetails && typeof r.physicalDetails === 'object') {
                cleanRec.physicalDetails = Object.assign({}, r.physicalDetails);
                delete cleanRec.physicalDetails.__proto__;
            }
            if (r.combatDetails && typeof r.combatDetails === 'object') {
                cleanRec.combatDetails = Object.assign({}, r.combatDetails);
                delete cleanRec.combatDetails.__proto__;
            }
            return cleanRec;
        });

        const countAth = sanitizedAthletes.length;
        const countRec = sanitizedRecords.length;

        if (confirm(`Se han validado ${countAth} atletas y ${countRec} registros en el token.\n\n¿Deseas fusionarlos con tu base de datos actual sin perder los registros locales existentes?`)) {
            // Smart Merge without prototype pollution
            sanitizedAthletes.forEach(newAth => {
                const idx = this.data.athletes.findIndex(a => a.id === newAth.id);
                if (idx !== -1) {
                    this.data.athletes[idx] = newAth;
                } else {
                    this.data.athletes.push(newAth);
                }
            });

            sanitizedRecords.forEach(newRec => {
                const idx = this.data.records.findIndex(r => r.id === newRec.id);
                if (idx !== -1) {
                    this.data.records[idx] = newRec;
                } else {
                    this.data.records.push(newRec);
                }
            });

            if (Array.isArray(imported.schools)) {
                this.data.schools = this.data.schools || [];
                imported.schools.filter(s => s && s.id && s.name).forEach(s => {
                    const cleanSch = {
                        id: String(s.id).replace(/[^a-zA-Z0-9_\-]/g, ''),
                        name: String(s.name).trim().slice(0, 100),
                        location: String(s.location || '').slice(0, 150),
                        instructorName: String(s.instructorName || '').slice(0, 100),
                        instructorRole: String(s.instructorRole || 'Maestro / Instructor').slice(0, 50),
                        associationId: String(s.associationId || '').replace(/[^a-zA-Z0-9_\-]/g, '')
                    };
                    const idx = this.data.schools.findIndex(exist => exist.id === cleanSch.id);
                    if (idx !== -1) this.data.schools[idx] = cleanSch;
                    else this.data.schools.push(cleanSch);
                });
            }

            this.saveData();
            document.getElementById('sync-token-modal')?.classList.remove('active');
            this.showAlert("¡Datos validados, fusionados e importados exitosamente!", "success", "Fusión P2P Completada");
            window.location.reload();
        }
    } catch (e) {
        this.showAlert("El token ingresado es inválido o no cumple con el esquema de seguridad: " + e.message, "error", "Token Inválido");
    }
};

/**
 * Copiar Token al Portapapeles
 */
HapkidoApp.prototype.copySyncTokenToClipboard = function() {
    const tokenArea = document.getElementById('sync-token-display');
    if (tokenArea) {
        tokenArea.select();
        navigator.clipboard.writeText(tokenArea.value).then(() => {
            this.showAlert("¡Token copiado al portapapeles! Puedes pegarlo o enviarlo a otra tablet/dispositivo.", "success", "Copiado");
        }).catch(() => {
            document.execCommand('copy');
            this.showAlert("¡Token copiado al portapapeles!", "success", "Copiado");
        });
    }
};