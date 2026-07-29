<!-- eslint-disable -->
<script setup>
/* eslint-disable */
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search, BookOpen, Library, Calculator, Database,
  HelpCircle, ChevronRight, FileText, Truck, MapPin, BarChart3,
} from 'lucide-vue-next';

const searchQuery = ref('');
const activeTab = ref('glossary');

// ============== 业务术语表（基于真实数据字段）==============
const glossaryTerms = ref([
  { term: '装运单(发货单)', abbr: 'Shipment', category: '基础概念',
    definition: '记录一次完整的发运任务：从工厂装载→运输→送达客户。包含车辆、司机、货物、路线、承运商等全链路信息。',
    formula: '', source: 'shipping_orders 表，64个字段',
    examples: ['装运编号 7005454781 = 滦南工厂→唐山君晟达，61km'] },
  { term: '交运单', abbr: 'Delivery', category: '基础概念',
    definition: '记录交货执行的详细信息，与发货单相互独立。包含交货数量、净重/毛重、过账状态、时间节点等。',
    formula: '', source: 'delivery_orders 表，36个字段',
    examples: ['交货单号 839633540 = 上海分拨→上海魅香食品，500件'] },
  { term: '毛重', abbr: 'GW', category: '重量指标',
    definition: '包含货物+包装+托盘等在内的总重量（吨）。发运计费和车辆载重均以毛重为准。',
    formula: '', source: 'shipping_orders.gross_weight_t',
    examples: ['16.5米厢货单车最大毛重约29吨'] },
  { term: '净重', abbr: 'NW', category: '重量指标',
    definition: '扣除包装和托盘后的货物净重（吨）。用于库存管理和客户结算。',
    formula: '', source: 'shipping_orders.net_weight_t',
    examples: ['毛重18.52吨，净重14.31吨 → 包装占比22.7%'] },
  { term: '毛净重比率', abbr: 'GNR', category: '效率指标',
    definition: '毛重÷净重，反映包装和装载辅材的占比。正常范围1.2~2.0，超出说明存在异常。',
    formula: 'gross_weight_t / net_weight_t',
    source: 'shipping_orders.gross_weight_t, net_weight_t → 转换规则',
    examples: ['健康毛净比约1.3~1.5，>2.0触发数据质量预警'] },
  { term: '吨公里运量', abbr: 'Ton-Km', category: '效率指标',
    definition: '运输工作量核心指标 = 毛重(吨) × 运输距离(公里)。用于承运商运费核算和效率对比。',
    formula: 'gross_weight_t × distance_km',
    source: 'shipping_orders.gross_weight_t, distance_km',
    examples: ['吨公里费用通常按0.3~0.8元/吨公里结算'] },
  { term: '单件均重', abbr: 'AWI', category: '效率指标',
    definition: '每件货物的平均重量(kg)，用于判断货物品类结构和装载效率。',
    formula: 'net_weight_t × 1000 / total_qty',
    source: 'shipping_orders.net_weight_t, total_qty',
    examples: ['净重7.17吨÷1815件≈3.95kg/件（常温液态奶典型值）'] },
  { term: '过账状态', abbr: 'Posting', category: '财务概念',
    definition: '交运单是否已完成财务入账。未过账=尚未进入财务系统，已过账=已入账可结算。',
    formula: '', source: 'delivery_orders.posting_status',
    examples: ['已过账率 = 已过账交运单数 ÷ 总交运单数'] },
  { term: '交货优先权', abbr: 'Priority', category: '运营概念',
    definition: '交运单的紧急程度，1=最高优先（需立即处理），2=常规，3=可延后。',
    formula: '', source: 'delivery_orders.priority',
    examples: ['优先权1的发运单平均发货时间比2快4小时'] },
  { term: '装运路线', abbr: 'Route', category: '运营概念',
    definition: '预定义的运输路线，包含起点工厂和终点区域。每条路线有固定编码和名称。',
    formula: '', source: 'shipping_orders.route_code, route_name',
    examples: ['CQ4144 = 常温滦南事业部-唐秦-汽运', 'CQ0024 = 和林基地-鄂东'] },
  { term: '数据治理', abbr: 'DG', category: '数据管理',
    definition: '对发货单+交运单数据进行清洗(去重/格式校验)、转换(单位换算/计算列)、校验(业务规则)的标准化流程。',
    examples: ['清洗规则: 装运编号去重、车牌号格式校验', '校验规则: 毛净比合理性、状态流转、跨表匹配'] },
  { term: '数据追溯', abbr: 'Trace', category: '数据管理',
    definition: '每个报表指标都可追溯到 shipping_orders 或 delivery_orders 的具体字段和计算逻辑。',
    examples: ['吨公里运量 → gross_weight_t × distance_km → shipping_orders'] },
]);

