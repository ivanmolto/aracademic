import {arweave} from "./Arweave";
import {read} from "./Article";
import {APP_NAME, ARTICLE_MIN_LENGTH} from "./Constants";

export const articlesByAddress = async address => {
    const txIds = await arweave.arql(
        {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'from',
                expr2: address
            },
            expr2: {
                op: 'equals',
                expr1: 'App-Name',
                expr2: APP_NAME
            }
        }
    );

    return await fillTxIdsWithData(txIds);
};

export const articlesByApp = async () => {
    const txIds = await arweave.arql(
        {
            op: 'equals',
            expr1: 'App-Name',
            expr2: APP_NAME
        }
    );

    return await fillTxIdsWithData(txIds);
};

const fillTxIdsWithData = async txIds => {
    if (!txIds.length) {
        return [];
    }

    let txs = [];

    await Promise.all(
        txIds.map(async txId => {
            const tx = await read(txId);

            if (tx.data.length >= ARTICLE_MIN_LENGTH) {
                txs = [...txs, tx];
            }
        })
    );

    return txs;
};
