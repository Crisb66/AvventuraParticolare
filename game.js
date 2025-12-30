class LockScreen extends Phaser.Scene {
  constructor() {
    super('LockScreen');
  }

  create() {
    const { width, height } = this.scale;

    // SE GIÀ SBLOCCATO, SALTA LA SCHERMATA
    if (localStorage.getItem('unlocked') === 'true') {
      this.scene.start('Level1Intro');
      return;
    }

    // SFONDO SOBRIO
    this.cameras.main.setBackgroundColor('#0e0e0e');

    // TITOLO
    this.add.text(
      width / 2,
      height / 2 - 90,
      'Accesso riservato',
      {
        fontSize: '22px',
        fill: '#cccccc'
      }
    ).setOrigin(0.5);

    // SOTTOTITOLO
    this.add.text(
      width / 2,
      height / 2 - 50,
      'Inserisci la parola segreta',
      {
        fontSize: '16px',
        fill: '#777777'
      }
    ).setOrigin(0.5);

    // INPUT
    this.inputText = '';

    this.inputDisplay = this.add.text(
      width / 2,
      height / 2,
      '',
      {
        fontSize: '26px',
        fill: '#ffffff',
        letterSpacing: 6
      }
    ).setOrigin(0.5);

    // ERRORE (INVISIBILE ALL'INIZIO)
    this.errorText = this.add.text(
      width / 2,
      height / 2 + 40,
      'Parola non valida',
      {
        fontSize: '14px',
        fill: '#aa4444'
      }
    ).setOrigin(0.5).setAlpha(0);

    // INPUT TASTIERA
    this.input.keyboard.on('keydown', event => {
      if (event.key === 'Backspace') {
        this.inputText = this.inputText.slice(0, -1);
      }
      else if (event.key === 'Enter') {
        if (this.inputText === 'CACCASULCOMPUTER') { // 🔐 PASSWORD AGGIORNATA
          localStorage.setItem('unlocked', 'true');
          this.scene.start('Level1Intro');
        } else {
          this.inputText = '';
          this.showError();
        }
      }
      else if (event.key.length === 1 && this.inputText.length < 20) {
        this.inputText += event.key;
      }

      this.inputDisplay.setText('•'.repeat(this.inputText.length));
    });
  }

  showError() {
    this.errorText.setAlpha(1);

    this.tweens.add({
      targets: this.errorText,
      alpha: 0,
      duration: 1200,
      ease: 'Power1'
    });
  }
}

/* =======================
   LEVEL 1 – INTRO
======================= */

class Level1Intro extends Phaser.Scene {
  constructor() {
    super('Level1Intro');
  }

