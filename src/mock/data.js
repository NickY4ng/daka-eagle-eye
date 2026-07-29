/**
 * Mock 数据层 — 为静态原型提供所有展示数据
 */

// ============ 假 Token ============
export const MOCK_TOKEN = 'mock_token_demo_2026';

// ============ Mock 会话 ============
const now = Date.now();

export const mockSessions = [
    {
        sessionId: 'mock-session-000',
        title: '本月物流成本分析报告',
        createTime: new Date(now).toISOString(),
    },
    {
        sessionId: 'mock-session-001',
        title: '近30天运单趋势分析',
        createTime: new Date(now - 86400000 * 3).toISOString(),
    },
    {
        sessionId: 'mock-session-002',
        title: '各线路成本对比分析',
        createTime: new Date(now - 86400000 * 2).toISOString(),
    },
    {
        sessionId: 'mock-session-003',
        title: '月度运营效率报告',
        createTime: new Date(now - 86400000).toISOString(),
    },
];

// ============ Mock 会话详情（消息记录） ============
function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getMockSessionDetails(sessionId) {
    if (sessionId === 'mock-session-000') {
        return {
            data: [
                {
                    question: '本月的各工厂发运量和各路线运输距离分析',
                    answer: `## 📊 蒙牛常温事业部 · 发运分析报告

### 📌 核心指标概览

| 指标 | 数值 | 数据来源 |
|------|------|----------|
| 发运总车次 | **14 次** | shipping_orders.trip_no |
| 总发运毛重 | **315.1 吨** | shipping_orders.gross_weight_t |
| 总发运净重 | **250.5 吨** | shipping_orders.net_weight_t |
| 平均运输距离 | **581 km** | shipping_orders.distance_km |

### 🏭 各工厂发运量

| 工厂 | 车次 | 毛重(吨) | 占比 |
|------|------|---------|------|
| 滦南常温工厂 | 4 | 70.0 | 22.2% |
| 和林事业部常温虚拟工厂 | 2 | 58.2 | 18.5% |
| 武汉常温工厂 | 3 | 77.6 | 24.6% |
| 成都常温工厂 | 2 | 68.8 | 21.8% |

> 💡 以上指标均可追溯至 shipping_orders 表，经数据治理模块的清洗规则和转换规则处理后得出。`,
                    timestamp: now - 3600000,
                },
                {
                    question: '按承运商和车型再拆分一下',
                    answer: `## 🚛 承运商 × 车型交叉分析

### 各承运商发运量

| 承运商 | 车次 | 总毛重(吨) | 平均运距(km) |
|--------|------|-----------|-------------|
| 北京鲲鹏顺达 | 3 | 51.5 | 180 |
| 芜湖安得智联 | 4 | 75.7 | 769 |
| 内蒙古信远物流 | 2 | 58.2 | 907 |
| 河南畅通物流 | 3 | 77.6 | 415 |

### 车型分布

| 车型 | 车次 | 单车均重(吨) |
|------|------|-------------|
| 4.2米箱车 | 2 | 9.7 |
| 6.8米高栏 | 2 | 10.4 |
| 9.6米厢货 | 3 | 19.6 |
| 13米半挂 | 3 | 33.6 |
| 16.5米厢货 | 4 | 28.9 |

> 📥 数据来源: shipping_orders.carrier_name, vehicle_type, gross_weight_t`,
                    timestamp: now - 3000000,
                },
                {
                    question: '检查一下数据质量有没有异常',
                    answer: `## 🔶 数据质量异常预警报告

### 校验结果

| 校验项 | 结果 | 问题数 |
|--------|------|--------|
| 运输距离合理性 | ✅ 通过 | 0 |
| 毛重净重比合理性 | ⚠️ 警告 | 3 |
| 装运单状态流转 | 🔴 失败 | 2 |
| 跨表匹配 | ⚠️ 警告 | 4 |

### 🔴 需处理：状态流转异常

ID 7005454801 (滦南→北京朝阳) 和 7005454900 (上海分拨→徐汇) 状态直接从"新增"跳到"已完成"。

> 💡 预警来自**数据治理→校验规则**每日自动检查。`,
                    timestamp: now - 2400000,
                },
            ],
            totalPage: 1,
        };
    }

    if (sessionId === 'mock-session-001') {
        return {
            data: [
                {
                    question: '本月各承运商的发运量对比',
                    answer: `## 🚛 蒙牛常温事业部 · 承运商发运分析

### 各承运商发运量统计

| 承运商 | 车次数 | 总毛重(吨) | 平均运距(km) | 主要路线 |
|--------|--------|-----------|-------------|----------|
| 北京鲲鹏顺达 | 3 | 51.5 | 180 | 滦南-唐秦 |
| 芜湖安得智联 | 4 | 75.7 | 769 | 焦作-豫北/成都 |
| 内蒙古信远物流 | 2 | 58.2 | 907 | 和林-鄂东/华北 |
| 河南畅通物流 | 3 | 77.6 | 415 | 武汉-华中 |
| 河北恒通物流 | 1 | 18.5 | 285 | 滦南-京津 |
| 山东速达货运 | 1 | 33.6 | 1180 | 成都-西南 |

> 💡 数据来源: shipping_orders.carrier_name, gross_weight_t, distance_km`,
                    timestamp: now - 86400000 * 3,
                },
                {
                    question: '按车型再分析一下各承运商的运力利用',
                    answer: `## 🚛 车型运力分布分析

### 车型使用频次

| 车型 | 车次 | 总毛重(吨) | 单车均重(吨) |
|------|------|-----------|-------------|
| 4.2米箱车 | 2 | 19.4 | 9.7 |
| 6.8米高栏 | 2 | 20.7 | 10.4 |
| 9.6米厢货 | 3 | 58.7 | 19.6 |
| 13米半挂 | 3 | 100.9 | 33.6 |
| 16.5米厢货 | 4 | 115.4 | 28.9 |

> 📌 13米半挂单车载重最高(33.6吨)，但使用率仅21%，建议长途线路优先调配。`,
                    timestamp: now - 86400000 * 3 + 60000,
                },
                {
                    question: '检查一下有没有数据质量问题',
                    answer: `## 🔶 数据质量检查

| 检查项 | 结果 | 详情 |
|--------|------|------|
| 装运编号唯一性 | ✅ 通过 | 14条无重复 |
| 车牌号格式 | ⚠️ 2条异常 | 非标准格式 |
| 状态流转 | 🔴 2条失败 | 跳变 |
| 毛净重比 | ⚠️ 3条警告 | >2.0 |

> 💡 预警来自**数据治理→校验规则**。`,
                    timestamp: now - 86400000 * 3 + 120000,
                },
            ],
            totalPage: 1,
        };
    }

    if (sessionId === 'mock-session-002') {
        return {
            data: [
                {
                    question: '分析各工厂发运量，看看哪个工厂发货最多',
                    answer: `## 🏭 蒙牛常温事业部 · 各工厂发运量对比

### 各工厂发运量统计

| 工厂 | 车次 | 毛重(吨) | 净重(吨) | 占比 |
|------|------|---------|---------|------|
| 滦南常温工厂 | 4 | 70.0 | 60.0 | 22.2% |
| 和林事业部常温虚拟工厂 | 2 | 58.2 | 48.6 | 18.5% |
| 武汉常温工厂 | 3 | 77.6 | 63.9 | 24.6% |
| 成都常温工厂 | 2 | 68.8 | 58.0 | 21.8% |
| 焦作常温虚拟工厂 | 2 | 35.3 | 22.6 | 11.2% |
| 上海分拨 | 1 | 5.2 | 3.9 | 1.7% |

### 📊 关键发现

- **武汉工厂**发运量最高（77.6吨），主要服务华中区域
- **滦南工厂**车次最多（4次），短途高频区域配送
- **成都工厂**单车载重最大（平均34.4吨），长途跨省运输

> 💡 数据来源: shipping_orders.factory_name, gross_weight_t, net_weight_t`,
                    timestamp: now - 86400000 * 2,
                },
                {
                    question: '对比一下各条路线的运输效率',
                    answer: `## 🛣️ 各路线运输效率对比

| 路线 | 车次 | 平均运距(km) | 单车均重(吨) |
|------|------|-------------|-------------|
| 成都基地-西南 | 2 | 1815 | 34.4 |
| 和林基地-鄂东 | 1 | 1328 | 28.7 |
| 和林基地-华北 | 1 | 485 | 29.5 |
| 武汉基地-华中 | 2 | 600 | 25.9 |
| 武汉基地-华南 | 1 | 45 | 26.4 |
| 滦南事业部-唐秦 | 3 | 180 | 17.2 |
| 滦南事业部-京津 | 1 | 285 | 18.5 |

> 📌 长途线路(成都/和林)单车载重更高，短途区域配送(滦南)频率更高但单车载重较低。`,
                    timestamp: now - 86400000 * 2 + 60000,
                },
            ],
            totalPage: 1,
        };
    }

    if (sessionId === 'mock-session-003') {
        return {
            data: [
                {
                    question: '交运单的客户交货数量排行和过账率分析',
                    answer: `## 📦 蒙牛常温事业部 · 客户交货分析

### 各客户交货数量排行

| 客户 | 交货单数 | 总数量(件) | 总净重(kg) |
|------|---------|-----------|-----------|
| 唐山君晟达商贸 | 3 | 3,630 | 12,331 |
| 北京朝阳商贸 | 2 | 4,000 | 17,801 |
| 蒙牛湖北武汉中央仓 | 1 | 4,002 | 24,492 |
| 郑州中原商贸 | 2 | 8,400 | 26,000 |
| 许昌帮晟商贸 | 1 | 3,528 | 7,056 |

### 📊 交货状态分布

| 状态 | 单数 | 占比 |
|------|------|------|
| 已过账 | 7 | 58% |
| 新增+待审核 | 5 | 42% |

> 💡 数据来源: delivery_orders.customer_name, delivery_qty, net_weight_kg, posting_status`,
                    timestamp: now - 86400000,
                },
                {
                    question: '发货单和交运单有数据不匹配的吗',
                    answer: `## 🔶 发货单↔交运单 跨表匹配检查

### 匹配结果

| 检查项 | 结果 | 详情 |
|--------|------|------|
| 交运净重 vs 发货毛重 | ⚠️ 4条不匹配 | 交运净重换算吨 > 发货毛重 |
| 工厂编码一致性 | ✅ 通过 | 全部一致 |
| 客户编码一致性 | ✅ 通过 | 全部一致 |

### ⚠️ 需关注：跨表重量不匹配

4条交运单的 net_weight_kg/1000 大于对应发货单的 gross_weight_t，可能原因：1) 发货单毛重录入偏低 2) 交运单关联了多个发货单 3) 包装物料重复计算。

> 💡 建议核查 delivery_orders 中 delivery_id 为 839634430, 839634470 的两条记录。`,
                    timestamp: now - 86400000 + 300000,
                },
            ],
            totalPage: 1,
        };
    }

    // 默认返回空
    return { data: [], totalPage: 1 };
}

