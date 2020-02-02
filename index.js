window.onload = main;

const ROW_COUNT = 10;
const CELL_COUNT = 10;
let finishPointI;
let finishPointJ;
let count = 0;

function main() {
    creatBord();

}

function start(event) {
    if (event.code === "Enter") {
        startAlgorithm();
    }
}  //  Get an event from the Enter button and calls StartAlgorithm Function

function startEndPointsClick(event) {

    const cell = event.target;
    if (count === 0) {
        cell.innerText = '1';
        cell.setAttribute('class', 'startPointColor');
    } else if (count === 1) {
        cell.innerText = '' + ROW_COUNT * CELL_COUNT;
        cell.setAttribute('class', 'endPointColor');
        finishPointI = +cell.id[5]; // gave endpoint positions from event id:
        finishPointJ = +cell.id[7];
    } else if (count > 1) {
        cell.setAttribute('class', 'wallStyle');
        cell.innerText = '-1';
    }
    count++;
}

function creatBord() {
    // document.addEventListener('click', startEndPointsClick);
    document.addEventListener('keyup', start);
    const mainDiv = document.getElementById('app');

    for (let i = 0; i < ROW_COUNT; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.addEventListener('click', startEndPointsClick);

        for (let j = 0; j < CELL_COUNT; j++) {
            const cell = document.createElement('div');
           cell.setAttribute('id', `cell_${i}_${j}`);
           cell.classList.add('cell');
           cell.innerText = '0';
            row.appendChild(cell);
        }
        mainDiv.appendChild(row);
    }
}

function startAlgorithm() {
    let maxLayerNumber = 0;
    while (!isFinished(maxLayerNumber + 1)) {
        maxLayerNumber++;
        const boxes = getBoxesFor(maxLayerNumber);
        setNeighbours(boxes, maxLayerNumber + 1);

    }
    if (isGetToEnd()) {
        markShortWay(maxLayerNumber + 1);
    }
    else {
        const popup = document.getElementById('cantmove');
        popup.className = 'cantmove';
    }
}


function getBoxesFor(maxLayerNumber) {
    const boxes = [];
    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < CELL_COUNT; j++) {
            if (getValue(i, j) === maxLayerNumber) {
                boxes.push({i: i, j: j});
            }
        }
    }
    return boxes;
}

function setNeighbours(boxes, maxLayerNumber) {
    boxes.forEach(box => {
        const {i, j} = box;
        if (i - 1 >= 0 && getValue(i - 1, j) === 0) {
            setValue(i - 1, j, maxLayerNumber);
        }
        if (i + 1 < ROW_COUNT && getValue(i + 1, j) === 0) {
            setValue(i + 1, j, maxLayerNumber);
        }
        if (j - 1 >= 0 && getValue(i, j - 1) === 0) {
            setValue(i, j - 1, maxLayerNumber);
        }
        if (j + 1 < CELL_COUNT && getValue(i, j + 1) === 0) {
            setValue(i, j + 1, maxLayerNumber)
        }
    })
}

function isFinished(maxLayerNumber) {

    return isGetToEnd() || !canMove(maxLayerNumber);
}

function isGetToEnd() {
    const i = finishPointI;
    const j = finishPointJ;

    if (i - 1 >= 0 && getValue(i - 1, j) >= 1) {
        return true;
    }
    if (i + 1 < ROW_COUNT && getValue(i + 1, j) >= 1) {
        return true;
    }
    if (j - 1 >= 0 && getValue(i, j - 1) >= 1) {
        return true;
    }
    return j + 1 < CELL_COUNT && getValue(i, j + 1) >= 1;
}

function canMove(maxLayerNumber) {
    const boxes = getBoxesFor(maxLayerNumber);

    for (let box of boxes) {
        if (hasEmptyNeighbour(box)) {
            return true;
        }
    }
    return false;
}

function hasEmptyNeighbour(box) {
    const {i, j} = box;

    if (i - 1 >= 0 && getValue(i - 1, j) === 0) {
        return true;
    }
    if (i + 1 < ROW_COUNT && getValue(i + 1, j) === 0) {
        return true;
    }
    if (j - 1 >= 0 && getValue(i, j - 1) === 0) {
        return true;
    }
    return j + 1 < CELL_COUNT && getValue(i, j + 1) === 0;
}

function markShortWay(maxLayerNumber) {

    let i = finishPointI;
    let j = finishPointJ;

    const timeId = setInterval(() => {
        if (maxLayerNumber === 1) {
            const popup = document.getElementById('popupId');
            popup.className = 'showPopup';
            debugger
            clearInterval(timeId);

            return;
        }
        const box = getNeighbourEqualTo(maxLayerNumber, i, j);
        i = box.i;
        j = box.j;
        setValue(i, j, '#');
        maxLayerNumber--;
    },320)

}

function getNeighbourEqualTo(maxLayerNumber, i, j) {
    if (i - 1 >= 0 && getValue(i - 1, j) === maxLayerNumber) {
        return {i: i - 1, j: j};
    }
    if (i + 1 < ROW_COUNT && getValue(i + 1, j) === maxLayerNumber) {
        return {i: i + 1, j: j};
    }
    if (j - 1 >= 0 && getValue(i, j - 1) === maxLayerNumber) {
        return {i, j: j - 1};
    }
    if (j + 1 < CELL_COUNT && getValue(i, j + 1) === maxLayerNumber) {
        return {i, j: j + 1};
    }
}

function getValue(i, j) {
    const value = document.getElementById(`cell_${i}_${j}`);
    return +value.innerHTML;
}

function setValue(i, j, symbol) {
    const value = document.getElementById(`cell_${i}_${j}`);

    if (symbol === '#') {
        value.setAttribute('class', 'wayColor')
    } else {
        value.innerHTML = symbol;
    }

}



