document.addEventListener("DOMContentLoaded", function () {
    const subButtons = document.querySelectorAll(".sub-button");

    subButtons.forEach(subButton => {
        const subMenu = subButton.querySelector(".sub-menu");

        subButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài

            // Toggle active class chỉ trên sub-menu
            if (subMenu.classList.contains("active")) {
                subMenu.classList.remove("active");
            } else {
                // Đóng tất cả sub-menu trước khi mở menu mới
                document.querySelectorAll(".sub-menu").forEach(menu => menu.classList.remove("active"));
                subMenu.classList.add("active");
            }
        });
    });

    // Đóng menu nếu click ra ngoài
    document.addEventListener("click", function () {
        document.querySelectorAll(".sub-menu").forEach(menu => menu.classList.remove("active"));
    });
});
