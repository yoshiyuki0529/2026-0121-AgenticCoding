import './styles/style.css'

// ハノイの塔ゲームロジック

class HanoiTower {
  constructor(diskCount = 5) {
    this.diskCount = diskCount;
    this.rods = [[], [], []]; // 3つの杭
    this.moveCount = 0;
    this.selectedDisk = null;
    this.selectedRod = null;
    this.gameStarted = false;
    this.gameWon = false;
    
    this.initializeRods();
  }

  // 杭を初期化する
  initializeRods() {
    this.rods = [[], [], []];
    // すべてのディスクを左の杭に配置（大きい順）
    for (let i = this.diskCount; i >= 1; i--) {
      this.rods[0].push(i);
    }
    this.moveCount = 0;
    this.gameWon = false;
  }

  // ディスクが選択された時
  selectDisk(rodIndex) {
    if (this.rods[rodIndex].length === 0) {
      return false; // 空の杭は選択できない
    }

    this.selectedDisk = this.rods[rodIndex][this.rods[rodIndex].length - 1];
    this.selectedRod = rodIndex;
    return true;
  }

  // ディスクを別の杭に移動させる
  moveDisk(targetRodIndex) {
    // 選択されたディスクがない場合
    if (this.selectedDisk === null || this.selectedRod === null) {
      return { success: false, message: 'まずディスクを選んでください' };
    }

    // 同じ杭を選択した場合
    if (this.selectedRod === targetRodIndex) {
      this.clearSelection();
      return { success: false, message: 'ちがう杭を選んでください' };
    }

    // ルール確認：移動先の杭の上のディスクが、移動するディスクより大きいか確認
    if (this.rods[targetRodIndex].length > 0) {
      const topDisk = this.rods[targetRodIndex][this.rods[targetRodIndex].length - 1];
      if (topDisk < this.selectedDisk) {
        // 大きいディスクを小さいディスクの上に置こうとした
        this.clearSelection();
        return { success: false, message: '❌ 大きいリングを小さいリングの上に置けません！' };
      }
    }

    // ディスクを移動
    this.rods[this.selectedRod].pop();
    this.rods[targetRodIndex].push(this.selectedDisk);
    this.moveCount++;

    // ゲーム勝利判定
    if (this.isGameWon()) {
      this.gameWon = true;
      const minMoves = this.getMinMoves();
      return {
        success: true,
        message: `🎉 クリア！${this.moveCount}手でクリアしました！（最小手数：${minMoves}手）`,
        won: true
      };
    }

    this.clearSelection();
    return { success: true, message: `✅ ディスクを移動しました！（${this.moveCount}手目）` };
  }

  // ゲーム勝利判定
  isGameWon() {
    return (
      this.rods[0].length === 0 &&
      this.rods[1].length === 0 &&
      this.rods[2].length === this.diskCount
    );
  }

  // ディスク選択をクリア
  clearSelection() {
    this.selectedDisk = null;
    this.selectedRod = null;
  }

  // 最小手数を計算（2^n - 1）
  getMinMoves() {
    return Math.pow(2, this.diskCount) - 1;
  }

  // 現在の状態を取得
  getState() {
    return {
      rods: this.rods,
      moveCount: this.moveCount,
      selectedRod: this.selectedRod,
      selectedDisk: this.selectedDisk,
      gameWon: this.gameWon
    };
  }
}

// UI制御クラス
class GameUI {
  constructor() {
    this.game = null;
    this.autoPlaying = false;
    this.autoSpeed = 1;
    this.setupElements();
    this.attachEventListeners();
  }

