const DEFAULT_IMAGE = 'images/default.png';

function isValidUrl(url) {
    if (typeof url !== 'string') {
        return false;
    }
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === '_url' || trimmed.startsWith('#') || /\s/.test(trimmed)) {
        return false;
    }
    try {
        new URL(trimmed, location.href);
        return true;
    } catch (error) {
        console.log(`URL ${trimmed} not valid`);
        return false;
    }
}

async function isReachable(url) {
    try {
        await fetch(url, {method: 'HEAD', mode: 'no-cors', cache: 'no-store'});
        return true;
    } catch (error) {
        console.log(`URL ${url} not accesible`);
        return false;
    }
}

function createCard(card) {
    const link = document.createElement('a');
    link.href = card.url;

    const img = document.createElement('img');
    img.alt = card.title;
    img.src = card.image || DEFAULT_IMAGE;
    img.onerror = function () {
        img.src = DEFAULT_IMAGE;
    };
    link.appendChild(img);

    const label = document.createTextNode(card.title || card.url);
    link.appendChild(label);

    document.querySelector('nav.sidebar').appendChild(link);
}

async function loadCards() {
    if (!window.LLX_CARDS || !Array.isArray(window.LLX_CARDS.cards)) {
        console.log('cards.js not accesible');
        return;
    }
    for (const card of window.LLX_CARDS.cards) {
        if (!isValidUrl(card.url)) {
            console.log(`Skipping card with url ${card.url}`);
            continue;
        }
        if (card.condition) {
            if (!isValidUrl(card.condition)) {
                continue;
            }
            if (!(await isReachable(card.condition))) {
                continue;
            }
        }
        createCard(card);
    }
}

loadCards();
