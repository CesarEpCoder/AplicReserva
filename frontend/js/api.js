const API_BASE = '/api';

async function fetchGET(url) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE + url, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
}

async function fetchPOST(url, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE + url, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || 'Error en la petición');
    }

    return responseData;
}

async function fetchPUT(url, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE + url, {
        method: 'PUT',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || 'Error en la petición');
    }

    return responseData;
}

async function fetchDELETE(url) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE + url, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
}

// Para formularios con archivos
async function fetchPOSTFormData(url, formData) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE + url, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
}

// Para formularios con archivos (PUT)
async function fetchPUTFormData(url, formData) {
    const token = localStorage.getItem('token');
    
    console.log('🔵 === INICIANDO fetchPUTFormData ===');
    console.log('🔵 URL:', API_BASE + url);
    console.log('🔵 Método: PUT');
    
    const response = await fetch(API_BASE + url, {
        method: 'PUT',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
    });

    console.log('🟡 Status:', response.status);
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
}