  setupElements() {
    this.difficultySelect = document.getElementById('difficulty');
    this.startBtn = document.getElementById('start-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.autoBtn = document.getElementById('auto-btn');
    this.speedSlider = document.getElementById('speed-slider');
    this.speedLabel = document.getElementById('speed-label');
    this.moveCountDisplay = document.getElementById('move-count');
    this.minMovesDisplay = document.getElementById('min-moves');
    this.messageArea = document.getElementById('message');
    this.rods = [];
    
    for (let i = 0; i < 3; i++) {
      this.rods.push(document.getElementById(`rod-${i}`));
    }
  }

  attachEventListeners() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.autoBtn.addEventListener('click', () => this.toggleAutoPlay());
    this.speedSlider.addEventListener('change', (e) => this.updateSpeed(e.target.value));
    this.difficultySelect.addEventListener('change', () => {
      if (this.game) {
        this.resetGame();
      }
    });
  }

  startGame() {
    const diskCount = parseInt(this.difficultySelect.value);
    console.log('Starting game with disk count:', diskCount);
    this.game = new HanoiTower(diskCount);
    console.log('Game initialized. Rods state:', this.game.rods);
    this.startBtn.textContent = '再スタート';
    this.autoBtn.disabled = false;
    this.speedSlider.disabled = false;
    this.updateDisplay();
    console.log('Display updated');
    this.showMessage(`難易度: ${diskCount}個のディスク`, 'info');
  }

  resetGame() {
    if (this.game) {
      this.autoPlaying = false;
      this.autoBtn.textContent = '🤖 オートモード';
      this.autoBtn.classList.remove('playing');
      this.game.initializeRods();
      this.updateDisplay();
      this.showMessage('ゲームをリセットしました', 'info');
    }
  }

  toggleAutoPlay() {
    if (!this.game) return;
    
    if (this.autoPlaying) {
      this.autoPlaying = false;
      this.autoBtn.textContent = '🤖 オートモード';
      this.autoBtn.classList.remove('playing');
    } else {
      this.autoPlaying = true;
      this.autoBtn.textContent = '⏸️ 停止';
      this.autoBtn.classList.add('playing');
      this.solveHanoi();
    }
  }

  updateSpeed(value) {
    this.autoSpeed = parseFloat(value);
    const speedLabels = {
      '0.5': '速い',
      '1': '標準',
      '1.5': 'やや遅い',
      '2': '遅い',
      '2.5': 'もっと遅い',
      '3': '最も遅い'
    };
    this.speedLabel.textContent = speedLabels[value] || '標準';
  }

  solveHanoi() {
    const moves = [];
    this.generateHanoiMoves(this.game.diskCount, 0, 2, 1, moves);
    this.executeMoves(moves);
  }

  generateHanoiMoves(n, source, destination, auxiliary, moves) {
    if (n === 0) return;
    if (!this.autoPlaying) return;

    if (n === 1) {
      moves.push({ from: source, to: destination });
      return;
    }

    this.generateHanoiMoves(n - 1, source, auxiliary, destination, moves);
    moves.push({ from: source, to: destination });
    this.generateHanoiMoves(n - 1, auxiliary, destination, source, moves);
  }

  async executeMoves(moves) {
    for (const move of moves) {
      if (!this.autoPlaying) break;

      // ディスクを選択
      const success = this.game.selectDisk(move.from);
      if (!success) continue;

      this.updateDisplay();

      // 移動を実行
      const result = this.game.moveDisk(move.to);
      
      // ディスク移動時にエフェクトを表示
      if (result.success) {
        this.createImpactEffect(move.to);
      }
      
      this.updateDisplay();

      // 速度に応じた待機
      const delay = (1000 / this.autoSpeed) * 1.5;
      await new Promise(resolve => setTimeout(resolve, delay));

      if (result.won) {
        this.autoPlaying = false;
        this.autoBtn.textContent = '🤖 オートモード';
        this.autoBtn.classList.remove('playing');
        this.showMessage(result.message, 'success');
        this.playCelebrationEffect();
        break;
      }
    }
  }

