
document.addEventListener('DOMContentLoaded', function () {
    const userDropdown = document.getElementById('userDropdown');
    const userIcon = document.getElementById('userIcon');

    userDropdown.addEventListener('show.bs.dropdown', function () {
        // userIcon.classList.remove('bg-light');
        userIcon.classList.add('bg-warning');
    });

    userDropdown.addEventListener('hide.bs.dropdown', function () {
        userIcon.classList.remove('bg-warning');
        // userIcon.classList.add('bg-light');
    });
});

document.getElementById("toggleSearch").addEventListener("click", function () {
    let form = document.getElementById("searchForm");
    form.classList.toggle("d-none");
  });
  
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".navbar-toggler-icon").addEventListener("click", function () {
      let logo = document.querySelector(".navbar-brand");
      logo.style.position = "absolute";
      logo.style.top = "5.5px"; // Added px unit
      logo.style.left = "50%";
      logo.style.transform = "translateX(-50%)";
    });
  });