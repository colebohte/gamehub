document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const body = document.body;
    const gameEntries = document.querySelectorAll('.game-entry');

    // Focus search on keydown (unless special keys)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
            // Allow special keys and non-character keys (like Enter, Esc, etc - though we might want to handle Esc to clear)
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.blur();
                updateSearch();
            }
            return;
        }

        // If not already focused, focus and let the keypress naturally fill the input
        if (document.activeElement !== searchInput) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', updateSearch);

    function updateSearch() {
        const query = searchInput.value.toLowerCase().trim();

        if (query.length > 0) {
            body.classList.add('searching');
        } else {
            body.classList.remove('searching');
        }

        gameEntries.forEach(entry => {
            const text = entry.textContent.toLowerCase();
            if (text.includes(query)) {
                entry.classList.add('match');
            } else {
                entry.classList.remove('match');
            }
        });
    }
});
