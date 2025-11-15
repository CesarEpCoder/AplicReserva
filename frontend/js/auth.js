// Funciones de autenticación
function saveToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function isLoggedIn() {
    return !!getToken();
}

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        return null;
    }
}

function getUserRole() {
    const token = getToken();
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded ? decoded.rol : null;
}

function logout() {
    removeToken();
    window.location.href = '../auth/login.html';
}

// Verificar autenticación al cargar páginas
function checkAuth(requiredRole = null) {
    if (!isLoggedIn()) {
        window.location.href = '../auth/login.html';
        return false;
    }

    if (requiredRole) {
        const userRole = getUserRole();
        if (userRole !== requiredRole) {
            window.location.href = '../auth/login.html';
            return false;
        }
    }

    return true;
}
