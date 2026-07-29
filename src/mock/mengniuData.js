/**
 * 蒙牛物流 — 基于真实字段结构的 Mock 扩展数据
 * 数据来源：发货单(64列) + 交运单(36列)
 * 所有数据已脱敏，仅用于 Demo 演示
 */

// ============ 工厂 ============
export const factories = [
    { code: '3006', name: '滦南常温工厂', city: '唐山市', province: '河北省' },
    { code: '5035', name: '和林事业部常温虚拟工厂', city: '呼和浩特市', province: '内蒙古' },
    { code: '3450', name: '焦作常温销售订单虚拟工厂', city: '焦作市', province: '河南省' },
    { code: '9017', name: '上海常温分销虚拟中转工厂', city: '上海市', province: '上海市' },
    { code: '6012', name: '武汉常温工厂', city: '武汉市', province: '湖北省' },
    { code: '7010', name: '成都常温工厂', city: '成都市', province: '四川省' },
];

// ============ 客户 ============
export const customers = [
    { code: '1900019268', name: '唐山君晟达商贸有限公司', city: '唐山市', province: '河北省' },
    { code: '1900056670', name: '许昌帮晟商贸有限公司', city: '许昌市', province: '河南省' },
    { code: '1900001227', name: '上海蒙牛乳业有限公司', city: '上海市', province: '上海市' },
    { code: '1906000633', name: '蒙牛湖北1号仓-武汉中央仓', city: '武汉市', province: '湖北省' },
    { code: '1900023401', name: '北京朝阳商贸有限公司', city: '北京市', province: '北京市' },
    { code: '1900034512', name: '石家庄鑫牛商贸有限公司', city: '石家庄市', province: '河北省' },
    { code: '1900045623', name: '济南泉城商贸有限公司', city: '济南市', province: '山东省' },
    { code: '1900056734', name: '郑州中原商贸有限公司', city: '郑州市', province: '河南省' },
    { code: '1900067845', name: '西安雁塔商贸有限公司', city: '西安市', province: '陕西省' },
    { code: '1900078956', name: '沈阳铁西商贸有限公司', city: '沈阳市', province: '辽宁省' },
];

// ============ 承运商 ============
export const carriers = [
    { code: '1820001803', name: '北京鲲鹏顺达供应链管理有限公司' },
    { code: '1840006058', name: '内蒙古信远物流有限公司' },
    { code: '1840051495', name: '芜湖安得智联科技有限公司' },
    { code: '1830012345', name: '河北恒通物流有限公司' },
    { code: '1850023456', name: '山东速达货运有限公司' },
    { code: '1860034567', name: '河南畅通物流有限公司' },
];

// ============ 车型 ============
export const vehicleTypes = ['4.2米长的箱式车', '6.8米高栏', '9.6米厢式货车', '13米半挂', '16.5米厢式货车'];

// ============ 装运路线 ============
export const routes = [
    { code: 'CQ4144', name: '常温滦南事业部-唐秦-汽运' },
    { code: 'CQ0024', name: '和林基地-鄂东(常温汽运)' },
    { code: 'CQ1151', name: '常温焦作事业部——豫北（汽运）' },
    { code: 'CQR640', name: '嘉定分拨-上海大区' },
    { code: 'CQ5201', name: '武汉基地-华中(常温汽运)' },
    { code: 'CQ6302', name: '成都基地-西南(常温汽运)' },
    { code: 'CQ3310', name: '和林基地-华北(常温汽运)' },
    { code: 'CQ4415', name: '滦南事业部-京津(汽运)' },
    { code: 'CQ2230', name: '焦作事业部-华中(汽运)' },
    { code: 'CQ5501', name: '武汉基地-华南(常温汽运)' },
];