const glossaryCategories = [...new Set(glossaryTerms.value.map(t => t.category))];

// ============== 报表模板库（基于真实业务场景）==============
const reportTemplates = ref([
  { id: '1', name: '工厂发运量对比报告', category: '发运分析', usage: '周度/月度',
    description: '按工厂(滦南/和林/焦作/武汉/成都/上海)统计发运车次、毛重、净重、平均运距',
    sections: ['工厂发运总览', '毛重vs净重对比', '平均运距排行', '车型分布'],
    indicators: ['发运总车次', '总发运毛重', '总发运净重', '平均运输距离'] },
  { id: '2', name: '路线运输效率分析', category: '效率分析', usage: '月度',
    description: '10条装运路线的运距、车型分布、承运商绩效对比，辅助路线优化',
    sections: ['路线运距对比', '路线发运量排行', '车型-路线交叉分析'],
    indicators: ['各路线发运车次', '平均运距', '单车均重'] },
  { id: '3', name: '承运商绩效分析', category: '承运商管理', usage: '月度',
    description: '6家承运商的发运量、平均运距、单车载重对比，辅助供应商评估',
    sections: ['承运商发运量排行', '运距与载重效率', '主要服务路线'],
    indicators: ['承运商车次数', '总毛重', '平均运距', '单车最大毛重'] },
  { id: '4', name: '客户交货分析', category: '客户分析', usage: '月度',
    description: '按客户统计交货数量/净重，分析交货单状态分布和过账率',
    sections: ['客户交货排行', '交货状态分布', '过账率分析', '工厂来源分布'],
    indicators: ['总交货数量', '总交货净重', '交运过账率', '准时发货率'] },
  { id: '5', name: '数据质量巡检报告', category: '质量管理', usage: '每日',
    description: '每日自动执行清洗规则、校验规则，输出质量评分和问题清单',
    sections: ['质量总览(总分+四维)', '清洗规则执行结果', '校验规则结果', '问题清单'],
    indicators: ['完整性得分', '准确性得分', '一致性得分', '及时性得分'] },
  { id: '6', name: '车型运力分析', category: '运营分析', usage: '月度',
    description: '5种车型的使用频次、单车均重、体积利用率对比，优化车型调配',
    sections: ['车型使用频次', '单车均重分布', '体积利用率', '车型-路线匹配'],
    indicators: ['各车型车次数', '单车平均毛重', '毛净比'] },
]);

