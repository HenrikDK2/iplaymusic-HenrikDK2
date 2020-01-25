(async function () {
  const album = await getData(`albums/${param.get('id')}`)
  const section = document.querySelector('.album-details');
  const artist = await getData(`artists/${album.artists[0].id}`)
  if (artist.genres) {
    document.querySelector('.album-details__genre').textContent = "Genres hastags";
    artist.genres.forEach(genre => {
      let clone = document.getElementById('genre').content.cloneNode(true);
      clone.querySelector('.genre-list__item').textContent = genre;
      document.querySelector('.genre-list').append(clone)

    });
  }

  section.style.background = `no-repeat url(${album.images[0].url}) center top / cover`
  document.querySelector('.album-details__heading').textContent = album.name;
  document.querySelector('.album-details__songs-amount').textContent = album.total_tracks + " Songs";
  document.querySelector('.album-details__songs-amount').textContent = album.total_tracks + " Songs";

  const albumTracks = await getData(`albums/${param.get('id')}/tracks`);
  let listRelease = document.querySelector(`.song-list`);
  albumTracks.items.forEach(track => {
    let clone = document.getElementById('track').content.cloneNode(true);
    clone.querySelector('a').href = `/player?id=${track.id}`;
    clone.querySelector('.song-list__length').textContent = (track.duration_ms / 60000).toFixed(2).replace(".", ":");
    clone.querySelector('.song-list__heading').textContent = track.name;
    clone.querySelector('.song-list__artist').textContent = track.artists[0].name;
    listRelease.append(clone);
  })
})();