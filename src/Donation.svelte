<script>
    import {arweave} from "./Arweave";

    export let wallet;
    export let target;

    let notification = '';

    const donate = async (props, wallet) => {
        const target = props.target;
        const quantity = arweave.ar.arToWinston(props.quantity);

        const tx = await arweave.createTransaction({quantity, target}, wallet);

        tx['last_tx'] = await arweave.api.get('/tx_anchor').then(x => x.data);

        await arweave.transactions.sign(tx, wallet);
        const response = await arweave.transactions.post(tx);

        if (response.status !== 200) {
            alert(`Failed to submit transaction: ${response.data}`);

            return null;
        }

        return tx;
    };

    const submit = async event => {
        const quantity = event.target.quantity.value;

        if (!wallet || !target || !quantity) {
            return;
        }

        if (!confirm(`Send ${quantity} AR to ${target}?`)) {
            return;
        }

        const tx = await donate({quantity, target}, wallet);

        if (tx) {
            notification = 'Donation successfully sent';
        }
    };
</script>

<style>
    form {
        display: flex;
        margin: 6px 0 16px;
    }
    form label {
        flex: 1;
        display: flex;
        position: relative;
    }

    form label small {
        top: 2px;
        right: 2px;
        width: 30px;
        height: 30px;
        display: block;
        padding: 0 0 0 2px;
        position: absolute;
        background: var(--color-darkgrey);

        color: var(--color-white);
        font-weight: bold;
        line-height: 30px;
        text-align: center;
    }
    form input[type=number] {
        width: 100%;
        height: 34px;
        padding: 3px 32px 3px 6px;
        border: 2px solid var(--color-darkgrey);
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    form input[type=number]:focus {
        border-color: var(--color-page-link);
    }
    form button {
        height: 34px;
        padding: 0 16px;
        background: var(--color-page-link);
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;

        color: var(--color-white);
        line-height: 32px;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
    }
    form button small {
        display: block;
    }
</style>

<form on:submit|preventDefault="{submit}">
    <label>
        <input type="number" name="quantity" required step="any">
        <small>AR</small>
    </label>
    <button type="submit">
        <small>Send</small>
    </button>
</form>

{#if notification}
    <p class="notification notification--success">
        <small>{notification}</small>
    </p>
{/if}
