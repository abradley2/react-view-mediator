exports.mapObject = function (obj, callback, ctx) {
    return Object.keys(obj).map(function (key) {
        return callback.call(ctx || this, obj[key], key)
    })
}

exports.values = function (obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key]
    })
}

exports.omit = function (obj, omitKeys) {
    if (typeof omitKeys === 'string') omitKeys = [omitKeys]
    var retObj = {}
    Object.keys(obj).forEach(function (key) {
        if (omitKeys.indexOf(key) === -1) {
            retObj[key] = obj[key]
        }
    })
    return retObj
}

exports.assign = function (target, source) {

    for (key in source) {
        if (Object.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
        }
    }

}
