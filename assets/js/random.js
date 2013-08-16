/**
 * Calculate a random number (float) between 2 numbers
 *
 * @param {Number} min
 * @param {Number} [max]
 * @returns {Number}
 */
Random = function(min, max) {
    max || (max = min, min = 0)
    return min + Math.random() * (max - min)
}

/**
 * Calculate a random number (integer) between 2 numbers
 *
 * @param {Number} min
 * @param {Number} [max]
 * @returns {Number}
 */
Random.int = function(min, max) {
    return Math.floor(Coffee.random(min, max))
}

/**
 * Calculate a random -1 or 1
 */
Random.sign = function(prob) {
    return this.bool(prob)? 1: -1
}

/**
 * Calculate a random boolean
 */
Random.bool = function(prob) {
    prob !== undefined || (prob = .5)
    return Math.random() < prob
}

/**
 * Get random number from array
 */
Random.item = function(list) {
    return list[Math.floor(Math.random() * list.length)]
}