console.log('Module: hapkido-init.js loaded');
/**
 * Module: hapkido-init.js
 * Final bootstrap script to instantiate the HapkidoApp SPA
 */

const requiredMethods = [
    'loadData', 'saveData', 'login', 'logout', 'updateUserSessionHeader',
    'validateUserPrivilege', 'renderUsersList', 'renderAthletesList',
    'populateAthleteDropdowns', 'updateOpponentDropdown', 'startCombatScoring',
    'updateScoreboardUI', 'updatePhysicalFormLabels', 'calculateLiveBodyFat',
    'savePhysicalTest', 'evaluatePhysicalMetrics', 'generatePhysicalReportHTML',
    'renderPhysicalProfileChart', 'loadBeltExam', 'saveBeltExam',
    'initVocabulary', 'switchManualTab', 'renderManualVocabulary',
    'filterManualVocab', 'populateAthleteSchoolsDropdown', 'renderSchoolsList',
    'renderAssociationsList', 'renderTorneosList'
];

requiredMethods.forEach(m => {
    if (typeof HapkidoApp.prototype[m] !== 'function') {
        console.error('MISSING PROTOTYPE METHOD:', m);
    }
});

window.app = new HapkidoApp();

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

