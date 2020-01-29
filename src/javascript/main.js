const key = btoa("bcc38354dfa04281b499fbfd781e726b" + ":" + "8283e0b92ce9494f99f4b674046016a1");
const param = new URLSearchParams(document.location.search)
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting === true) {
            if (entry.target.getAttribute("data-imgSrc")) {
                entry.target.setAttribute('src', entry.target.getAttribute('data-imgSrc'));
            }

            entry.target.onload = () => {
                if (entry.target.parentElement.querySelector('.loader')) {
                    entry.target.parentElement.querySelector('.loader').remove();
                    observer.unobserve(entry.target);
                }
            }
        }
    });
}, { rootMargin: "300px 0px" });
let getToken = true;

//After DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.nav-list__heading').textContent = document.title;
    document.querySelector('.nav-list__link').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });
})

//Initialize myFetch
async function token() {
    if (getToken === true) {
        return fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + key
            },
            body: "grant_type=client_credentials"
        }).then(res => res.json())
            .then(data => {
                myFetch.init({
                    address: "https://api.spotify.com/v1/",
                    key: "Bearer " + data.access_token
                });
                getToken = false;
            })
    }
}

async function getData(api) {
    await token();
    const data = await myFetch.get(api);
    if (!data.error) {
        return data;
    } else {
        getToken = true;
        getData(api);
    }
}