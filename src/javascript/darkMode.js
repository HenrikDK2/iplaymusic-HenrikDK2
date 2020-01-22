const navItems = Array.from(document.getElementsByClassName('nav-list__item'));
const footerButtons = Array.from(document.getElementsByClassName('footer-nav-list__item'));
let isDark = false;

//Initial
if (localStorage.getItem('isDark') !== null) {
    isDark = JSON.parse(localStorage.getItem('isDark'));
}
if (isDark === true) { changeTheme(); }
footerButtons.forEach(btn => {
    btn.addEventListener("click", footerNav);
});

//Functions
function footerNav(e) {
    footerButtons.forEach(btn => {
        btn.querySelector("path").classList.remove('path-light-select', 'path-dark-select')
    });

    if (isDark === false) {
        e.currentTarget.querySelector('path').classList.add('path-light-select')
    } else if (isDark === true) {
        e.currentTarget.querySelector("path").classList.add('path-dark-select')
    }

    if (footerButtons[3] === e.currentTarget) {
        e.currentTarget.querySelector("path").classList.remove('path-light-select', 'path-dark-select')
        if (isDark === false) {
            e.currentTarget.querySelector("path").classList.add('path-dark-select')
            isDark = true
        } else if (isDark === true) {
            e.currentTarget.querySelector("path").classList.add('path-light-select')
            isDark = false;
        }
        changeTheme();
    }
}

function changeTheme() {
    document.querySelector('.footer-nav').classList.toggle('dark-theme-alt')
    document.querySelector('body').classList.toggle('dark-theme-pri')
    navItems[0].querySelector('path').classList.toggle('dark-theme-icon-font');
    navItems[2].querySelector('path').classList.toggle('dark-theme-icon-font');
    document.querySelectorAll('p, h3, h2, h1, h4, h5, h6').forEach(tag => {
        tag.classList.toggle('dark-theme-icon-font')
    })  

    localStorage.setItem('isDark', isDark);
}   