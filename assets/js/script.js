const list = document.querySelectorAll(".list");
function activeLink() {
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}
list.forEach((item) => item.addEventListener("click", activeLink));

const slider = document.querySelector(".slider");

var sectionIndex = 0;

document.querySelectorAll(".navigation li").forEach(function (indicator, ind) {
  indicator.addEventListener("click", function () {
    slider.style.transform = "translate(" + ind * -20 + "%)";
    slider.style.transition = "0.5s";
  });
});
