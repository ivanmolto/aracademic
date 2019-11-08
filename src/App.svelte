<script>
    import Home from './Home.svelte';
    import Header from './Header.svelte';
    import Editor from './Editor.svelte';
    import Search from './Search.svelte';
    import Article from './Article.svelte';
    import Articles from './Articles.svelte';
    import Publisher from './Publisher.svelte';
    import Footer from './Footer.svelte';

    import {TX_PATTERN} from './Constants';
    import {onMount} from 'svelte';

    let wallet = null;
    let address = null;
    let page = null;
    let txid = null;

    $: isHome = page === 'home';
    $: isLoggedIn = !!address;
    $: prevPage = null;

    const onAuth = event => {
        wallet = event.detail.wallet;
        address = event.detail.address;
    };

    async function hashchange() {
        const path = window.location.hash.slice(1);

        txid = null;
        prevPage = page;

        if (path.startsWith('/articles')) {
            page = 'articles';
        }else if (path.startsWith('/article')) {
            page = 'article';
            txid = path.match(TX_PATTERN)[0];
        }else if (path.startsWith('/publisher')) {
            page = 'publisher';
            txid = path.match(TX_PATTERN)[0];
        } else if (path.startsWith('/editor')) {
            if (isLoggedIn) {
                page = 'editor';
            } else {
                page = 'home';
                window.location.href = '#';
            }
        } else if (path.startsWith('/search')) {
            page = 'search';
        } else {
            page = 'home';
        }

        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    onMount(hashchange);
</script>

<svelte:window on:hashchange={hashchange} />

<Header {isLoggedIn} {isHome} on:auth="{onAuth}" />

{#if page === 'home'}
    <Home {isLoggedIn} on:auth="{onAuth}" />
{:else if page === 'editor'}
    <Editor {wallet} {address} />
{:else if page === 'article'}
    <Article {isLoggedIn} {prevPage} {txid} {wallet} {address} />
{:else if page === 'articles'}
    <Articles />
{:else if page === 'publisher'}
    <Publisher {isLoggedIn} {txid}{wallet} {address} />
{:else if page === 'search'}
    <Search />
{/if}

{#if isHome}
    <Footer />
{/if}
