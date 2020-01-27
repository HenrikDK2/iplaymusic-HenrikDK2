(async function () {
  const list = document.querySelector('.featured-list');
  let data = await getData('browse/featured-playlists');
  data.playlists.items.forEach((playlist, i) => {
    let clone = document.getElementById('feedTemplate').content.cloneNode(true);
    let img = clone.querySelector('.featured-list__img');
    clone.querySelector('a').setAttribute('href', `/playlist?id=${playlist.id}`);
    img.setAttribute('data-imgSrc', playlist.images[0].url)
    clone.querySelector('.featured-list__heading').textContent = playlist.name;
    list.append(clone)
    observer.observe(img);
  });
})();