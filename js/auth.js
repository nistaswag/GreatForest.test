class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    register(username, email, password) {
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // In a real app, you should hash the password
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, user: newUser };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        return { success: true };
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

const auth = new Auth();

// Auth UI Component
class AuthUI {
    constructor() {
        this.auth = auth;
        this.setupEventListeners();
        this.updateAuthUI();
    }

    setupEventListeners() {
        // Toggle auth modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-auth-toggle]')) {
                this.toggleAuthModal();
            }
            if (e.target.matches('[data-close-auth]')) {
                this.closeAuthModal();
            }
            if (e.target.matches('[data-logout]')) {
                this.handleLogout();
            }
        });

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    toggleAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            const activeForm = this.auth.isAuthenticated() ? 'profile' : 'login';
            this.showAuthForm(activeForm);
            modal.classList.toggle('active');
            document.body.style.overflow = modal.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showAuthForm(formName) {
        const forms = document.querySelectorAll('.auth-form');
        const tabs = document.querySelectorAll('.auth-tab');
        
        forms.forEach(form => form.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));
        
        const form = document.getElementById(`${formName}Form`);
        const tab = document.querySelector(`.auth-tab[data-form="${formName}"]`);
        
        if (form) form.classList.add('active');
        if (tab) tab.classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const result = this.auth.login(email, password);
        
        if (result.success) {
            this.updateAuthUI();
            this.closeAuthModal();
            this.showNotification('Successfully logged in!', 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername')?.value;
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        
        if (!username || !email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const result = this.auth.register(username, email, password);
        if (result.success) {
            this.auth.login(email, password);
            this.updateAuthUI();
            this.showAuthForm('login');
            this.showNotification('Registration successful! Please log in.', 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    handleLogout() {
        this.auth.logout();
        this.updateAuthUI();
        this.showNotification('Successfully logged out!', 'success');
    }

    updateAuthUI() {
        const authLinks = document.querySelectorAll('[data-auth-links]');
        const userLinks = document.querySelectorAll('[data-user-links]');
        const userNameElements = document.querySelectorAll('.user-name');
        const userAvatar = document.getElementById('userAvatar');

        if (this.auth.isAuthenticated() && this.auth.currentUser) {
            authLinks.forEach(el => el.style.display = 'none');
            userLinks.forEach(el => el.style.display = 'block');
            
            const username = this.auth.currentUser.username;
            userNameElements.forEach(el => {
                el.textContent = username;
            });
            
            if (userAvatar) {
                userAvatar.textContent = username.charAt(0).toUpperCase();
            }
        } else {
            authLinks.forEach(el => el.style.display = 'block');
            userLinks.forEach(el => el.style.display = 'none');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const container = document.getElementById('notifications') || document.body;
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authUI = new AuthUI();
});
