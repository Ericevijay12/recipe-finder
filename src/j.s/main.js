import { initializeAuth, login, signup, logout } from './auth.js';
import { initSearch } from './search.js';
import { showView, toggleModal } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const views = {
        search: document.querySelector('section:first-child'),
        results: document.getElementById('search-results')
    };

    const modals = {
        login: document.getElementById('login-modal'),
        signup: document.getElementById('signup-modal')
    };

    // Initialize Firebase Auth
    initializeAuth();

    // Show Signup Modal on First Visit
    if (!sessionStorage.getItem('signupModalShown')) {
        toggleModal(modals.signup, true);
        sessionStorage.setItem('signupModalShown', 'true');
    }

    // Navigation
    document.getElementById('get-started-btn').addEventListener('click', () => showView(views.search));
    document.getElementById('popular-recipes-btn').addEventListener('click', () => {
        showView(views.results);
        // Placeholder for popular recipes
    });

    // Auth Events
    document.getElementById('login-btn').addEventListener('click', () => toggleModal(modals.login, true));
    document.getElementById('signup-btn').addEventListener('click', () => toggleModal(modals.signup, true));
    document.getElementById('login-submit').addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        login(email, password).then(() => toggleModal(modals.login, false));
    });
    document.getElementById('signup-submit').addEventListener('click', () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        signup(email, password).then(() => toggleModal(modals.signup, false));
    });
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Close Modals
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Close button clicked'); // Debugging
            toggleModal(modals.signup, false); // Directly target signup modal
            toggleModal(modals.login, false);  // Also ensure login modal is closed
        });
    });

    // Keyboard Accessibility
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            console.log('Escape key pressed'); // Debugging
            toggleModal(modals.signup, false);
            toggleModal(modals.login, false);
        }
    });

    // Initialize Search
    initSearch();
});