// ============== 数据源文档（2张核心表）==============
const dataSources = ref([
  { name: 'shipping_orders', label: '发货单表', category: '核心表', rows: '日均200+', update: 'SAP实时同步',
    description: '蒙牛常温事业部发货单主表，记录从工厂到客户的完整发运信息（装运编号、车辆、路线、货物重量、承运商等）',
    fields: [
      { name: 'shipment_id', type: 'VARCHAR(20)', desc: '装运编号（主键）', sample: '7005454781' },
      { name: 'trip_no', type: 'VARCHAR(20)', desc: '发运车次编号', sample: '202607140185' },
      { name: 'factory_code', type: 'VARCHAR(10)', desc: '工厂编码', sample: '3006' },
      { name: 'factory_name', type: 'VARCHAR(50)', desc: '工厂名称', sample: '滦南常温工厂' },
      { name: 'plate_number', type: 'VARCHAR(20)', desc: '车牌号', sample: '冀B07U0S' },
      { name: 'vehicle_type', type: 'VARCHAR(30)', desc: '车型', sample: '4.2米长的箱式车' },
      { name: 'driver_name', type: 'VARCHAR(20)', desc: '司机姓名', sample: '韩雷刚' },
      { name: 'customer_name', type: 'VARCHAR(60)', desc: '客户名称', sample: '唐山君晟达商贸有限公司' },
      { name: 'region', type: 'VARCHAR(50)', desc: '省市区', sample: '河北省唐山市开平区' },
      { name: 'recipient_name', type: 'VARCHAR(60)', desc: '送达方名称' },
      { name: 'distance_km', type: 'DOUBLE', desc: '运输距离(公里)', sample: '61.0' },
      { name: 'gross_weight_t', type: 'DOUBLE', desc: '合计毛重(吨)', sample: '10.89' },
      { name: 'net_weight_t', type: 'DOUBLE', desc: '合计净重(吨)', sample: '7.17' },
      { name: 'volume_cbm', type: 'DOUBLE', desc: '合计体积(m³)', sample: '11.69' },
      { name: 'total_qty', type: 'INT', desc: '合计数量(件)', sample: '1815' },
      { name: 'route_code', type: 'VARCHAR(20)', desc: '装运路线编码' },
      { name: 'route_name', type: 'VARCHAR(60)', desc: '路线名称', sample: '常温滦南事业部-唐秦-汽运' },
      { name: 'carrier_name', type: 'VARCHAR(60)', desc: '承运商名称' },
      { name: 'plan_delivery_date', type: 'DATETIME', desc: '计划交货日期' },
      { name: 'status', type: 'VARCHAR(20)', desc: '状态:新增/已审核/运输中/已完成' },
      { name: 'audit_status', type: 'VARCHAR(20)', desc: '审核状态:待审核/已审核' },
    ]},
  { name: 'delivery_orders', label: '交运单表', category: '核心表', rows: '日均300+', update: 'SAP实时同步',
    description: '蒙牛常温事业部交运单表，记录交货执行的详细信息（交货数量、净重毛重、过账状态、时间节点等）',
    fields: [
      { name: 'delivery_id', type: 'BIGINT', desc: '交货单号（主键）', sample: '839633540' },
      { name: 'delivery_status', type: 'VARCHAR(20)', desc: '状态:新增/待审核/已过账' },
      { name: 'posting_status', type: 'VARCHAR(20)', desc: '过账状态:未过账/已过账' },
      { name: 'delivery_type', type: 'VARCHAR(20)', desc: '交货类型:外向发货' },
      { name: 'warehouse', type: 'VARCHAR(20)', desc: '发货库房编码', sample: 'C224' },
      { name: 'delivery_qty', type: 'INT', desc: '交货数量(件)', sample: '500' },
      { name: 'net_weight_kg', type: 'DOUBLE', desc: '交货单净重(kg)', sample: '3084.0' },
      { name: 'gross_weight_kg', type: 'DOUBLE', desc: '交货单毛重(kg)', sample: '3350.0' },
      { name: 'volume_cdm', type: 'DOUBLE', desc: '体积(CDM)', sample: '4237.0' },
      { name: 'plan_transport_date', type: 'DATE', desc: '运输计划时间' },
      { name: 'plan_ship_date', type: 'DATE', desc: '计划发货时间' },
      { name: 'doc_date', type: 'DATE', desc: '凭证日期' },
      { name: 'priority', type: 'INT', desc: '交货优先权(1最高)', sample: '2' },
      { name: 'customer_name', type: 'VARCHAR(60)', desc: '客户名称' },
      { name: 'recipient_desc', type: 'VARCHAR(60)', desc: '送达方描述' },
      { name: 'factory_name', type: 'VARCHAR(50)', desc: '所属工厂' },
      { name: 'route_code', type: 'VARCHAR(20)', desc: '装运路线编码' },
      { name: 'route_name', type: 'VARCHAR(60)', desc: '装运路线描述' },
      { name: 'carrier_name', type: 'VARCHAR(60)', desc: '所属承运商' },
      { name: 'dest_city', type: 'VARCHAR(30)', desc: '目的地城市' },
      { name: 'src_city', type: 'VARCHAR(30)', desc: '起始地城市' },
    ]},
]);

