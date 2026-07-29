<script setup>
    import { ref, computed } from 'vue';
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from '@/components/ui/dialog';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';
    import {
        ChevronLeft,
        ChevronRight,
        Download,
        Eye,
        FileSpreadsheet,
        FileText,
    } from 'lucide-vue-next';

    const MOCK_WAYBILL_DATA = [
        {
            id: '1',
            orderId: 'WB2026030001',
            shipper: '北京建材有限公司',
            shipperCity: '北京市',
            consignee: '上海贸易有限公司',
            consigneeCity: '上海市',
            goodsType: '建材',
            weight: 32.5,
            vehicleType: '重型半挂车',
            totalMile: 1213,
            totalCost: 4850,
            status: '已完成',
            loadTime: '2026-03-01 08:00',
            unloadTime: '2026-03-02 14:30',
            grade: 'A',
        },
        {
            id: '2',
            orderId: 'WB2026030002',
            shipper: '广州化工集团',
            shipperCity: '广州市',
            consignee: '武汉制造有限公司',
            consigneeCity: '武汉市',
            goodsType: '化工品',
            weight: 28.0,
            vehicleType: '重型厢式车',
            totalMile: 968,
            totalCost: 3870,
            status: '已完成',
            loadTime: '2026-03-01 10:00',
            unloadTime: '2026-03-02 08:00',
            grade: 'B',
        },
        {
            id: '3',
            orderId: 'WB2026030003',
            shipper: '山东农业合作社',
            shipperCity: '济南市',
            consignee: '深圳食品有限公司',
            consigneeCity: '深圳市',
            goodsType: '农产品',
            weight: 18.5,
            vehicleType: '冷藏车',
            totalMile: 1756,
            totalCost: 7025,
            status: '运输中',
            loadTime: '2026-03-02 06:00',
            unloadTime: '-',
            grade: 'A',
        },
        {
            id: '4',
            orderId: 'WB2026030004',
            shipper: '河北钢铁集团',
            shipperCity: '唐山市',
            consignee: '成都建设有限公司',
            consigneeCity: '成都市',
            goodsType: '钢材',
            weight: 45.0,
            vehicleType: '重型半挂车',
            totalMile: 1892,
            totalCost: 7568,
            status: '已完成',
            loadTime: '2026-02-28 07:00',
            unloadTime: '2026-03-01 22:00',
            grade: 'A',
        },
        {
            id: '5',
            orderId: 'WB2026030005',
            shipper: '江苏电子科技',
            shipperCity: '苏州市',
            consignee: '重庆电子有限公司',
            consigneeCity: '重庆市',
            goodsType: '电子产品',
            weight: 12.0,
            vehicleType: '中型厢式车',
            totalMile: 1650,
            totalCost: 6600,
            status: '已完成',
            loadTime: '2026-03-01 09:00',
            unloadTime: '2026-03-02 18:00',
            grade: 'B',
        },
        {
            id: '6',
            orderId: 'WB2026030006',
            shipper: '浙江纺织有限公司',
            shipperCity: '杭州市',
            consignee: '西安服装城',
            consigneeCity: '西安市',
            goodsType: '纺织品',
            weight: 22.0,
            vehicleType: '重型厢式车',
            totalMile: 1430,
            totalCost: 5720,
            status: '已完成',
            loadTime: '2026-03-01 07:30',
            unloadTime: '2026-03-02 16:00',
            grade: 'A',
        },
        {
            id: '7',
            orderId: 'WB2026030007',
            shipper: '湖南矿业集团',
            shipperCity: '长沙市',
            consignee: '南京冶金有限公司',
            consigneeCity: '南京市',
            goodsType: '矿产品',
            weight: 50.0,
            vehicleType: '重型半挂车',
            totalMile: 980,
            totalCost: 3920,
            status: '运输中',
            loadTime: '2026-03-02 05:00',
            unloadTime: '-',
            grade: 'C',
        },
        {
            id: '8',
            orderId: 'WB2026030008',
            shipper: '四川食品有限公司',
            shipperCity: '成都市',
            consignee: '北京超市连锁',
            consigneeCity: '北京市',
            goodsType: '食品',
            weight: 15.0,
            vehicleType: '冷藏车',
            totalMile: 1800,
            totalCost: 7200,
            status: '已完成',
            loadTime: '2026-02-28 06:00',
            unloadTime: '2026-03-01 20:00',
            grade: 'A',
        },
        {
            id: '9',
            orderId: 'WB2026030009',
            shipper: '福建木材加工厂',
            shipperCity: '福州市',
            consignee: '郑州家具城',
            consigneeCity: '郑州市',
            goodsType: '木材',
            weight: 35.0,
            vehicleType: '重型半挂车',
            totalMile: 1250,
            totalCost: 5000,
            status: '已完成',
            loadTime: '2026-03-01 08:30',
            unloadTime: '2026-03-02 12:00',
            grade: 'B',
        },
        {
            id: '10',
            orderId: 'WB2026030010',
            shipper: '辽宁石化集团',
            shipperCity: '大连市',
            consignee: '天津化工园区',
            consigneeCity: '天津市',
            goodsType: '石化产品',
            weight: 40.0,
            vehicleType: '危险品运输车',
            totalMile: 890,
            totalCost: 5340,
            status: '已完成',
            loadTime: '2026-03-01 06:00',
            unloadTime: '2026-03-01 22:00',
            grade: 'A',
        },
        {
            id: '11',
            orderId: 'WB2026030011',
            shipper: '云南茶叶有限公司',
            shipperCity: '昆明市',
            consignee: '广州茶叶市场',
            consigneeCity: '广州市',
            goodsType: '茶叶',
            weight: 8.0,
            vehicleType: '中型厢式车',
            totalMile: 1520,
            totalCost: 6080,
            status: '运输中',
            loadTime: '2026-03-02 07:00',
            unloadTime: '-',
            grade: 'B',
        },
        {
            id: '12',
            orderId: 'WB2026030012',
            shipper: '内蒙古煤炭集团',
            shipperCity: '鄂尔多斯市',
            consignee: '河北电力公司',
            consigneeCity: '石家庄市',
            goodsType: '煤炭',
            weight: 55.0,
            vehicleType: '重型自卸车',
            totalMile: 680,
            totalCost: 2720,
            status: '已完成',
            loadTime: '2026-02-28 05:00',
            unloadTime: '2026-02-28 20:00',
            grade: 'A',
        },
    ];

    const currentPage = ref(1);
    const pageSize = ref(10);
    const selectedRow = ref(null);
    const detailDialogOpen = ref(false);

    const totalPages = computed(() => Math.ceil(MOCK_WAYBILL_DATA.length / pageSize.value));

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return MOCK_WAYBILL_DATA.slice(start, start + pageSize.value);
    });

    function getGradeBadgeVariant(grade) {
        switch (grade) {
            case 'A':
                return 'default';
            case 'B':
                return 'secondary';
            case 'C':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    function getStatusColor(status) {
        return status === '已完成' ? 'text-green-600' : 'text-blue-600';
    }

    function openDetail(row) {
        selectedRow.value = row;
        detailDialogOpen.value = true;
    }

    function handleExportCSV() {
        const headers = ['运单号', '发货方', '发货城市', '收货方', '收货城市', '货类', '重量(吨)', '车型', '里程(km)', '成本(元)', '状态', '等级'];
        const rows = MOCK_WAYBILL_DATA.map((d) =>
            [d.orderId, d.shipper, d.shipperCity, d.consignee, d.consigneeCity, d.goodsType, d.weight, d.vehicleType, d.totalMile, d.totalCost, d.status, d.grade].join(',')
        );
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '运单数据.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function handleExportExcel() {
        handleExportCSV();
    }
</script>

<template>
    <div class="space-y-4">
        <!-- Toolbar -->
        <div class="flex items-center justify-between">
            <div class="text-sm text-slate-500">
                共 <span class="font-semibold text-slate-700">{{ MOCK_WAYBILL_DATA.length }}</span> 条运单数据
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm" class="gap-2">
                        <Download class="w-4 h-4" />
                        导出数据
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem @click="handleExportCSV">
                        <FileText class="w-4 h-4 mr-2" />
                        导出 CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleExportExcel">
                        <FileSpreadsheet class="w-4 h-4 mr-2" />
                        导出 Excel
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <!-- Table -->
        <div class="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>运单号</TableHead>
                        <TableHead>发货方</TableHead>
                        <TableHead>发货城市</TableHead>
                        <TableHead>收货方</TableHead>
                        <TableHead>收货城市</TableHead>
                        <TableHead>货类</TableHead>
                        <TableHead class="text-right">重量(吨)</TableHead>
                        <TableHead class="text-right">里程(km)</TableHead>
                        <TableHead class="text-right">成本(元)</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>等级</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="row in paginatedData" :key="row.id">
                        <TableCell class="font-mono text-xs">{{ row.orderId }}</TableCell>
                        <TableCell class="max-w-[120px] truncate">{{ row.shipper }}</TableCell>
                        <TableCell>{{ row.shipperCity }}</TableCell>
                        <TableCell class="max-w-[120px] truncate">{{ row.consignee }}</TableCell>
                        <TableCell>{{ row.consigneeCity }}</TableCell>
                        <TableCell>{{ row.goodsType }}</TableCell>
                        <TableCell class="text-right">{{ row.weight }}</TableCell>
                        <TableCell class="text-right">{{ row.totalMile.toLocaleString() }}</TableCell>
                        <TableCell class="text-right">{{ row.totalCost.toLocaleString() }}</TableCell>
                        <TableCell>
                            <span :class="getStatusColor(row.status)" class="text-xs font-medium">
                                {{ row.status }}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Badge :variant="getGradeBadgeVariant(row.grade)">{{ row.grade }}</Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" class="gap-1" @click="openDetail(row)">
                                <Eye class="w-3 h-3" />
                                详情
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between">
            <div class="text-sm text-slate-500">
                第 {{ currentPage }} / {{ totalPages }} 页
            </div>
            <div class="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="currentPage <= 1"
                    @click="currentPage--"
                >
                    <ChevronLeft class="w-4 h-4" />
                    上一页
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="currentPage >= totalPages"
                    @click="currentPage++"
                >
                    下一页
                    <ChevronRight class="w-4 h-4" />
                </Button>
            </div>
        </div>

        <!-- Detail Dialog -->
        <Dialog v-model:open="detailDialogOpen">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>运单详情 - {{ selectedRow?.orderId }}</DialogTitle>
                </DialogHeader>
                <div v-if="selectedRow" class="grid grid-cols-2 gap-4 py-4">
                    <div class="space-y-3">
                        <div>
                            <div class="text-xs text-slate-500">运单号</div>
                            <div class="font-mono">{{ selectedRow.orderId }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">发货方</div>
                            <div>{{ selectedRow.shipper }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">发货城市</div>
                            <div>{{ selectedRow.shipperCity }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">货物类型</div>
                            <div>{{ selectedRow.goodsType }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">车辆类型</div>
                            <div>{{ selectedRow.vehicleType }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">装货时间</div>
                            <div>{{ selectedRow.loadTime }}</div>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="text-xs text-slate-500">等级</div>
                            <Badge :variant="getGradeBadgeVariant(selectedRow.grade)">{{ selectedRow.grade }}</Badge>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">收货方</div>
                            <div>{{ selectedRow.consignee }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">收货城市</div>
                            <div>{{ selectedRow.consigneeCity }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">重量(吨)</div>
                            <div>{{ selectedRow.weight }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">总里程 / 总成本</div>
                            <div>{{ selectedRow.totalMile.toLocaleString() }} km / {{ selectedRow.totalCost.toLocaleString() }} 元</div>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500">卸货时间</div>
                            <div>{{ selectedRow.unloadTime }}</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
