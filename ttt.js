var draggedElement = null;
var board = [];
var chips = [];
var currentPlayer = 1;
var state = "player";
var red = "red";
var blue = "blue";
var humanPlayer = 1;

function placeChip(x, y, player, size) {
    board[x][y] = [player, size];
    chips[player - 1][size - 1] -= 1;
    chipBox = document.createElement("div");
    chipBox.className = 'chip-box';
    difSize = (parseInt(getComputedStyle(document.querySelector('.large-cell'), null).getPropertyValue("height"), 10) -
               parseInt(getComputedStyle(document.querySelector('.chip-box'  ), null).getPropertyValue("height"), 10)) / 2;
    difSize = difSize + "px";
    chipBox.style.top = difSize;
    chipBox.style.left = difSize;

    chip = document.createElement("div");
    chip.className = "chip ";
    if (size == 1) chip.className += "small";
    else if (size == 2) chip.className += "medium";
    else chip.className += "large";
    chip.className += "-chip red-chip";
    if (player == 1) {
        chip.style.background = blue;
    } else {
        chip.style.background = red;
    }
    chipBox.appendChild(chip);

    el = document.getElementById("c" + x + y);
    el.textContent = '';
    el.appendChild(chipBox);
}

function makeComputerMove() {
    state = "computer";
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/ttt');
    var localBoard = [];
    for (i = 0; i < 3; ++i) {
        localBoard.push([]);
        for (j = 0; j < 3; ++j) {
            var it = {};
            it["player"] = board[i][j][0];
            it["size"] = board[i][j][1];
            localBoard[localBoard.length - 1].push(it);
        }
    }
    strategy = "optimal";
    var rad=document.getElementsByName("strategy");
    for (i = 0; i < 2; ++i) {
        if (rad[i].checked) {
            strategy = rad[i].value;
        }
    }
    xhr.send(JSON.stringify({
        state: {
            current_player: currentPlayer,
            chips: chips,
            board: localBoard,
        },
        strategy: strategy,
    }));
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log("Backend error, status " + xhr.status + ", response " + xhr.response);
            return;
        }
        var response = JSON.parse(xhr.response);
        if (!("move" in response)) {
            state = response["result"];
            if (state != "draw") {
                state = "player_win"
            }
            onGameFinished();
            return;
        }
        move = response["move"];
        size = move["chip"]["size"];
        placeChip(move["position"][0], move["position"][1], move["chip"]["player"], size);
        chipId = "cchip-" + ((size - 1) * 2 + chips[currentPlayer - 1][size - 1]);
        document.getElementById(chipId).style.background = "rgba(255, 255, 255, 0.3)";
        currentPlayer = 3 - currentPlayer;
        if ("result" in response) {
            state = response["result"];
            if (state != "draw") {
                state = "computer_win"
            }
            onGameFinished();
            return;
        }
        state = "player";
        updateStatusText();
    };
}

function updateStatusText() {
    el = document.getElementById("status-text");
    if (state == "player") {
        el.textContent = "Your move";
    } else if (state == "computer") {
        el.textContent = "Computer move...";
    } else if (state == "player_win") {
        el.textContent = "You won!";
    } else if (state == "computer_win") {
        el.textContent = "Computer won";
    } else if (state == "draw") {
        el.textContent = "Draw"
    } else if (state == "wait_computer") {
        el.textContent = "Press \"Start\" for computer move"
    }
}

function startComputer() {
    document.getElementById("reset-button").textContent = "Reset";
    document.getElementById("reset-button").onclick = reset;
    state = "computer";
    updateStatusText();
    makeComputerMove();
}

function reset() {
    if (state == "computer") {
        return;
    }

    currentPlayer = 1;
    board = [];
    for (i = 0; i < 3; ++i) {
        board.push([]);
        for (j = 0; j < 3; ++j) {
            board[i].push([0, 0]);
            el = document.getElementById("c" + i + j);
            el.textContent = '';
        }
    }

    chips = [[2, 2, 2], [2, 2, 2]];

    for (i = 0; i < 6; ++i) {
        if (humanPlayer == 1) {
            document.getElementById("pchip-" + i).style.background = blue;
            document.getElementById("cchip-" + i).style.background = red;
        } else {
            document.getElementById("pchip-" + i).style.background = red;
            document.getElementById("cchip-" + i).style.background = blue;
        }
        document.getElementById("pchip-" + i).draggable = true;
        document.getElementById("cchip-" + i).draggable = false;
    }

    if (humanPlayer == 2) {
        state = "wait_computer";
        document.getElementById("reset-button").textContent = "Start";
        document.getElementById("reset-button").onclick = startComputer;
    } else {
        state = "player";
    }

    updateStatusText();
}

function changePlayer() {
    if (state == "computer") {
        return;
    }
    document.getElementById("reset-button").textContent = "Reset";
    document.getElementById("reset-button").onclick = reset;
    humanPlayer = 3 - humanPlayer;
    reset();
}

function onGameFinished() {
    updateStatusText();
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev, el) {
    ev.preventDefault();
    if (state != "player") {
        return;
    }

    var x = parseInt(el.id[1], 10);
    var y = parseInt(el.id[2], 10);
    var size = Math.floor(draggedElement.id[6] / 2) + 1;
    if (board[x][y][1] >= size) {
        return;
    }
    placeChip(x, y, currentPlayer, size);
    state = "computer";
    updateStatusText();
    currentPlayer = 3 - currentPlayer;

    document.getElementById(draggedElement.id).style.background = "rgba(255, 255, 255, 0.3)";
    document.getElementById(draggedElement.id).draggable = false;
    draggedElement = null;

    makeComputerMove();
}

window.onload = function () {
    function dragstart_handler(ev) {
        draggedElement = ev.toElement;
    }
    for (i = 0; i < 6; ++i) {
        document.getElementById("pchip-" + i).addEventListener("dragstart", dragstart_handler);
    }

    red = getComputedStyle(document.querySelector('.red-chip'), null).getPropertyValue("background");
    blue = getComputedStyle(document.querySelector('.blue-chip'), null).getPropertyValue("background");

    reset();
};