// ============ 扩展的发货单数据（基于真实列结构） ============
// 核心字段: 装运编号, 发运车次编号, 工厂编码, 工厂名称, 车牌号, 车型, 司机姓名,
//          客户名称, 省市区, 送达方名称, 送达方地址, 距离, 合计毛重, 合计净重, 合计体积, 合计数量,
//          装运路线, 路线名称, 承运商名称, 计划交货日期, 装运单状态, 审核状态, 是否上传发货单
export const shippingOrders = [
    { id: '7005454781', tripNo: '202607140185', factoryCode: '3006', factoryName: '滦南常温工厂',
        plate: '冀B07U0S', vehicleType: '4.2米长的箱式车', driver: '韩雷刚',
        customerCode: '1900019268', customer: '唐山君晟达商贸有限公司',
        region: '河北省唐山市开平区', recipient: '唐山君晟达商贸有限公司',
        address: '河北省唐山市高新区火炬路410号联东U谷101',
        distance: 61.0, grossWeight: 10.890, netWeight: 7.165, volume: 11.689, qty: 1815,
        routeCode: 'CQ4144', routeName: '常温滦南事业部-唐秦-汽运',
        carrier: '北京鲲鹏顺达供应链管理有限公司',
        planDate: '2026-07-14', status: '新增', audit: '待审核', uploaded: '否' },

    { id: '7005454763', tripNo: '202607140178', factoryCode: '5035', factoryName: '和林事业部常温虚拟工厂',
        plate: '鲁H975T9', vehicleType: '16.5米厢式货车', driver: '张亮',
        customerCode: '1906000633', customer: '蒙牛湖北1号仓-武汉中央仓',
        region: '湖北省武汉市东西湖区', recipient: '蒙牛湖北1号仓-武汉共享仓',
        address: '湖北省武汉市东西湖区张柏路203号',
        distance: 1328.0, grossWeight: 28.718, netWeight: 24.492, volume: 15.914, qty: 4002,
        routeCode: 'CQ0024', routeName: '和林基地-鄂东(常温汽运)',
        carrier: '内蒙古信远物流有限公司',
        planDate: '2026-07-14', status: '新增', audit: '待审核', uploaded: '否' },

    { id: '7005454761', tripNo: '202607140184', factoryCode: '3450', factoryName: '焦作常温销售订单虚拟工厂',
        plate: '豫HR5672', vehicleType: '6.8米高栏', driver: '原小二',
        customerCode: '1900056670', customer: '许昌帮晟商贸有限公司',
        region: '河南省许昌市建安区', recipient: '许昌帮晟商贸有限公司',
        address: '河南省许昌市魏都区解放路17号',
        distance: 169.0, grossWeight: 15.523, netWeight: 7.056, volume: 33.904, qty: 3528,
        routeCode: 'CQ1151', routeName: '常温焦作事业部——豫北（汽运）',
        carrier: '芜湖安得智联科技有限公司',
        planDate: '2026-07-14', status: '新增', audit: '待审核', uploaded: '否' },

    // ====== 扩展数据 ======
    { id: '7005454801', tripNo: '202607140201', factoryCode: '3006', factoryName: '滦南常温工厂',
        plate: '冀B12345', vehicleType: '9.6米厢式货车', driver: '王志强',
        customerCode: '1900023401', customer: '北京朝阳商贸有限公司',
        region: '北京市朝阳区', recipient: '北京朝阳商贸有限公司',
        address: '北京市朝阳区东坝中路仓储中心',
        distance: 285.0, grossWeight: 18.520, netWeight: 14.310, volume: 22.450, qty: 3120,
        routeCode: 'CQ4415', routeName: '滦南事业部-京津(汽运)',
        carrier: '河北恒通物流有限公司',
        planDate: '2026-07-14', status: '已审核', audit: '已审核', uploaded: '是' },

    { id: '7005454815', tripNo: '202607140215', factoryCode: '3006', factoryName: '滦南常温工厂',
        plate: '冀B67890', vehicleType: '13米半挂', driver: '李建国',
        customerCode: '1900034512', customer: '石家庄鑫牛商贸有限公司',
        region: '河北省石家庄市长安区', recipient: '石家庄鑫牛商贸有限公司',
        address: '河北省石家庄市长安区和平东路仓储物流园',
        distance: 420.0, grossWeight: 32.100, netWeight: 26.500, volume: 38.720, qty: 5600,
        routeCode: 'CQ4144', routeName: '常温滦南事业部-唐秦-汽运',
        carrier: '北京鲲鹏顺达供应链管理有限公司',
        planDate: '2026-07-14', status: '已审核', audit: '已审核', uploaded: '是' },

    { id: '7005454822', tripNo: '202607140222', factoryCode: '6012', factoryName: '武汉常温工厂',
        plate: '鄂A12345', vehicleType: '9.6米厢式货车', driver: '张伟',
        customerCode: '1900067845', customer: '西安雁塔商贸有限公司',
        region: '陕西省西安市雁塔区', recipient: '西安雁塔商贸有限公司',
        address: '陕西省西安市雁塔区南三环仓储中心',
        distance: 680.0, grossWeight: 20.350, netWeight: 16.200, volume: 25.600, qty: 3800,
        routeCode: 'CQ5201', routeName: '武汉基地-华中(常温汽运)',
        carrier: '河南畅通物流有限公司',
        planDate: '2026-07-14', status: '已审核', audit: '已审核', uploaded: '是' },

    { id: '7005454830', tripNo: '202607140230', factoryCode: '6012', factoryName: '武汉常温工厂',
        plate: '鄂A78901', vehicleType: '16.5米厢式货车', driver: '赵明',
        customerCode: '1900056734', customer: '郑州中原商贸有限公司',
        region: '河南省郑州市中原区', recipient: '郑州中原商贸有限公司',
        address: '河南省郑州市中原区建设西路物流园',
        distance: 520.0, grossWeight: 30.800, netWeight: 25.100, volume: 36.200, qty: 5200,
        routeCode: 'CQ5201', routeName: '武汉基地-华中(常温汽运)',
        carrier: '河南畅通物流有限公司',
        planDate: '2026-07-14', status: '已审核', audit: '已审核', uploaded: '是' },

    { id: '7005454845', tripNo: '202607140245', factoryCode: '7010', factoryName: '成都常温工厂',
        plate: '川A34567', vehicleType: '13米半挂', driver: '陈志远',
        customerCode: '1900078956', customer: '沈阳铁西商贸有限公司',
        region: '辽宁省沈阳市铁西区', recipient: '沈阳铁西商贸有限公司',
        address: '辽宁省沈阳市铁西区北二路仓储中心',
        distance: 2450.0, grossWeight: 35.200, netWeight: 29.800, volume: 42.500, qty: 6800,
        routeCode: 'CQ6302', routeName: '成都基地-西南(常温汽运)',
        carrier: '芜湖安得智联科技有限公司',
        planDate: '2026-07-13', status: '运输中', audit: '已审核', uploaded: '是' },

    { id: '7005454860', tripNo: '202607140260', factoryCode: '5035', factoryName: '和林事业部常温虚拟工厂',
        plate: '蒙A56789', vehicleType: '16.5米厢式货车', driver: '巴特尔',
        customerCode: '1900023401', customer: '北京朝阳商贸有限公司',
        region: '北京市朝阳区', recipient: '北京朝阳商贸有限公司',
        address: '北京市朝阳区东坝中路仓储中心',
        distance: 485.0, grossWeight: 29.500, netWeight: 24.100, volume: 35.800, qty: 5100,
        routeCode: 'CQ3310', routeName: '和林基地-华北(常温汽运)',
        carrier: '内蒙古信远物流有限公司',
        planDate: '2026-07-14', status: '运输中', audit: '已审核', uploaded: '是' },

    { id: '7005454875', tripNo: '202607140275', factoryCode: '3450', factoryName: '焦作常温销售订单虚拟工厂',
        plate: '豫HR8901', vehicleType: '9.6米厢式货车', driver: '刘大伟',
        customerCode: '1900045623', customer: '济南泉城商贸有限公司',
        region: '山东省济南市历下区', recipient: '济南泉城商贸有限公司',
        address: '山东省济南市历下区经十路物流中心',
        distance: 420.0, grossWeight: 19.800, netWeight: 15.600, volume: 24.500, qty: 3600,
        routeCode: 'CQ2230', routeName: '焦作事业部-华中(汽运)',
        carrier: '芜湖安得智联科技有限公司',
        planDate: '2026-07-14', status: '已审核', audit: '已审核', uploaded: '是' },

    { id: '7005454890', tripNo: '202607140290', factoryCode: '3006', factoryName: '滦南常温工厂',
        plate: '冀B13579', vehicleType: '4.2米长的箱式车', driver: '孙明辉',
        customerCode: '1900019268', customer: '唐山君晟达商贸有限公司',
        region: '河北省唐山市开平区', recipient: '唐山君晟达商贸有限公司',
        address: '河北省唐山市高新区火炬路410号联东U谷101',
        distance: 58.0, grossWeight: 8.500, netWeight: 5.800, volume: 9.200, qty: 1500,
        routeCode: 'CQ4144', routeName: '常温滦南事业部-唐秦-汽运',
        carrier: '北京鲲鹏顺达供应链管理有限公司',
        planDate: '2026-07-15', status: '新增', audit: '待审核', uploaded: '否' },

    { id: '7005454900', tripNo: '202607140300', factoryCode: '9017', factoryName: '上海常温分销虚拟中转工厂',
        plate: '沪A24680', vehicleType: '6.8米高栏', driver: '周伟',
        customerCode: '1900001227', customer: '上海蒙牛乳业有限公司',
        region: '上海市徐汇区', recipient: '上海魅香食品有限公司',
        address: '上海市徐汇区龙吴路仓储中心',
        distance: 35.0, grossWeight: 5.200, netWeight: 3.850, volume: 6.800, qty: 1200,
        routeCode: 'CQR640', routeName: '嘉定分拨-上海大区',
        carrier: '芜湖安得智联科技有限公司',
        planDate: '2026-07-14', status: '已完成', audit: '已审核', uploaded: '是' },

    { id: '7005454910', tripNo: '202607140310', factoryCode: '6012', factoryName: '武汉常温工厂',
        plate: '鄂A56789', vehicleType: '16.5米厢式货车', driver: '吴大鹏',
        customerCode: '1906000633', customer: '蒙牛湖北1号仓-武汉中央仓',
        region: '湖北省武汉市东西湖区', recipient: '蒙牛湖北1号仓-武汉共享仓',
        address: '湖北省武汉市东西湖区张柏路203号',
        distance: 45.0, grossWeight: 26.400, netWeight: 22.300, volume: 28.900, qty: 4200,
        routeCode: 'CQ5501', routeName: '武汉基地-华南(常温汽运)',
        carrier: '河南畅通物流有限公司',
        planDate: '2026-07-13', status: '已完成', audit: '已审核', uploaded: '是' },

    { id: '7005454920', tripNo: '202607140320', factoryCode: '7010', factoryName: '成都常温工厂',
        plate: '川A89012', vehicleType: '13米半挂', driver: '何明',
        customerCode: '1900056734', customer: '郑州中原商贸有限公司',
        region: '河南省郑州市中原区', recipient: '郑州中原商贸有限公司',
        address: '河南省郑州市中原区建设西路物流园',
        distance: 1180.0, grossWeight: 33.600, netWeight: 28.200, volume: 40.100, qty: 6100,
        routeCode: 'CQ6302', routeName: '成都基地-西南(常温汽运)',
        carrier: '山东速达货运有限公司',
        planDate: '2026-07-13', status: '运输中', audit: '已审核', uploaded: '是' },
];

