console.log('Module: hapkido-init.js loaded');
/**
 * Module: hapkido-init.js
 * Final bootstrap script to instantiate the HapkidoApp SPA
 */

const requiredMethods = [
    // Core (app.js)
    'loadData', 'saveData', 'login', 'logout', 'updateUserSessionHeader',
    'escapeHTML', 'navigateTo', 'toggleSidebar', 'closeSidebarMobile',
    'toggleDesktopCollapse', 'restoreSidebarState', 'toggleNavGroup',
    'showAlert', 'showConfirm', 'showToast',
    'updateBodyClasses', 'initOperatingMode', 'toggleOperatingMode', 'applyOperatingModeUI',
    'updateDashboardStats', 'handleRouting',
    // Auth (hapkido-auth.js)
    'validateUserPrivilege', 'renderUsersList',
    // Athletes (hapkido-athletes.js)
    'renderAthletesList', 'populateAthleteDropdowns', 'openNewAthleteModal',
    'saveAthlete', 'deleteAthlete', 'calculateAge', 'calculateAgeCategory',
    'getWeightDivision', 'getAthleteAlerts', 'viewAthleteHistory',
    // Combat (hapkido-combate.js)
    'updateOpponentDropdown', 'startCombatScoring', 'updateScoreboardUI',
    'addScore', 'addPenalty', 'removeScore', 'removePenalty',
    'changeRound', 'finishCombat', 'toggleTimer', 'resetTimer',
    // Physical (hapkido-physical.js)
    'updatePhysicalFormLabels', 'calculateLiveBodyFat',
    'savePhysicalTest', 'evaluatePhysicalMetrics', 'generatePhysicalReportHTML',
    'renderPhysicalProfileChart', 'openPrintSheetModal', 'showIndividualSheetModal', 'printFieldSheet',
    'exportRecordsToCSV',
    // Exams (hapkido-exams.js)
    'loadBeltExam', 'saveBeltExam', 'renderExamHistoryTable',
    // Schools (hapkido-schools.js)
    'renderSchoolsList', 'renderAssociationsList', 'populateAthleteSchoolsDropdown',
    // Torneos (hapkido-torneos.js)
    'renderTorneosList',
    // Vocab (hapkido-vocab.js)
    'initVocabulary', 'switchManualTab', 'renderManualVocabulary', 'filterManualVocab',
    // Timer (hapkido-timer.js)
    'initTatamiTimer',
    // Athletes export
    'exportAthletesToCSV',
    // History (hapkido-athletes.js or hapkido-physical.js)
    'loadAthleteAnalysis', 'populateManualBeltsDropdown',
    'renderAthleteDashboard'
];

requiredMethods.forEach(m => {
    if (typeof HapkidoApp.prototype[m] !== 'function') {
        console.error('MISSING PROTOTYPE METHOD:', m);
    }
});

window.app = new HapkidoApp();
if (window.app.initCloudSync) {
    window.app.initCloudSync();
}

// Register Service Worker for PWA 100% Offline Capability with auto-update
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
                // Check for updates on every page load
                reg.update();
            })
            .catch(err => console.warn('[PWA] ServiceWorker registration failed:', err));
    });
}