  create() {
    const { width, height } = this.scale;

    // FLAG AUDIO
    this.audioUnlocked = false;

    // PLAYER
    this.player = this.add.rectangle(
      width / 2,
      height / 2,
      40,
      40,
      0x5656e8
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    // TESTO
    this.add.text(
      width / 2,
      height / 2 - 120,
      "Ciao amore mio ❤️\n\nMuoviti con le frecce\n(non ho messo WASD per non farti un dispetto 😛)\n\nPremi SPAZIO per continuare",
      {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    // SPAZIO
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // 🔓 SBLOCCO AUDIO GLOBALE (UNA VOLTA SOLA)
    const unlockAudio = () => {
      if (this.audioUnlocked) return;
      this.audioUnlocked = true;
      this.sound.unlock();
    };

    // QUALSIASI INPUT VA BENE
    this.input.keyboard.on('keydown', unlockAudio);
    this.input.on('pointerdown', unlockAudio);
  }

  update() {
    // MOVIMENTO
    if (this.cursors.left.isDown) this.player.x -= 4;
    if (this.cursors.right.isDown) this.player.x += 4;
    if (this.cursors.up.isDown) this.player.y -= 4;
    if (this.cursors.down.isDown) this.player.y += 4;

    // CAMBIO SCENA
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('Level2IntroText');
    }
  }
}




/* =======================
   LEVEL 2 – INTRODUZIONE
======================= */

class Level2IntroText extends Phaser.Scene {
  constructor() {
    super('Level2IntroText');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#2c2f4a');

    // PLAYER
    this.player = this.add.rectangle(
      width / 2,
      height - 100,
      40,
      40,
      0x5656e8
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    // ZONA INTRO
    this.introZone = this.add.rectangle(
      width / 2,
      height / 2,
      220,
      80,
      0xffffff,
      0.15
    );

    this.add.text(width / 2, height / 2, 'INTRODUZIONE', {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // =========================
    // TEXT BOX CENTRALE
    // =========================
    this.boxWidth = width * 0.8;
    this.boxHeight = 260;
    this.boxPadding = 30;

    this.textBoxBg = this.add.rectangle(
      width / 2,
      height / 2,
      this.boxWidth,
      this.boxHeight,
      0x000000,
      0.85
    ).setVisible(false);

    this.fullText =
      "AMOREEEEEEEEEEEEE, oggi è il nostro anniversario, TANTI AUGURI A NOI! Ma di questo ne parlerò più tardi...\n\n" +
      "Non ce l'avrei mai fatta ad aspettare il 7 per darti il mio regalo, infatti eccolo qui!\n\n" +
      "In quest'avventura sarai un bellissimo quadratino blu che dovrà superare diverse sfide che ho creato apposta per te (no spoiler).\n\n" +
      "Spero che ti divertirai amore, buona fortuna ♥\n\n" +
      "Quando ti senti pronta, premi SPAZIO per iniziare questo fantastico viaggio.";

    // TESTO CON PADDING INTERNO
    this.textBoxText = this.add.text(
      width / 2 - this.boxWidth / 2 + this.boxPadding,
      height / 2 - this.boxHeight / 2 + this.boxPadding,
      '',
      {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: {
          width: this.boxWidth - this.boxPadding * 2
        },
        lineSpacing: 6
      }
    ).setOrigin(0).setVisible(false);

    // STATO EFFETTO SCRITTURA
    this.typingIndex = 0;
    this.isTyping = false;

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  startTyping() {
    if (this.isTyping) return;

    this.isTyping = true;
    this.textBoxText.setText('');
    this.typingIndex = 0;

    this.time.addEvent({
      delay: 30,
      repeat: this.fullText.length - 1,
      callback: () => {
        this.textBoxText.text += this.fullText[this.typingIndex];
        this.typingIndex++;
      }
    });
  }

  update() {
    // MOVIMENTO
    if (this.cursors.left.isDown) this.player.x -= 4;
    if (this.cursors.right.isDown) this.player.x += 4;
    if (this.cursors.up.isDown) this.player.y -= 4;
    if (this.cursors.down.isDown) this.player.y += 4;

    const isOverIntro = Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.introZone.getBounds()
    );

    // MOSTRA BOX + AVVIA TESTO
    if (isOverIntro) {
      this.textBoxBg.setVisible(true);
      this.textBoxText.setVisible(true);
      this.startTyping();
    } else {
      this.textBoxBg.setVisible(false);
      this.textBoxText.setVisible(false);
      this.isTyping = false;
    }

    // AVANTI
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('Level3Meme');
    }
  }
}




class Level3Meme extends Phaser.Scene {
  constructor() {
    super('Level3Meme');
  }

  preload() {
    this.load.image('sans', 'assets/sprites/sans.png');
    this.load.audio('megalovania', 'assets/music/megalovania.mp3');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000000');

    this.add.text(
      width / 2,
      80,
      "\nEcco una semplicissima prima sfida per te",
      {
        fontSize: '28px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    this.add.image(width / 2, height / 2, 'sans')
      .setScale(0.5);

    this.add.text(
      width / 2,
      height - 80,
      "Sto scherzando amore 😘\nPremi SPAZIO per andare avanti",
      {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    this.music = this.sound.add('megalovania', {
      loop: true,
      volume: 0.4
    });

    this.music.play();

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.events.once('shutdown', () => {
      this.music.stop();
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('Level4Avoid');
    }
  }
}


/* =======================
   LEVEL 4 – MINIGIOCO
   PIOGGIA DI DONALD TRUMP
   (HITBOX INVARIATE)
======================= */

class Level4Avoid extends Phaser.Scene {
  constructor() {
    super('Level4Avoid');
  }

  preload() {
    this.load.image('trump', 'assets/sprites/trump.png');
    this.load.audio('usa', 'assets/music/usa.mp3');
  }

  create() {
    const { width, height } = this.scale;

    // SFONDO
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // FLAG
    this.isFinished = false;
    this.isStarted = false;
    this.elapsedTime = 0;

    // AREA DI GIOCO
    this.playArea = {
      left: width * 0.38,
      right: width * 0.62
    };

    // BORDI
    this.add.rectangle(this.playArea.left, height / 2, 4, height, 0xffffff);
    this.add.rectangle(this.playArea.right, height / 2, 4, height, 0xffffff);

    // PLAYER
    this.player = this.add.rectangle(
      width / 2,
      height - 80,
      40,
      40,
      0x5656e8
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // TESTO IN ALTO
    const textX = (this.playArea.left + this.playArea.right) / 2;
    const textWidth = this.playArea.right - this.playArea.left - 20;

    this.add.text(
      textX,
      30,
      "Oh no... Una pioggia di Donald Trump!\n" +
        "Evita i Donald Trump\n" +
        "a tutti i costi!\n" +
        "Resisti 20 secondi 💪",
      {
        fontSize: '22px',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: textWidth }
      }
    ).setOrigin(0.5, 0);

    // TESTO START
    this.startText = this.add.text(
      width / 2,
      height / 2,
      "Premi SPAZIO\nper iniziare",
      {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    // MUSICA
    this.music = this.sound.add('usa', {
      loop: true,
      volume: 0.5
    });

    this.input.keyboard.once('keydown', () => {
      this.music.play();
    });

    this.events.once('shutdown', () => {
      if (this.music) this.music.stop();
    });

    // OSTACOLI
    this.obstacles = [];

    // TIMER OSTACOLI (IN PAUSA)
    this.obstacleTimer = this.time.addEvent({
      delay: 650,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
      paused: true
    });
  }

  spawnObstacle() {
    if (this.isFinished || !this.isStarted) return;

    const obstacle = this.add.rectangle(
      Phaser.Math.Between(
        this.playArea.left + 20,
        this.playArea.right - 20
      ),
      -40,
      40,
      40,
      0xff0000
    );

    obstacle.setAlpha(0);
    obstacle.speed = Phaser.Math.Between(4, 7);

    obstacle.image = this.add.image(obstacle.x, obstacle.y, 'trump');
    obstacle.image.setDisplaySize(40, 40);

    this.obstacles.push(obstacle);
  }

  startLevel() {
    this.isStarted = true;
    this.startText.destroy();

    this.obstacleTimer.paused = false;
  }

  update(_, delta) {
    if (this.isFinished) return;

    // AVVIO CON SPAZIO
    if (!this.isStarted) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.startLevel();
      }
      return;
    }

    // TIMER
    this.elapsedTime += delta;

    // MOVIMENTO PLAYER
    if (this.cursors.left.isDown) this.player.x -= 5;
    if (this.cursors.right.isDown) this.player.x += 5;

    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      this.playArea.left + 20,
      this.playArea.right - 20
    );

    // OSTACOLI
    this.obstacles.forEach(obstacle => {
      obstacle.y += obstacle.speed;
      obstacle.image.x = obstacle.x;
      obstacle.image.y = obstacle.y;

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          obstacle.getBounds()
        )
      ) {
        this.lose();
      }
    });

    // VITTORIA
    if (this.elapsedTime >= 20000) {
      this.win();
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }

  lose() {
    if (this.isFinished) return;
    this.isFinished = true;

    this.stopMusic();
    this.obstacleTimer.remove();

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Oh no 😵\nPuoi farcela amore mio!",
      {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    this.time.delayedCall(1200, () => {
      this.scene.restart();
    });
  }

  win() {
    if (this.isFinished) return;
    this.isFinished = true;

    this.stopMusic();
    this.obstacleTimer.remove();

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Bravissima ❤️\nSei sopravvissuta!",
      {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      this.scene.start('Level5Quiz');
    });
  }
}








/* =======================
   LEVEL 5 – QUIZ
======================= */
class Level5Quiz extends Phaser.Scene {
  constructor() {
    super('Level5Quiz');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#202030');

    // PLAYER
    this.player = this.add.rectangle(
      width / 2,
      height - 80,
      30,
      30,
      0x5656e8
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    // TESTO INTRO (SOLO ALL'INIZIO)
    this.introText = this.add.text(
      width / 2,
      20,
      'Per andare avanti dovrai passare questo quiz,\ndai amore puoi farcela!',
      {
        fontSize: '20px',
        fill: '#ffcccc',
        align: 'center',
        wordWrap: { width: width - 40 }
      }
    ).setOrigin(0.5);

    // DOMANDE
    this.questions = [
      {
        title: 'Domanda 1',
        question: "Quand'è il compleanno di Batuffolo?",
        answers: ['28 novembre', '26 dicembre', '23 dicembre'],
        correct: 0
      },
      {
        title: 'Domanda 2',
        question: 'Chi ha ucciso Aldo Moro?',
        answers: ['Io', 'Lola', 'Lyon WGF'],
        correct: 2
      },
      {
        title: 'Domanda 3',
        question: 'Tra un pandoro 10/10 e un panettone 10/10 cosa sceglierei?',
        answers: ['Pandoro', 'Panettone', "Sederino dell'amore mio"],
        correct: 2
      },
      {
        title: 'Domanda 4',
        question: 'Stanno per bombardare Caserta Vecchia (godo). Ho messo tutto e tutti in salvo nel mio bunker tranne tre cose e ho tempo per prenderne solo una, che salvo?',
        answers: ['Sacco Fairtex', 'Computer', 'Nonna Viola'],
        correct: 2
      },
      {
        title: 'Domanda 5',
        question: 'Cosa ne pensi dei Dragonite? (la tua risposta avrà ripercussioni future, poi capirai)',
        answers: [
          "CAPOLAVORO DELL'INGEGNO UMANO",
          'Cacca',
          'Molto molto bello'
        ],
        correct: 1
      }
    ];

    this.currentQuestion = null;
    this.questionAnswered = false;

    // AREE QUIZ
    this.areas = [];

    const areaPositions = [
      { x: width * 0.2, y: height * 0.35 },
      { x: width * 0.5, y: height * 0.35 },
      { x: width * 0.8, y: height * 0.35 },
      { x: width * 0.35, y: height * 0.65 },
      { x: width * 0.65, y: height * 0.65 }
    ];

    const colors = [
      0xff9999,
      0x99ff99,
      0x9999ff,
      0xffcc66,
      0xcc99ff
    ];

    this.questions.forEach((q, index) => {
      const area = this.add.rectangle(
        areaPositions[index].x,
        areaPositions[index].y,
        180,
        110,
        colors[index],
        0.85
      );

      area.questionIndex = index;
      this.areas.push(area);

      this.add.text(
        area.x,
        area.y,
        q.title,
        { fontSize: '20px', fill: '#000000' }
      ).setOrigin(0.5);
    });

    // TESTO DOMANDA
    this.questionText = this.add.text(
      width / 2,
      60,
      '',
      {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: width - 40 }
      }
    ).setOrigin(0.5);

    this.answerTexts = [];

    // INPUT 1–2–3
    this.input.keyboard.on('keydown', event => {
      if (!this.currentQuestion || this.questionAnswered) return;

      const index = parseInt(event.key) - 1;
      if (index >= 0 && index < 3) {
        this.checkAnswer(index);
      }
    });
  }

  update() {
    // MOVIMENTO PLAYER
    if (this.cursors.left.isDown) this.player.x -= 4;
    if (this.cursors.right.isDown) this.player.x += 4;
    if (this.cursors.up.isDown) this.player.y -= 4;
    if (this.cursors.down.isDown) this.player.y += 4;

    // LIMITI
    this.player.x = Phaser.Math.Clamp(this.player.x, 15, this.scale.width - 15);
    this.player.y = Phaser.Math.Clamp(this.player.y, 15, this.scale.height - 15);

    // CONTROLLO AREE
    this.areas.forEach(area => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          area.getBounds()
        )
      ) {
        if (!this.currentQuestion) {
          this.showQuestion(area.questionIndex);
        }
      }
    });
  }

  showQuestion(index) {
    // RIMUOVI TESTO INTRO ALLA PRIMA DOMANDA
    if (this.introText) {
      this.introText.destroy();
      this.introText = null;
    }

    this.currentQuestion = this.questions[index];
    this.currentAreaIndex = index;
    this.questionAnswered = false;

    this.questionText.setText(this.currentQuestion.question);

    // PULIZIA RISPOSTE PRECEDENTI
    this.answerTexts.forEach(t => t.destroy());
    this.answerTexts = [];

    this.currentQuestion.answers.forEach((answer, i) => {
      const text = this.add.text(
        this.scale.width / 2,
        120 + i * 32,
        `${i + 1}. ${answer}`,
        { fontSize: '20px', fill: '#ffffff' }
      ).setOrigin(0.5);

      this.answerTexts.push(text);
    });
  }

  checkAnswer(index) {
    this.questionAnswered = true;

    const isCorrect = index === this.currentQuestion.correct;

    if (!isCorrect) {
      this.failQuiz();
      return;
    }

    // RISPOSTA CORRETTA
    this.questionText.setText('Risposta corretta ❤️');

    // RIMUOVI AREA
    this.areas = this.areas.filter(area => {
      if (area.questionIndex === this.currentAreaIndex) {
        area.destroy();
        return false;
      }
      return true;
    });

    this.time.delayedCall(1200, () => {
      this.resetQuestion();

      if (this.areas.length === 0) {
        this.scene.start('Level6ReachHeart');
      }
    });
  }

  failQuiz() {
    this.questionText.setText('Ops 😅 risposta sbagliata');

    this.time.delayedCall(1200, () => {
      this.scene.restart();
    });
  }

  resetQuestion() {
    this.currentQuestion = null;
    this.questionAnswered = false;
    this.questionText.setText('');

    this.answerTexts.forEach(t => t.destroy());
    this.answerTexts = [];
  }
}



/* =======================
   LEVEL 6 – REACH THE HEART (FINAL HARD – BALANCED)
======================= */
class Level6ReachHeart extends Phaser.Scene {
  constructor() {
    super('Level6ReachHeart');
  }

  preload() {
    this.load.audio('doomMusic', 'assets/music/doom_eternal.mp3');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0f0f0f');

    /* =======================
       MUSICA
    ======================= */
    this.music = this.sound.add('doomMusic', {
      loop: true,
      volume: 0.6
    });
    this.music.play();

    this.events.once('shutdown', () => {
      if (this.music) this.music.stop();
    });

    /* =======================
       TESTO
    ======================= */
    this.add.text(
      width / 2,
      40,
      "Anche se il mio cuore già è tuo ora dovrai raggiungerlo\nAttenta agli ostacoli amore",
      {
        fontSize: '26px',
        fill: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    /* =======================
       PLAYER
    ======================= */
    this.player = this.add.rectangle(
      width / 2,
      height - 50,
      22,
      22,
      0x5656e8
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    /* =======================
       CUORE
    ======================= */
    this.heart = this.add.text(
      width / 2,
      90,
      '❤️',
      { fontSize: '44px' }
    ).setOrigin(0.5);

    this.finished = false;
    this.obstacles = [];

    /* =======================
       BARRIERE ORIZZONTALI
    ======================= */
    const horizontalRows = [0.30, 0.40, 0.50, 0.60, 0.70];
    horizontalRows.forEach((row, i) => {
      const obs = this.add.rectangle(
        width / 2,
        height * row,
        220,
        18,
        0xff4444
      );
      obs.type = 'horizontal';
      obs.speed = i % 2 === 0 ? 2.4 : -2.4;
      this.obstacles.push(obs);
    });

    /* =======================
       BARRIERE VERTICALI
    ======================= */
    const verticalCols = [0.30, 0.45, 0.55, 0.70];
    verticalCols.forEach((col, i) => {
      const obs = this.add.rectangle(
        width * col,
        height / 2,
        18,
        200,
        0xff4444
      );
      obs.type = 'vertical';
      obs.speed = i % 2 === 0 ? 2.2 : -2.2;
      this.obstacles.push(obs);
    });

    /* =======================
       BARRIERE PIÙ VELOCI
    ======================= */
    const fastH = this.add.rectangle(
      width / 2,
      height * 0.45,
      260,
      16,
      0xff2222
    );
    fastH.type = 'horizontal';
    fastH.speed = 4.2;
    this.obstacles.push(fastH);

    const fastV = this.add.rectangle(
      width * 0.6,
      height / 2,
      16,
      240,
      0xff2222
    );
    fastV.type = 'vertical';
    fastV.speed = -4.0;
    this.obstacles.push(fastV);

    const fastAlt = this.add.rectangle(
      width * 0.4,
      height * 0.55,
      200,
      16,
      0xff2222
    );
    fastAlt.type = 'horizontal';
    fastAlt.speed = -4.5;
    this.obstacles.push(fastAlt);

    /* =======================
       QUADRATINI FLUTTUANTI
    ======================= */
    for (let i = 0; i < 12; i++) {
      const obs = this.add.rectangle(
        Phaser.Math.Between(60, width - 60),
        Phaser.Math.Between(140, height - 120),
        24,
        24,
        0xff6666
      );

      obs.type = 'oscillate';
      obs.baseX = obs.x;
      obs.baseY = obs.y;
      obs.angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      obs.angleSpeed = Phaser.Math.FloatBetween(0.015, 0.035);
      obs.radius = Phaser.Math.Between(35, 80);

      this.obstacles.push(obs);
    }
  }

  update() {
    if (this.finished) return;

    if (this.cursors.left.isDown) this.player.x -= 4;
    if (this.cursors.right.isDown) this.player.x += 4;
    if (this.cursors.up.isDown) this.player.y -= 4;
    if (this.cursors.down.isDown) this.player.y += 4;

    this.player.x = Phaser.Math.Clamp(this.player.x, 11, this.scale.width - 11);
    this.player.y = Phaser.Math.Clamp(this.player.y, 11, this.scale.height - 11);

    this.obstacles.forEach(obs => {
      if (obs.type === 'horizontal') {
        obs.x += obs.speed;
        if (obs.x < 130 || obs.x > this.scale.width - 130) obs.speed *= -1;
      }

      if (obs.type === 'vertical') {
        obs.y += obs.speed;
        if (obs.y < 150 || obs.y > this.scale.height - 120) obs.speed *= -1;
      }

      if (obs.type === 'oscillate') {
        obs.angle += obs.angleSpeed;
        obs.x = obs.baseX + Math.cos(obs.angle) * obs.radius;
        obs.y = obs.baseY + Math.sin(obs.angle) * obs.radius;
      }

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          obs.getBounds()
        )
      ) {
        this.fail();
      }
    });

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.heart.getBounds()
      )
    ) {
      this.win();
    }
  }

  fail() {
    this.finished = true;
    this.music.stop();

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Troppo difficile 😵\nRiprova",
      { fontSize: '30px', fill: '#ffffff', align: 'center' }
    ).setOrigin(0.5);

    this.time.delayedCall(1000, () => {
      this.scene.restart();
    });
  }

  win() {
    this.finished = true;
    this.music.stop();

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Ce l'hai fatta ❤️\nSei incredibile",
      { fontSize: '32px', fill: '#ffffff', align: 'center' }
    ).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('Level6Boss');
    });
  }
}