// ============ 交运单扩展数据 ============
// 核心字段: 交货单号, 交货单状态, 过账状态, 交货类型, 发货库房,
//          交货数量, 交货单净重(kg), 交货单毛总(kg), 体积（CDM),
//          运输计划时间, 计划发货时间, 客户名称, 送达方描述,
//          工厂编号, 所属工厂, 装运路线, 装运路线描述, 所属承运商,
//          目的地城市, 起始地城市, 创建时间
export const deliveryOrders = [
    { id: '839633540', status: '新增', posting: '未过账', type: '外向发货', publish: '否',
        warehouse: 'C224', qty: 500, netWeight: 3084.0, grossWeight: 3350.0, volume: 4237.0,
        planDate: '2026-07-16', shipDate: '2026-07-16', docDate: '2026-07-14', priority: 2,
        customerCode: '1900001227', customer: '上海蒙牛乳业有限公司',
        recipientCode: '0000141998', recipient: '上海魅香食品有限公司',
        factoryCode: '9017', factory: '上海常温分销虚拟中转工厂',
        routeCode: 'CQR640', routeName: '嘉定分拨-上海大区',
        carrier: '', destCity: '上海市/上海市', srcCity: '',
        remark: '7月份日期，抄批次，明天送货，送货前提前',
        creator: 'E100004191', createTime: '2026-07-14 10:19:57' },

    { id: '839634327', status: '新增', posting: '未过账', type: '外向发货', publish: '否',
        warehouse: 'C042', qty: 363, netWeight: 1433.124, grossWeight: 2178.0, volume: 2337.72,
        planDate: '2026-07-13', shipDate: '2026-07-13', docDate: '2026-07-14', priority: 2,
        customerCode: '1900019268', customer: '唐山君晟达商贸有限公司',
        recipientCode: '1900019268', recipient: '唐山君晟达商贸有限公司',
        factoryCode: '3006', factory: '滦南常温工厂',
        routeCode: 'CQ4144', routeName: '常温滦南事业部-唐秦-汽运',
        carrier: '北京鲲鹏顺达供应链管理有限公司', destCity: '河北省/唐山市', srcCity: '河北省/唐山市',
        remark: '',
        creator: '0019985', createTime: '2026-07-14 10:19:38' },

    { id: '839634326', status: '新增', posting: '未过账', type: '外向发货', publish: '否',
        warehouse: 'C042', qty: 1452, netWeight: 5732.496, grossWeight: 8712.0, volume: 9350.88,
        planDate: '2026-07-14', shipDate: '2026-07-14', docDate: '2026-07-14', priority: 2,
        customerCode: '1900019268', customer: '唐山君晟达商贸有限公司',
        recipientCode: '1900019268', recipient: '唐山君晟达商贸有限公司',
        factoryCode: '3006', factory: '滦南常温工厂',
        routeCode: 'CQ4144', routeName: '常温滦南事业部-唐秦-汽运',
        carrier: '北京鲲鹏顺达供应链管理有限公司', destCity: '河北省/唐山市', srcCity: '河北省/唐山市',
        remark: '',
        creator: '0019985', createTime: '2026-07-14 10:19:26' },

    // ====== 扩展 ======
    { id: '839634400', status: '已过账', posting: '已过账', type: '外向发货', publish: '是',
        warehouse: 'C042', qty: 1200, netWeight: 5200.5, grossWeight: 7800.0, volume: 8200.0,
        planDate: '2026-07-13', shipDate: '2026-07-13', docDate: '2026-07-13', priority: 1,
        customerCode: '1900023401', customer: '北京朝阳商贸有限公司',
        recipientCode: '1900023401', recipient: '北京朝阳商贸有限公司',
        factoryCode: '3006', factory: '滦南常温工厂',
        routeCode: 'CQ4415', routeName: '滦南事业部-京津(汽运)',
        carrier: '河北恒通物流有限公司', destCity: '北京市/朝阳区', srcCity: '河北省/唐山市',
        remark: '',
        creator: '0019985', createTime: '2026-07-13 14:20:00' },

    { id: '839634410', status: '已过账', posting: '已过账', type: '外向发货', publish: '是',
        warehouse: 'C186', qty: 2500, netWeight: 11200.8, grossWeight: 16800.0, volume: 17500.0,
        planDate: '2026-07-14', shipDate: '2026-07-14', docDate: '2026-07-14', priority: 2,
        customerCode: '1900034512', customer: '石家庄鑫牛商贸有限公司',
        recipientCode: '1900034512', recipient: '石家庄鑫牛商贸有限公司',
        factoryCode: '3006', factory: '滦南常温工厂',
        routeCode: 'CQ4144', routeName: '常温滦南事业部-唐秦-汽运',
        carrier: '北京鲲鹏顺达供应链管理有限公司', destCity: '河北省/石家庄市', srcCity: '河北省/唐山市',
        remark: '优先发货',
        creator: '0019985', createTime: '2026-07-14 08:00:00' },

    { id: '839634420', status: '已过账', posting: '已过账', type: '外向发货', publish: '是',
        warehouse: 'C330', qty: 800, netWeight: 3200.0, grossWeight: 5100.0, volume: 5600.0,
        planDate: '2026-07-14', shipDate: '2026-07-14', docDate: '2026-07-14', priority: 2,
        customerCode: '1900045623', customer: '济南泉城商贸有限公司',
        recipientCode: '1900045623', recipient: '济南泉城商贸有限公司',
        factoryCode: '3450', factory: '焦作常温销售订单虚拟工厂',
        routeCode: 'CQ2230', routeName: '焦作事业部-华中(汽运)',
        carrier: '芜湖安得智联科技有限公司', destCity: '山东省/济南市', srcCity: '河南省/焦作市',
        remark: '',
        creator: '0023456', createTime: '2026-07-14 09:15:00' },

    { id: '839634430', status: '已过账', posting: '已过账', type: '外向发货', publish: '是',
        warehouse: 'C520', qty: 3200, netWeight: 14800.0, grossWeight: 22000.0, volume: 23500.0,
        planDate: '2026-07-14', shipDate: '2026-07-14', docDate: '2026-07-14', priority: 2,
        customerCode: '1900056734', customer: '郑州中原商贸有限公司',
        recipientCode: '1900056734', recipient: '郑州中原商贸有限公司',
        factoryCode: '6012', factory: '武汉常温工厂',
        routeCode: 'CQ5201', routeName: '武汉基地-华中(常温汽运)',
        carrier: '河南畅通物流有限公司', destCity: '河南省/郑州市', srcCity: '湖北省/武汉市',
        remark: '',
        creator: '0034567', createTime: '2026-07-14 10:30:00' },

    { id: '839634440', status: '已过账', posting: '已过账', type: '外向发货', publish: '是',
        warehouse: 'C640', qty: 600, netWeight: 2800.0, grossWeight: 4200.0, volume: 4500.0,
        planDate: '2026-07-14', shipDate: '2026-07-14', docDate: '2026-07-14', priority: 3,
        customerCode: '1900001227', customer: '上海蒙牛乳业有限公司',
        recipientCode: '0000142001', recipient: '上海浦东新区配送中心',
        factoryCode: '9017', factory: '上海常温分销虚拟中转工厂',
        routeCode: 'CQR640', routeName: '嘉定分拨-上海大区',
        carrier: '', destCity: '上海市/浦东新区', srcCity: '上海市/嘉定区',
        remark: '冷链优先',
        creator: 'E100004191', createTime: '2026-07-14 11:00:00' },

    { id: '839634450', status: '待审核', posting: '未过账', type: '外向发货', publish: '否',
        warehouse: 'C187', qty: 1800, netWeight: 8500.0, grossWeight: 12500.0, volume: 13200.0,
        planDate: '2026-07-16', shipDate: '2026-07-16', docDate: '2026-07-14', priority: 2,
        customerCode: '1900067845', customer: '西安雁塔商贸有限公司',
        recipientCode: '1900067845', recipient: '西安雁塔商贸有限公司',
        factoryCode: '6012', factory: '武汉常温工厂',
        routeCode: 'CQ5201', routeName: '武汉基地-华中(常温汽运)',
        carrier: '河南畅通物流有限公司', destCity: '陕西省/西安市', srcCity: '湖北省/武汉市',
        remark: '',
        creator: '0034567', createTime: '2026-07-14 13:00:00' },

    { id: '839634460', status: '新增', posting: '未过账', type: '外向发货', publish: '否',
        warehouse: 'C224', qty: 1500, netWeight: 6800.0, grossWeight: 10200.0, volume: 11000.0,
        planDate: '2026-07-17', shipDate: '2026-07-17', docDate: '2026-07-15', priority: 2,
        customerCode: '1900078956', customer: '沈阳铁西商贸有限公司',
        recipientCode: '1900078956', recipient: '沈阳铁西商贸有限公司',
        factoryCode: '7010', factory: '成都常温工厂',
        routeCode: 'CQ6302', routeName: '成都基地-西南(常温汽运)',
        carrier: '芜湖安得智联科技有限公司', destCity: '辽宁省/沈阳市', srcCity: '四川省/成都市',
        remark: '长距离运输',
        creator: '0045678', createTime: '2026-07-14 14:00:00' },

    { id: '839634470', status: '已过账', posting: '已过账', type: '外向发货', publish: '是',
        warehouse: 'C033', qty: 2800, netWeight: 12600.0, grossWeight: 18900.0, volume: 19800.0,
        planDate: '2026-07-14', shipDate: '2026-07-14', docDate: '2026-07-14', priority: 1,
        customerCode: '1900023401', customer: '北京朝阳商贸有限公司',
        recipientCode: '1900023401', recipient: '北京朝阳商贸有限公司',
        factoryCode: '5035', factory: '和林事业部常温虚拟工厂',
        routeCode: 'CQ3310', routeName: '和林基地-华北(常温汽运)',
        carrier: '内蒙古信远物流有限公司', destCity: '北京市/朝阳区', srcCity: '内蒙古/呼和浩特市',
        remark: '紧急订单',
        creator: '0056789', createTime: '2026-07-14 08:30:00' },
];

