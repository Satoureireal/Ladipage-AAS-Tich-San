document.addEventListener("DOMContentLoaded", function () {
    const wraps = document.querySelectorAll(".accordion-faq-wrap");

    wraps.forEach((wrap) => {
        const title = wrap.querySelector(".accordion-faq-title");

        title.addEventListener("click", function () {
            // Nếu wrap đã active thì toggle để đóng
            const isActive = wrap.classList.contains("active");

            // Gỡ active tất cả
            wraps.forEach(w => w.classList.remove("active"));

            // Nếu wrap chưa active, thêm lại
            if (!isActive) {
                wrap.classList.add("active");
            }
        });
    });
});
