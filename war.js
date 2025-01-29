//////////////////////////////////
//                              //
//    Initializing Card Deck    //
//                              //
//////////////////////////////////

const initialCardDeck = [];
let allCardsCount; // global variable for ending the game

function createInitialDeck(cardCount) {
  allCardsCount = cardCount;

  let cardGameValueCounter = 2;
  for (let i = 0; i < cardCount; i++) {
    const newCard = {};
    if (cardGameValueCounter === 11) {
      cardGameValueCounter = 12;
    } else if (cardGameValueCounter === 16) {
      cardGameValueCounter = 2;
    }

    newCard.cardGameValue = cardGameValueCounter;
    if (cardCount !== 26) {
      if (i < cardCount / 4) {
        newCard.svgSource = `./cards/simple_c_${cardGameValueCounter}.svg`;
      } else if (i < cardCount / 2) {
        newCard.svgSource = `./cards/simple_d_${cardGameValueCounter}.svg`;
      } else if (i < 3 * (cardCount / 4)) {
        newCard.svgSource = `./cards/simple_h_${cardGameValueCounter}.svg`;
      } else if (i < cardCount) {
        newCard.svgSource = `./cards/simple_s_${cardGameValueCounter}.svg`;
      }
    } else {
      if (i < cardCount / 2) {
        newCard.svgSource = `./cards/simple_s_${cardGameValueCounter}.svg`;
      } else if (i < cardCount) {
        newCard.svgSource = `./cards/simple_h_${cardGameValueCounter}.svg`;
      }
    }

    initialCardDeck.push(newCard);

    cardGameValueCounter++;
  }
}

const randomBack = Math.floor(Math.random() * 10 + 1);
const backOfACardSvgSource = `./cards/back${randomBack}.svg`;

////////////////////////////////////////////////////////////////////
//  _______   __         ______   __      __  ________  _______   //
// /       \ /  |       /      \ /  \    /  |/        |/       \  //
// $$$$$$$  |$$ |      /$$$$$$  |$$  \  /$$/ $$$$$$$$/ $$$$$$$  | //
// $$ |__$$ |$$ |      $$ |__$$ | $$  \/$$/  $$ |__    $$ |__$$ | //
// $$    $$/ $$ |      $$    $$ |  $$  $$/   $$    |   $$    $$<  //
// $$$$$$$/  $$ |      $$$$$$$$ |   $$$$/    $$$$$/    $$$$$$$  | //
// $$ |      $$ |_____ $$ |  $$ |    $$ |    $$ |_____ $$ |  $$ | //
// $$ |      $$       |$$ |  $$ |    $$ |    $$       |$$ |  $$ | //
// $$/       $$$$$$$$/ $$/   $$/     $$/     $$$$$$$$/ $$/   $$/  //
//                                                                //
////////////////////////////////////////////////////////////////////
class Player {
  constructor(
    name,
    deckToTableCards,
    tableToDeckCards,
    totalCardsCount,
    threeCardsInWarCounter,
    playerContainer,
    deckToTableContainer,
    tableToDeckContainer,
    numberOfCardsContainer
  ) {
    this.name = name;
    this.deckToTableCards = deckToTableCards;
    this.tableToDeckCards = tableToDeckCards;
    this.totalCardsCount = totalCardsCount;
    this.threeCardsInWarCounter = threeCardsInWarCounter;
    this.playerContainer = playerContainer;
    this.deckToTableContainer = deckToTableContainer;
    this.tableToDeckContainer = tableToDeckContainer;
    this.numberOfCardsContainer = numberOfCardsContainer;
  }

