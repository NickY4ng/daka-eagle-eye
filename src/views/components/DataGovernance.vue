<!-- eslint-disable -->
<script setup>
/* eslint-disable */
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Eye, RefreshCw, Shield, Filter, Calculator, CheckCircle, AlertTriangle,
  XCircle, Play, Settings2, Wrench, BarChart3, Activity, Database,
} from 'lucide-vue-next';

// ============== Cleaning Rules ==============
const cleaningRules = ref([
  { id: '1', name: '装运编号去重', targetTable: 'shipping_orders', targetField: 'shipment_id', type: 'duplicate', status: 'enabled', lastRun: '2026-07-14 06:00', records: 0 },
  { id: '2', name: '发运车次号格式校验', targetTable: 'shipping_orders', targetField: 'trip_no', type: 'format', status: 'enabled', lastRun: '2026-07-14 06:00', records: 0 },
  { id: '3', name: '车牌号格式校验', targetTable: 'shipping_orders', targetField: 'plate_number', type: 'format', status: 'enabled', lastRun: '2026-07-14 06:00', records: 2 },
  { id: '4', name: '计划交货日期空值检测', targetTable: 'shipping_orders', targetField: 'plan_delivery_date', type: 'null_check', status: 'enabled', lastRun: '2026-07-14 06:00', records: 3 },
  { id: '5', name: '合计毛重负值检测', targetTable: 'shipping_orders', targetField: 'gross_weight_t', type: 'range_check', status: 'enabled', lastRun: '2026-07-14 06:00', records: 0 },
  { id: '6', name: '交运单号唯一性', targetTable: 'delivery_orders', targetField: 'delivery_id', type: 'duplicate', status: 'enabled', lastRun: '2026-07-14 06:00', records: 0 },
  { id: '7', name: '交货数量负值检测', targetTable: 'delivery_orders', targetField: 'delivery_qty', type: 'range_check', status: 'enabled', lastRun: '2026-07-14 06:00', records: 0 },
  { id: '8', name: '目的地城市格式校验', targetTable: 'delivery_orders', targetField: 'dest_city', type: 'format', status: 'enabled', lastRun: '2026-07-14 06:00', records: 1 },
]);

const cleaningTypeLabels = { duplicate: '去重', null_check: '空值检测', format: '格式校验', range_check: '范围校验' };
const cleaningTypeColors = { duplicate: 'bg-purple-100 text-purple-700', null_check: 'bg-red-100 text-red-700', format: 'bg-blue-100 text-blue-700', range_check: 'bg-amber-100 text-amber-700' };

// ============== Transform Rules ==============
const transformRules = ref([
  { id: '1', name: '毛重净重比计算', sourceField: 'gross_weight_t, net_weight_t', targetField: 'gross_net_ratio', type: 'calculate', formula: 'gross_weight_t / net_weight_t', status: 'enabled' },
  { id: '2', name: '吨公里运量转换', sourceField: 'gross_weight_t, distance_km', targetField: 'ton_km', type: 'calculate', formula: 'gross_weight_t × distance_km', status: 'enabled' },
  { id: '3', name: '单件均重计算', sourceField: 'net_weight_t, total_qty', targetField: 'avg_item_weight_kg', type: 'calculate', formula: 'net_weight_t × 1000 / total_qty', status: 'enabled' },
  { id: '4', name: '体积利用率', sourceField: 'volume_cbm, vehicle_type', targetField: 'volume_utilization', type: 'calculate', formula: 'volume_cbm / 车型额定容积', status: 'enabled' },
  { id: '5', name: '装运单状态标准化', sourceField: 'status', targetField: 'status_std', type: 'map', formula: '新增→待发运, 已审核→待运输, 运输中→在途, 已完成→已到达', status: 'enabled' },
  { id: '6', name: '交货过账状态映射', sourceField: 'posting_status', targetField: 'posting_status_cn', type: 'map', formula: '未过账→未入账, 已过账→已入账', status: 'enabled' },
]);

