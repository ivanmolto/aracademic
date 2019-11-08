export const humanizeDuration = (timestamp, prefix = '') => {
    const now = Math.round((new Date()).getTime() / 1000);
    const delta = now - timestamp;

    const minute = 60,
        hour = minute * 60,
        day = hour * 24;

    if (delta < 30) {
        return 'just now';
    }
    if (delta < minute) {
        return `${delta} seconds ago`;
    }
    if (delta < 2 * minute) {
        return 'a minute ago'
    }
    if (delta < hour) {
        return `${Math.floor(delta / minute)} minutes ago`;
    }
    if (Math.floor(delta / hour) === 1) {
        return '1 hour ago'
    }
    if (delta < day) {
        return `${Math.floor(delta / hour)} hours ago`;
    }
    if (Math.floor(delta / day) === 1) {
        return '1 day ago'
    }

    return prefix + (new Date(timestamp * 1000)).toLocaleDateString();
};

export const copyToClipboard = async str => {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(str);
    }

    const range = document.createRange();
    range.selectNodeContents(document.body);
    document.getSelection().addRange(range);

    function listener(e) {
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }

    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);

    document.getSelection().removeAllRanges();
};

export const catchAnchorLinks = event => {
    const href = event.target.href;

    if (!href) {
        return;
    }

    const url = new URL(href);
    const hash = url.hash;

    if (hash.startsWith('#fn')) {
        event.preventDefault();

        document.getElementById(hash.slice(1)).scrollIntoView({behavior: 'smooth'});
    }
};

export const documentTitle = (prefix = '') => {
    let title = prefix ? `${prefix} - ` : '';

    title += 'Arweave Academic';

    document.title = title;
};
