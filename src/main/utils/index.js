export const to = promise => promise.then(d => [null, d]).catch(e => [e, null])
