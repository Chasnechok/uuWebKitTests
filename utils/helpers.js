const camalize = function camalize(str) {
    return str
        .toLowerCase()
        .replace(/^\s+(\S)/g, (m, chr) => chr)
        .replace(/\s+(\S)/g, (m, chr) => chr.toUpperCase())
}

module.exports = {
    camalize,
}
