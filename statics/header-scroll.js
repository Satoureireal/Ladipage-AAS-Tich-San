document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header-pc, .header-mobile");
    if (!header) return;

    // Phát hiện iOS hoặc macOS (Safari)
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh/.test(userAgent);

    // Giá trị ban đầu của vị trí cuộn
    let lastScrollY = isApple ? window.pageYOffset : window.scrollY;

    // Hàm xử lý ẩn/hiện header
    const handleScroll = () => {
        const currentScrollY = isApple ? window.pageYOffset : window.scrollY;

        if (currentScrollY > lastScrollY + 5) {
            // Cuộn xuống
            header.classList.add("hidden");
        } else if (currentScrollY < lastScrollY - 5) {
            // Cuộn lên
            header.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;
    };

    // Gắn sự kiện scroll & touchmove (Safari iOS cần)
    ["scroll", "touchmove"].forEach(evt =>
        window.addEventListener(evt, handleScroll, { passive: true })
    );
});
