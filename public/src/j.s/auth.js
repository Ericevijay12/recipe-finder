import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase Config (Replace with your own)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function initializeAuth() {
    onAuthStateChanged(auth, user => {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        if (user) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            // Add logout button or update UI as needed
        } else {
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
        }
    });
}

export async function login(email, password) {
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
}

export async function signup(email, password) {
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert(`Signup failed: ${error.message}`);
    }
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        alert(`Logout failed: ${error.message}`);
    }
}