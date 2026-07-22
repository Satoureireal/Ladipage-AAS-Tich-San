document.addEventListener('DOMContentLoaded', function () {
    const floatButton = document.querySelector('.float-button');
    const showMoreQaBtn = floatButton.querySelector('.show-more-qa');
    const showMoreQaItem = floatButton.querySelector('.show-more-qa-item');
    const showFigure = showMoreQaBtn.querySelector('.show');
    const closeFigure = showMoreQaBtn.querySelector('.close');
    const showButtons = floatButton.querySelectorAll('.show-button');

    let isQaActive = false;

    // Hàm reset tất cả nhóm .single-wrap-button về trạng thái ban đầu
    function resetAllShowButtons() {
        const allActions = floatButton.querySelectorAll('.show-more-action');
        const allContexts = floatButton.querySelectorAll('.context-desc');

        allActions.forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('flex');
        });

        allContexts.forEach(el => {
            el.classList.remove('hidden');
        });
    }

    // Toggle toàn bộ .show-more-qa-item
    showMoreQaBtn.addEventListener('click', function () {
        isQaActive = !isQaActive;

        showMoreQaItem.classList.toggle('hidden', !isQaActive);
        showMoreQaItem.classList.toggle('flex', isQaActive);
        showMoreQaBtn.classList.toggle('active', isQaActive);

        showFigure.classList.toggle('hidden', isQaActive);
        closeFigure.classList.toggle('hidden', !isQaActive);

        // Reset tất cả các nhóm về trạng thái ban đầu
        resetAllShowButtons();
    });

    // Xử lý từng nút .show-button độc lập
    showButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const parentWrap = btn.closest('.single-wrap-button');
            if (!parentWrap) return;

            const action = parentWrap.querySelector('.show-more-action');
            const context = parentWrap.querySelector('.context-desc');

            if (!action || !context) return;

            const isActive = !action.classList.contains('hidden');

            // Toggle nhóm hiện tại
            action.classList.toggle('hidden', isActive);
            action.classList.toggle('flex', !isActive);
            context.classList.toggle('hidden', !isActive);
        });
    });
});