// ============== FAQ ==============
const faqs = ref([
  { q: '发货单和交运单有什么区别？',
    a: '发货单(shipping_orders)记录从工厂发运的完整信息：车辆、司机、路线、货物毛净重等。交运单(delivery_orders)记录交货执行情况：交货数量、过账状态、时间节点等。两者通过工厂编码、路线编码、客户编码可以关联分析。' },
  { q: '如何生成报表？',
    a: '在左侧「智能报表」中直接输入问题，如"本月的各工厂发运量统计"。系统会智能判断需求是否明确——不明确时会追问时间范围和分析维度——然后自动生成报告。支持HTML和Excel两种格式导出。' },
  { q: '报表数据来源是什么？',
    a: '所有数据均来自直连的蒙牛SAP物流系统，包含两张核心表：shipping_orders(发货单)和delivery_orders(交运单)。每个指标都可追溯到具体表.字段，详见「数据源文档」Tab。' },
  { q: '数据质量如何保证？',
    a: '数据在进入报表前经过三层处理：清洗规则(装运编号去重、车牌号校验、空值检测)→转换规则(毛净比、吨公里、单件均重计算)→校验规则(距离合理性、状态流转、跨表匹配)。每日自动执行，异常标记预警。' },
  { q: '可以修改已生成的报表吗？',
    a: '可以。在同一会话中直接说"加入北京的数据"、"只看武汉工厂的"、"切换到上周"。系统基于已生成结果进行增量调整，无需重新开始。' },
  { q: '什么情况下会出现数据预警？',
    a: '当前设置了5条校验规则：运输距离合理性(1~3000km)、毛净重比(1.2~2.0)、状态流转(必须是标准状态序列)、过账状态(未过账/已过账)、跨表匹配(交运净重≤发货毛重)。超出阈值会标记为警告或失败。' },
  { q: '支持哪些分析维度？',
    a: '支持按工厂(6个)、车型(5种)、承运商(6家)、客户、路线(10条)、区域等多维度拆分分析。可以在提问时指定，如"按车型和承运商拆分发运量"。' },
  { q: '输出格式有哪些？',
    a: 'HTML格式(含表格和样式，适合汇报展示)和Excel格式(含原始数据明细，适合二次分析)。生成报表时系统会主动询问格式偏好。' },
  { q: '能看历史报表吗？',
    a: '可以。左侧会话列表保留所有历史对话和报表。点击会话即可恢复上下文，继续分析或调整。' },
  { q: '各工厂的发货数据在哪里看？',
    a: '在「智能报表」中输入"各工厂发运量对比"即可。滦南、和林、焦作、武汉、成都、上海6个工厂的车次、毛重、净重、平均运距一目了然。' },
]);

