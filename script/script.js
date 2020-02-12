const zetels = 10;

function onLoad() {
}

function start() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("statements").style.display = "block";
    askQuestion();
}

function showAwnsers(votes) {
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

    let container = document.getElementById("statements");
    let checkboxes = [];

    let list = createElement("ul", {id: "optionsWrapper"});

    for (let i = 0; i < subjects.length; i++) {
        let li = createElement("li", {classes: ["questionItems"]});

        let span = createElement("span");

        span.appendChild(createElement("input", {type: "checkbox", name: "question" + i, id: "question" + i},
            function (element) {
                checkboxes.push(element);
            }
        ));
        span.appendChild(createElement("label", {innerText: subjects[i].title, for: "question" + i}));
        li.appendChild(span);

        li.appendChild(createElement("button", {title: subjects[i].statement, classes: ["tooltip"]}));

        list.appendChild(li);
    }

    container.appendChild(list);


    let select;
    container.appendChild(select = createElement("select", {}, function (select) {
        select.appendChild(createElement("option", {value: "all", innerText: "Alle partijen"}));
        select.appendChild(createElement("option", {value: "non-secular", innerText: "Alleen grote partijen"}));
        select.appendChild(createElement("option", {value: "secular", innerText: "Alleen seculiere partijen"}));
    }));

    console.log(checkboxes.length);
    container.appendChild(createElement("button", {innerText: "Submit", onclick: function () {
            checkboxes.forEach((value, index) => {
                let effective = 1;
                if (value.checked) effective = 2;

                let type = votes[index];

                subjects[index].parties.forEach(value => {
                    if (value.position.equalsIgnoreCase(type)) {
                        partijen[value.name][type] += effective;
                        partijen[value.name].total += effective;
                    }
                });
            });

            showResult(partijen, select.value);
        }}));
}

function showResult(data, partieValue) {
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

    let container = document.getElementById("statements");

    while (container.firstChild)
        container.firstChild.remove();

    let list = createElement("ul", {id: "resultWrapper"});

    Object.values(data).forEach((value, index) => {
        if (!partieValue.equalsIgnoreCase("all")) {
            if (partieValue.equalsIgnoreCase("secular") && !value.internal.secular)
                return;
            else if (partieValue.equalsIgnoreCase("non-secular") && value.internal.size < zetels)
                return;
        }

        let li = createElement("li", {classes: ["questionItems"]});
        let p = createElement("p", {innerText: "U bent het {0}% eens met {1}".format((value.total / subjects.length * 100).round(1), value.internal.name)});
        li.appendChild(p);
        list.appendChild(li);
    });

    container.appendChild(list);

    console.log(JSON.stringify(data, null, 4));
}

function askQuestion(index = 0, votes = []) {
    console.log(JSON.stringify(votes));
    let container = document.getElementById("statements");
    // Maakt div leeg
    while (container.firstChild)
        container.firstChild.remove();

    if (index === subjects.length) {
        showAwnsers(votes);
        return true;
    }

    createElement("button", {
        innerText: "",                      // Text
        onclick: function () {              // Click
            if (index > 0)
                askQuestion(index - 1, votes);
            else {
                document.getElementById("intro").style.display = "block";
                document.getElementById("statements").style.display = "none";
            }
        }
        , id: "previousButton"}, function (element) {
        container.append(element);
    });

    container.appendChild(container = createElement("div", {id: "question"}));


    let questionData = subjects[index];


    container.appendChild(createElement("div", {style: {minHeight: "330px"}},
        function (div) {
            div.appendChild(createElement("h1", {innerText: ("{0}. " + questionData.title).format(index + 1), style: {color: "deepskyblue"}}));
            div.appendChild(createElement("h1", {innerText: questionData.statement}));
        }));

    // Knoppen
    [{
        name: "Eens",
        internal: "pro"
    }, {
        name: "Geen van beide",
        internal: "none"
    }, {
        name: "Oneens",
        internal: "contra",
    }]
        .forEach(value => {
        container.appendChild(createElement("button", {
            innerText: value.name.capitalize(), // Text
            classes: ["awnserButton"],
            onclick: function () {              // Click
                if (index + 1 > votes.length)
                    votes.push(value.internal);
                else votes[index] = value.internal;

                askQuestion(index + 1, votes);
            }
        }));
    });

    if (index < subjects.length - 1) {
            container.appendChild(createElement("button", {
                id: "skipButton",
                innerText: "Sla deze vraag over ➜",// Text
                onclick: function () {              // Click
                    if (index + 1 > votes.length)
                        votes.push("Overgeslagen");
                    else votes[index] = "Overgeslagen";

                    askQuestion(index + 1, votes);
                }
            }));
        }

    let eensDiv, tegenDiv, geenDiv;
    document.getElementById("statements").appendChild(eensDiv = createElement("div", {
        id: "eens",
        style: {display: "inline-block"}
    }));
    document.getElementById("statements").appendChild(tegenDiv = createElement("div", {
        id: "tegen",
        style: {display: "inline-block"}
    }));
    document.getElementById("statements").appendChild(geenDiv = createElement("div", {
        id: "geen",
        style: {display: "inline-block"}
    }));

    // Details
    let details = createElement("details", {id: "partyDetails"});
    details.appendChild(createElement("summary", {innerText: "Wat vinden de partijen?"}));

    let optionsWrapper = createElement("div", {id: "optionsWrapper"});

    let options = {pro: {name: "Eens", element: null}, none: {name: "Geen van beide", element: null}, contra: {name: "Oneens", element: null}};

    Object.keys(options).forEach(value => {
        optionsWrapper.appendChild(options[value].element = createElement("div", {id: "wrapper" + value.capitalize(), classes: ["wrapper"]}));
        options[value].element.appendChild(createElement("h3", {innerText: options[value].name}));
    });

    questionData.parties.forEach(value => {
        let partyDetails = createElement("details", {classes: ["partyOpinion"]});
        partyDetails.appendChild(createElement("summary", {innerText: value.name}));
        partyDetails.appendChild(createElement("p", {innerText: value.opinion}));

        options[value.position.toLowerCase()].element.appendChild(partyDetails);
    });

    details.appendChild(optionsWrapper);
    container.appendChild(details);
}