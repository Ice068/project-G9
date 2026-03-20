function showDining(){
    document.getElementById("menuTitle").innerText = "Dining";
    document.getElementById("menuContent").innerHTML = `
        <div class="menu-item"><span>Fish & Chips</span><span>150 บาท</span></div>
        <div class="menu-item"><span>Grilled Salmon</span><span>225 บาท</span></div>
        <div class="menu-item"><span>Tom Yum</span><span>100 บาท</span></div>
        <div class="menu-item"><span>Truffle Steak</span><span>290 บาท</span></div>
    `;

    // active button
    document.querySelector('.btn-dining').classList.add('active');
    document.querySelector('.btn-bar').classList.remove('active');
}

function showBar(){
    document.getElementById("menuTitle").innerText = "The Bar";
    document.getElementById("menuContent").innerHTML = `
        <div class="menu-item"><span>Classic Martini</span><span>120 บาท</span></div>
        <div class="menu-item"><span>Whiskey Sour</span><span>140 บาท</span></div>
        <div class="menu-item"><span>Mojito</span><span>130 บาท</span></div>
        <div class="menu-item"><span>Signature Cocktail</span><span>160 บาท</span></div>
    `;

    document.querySelector('.btn-bar').classList.add('active');
    document.querySelector('.btn-dining').classList.remove('active');
}

// initial load
showDining();

/* navbar scroll effect */
window.addEventListener("scroll", function(){
    const nav = document.querySelector(".hero-navbar");
    nav.classList.toggle("scrolled", window.scrollY > 50);
});