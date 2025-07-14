
// JWT Auth Management
class AuthManager {
    async constructor() {
        this.token = localStorage.getItem('jwt_token');
        this.apiUrl = window.location.origin + '/api/auth';
        await this.init();
    }

    async init() {
        this.bindEvents();
        await this.checkAuthOnLoad();
    }

    bindEvents() {
        // Form switching
        document.getElementById('show-register').addEventListener('click', () => {
            this.showRegister();
        });

        document.getElementById('show-login').addEventListener('click', () => {
            this.showLogin();
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    showRegister() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        this.clearMessages();
    }

    showLogin() {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        this.clearMessages();
    }

    clearMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(msg => {
            msg.style.display = 'none';
            msg.textContent = '';
        });
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    showSuccess(elementId, message) {
        const successElement = document.getElementById(elementId);
        successElement.textContent = message;
        successElement.style.display = 'block';
    }

    setLoading(buttonId, spinnerId, textId, isLoading) {
        const button = document.getElementById(buttonId);
        const spinner = document.getElementById(spinnerId);
        const text = document.getElementById(textId);

        button.disabled = isLoading;
        spinner.style.display = isLoading ? 'block' : 'none';
        text.style.display = isLoading ? 'none' : 'block';
    }

    async handleLogin() {
        this.clearMessages();
        this.setLoading('login-btn', 'login-spinner', 'login-btn-text', true);

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('jwt_token', this.token);
                this.showSuccess('login-success', 'Login successful! Redirecting...');

                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                this.showError('login-error', data.message || 'Login failed');
            }
        } catch (error) {
            this.showError('login-error', 'Network error. Please try again.');
            console.error('Login error:', error);
        } finally {
            this.setLoading('login-btn', 'login-spinner', 'login-btn-text', false);
        }
    }

    async handleRegister() {
        this.clearMessages();
        this.setLoading('register-btn', 'register-spinner', 'register-btn-text', true);

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            this.showError('register-error', 'Passwords do not match');
            this.setLoading('register-btn', 'register-spinner', 'register-btn-text', false);
            return;
        }

        if (password.length < 6) {
            this.showError('register-error', 'Password must be at least 6 characters long');
            this.setLoading('register-btn', 'register-spinner', 'register-btn-text', false);
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.showSuccess('register-success', 'Account created successfully! Please sign in.');

                setTimeout(() => {
                    this.showLogin();
                    document.getElementById('login-email').value = email;
                }, 2000);
            } else {
                this.showError('register-error', data.message || 'Registration failed');
            }
        } catch (error) {
            this.showError('register-error', 'Network error. Please try again.');
            console.error('Registration error:', error);
        } finally {
            this.setLoading('register-btn', 'register-spinner', 'register-btn-text', false);
        }
    }

    async checkAuthOnLoad() {
        if (this.token) {
            try {
                const response = await fetch(`${this.apiUrl}/verify`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    window.location.href = '/dashboard';
                } else {
                    localStorage.removeItem('jwt_token');
                    this.token = null;
                }
            } catch (error) {
                localStorage.removeItem('jwt_token');
                this.token = null;
            }
        }
    }

    logout() {
        localStorage.removeItem('jwt_token');
        this.token = null;
        window.location.href = '/login';
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        return !!this.token;
    }
}

// Initialize Auth Manager
const authManager = await new AuthManager();

// Export for use in other scripts
window.authManager = authManager;