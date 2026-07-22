const languageSelect = document.querySelector('.language-select');
const languageShow = languageSelect.querySelector('.language-show');
const languageContainer = languageSelect.querySelector('.language-container');
const actionIcon = languageShow.querySelector('.action');

languageShow.addEventListener('click', () => {
    languageContainer.classList.toggle('active');
    actionIcon.classList.toggle('active');
});

const languageItems = languageSelect.querySelectorAll('.language-item');
const showFlag = languageShow.querySelector('.show-flag img');
const showText = languageShow.querySelector('.show-text');

languageItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img').getAttribute('src');
        const alt = item.querySelector('img').getAttribute('alt');
        const text = item.querySelector('p').textContent;

        // Gán lại giá trị
        showFlag.setAttribute('src', img);
        showFlag.setAttribute('alt', alt);
        showText.textContent = text;

        // Đóng menu và gỡ class active
        languageContainer.classList.add('hidden');
        actionIcon.classList.remove('active');
    });
});
// Click ra ngoài -> đóng container
document.addEventListener('click', (e) => {
    if (!languageSelect.contains(e.target)) {
        languageContainer.classList.remove('active');
        actionIcon.classList.remove('active');
    }
});
