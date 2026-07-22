document.addEventListener('DOMContentLoaded', function () {
    const collapseBtn = document.querySelector('.collapse-sidebar');
    let openBtn = '';
    const width = window.innerWidth;

    if (width < 768) {
        openBtn = document.querySelector('.nav-open-sidebar');
    } else {
        openBtn = document.querySelector('.open-sidebar');
    }

    const sidebar = document.querySelector('.side-bar');
    const sideContext = document.querySelector('.side-context');
    const titleTexts = document.querySelectorAll('.side-row .title p');
    const previousSidebar = document.querySelector('.previous-sidebar');

    // Hàm collapse sidebar
    function collapseSidebar() {
        sidebar.classList.add('collapsed');

        // Trên mobile, xóa class 'show' để ẩn hoàn toàn
        if (window.innerWidth < 1279) {
            sidebar.classList.remove('show');
        }

        titleTexts.forEach(p => p.classList.add('hidden'));
        sideContext?.querySelectorAll('h2, p, span, div, a')
            .forEach(el => el.classList.add('hidden'));

        collapseBtn.classList.add('rotate');
        openBtn?.classList.remove('hidden');

        document.querySelectorAll('.sub-bar').forEach(bar => {
            bar.classList.remove('active');
            bar.classList.add('hidden');
        });

        document.querySelectorAll('.open-sub').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('hidden');
        });

        document.querySelectorAll('.side-row.sub-open').forEach(row => {
            row.classList.remove('sub-open');
        });

        previousSidebar?.classList.add('hidden');
    }

    // Hàm open sidebar
    function openSidebar() {
        sidebar.classList.remove('collapsed');

        // Trên mobile, thêm class 'show' để hiển thị
        if (window.innerWidth < 1279) {
            sidebar.classList.add('show');
        }

        titleTexts.forEach(p => p.classList.remove('hidden'));
        sideContext?.querySelectorAll('h2, p, span, div, a')
            .forEach(el => el.classList.remove('hidden'));

        openBtn?.classList.add('hidden');
        collapseBtn.classList.remove('rotate');

        document.querySelectorAll('.side-row').forEach(row => {
            const subBar = row.querySelector('.sub-bar');
            const openSub = row.querySelector('.open-sub');
            if (subBar && openSub) {
                openSub.classList.remove('hidden');
            }
        });

        previousSidebar?.classList.remove('hidden');
    }

    collapseBtn?.addEventListener('click', function () {
        if (sidebar.classList.contains('collapsed')) {
            openSidebar();
        } else {
            collapseSidebar();
        }
    });

    openBtn?.addEventListener('click', openSidebar);

    document.querySelectorAll('.open-sub').forEach(button => {
        button.addEventListener('click', function () {
            const row = button.closest('.side-row');
            const subBar = row.querySelector('.sub-bar');
            if (!subBar) return;

            const isOpen = button.classList.toggle('active');
            subBar.classList.toggle('active', isOpen);
            subBar.classList.toggle('hidden', !isOpen);
            row.classList.toggle('sub-open', isOpen);
        });
    });

    // Tự động collapse nếu màn hình < 1279px
    function handleResponsiveSidebar() {
        if (window.innerWidth < 1279) {
            collapseSidebar();
        }
    }

    handleResponsiveSidebar();
    window.addEventListener('resize', handleResponsiveSidebar);
});