class Level6Boss extends Phaser.Scene {
  constructor() {
    super('Level6Boss');
  }

  preload() {
    this.load.image('dragonite', 'assets/sprites/dragonite.png');
    this.load.audio('bossMusic', 'assets/music/bossfight.mp3');
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;

    this.cameras.main.setBackgroundColor('#000000');

    /* ===== MUSICA ===== */
    this.bossMusic = this.sound.add('bossMusic', {
      loop: true,
      volume: 0.5
    });

    this.input.keyboard.once('keydown', () => {
      this.bossMusic.play();
    });

    /* ===== TESTO NARRATIVO ===== */
    this.add.text(
      this.W / 2,
      this.H * 0.05,
      "Un dragonite antipatico vuole impedirti di arrivare alla fine del gioco,\nsarà perché non apprezzi i suoi simili?",
      {
        fontSize: '18px',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: this.W * 0.9 }
      }
    ).setOrigin(0.5);

    /* ===== BARRA HP ===== */
    this.bossMaxHP = 75;
    this.bossHP = 75;

    const hpY = this.H * 0.11;
    this.add.rectangle(this.W / 2, hpY, 320, 16, 0x333333);

    this.bossHPBar = this.add.rectangle(
      this.W / 2 - 160,
      hpY,
      320,
      16,
      0xff3333
    ).setOrigin(0, 0.5);

