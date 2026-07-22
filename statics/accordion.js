document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".accordion-item").forEach(item => {
        item.addEventListener("click", function () {
            const title = this.querySelector(".accordion-title");
            const img = this.querySelector(".accordion-show-more img");

            // Đóng tất cả accordion trước khi mở cái được click
            document.querySelectorAll(".accordion-item").forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }
            });

            // Toggle trạng thái active
            this.classList.toggle("active");

        });
    });
});