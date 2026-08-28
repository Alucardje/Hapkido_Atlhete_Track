console.log('Module: hapkido-data.js loaded');
/**
 * Module: hapkido-data.js
 * Part of Hapkido Athlete Measurement SPA
 */

HapkidoApp.prototype.loadData = function() {
        const defaultData = { 
            athletes: [
                {
                    id: "ath_carlos_gomez",
                    name: "Carlos Gómez",
                    birthdate: "2008-04-15",
                    gender: "MASCULINO",
                    belt: "Azul",
                    weight: 83.0,
                    height: 171,
                    experience: "3 años",
                    school: "Dojang Tigres",
                    isAyudante: true,
                    modalities: { tradicional: true, deportivo: true }
                },
                {
                    id: "ath_maria_rodriguez",
                    name: "María Rodríguez",
                    birthdate: "2009-09-22",
                    gender: "FEMENINO",
                    belt: "Rojo",
                    weight: 54.0,
                    height: 162,
                    experience: "4 años",
                    school: "Academia Hapkido Sur",
                    isAyudante: false,
                    modalities: { tradicional: false, deportivo: true }
                },
                {
                    id: "ath_jorge_silva",
                    name: "Jorge Silva",
                    birthdate: "1995-07-30",
                    gender: "MASCULINO",
                    belt: "Negro 1er Dan",
                    weight: 82.5,
                    height: 178,
                    experience: "12 años",
                    school: "Dojang Tigres",
                    isAyudante: false,
                    modalities: { tradicional: true, deportivo: false }
                }
            ],
            records: [
                {
                    id: "rec_1",
                    athleteId: "ath_carlos_gomez",
                    type: "FISICA",
                    date: "2026-05-10",
                    physicalDetails: {
                        pulseP1: 70, pulseP2: 120, pulseP3: 60,
                        ruffierIndex: 5.0, ruffierLevel: "Bueno",
                        pushups: 45, situps: 42, flexibility: 12, cooper: 2000,
                        jumpLong: 1.8, jumpHigh: null, scoreFiguresSin: 7.5, scoreFiguresCon: null, scoreDemo: null,
                        // New metrics
                        height: 171,
                        weight: 83.0,
                        waist: 92,
                        fat: 22.5,
                        jumpVertical: 35,
                        agility: 3.4,
                        grip: 45,
                        split: 28,
                        scoreHyungs: 9.0,
                        scoreHosinsul: 9.2,
                        scoreWeapons: 8.0,
                        evalResults: {
                            pushups: { score: 8.6, level: "Bueno", cls: "success" },
                            situps: { score: 8.4, level: "Bueno", cls: "success" },
                            flexibility: { score: 9.2, level: "Bueno", cls: "success" },
                            cooper: { score: 6.0, level: "Medio", cls: "warning" },
                            jumpLong: { score: 7.0, level: "Bueno", cls: "success" },
                            jumpHigh: null,
                            scoreFiguresSin: { score: 7.5, level: "Bueno", cls: "success" },
                            scoreFiguresCon: null,
                            scoreDemo: null,
                            ruffier: { score: 8.0, level: "Bueno", cls: "success" },
                            // New evaluations
                            imc: 28.38,
                            imcLevel: "Sobrepeso",
                            imcClass: "warning",
                            whtr: 0.538,
                            whtrLevel: "Elevado (Alto Riesgo)",
                            whtrClass: "danger",
                            jumpVertical: { score: 6.0, level: "Medio", cls: "warning" },
                            agility: { score: 7.0, level: "Bueno", cls: "success" },
                            grip: { score: 6.0, level: "Medio", cls: "warning" },
                            split: { score: 6.4, level: "Medio", cls: "warning" },
                            hyungs: { score: 9.0, level: "Excelente", cls: "success" },
                            hosinsul: { score: 9.2, level: "Excelente", cls: "success" },
                            weapons: { score: 8.0, level: "Bueno", cls: "success" },
                            globalScore: 7.5,
                            globalLevel: "Bueno",
                            globalCls: "success"
                        }
                    }
                },
                {
                    id: "rec_2",
                    athleteId: "ath_maria_rodriguez",
                    type: "FISICA",
                    date: "2026-05-15",
                    physicalDetails: {
                        pulseP1: 68, pulseP2: 110, pulseP3: 75,
                        ruffierIndex: 5.3, ruffierLevel: "Bueno",
                        pushups: 35, situps: 40, flexibility: 22, cooper: 2400,
                        jumpLong: null, jumpHigh: 1.1, scoreFiguresSin: null, scoreFiguresCon: 8.0, scoreDemo: null,
                        // New metrics
                        height: 162,
                        weight: 54.0,
                        waist: 70,
                        fat: 18.0,
                        jumpVertical: 42,
                        agility: 2.9,
                        grip: 55,
                        split: 10,
                        scoreHyungs: 8.5,
                        scoreHosinsul: 8.0,
                        scoreWeapons: 8.8,
                        evalResults: {
                            pushups: { score: 7, level: "Bueno", cls: "success" },
                            situps: { score: 8, level: "Bueno", cls: "success" },
                            flexibility: { score: 9, level: "Excelente", cls: "success" },
                            cooper: { score: 7, level: "Bueno", cls: "success" },
                            jumpLong: null,
                            jumpHigh: { score: 8, level: "Bueno", cls: "success" },
                            scoreFiguresSin: null,
                            scoreFiguresCon: { score: 8.0, level: "Bueno", cls: "success" },
                            scoreDemo: null,
                            ruffier: { score: 7.8, level: "Bueno", cls: "success" },
                            // New evaluations
                            imc: 20.58,
                            imcLevel: "Normal",
                            imcClass: "success",
                            whtr: 0.432,
                            whtrLevel: "Bueno (Bajo Riesgo)",
                            whtrClass: "success",
                            jumpVertical: { score: 9.0, level: "Excelente", cls: "success" },
                            agility: { score: 9.5, level: "Excelente", cls: "success" },
                            grip: { score: 8.0, level: "Bueno", cls: "success" },
                            split: { score: 9.0, level: "Excelente", cls: "success" },
                            hyungs: { score: 8.5, level: "Excelente", cls: "success" },
                            hosinsul: { score: 8.0, level: "Bueno", cls: "success" },
                            weapons: { score: 8.8, level: "Excelente", cls: "success" },
                            globalScore: 8.4,
                            globalLevel: "Bueno",
                            globalCls: "success"
                        }
                    }
                }
            ],
            schools: [
                { id: "sch_1", name: "Dojang Tigres", location: "Caracas, Centro", instructorName: "Maestro 1", instructorRole: "Maestro / Instructor", associationId: "asc_1" },
                { id: "sch_2", name: "Academia Hapkido Sur", location: "Maracay, Aragua", instructorName: "Maestro 2", instructorRole: "Maestro / Instructor", associationId: "asc_2" },
                { id: "sch_3", name: "Dojang Halcones", location: "Valencia, Carabobo", instructorName: "Carlos Gómez", instructorRole: "Instructor en Entrenamiento", associationId: "asc_3" },
                { id: "sch_fed", name: "Federación Venezolana de Hapkido (Sede Central)", location: "Caracas, Distrito Capital", instructorName: "Directiva Nacional", instructorRole: "Director General", associationId: "asc_1" }
            ],
            associations: [
                { id: "asc_1", name: "Asociación del Distrito Capital", state: "Distrito Capital", federation: "Federación Venezolana de Hapkido" },
                { id: "asc_2", name: "Asociación del Estado Aragua", state: "Aragua", federation: "Federación Venezolana de Hapkido" },
                { id: "asc_3", name: "Asociación del Estado Carabobo", state: "Carabobo", federation: "Federación Venezolana de Hapkido" }
            ],
            users: [
                { id: "usr_admin", username: "admin", password: "123", role: "admin", name: "Administrador", school: null, athleteId: null, rank: "Administrador Central" },
                { id: "usr_maestro1", username: "maestro1", password: "123", role: "instructor", name: "Maestro 1", school: "Dojang Tigres", athleteId: null, rank: "Maestro 4to Dan (Sabeomnim)" },
                { id: "usr_maestro2", username: "maestro2", password: "123", role: "instructor", name: "Maestro 2", school: "Academia Hapkido Sur", athleteId: null, rank: "Maestro 2do Dan (Kyosaeonim)" },
                { id: "usr_atleta1", username: "atleta1", password: "123", role: "ayudante", name: "Carlos Gómez", school: "Dojang Tigres", athleteId: "ath_carlos_gomez" },
                { id: "usr_atleta2", username: "atleta2", password: "123", role: "athlete", name: "María Rodríguez", school: "Academia Hapkido Sur", athleteId: "ath_maria_rodriguez" }
            ],
            torneos: [
                {
                    id: "trn_1",
                    name: "Copa Confederaciones FEVEHAPKIDO 2026",
                    type: "Torneo Nacional",
                    date: "2026-08-15",
                    school: "Federación Venezolana de Hapkido (Sede Central)",
                    state: "Distrito Capital",
                    guests: "Todas las escuelas a nivel nacional",
                    referee: "Maestro Central (Jefe de Árbitros FEVEHAPKIDO)",
                    modalities: { combate: true, saltos: true, exhibicion: true },
                    notes: "Campeonato nacional clasificatorio. Se aplicará el reglamento oficial FEVEHAPKIDO 2026.",
                    status: "Aprobado"
                },
                {
                    id: "trn_2",
                    name: "Tope de Fogueo Infantil Tigres vs Halcones",
                    type: "Tope Inter-escuelas",
                    date: "2026-07-10",
                    school: "Dojang Tigres",
                    state: "Distrito Capital",
                    guests: "Dojang Halcones",
                    modalities: { combate: true, saltos: true, exhibicion: false },
                    notes: "Fogueo de categorías infantiles. Prohibido contacto pleno en rostro.",
                    status: "Aprobado"
                },
                {
                    id: "trn_3",
                    name: "I Tope de Cinturones de Color Aragua vs Carabobo",
                    type: "Tope Inter-escuelas",
                    date: "2026-07-28",
                    school: "Academia Hapkido Sur",
                    state: "Aragua",
                    guests: "Dojang Halcones",
                    modalities: { combate: true, saltos: false, exhibicion: true },
                    notes: "Fogueo enfocado en la modalidad tradicional (defensa personal y hyungs).",
                    status: "Solicitado"
                }
            ]
        };
        try {
            const json = localStorage.getItem('hapkido_athlete_tracker_data');
            if (json) {
                const parsed = JSON.parse(json);
                let changed = false;

                // Self-healing function to clean double-encoded strings in loaded local storage data
                const cleanEncodings = (obj) => {
                    let cleaned = false;
                    const clean = (val) => {
                        if (typeof val === 'string') {
                            if (val.indexOf('Ã') !== -1) {
                                try {
                                    const decoded = decodeURIComponent(escape(val));
                                    if (decoded !== val) {
                                        cleaned = true;
                                        return decoded;
                                    }
                                } catch (e) {}
                            }
                        } else if (Array.isArray(val)) {
                            for (let i = 0; i < val.length; i++) {
                                val[i] = clean(val[i]);
                            }
                        } else if (val !== null && typeof val === 'object') {
                            for (let key in val) {
                                if (val.hasOwnProperty(key)) {
                                    val[key] = clean(val[key]);
                                }
                            }
                        }
                        return val;
                    };
                    clean(obj);
                    return cleaned;
                };

                if (cleanEncodings(parsed)) {
                    changed = true;
                }
                if (!parsed.schools) {
                    parsed.schools = defaultData.schools;
                    changed = true;
                } else {
                    const fedSchool = parsed.schools.find(s => s.id === 'sch_fed');
                    if (!fedSchool) {
                        parsed.schools.push({ id: "sch_fed", name: "Federación Venezolana de Hapkido (Sede Central)", location: "Caracas, Distrito Capital", instructorName: "Directiva Nacional", instructorRole: "Director General", associationId: "asc_1" });
                        changed = true;
                    }
                }
                if (!parsed.associations) {
                    parsed.associations = defaultData.associations;
                    changed = true;
                }
                if (!parsed.users) {
                    parsed.users = defaultData.users;
                    changed = true;
                } else {
                    const adminUser = parsed.users.find(u => u.username === 'admin' || u.id === 'usr_admin');
                    if (!adminUser) {
                        parsed.users.push({ id: "usr_admin", username: "admin", password: "123", role: "admin", name: "Administrador", school: null, athleteId: null, rank: "Administrador Central" });
                        changed = true;
                    } else {
                        let innerChanged = false;
                        if (adminUser.username !== "admin") { adminUser.username = "admin"; innerChanged = true; }
                        if (adminUser.password !== "123") { adminUser.password = "123"; innerChanged = true; }
                        if (adminUser.role !== "admin") { adminUser.role = "admin"; innerChanged = true; }
                        if (!adminUser.rank) { adminUser.rank = "Administrador Central"; innerChanged = true; }
                        if (innerChanged) changed = true;
                    }
                }
                if (!parsed.torneos) {
                    parsed.torneos = defaultData.torneos;
                    changed = true;
                }
                parsed.schools.forEach(sch => {
                    if (!sch.associationId) {
                        if (sch.name === "Dojang Tigres") sch.associationId = "asc_1";
                        else if (sch.name === "Academia Hapkido Sur") sch.associationId = "asc_2";
                        else if (sch.name === "Dojang Halcones") sch.associationId = "asc_3";
                        else sch.associationId = parsed.associations[0]?.id || "asc_1";
                        changed = true;
                    }
                });
                if (changed) {
                    localStorage.setItem('hapkido_athlete_tracker_data', JSON.stringify(parsed));
                }
                return parsed;
            } else {
                localStorage.setItem('hapkido_athlete_tracker_data', JSON.stringify(defaultData));
                return defaultData;
            }
        } catch (e) {
            console.error("Error reading LocalStorage", e);
            return defaultData;
        }
    }


