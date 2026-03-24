document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, triggering fetch...');
    fetch('/api/ping')
        .then(response => response.json())
        .then(data => console.log('API Response:', data))
        .catch(err => console.error('Fetch error:', err));
});