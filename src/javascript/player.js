(async function () {
  const track = await getData(`tracks/${param.get('id')}`);
  document.querySelector('.player-menu__title').textContent = track.name;
  document.querySelector('.player-menu__artist').textContent = track.artists[0].name;
  document.querySelector('.progress__song-time').textContent = (track.duration_ms / 60000).toFixed(2).replace(".", ":");


  const artist = await getData(`artists/${track.artists[0].id}`)
  document.querySelector('.profile__img').src = artist.images[1].url;
  document.querySelector('.player-section').style.background = `no-repeat url(${track.album.images[0].url}) center top / cover`
})();