const detailOpen = ref(false);
const selectedTerm = ref(null);
function openTermDetail(term) { selectedTerm.value = term; detailOpen.value = true; }
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden bg-white rounded-xl border shadow-sm">
    <div class="px-6 py-4 border-b flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
          <BookOpen class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-800">知识库</h2>
          <p class="text-xs text-slate-500">基于 shipping_orders + delivery_orders 的业务知识沉淀</p>
        </div>
      </div>
      <div class="relative w-64"><Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input v-model="searchQuery" placeholder="搜索知识库..." class="pl-10" /></div>
    </div>
    <Tabs v-model="activeTab" class="flex-1 flex flex-col min-h-0">
      <div class="px-6 pt-3 border-b shrink-0">
        <TabsList class="w-full justify-start gap-1 bg-transparent p-0 h-auto">
          <TabsTrigger value="glossary" class="data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 rounded-lg px-3 py-1.5 text-xs"><BookOpen class="w-3.5 h-3.5 mr-1" />业务术语</TabsTrigger>
          <TabsTrigger value="templates" class="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 rounded-lg px-3 py-1.5 text-xs"><Library class="w-3.5 h-3.5 mr-1" />报表模板</TabsTrigger>
          <TabsTrigger value="indicators" class="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-lg px-3 py-1.5 text-xs"><Calculator class="w-3.5 h-3.5 mr-1" />指标字典</TabsTrigger>
          <TabsTrigger value="datasources" class="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 rounded-lg px-3 py-1.5 text-xs"><Database class="w-3.5 h-3.5 mr-1" />数据源文档</TabsTrigger>
          <TabsTrigger value="faq" class="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 rounded-lg px-3 py-1.5 text-xs"><HelpCircle class="w-3.5 h-3.5 mr-1" />常见问题</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="glossary" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center gap-2 mb-3 flex-wrap"><span class="text-xs text-slate-500">{{ glossaryTerms.length }} 个术语</span><span class="text-[10px] text-slate-300">|</span><button v-for="cat in glossaryCategories" :key="cat" class="text-[11px] px-2 py-0.5 rounded-full border transition-colors" :class="searchQuery === cat ? 'bg-sky-100 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-sky-300'" @click="searchQuery = searchQuery === cat ? '' : cat">{{ cat }}</button></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card v-for="term in glossaryTerms.filter(t => !searchQuery || t.term.includes(searchQuery) || t.category.includes(searchQuery))" :key="term.term" class="hover:shadow-md hover:border-sky-200 transition-all cursor-pointer group" @click="openTermDetail(term)">
            <CardContent class="p-4">
              <div class="flex items-start justify-between mb-2"><div class="flex items-center gap-2"><span class="font-medium text-sm text-slate-800 group-hover:text-sky-700">{{ term.term }}</span><Badge variant="secondary" class="text-[10px] px-1 py-0">{{ term.abbr }}</Badge></div><Badge class="text-[10px] px-1.5 py-0 bg-sky-50 text-sky-600 border-sky-200">{{ term.category }}</Badge></div>
              <p class="text-xs text-slate-500 line-clamp-2 mb-2">{{ term.definition }}</p>
              <div v-if="term.source" class="text-[11px] text-slate-400 font-mono truncate bg-slate-50 rounded px-2 py-1">{{ term.source }}</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="templates" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center gap-2 mb-3"><span class="text-xs text-slate-500">{{ reportTemplates.length }} 个标准模板</span></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card v-for="tpl in reportTemplates" :key="tpl.id" class="hover:shadow-md hover:border-violet-200 transition-all cursor-pointer group">
            <CardContent class="p-4">
              <div class="mb-2"><div class="flex items-center gap-2 mb-1"><FileText class="w-4 h-4 text-violet-500" /><span class="font-medium text-sm text-slate-800 group-hover:text-violet-700">{{ tpl.name }}</span></div><p class="text-xs text-slate-500">{{ tpl.description }}</p></div>
              <div class="flex items-center gap-2 mb-2"><Badge variant="secondary" class="text-[10px] px-1.5 py-0">{{ tpl.category }}</Badge><Badge variant="outline" class="text-[10px] px-1.5 py-0">{{ tpl.usage }}</Badge></div>
              <div class="flex flex-wrap gap-1 mb-2"><span v-for="sec in tpl.sections" :key="sec" class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{{ sec }}</span></div>
              <div class="text-[11px] text-slate-400">包含: {{ tpl.indicators.join('、') }}</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="indicators" class="flex-1 overflow-auto p-6 mt-0">
        <div class="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border mb-4">
          <h4 class="text-sm font-semibold text-teal-800 mb-2">📐 指标穷举方法论：5大类 × 13种分析类型</h4>
          <p class="text-xs text-teal-600 mb-3">从<strong>时间、空间、工厂、客户、车型、重量、成本</strong>七大维度，系统化穷举所有可计算指标</p>
          <div class="grid grid-cols-5 gap-2 text-[11px]">
            <div class="bg-white rounded-lg p-2 text-center border border-teal-100"><span class="font-medium text-teal-700">📈 趋势(2)</span><br><span class="text-slate-400">时序/同比环比</span></div>
            <div class="bg-white rounded-lg p-2 text-center border border-violet-100"><span class="font-medium text-violet-700">📊 结构(3)</span><br><span class="text-slate-400">占比/分布/分级</span></div>
            <div class="bg-white rounded-lg p-2 text-center border border-emerald-100"><span class="font-medium text-emerald-700">🔗 关联(3)</span><br><span class="text-slate-400">交叉/相关性/多表</span></div>
            <div class="bg-white rounded-lg p-2 text-center border border-amber-100"><span class="font-medium text-amber-700">🏆 排名(2)</span><br><span class="text-slate-400">TOP/BOTTOM/对比</span></div>
            <div class="bg-white rounded-lg p-2 text-center border border-rose-100"><span class="font-medium text-rose-700">🎯 比率(3)</span><br><span class="text-slate-400">比率/达标率/异常率</span></div>
          </div>
        </div>
        <div class="flex items-center gap-2 mb-3"><span class="text-xs text-slate-500">10个核心指标，均可追溯至源表字段</span></div>
        <div class="border rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50"><tr><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">指标</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">公式</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">来源</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">单位</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">分类</th></tr></thead><tbody>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">发运总车次</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">COUNT(DISTINCT trip_no)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">shipping_orders.trip_no</td><td class="px-3 py-2.5 text-xs">次</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-purple-50 text-purple-600 px-1 py-0">规模指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">总发运毛重</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">SUM(gross_weight_t)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">shipping_orders.gross_weight_t</td><td class="px-3 py-2.5 text-xs">吨</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-purple-50 text-purple-600 px-1 py-0">规模指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">总交货数量</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">SUM(delivery_qty)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">delivery_orders.delivery_qty</td><td class="px-3 py-2.5 text-xs">件</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-purple-50 text-purple-600 px-1 py-0">规模指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">平均运输距离</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">AVG(distance_km)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">shipping_orders.distance_km</td><td class="px-3 py-2.5 text-xs">km</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-emerald-50 text-emerald-600 px-1 py-0">效率指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">平均单车毛重</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">AVG(gross_weight_t)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">shipping_orders.gross_weight_t</td><td class="px-3 py-2.5 text-xs">吨/车</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-emerald-50 text-emerald-600 px-1 py-0">效率指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">毛净重比率</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">SUM(GW)/SUM(NW)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">gross_weight_t+net_weight_t</td><td class="px-3 py-2.5 text-xs">倍</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-emerald-50 text-emerald-600 px-1 py-0">效率指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">单件均重</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">net_weight_t×1000/total_qty</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">net_weight_t+total_qty</td><td class="px-3 py-2.5 text-xs">kg/件</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-emerald-50 text-emerald-600 px-1 py-0">效率指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">各工厂发运量</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">SUM(GW) GROUP BY factory</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">factory_name+gross_weight_t</td><td class="px-3 py-2.5 text-xs">吨</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-blue-50 text-blue-600 px-1 py-0">结构指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">交运过账率</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">COUNT(已过账)/COUNT(*)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">delivery_orders.posting_status</td><td class="px-3 py-2.5 text-xs">%</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-rose-50 text-rose-600 px-1 py-0">质量指标</Badge></td></tr>
          <tr class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 text-xs font-medium text-slate-800">准时发货率</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">COUNT(按时)/COUNT(*)</td><td class="px-3 py-2.5 text-xs font-mono text-slate-600">ship_date+plan_ship_date</td><td class="px-3 py-2.5 text-xs">%</td><td class="px-3 py-2.5"><Badge class="text-[10px] bg-rose-50 text-rose-600 px-1 py-0">质量指标</Badge></td></tr>
        </tbody></table></div>
      </TabsContent>
      <TabsContent value="datasources" class="flex-1 overflow-auto p-6 mt-0">
        <div class="space-y-4">
          <div v-for="ds in dataSources" :key="ds.name" class="border rounded-lg overflow-hidden">
            <div class="p-4 bg-slate-50/50 border-b flex items-start justify-between">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Database class="w-5 h-5 text-amber-600" /></div>
                <div>
                  <div class="flex items-center gap-2 mb-1"><span class="font-mono font-medium text-sm text-slate-800">{{ ds.name }}</span><span class="text-xs text-slate-500">{{ ds.label }}</span><Badge variant="secondary" class="text-[10px] px-1 py-0">{{ ds.category }}</Badge></div>
                  <p class="text-xs text-slate-500">{{ ds.description }}</p>
                  <div class="flex items-center gap-3 mt-1 text-[11px] text-slate-400"><span>📊 {{ ds.rows }}</span><span>🕐 {{ ds.update }}</span></div>
                </div>
              </div>
            </div>
            <div class="p-4"><table class="w-full text-sm"><thead><tr><th class="px-2 py-1.5 text-left text-[11px] font-medium text-slate-500 w-[180px]">字段名</th><th class="px-2 py-1.5 text-left text-[11px] font-medium text-slate-500 w-[100px]">类型</th><th class="px-2 py-1.5 text-left text-[11px] font-medium text-slate-500">说明</th><th class="px-2 py-1.5 text-left text-[11px] font-medium text-slate-500">示例</th></tr></thead><tbody><tr v-for="f in ds.fields" :key="f.name" class="border-t border-slate-50 hover:bg-slate-50/50"><td class="px-2 py-1.5 font-mono text-xs text-slate-700">{{ f.name }}</td><td class="px-2 py-1.5 text-xs text-slate-500">{{ f.type }}</td><td class="px-2 py-1.5 text-xs text-slate-600">{{ f.desc }}</td><td class="px-2 py-1.5 font-mono text-xs text-slate-400">{{ f.sample || '—' }}</td></tr></tbody></table></div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="faq" class="flex-1 overflow-auto p-6 mt-0">
        <div class="space-y-3 max-w-3xl">
          <div v-for="(faq, idx) in faqs" :key="idx" class="border rounded-lg p-4 hover:border-rose-200 hover:bg-rose-50/30 transition-all group">
            <div class="flex items-start gap-3"><div class="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5"><span class="text-xs font-bold text-rose-600">Q</span></div><div class="flex-1 min-w-0"><h4 class="text-sm font-medium text-slate-800 mb-1.5 group-hover:text-rose-700">{{ faq.q }}</h4><p class="text-xs text-slate-500 leading-relaxed">{{ faq.a }}</p></div></div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
    <Dialog v-model:open="detailOpen">
      <DialogContent class="max-w-lg"><DialogHeader><DialogTitle class="flex items-center gap-2"><BookOpen class="w-4 h-4 text-sky-500" />{{ selectedTerm?.term }}</DialogTitle></DialogHeader>
        <div v-if="selectedTerm" class="space-y-3 py-2 text-sm">
          <div class="flex items-center gap-2"><Badge>{{ selectedTerm.abbr }}</Badge><Badge variant="secondary">{{ selectedTerm.category }}</Badge></div>
          <div><div class="text-xs font-medium text-slate-500 mb-1">定义</div><p class="text-sm text-slate-700">{{ selectedTerm.definition }}</p></div>
          <div v-if="selectedTerm.formula"><div class="text-xs font-medium text-slate-500 mb-1">公式</div><div class="bg-slate-50 rounded-lg px-3 py-2 font-mono text-xs text-slate-700">{{ selectedTerm.formula }}</div></div>
          <div v-if="selectedTerm.source"><div class="text-xs font-medium text-slate-500 mb-1">数据来源</div><p class="text-xs font-mono text-slate-600">{{ selectedTerm.source }}</p></div>
          <div v-if="selectedTerm.examples?.length"><div class="text-xs font-medium text-slate-500 mb-1">示例</div><ul class="space-y-1"><li v-for="ex in selectedTerm.examples" :key="ex" class="text-xs text-slate-600 flex items-start gap-1"><ChevronRight class="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />{{ ex }}</li></ul></div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
