console.log('IT’S ALIVE!');

// Step 1: A small helper for selecting multiple elements.
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Steps 2–3: Build the same navigation on every portfolio page.
// Resolving links from this file works locally and under /portfolio/ on GitHub Pages.
const baseURL = new URL('./', import.meta.url);
const pages = [
    { url: '', title: 'home' },
    { url: 'projects/', title: 'projects' },
    { url: 'contact/', title: 'contact' },
    { url: 'https://github.com/c-hote', title: 'github' },
    { url: 'cv/', title: 'c.v.' },
];

const nav = document.createElement('nav');
nav.setAttribute('aria-label', 'Main navigation');
document.body.prepend(nav);

for (const page of pages) {
    const link = document.createElement('a');
    link.href = new URL(page.url, baseURL).href;
    link.textContent = page.title;

    if (link.host !== location.host) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    nav.append(link);
}

// /projects/ and /projects/index.html should highlight the same link.
function normalizePath(pathname) {
    return pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
}

const currentLink = $$('a', nav).find(
    (link) => link.host === location.host
        && normalizePath(link.pathname) === normalizePath(location.pathname),
);

currentLink?.classList.add('current');
currentLink?.setAttribute('aria-current', 'page');

// Step 4: Create the theme control once, then share it across all pages.
document.body.insertAdjacentHTML('afterbegin', `
    <label class="color-scheme">
        Theme:
        <select name="color-scheme">
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
`);

const select = document.querySelector('.color-scheme select');
const colorSchemes = ['light dark', 'light', 'dark'];

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}

// Storage can be unavailable when a browser blocks site data.
// In that case, switching themes still works for the current page.
try {
    const savedScheme = localStorage.getItem('colorScheme');
    if (colorSchemes.includes(savedScheme)) {
        setColorScheme(savedScheme);
    }
} catch {
    // The CSS default remains Automatic.
}

select.addEventListener('input', (event) => {
    const colorScheme = event.target.value;
    setColorScheme(colorScheme);

    try {
        localStorage.setItem('colorScheme', colorScheme);
    } catch {
        // The selected theme still applies even if it cannot be saved.
    }
});

// Step 5 (optional): Preserve spaces and punctuation in the email draft.
const form = document.querySelector('form[action^="mailto:"]');

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const parameters = [];

    for (const [name, value] of new FormData(form)) {
        parameters.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
    }

    location.href = `${form.action}?${parameters.join('&')}`;
});
