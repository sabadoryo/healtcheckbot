import NodeCache from  "node-cache";

let cache: NodeCache;

export default function getCache() {
    if (!cache) {
        cache = new NodeCache();
        return cache;
    } else {
        return cache;
    }
}