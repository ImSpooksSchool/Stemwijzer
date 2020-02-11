function onLoad() {
    createElement("button", {onclick: start, innerText: "Start"}, function (element) {
        document.getElementById("container").appendChild(element);
    });
}

function start() {
    let partijen = {};

    parties.forEach(value => {
        partijen[value.name] = {
            pro: 0,
            contra: 0,
            none: 0,
            total: 0,
            internal: value
        };
    });

    askQuestion(partijen);
}

function showAwnsers(data, votes) {
    let container = document.getElementById("container");
    let checkboxes = [];

    for (let i = 0; i < subjects.length; i++) {
        container.appendChild(createElement("input", {type: "checkbox", name: "question" + i, id: "question" + i},
            function (element) {
                checkboxes.push(element);
            }
        ));
        container.appendChild(createElement("label", {innerText: subjects[i].title, for: "question" + i}));

    // <input type="checkbox" name="vehicle" value="Bike">
    }

    console.log(checkboxes.length);
    container.appendChild(createElement("button", {innerText: "Submit", onclick: function () {
            checkboxes.forEach((value, index) => {
                if (value.checked) {
                    addScore(votes[index], subjects[index], data);
                }
            });
        }}));
}

function showResult(data) {
    let sortable = [];

    // Sorteer van meeste naar minste
    Object.keys(data).forEach(key => {
        sortable.push([key, data[key]]);
    });

    sortable.sort(function(a, b) {
        return b[1].total - a[1].total;
    });

    data = {};
    sortable.forEach(function(item){
        data[item[0]]=item[1];
    });

    let container = document.getElementById("container");
}

function askQuestion(data, index = 0, votes = []) {
    let container = document.getElementById("container");
    // Maakt div leeg
    while (container.firstChild)
        container.firstChild.remove();

    if (index === subjects.length) {
        showAwnsers(data, votes);
        return true;
    }



    let questionData = subjects[index];

    let title = createElement("h2", {innerText: questionData.title});
    let question = createElement("h2", {innerText: questionData.statement});


    container.appendChild(title);
    container.appendChild(question);

    // Knoppen
    [{
        name: "Eens",
        internal: "pro"
    }, {
        name: "Oneens",
        internal: "contra",
    }, {
        name: "Geen van beide",
        internal: "none"
    }]
        .forEach(value => {
        container.appendChild(createElement("button", {
            innerText: value.name.capitalize(), // Text
            onclick: function () {              // Click
                if (index + 1 > votes.length)
                    votes.push(value.internal);
                else votes[index + 1] = value.internal;

                addScore(value.internal, questionData, data);
                askQuestion(data, index + 1, votes);
            }
        }));
    });

    if (index < subjects.length - 1) {
            container.appendChild(createElement("button", {
                innerText: "Skip vraag",            // Text
                onclick: function () {              // Click
                    if (index + 1 > votes.length)
                        votes.push("Overgeslagen");
                    else votes[index + 1] = "Overgeslagen";

                    askQuestion(data, index + 1, votes);
                }
            }));
        }

        if (index > 0) {
            createElement("button", {
                innerText: "Vorige vraag",          // Text
                onclick: function () {              // Click
                    removeScore(votes[index - 1], subjects[index - 1], data);
                    askQuestion(data, index - 1, votes);
                }
        }, function (element) {
            container.append(element);
        });
    }

    let eensDiv, tegenDiv, geenDiv;
    document.getElementById("container").appendChild(eensDiv = createElement("div", {
        id: "eens",
        style: {display: "inline-block"}
    }));
    document.getElementById("container").appendChild(tegenDiv = createElement("div", {
        id: "tegen",
        style: {display: "inline-block"}
    }));
    document.getElementById("container").appendChild(geenDiv = createElement("div", {
        id: "geen",
        style: {display: "inline-block"}
    }));

    questionData.parties.forEach(value => {
        let div = createElement("div", {}, function (div) {

            let name = createElement("p", {innerText: "Naam: " + value.name});
            let opinion = createElement("p", {innerText: "Mening: " + value.opinion});

            div.appendChild(name);
            div.appendChild(opinion);
        });

        switch (value.position.toLowerCase()) {
            default:
                console.log("Data value \"{0}\" not found.".format(value.position.toLowerCase()));
                break;
            case "pro" : // eens
                eensDiv.appendChild(div);
                break;
            case "contra" : // oneens
                tegenDiv.appendChild(div);
                break;
            case "none": // geen mening
                geenDiv.appendChild(div);
                break;
        }
    });
}

/**
 * Telt de score er bij op
 *
 * @param type
 * @param questionData
 * @param partijen
 */
function addScore(type, questionData, partijen) {
    questionData.parties.forEach(value => {
        if (value.position.equalsIgnoreCase(type)) {
            partijen[value.name][type]++;
            partijen[value.name].total++;
        }
    });
}

/**
 * Verwijderd scores
 *
 * @param type
 * @param questionData
 * @param partijen
 */
function removeScore(type, questionData, partijen) {
    questionData.parties.forEach(value => {
        if (value.position.equalsIgnoreCase(type)) {
            partijen[value.name][type]--;
            partijen[value.name].total--;
        }
    });
}