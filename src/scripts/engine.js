const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector('#score_points'),
    },
    cardSprites: {
        avatar: document.querySelector('#card-image'),
        name: document.querySelector('#card-name'),
        type: document.querySelector('#card-type'),
    },
    playerSides: {
        player1: "#player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "#computer-cards",
        computerBox: document.querySelector("#computer-cards"), 
    },
    fieldCards: {
        player: document.querySelector('#player-field-card'),
        computer: document.querySelector('#computer-field-card'),
    },
    actions: {
        button: document.querySelector('#next-duel')
    },
};

const pathImage = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImage}dragon.png`,
        WinOF: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImage}magician.png`,
        WinOF: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImage}exodia.png`,
        WinOF: [0],
        LoseOf: [1]
    }
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener('mouseover', () => {
            drawSelectedCard(idCard);
        });
    }

    return cardImage;
}

async function setCardsField(idCard) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(idCard, computerCardId);

    let duelResults = await checkDuelResults(idCard, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(idCard, computerCardId) {
    state.fieldCards.player.src = cardData[idCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function hiddenCardDetails() {
    state.cardSprites.name.textContent = "";
    state.cardSprites.type.textContent = "";
    state.cardSprites.avatar.src = "";
}

async function showHiddenCardFieldsImages(value) {
    if (value) {
        state.fieldCards.player.style.display = 'block';
        state.fieldCards.computer.style.display = 'block';    
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";    
    }
}

async function updateScore() {
    state.score.scoreBox.innerText = 
        `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.textContent = text.toUpperCase();
    state.actions.button.style.display = 'block';
}

async function checkDuelResults(idCard, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[idCard];

    if (playerCard.WinOF.includes(computerCardId)) {
        duelResults = "win";
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults);
    return duelResults;
}

async function removeAllCardsImages() {
    let { player1Box, computerBox } = state.playerSides;
    let imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.textContent = cardData[index].name;
    state.cardSprites.type.textContent = `Attribute: ${cardData[index].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
    console.log(fieldSide);
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.querySelector(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch {

    }
}

function init() {
    showHiddenCardFieldsImages(false);
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

}

function onLoadPage() {
    const bgm = document.querySelector('#bgm');
    bgm.play();
}

init();