    /* ===== BOSS ===== */
    this.boss = this.physics.add
      .sprite(this.W / 2, this.H * 0.22, 'dragonite')
      .setImmovable(true)
      .setScale(1.1);

    /* ===== ARENA ===== */
    this.arena = {
      x: this.W / 2,
      y: this.H * 0.62,
      width: this.W * 0.42,
      height: this.H * 0.42
    };

    const g = this.add.graphics();
    g.lineStyle(6, 0xffffff);
    g.strokeRect(
      this.arena.x - this.arena.width / 2,
      this.arena.y - this.arena.height / 2,
      this.arena.width,
      this.arena.height
    );

    /* ===== PLAYER ===== */
    this.player = this.add.rectangle(
      this.arena.x,
      this.arena.y + this.arena.height / 2 - 40,
      30,
      30,
      0x5656e8
    );

    /* ===== INPUT ===== */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    /* ===== TESTO CENTRALE ===== */
    this.centerText = this.add
      .text(
        this.W / 2,
        this.H / 2,
        "PREMI SPAZIO\nPER INIZIARE LA BOSSFIGHT",
        {
          fontSize: '42px',
          fill: '#ffffff',
          fontStyle: 'bold',
          align: 'center'
        }
      )
      .setOrigin(0.5)
      .setDepth(10);

