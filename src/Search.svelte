<script>
    import ListItem from './ListItem.svelte';

    import {onMount} from 'svelte';
    import {articlesByApp} from './Articles';
    import {documentTitle} from "./Helpers";

    let articles = [];
    let results = [];

    const search = event => {
        const string = event.target.value.trim().toLowerCase();

        if (!string) {
            return results = [];
        }

        results = articles.filter(article => {
            const title = article.tags['Article-Title'].toLowerCase();
            const content = article.data.toLowerCase();

            return title.includes(string) || content.includes(string);
        });
    };

    onMount(async () => {
        articles = await articlesByApp();

        documentTitle('Find articles');
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
    .articles aside p {
        min-height: 2.2rem;
    }

    .articles div {
        width: 100%;
        max-width: 660px;
    }
    .articles div > p {
        color: var(--color-grey);
        margin: 28px 0 0;
        line-height: 54px;
        text-align: center;
    }

    @media (max-width: 767px) {
        .articles {
            flex-direction: column;
        }
        .articles aside {
            margin-bottom: 32px;
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
                Find articles
            </h3>
            <p>
                Search research materials on any given topic
            </p>
        </div>
    </section>
</main>

<section class="container">
    <main class="articles">
        <aside>
            <strong>Instant search</strong>
            <p>
                <input type="search" placeholder="Type any term" on:keyup={search} on:change={search} on:search={search}>
            </p>
        </aside>

        <div>
            {#if results.length}
                <ul>
                    {#each results as article}
                        <ListItem {article} />
                    {/each}
                </ul>
            {:else}
                <p>The results list is empty</p>
            {/if}
        </div>
    </main>
</section>
