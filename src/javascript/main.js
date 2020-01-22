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
let id;
let artistId;
let getToken = true;

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
    } else {
        return myFetch.get('browse/featured-playlists?limit=1').then(res => {
            if (res.error) {
                getToken = true;
                token();
            }
        })
    }
}

function conditions(array, listSelector, templateID, list) {
    if (templateID) {

        let clone = document.getElementById(templateID).content.cloneNode(true);
        if (clone.querySelector(`${listSelector}__heading`)) {
            clone.querySelector(`${listSelector}__heading`).textContent = array.name;
        }

        if (array.images && clone.querySelector(`img`)) {
            clone.querySelector(`img`).setAttribute("imgSrc", array.images[0].url);
        } else if (array.images && array.type !== "artist" && array.type !== "album") {
            document.querySelector(listSelector).style.background = "url(" + array.images[0].url + ")";
        }
        if (clone.querySelector(`${listSelector}__songs-amount`)) {
            clone.querySelector(`${listSelector}__songs-amount`).textContent = array.total_tracks + " Songs";;
        }

        if (clone.querySelector(`${listSelector}__length`) && array.duration_ms) {
            clone.querySelector(`${listSelector}__length`).textContent = (array.duration_ms / 60000).toFixed(2);
        }

        if (clone.querySelector(`${listSelector}__artist`) && array.artists) {
            clone.querySelector(`${listSelector}__artist`).textContent = array.artists[0].name;
        }

        if (clone.querySelector(`${listSelector}__item`)) {
            if (array.genres && array.type === "artist") {
                array.genres.forEach((genre, i) => {
                    if (i < 1) {
                        clone.querySelector(`${listSelector}__item`).textContent = genre;
                    } else {
                        let cloneItem = clone.querySelector(`${listSelector}__item`).cloneNode();
                        cloneItem.textContent = genre;
                        clone.append(cloneItem)
                    }

                })
            }
        }
        list.append(clone);
    }

    if (array.images && document.querySelector(listSelector).src) {
        document.querySelector(listSelector).src = array.images[0].url;
    }

    if (array.artists) {
        artistId = array.artists[0].id;
    }

    if (array.id) {
        id = array.id
    }
}

async function main(api, apiData, listSelector, templateID, observeSelector, callback) {
    await token();
    myFetch.get(api).then(res => {
        console.log(res)
        let list = document.querySelector(listSelector);
        if (res[apiData]) {
            res[apiData].items.forEach(array => {
                conditions(array, listSelector, templateID, list);
            });
        } else if (res.items) {
            res.items.forEach(array => {
                conditions(array, listSelector, templateID, list);
            });
        } else {
            conditions(res, listSelector, templateID, list);
        }
    }).then(() => {
        if (observeSelector && observeSelector !== "") {
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
    main("search?q=a&type=album", "albums", ".featured-album-list", "featuredAlbums", "img", () => {
/*         homemadeSwiper('.featured-album-list', ".featured-album-list__img")
 */    });
} else if (document.title === "Album Details") {
    main("search?q=a&type=album&limit=1", "albums", ".album-details", "featuredAlbum", "img", () => {
        main(`albums/${id}/tracks?limit=50`, "", ".song-list", "track", "", () => {
            main(`artists/${artistId}`, "", ".genre-list", "genre", "");
        })
    })
} else if (document.title === "Categories") {
    main("browse/categories", "categories", ".categories-list", "category", "", () => {
        document.querySelectorAll('.categories-list__button').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.parentElement.querySelector('.categories-genre-list').classList.toggle('categories-genre-list_active')
            })
        })
    })
} else if (document.title === "Playlist") {
    main("search?q=a&type=album", "albums", ".playlist-list", "playlist", "img", () => {
        main(`albums/${id}/tracks?limit=50`, "", ".playlist-songs-list", "track", "")
    });
} else if (document.title === "Player") {
    main("search?q=a&type=artist&limit=1", "artists", ".profile__img", "", "")
}