  drawCard = function () {
    if (this.deckToTableContainer.childElementCount === 0) {
      this.refillDeckToTableCards();
    }
    const cardToPullImg = this.deckToTableContainer.firstElementChild;
    cardToPullImg.src = this.deckToTableCards[0].svgSource;

    // add player's card to player War cards array
    if (isWar && this.threeCardsInWarCounter < 4) {
      if (table[`${this.name}Card`]) {
        table[`${this.name}WarCards`].push(table[`${this.name}Card`]);
        if (this.threeCardsInWarCounter < 3 && this.totalCardsCount > 1) {
          cardToPullImg.classList.add('op2');
        }
      }
    }
    table[`${this.name}CardContainer`].append(cardToPullImg);
    table[`${this.name}Card`] = this.deckToTableCards.shift();
  };

  collectCardsFromTable = function () {
    table.removeBackgroundColors();
    document.querySelector(`#${this.name}-instructions`).innerText = '';
    document.querySelector(`#${this.name}-instructions`).style.display = 'none';

    this.tableToDeckCards.push(
      table.player1Card,
      table.player2Card,
      ...table.player1WarCards,
      ...table.player2WarCards
    );

    // visual part of taking cards

    const cardsToTake = document.querySelectorAll('#table img');
    for (let cardToTake of cardsToTake) {
      cardToTake.classList.remove('op2');
      cardToTake.src = backOfACardSvgSource;
      this.tableToDeckContainer.append(cardToTake);
    }

    //resetting table

    table.player1Card = '';
    table.player2Card = '';
    table.player1WarCards = [];
    table.player2WarCards = [];
    table.roundWinner = '';

    player1.threeCardsInWarCounter = 0;
    player2.threeCardsInWarCounter = 0;
    isWar = false;
  };

  refillDeckToTableCards = function () {
    const shuffledDeck = [];
    while (this.tableToDeckCards.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.tableToDeckCards.length
      );
      shuffledDeck.push(this.tableToDeckCards.splice(randomIndex, 1)[0]);
    }

    this.deckToTableCards.push(...shuffledDeck);

    const imagesOfCardsToRefill = document.querySelectorAll(
      `#${this.name}-table-to-deck img`
    );

    for (let img of imagesOfCardsToRefill) {
      this.deckToTableContainer.append(img);
    }
  };

  displayTotalNumberOfCards() {
    this.numberOfCardsContainer.innerText = '';
    this.numberOfCardsContainer.append(this.totalCardsCount);

    if (player1.totalCardsCount > player2.totalCardsCount) {
      player1.numberOfCardsContainer.style.color = 'mediumseagreen';
      player2.numberOfCardsContainer.style.color = 'crimson';
    } else if (player1.totalCardsCount < player2.totalCardsCount) {
      player1.numberOfCardsContainer.style.color = 'crimson';
      player2.numberOfCardsContainer.style.color = 'mediumseagreen';
    } else if (player1.totalCardsCount === player2.totalCardsCount) {
      player1.numberOfCardsContainer.style.color = 'orange';
      player2.numberOfCardsContainer.style.color = 'orange';
    }
  }

  spreadDecks() {
    let counter = 0;

    for (let cardImg of this.deckToTableContainer.children) {
      cardImg.style.marginLeft = `${counter}px`;
      counter += 3;
    }
    this.deckToTableContainer.style.marginRight = `${
      this.deckToTableContainer.childElementCount * 1.5
    }px`;

    //

    let counter2 = 0;

    for (let cardImg of this.tableToDeckContainer.children) {
      cardImg.style.marginLeft = `${counter2}px`;
      counter2 += 3;
    }
    this.tableToDeckContainer.style.marginRight = `${
      this.tableToDeckContainer.childElementCount * 1.5
    }px`;
  }
}

const player1 = new Player(
  'player1',
  [],
  [],
  0,
  0,
  document.querySelector('#player1'),
  document.querySelector('#player1-deck-to-table'),
  document.querySelector('#player1-table-to-deck'),
  document.querySelector('#player1-number-of-cards')
);

const player2 = new Player(
  'player2',
  [],
  [],
  0,
  0,
  document.querySelector('#player2'),
  document.querySelector('#player2-deck-to-table'),
  document.querySelector('#player2-table-to-deck'),
  document.querySelector('#player2-number-of-cards')
);

