const camalize = function camalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}

module.exports = {
    camalize,
}
