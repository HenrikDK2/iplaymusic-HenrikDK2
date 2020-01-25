(async function () {
  const list = document.querySelector('.playlist-list');
  let indexCounter = -1;
  let initIndex;
  let categories = await getData('browse/categories');

  for (let i = 0, category = categories.categories.items; i < category.length; i++) {
    let playlist = await getData(`browse/categories/${category[i].id}/playlists`);
    if (!playlist.error) {
      playlist.playlists.items.forEach(playlist => {
        let clone = document.getElementById('playlist').content.cloneNode(true);
        let img = clone.querySelector('.playlist-list__img');
        indexCounter++;
        img.setAttribute('data-imgSrc', playlist.images[0].url)
        clone.querySelector('.playlist-list__item').setAttribute('data-id', playlist.id)
        clone.querySelector('.playlist-list__item').setAttribute('data-name', playlist.name)
        clone.querySelector('.playlist-list__item').setAttribute('data-amount', playlist.tracks.total)
        if (clone.querySelector('.playlist-list__item').getAttribute('data-id') === param.get('id')) {
          if (initIndex === undefined) {
            initIndex = indexCounter;
          }
        }
        list.append(clone);
        observer.observe(img);
      });
    }
  }

  new Flickity(list, {
    cellAlign: 'center',
    contain: true,
    wrapAround: true,
    prevNextButtons: false,
    initialIndex: initIndex,
    pageDots: false,
    on: {
      ready: function () {
        resetList(0);
      },
      change: function (index) {
        resetList(index)
      }
    }
  });
})();

async function resetList(i) {
  const playlistName = document.querySelectorAll(".playlist-list__item")[i].getAttribute('data-name');
  const playlistAmount = document.querySelectorAll(".playlist-list__item")[i].getAttribute('data-amount');
  const playlistid = document.querySelectorAll(".playlist-list__item")[i].getAttribute('data-id');
  const data = await getData(`playlists/${playlistid}/tracks`);
  const list = document.querySelector('.playlist-songs-list');
  list.innerHTML = "";
  document.querySelector('.playlist-songs__songs').textContent = playlistName;
  document.querySelector('.playlist-songs__top-songs').textContent = "Top " + playlistAmount + " Songs";
  data.items.forEach(track => {
    if (track.track) {
      console.log(track.track)
      let clone = document.getElementById('track').content.cloneNode(true);
      clone.querySelector('a').href = `/player?id=${track.track.id}`;
      clone.querySelector('.playlist-songs-list__length').textContent = (track.track.duration_ms / 60000).toFixed(2).replace(".", ":");
      clone.querySelector('.playlist-songs-list__heading').textContent = track.track.name;
      clone.querySelector('.playlist-songs-list__artist').textContent = track.track.artists[0].name;
      list.append(clone)
    }
  })
}