const transformTypeLabels = { map: '映射转换', calculate: '计算列', combine: '字段合并' };
const transformTypeColors = { map: 'bg-cyan-100 text-cyan-700', calculate: 'bg-green-100 text-green-700', combine: 'bg-orange-100 text-orange-700' };

// ============== Validation Rules ==============
const validationRules = ref([
  { id: '1', name: '运输距离合理性', targetTable: 'shipping_orders', targetField: 'distance_km', rule: '≥1km 且 ≤3000km', threshold: '1-3000', status: 'pass', lastCheck: '2026-07-14 06:00', issues: 0 },
  { id: '2', name: '毛重净重比合理性', targetTable: 'shipping_orders', targetField: 'gross_net_ratio', rule: '1.2~2.0', threshold: '1.2-2.0', status: 'warn', lastCheck: '2026-07-14 06:00', issues: 3 },
  { id: '3', name: '装运单状态流转校验', targetTable: 'shipping_orders', targetField: 'status', rule: '∈{新增,已审核,运输中,已完成}', threshold: null, status: 'fail', lastCheck: '2026-07-14 06:00', issues: 2 },
  { id: '4', name: '交运单过账状态校验', targetTable: 'delivery_orders', targetField: 'posting_status', rule: '∈{未过账,已过账}', threshold: null, status: 'pass', lastCheck: '2026-07-14 06:00', issues: 0 },
  { id: '5', name: '交运-发货跨表匹配', targetTable: 'delivery↔shipping', targetField: 'net_weight↔gross_weight', rule: '交运净重kg/1000 ≤ 发货毛重t', threshold: null, status: 'warn', lastCheck: '2026-07-14 06:00', issues: 4 },
]);

const validationStatusIcons = { pass: CheckCircle, warn: AlertTriangle, fail: XCircle };
const validationStatusColors = { pass: 'text-green-500', warn: 'text-amber-500', fail: 'text-red-500' };
const validationStatusLabels = { pass: '通过', warn: '警告', fail: '失败' };

// ============== Indicators ==============
const indicators = ref([
  { id: '1', name: '发运总车次数', formula: 'COUNT(DISTINCT trip_no)', source: 'shipping_orders.trip_no', unit: '次', category: '规模指标', traceable: 'shipping_orders.trip_no → 去重计数' },
  { id: '2', name: '总发运量（毛重）', formula: 'SUM(gross_weight_t)', source: 'shipping_orders.gross_weight_t', unit: '吨', category: '规模指标', traceable: 'shipping_orders.gross_weight_t → SUM聚合' },
  { id: '3', name: '总交货数量', formula: 'SUM(delivery_qty)', source: 'delivery_orders.delivery_qty', unit: '件', category: '规模指标', traceable: 'delivery_orders.delivery_qty → SUM聚合' },
  { id: '4', name: '平均运输距离', formula: 'AVG(distance_km)', source: 'shipping_orders.distance_km', unit: '公里', category: '效率指标', traceable: 'shipping_orders.distance_km → AVG' },
  { id: '5', name: '平均单车毛重', formula: 'AVG(gross_weight_t)', source: 'shipping_orders.gross_weight_t', unit: '吨/车', category: '效率指标', traceable: 'gross_weight_t → AVG 按车次' },
  { id: '6', name: '毛净重比率', formula: 'SUM(gross_weight_t)/SUM(net_weight_t)', source: 'shipping_orders.gross_weight_t, net_weight_t', unit: '倍', category: '效率指标', traceable: '转换规则: gross_net_ratio' },
  { id: '7', name: '各工厂发运量', formula: 'SUM(gross_weight_t) GROUP BY factory_name', source: 'shipping_orders.factory_name, gross_weight_t', unit: '吨', category: '结构指标', traceable: '按工厂分组 SUM(gross_weight_t)' },
  { id: '8', name: '各路线发运占比', formula: 'COUNT(trip_no) GROUP BY route_name / 总车次', source: 'shipping_orders.route_name, trip_no', unit: '%', category: '结构指标', traceable: '按路线分组计数 / 总车次数' },
  { id: '9', name: '交运过账率', formula: 'COUNT(已过账)/COUNT(*)', source: 'delivery_orders.posting_status', unit: '%', category: '质量指标', traceable: '已过账交运单数 / 总交运单数' },
  { id: '10', name: '准时发货率', formula: 'COUNT(按时)/COUNT(*)', source: 'delivery_orders.ship_date, plan_ship_date', unit: '%', category: '质量指标', traceable: '按时发货的交运单 / 总交运单' },
]);

