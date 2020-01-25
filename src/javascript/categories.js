(async function () {
  const list = document.querySelector('.categories-list');
  const bgContainer = ['#D70060', '#E54028', '#F18D05', '#F2BC06', '#5EB11C', '#3A7634', '#0ABEBE', '#00A1CB', '#115793']
  let data = await getData('browse/categories');
  data.categories.items.forEach((category, i) => {
    let clone = document.getElementById('category').content.cloneNode(true);
    clone.querySelector(`.categories-list__button`).style.backgroundColor = bgContainer[i % bgContainer.length];
    clone.querySelector(".categories-list__heading").textContent = category.name;
    clone.querySelector(".categories-list__item").setAttribute("data-id", category.id)
    list.append(clone)
  });

  document.querySelectorAll('.categories-list__button').forEach(btn => {
    btn.addEventListener('click', (btn) => {
      btn.target.parentNode.querySelector('.categories-genre-list').classList.toggle('categories-genre-list_active')
    })
  })

  const genreList = document.querySelectorAll('.categories-genre-list');
  for (let i = 0; i < genreList.length; i++) {
    let data = await myFetch.get(`browse/categories/${genreList[i].parentNode.getAttribute('data-id')}/playlists`);

    if (!data.error)
      data.playlists.items.forEach(item => {
        let clone = document.getElementById('playlist').content.cloneNode(true);
        clone.querySelector('.categories-genre-list__heading').textContent = item.name;
        clone.querySelector('.categories-genre-list__link').href = `/playlist?id=${item.id}`;
        genreList[i].append(clone);
      })
  }
})();