<script>
    import {publish} from './Article';
    import {onMount} from 'svelte';
    import {catchAnchorLinks, documentTitle} from './Helpers';
    import {ARTICLE_MIN_LENGTH} from "./Constants";

    export let wallet;
    export let address;

    const md = window.markdownit({breaks: true, linkify: true, typographer: true})
        .use(window.markdownitFootnote)
        .use(window.markdownitSup)
        .use(window.markdownitSub);

    let title = window.localStorage.getItem('draft-title') || '';
    let content = window.localStorage.getItem('draft-content') || '';
    let hasDraft = title || content;
    let parsed = '';

    const handleTitleUpdates = title => {
        window.localStorage.setItem('draft-title', title);
    };

    const handleContentUpdates = content => {
        parsed = md.render(content);

        window.localStorage.setItem('draft-content', content);
    };

    const submit = async event => {
        if (!wallet || !address) {
            return;
        }

        const tx = await publish(
            {
                title: event.target.title.value,
                content: event.target.content.value
            },
            wallet,
            address
        );

        window.localStorage.removeItem('draft-title');
        window.localStorage.removeItem('draft-content');

        window.location.href = `#/article/${tx.id}`;
    };

    $: handleTitleUpdates(title);
    $: handleContentUpdates(content);

    onMount(() => {
        documentTitle('Editor');
    });
</script>

<style>
    .editor {
        width: 100%;
        display: flex;
        flex: 1;
    }
    .editor form {
        width: 100%;
        padding: 16px;
        display: flex;
        flex-direction: column;
    }
    .editor div {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .editor nav {
        display: flex;
    }
    .editor nav label {
        display: flex;
        align-items: center;
    }
    .editor nav small {
        flex: 1;
        display: block;
        margin: 0 0 0 6px;
    }

    .editor textarea {
        height: 100%;
        margin: 16px 0;
        display: block;
    }
    .editor button {
        margin-left: 16px;
    }

    .editor aside {
        display: none;
    }

    @media (min-width: 1024px) {
        .editor {
            justify-content: center;
        }
        .editor form {
            width: 50%;
            max-width: 660px;
        }

        .editor aside {
            width: 50%;
            max-width: 660px;
            display: flex;
            flex-direction: column;
        }
        .editor aside > h4 {
            height: 56px;
            margin: 16px;
            display: block;
            line-height: 50px;
            overflow: hidden;
        }
        .editor aside .md2html {
            margin: 0 16px;
            overflow-y: auto;
        }
    }
</style>

<main class="intro">
    <section class="container">
        <div>
            <h3>
                {#if hasDraft}
                    Complete your article draft
                {:else}
                    Write an academic article
                {/if}
            </h3>
            <p>
                Use Markdown including <a href="https://pandoc.org/MANUAL.html#footnotes" target="_blank" rel="noopener">footnotes</a>, <a href="https://pandoc.org/MANUAL.html#superscripts-and-subscripts" target="_blank" rel="noopener noreferrer">sub & superscript</a> to format the content
            </p>
        </div>
    </section>
</main>

<main class="editor">
    <form on:submit|preventDefault="{submit}">
        <div>
            <input type="text" name="title" placeholder="Article title" required bind:value={title}>

            <textarea name="content" placeholder="Article content" minlength="{ARTICLE_MIN_LENGTH}" required bind:value={content}></textarea>
        </div>

        <nav>
            <label for="license">
                <input type="checkbox" id="license" required>
                <small>Published work is licensed under a <a href="https://creativecommons.org/licenses/" target="_blank" rel="noopener">Creative Commons</a> license or under <a href="https://en.wikipedia.org/wiki/Open_access" target="_blank" rel="noopener noreferrer">Open Access</a>, original work under a <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0</a> license</small>
            </label>

            <button type="submit" class="button">Publish</button>
        </nav>
    </form>

    <aside>
        <h4>{title || 'Article title'}</h4>

        <div class="md2html" on:click="{catchAnchorLinks}">
            {@html parsed || '<p>Article content</p>'}
        </div>
    </aside>
</main>

