const students = {
  "std-001": {
    name: "李尚达",
    count: 13,
    errors: [
      ["E0001", "平面向量基本定理与共线向量定理综合运用", "K05-02 平面向量", "利用基底分解与共线向量系数和公式求解。"],
      ["E0002", "概率与数理统计综合题中的期待值计算", "K10-02 概率与统计", "建立离散型随机变量分布列并计算期望。"],
      ["E0003", "解析几何中圆与直线的位置关系", "K08-01 解析几何", "利用圆心到直线的距离 d 与半径 r 的关系求解。"],
      ["E0004", "数列递推公式与通项公式求解", "K06-02 数列", "构造等比数列或累加法求解通项公式。"],
      ["E0005", "椭圆双割线焦点弦性质探究", "K08-02 椭圆与双曲线", "利用设而不求法与韦达定理化简交点坐标。"],
      ["E0006", "椭圆离心率最值与范围问题", "K08-02 椭圆", "建立 a, b, c 的齐次不等式求解离心率范围。"],
      ["E0007", "双曲线渐近线与离心率几何关系", "K08-03 双曲线", "利用渐近线倾斜角与离心率的三角关系。"],
      ["E0008", "导数在函数单调性与隐零点中的应用", "K03-05 导数及其应用", "利用二次求导与隐零点虚设求解最值。"],
      ["E0009", "解三角形中线向量最值与爪型补角结构", "K04-05 解三角形", "利用中线向量极化恒等式或基底平移。"],
      ["E0010", "解三角形边角转化与正余弦定理综合", "K04-05 解三角形", "统一边角表示并结合余弦定理求取值范围。"],
      ["E0011", "平面向量平行四边形交点坐标分解", "K05-02 平面向量", "构建坐标系利用向量数量积与模求解。"],
      ["E0012", "三点共线向量系数和定值定理", "K05-02 平面向量", "利用向量共线系数和等于 1 快速证明。"],
      ["E0013", "分线段交点比例向量基底展开", "K05-02 平面向量", "利用分比定理与向量分解式化简。"]
    ]
  },
  "std-002": {
    name: "徐同学",
    count: 7,
    errors: [
      ["E-1001", "抽象复合函数定义域与分式/零次幂限制", "K03-01 函数定义域", "列出不等式组取交集求定义域。"],
      ["E-1002", "换元法求解析式未补全新变量定义域", "K03-01 函数解析式", "换元必换域，确定新变量 t 的取值范围。"],
      ["E-1003", "复合函数‘同增异减’单调区间判定", "K03-02 函数单调性", "根据内外层单调性判定复合函数增减。"],
      ["E-1004", "抽象函数赋值法与奇偶性综合", "K03-02 奇偶性", "利用赋值法与奇偶性求解已知函数值。"],
      ["E-1005", "周期性与奇偶性结合的大数求值", "K03-02 周期对称", "由 f(x-3)=-f(x) 得 T=6，取模计算。"],
      ["E-1006", "二次函数在动区间 [0, m] 上的值域与边界", "K04-02 二次函数", "分类讨论区间是否包含对称轴顶点。"],
      ["E-1007", "对数复合函数定义域、奇偶性与单调性", "K03-05 对数函数", "真数大于 0 确定定义域并验证奇偶性。"]
    ]
  }
};

const modules = [
  ['K01 集合与常用逻辑用语', 100, 31, 'K01'],
  ['K02 不等式', 100, 38, 'K02'],
  ['K03 函数与导数', 75, 100, 'K03'],
  ['K04 三角函数与解三角形', 65, 62, 'K04'],
  ['K05 平面向量与复数', 60, 37, 'K05'],
  ['K06 数列', 80, 42, 'K06'],
  ['K07 立体几何', 100, 50, 'K07'],
  ['K08 解析几何', 65, 55, 'K08'],
  ['K09 计数原理', 100, 28, 'K09'],
  ['K10 概率与统计', 75, 54, 'K10'],
  ['K11 高等背景拓展', 100, 22, 'K11']
];

let currentStudentId = "std-001";
let mode = 'tree';

function switchStudent(id) {
  currentStudentId = id;
  render();
}

function view(v, b) {
  mode = v;
  document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  render();
}

function render() {
  const q = document.querySelector('#search').value.toLowerCase();
  const list = document.querySelector('#list');
  const stu = students[currentStudentId];

  if (mode === 'tree') {
    list.innerHTML = modules
      .filter(x => x.join('').toLowerCase().includes(q))
      .map((x, i) => `
        <div class="item" onclick="showTree(${i})">
          <b>${x[0]}</b>
          <div class="muted">${x[2]} 个考点节点 · 动态掌握度 ${x[1]}%</div>
          <div class="bar"><i style="width:${x[1]}%"></i></div>
        </div>
      `).join('');
  } else {
    list.innerHTML = stu.errors
      .filter(x => x.join('').toLowerCase().includes(q))
      .map((x, i) => `
        <div class="item" onclick="showError(${i})">
          <span class="tag">${x[0]} · ${x[2]}</span><br>
          <b>${x[1]}</b>
          <p class="muted" style="margin:4px 0 0;font-size:12px;">${x[3]}</p>
        </div>
      `).join('');
  }
}

function showTree(i) {
  const x = modules[i];
  document.querySelector('#detail').innerHTML = `
    <span class="tag">11 模块 · 469 考点</span>
    <h3>${x[0]}</h3>
    <p>该模块包含 ${x[2]} 个二级与三级考点节点。动态掌握度估计为 ${x[1]}%。</p>
  `;
}

function showError(i) {
  const e = students[currentStudentId].errors[i];
  document.querySelector('#detail').innerHTML = `
    <span class="tag">${e[0]} · ${e[2]}</span>
    <h3>${e[1]}</h3>
    <p style="margin-top:12px;line-height:1.6;">${e[3]}</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});
