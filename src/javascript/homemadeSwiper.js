
function homemadeSwiper(containerSelector, childrenImages) {
  let startMouseX, lastTranslate = 0;
  let container = document.querySelector(containerSelector);
  document.querySelectorAll(childrenImages).forEach(img => {
    img.ondragstart = function () { return false; };
  })

  container.addEventListener('mousedown', (eventDown) => {
    startMouseX = eventDown.clientX;
    if (eventDown.button === 0) {
      document.addEventListener('mouseup', (eventUp) => {
        lastTranslate = parseInt(container.style.transform.match(/\d{0,}/gm).filter(str => str !== "")[0])
        container.removeEventListener('mousemove', getMouse);
      })

      container.addEventListener('mousemove', getMouse)
    }

    function getMouse(e) {
      let value = (lastTranslate + startMouseX) - e.clientX;

      container.style.transform = "translateX(" + value + "px)";
    }
  })
}
