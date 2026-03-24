
function hydrate() {
    const btn = document.getElementById('add-to-cart');
    const productName = document.querySelector('h2').innerText;
    
    if (btn) {
        btn.onclick = () => {
            alert(`Interaction works! ${productName} added to cart.`);
        };
        console.log('Hydration complete: Click handler attached.');
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
} else {
    hydrate();
}
