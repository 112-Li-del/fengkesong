# 栖霞山赏秋地图素材

景点来源：2026-10-28 查询高德地点搜索 API，按地点名称、景区内地址及坐标人工核对。`lib/qixia-places.json` 保存 24 个高德 POI ID、原始名称、GCJ-02 经纬度和展示名称。入口牌坊采用「栖霞禅寺牌坊」，始皇临江处采用高德「始皇临江」点位。点位不代表当前开放状态。

霜红苑、桃花涧、桃花坞、印心湖、萌宠乐园未获得可靠匹配，不以附近景点或景区外同名商家代替。地图浏览范围是产品展示范围，不是官方景区边界。

地图交互：全景和最小缩放根据当前地图容器、控制面板预留区域以及 24 个景点的真实坐标计算。允许看到浏览范围周边背景，地图中心到达边缘后限制在最近边缘，不回跳到景区中央。窗口尺寸变化时，全景会重新拟合；已放大的视图保留当前中心与允许的缩放级别。

24 个已核实景点各自保留独立坐标点，不做数字聚合，也不按 `tier` 隐藏坐标点。`tier` 决定插画及初次排布的优先级。名称标签在初次显示及地图容器尺寸变化时，根据实际像素尺寸安排位置，以细引线连接真实落点；随后固定相对于节点的屏幕偏移，地图拖动、缩放、导览面板展开和底图切换均不将标签推开。标签经过面板下方时由面板遮挡，离开后恢复可见，不迁移到其他位置。空间不足的标签使用节点旁的固定位置，不合并或取消该景点。完整名称也可从全部景点列表访问。引线不是游览路线。地图上的“金陵秋色／栖霞山／一山红叶 · 漫游栖霞”装饰标题已移除。

点击地图坐标点或名称只选中、强调并显示详情，不缩放或居中；键盘 Enter / 空格行为相同。列表选择的景点若在屏幕外或被面板遮挡，则只平移到可见区域，不改变缩放。引擎双击缩放已关闭，缩放按钮、滚轮与双指缩放继续可用。手绘与高德底图共用真实坐标，名称排布独立于插画显隐。

`qixia-terrain-wash.svg` 根据现有 `public/terrain/qixia.json` 高程网格生成分层水彩色块，浏览器渲染成 `qixia-terrain-wash.png` 后作为地图纹理，避免 WebGL 中 SVG 透明度异常。地形来源和日期见该 JSON。图层边界由 WGS84 转成 GCJ-02 后叠加；插画及红枫装饰不用于表达建筑轮廓、植物实况或红叶指数。高德道路、地理坐标和地图署名保留。未添加参考图中的 A/B/C 游览路线。

`qixia-watercolor-atlas.png` 使用内置 imagegen 生成，透明背景，2×2 等分图集，依次为寺庙、石塔、亭子、红枫。项目通过 CSS background-position 使用各格，不含参考图上的文字及线路。

生成提示词：

> Create a production-ready square sprite atlas of FOUR separate Chinese autumn tourist-map watercolor illustrations on a truly transparent background, a precise 2 by 2 grid of equally sized cells. Each icon entirely fits inside its own cell with generous empty margin, no overlap between cells. Top left cell: a small traditional Chinese Buddhist temple with red ochre walls, dark gray tiled sweeping roofs, two golden-orange maple trees. Top right cell: an elegant ancient pale stone octagonal five-storey pagoda, gray-beige stone with fine ink lines, a red maple tree. Bottom left cell: a delicate Chinese wooden lakeside pavilion with a gray sweeping tiled roof, tiny pale blue water accent and golden-red maple tree. Bottom right cell: a lush cluster of three Chinese sweetgum/maple trees in vermilion, burnt orange, warm yellow, tiny grass, no buildings. Style: refined hand-painted Chinese scenic tourist-map watercolor illustration, soft ochre pigment textures and thin brown ink details, slightly isometric aerial 3/4 view, warm nostalgic autumn palette, evocative of a Qixia Mountain illustrated guide map. Architectural forms coherent and elegant. Not flat vector or clipart. Transparent negative space; no paper rectangle, no sky or backdrop, no white matte, no drop shadow extending outside cell. NO text, NO letters, NO numbers, NO captions, NO lines connecting icons, NO paths, NO borders. The atlas will be used in CSS as four equal background-position cells; keep all four icons in consistent scale and centered within their exact quadrants.
