let id;
const clientId = "bcc38354dfa04281b499fbfd781e726b";
const clientSecret = "8283e0b92ce9494f99f4b674046016a1";
const key = btoa(clientId + ":" + clientSecret);
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting === true) {
            if (entry.target.getAttribute("imgSrc")) {
                entry.target.setAttribute('src', entry.target.getAttribute('imgSrc'));
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

function token() {
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
        })
}

function test() {
    myFetch.get('browse/featured-playlists?limit=1').then(res => {
        if (res.error && res.error.status >= 400) {
            token();
        }
    })
}

async function main(api, apiData, listSelector, templateID, observeSelector, callback) {
    await token();
    await test();
    myFetch.get(api).then(res => {
        let list = document.querySelector(listSelector);
        if (res[apiData]) {
            res[apiData].items.forEach(array => {
                console.log(array)
                let clone = document.getElementById(templateID).content.cloneNode(true);
                if (clone.querySelector(`${listSelector}__heading`)) {
                    clone.querySelector(`${listSelector}__heading`).textContent = array.name;
                }

                if (array.images && clone.querySelector(`${listSelector}__img`)) {
                    clone.querySelector(`${listSelector}__img`).setAttribute("imgSrc", array.images[0].url);
                } else {
                    document.querySelector(listSelector).style.background = "url(" + array.images[0].url + ")";
                }

                if (clone.querySelector(`${listSelector}__songs-amount`)) {
                    clone.querySelector(`${listSelector}__songs-amount`).textContent = array.total_tracks + " Songs";;
                }

                if (clone.querySelector(`${listSelector}__length`)) {
                    clone.querySelector(`${listSelector}__length`).textContent = (array.duration_ms/60000).toFixed(2);
                }

                if (clone.querySelector(`${listSelector}__artist`)) {
                    clone.querySelector(`${listSelector}__artist`).textContent = array.artists[0].name;
                }
                id = array.id
                list.append(clone)
            });
        } else {
            res.items.forEach(array => {
                console.log(array)
                let clone = document.getElementById(templateID).content.cloneNode(true);
                if (clone.querySelector(`${listSelector}__heading`)) {
                    clone.querySelector(`${listSelector}__heading`).textContent = array.name;
                }

                if (array.images && clone.querySelector(`${listSelector}__img`)) {
                    clone.querySelector(`${listSelector}__img`).setAttribute("imgSrc", array.images[0].url);
                } else if (array.images) {
                    document.querySelector(listSelector).style.background = "url(" + array.images[0].url + ")";
                }

                if (clone.querySelector(`${listSelector}__length`)) {
                    clone.querySelector(`${listSelector}__length`).textContent = (array.duration_ms/60000).toFixed(2);
                }

                if (clone.querySelector(`${listSelector}__songs-amount`)) {
                    clone.querySelector(`${listSelector}__songs-amount`).textContent = array.total_tracks + " Songs";;
                }

                if (clone.querySelector(`${listSelector}__artist`)) {
                    clone.querySelector(`${listSelector}__artist`).textContent = array.artists[0].name;
                }
                id = array.id
                list.append(clone)
            });
        }
    }).then(() => {
        if (observeSelector) {
            new Promise((res, reject) => {
                res(
                    document.querySelectorAll(observeSelector).forEach(elm => {
                        observer.observe(elm);
                    })
                );
            })
        }

        if (callback) {
            callback();
        }
    })
}

if (document.title === "Featured") {
    main("browse/featured-playlists", "playlists", ".featured-list", "feedTemplate", "img");
} else if (document.title === "Albums") {
    main("browse/new-releases?country=DK&offset=0&limit=30", "albums", ".releases-list", "newRelease", "img");
    main("search?q=a&type=album", "albums", ".featured-album-list", "featuredAlbums", "img");
} else if (document.title === "Album Details") {
    main("search?q=a&type=album&limit=1", "albums", ".album-details", "featuredAlbum", "img", () => {
        main(`albums/${id}/tracks?limit=50`, "", ".song-list", "track")
    })
}
