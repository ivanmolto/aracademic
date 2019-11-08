<script>
    import {loginUser} from './User';

    import {createEventDispatcher} from 'svelte';

    export let isHome;
    export let isLoggedIn;

    const dispatch = createEventDispatcher();

    const login = event => loginUser(event).then(data => dispatch('auth', data));

    const logout = () => {
        dispatch('auth', {wallet: null, address: null});

        window.location.href = '#';
    }
</script>

<style>
    header {
        height: 56px;
        display: flex;
        align-items: center;
    }

    nav {
        display: flex;
        margin-left: auto;
    }
    nav strong {
        display: block;
    }
    nav a {
        margin-right: 16px;
    }
    nav button {
        position: relative;
    }

    input[type=file] {
        height: 24px;
    }

    @media (min-width: 768px) {
        nav a {
            margin-right: 32px;
        }
    }

    @media print {
        header {
            display: none;
        }
    }
</style>

<header class="container">
    <a href="#">
        <strong>ACADEMIC</strong>
    </a>

    {#if !isHome}
        <nav>
            <a href="#">
                <strong>Home</strong>
            </a>

            {#if isLoggedIn}
                <a href="#/editor">
                    <strong>Editor</strong>
                </a>
            {/if}

            <a href="#/articles">
                <strong>Articles</strong>
            </a>
            <a href="#/search">
                <strong>Search</strong>
            </a>

            {#if isLoggedIn}
                <button on:click="{logout}">
                    <strong>Logout</strong>
                </button>
            {:else}
                <button>
                    <strong>Login</strong>
                    <input type="file" id="file" accept="application/json" on:change="{login}">
                </button>
            {/if}
        </nav>
    {/if}
</header>