// ============== Data Quality ==============
const qualityScores = ref([
  { dimension: '完整性', score: 96, icon: Database, color: 'text-green-500', bg: 'bg-green-50', description: '关键字段填充率96%，3个发运单缺失计划交货日期' },
  { dimension: '准确性', score: 88, icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-50', description: '3条毛净重比异常，2条状态流转异常，4条跨表匹配警告' },
  { dimension: '一致性', score: 94, icon: Activity, color: 'text-green-500', bg: 'bg-green-50', description: '车牌格式、工厂编码、客户编码一致性94%' },
  { dimension: '及时性', score: 99, icon: RefreshCw, color: 'text-green-500', bg: 'bg-green-50', description: '数据延迟<30分钟，SAP实时同步' },
]);

const qualityIssues = ref([
  { severity: 'high', description: '装运单状态流转异常', detail: '2条装运单状态跳变（新增→已完成，跳过审核和运输中）', table: 'shipping_orders', count: 2 },
  { severity: 'high', description: '毛净重比率异常', detail: '3条发运单毛重/净重比超出1.2~2.0合理范围', table: 'shipping_orders', count: 3 },
  { severity: 'medium', description: '交运发货跨表匹配警告', detail: '4条交运单净重(换算吨)大于关联发货单毛重', table: 'delivery↔shipping', count: 4 },
  { severity: 'medium', description: '目的地城市格式异常', detail: '1条交运单目的地城市格式不符合"省/市"规范', table: 'delivery_orders', count: 1 },
  { severity: 'low', description: '计划交货日期缺失', detail: '3条发运单缺少计划交货日期字段', table: 'shipping_orders', count: 3 },
  { severity: 'low', description: '车牌号格式不规范', detail: '2条发运单车牌号使用了非标准格式', table: 'shipping_orders', count: 2 },
]);

const severityColors = { high: 'bg-red-100 text-red-700 border-red-200', medium: 'bg-amber-100 text-amber-700 border-amber-200', low: 'bg-blue-100 text-blue-700 border-blue-200' };
const severityLabels = { high: '高', medium: '中', low: '低' };

// ============== Computed ==============
const overallQualityScore = computed(() => Math.round(qualityScores.value.reduce((s, q) => s + q.score, 0) / qualityScores.value.length));

const searchQuery = ref('');
const activeTab = ref('cleaning');
const detailDialogOpen = ref(false);
const selectedItem = ref(null);
function openDetail(item) { selectedItem.value = item; detailDialogOpen.value = true; }
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden bg-white rounded-xl border shadow-sm">
    <div class="px-6 py-4 border-b flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
          <Settings2 class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-800">数据治理</h2>
          <p class="text-xs text-slate-500">基于 shipping_orders + delivery_orders 的数据清洗、转换、校验与指标管理</p>
        </div>
      </div>
      <Button variant="outline" size="sm" class="gap-1.5"><Play class="w-3.5 h-3.5" />执行全量治理</Button>
    </div>
    <div class="px-6 py-3 grid grid-cols-4 gap-3 shrink-0 border-b bg-slate-50/50">
      <div v-for="q in qualityScores" :key="q.dimension" class="flex items-center gap-2">
        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', q.bg]">
          <component :is="q.icon" :class="['w-4 h-4', q.color]" />
        </div>
        <div class="min-w-0"><div class="flex items-baseline gap-1"><span class="text-sm font-bold text-slate-800">{{ q.score }}</span><span class="text-xs text-slate-400">/100</span></div><div class="text-[11px] text-slate-500 truncate">{{ q.dimension }}</div></div>
      </div>
    </div>
    <Tabs v-model="activeTab" class="flex-1 flex flex-col min-h-0">
      <div class="px-6 pt-3 border-b shrink-0">
        <TabsList class="w-full justify-start gap-1 bg-transparent p-0 h-auto">
          <TabsTrigger value="cleaning" class="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-lg px-3 py-1.5 text-xs"><Filter class="w-3.5 h-3.5 mr-1" />清洗规则</TabsTrigger>
          <TabsTrigger value="transform" class="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 rounded-lg px-3 py-1.5 text-xs"><Wrench class="w-3.5 h-3.5 mr-1" />转换规则</TabsTrigger>
          <TabsTrigger value="validation" class="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 rounded-lg px-3 py-1.5 text-xs"><Shield class="w-3.5 h-3.5 mr-1" />校验规则</TabsTrigger>
          <TabsTrigger value="indicator" class="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 rounded-lg px-3 py-1.5 text-xs"><Calculator class="w-3.5 h-3.5 mr-1" />指标定义</TabsTrigger>
          <TabsTrigger value="quality" class="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg px-3 py-1.5 text-xs"><BarChart3 class="w-3.5 h-3.5 mr-1" />数据质量</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="cleaning" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center gap-2 mb-3"><span class="text-xs text-slate-500">{{ cleaningRules.length }}条规则</span><span class="text-[10px] text-slate-300">|</span><span class="text-xs text-emerald-600">{{ cleaningRules.filter(r => r.status === 'enabled').length }} 启用</span></div>
        <div class="border rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50"><tr><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">规则名称</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">目标表</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">类型</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">状态</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">最近执行</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">检出</th><th class="px-3 py-2.5 text-right text-xs font-medium text-slate-500">操作</th></tr></thead><tbody><tr v-for="rule in cleaningRules" :key="rule.id" class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 font-mono text-xs font-medium text-slate-800">{{ rule.name }}</td><td class="px-3 py-2.5 text-xs text-slate-600">{{ rule.targetTable }}</td><td class="px-3 py-2.5"><Badge :class="cleaningTypeColors[rule.type]" class="text-[10px] px-1.5 py-0">{{ cleaningTypeLabels[rule.type] }}</Badge></td><td class="px-3 py-2.5"><span :class="['inline-flex items-center gap-1 text-[11px] font-medium', rule.status === 'enabled' ? 'text-emerald-600' : 'text-slate-400']"><span :class="['w-1.5 h-1.5 rounded-full', rule.status === 'enabled' ? 'bg-emerald-500' : 'bg-slate-300']" />{{ rule.status === 'enabled' ? '启用' : '暂停' }}</span></td><td class="px-3 py-2.5 text-xs text-slate-500">{{ rule.lastRun }}</td><td class="px-3 py-2.5"><Badge :variant="rule.records > 0 ? 'destructive' : 'secondary'" class="text-[10px] px-1.5 py-0">{{ rule.records }} 条</Badge></td><td class="px-3 py-2.5 text-right"><Button variant="ghost" size="icon" class="h-6 w-6" @click="openDetail(rule)"><Eye class="w-3 h-3" /></Button></td></tr></tbody></table></div>
      </TabsContent>
      <TabsContent value="transform" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center gap-2 mb-3"><span class="text-xs text-slate-500">{{ transformRules.length }}条规则</span></div>
        <div class="border rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50"><tr><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">规则名称</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">源字段</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">目标字段</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">类型</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">公式</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">状态</th><th class="px-3 py-2.5 text-right text-xs font-medium text-slate-500">操作</th></tr></thead><tbody><tr v-for="rule in transformRules" :key="rule.id" class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 font-mono text-xs font-medium text-slate-800">{{ rule.name }}</td><td class="px-3 py-2.5 text-xs text-slate-600 font-mono">{{ rule.sourceField }}</td><td class="px-3 py-2.5 text-xs text-slate-600 font-mono">{{ rule.targetField }}</td><td class="px-3 py-2.5"><Badge :class="transformTypeColors[rule.type]" class="text-[10px] px-1.5 py-0">{{ transformTypeLabels[rule.type] }}</Badge></td><td class="px-3 py-2.5 text-xs text-slate-600 font-mono max-w-[200px] truncate">{{ rule.formula }}</td><td class="px-3 py-2.5"><span :class="['inline-flex items-center gap-1 text-[11px] font-medium', rule.status === 'enabled' ? 'text-emerald-600' : 'text-slate-400']"><span :class="['w-1.5 h-1.5 rounded-full', rule.status === 'enabled' ? 'bg-emerald-500' : 'bg-slate-300']" />{{ rule.status === 'enabled' ? '启用' : '暂停' }}</span></td><td class="px-3 py-2.5 text-right"><Button variant="ghost" size="icon" class="h-6 w-6" @click="openDetail(rule)"><Eye class="w-3 h-3" /></Button></td></tr></tbody></table></div>
      </TabsContent>
      <TabsContent value="validation" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center gap-2 mb-3"><span class="text-xs text-slate-500">{{ validationRules.length }}条规则</span><span class="text-[10px] text-slate-300">|</span><span class="text-xs text-green-600">{{ validationRules.filter(r => r.status === 'pass').length }}通过</span><span class="text-xs text-amber-600">{{ validationRules.filter(r => r.status === 'warn').length }}警告</span><span class="text-xs text-red-600">{{ validationRules.filter(r => r.status === 'fail').length }}失败</span></div>
        <div class="border rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50"><tr><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">规则名称</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">目标表.字段</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">校验规则</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">结果</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">最近检查</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">问题数</th><th class="px-3 py-2.5 text-right text-xs font-medium text-slate-500">操作</th></tr></thead><tbody><tr v-for="rule in validationRules" :key="rule.id" class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5 font-mono text-xs font-medium text-slate-800">{{ rule.name }}</td><td class="px-3 py-2.5 text-xs text-slate-600 font-mono">{{ rule.targetTable }}.{{ rule.targetField }}</td><td class="px-3 py-2.5 text-xs text-slate-600">{{ rule.rule }}</td><td class="px-3 py-2.5"><span :class="['inline-flex items-center gap-1 text-[11px] font-medium', validationStatusColors[rule.status]]"><component :is="validationStatusIcons[rule.status]" class="w-3.5 h-3.5" />{{ validationStatusLabels[rule.status] }}</span></td><td class="px-3 py-2.5 text-xs text-slate-500">{{ rule.lastCheck }}</td><td class="px-3 py-2.5"><Badge :variant="rule.issues > 0 ? 'destructive' : 'secondary'" class="text-[10px] px-1.5 py-0">{{ rule.issues }} 条</Badge></td><td class="px-3 py-2.5 text-right"><Button variant="ghost" size="icon" class="h-6 w-6" @click="openDetail(rule)"><Eye class="w-3 h-3" /></Button></td></tr></tbody></table></div>
      </TabsContent>
      <TabsContent value="indicator" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center justify-between mb-3"><span class="text-xs text-slate-500">{{ indicators.length }}个指标，全部可追溯至源表字段</span><span class="text-xs text-slate-400">💡点击指标查看完整追溯链路</span></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card v-for="ind in indicators" :key="ind.id" class="hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group" @click="openDetail(ind)">
            <CardContent class="p-4"><div class="flex items-start justify-between"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><span class="font-medium text-sm text-slate-800 group-hover:text-emerald-700">{{ ind.name }}</span><Badge variant="secondary" class="text-[10px] px-1.5 py-0">{{ ind.category }}</Badge></div><p class="text-xs text-slate-500 font-mono mb-2 truncate">{{ ind.formula }}</p><div class="flex items-center gap-3 text-[11px] text-slate-400"><span class="flex items-center gap-1"><Database class="w-3 h-3" />{{ ind.source }}</span><span>{{ ind.unit }}</span></div></div></div></CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="quality" class="flex-1 overflow-auto p-6 mt-0">
        <div class="flex items-center gap-6 p-5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border mb-4">
          <div class="text-center shrink-0"><div class="text-4xl font-bold text-emerald-600">{{ overallQualityScore }}</div><div class="text-xs text-slate-500 mt-1">综合质量分</div></div>
          <div class="flex-1 grid grid-cols-2 gap-3"><div v-for="q in qualityScores" :key="q.dimension" class="flex flex-col gap-1"><div class="flex items-center justify-between text-xs"><span class="text-slate-600">{{ q.dimension }}</span><span :class="['font-medium', q.color]">{{ q.score }}%</span></div><Progress :model-value="q.score" class="h-1.5" /></div></div>
        </div>
        <h4 class="text-sm font-medium text-slate-700 mb-3">数据质量问题清单</h4>
        <div class="border rounded-lg overflow-hidden"><table class="w-full text-sm"><thead class="bg-slate-50"><tr><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">严重度</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">问题描述</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">详情</th><th class="px-3 py-2.5 text-left text-xs font-medium text-slate-500">涉及表</th><th class="px-3 py-2.5 text-right text-xs font-medium text-slate-500">数量</th></tr></thead><tbody><tr v-for="(issue, idx) in qualityIssues" :key="idx" class="border-t hover:bg-slate-50/50"><td class="px-3 py-2.5"><Badge :class="severityColors[issue.severity]" class="text-[10px] px-1.5 py-0">{{ severityLabels[issue.severity] }}</Badge></td><td class="px-3 py-2.5 text-xs font-medium text-slate-800">{{ issue.description }}</td><td class="px-3 py-2.5 text-xs text-slate-500 max-w-[280px] truncate">{{ issue.detail }}</td><td class="px-3 py-2.5 text-xs text-slate-600 font-mono">{{ issue.table }}</td><td class="px-3 py-2.5 text-right text-xs font-medium text-slate-700">{{ issue.count }} 条</td></tr></tbody></table></div>
      </TabsContent>
    </Tabs>
    <Dialog v-model:open="detailDialogOpen">
      <DialogContent class="max-w-lg"><DialogHeader><DialogTitle>{{ selectedItem?.name || '详情' }}</DialogTitle></DialogHeader>
        <div v-if="selectedItem" class="space-y-3 py-2 text-sm">
          <div v-if="selectedItem.traceable" class="p-3 bg-emerald-50 rounded-lg border border-emerald-100"><div class="text-xs font-medium text-emerald-700 mb-1">📌 数据追溯链路</div><p class="text-xs text-emerald-600">{{ selectedItem.traceable }}</p></div>
          <div v-if="selectedItem.formula" class="grid grid-cols-2 gap-2 text-xs"><div><span class="text-slate-500">计算公式:</span><span class="font-mono font-medium ml-1">{{ selectedItem.formula }}</span></div><div><span class="text-slate-500">数据来源:</span><span class="font-mono ml-1">{{ selectedItem.source }}</span></div><div><span class="text-slate-500">单位:</span><span class="ml-1">{{ selectedItem.unit }}</span></div><div><span class="text-slate-500">分类:</span><span class="ml-1">{{ selectedItem.category }}</span></div></div>
          <div v-if="selectedItem.targetTable" class="grid grid-cols-2 gap-2 text-xs"><div><span class="text-slate-500">目标表:</span><span class="font-mono ml-1">{{ selectedItem.targetTable }}</span></div><div v-if="selectedItem.targetField"><span class="text-slate-500">目标字段:</span><span class="font-mono ml-1">{{ selectedItem.targetField }}</span></div><div v-if="selectedItem.lastRun"><span class="text-slate-500">最近执行:</span><span class="ml-1">{{ selectedItem.lastRun }}</span></div><div v-if="selectedItem.records !== undefined"><span class="text-slate-500">检出记录:</span><span class="ml-1 font-medium">{{ selectedItem.records }} 条</span></div></div>
          <div v-if="selectedItem.rule" class="grid grid-cols-2 gap-2 text-xs"><div><span class="text-slate-500">校验规则:</span><span class="ml-1">{{ selectedItem.rule }}</span></div><div><span class="text-slate-500">最近检查:</span><span class="ml-1">{{ selectedItem.lastCheck }}</span></div><div><span class="text-slate-500">问题数:</span><span :class="['ml-1 font-medium', selectedItem.issues > 0 ? 'text-red-600' : 'text-green-600']">{{ selectedItem.issues }} 条</span></div></div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