// ============ 汇总统计（用于报表） ============
export function getStats() {
    const totalGrossWeight = shippingOrders.reduce((s, o) => s + o.grossWeight, 0);
    const totalNetWeight = shippingOrders.reduce((s, o) => s + o.netWeight, 0);
    const totalQty = shippingOrders.reduce((s, o) => s + o.qty, 0);
    const totalDistance = shippingOrders.reduce((s, o) => s + o.distance, 0);
    const avgDistance = totalDistance / shippingOrders.length;
    const totalVolume = shippingOrders.reduce((s, o) => s + o.volume, 0);

    const deliveryTotalQty = deliveryOrders.reduce((s, o) => s + o.qty, 0);
    const deliveryTotalNetWeight = deliveryOrders.reduce((s, o) => s + o.netWeight, 0);
    const deliveryTotalGrossWeight = deliveryOrders.reduce((s, o) => s + o.grossWeight, 0);

    const byFactory = {};
    shippingOrders.forEach(o => {
        if (!byFactory[o.factoryName]) byFactory[o.factoryName] = { count: 0, grossWeight: 0, netWeight: 0, qty: 0 };
        byFactory[o.factoryName].count++;
        byFactory[o.factoryName].grossWeight += o.grossWeight;
        byFactory[o.factoryName].netWeight += o.netWeight;
        byFactory[o.factoryName].qty += o.qty;
    });

    const byCarrier = {};
    shippingOrders.forEach(o => {
        if (!byCarrier[o.carrier]) byCarrier[o.carrier] = { count: 0, grossWeight: 0 };
        byCarrier[o.carrier].count++;
        byCarrier[o.carrier].grossWeight += o.grossWeight;
    });

    const byRoute = {};
    shippingOrders.forEach(o => {
        if (!byRoute[o.routeName]) byRoute[o.routeName] = { count: 0, grossWeight: 0, avgDistance: 0, distances: [] };
        byRoute[o.routeName].count++;
        byRoute[o.routeName].grossWeight += o.grossWeight;
        byRoute[o.routeName].distances.push(o.distance);
    });
    Object.values(byRoute).forEach(r => {
        r.avgDistance = Math.round(r.distances.reduce((s, d) => s + d, 0) / r.distances.length);
        delete r.distances;
    });

    const byVehicleType = {};
    shippingOrders.forEach(o => {
        if (!byVehicleType[o.vehicleType]) byVehicleType[o.vehicleType] = { count: 0, grossWeight: 0 };
        byVehicleType[o.vehicleType].count++;
        byVehicleType[o.vehicleType].grossWeight += o.grossWeight;
    });

    const deliveryByStatus = {};
    deliveryOrders.forEach(o => {
        if (!deliveryByStatus[o.status]) deliveryByStatus[o.status] = { count: 0, qty: 0, netWeight: 0 };
        deliveryByStatus[o.status].count++;
        deliveryByStatus[o.status].qty += o.qty;
        deliveryByStatus[o.status].netWeight += o.netWeight;
    });

    return {
        shipping: {
            total: shippingOrders.length,
            totalGrossWeight: totalGrossWeight.toFixed(1),
            totalNetWeight: totalNetWeight.toFixed(1),
            totalQty, totalVolume: totalVolume.toFixed(1),
            totalDistance,
            avgDistance: Math.round(avgDistance),
            byFactory, byCarrier, byRoute, byVehicleType,
        },
        delivery: {
            total: deliveryOrders.length,
            totalQty: deliveryTotalQty,
            totalNetWeight: deliveryTotalNetWeight.toFixed(0),
            totalGrossWeight: deliveryTotalGrossWeight.toFixed(0),
            byStatus: deliveryByStatus,
        },
    };
}

