import {arweave, txTags, txOwner, txData, arweaveID} from "./Arweave";
import {APP_NAME} from "./Constants";

export const read = async txid => {
    let tx = window.localStorage.getItem(txid);

    if (tx) {
        return JSON.parse(tx);
    }

    tx = await arweave.transactions.get(txid);
    const clone = {...tx};

    clone['tags'] = txTags(tx);
    clone['data'] = await txData(tx);
    clone['owner'] = await txOwner(tx);
    clone['owner_name'] = await arweaveID(clone.owner);

    window.localStorage.setItem(clone.id, JSON.stringify(clone));

    return clone;
};

export const publish = async (props, wallet, address) => {
    const title = props.title;
    const data = props.content;
    const timestamp = Math.round((new Date()).getTime() / 1000);

    const tx = await arweave.createTransaction({data}, wallet);

    tx['last_tx'] = await arweave.api.get('/tx_anchor').then(x => x.data);

    const tags = {
        'App-Name': APP_NAME,
        'Article-Title': title,
        'Article-Timestamp': timestamp
    };

    for (const [tagKey, tagValue] of Object.entries(tags)) {
        tx.addTag(tagKey, tagValue);
    }

    await arweave.transactions.sign(tx, wallet);
    const response = await arweave.transactions.post(tx);

    if (response.status !== 200) {
        alert(`Failed to submit transaction: ${response.data}`);
    }

    const clone = {...tx};

    clone['tags'] = tags;
    clone['data'] = data;
    clone['owner'] = address;
    clone['owner_name'] = await arweaveID(address);

    window.localStorage.setItem(clone.id, JSON.stringify(clone));

    return clone;
};
