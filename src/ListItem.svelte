<script>
    import {humanizeDuration} from "./Helpers";

    export let article;
    export let isPublisherVisible = true;

    let title = '';
    let duration = '';
    let publisher = '';

    $: render(article);

    const render = article => {
        title = article.tags['Article-Title'];
        duration = humanizeDuration(article['tags']['Article-Timestamp'], 'on ');
        publisher = article['owner_name'] || article.owner;
    };
</script>

<style>
    li + li {
        margin: 16px 0 0;
    }
    a {
        display: block;
    }
    small {
        display: block;
        margin: 6px 0 0;

        color: var(--color-grey);
    }
</style>

<li>
    <a href="#/article/{article.id}">
        {title}
    </a>
    <small>
        Published {duration}
        {#if isPublisherVisible}
            by {publisher}
        {/if}
    </small>
</li>