    /* ===== STATO ===== */
    this.waitingForStart = true;
    this.phase = 0;
    this.isFinished = false;
    this.obstacles = [];
    this.attackPressed = false;
    this.isInsideSafeZone = false;
    this.phase2Resolved = false;

    this.events.once('shutdown', () => {
      if (this.bossMusic) this.bossMusic.stop();
    });
  }

  /* ================= FASE 1 ================= */

  startPhase1() {
    if (this.isFinished) return;

    this.phase = 1;
    this.attackPressed = false;
    this.phase2Resolved = false;
    this.isInsideSafeZone = false;

    this.centerText.setText("");
    this.destroyPhase2UI();
    this.clearObstacles();

    this.obstacleTimer = this.time.addEvent({
      delay: 650,
      callback: () => {
        const o = this.add.rectangle(
          Phaser.Math.Between(
            this.arena.x - this.arena.width / 2 + 15,
            this.arena.x + this.arena.width / 2 - 15
          ),
          this.arena.y - this.arena.height / 2 - 40,
          28,
          28,
          0xff4444
        );
        o.speed = Phaser.Math.Between(3, 5);
        this.obstacles.push(o);
      },
      loop: true
    });

    this.time.delayedCall(8000, () => {
      if (!this.isFinished) this.startPhase2();
    });
  }

  /* ================= FASE 2 ================= */

  startPhase2() {
    this.clearObstacles();
    this.phase = 2;

    this.centerText.setText("CORRI ALLA ZONA SICURA!");

    this.time.delayedCall(1200, () => {
      this.centerText.setText("");
      this.createSafeZone();
    });
  }

  createSafeZone() {
    const size = 160;
    const margin = 30;

    this.safeZone = this.add
      .rectangle(
        Phaser.Math.Between(
          this.arena.x - this.arena.width / 2 + size / 2 + margin,
          this.arena.x + this.arena.width / 2 - size / 2 - margin
        ),
        Phaser.Math.Between(
          this.arena.y - this.arena.height / 2 + size / 2 + margin,
          this.arena.y + this.arena.height / 2 - size / 2 - margin
        ),
        size,
        size,
        0x00ff99
      )
      .setAlpha(0.85);

    this.tweens.add({
      targets: this.safeZone,
      alpha: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 300
    });

    let timeLeft = 2;

    this.countdownText = this.add
      .text(this.W / 2, this.H / 2, timeLeft, {
        fontSize: '96px',
        fill: '#ffffff'
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      repeat: 1,
      callback: () => {
        timeLeft--;
        this.countdownText.setText(timeLeft);
      }
    });

    this.time.delayedCall(2200, () => this.resolvePhase2());
  }

  resolvePhase2() {
    if (this.phase2Resolved) return;
    this.phase2Resolved = true;

    const isSafe = Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.safeZone.getBounds()
    );

    this.destroyPhase2UI();

    if (!isSafe) {
      this.gameOver();
      return;
    }

    if (this.attackPressed) {
      this.hitBoss();
    } else {
      this.time.delayedCall(1000, () => this.startPhase1());
    }
  }

  hitBoss() {
    this.bossHP = Math.max(this.bossHP - 25, 0);
    this.bossHPBar.width = 320 * (this.bossHP / this.bossMaxHP);
    this.cameras.main.shake(200, 0.01);

    if (this.bossHP <= 0) {
      this.win();
    } else {
      this.time.delayedCall(1000, () => this.startPhase1());
    }
  }

  /* ================= UPDATE ================= */

  update() {
    if (this.isFinished) return;

    if (this.waitingForStart) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.waitingForStart = false;
        this.centerText.setText("");
        this.startPhase1();
      }
      return;
    }

    if (this.cursors.left.isDown) this.player.x -= 5;
    if (this.cursors.right.isDown) this.player.x += 5;
    if (this.cursors.up.isDown) this.player.y -= 5;
    if (this.cursors.down.isDown) this.player.y += 5;

    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      this.arena.x - this.arena.width / 2 + 15,
      this.arena.x + this.arena.width / 2 - 15
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      this.arena.y - this.arena.height / 2 + 15,
      this.arena.y + this.arena.height / 2 - 15
    );

    if (this.phase === 2 && this.safeZone) {
      const inside = Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.safeZone.getBounds()
      );

      if (inside && !this.isInsideSafeZone) {
        this.isInsideSafeZone = true;
        this.centerText.setText("PREMI SPAZIO PER ATTACCARE");
      }

      if (!inside && this.isInsideSafeZone) {
        this.isInsideSafeZone = false;
        this.centerText.setText("");
      }

      if (inside && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.attackPressed = true;
      }
    }

    if (this.phase === 1) {
      this.obstacles.forEach(o => {
        o.y += o.speed;
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.player.getBounds(),
            o.getBounds()
          )
        ) {
          this.gameOver();
        }
      });
    }
  }

  /* ================= UTIL ================= */

  clearObstacles() {
    if (this.obstacleTimer) this.obstacleTimer.remove();
    this.obstacles.forEach(o => o.destroy());
    this.obstacles = [];
  }

  destroyPhase2UI() {
    if (this.safeZone) this.safeZone.destroy();
    if (this.countdownText) this.countdownText.destroy();
    this.safeZone = null;
    this.countdownText = null;
    this.centerText.setText("");
  }

  gameOver() {
    this.isFinished = true;
    this.clearObstacles();
    this.destroyPhase2UI();
    this.bossMusic.stop();

    this.centerText.setText("HAI PERSO 💔");

    this.time.delayedCall(1500, () => this.scene.restart());
  }

  win() {
    this.isFinished = true;
    this.clearObstacles();
    this.destroyPhase2UI();
    this.bossMusic.stop();

    this.centerText.setText("DRAGONITE SCONFITTO ❤️");

    this.time.delayedCall(2000, () => {
      this.scene.start('Level7Finale');
    });
  }
}




