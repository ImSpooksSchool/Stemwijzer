/**
 * Created by Nick on 12 dec. 2019.
 * Copyright © ImSpooks
 */


// PROTOYPES
/**
 * Replaces a specific character sequense to another
 *
 * @param search Searched character sequense
 * @param replacement Replacement
 * @returns String with {@param search} replaced by {@param replacement}
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Formats a string
 * E.g.: "My name is {0} and I am {1} years old".format("Nick", "17");
 * It replaces {0} with the first parameter and {1} with the second parameter
 *
 * @returns Formated string
 */
String.prototype.format = function () {
    let a = this;
    for (let k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a
};

/**
 * Checks if the compared string are the same, not case sensitive
 *
 * @param match String to be compared with
 * @returns {boolean} {@code true} if the strings match, {@code false} otherwise
 */
String.prototype.equalsIgnoreCase = function(match) {
    return this.toLowerCase() === match.toLowerCase();
};

/**
 * If the string is an stringified array or json it converts it back
 *
 * @returns Parsed JSON/Array
 */
String.prototype.toArray = function() {
    return JSON.parse(this);
};

/**
 * Capitalizes the first letter of a string
 *
 * @returns {string} {@code String} with first letter capitalized
 */
String.prototype.capitalize = function () {
    return this.substr(0, 1).toUpperCase() + this.substr(1).toLocaleLowerCase();
};

/**
 * Checks if the string contains a character sequence
 *
 * @link String#includes(str)
 * @param str Character sequense to check
 * @returns {boolean}: String#includes(str)
 */
String.prototype.contains = function(str) {
    return this.includes(str);
};

String.prototype.isEmpty = function() {
    return this === "" || this.length === 0;
};

/**
 * Rounds the number to x amount of decimals
 *
 * @param {number} places Amount of decimals
 * @returns {number} Rounded number as string
 */
Number.prototype.round = function (places = 0) {
    if (places === 0) {
        return Math.floor(this + 0.5);
    }
    return parseFloat(this.toFixed(places));
};

/**
 * Fancy way to check if 2 objects are equal
 * @code object1 == object2
 *
 * @param object Object to compare to
 * @returns {boolean} {@code true} if the 2 objects are the same, {@code false} otherwise
 */
Object.prototype.equals = function (object) {
    return this === object;
};

/**
 * Moves an object at specified index to a new index
 *
 * @param old_index Current index of object
 * @param new_index New index of object
 */
Array.prototype.moveObject = function(old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};

/**
 * Removes
 * @returns {Array}
 */
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

/**
 * Checks if array is empty
 *
 * @returns {boolean} {@code true} if length equals to 0, {@code false} otherwise
 */
Array.prototype.isEmpty = function () {
    return this.length === 0;
};

// FUNCTIONS
/**
 * Create an element with set type of properties
 *
 * @param type Element type, e.g. "button" or "img"
 * @param properties {object} {@see adjustElement(element, properties, callback)}
 * @param callback Callback when called after creation
 * @returns Element that was created
 */
function createElement(type, properties = {}, callback = null) {
    let element = document.createElement(type);
    adjustElement(element, properties);
    if (callback != null && typeof callback === "function")
        callback(element);
    return element;
}

/**
 * Edit an element with set type of properties
 *
 * @param element Element to be edited
 * @param properties Property map as a json, e.g. {innerText: "text", style: {backgroundColor: "blue"}}
 * @param callback Callback when called after modification
 * @returns Element that was created
 */
function adjustElement(element, properties = {}, callback = null) {
    Object.keys(properties).forEach(function (key, index, array) {
        switch (key.toLowerCase()) {
            case "style":
                Object.keys(properties[key]).forEach(function (styleKey, index, array) {
                    element.style[styleKey] = properties[key][styleKey];
                });
                break;

            case "classes":
                element.classList.add(properties[key]);
                break;

            default:
                element[key] = properties[key];
                break;
        }
    });

    if (callback != null && typeof callback === "function")
        callback(element);
}

/**
 * Clamps a value between minimum and maximum range
 *
 * @param {number} value Value
 * @param {number} min Minimum
 * @param {number} max Maximum
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return value > max ? max : (value < min ? min : value)
}

/**
 * @returns {string} Current client date as dd-mm-yyyy
 */
function getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    return dd + '-' + mm + '-' + yyyy;
}

/**=
 * @returns {string} Current client time as hh:mm:ss
 */
