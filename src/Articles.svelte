<script>
    import ListItem from './ListItem.svelte';

    import {onMount} from 'svelte';
    import {articlesByApp} from './Articles';
    import {documentTitle} from "./Helpers";

    let articles = [];
    let publishers = [];

    let articlesTotal = '';
    let publishersTotal = '';

    onMount(async () => {
        articles = await articlesByApp();

        publishers = [...new Set(articles.map(article => article.owner))];

        articlesTotal = articles.length;
        publishersTotal = publishers.length;

        documentTitle('Published articles');
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
        .articles aside {
            margin-bottom: 32px;
        }
    }

    @media (max-width: 767px) {
        .articles {
            flex-direction: column;
        }
        .articles aside ul {
            width: 100%;
            display: flex;
            flex-direction: row;
        }
        .articles aside li {
            width: 50%;
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
                Published articles
            </h3>
            <p>
                List of all academic publications since 2019
            </p>
        </div>
    </section>
</main>

<section class="container">
    <main class="articles">
        <aside>
            <ul>
                <li>
                    <strong>Total articles</strong>
                    <p>
                        {articlesTotal}
                    </p>
                </li>
                <li>
                    <strong>Total publishers</strong>
                    <p>
                        {publishersTotal}
                    </p>
                </li>
            </ul>
        </aside>

        <div>
            <ul>
                {#each articles as article}
                    <ListItem {article} />
                {/each}
            </ul>
        </div>
    </main>
</section>
