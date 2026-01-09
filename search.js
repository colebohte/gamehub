document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const body = document.body;
    const gameEntries = document.querySelectorAll('.game-entry');
    const secret = document.getElementById('secret'); // 👀
    const resultsHeader = document.getElementById('search-results-header');
    const searchQuerySpan = document.getElementById('search-query');

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.blur();
                updateSearch();
            }
            return;
        }

        if (document.activeElement !== searchInput) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', updateSearch);

    function updateSearch() {
        const query = searchInput.value.toLowerCase().trim();

        body.classList.toggle('searching', query.length > 0);

        gameEntries.forEach(entry => {
            const text = entry.textContent.toLowerCase();
            entry.classList.toggle('match', text.includes(query));
        });

        secret.hidden = query !== 'hack';
    }
});