// ============ Mock 模板数据 ============
export const mockTemplateList = {
    code: 0,
    message: '请求成功',
    data: [
    // ---- AI分析技能（type=1）----
        {
            id: '1', userId: '0', type: 1,
            title: '工厂发运量对比分析',
            content: '# 各工厂发运量对比\n\n按工厂统计发运车次、总毛重、总净重、平均运距，对比各工厂的发运能力。',
            tbCode: '01',
            access: 1,
        },
        {
            id: '2', userId: '0', type: 1,
            title: '路线运输效率分析',
            content: '# 路线运输效率分析\n\n分析各装运路线的运输距离、车型分布、承运商绩效，识别高效路线与瓶颈。',
            tbCode: '02',
            access: 1,
        },
        {
            id: '3', userId: '0', type: 1,
            title: '承运商绩效分析',
            content: '# 承运商绩效分析\n\n按承运商统计发运量、平均运距、单车载重，辅助承运商评估与管理。',
            tbCode: '03',
            access: 1,
        },
        {
            id: '4', userId: '0', type: 1,
            title: '车型运力分布分析',
            content: '# 车型运力分布\n\n统计各车型的使用频次、单车均重、体积利用率，优化车型调配。',
            tbCode: '04',
            access: 1,
        },
        {
            id: '5', userId: '0', type: 1,
            title: '客户交货排行分析',
            content: '# 客户交货排行\n\n按客户统计交货数量、净重、过账率，识别重点客户需求。',
            tbCode: '05',
            access: 1,
        },
        // ---- 数据下载技能（type=2）----
        {
            id: '6', userId: '0', type: 2,
            title: '发货单明细下载',
            content: '# 发货单明细下载\n\n按工厂/路线/时间范围筛选发货单明细并导出Excel。包含装运编号、车牌号、毛净重、运距等。',
            tbCode: '51',
            access: 1,
        },
        {
            id: '7', userId: '0', type: 2,
            title: '交运单明细下载',
            content: '# 交运单明细下载\n\n按客户/工厂/时间范围筛选交运单明细并导出Excel。包含交货数量、净重、过账状态等。',
            tbCode: '52',
            access: 1,
        },
        {
            id: '8', userId: '0', type: 2,
            title: '承运商结算数据下载',
            content: '# 承运商结算数据下载\n\n按承运商与时间范围导出运输明细数据，用于对账结算。',
            tbCode: '53',
            access: 0,
        },
        // ---- 其他技能（type=3）----
        {
            id: '9', userId: '0', type: 3,
            title: '工厂编码→名称映射',
            content: '# 工厂编码→名称映射\n\n将工厂编码还原为实际工厂名称，用于跨表关联分析。',
            tbCode: '81',
            access: 1,
        },
    ],
};