  updateDisplay() {
    console.log('updateDisplay called');
    // ディスク数の更新
    const minMoves = this.game.getMinMoves();
    this.minMovesDisplay.textContent = minMoves;
    this.moveCountDisplay.textContent = this.game.moveCount;

    // 各杭のディスクを再描画
    for (let rodIndex = 0; rodIndex < 3; rodIndex++) {
      console.log(`Rendering rod ${rodIndex}:`, this.game.rods[rodIndex]);
      this.renderRod(rodIndex);
    }
  }

  renderRod(rodIndex) {
    const rodElement = this.rods[rodIndex];
    console.log(`renderRod ${rodIndex}, rodElement:`, rodElement);
    rodElement.innerHTML = '';

    const disks = this.game.rods[rodIndex];
    console.log(`Disks for rod ${rodIndex}:`, disks);
    
    disks.forEach((diskSize, index) => {
      console.log(`Creating disk size ${diskSize} at index ${index}`);
      const diskElement = document.createElement('div');
      diskElement.className = `disk size-${diskSize}`;
      
      if (this.game.selectedRod === rodIndex && 
          diskSize === this.game.selectedDisk) {
        diskElement.classList.add('selected');
      }

      diskElement.textContent = diskSize;
      diskElement.style.bottom = `${20 + index * 28}px`;
      diskElement.style.left = '50%';
      diskElement.style.transform = 'translateX(-50%)';

      diskElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDiskClick(rodIndex, diskSize);
      });

      rodElement.appendChild(diskElement);
      console.log(`Disk appended to rod ${rodIndex}`);
    });

    // 杭のクリックイベントリスナーが重複しないよう対策
    if (!rodElement.dataset.hasClickListener) {
      rodElement.addEventListener('click', (event) => {
        // ディスク要素をクリックした場合はスキップ
        if (event.target.classList.contains('disk')) {
          return;
        }
        // 杭をクリック（ディスクなし）
        this.handleRodClick(rodIndex);
      });
      rodElement.dataset.hasClickListener = 'true';
    }
  }

  handleDiskClick(rodIndex, diskSize) {
    if (!this.game) {
      this.showMessage('ゲームを開始してください', 'error');
      return;
    }

    // ディスク選択
    if (this.game.selectedDisk === null) {
      const success = this.game.selectDisk(rodIndex);
      if (success) {
        this.updateDisplay();
        this.showMessage('ディスクを選びました。移動先の杭をクリック！', 'info');
      }
    } else if (this.game.selectedRod === rodIndex && 
               this.game.selectedDisk === diskSize) {
      // 同じディスクをクリック→選択解除
      this.game.clearSelection();
      this.updateDisplay();
      this.showMessage('選択をキャンセルしました', 'info');
    } else {
      // 別のディスク/杭をクリック→移動
      const result = this.game.moveDisk(rodIndex);
      
      // ディスク移動時にエフェクトを表示
      if (result.success) {
        this.createImpactEffect(rodIndex);
      }
      
      this.updateDisplay();

      if (result.success) {
        const messageType = result.won ? 'success' : 'info';
        this.showMessage(result.message, messageType);
        if (result.won) {
          this.playCelebrationEffect();
        }
      } else {
        this.showMessage(result.message, 'error');
      }
    }
  }

  handleRodClick(rodIndex) {
    if (!this.game) {
      this.showMessage('ゲームを開始してください', 'error');
      return;
    }

    // ディスクが選択されていない場合
    if (this.game.selectedDisk === null) {
      this.showMessage('まずディスクを選んでください', 'error');
      return;
    }

    // 選択中の杭と同じ杭をクリック
    if (this.game.selectedRod === rodIndex) {
      this.game.clearSelection();
      this.updateDisplay();
      this.showMessage('選択をキャンセルしました', 'info');
      return;
    }

    // ディスクを移動
    const result = this.game.moveDisk(rodIndex);
    
    // ディスク移動時にエフェクトを表示
    if (result.success) {
      this.createImpactEffect(rodIndex);
    }
    
    this.updateDisplay();

    if (result.success) {
      const messageType = result.won ? 'success' : 'info';
      this.showMessage(result.message, messageType);
      if (result.won) {
        this.playCelebrationEffect();
      }
    } else {
      this.showMessage(result.message, 'error');
    }
  }

  showMessage(text, type = 'info') {
    this.messageArea.textContent = text;
    this.messageArea.className = `message ${type}`;
    
    if (type === 'info' && text !== '') {
      setTimeout(() => {
        if (this.messageArea.textContent === text) {
          this.messageArea.textContent = '';
          this.messageArea.className = 'message';
        }
      }, 3000);
    }
  }

  createImpactEffect(rodIndex) {
    console.log('createImpactEffect called for rodIndex:', rodIndex);
    const rodElement = this.rods[rodIndex];
    const rect = rodElement.getBoundingClientRect();
    const gameBoard = document.querySelector('.game-board');
    const gameBoardRect = gameBoard.getBoundingClientRect();

    // 相対位置を計算
    const x = rect.left - gameBoardRect.left + rect.width / 2;
    const y = rect.top - gameBoardRect.top + rect.height;

    console.log('Effect position - x:', x, 'y:', y);

    // インパクトテキスト配列
    const texts = ['BAM!', 'POW!', 'BOOM!', 'BANG!', 'ZAP!'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];

    // テキストエフェクト
    const textEffect = document.createElement('div');
    textEffect.className = 'impact-text impact-text-bang';
    textEffect.textContent = randomText;
    textEffect.style.left = x + 'px';
    textEffect.style.top = y - 40 + 'px';
    textEffect.style.position = 'absolute';
    gameBoard.appendChild(textEffect);
    console.log('Text effect added:', randomText);

    // 星エフェクト（複数）
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'impact-effect';
      
      const starIcon = document.createElement('div');
      starIcon.className = 'impact-star';
      starIcon.style.left = (x - 30 + Math.random() * 60) + 'px';
      starIcon.style.top = (y - 30 - Math.random() * 60) + 'px';
      
      star.appendChild(starIcon);
      gameBoard.appendChild(star);
    }

    // 爆発円形エフェクト
    const burst = document.createElement('div');
    burst.style.position = 'absolute';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    burst.style.width = '40px';
    burst.style.height = '40px';
    burst.style.border = '3px solid #ff922b';
    burst.style.borderRadius = '50%';
    burst.style.pointerEvents = 'none';
    burst.style.zIndex = '55';
    burst.style.animation = 'impactExpand 0.6s ease-out forwards';
    gameBoard.appendChild(burst);

    // テキストエフェクトを自動削除
    setTimeout(() => {
      textEffect.remove();
    }, 700);

    // 星エフェクトを自動削除
    setTimeout(() => {
      const stars = gameBoard.querySelectorAll('.impact-effect');
      stars.forEach(s => s.remove());
    }, 600);

    // バースト円を自動削除
    setTimeout(() => {
      burst.remove();
    }, 600);
  }

  playCelebrationEffect() {
    // すべてのディスクにセレブレーションクラスを追加
    const allDisks = document.querySelectorAll('.disk');
    allDisks.forEach((disk, index) => {
      setTimeout(() => {
        disk.style.animation = 'diskCelebrate 0.8s ease-in-out';
      }, index * 100); // ディスクが順番に動く
    });

    // 花火エフェクト（パーティクル）を生成
    this.createConfetti();
  }

  createConfetti() {
    const gameBoard = document.querySelector('.game-board');
    const colors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#b197fc', '#ff922b'];

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '100';

      gameBoard.appendChild(confetti);

      // アニメーション
      const startX = confetti.offsetLeft;
      const duration = 2000 + Math.random() * 1000;
      const xDrift = (Math.random() - 0.5) * 200;

      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
          confetti.style.top = progress * 300 + 'px';
          confetti.style.left = startX + xDrift * progress + 'px';
          confetti.style.opacity = 1 - progress;
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      };

      requestAnimationFrame(animate);
    }
  }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
  new GameUI();
});