// ============ 发货单核心字段 Schema ============
export const shippingOrderSchema = {
    tableName: 'shipping_orders',
    tableLabel: '发货单表',
    description: '蒙牛常温事业部发货单主表，记录从工厂到客户的完整发运信息',
    rowCount: '日均 200+',
    updateFreq: '实时',
    fields: [
        { name: 'shipment_id', type: 'VARCHAR(20)', desc: '装运编号（主键）', sample: '7005454781' },
        { name: 'trip_no', type: 'VARCHAR(20)', desc: '发运车次编号', sample: '202607140185' },
        { name: 'factory_code', type: 'VARCHAR(10)', desc: '工厂编码，关联 factory_info', sample: '3006' },
        { name: 'factory_name', type: 'VARCHAR(50)', desc: '工厂名称', sample: '滦南常温工厂' },
        { name: 'plate_number', type: 'VARCHAR(20)', desc: '车牌号', sample: '冀B07U0S' },
        { name: 'vehicle_type', type: 'VARCHAR(30)', desc: '车型', sample: '4.2米长的箱式车' },
        { name: 'driver_name', type: 'VARCHAR(20)', desc: '司机姓名', sample: '韩雷刚' },
        { name: 'driver_phone', type: 'VARCHAR(20)', desc: '司机手机号' },
        { name: 'customer_code', type: 'VARCHAR(20)', desc: '客户编码', sample: '1900019268' },
        { name: 'customer_name', type: 'VARCHAR(60)', desc: '客户名称' },
        { name: 'region', type: 'VARCHAR(50)', desc: '省市区' },
        { name: 'recipient_name', type: 'VARCHAR(60)', desc: '送达方名称' },
        { name: 'recipient_address', type: 'VARCHAR(100)', desc: '送达方地址' },
        { name: 'distance_km', type: 'DOUBLE', desc: '运输距离（公里）', sample: '61.0' },
        { name: 'gross_weight_t', type: 'DOUBLE', desc: '合计毛重（吨）', sample: '10.89' },
        { name: 'net_weight_t', type: 'DOUBLE', desc: '合计净重（吨）', sample: '7.17' },
        { name: 'volume_cbm', type: 'DOUBLE', desc: '合计体积（立方米）', sample: '11.69' },
        { name: 'total_qty', type: 'INT', desc: '合计数量（件）', sample: '1815' },
        { name: 'route_code', type: 'VARCHAR(20)', desc: '装运路线编码' },
        { name: 'route_name', type: 'VARCHAR(60)', desc: '路线名称' },
        { name: 'carrier_name', type: 'VARCHAR(60)', desc: '承运商名称' },
        { name: 'plan_delivery_date', type: 'DATETIME', desc: '计划交货日期' },
        { name: 'status', type: 'VARCHAR(20)', desc: '装运单状态：新增/已审核/运输中/已完成' },
        { name: 'audit_status', type: 'VARCHAR(20)', desc: '审核状态：待审核/已审核' },
        { name: 'delivery_type', type: 'VARCHAR(20)', desc: '交货类型：外向发货/补充交货' },
        { name: 'created_time', type: 'DATETIME', desc: '创建时间' },
    ],
};

