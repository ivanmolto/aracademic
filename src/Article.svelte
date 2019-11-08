<script>
    import ListItem from './ListItem.svelte';
    import Donation from './Donation.svelte';

    import {read} from './Article';
    import {articlesByAddress} from './Articles';

    import {humanizeDuration, copyToClipboard, catchAnchorLinks, documentTitle} from "./Helpers";

    export let txid;
    export let wallet;
    export let address;
    export let prevPage;
    export let isLoggedIn;

    $: render(txid);

    const md = window.markdownit({breaks: true, linkify: true, typographer: true})
        .use(window.markdownitFootnote)
        .use(window.markdownitSup)
        .use(window.markdownitSub);

    let article = {};
    let title = '';
    let content = '';
    let publisher = '';
    let duration = '';

    $: related = [];

    const copy = () => copyToClipboard(window.location.href);
    const print = () => window.print();

    const render = async txid => {
        article = await read(txid);

        title = article['tags']['Article-Title'];
        publisher = article['owner_name'] || article.owner;
        duration = humanizeDuration(article['tags']['Article-Timestamp']);
        content = md.render(article.data);

        related = await articlesByAddress(article.owner);
        related = related.filter(tx => tx.id !== txid);

        documentTitle(title);
    };
</script>

<style>
    .detail {
        display: flex;
        flex-direction: column;
    }

    .detail > aside {
        border-bottom: 1px solid var(--color-darkgrey);
    }
    .detail > aside ul {
        overflow: hidden;
    }
    .detail > aside li {
        margin: 0 0 16px;

        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
    }
    .detail > aside strong {
        display: block;
    }
    .detail > aside button {
        color: var(--color-page-link);
        text-align: left;
    }

    @media (min-width: 768px) {
        .detail {
            flex-direction: row;
        }
        .detail > aside {
            flex: 1;
            display: flex;
            margin: 16px 32px 0 0;
            border: none;
            min-width: 200px;
        }

        .detail > div {
            max-width: 660px;
        }
    }
    @media (min-width: 1024px) {
        .detail > aside {
            margin-right: 48px;
        }

        .detail > div {
            width: 660px;
        }
    }

    @media print {
        .detail > aside {
            display: none;
        }
    }
</style>

<main class="intro">
    <section class="container">
        <div>
            <h3>
                {title}
            </h3>
            <p>
                Article ID: {txid}
            </p>
        </div>
    </section>
</main>

{#if prevPage === 'editor'}
    <section class="notification notification--success">
        <small>The submitted article will be public after the network confirmation</small>
    </section>
{/if}

<section class="container">
    <main class="detail">
        <aside>
            <ul>
                <li>
                    <strong>Publisher</strong>
                    <p>
                        <a href="#/publisher/{article.owner}">{publisher}</a>
                    </p>
                </li>

                <li>
                    <strong>Published</strong>
                    <p>
                        <a href="https://viewblock.io/arweave/tx/{txid}" target="_blank" rel="noopener">{duration}</a>
                    </p>
                </li>

                <li>
                    <strong>Tools</strong>
                    <p>
                        <button on:click={print}>Print article</button>
                    </p>
                    <p>
                        <a href="https://arweave.net/{txid}" target="_blank" rel="noopener">Markdown raw data</a>
                    </p>
                    <p>
                        <button on:click={copy}>Copy URL to clipboard</button>
                    </p>
                </li>

                <li>
                    <strong>Donate</strong>

                    {#if article.owner == address}
                        <small>You can't donate to yourself</small>
                    {:else if isLoggedIn}
                        <Donation {wallet} target={article.owner} />
                    {:else}
                        <small>Please login to donate</small>
                    {/if}
                </li>

                {#if related.length}
                    <li>
                        <strong>Publisher related</strong>

                        <ul>
                            {#each related as tx}
                                <ListItem article="{tx}" isPublisherVisible={false} />
                            {/each}
                        </ul>
                    </li>
                {/if}
            </ul>
        </aside>

        <div class="md2html" on:click="{catchAnchorLinks}">
            {@html content}
        </div>
    </main>
</section>