//////////////////////////////////////////
//                                      //
//    randomly Deal Cards To Players    //
//                                      //
//////////////////////////////////////////

function dealCards(cardCount) {
  for (let i = 0; i < cardCount; i++) {
    const randomCardIndex = Math.floor(Math.random() * initialCardDeck.length);

    const newCard = document.createElement('img');
    newCard.src = backOfACardSvgSource;
    if (i % 2 === 0) {
      player1.deckToTableContainer.append(newCard);
      player1.deckToTableCards.push(
        ...initialCardDeck.splice(randomCardIndex, 1)
      );
      player1.totalCardsCount++;
    } else if (i % 2 === 1) {
      player2.deckToTableContainer.append(newCard);
      player2.deckToTableCards.push(
        ...initialCardDeck.splice(randomCardIndex, 1)
      );
      player2.totalCardsCount++;
    }
  }
}

///////////////////////////////////////////////////////
//  ________  ______   _______   __        ________  //
// /        |/      \ /       \ /  |      /        | //
// $$$$$$$$//$$$$$$  |$$$$$$$  |$$ |      $$$$$$$$/  //
//    $$ |  $$ |__$$ |$$ |__$$ |$$ |      $$ |__     //
//    $$ |  $$    $$ |$$    $$< $$ |      $$    |    //
//    $$ |  $$$$$$$$ |$$$$$$$  |$$ |      $$$$$/     //
//    $$ |  $$ |  $$ |$$ |__$$ |$$ |_____ $$ |_____  //
//    $$ |  $$ |  $$ |$$    $$/ $$       |$$       | //
//    $$/   $$/   $$/ $$$$$$$/  $$$$$$$$/ $$$$$$$$/  //
//                                                   //
///////////////////////////////////////////////////////
let player1NumberOfWins = 0;
let player2NumberOfWins = 0;

const table = {
  player1CardContainer: document.querySelector('#player1-card'),
  player2CardContainer: document.querySelector('#player2-card'),
  player1Card: '',
  player2Card: '',
  player1WarCards: [],
  player2WarCards: [],
  roundWinner: null,

  comparePlayersCardsStrength: function () {
    if (player1NumberOfWins > 0 && player2NumberOfWins > 0) {
      clearInterval(blinkingBorder);
    }

    const player1cardStrength = this.player1Card.cardGameValue;
    const player2cardStrength = this.player2Card.cardGameValue;

    if (player1cardStrength > player2cardStrength) {
      this.roundWinner = player1;

      if (
        isWar &&
        player1.threeCardsInWarCounter < 4 &&
        player2.threeCardsInWarCounter < 4 &&
        player1.totalCardsCount > 0 &&
        player2.totalCardsCount > 0
      ) {
        this.roundWinner = null;
      }

      if (
        !isWar ||
        (this.player1WarCards.length >= 4 &&
          this.player2WarCards.length >= 4) ||
        (this.roundWinner &&
          (player1.totalCardsCount === 0 || player2.totalCardsCount === 0))
      ) {
        if (this.roundWinner) {
          player1NumberOfWins++;
        }

        if (
          player1NumberOfWins === 1 &&
          this.player1WarCards.length === this.player2WarCards.length
        ) {
          document.querySelector('#player1-instructions').style.display =
            'flex';
          document.querySelector('#player1-instructions').innerText =
            'Hit "a" to collect the cards';
        }
        this.addBackgroundColors(player1, player2);
      }
    } else if (player2cardStrength > player1cardStrength) {
      this.roundWinner = player2;

      if (
        isWar &&
        player1.threeCardsInWarCounter < 4 &&
        player2.threeCardsInWarCounter < 4 &&
        player1.totalCardsCount > 0 &&
        player2.totalCardsCount > 0
      ) {
        this.roundWinner = null;
      }

      if (
        !isWar ||
        (this.player1WarCards.length >= 4 &&
          this.player2WarCards.length >= 4) ||
        (this.roundWinner &&
          (player1.totalCardsCount === 0 || player2.totalCardsCount === 0))
      ) {
        if (this.roundWinner) {
          player2NumberOfWins++;
        }

        if (
          player2NumberOfWins === 1 &&
          this.player1WarCards.length === this.player2WarCards.length
        ) {
          document.querySelector('#player2-instructions').style.display =
            'flex';
          document.querySelector('#player2-instructions').innerText =
            'Hit "k" to collect the cards';
        }

        this.addBackgroundColors(player2, player1);
      }
    } else if (player1cardStrength === player2cardStrength) {
      document.body.style.backgroundImage = "url('./nuclear-8737433_1280.jpg')";
      this.roundWinner = null;
      isWar = true;
    }
    //
  },

  addBackgroundColors: function (winner, opponent) {
    if (!isWar) {
      winner.playerContainer.classList.add('greenBG');
      opponent.playerContainer.classList.add('redBG');

      table[`${winner.name}CardContainer`].classList.add('greenBG');
      table[`${opponent.name}CardContainer`].classList.add('redBG');
    } else if (isWar && this.roundWinner) {
      winner.playerContainer.classList.add('war-greenBG');
      opponent.playerContainer.classList.add('war-redBG');

      table[`${winner.name}CardContainer`].classList.add('war-greenBG');
      table[`${opponent.name}CardContainer`].classList.add('war-redBG');
    }
  },

  removeBackgroundColors: function () {
    document.body.style.backgroundImage = 'none';

    const containers = [
      player1.playerContainer,
      player2.playerContainer,
      table.player1CardContainer,
      table.player2CardContainer,
    ];

    for (let container of containers) {
      container.classList.remove('greenBG');
      container.classList.remove('redBG');
      container.classList.remove('war-greenBG');
      container.classList.remove('war-redBG');
    }
  },
};

