(async function () {
  const songs = ["/assets/music/inspired.mp3", "/assets/music/beauty.mp3", "/assets/music/damage.mp3"];
  const track = await getData(`tracks/${param.get('id')}`);
  const artist = await getData(`artists/${track.artists[0].id}`)
  const progress = document.querySelector('.progress__bar');
  let currentIndex = 0;
  let audio = new Audio(songs[0]);
  let play = true;
  document.querySelector('.player-menu__title').textContent = track.name;
  document.querySelector('.player-menu__artist').textContent = track.artists[0].name;
  document.querySelector('.profile__img').src = artist.images[1].url;
  document.querySelector('.player-section__background').src = track.album.images[0].url;

  //Play & Pause
  document.querySelector(".player-functions__play").addEventListener('click', () => {
    if (play === true) {
      audio.play();
      play = false;
    } else {
      audio.pause();
      play = true;
    }
  })

  //Skip
  document.querySelector(".player-functions__skip-backwards").addEventListener('click', skip)
  document.querySelector(".player-functions__skip-forward").addEventListener('click', skip)
  function skip(e) {
    audio.pause();
    if (e.currentTarget.getAttribute("class") === "player-functions__skip-forward") {
      currentIndex++;
      if (currentIndex > songs.length - 1) { currentIndex = 0 };
      audio = new Audio(songs[currentIndex % songs.length]);
    } else {
      currentIndex--;
      if (currentIndex < 0) { currentIndex = songs.length - 1 };
      audio = new Audio(songs[currentIndex % songs.length]);
    }
    console.log('currentSong: ' + songs[currentIndex % songs.length])
    audio.play();
  }

  //rewind
  document.querySelector(".player-functions__rewind-backwards").addEventListener('click', rewind)
  document.querySelector(".player-functions__rewind-forward").addEventListener('click', rewind)
  function rewind(e) {
    if (e.currentTarget.getAttribute("class") === "player-functions__rewind-forward") {
      audio.currentTime += 10;
    } else {
      audio.currentTime -= 10;
    }
  }

  //Drag
  document.querySelector('.progress__current').addEventListener('touchstart', (e) => {
    circleMoving = false;
    let multiply;

    document.querySelector('.progress__current').addEventListener('touchmove', (e) => {
      let touchMove = e.touches[0].clientX - 16;
      if (touchMove > progress.clientWidth) touchMove = progress.clientWidth - 1;
      if (touchMove < 0) touchMove = 0;
      let widthProcent = (touchMove / progress.clientWidth) * 100;
      if (widthProcent < 10) {
        multiply = (widthProcent / 100)
      } else multiply = parseFloat("0." + widthProcent);
      document.querySelector('.progress__current-time').textContent = formatTime((multiply * audio.duration).toFixed(0));
      document.querySelector('.progress__current').style.left = `${widthProcent}%`;
    });
    document.querySelector('.progress__current').addEventListener('touchend', (e) => {
      circleMoving = true;
      audio.currentTime = multiply * audio.duration;
    })
  })

  //Update timer
  setInterval(() => {
    document.querySelector('.progress__song-time').textContent = formatTime(audio.duration.toFixed(0));
    if (circleMoving === true) {
      const procent = (audio.currentTime / audio.duration) * 100;
      document.querySelector('.progress__current').style.left = `${procent}%`;
      document.querySelector('.progress__current-time').textContent = formatTime(audio.currentTime.toFixed(0));
    }

    if (audio.currentTime === audio.duration) {
      audio.pause();
      currentIndex++;
      audio = new Audio(songs[currentIndex % songs.length]);
      audio.play();
    }
  }, 100)


  //Format function
  function formatTime(currentTime) {
    if (currentTime < 0) currentTime = 0;
    let seconds = currentTime % 60;
    let foo = currentTime - seconds;
    let minutes = foo / 60;
    if (seconds < 10) {
      seconds = "0" + seconds.toString();
    }
    return minutes + ":" + seconds;
  }
})();