function getCurrentTime() {
    let today = new Date();
    let hh = today.getHours();
    let mm = today.getMinutes()+1; //January is 0!
    let ss = today.getSeconds();

    return hh + ':' + mm + ':' + ss;
}

/**
 * @returns {string} Random UUID as a string
 * @see <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier">UUID</a>
 */
function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Calculates the width of an text
 *
 * @param text Input text
 * @param size Text size
 * @param font Font style
 * @returns {number} Width in pixels
 */
function getTextWidth(text, size, font) {
    // re-use canvas object for better performance
    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    context.fontSize = size;
    let metrics = context.measureText(text);
    return metrics.width;
}

/**
 * @param arrayOfNumbers Array of different numbers
 * @returns {array} Scaled number of arrays with values between 0-1
 * @see <a href="https://stats.stackexchange.com/questions/351696/normalize-an-array-of-numbers-to-specific-range">Normalize an array of numbers to specific range</a>
 */
function normalize(arrayOfNumbers) {
    let total = 0;
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        total += (arrayOfNumbers[i] * arrayOfNumbers[i]);
    }
    let length = Math.sqrt(total);


    let newArray = [];
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        newArray.push(arrayOfNumbers[i] / length);
    }

    return newArray;
}

/**
 * Calculates the distance from point 1 to point 2
 *
 * @param x1 Point 1
 * @param y1 Point 1
 * @param x2 Point 2
 * @param y2 Point 2
 * @returns {number} Squared distance between 2 points
 */
function distance2dSquared(x1, y1, x2, y2) {
    return (Math.abs(x1 - x2) * Math.abs(x1 - x2)) + (Math.abs(y1 - y2) * Math.abs(y1 - y2));
}

/**
 * @link distance2dSquared(x1, y1, x2, y2)
 */
function distance2d(x1, y1, x2, y2) {
    return Math.sqrt(distance2dSquared(x1, y1, x2, y2));
}

/**
 * Return a CSS value from a property
 *
 * @param element Target element
 * @param property CSS property
 * @returns {string} Value from the CSS property
 */
function css(element, property ) {
    return window.getComputedStyle( element, null ).getPropertyValue( property );
}

/**
 * Calculates the mouse position in canvas
 *
 * @param canvas Selected canvas
 * @param evt Mouse Move Event
 * @returns {{x: number, y: number}}
 */
function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/**
 * Clears all running intervals
 */
function clearAllIntervals() {
    let interval_id = window.setTimeout(function () {}, 9999); // Get a reference to the last

    for (let i = interval_id; i > 0; i--)
        window.clearInterval(i);
}

/**
 * Converts a 2d vector to an angle
 *
 * @param x Value X from vector
 * @param y Value Y from vector
 * @returns {number} Angle from 0-360
 */
function vectorToAngle(x, y) {
    return ((Math.atan2(y, x) * (180 / Math.PI)) + 90) % 360;
}

/**
 * Converts an angle to a vector
 *
 * @param angle Angle from 0-360
 * @returns {{x: number, y: number}}
 */
function angleToVector(angle) {
    let x = Math.cos(angle / 180 * Math.PI);
    let y = Math.sin(angle / 180 * Math.PI);
    return {x: x, y: y};
}

/**
 * Clean empty values in a json
 *
 * @param json Input json
 * @param clearArrays If {@code true} it'll also remove empty arrays/json
 */
function cleanArray(json, clearArrays = false) {
    if (json.constructor === ({}).constructor) {
        const propNames = Object.getOwnPropertyNames(json);
        for (let i = 0; i < propNames.length; i++) {
            const propName = propNames[i];
            if (json[propName] === null || json[propName] === undefined) {
                delete json[propName];
            }
            else if (clearArrays) {
                if (Array.isArray(json[propName])) {
                    if (json[propName].isEmpty()) {
                        delete json[propName];
                    }
                    else {
                        for (let i = 0; i < json[propName].length; i++) {
                            if (json[propName][i].constructor === ({}).constructor) {
                                if (Object.keys(json[propName][i]).isEmpty()) {
                                    delete json[propName][i];
                                }
                                else {
                                    cleanArray(json[propName][i], clearArrays);
                                }
                            }
                        }
                    }
                }
                else if (json[propName].constructor === ({}).constructor) {
                    if (Object.keys(json[propName]).isEmpty()) {
                        delete json[propName];
                    }
                    else {
                        cleanArray(json[propName], clearArrays);
                    }
                }
            }
        }
    }
}