HapkidoApp.prototype.saveData = function() {
        try {
            localStorage.setItem('hapkido_athlete_tracker_data', JSON.stringify(this.data));
            this.updateDashboardStats();
        } catch (e) {
            alert("Error al guardar los datos localmente: " + e.message);
        }
    }

    /**
     * SPA Routing Controller
     */

HapkidoApp.prototype.exportData = function() {
        if (this.data.athletes.length === 0 && this.data.records.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        
        const timestamp = new Date().toISOString().slice(0, 10);
        downloadAnchor.setAttribute("download", `hapkido_mediciones_backup_${timestamp}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }


HapkidoApp.prototype.importData = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (imported.athletes && imported.records) {
                    if (confirm(`Se importarán ${imported.athletes.length} atletas y ${imported.records.length} registros. ¿Deseas continuar? Se sobreescribirán los datos existentes.`)) {
                        this.data = imported;
                        this.saveData();
                        alert("Datos importados con éxito.");
                        window.location.reload();
                    }
                } else {
                    alert("El archivo JSON no tiene el formato de respaldo correcto.");
                }
            } catch (err) {
                alert("Error al leer el archivo JSON: " + err.message);
            }
        };
        reader.readAsText(file);
    }


HapkidoApp.prototype.resetData = function() {
        if (confirm("¡ATENCIÓN! Se borrarán todos los atletas y registros del LocalStorage de este navegador permanentemente. Esta acción no se puede deshacer.\n\n¿Estás seguro de continuar?")) {
            localStorage.removeItem('hapkido_athlete_tracker_data');
            alert("Base de datos restablecida.");
            window.location.reload();
        }
    }

    /**
     * Módulo de Exámenes de Cinta y Currículum Técnico
     */


