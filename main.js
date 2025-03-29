const typeContainer = document.getElementById('type-container');
const dualType1 = document.getElementById('dual-type-1');
const dualType2 = document.getElementById('dual-type-2');
const resultDiv = document.getElementById('result');
const calculateBtn = document.getElementById('calculate-btn');

let selectedDualType1 = null;
let selectedDualType2 = null;

// 生成按鈕
function createButtons(container, isDual = false, group = 1) {
  Object.keys(typeChart).forEach(type => {
    const btn = document.createElement('button');
    btn.textContent = type;
    btn.className = isDual ? 'dual-button' : 'type-button';
    btn.addEventListener('click', () => {
      if (isDual) {
        if (group === 1) {
          selectedDualType1 = type;
          updateActive(dualType1, type);
        } else {
          selectedDualType2 = type;
          updateActive(dualType2, type);
        }
      } else {
        showResult(type);
      }
    });
    container.appendChild(btn);
  });
}

// 更新雙屬性選擇高亮
function updateActive(container, type) {
  const buttons = container.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.textContent === type);
  });
}

// 顯示單屬性結果
function showResult(type) {
  const data = typeChart[type];
  resultDiv.innerHTML = `
    <h3>🟢 ${type} 屬性相剋資訊</h3>
    <p><strong>弱點：</strong>${data.weak.join('、') || '無'}</p>
    <p><strong>抗性：</strong>${data.resist.join('、') || '無'}</p>
    <p><strong>傷害加成：</strong>${data.strong.join('、') || '無'}</p>
  `;
}

// 計算雙屬性
function calculateDual() {
  if (!selectedDualType1 || !selectedDualType2) {
    alert('請選擇兩個屬性');
    return;
  }

  const type1 = typeChart[selectedDualType1];
  const type2 = typeChart[selectedDualType2];

  const combinedWeak = [...type1.weak, ...type2.weak];
  const combinedResist = [...type1.resist, ...type2.resist];

  // 抵銷計算
  const finalWeak = [];
  const finalResist = [];

  Object.keys(typeChart).forEach(attackingType => {
    const weakCount = combinedWeak.filter(t => t === attackingType).length;
    const resistCount = combinedResist.filter(t => t === attackingType).length;

    if (weakCount > resistCount) finalWeak.push(attackingType);
    else if (resistCount > weakCount) finalResist.push(attackingType);
  });

  resultDiv.innerHTML = `
    <h3>🟣 ${selectedDualType1} + ${selectedDualType2} 屬性相剋資訊</h3>
    <p><strong>弱點：</strong>${finalWeak.join('、') || '無'}</p>
    <p><strong>抗性：</strong>${finalResist.join('、') || '無'}</p>
  `;
}

// 初始化
createButtons(typeContainer);
createButtons(dualType1, true, 1);
createButtons(dualType2, true, 2);
calculateBtn.addEventListener('click', calculateDual);
