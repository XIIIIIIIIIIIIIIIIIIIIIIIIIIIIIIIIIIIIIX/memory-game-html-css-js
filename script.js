const EMOJIS = ['🐧','🍩','🥝','🌵','⚽','🧊','🎈','🦊'];
    const CARD_PAIRS = 8;
    const FLIP_DELAY = 850;
    const VICTORY_BOUNCE_REPEAT = 2;

    let moves = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;

    const grid = document.getElementById('memory-grid');
    const movesDisplay = document.getElementById('moves');
    const restartBtn = document.getElementById('restart-btn');

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function createDeck() {
      let deck = [];
      let icons = EMOJIS.slice(0, CARD_PAIRS);
      deck = [...icons, ...icons];
      return shuffle(deck);
    }

    function renderGrid() {
      grid.innerHTML = '';
      let deck = createDeck();
      deck.forEach((emoji, idx) => {
        let card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('tabindex', '0');
        card.dataset.emoji = emoji;
        card.dataset.index = idx;
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front">${emoji}</div>
            <div class="card-back"></div>
          </div>
        `;
        card.addEventListener('click', onCardClick);
        card.addEventListener('keydown', function(e){
          if(e.key===" "||e.key==="Enter") { card.click(); }
        });
        grid.appendChild(card);
      });
    }

    function onCardClick(e) {
      if (lockBoard) return;
      const card = e.currentTarget;
      if(card.classList.contains('flipped') || card.classList.contains('matched')) return;
      flipCard(card);
      flippedCards.push(card);
      if(flippedCards.length === 2) {
        moves++; movesDisplay.textContent = moves;
        const [c1, c2] = flippedCards;
        if (c1.dataset.emoji === c2.dataset.emoji) {
          c1.classList.add('matched');
          c2.classList.add('matched');
          flippedCards = [];
          matchedPairs++;
          if(matchedPairs === CARD_PAIRS) victoryBounce();
        } else {
          lockBoard = true;
          setTimeout(() => {
            unflipCard(c1); unflipCard(c2);
            flippedCards = [];
            lockBoard = false;
          }, FLIP_DELAY);
        }
      }
    }

    function flipCard(card) {
      card.classList.add('flipped');
    }
    function unflipCard(card) {
      card.classList.remove('flipped');
    }

    function resetGame() {
      moves = 0;
      matchedPairs = 0;
      flippedCards = [];
      movesDisplay.textContent = moves;
      Array.from(grid.querySelectorAll('.card')).forEach(card => {
        card.classList.remove('flipped','matched','bounce');
      });
      setTimeout(() => {
        renderGrid();
      }, 150);
    }

    function victoryBounce() {
      let bounceCount = 0;
      let cards = Array.from(grid.querySelectorAll('.card'));
      let doBounce = () => {
        cards.forEach(card => card.classList.add('bounce'));
        setTimeout(() => {
          cards.forEach(card => card.classList.remove('bounce'));
          bounceCount++;
          if(bounceCount < VICTORY_BOUNCE_REPEAT) setTimeout(doBounce, 120);
        }, 700);
      };
      doBounce();
    }

    restartBtn.addEventListener('click', resetGame);

    // Init
    renderGrid();