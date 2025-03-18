
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