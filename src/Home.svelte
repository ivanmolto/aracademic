<script>
    import ListItem from './ListItem.svelte';

    import {loginUser} from './User';
    import {documentTitle} from "./Helpers";
    import {articlesByApp} from './Articles';
    import {createEventDispatcher, onMount} from 'svelte';

    const dispatch = createEventDispatcher();

    export let isLoggedIn;

    let articles = [];
    let hasDraft = window.localStorage.getItem('draft-title') || window.localStorage.getItem('draft-content');

    const login = event => loginUser(event).then(data => {
        dispatch('auth', data);

        window.location.href = '#/editor';
    });

    onMount(async () => {
        articles = await articlesByApp();
        articles = articles.slice(0, 4);

        documentTitle();
    });
</script>

<style>
    .hero {
        top: -56px;
        width: 100%;
        position: relative;

        z-index: -1;
        pointer-events: none;
    }

    .hero img {
        width: 100%;
        height: auto;
        display: block;
    }
    .hero h1 {
        display: block;
        margin-bottom: 16px;
    }
    .hero h3 {
        color: var(--color-grey);
    }

    .intro div {
        display: block;
        padding: 16px 0;
        text-align: center;
    }
    .intro .button {
        margin: 32px 0 0;
        position: relative;
    }

    input[type=file] {
        height: 50px;
    }

    .articles {
        display: flex;
        padding: 16px 0;
    }
    .articles aside {
        display: flex;
        flex: 1;
        min-width: 220px;
        text-align: center;
    }
    .articles aside ul {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
    }
    .articles aside li:first-child {
        margin-bottom: 32px;
    }
    .articles aside p:first-child {
        margin: 0 0 16px;
        color: var(--color-grey);
    }

    .articles div {
        width: 100%;
        max-width: 660px;
    }
    .articles div ul {
        margin: 16px 0 0;
    }

    @media (max-width: 767px) {
        .hero article {
            left: 48px;
            width: calc(100% - 48px);
            position: relative;

        }
        .hero figcaption {
            top: 32px;
            left: -16px;
            position: relative;
        }

        .articles {
            flex-direction: column;
        }
        .articles aside {
            margin: 0 0 32px;
        }
        .articles aside ul {
            width: 100%;
            display: flex;
        }
    }

    @media (min-width: 768px) {
        .hero {
            margin: 0 0 -56px;
        }
        .hero figcaption {
            left: 300px;
            bottom: 8%;
            position: absolute;
        }

        .intro div {
            padding: 32px 0;
        }
        .intro strong,
        .intro p span {
            display: block;
        }

        .articles aside {
            margin-right: 32px;
        }
    }
    @media (min-width: 1024px) {
        .hero article {
            height: 585px;
            max-width: 1680px;
            margin: auto;
            position: relative;
        }
        .hero figcaption {
            left: 360px;
        }
        .hero figure {
            right: 0;
            width: 1024px;
            height: 585px;
            position: absolute;
        }
        .hero img {
            right: 0;
            width: 1024px;
            height: 585px;
            display: block;
            position: absolute;
        }

        .articles {
            padding: 32px 0 16px;
        }
        .articles aside {
            margin-right: 48px;
        }
    }
</style>

<div class="hero">
    <article>
        <figure>
            <picture>
                <source srcset="images/hero@1x.webp 1x, images/hero@2x.webp 2x" type="image/webp">
                <source srcset="images/hero@1x.png 1x, images/hero@2x.png 2x">

                <img src="images/hero@1x.png" alt="Arweave Academic">
            </picture>

            <figcaption>
                <h1>All the knowledge in one place</h1>
                <h3>High-quality Open Access publishing.<br>Based on Arweave Blockchain.</h3>
            </figcaption>
        </figure>
    </article>
</div>

{#if hasDraft}
    <section class="notification notification--warning">
        <small>The editor have an unpublished draft</small>
    </section>
{/if}

<main class="intro">
    <section class="container">
        <div>
            <h3>
                <strong>Publish academic articles</strong> and make them accessible to everyone
            </h3>
            <p>
                <span>Submit work under a <a href="https://creativecommons.org/licenses/" target="_blank" rel="noopener">Creative Commons</a> license or under <a href="https://en.wikipedia.org/wiki/Open_access" target="_blank" rel="noopener noreferrer">Open Access</a>,</span>
                <span>original work under a <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">CC BY-NC 4.0</a> license</span>
            </p>

            {#if isLoggedIn}
                <a href="#/editor" class="button">
                    Switch to editor
                </a>
            {:else}
                <button class="button">
                    Login to get started
                    <input type="file" id="file" accept="application/json" on:change="{login}">
                </button>
            {/if}
        </div>
    </section>
</main>

<section class="container">
    <main class="articles">
        <aside>
            <ul>
                <li>
                    <p>
                        Explore academic content that is open to everyone, everywhere
                    </p>
                    <p>
                        <a href="#/articles" class="button button--secondary">Browse articles</a>
                    </p>
                </li>

                <li>
                    <p>
                        Discover our collection of publications written by the community
                    </p>
                    <p>
                        <a href="#/search" class="button button--secondary">Search articles</a>
                    </p>
                </li>
            </ul>
        </aside>

        <div>
            <h4>
                <strong>
                    Recent publications
                </strong>
            </h4>

            <ul>
                {#each articles as article}
                    <ListItem {article} />
                {/each}
            </ul>
        </div>
    </main>
</section>