class Level7Finale extends Phaser.Scene {
  constructor() {
    super('Level7Finale');
  }

  preload() {
    this.load.audio('finaleMusic', 'assets/music/finale.mp3');
  }

  create() {
    const { width, height } = this.scale;

    this.finaleMusic = this.sound.add('finaleMusic', {
      loop: true,
      volume: 0.3
    });
    this.finaleMusic.play();

    this.events.once('shutdown', () => {
      this.finaleMusic.stop();
    });

    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.player = this.add.rectangle(60, height / 2, 28, 28, 0x5656e8);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.readOverlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    ).setDepth(8).setVisible(false);

    this.messageText = this.add.text(
      width / 2,
      height / 2,
      '',
      {
        fontSize: '26px',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.7 }
      }
    )
      .setOrigin(0.5)
      .setDepth(11)
      .setVisible(false);

    this.zones = [];
    this.currentZone = null;
    this.typingEvent = null;
    this.fullMessage = '';
    this.charIndex = 0;

    this.createZone(
      250,
      height / 2,
      0x8e6cff,
      "Congratulazioni ❤️\n\nSei arrivata alla fine (per ora) di questo giochino, spero ti sia piaciuto amore mio.\nVai avanti, ci sono delle cose che voglio dirti."
    );

    this.createZone(
      450,
      height / 2,
      0x5fd3bc,
      "Un anno, è passato un anno intero ormai. Un anno iniziato nel migliore dei modi da quella sera\n" +
      "di capodanno nel tuo letto quando ti chiesi se ti avesse fatto piacere iniziare l'anno da fidanzata.\n" +
      "Abbiamo vissuto tante esperienze da allora, la prima volta a casa mia, tu che avevi paura di mia madre,\n" +
      "il tuo compleanno, veevee, la gara a piacenza, andare a mare insieme per la prima volta, la passeggiata\n" +
      "sulla croce, Francavilla, procida e tutti i bei ricordi che rimarranno sempre nel mio cuore.\n\n" +
      "Siamo cresciuti insieme, come coppia e come persone, mettendo un mattoncino in più ogni giorno.\n" +
      "E sai qual è la cosa bella? Ci sono ancora infiniti mattoncini da mettere.\n\n"+
      "Con te sono cresciuto come persona e sono cambiato, mi hai aiutato a maturare emotivamente, mi hai \n"+
      "insegnato come funzionano le nostre emozioni, come trattarle e come fare in modo di non trascurarle. \n"+
      "Ne avevo bisogno amore mio. Grazie, grazie per tutto quello che hai fatto per me in questo nostro primo anno insieme,\n"+
      "non riesco proprio a pensare come sarebbe la mia vita se tutto ciò non fosse successo."
    );

    this.createZone(
      650,
      height / 2,
      0xffb347,
      "Sono felice, mi rendi felice, un tipo di felicità di cui non sapevo di avere bisogno. Sono consapevole della\n" +
      "fortuna che ho avuto ad averti nella mia vita e ciò mi rende felice.\n\n" +
      "Nei miei momenti più no mi basterà guardare o pensare a quei tuoi bellissimi occhi per tornare a sorridere e ciò mi rende felice.\n" +
      "Ho qualcuno di cui preoccuparmi, qualcuno a cui pensare, qualcuno da proteggere, qualcuno per cui sento il bisogno di\n" +
      "migliorare ogni singolo giorno, qualcuno che mi fa sentire responsabile senza alcun tipo di peso, anzi, è un piacere,\n" +
      "qualcosa che mi viene naturale. E ciò mi rende felice.\n\n" +
      "La mia felicità non dipende da te, non devi sentirti questo peso addosso amore mio, però sei tu che contribuisci ogni\n" +
      "giorno a farmi svegliare più felice e a farmi andare a letto col sorriso."
    );

    this.createZone(
      850,
      height / 2,
      0xff6f91,
      "Quando penso al mio futuro è ancora tutto offuscato, ho delle idee ma niente di chiarissimo, l'unica certezza che ho è\n" +
      "che in quel futuro così difficile da visualizzare ci sarai tu, continueremo a crescere insieme giorno per giorno, abbiamo\n" +
      "ancora una lunghissima strada da percorrere insieme, il viaggio è appena iniziato, l'unica cosa sicura è che questa sarà\n" +
      "un'avventura co-op.\n\n" +
      "Noi siamo più o meno come il gioco che stai giocando in questo momento, ha una forma, ha un senso (più o meno),\n" +
      "ma ha ancora tanto da aggiungere.\n"+
      "Il gioco non è finito qui, mi impegnerò ogni tanto a creare nuovi livelli, mettere checkpoint, nuove sfide e tanto altro ancora.\n"+
      "Ed è proprio come noi in questo momento, nonostante stiamo insieme da un anno, tante cose si aggiungeranno a quello che siamo noi oggi,\n"+
      "con l'impegno, la pazienza, il sorriso, e tanto tanto amore."
    );

    this.createZone(
      1050,
      height / 2,
      0x6fa8ff,
      "Ti amo, appositamente non l'ho scritto fino a questo momento perché mi sembrava giusto lasciare a queste\n" +
      "due parole speciali un momento tutto per loro.\n\n" +
      "Quante volte l'ho pensato mentre mettevo insieme il codice per questo gioco, forse farei prima a dirti tutte\n" +
      "le volte in cui non l'ho pensato.\n" +
      "Tutto questo l'ho fatto per dirti che ti amo, perché volevo trovare un modo insolito e creativo per dirtelo.\n\n" +
      "Ti amo, non ci sono altre parole (o bit, in questo caso) per dirlo."
    );
  }

  createZone(x, y, color, message) {
    const rect = this.add.rectangle(x, y, 80, 80, color);
    this.zones.push({ rect, message });
  }

  startTyping(message) {
    if (this.typingEvent) this.typingEvent.remove();

    this.fullMessage = message;
    this.charIndex = 0;

    this.messageText.setText('');
    this.messageText.setVisible(true);
    this.readOverlay.setVisible(true);

    this.typingEvent = this.time.addEvent({
      delay: 28,
      repeat: message.length - 1,
      callback: () => {
        this.messageText.setText(
          this.messageText.text + this.fullMessage[this.charIndex]
        );
        this.charIndex++;
      }
    });
  }

  update() {
    if (this.cursors.left.isDown) this.player.x -= 3;
    if (this.cursors.right.isDown) this.player.x += 3;

    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      20,
      this.scale.width - 20
    );

    let insideZone = null;

    this.zones.forEach(zone => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          zone.rect.getBounds()
        )
      ) {
        insideZone = zone;
      }
    });

    if (insideZone && insideZone !== this.currentZone) {
      this.currentZone = insideZone;
      this.startTyping(insideZone.message);
    }

    if (!insideZone && this.currentZone) {
      this.currentZone = null;
      if (this.typingEvent) this.typingEvent.remove();
      this.messageText.setVisible(false);
      this.readOverlay.setVisible(false);
    }
  }
}
















/* =======================
   CONFIG & AVVIO
======================= */
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#2c2f4a',

  /* ✅ PHYSICS OBBLIGATORIO */
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    LockScreen,
    Level1Intro,
    Level2IntroText,
    Level3Meme,
    Level4Avoid,
    Level5Quiz,
    Level6ReachHeart,
    Level6Boss,
    Level7Finale,
  ]
};

new Phaser.Game(config);