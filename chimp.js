var width = 5
var height = 5
var level = 10
var nextNum = 1

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

gameFinished = false;

function disableButtons() {
    document.getElementById("info-holder").style.visibility = "hidden";
}

function enableButtons() {
    document.getElementById("info-holder").style.visibility = "visible";
}

function tryAgain() {
    if (document.getElementById("input-width").value != "") {
        width = parseInt(document.getElementById("input-width").value);
    }
    if (document.getElementById("input-height").value != "") {
        height = parseInt(document.getElementById("input-height").value);
    }
    if (document.getElementById("input-level").value != "") {
        level = parseInt(document.getElementById("input-level").value);
    }

    resetBoard();
}

function resetBoard() {
    table = document.getElementById("table");
    table.innerHTML = "";

    if (level > width * height) {
        level = width * height;
    }

    document.getElementById("input-width").value = width;
    document.getElementById("input-height").value = height;
    document.getElementById("input-level").value = level;

    localStorage["width"] = width;
    localStorage["height"] = height;
    localStorage["level"] = level;

    nextNum = 1;
    gameFinished = false;

    var order = []
    for (let i = 0; i < height * width; ++i) {
        order.push(i);
    }
    for (let i = 0; i < order.length; ++i) {
        var j = getRandomInt(i, order.length)
        var tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
    }

    var numHere = new Map();
    for (let i = 0; i < level; ++i) {
        numHere.set(order[i], i + 1);
    }

    for (let row = 0; row < height; ++row) {
        line = document.createElement("div");
        line.classList.add("h-line");
        for (let col = 0; col < width; ++col) {
            child = document.createElement("div");
            var tp = getRandomInt(0, 3);

            var num = numHere.get(row * width + col);
            if (num) {
                child.className = 'h-number-cell';

                child2 = document.createElement("div");
                child2.innerHTML = num;
                if (num >= 100) {
                    child2.style.fontSize = "38px";
                }
                child.appendChild(child2);

                child.onclick = function() {
                    if (gameFinished) {
                        return;
                    }
                    if (this.className != 'h-empty-cell') {
                        var curNum = this.firstChild.innerHTML;
                        if (curNum == nextNum) {
                            if (nextNum == 1) {
                                var divs = document.getElementsByTagName("div");
                                for (let i = 0; i < divs.length; ++i){
                                    if (divs[i].className == 'h-number-cell') {
                                        divs[i].className = 'h-white-cell';
                                    }
                                }
                                disableButtons();
                            }
                            ++nextNum;
                            this.removeChild(this.firstChild);
                            this.className = 'h-empty-cell';

                            if (nextNum > level) {
                                enableButtons();
                            }
                        } else {
                            this.style.borderColor = "rgba(255, 0, 0, 0.4)";
                            gameFinished = true;
                            var divs = document.getElementsByTagName("div");
                            for (let i = 0; i < divs.length; ++i){
                                if (divs[i].className == 'h-white-cell') {
                                    divs[i].className = 'h-number-cell';
                                }
                            }
                            enableButtons();
                        }
                    }
                };
            } else {
                child.className = 'h-empty-cell';
            }
            line.appendChild(child);
        }
        table.appendChild(line);
    }
}

window.onload = function () {
    if (localStorage["width"]) {
        width = localStorage["width"];
    }
    if (localStorage["height"]) {
        height = localStorage["height"];
    }
    if (localStorage["level"]) {
        level = localStorage["level"];
    }

    resetBoard();
};
