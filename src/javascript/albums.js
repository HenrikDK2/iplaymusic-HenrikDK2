(async function () {
  const list = document.querySelector('.featured-album-list');
  let data = await getData('search?q=a&type=album');
  console.log(data)
  data.albums.items.forEach((album, i) => {
    let clone = document.getElementById('featuredAlbums').content.cloneNode(true);
    let img = clone.querySelector('img');
    clone.querySelector('a').href = `/album-details?id=${album.id}`;
    img.setAttribute('data-imgSrc', album.images[0].url)
    list.append(clone)
    observer.observe(img);
  });

  //Gallery
  new Flickity(list, {
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    pageDots: false
  });

  //Keyframe animation for Featured Albums
  const style = document.createElement('style');
  let items = list.querySelectorAll('.featured-album-list__item');
  const lastItem = document.querySelectorAll('.featured-album-list__item')[items.length - 1]
  let leftProcent = lastItem.style.left;
  style.innerHTML += `@keyframes slideThroughAlbum {
      0%   {
          transform: translateX(-${leftProcent});
      }
      100% {
          transform: translateX(-2%);
      }
  }`;

  document.querySelector('head').append(style);

  const newReleases = await getData(`browse/new-releases`);
  let listRelease = document.querySelector(`.releases-list`);
  newReleases.albums.items.forEach(album => {
    let clone = document.getElementById('newRelease').content.cloneNode(true);
    let img = clone.querySelector('img');
    img.setAttribute('data-imgSrc', album.images[0].url)
    clone.querySelector('.releases-list__heading').textContent = album.name;
    clone.querySelector('.releases-list__artist').textContent = album.artists[0].name;
    listRelease.append(clone)
    observer.observe(img);

  })
})();