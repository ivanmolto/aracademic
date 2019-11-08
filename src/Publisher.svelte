<script>
    import ListItem from './ListItem.svelte';
    import Donation from './Donation.svelte';

    import {onMount} from 'svelte';
    import {articlesByAddress} from './Articles';
    import {documentTitle} from "./Helpers";

    export let txid;
    export let wallet;
    export let address;
    export let isLoggedIn;

    let articles = [];
    let arweaveID = '';

    onMount(async () => {
        articles = await articlesByAddress(txid);

        const owners = [...new Set(articles.map(article => article['owner_name']))][0];

        arweaveID = owners ? owners : 'Unknown ArweaveID user';

        documentTitle('Publisher');
    });
</script>

<style>
    .articles {
        display: flex;
        padding: 16px 0;
    }
    .articles strong {
        display: block;
        margin-bottom: 6px;
    }

    .articles aside {
        display: flex;
        flex: 1;
        width: 100%;
        min-width: 200px;
        flex-direction: column;
    }
    .articles aside li {
        margin: 0 0 16px;
    }
    .articles aside p {
        min-height: 2.2rem;
    }

    .articles div {
        width: 100%;
        max-width: 660px;
    }

    @media (max-width: 767px) {
        .articles {
            flex-direction: column;
        }
    }

    @media (max-width: 767px) {
        .articles {
            flex-direction: column;
        }
        .articles aside ul {
            width: 100%;
            display: flex;
            flex-direction: column;
        }
    }

    @media (min-width: 768px) {
        .articles aside {
            margin-right: 32px;
        }
    }
    @media (min-width: 1024px) {
        .articles aside {
            margin-right: 48px;
        }
    }
</style>

<main class="intro">
    <section class="container">
        <div>
            <h3>
                {arweaveID}
            </h3>
            <p>
                Publisher ID: {txid}
            </p>
        </div>
    </section>
</main>

<section class="container">
    <main class="articles">
        <aside>
            <ul>
                <li>
                    <strong>Contact</strong>
                    <p>
                        <a href="https://mqu6k4ya35r4.arweave.net/27WsYOcNHWweInDArUK94_GsBeuQKPXalsnwVPPRfe4?to={txid}" target="_blank" rel="noopener">Weave Mail</a>
                    </p>
                </li>

                <li>
                    <strong>Donate</strong>

                    {#if address == txid}
                        <small>You can't donate to yourself</small>
                    {:else if isLoggedIn}
                        <Donation {wallet} target={txid} />
                    {:else}
                        <small>Please login to donate</small>
                    {/if}
                </li>
            </ul>
        </aside>

        <div>
            <ul>
                {#each articles as article}
                    <ListItem {article} isPublisherVisible={false} />
                {/each}
            </ul>
        </div>
    </main>
</section>