// ============ 交运单核心字段 Schema ============
export const deliveryOrderSchema = {
    tableName: 'delivery_orders',
    tableLabel: '交运单表',
    description: '蒙牛常温事业部交运单表，记录交货执行的详细信息',
    rowCount: '日均 300+',
    updateFreq: '实时',
    fields: [
        { name: 'delivery_id', type: 'BIGINT', desc: '交货单号（主键）', sample: '839633540' },
        { name: 'delivery_status', type: 'VARCHAR(20)', desc: '交货单状态：新增/待审核/已过账' },
        { name: 'posting_status', type: 'VARCHAR(20)', desc: '过账状态：未过账/已过账' },
        { name: 'delivery_type', type: 'VARCHAR(20)', desc: '交货类型：外向发货' },
        { name: 'warehouse', type: 'VARCHAR(20)', desc: '发货库房编码' },
        { name: 'delivery_qty', type: 'INT', desc: '交货数量（件）', sample: '500' },
        { name: 'net_weight_kg', type: 'DOUBLE', desc: '交货单净重（kg）', sample: '3084.0' },
        { name: 'gross_weight_kg', type: 'DOUBLE', desc: '交货单毛重（kg）', sample: '3350.0' },
        { name: 'volume_cdm', type: 'DOUBLE', desc: '体积（CDM）', sample: '4237.0' },
        { name: 'plan_transport_date', type: 'DATE', desc: '运输计划时间' },
        { name: 'plan_ship_date', type: 'DATE', desc: '计划发货时间' },
        { name: 'doc_date', type: 'DATE', desc: '凭证日期' },
        { name: 'priority', type: 'INT', desc: '交货优先权（1=最高）' },
        { name: 'order_id', type: 'BIGINT', desc: '关联订单编号' },
        { name: 'customer_code', type: 'VARCHAR(20)', desc: '客户代码' },
        { name: 'customer_name', type: 'VARCHAR(60)', desc: '客户名称' },
        { name: 'recipient_code', type: 'VARCHAR(20)', desc: '送达方编码' },
        { name: 'recipient_desc', type: 'VARCHAR(60)', desc: '送达方描述' },
        { name: 'factory_code', type: 'VARCHAR(10)', desc: '工厂编号' },
        { name: 'factory_name', type: 'VARCHAR(50)', desc: '所属工厂' },
        { name: 'route_code', type: 'VARCHAR(20)', desc: '装运路线编码' },
        { name: 'route_name', type: 'VARCHAR(60)', desc: '装运路线描述' },
        { name: 'carrier_name', type: 'VARCHAR(60)', desc: '所属承运商' },
        { name: 'dest_city', type: 'VARCHAR(30)', desc: '目的地城市' },
        { name: 'src_city', type: 'VARCHAR(30)', desc: '起始地城市' },
        { name: 'created_time', type: 'DATETIME', desc: '创建时间' },
    ],
};