/////////////////////////////////////////////////
//   ______    ______   __       __  ________  //
//  /      |  /      \ /  \     /  |/        | //
// /$$$$$$  |/$$$$$$  |$$  \   /$$ |$$$$$$$$/  //
// $$ | _$$/ $$ |__$$ |$$$  \ /$$$ |$$ |__     //
// $$ |/    |$$    $$ |$$$$  /$$$$ |$$    |    //
// $$ |$$$$ |$$$$$$$$ |$$ $$ $$/$$ |$$$$$/     //
// $$ \__$$ |$$ |  $$ |$$ |$$$/ $$ |$$ |_____  //
// $$    $$/ $$ |  $$ |$$ | $/  $$ |$$       | //
//  $$$$$$/  $$/   $$/ $$/      $$/ $$$$$$$$/  //
//                                             //
/////////////////////////////////////////////////
let roundWinnerTookTheCards = true;

let player1Played = false;
let player2Played = false;

let isWar = false;

window.addEventListener('keydown', function (evt) {
  // war logic

  if (isWar) {
    // drawing cards in war
    if (
      evt.code === 'KeyS' &&
      table.player1Card.cardGameValue === table.player2Card.cardGameValue &&
      player2.totalCardsCount === 0 &&
      player1.threeCardsInWarCounter === 4
    ) {
      player1.threeCardsInWarCounter = 0;
    }
    if (
      evt.code === 'KeyS' &&
      !table.roundWinner &&
      player1.threeCardsInWarCounter !== 4
    ) {
      if (
        player1.threeCardsInWarCounter === 3 ||
        player1.totalCardsCount === 1
      ) {
        player1.drawCard();
        table.comparePlayersCardsStrength();
        player1.threeCardsInWarCounter++;
      } else if (
        player1.threeCardsInWarCounter < 3 ||
        player2.totalCardsCount === 0
      ) {
        player1.drawCard();
        player1.threeCardsInWarCounter++;
      }
    }

    if (
      evt.code === 'KeyJ' &&
      table.player1Card.cardGameValue === table.player2Card.cardGameValue &&
      player1.totalCardsCount === 0 &&
      player2.threeCardsInWarCounter === 4
    ) {
      player2.threeCardsInWarCounter = 0;
    }
    if (
      evt.code === 'KeyJ' &&
      !table.roundWinner &&
      player2.threeCardsInWarCounter !== 4
    ) {
      if (
        player2.threeCardsInWarCounter === 3 ||
        player2.totalCardsCount === 1
      ) {
        player2.drawCard();
        table.comparePlayersCardsStrength();
        player2.threeCardsInWarCounter++;
      } else if (
        player2.threeCardsInWarCounter < 3 ||
        player1.totalCardsCount === 0
      ) {
        player2.drawCard();
        player2.threeCardsInWarCounter++;
      }
    }

    // ending the war

    if (
      table.roundWinner &&
      player1.threeCardsInWarCounter === 4 &&
      player2.threeCardsInWarCounter === 4
    ) {
      player1.threeCardsInWarCounter = 0;
      player2.threeCardsInWarCounter = 0;

      isWar = false;
    } else if (
      !table.roundWinner &&
      player1.threeCardsInWarCounter === 4 &&
      player2.threeCardsInWarCounter === 4
    ) {
      player1.threeCardsInWarCounter = 0;
      player2.threeCardsInWarCounter = 0;
      isWar = true;
    }
  }

  // collecting cards from table

  if (player1Played && player2Played) {
    roundWinnerTookTheCards = false;
  }
  if (!player1Played && roundWinnerTookTheCards && evt.code === 'KeyS') {
    document.querySelector('#player1-instructions').innerText = '';
    document.querySelector(`#player1-instructions`).style.display = 'none';

    player1.drawCard();
    player1Played = true;
    table.comparePlayersCardsStrength();
  }

  if (!player2Played && roundWinnerTookTheCards && evt.code === 'KeyJ') {
    document.querySelector('#player2-instructions').innerText = '';
    document.querySelector(`#player2-instructions`).style.display = 'none';
    player2.drawCard();
    player2Played = true;
    table.comparePlayersCardsStrength();
  }

  // taking cards from table

  if (
    table.roundWinner === player1 &&
    evt.code === 'KeyA' &&
    !roundWinnerTookTheCards
  ) {
    table.roundWinner.collectCardsFromTable();
    roundWinnerTookTheCards = true;
    player1Played = false;
    player2Played = false;
  } else if (
    table.roundWinner === player2 &&
    evt.code === 'KeyK' &&
    !roundWinnerTookTheCards
  ) {
    table.roundWinner.collectCardsFromTable();
    roundWinnerTookTheCards = true;
    player1Played = false;
    player2Played = false;
  }

  // updating players total cards number and spreading player's decks

  player1.totalCardsCount =
    player1.deckToTableCards.length + player1.tableToDeckCards.length;
  player2.totalCardsCount =
    player2.deckToTableCards.length + player2.tableToDeckCards.length;

  if (evt.code === 'KeyS' || evt.code === 'KeyA') {
    player1.displayTotalNumberOfCards();
    player1.spreadDecks();
  }

  if (evt.code === 'KeyJ' || evt.code === 'KeyK') {
    player2.displayTotalNumberOfCards();
    player2.spreadDecks();
  }

  // handling the end of the game

  if (player1.totalCardsCount === allCardsCount) {
    setTimeout(() => {
      document.body.innerHTML =
        '<h1>player 1 win the game press "n" for a new game</h1>';
      if (evt.code === 'KeyN') {
        location.reload();
      }
    }, 100);
  } else if (player2.totalCardsCount === allCardsCount) {
    setTimeout(() => {
      document.body.innerHTML =
        '<h1>player 2 win the game press "n" for a new game</h1>';
      if (evt.code === 'KeyN') {
        location.reload();
      }
    }, 100);
  }
});

const blinkingBorder = setInterval(() => {
  document
    .querySelector('#player1-instructions')
    .classList.toggle('blinking-border');

  document
    .querySelector('#player2-instructions')
    .classList.toggle('blinking-border');
}, 800);
