function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function rss(){
    list_rss = ["https://portal.edu.gva.es/cvtic/va/category/inici/feed/","https://portal.edu.gva.es/lliurex/?feed=rss2"];
    for( x in list_rss){
        console.log(x);
        fetch("https://cors-anywhere.herokuapp.com/"+list_rss[x])
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            console.log(data);
            const items = data.querySelectorAll("item");
            let html = document.querySelector("#rss").innerHTML;
            items.forEach(el => {
                let stringscaped = escapeHtml(el.querySelector("description").childNodes[0].nodeValue);
            html += `
                <div class="row">
                    <a href="${el.querySelector("link").innerHTML}" title="${stringscaped}">${el.querySelector("title").innerHTML}</a>
    
                </div>
            `;
            document.querySelector("#rss").innerHTML = html;
            });
        });
    }
}
rss();

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
    link.title = card.title || card.url;

    const wrapper = document.createElement('div');
    wrapper.className = 'cardlink';

    const img = document.createElement('img');
    img.className = 'cardicon';
    img.alt = card.title || card.url;
    img.src = card.image || DEFAULT_IMAGE;
    img.onerror = function () {
        img.src = DEFAULT_IMAGE;
    };
    wrapper.appendChild(img);

    const name = document.createElement('div');
    name.className = 'cardname';
    name.textContent = card.title || card.url;
    wrapper.appendChild(name);

    link.appendChild(wrapper);
    document.querySelector('.bookmarks').appendChild(link);
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