// ============ Mock 报告 HTML ============
export const mockReportHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>蒙牛常温事业部物流成本分析报告</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; }
  .container { max-width: 960px; margin: 0 auto; padding: 40px 24px; }
  .header { background: linear-gradient(135deg, #1e40af, #0891b2); color: white; padding: 48px 40px; border-radius: 16px; margin-bottom: 32px; }
  .header h1 { font-size: 28px; margin-bottom: 8px; }
  .header p { opacity: 0.9; font-size: 14px; }
  .card { background: white; border-radius: 12px; padding: 28px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  .card h2 { font-size: 18px; color: #0f172a; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
  th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
  td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; }
  tr:hover td { background: #f8fafc; }
  .highlight { color: #0891b2; font-weight: 600; }
  .tag { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
  .tag-up { background: #dcfce7; color: #16a34a; }
  .tag-down { background: #fef2f2; color: #dc2626; }
  .insight { background: #f0f9ff; border-left: 4px solid #0891b2; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .stat { text-align: center; padding: 20px; }
  .stat .num { font-size: 32px; font-weight: 700; color: #1e40af; }
  .stat .label { font-size: 13px; color: #64748b; margin-top: 4px; }
  .bar-chart { display: flex; flex-direction: column; gap: 8px; }
  .bar-row { display: flex; align-items: center; gap: 10px; }
  .bar-label { width: 80px; font-size: 13px; text-align: right; color: #475569; }
  .bar-track { flex: 1; height: 24px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #0891b2, #06b6d4); display: flex; align-items: center; padding-left: 8px; font-size: 12px; color: white; font-weight: 500; }
  @media print { body { background: white; } .card { box-shadow: none; border: 1px solid #e2e8f0; } }
</style>
</head>
<body>
<div class="container">

<div class="header">
  <h1>📊 蒙牛常温事业部物流成本分析报告</h1>
  <p>报告周期：2026年7月 &nbsp;|&nbsp; 生成时间：2026-07-14 09:30 &nbsp;|&nbsp; 数据来源：蒙牛物流数据平台</p>
</div>

<div class="grid-2">
  <div class="card"><div class="stat"><div class="num">14</div><div class="label">发运总车次</div></div></div>
  <div class="card"><div class="stat"><div class="num">315.1<span style="font-size:16px">吨</span></div><div class="label">总发运毛重</div></div></div>
  <div class="card"><div class="stat"><div class="num">581<span style="font-size:16px">km</span></div><div class="label">平均运输距离</div></div></div>
  <div class="card"><div class="stat"><div class="num">16,715<span style="font-size:16px">件</span></div><div class="label">交运总数量</div></div></div>
</div>

<div class="card">
  <h2>🏭 各工厂发运量</h2>
  <div class="bar-chart">
    <div class="bar-row"><span class="bar-label">武汉常温工厂</span><div class="bar-track"><div class="bar-fill" style="width:100%">3车次 · 77.6吨</div></div></div>
    <div class="bar-row"><span class="bar-label">滦南常温工厂</span><div class="bar-track"><div class="bar-fill" style="width:90%">4车次 · 70.0吨</div></div></div>
    <div class="bar-row"><span class="bar-label">成都常温工厂</span><div class="bar-track"><div class="bar-fill" style="width:89%">2车次 · 68.8吨</div></div></div>
    <div class="bar-row"><span class="bar-label">和林事业部</span><div class="bar-track"><div class="bar-fill" style="width:75%">2车次 · 58.2吨</div></div></div>
    <div class="bar-row"><span class="bar-label">焦作虚拟工厂</span><div class="bar-track"><div class="bar-fill" style="width:45%">2车次 · 35.3吨</div></div></div>
  </div>
</div>

<div class="card">
  <h2>🚛 承运商发运量 TOP5</h2>
  <table>
    <thead><tr><th>排名</th><th>承运商</th><th>车次</th><th>总毛重(吨)</th><th>平均运距(km)</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>河南畅通物流</td><td>3</td><td>77.6</td><td>415</td></tr>
      <tr><td>2</td><td>芜湖安得智联</td><td>4</td><td>75.7</td><td>769</td></tr>
      <tr><td>3</td><td>内蒙古信远物流</td><td>2</td><td>58.2</td><td>907</td></tr>
      <tr><td>4</td><td>北京鲲鹏顺达</td><td>3</td><td>51.5</td><td>180</td></tr>
      <tr><td>5</td><td>山东速达货运</td><td>1</td><td>33.6</td><td>1,180</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <h2>🛣️ 各路线运输距离对比</h2>
  <table>
    <thead><tr><th>路线</th><th>车次</th><th>平均运距(km)</th><th>单车均重(吨)</th><th>评价</th></tr></thead>
    <tbody>
      <tr><td>成都基地-西南</td><td>2</td><td>1815</td><td>34.4</td><td><span class="tag tag-up">长途高效</span></td></tr>
      <tr><td>和林基地-鄂东</td><td>1</td><td>1328</td><td>28.7</td><td><span class="tag tag-up">长距离大载</span></td></tr>
      <tr><td>武汉基地-华中</td><td>2</td><td>600</td><td>25.9</td><td><span class="tag tag-up">中距标准</span></td></tr>
      <tr><td>滦南事业部-唐秦</td><td>3</td><td>180</td><td>17.2</td><td>区域配送</td></tr>
    </tbody>
  </table>
</div>

<div class="insight">
  <strong>💡 关键洞察：</strong><br>
  1. 武汉常温工厂发运量最高（77.6吨），是华中区域的核心物流枢纽。<br>
  2. 成都基地线路平均运距最长(1815km)，单车载重也最高(34.4吨)，跨省运输效率最高。<br>
  3. 河南畅通物流以3车次发运77.6吨，单车效率排名第一。
</div>

<div class="card">
  <h2>📈 车型分布统计</h2>
  <table>
    <thead><tr><th>车型</th><th>车次</th><th>总毛重(吨)</th><th>单车均重(吨)</th></tr></thead>
    <tbody>
      <tr><td>16.5米厢货</td><td>4</td><td>115.4</td><td>28.9</td></tr>
      <tr><td>13米半挂</td><td>3</td><td>100.9</td><td>33.6</td></tr>
      <tr><td>9.6米厢货</td><td>3</td><td>58.7</td><td>19.6</td></tr>
      <tr><td>6.8米高栏</td><td>2</td><td>20.7</td><td>10.4</td></tr>
      <tr><td>4.2米箱车</td><td>2</td><td>19.4</td><td>9.7</td></tr>
    </tbody>
  </table>
  <p style="margin-top:12px;font-size:13px;color:#64748b;">📌 13米半挂单车载重最高，但车次占比仅21%，建议长途线路优先调配此类车型。</p>
</div>

<p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:32px;">蒙牛智能报表 &nbsp;|&nbsp; 本报告由AI自动生成，仅供参考</p>

</div>
</body>
</html>`;

// ============ Mock 登录响应 ============
export const mockLoginResponse = {
    data: {
        code: 0,
        message: '登录成功',
        data: MOCK_TOKEN,
    },
    headers: {
        'x-captcha-uuid': 'mock-captcha-uuid',
    },
};

// ============ Mock 验证码 ============
export function createMockCaptchaBlob() {
    // 返回一个简单的 SVG 图片作为验证码占位
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44">
  <rect width="120" height="44" fill="#f1f5f9" rx="4"/>
  <text x="20" y="30" font-family="monospace" font-size="22" fill="#1e40af" font-weight="bold">AB3K</text>
  <line x1="10" y1="10" x2="50" y2="30" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="60" y1="5" x2="100" y2="35" stroke="#94a3b8" stroke-width="1"/>
  <circle cx="80" cy="20" r="8" fill="none" stroke="#cbd5e1" stroke-width="2"/>
</svg>`;
    return new Blob([svg], { type: 'image/svg+xml' });
}

// ============ Mock 文件上传响应 ============
export const mockUploadResponse = {
    data: {
        code: 0,
        data: { url: 'https://mock.example.com/files/demo_data.xlsx' },
    },
};

// ============ Mock 消息发送响应 ============
export const mockMessageSendResponse = { code: 0, message: 'ok' };

// ============ Mock 会话 SSE 数据 ============
// 模拟 SSE 推送的处理步骤
export function createMockSseSteps() {
    return [
        {
            status: 1,
            mediaType: 0,
            content: '## 📋 理解需求\n| 意图识别\n\n正在解析用户查询意图，识别报表类型与分析维度...',
        },
        {
            status: 1,
            mediaType: 0,
            content: '## 🔍 指标计算\n| 数据检索与聚合\n\n根据指标定义从数据源检索数据，执行清洗与转换规则...',
        },
        {
            status: 1,
            mediaType: 0,
            content: '## 📊 构建报表\n| 报表组装\n\n基于分析结果构建结构化报表，标注数据追溯来源...',
        },
    ];
}

// 模拟 SSE 最终回答
export function createMockSseAnswer() {
    return {
        status: 2,
        mediaType: 0,
        content: `## 📊 数据分析结果

根据您的问题，以下是分析结果：

### 核心发现

1. **运输量集中度高**：常温事业部占总量45.3%，产业集聚效应显著
2. **成本优势明显**：主要线路吨公里成本低于行业均值5%-13%，具有较强竞争力
3. **季节性特征**：7月为夏季旺季，运量环比增长32%，呈持续上升趋势

### 数据明细

| 指标 | 数值 | 同比 | 数据来源 |
|------|------|------|----------|
| 发运总车次 | 14次 | +27.3% | shipping_orders.trip_no |
| 总发运毛重 | 315.1吨 | +32.1% | shipping_orders.gross_weight_t |
| 交运总数量 | 16,715件 | +18.5% | delivery_orders.delivery_qty |

> 💡 如需查看完整报告，可选择 HTML 格式或 Excel 格式输出。每个指标均可追溯至源表字段，追溯链路见**数据治理→指标定义**模块。`,
    };
}

// 模拟 SSE 报告生成消息
export function createMockSseReport(taskId) {
    return {
        status: 2,
        mediaType: 2,
        content: 'https://mock.example.com/reports/demo_report.html',
        taskId,
    };
}
