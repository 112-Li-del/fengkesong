# 栖霞山赏秋地图素材

景点目录由 `lib/qixia-places.json` 与 `lib/qixia-places-extra.json` 合并，2026-10-29 勘误后共102处景点标记，包含47处高德 POI 和55处导览图配准点。最初24个高德点位于2026-10-28查询并核对；配准点不代表经现场测绘验证。入口牌坊采用「栖霞禅寺牌坊」，始皇临江处采用高德「始皇临江」点位。名称、重复标记及坐标处置详见 [点位勘误处理记录](../../MAP_ERRATA_2026-10-29.md)。目录中的点位不代表当前开放状态。

霜红苑、桃花涧、桃花坞、印心湖、萌宠乐园未获得可靠匹配，不以附近景点或景区外同名商家代替。地图浏览范围是产品展示范围，不是官方景区边界。

地图交互：初次打开与“全景”按钮沿用 `lib/scenic-view.ts` 的基础画面（西 118.953996、南 32.146498、东 118.971714、北 32.159612，GCJ-02）。地图不再锁定景区范围或基础缩放中心，可自由拖动到景区外，缩放范围为高德 2–20 级。窗口尺寸变化时更新全景适配参数，不主动将用户拉回景区。用户位置判断和景点数据的查询范围独立于地图浏览范围，本次仅解除浏览锁定。

景点按 `lib/qixia-map.ts` 的一级名单分类，钟楼与鼓楼分别按一级显示，其余均为二级，不以数据来源或旧目录的 tier 判断。一级默认显示贴图、节点和名称；二级默认只显示节点，从当前屏幕适配的基础全景放大一级后才显示贴图和名称，缩小后重新隐藏，选中二级景点不会绕过缩放规则。“仅节点”开关优先于两级显示规则，开启时所有贴图和名称均隐藏。每个景点的贴图、节点和名称共用一个高德标记：贴图底部在节点上方，名称固定在节点右侧 12px，不使用引线或避让算法将名称拉远。拖动、缩放、窗口尺寸变化和面板展开均保持三者的相对位置。密集区域允许自然重叠，可放大地图或从地点列表选中景点查看。装饰枫树林和“金陵秋色／栖霞山／一山红叶 · 漫游栖霞”装饰标题已移除。分级只调整已有点位的展示，不补造缺失坐标，也不提高导览图配准点位的坐标可信度。

点击地图坐标点或名称只选中、强调并显示详情，不缩放或居中；键盘 Enter / 空格行为相同。列表选择的景点若在屏幕外或被面板遮挡，则只平移到可见区域，不改变缩放。引擎双击缩放已关闭，缩放按钮、滚轮与双指缩放继续可用。手绘与高德底图共用真实坐标，切换底图仍保留所有景点贴图和名称。

道路显示：`lib/qixia-roads.json` 保存 2026-10-29 查询高德 Walking 得到的 101 组道路轨迹，查询目标为 45 处园内景点的邻接道路及外围环山通道，不包括景区外的栖霞古镇。去重后保留 1003 条原始道路边，串接为 212 段连续折线，补齐西侧有灵云意、虎山、北侧山顶周边及南侧蝴蝶谷等区域。道路以 5px 白色实线和细描边叠加在地形上方，不增加全图路网，不修改景区外街道的样式。步行导航采用 7px 蓝色实线、白色描边和方向箭头，显示在园内道路之上、景点标记之下；导航路径仍来自高德实时步行规划结果。这些数据不是官方完整路网或景区边界，不代表全部游步道和实时开放状态；定照庵石刻附近的高德道路止于距目录点位约 266 米处，未用直线补接。道路是否开放请以现场指引为准。

`qixia-terrain-wash.svg` 和 `qixia-terrain-wash.png` 是依据 `public/terrain/qixia.json` 高程网格生成的历史水彩纹理素材，当前赏秋模式不加载该矩形图层。高德道路、地理坐标和地图署名保留；景点插画不表达建筑轮廓、植物实况或红叶指数。未添加参考图中的 A/B/C 游览路线。

`qixia-watercolor-atlas.png` 使用内置 imagegen 生成，透明背景，2×2 等分图集，依次为寺庙、石塔、亭子、红枫。项目通过 CSS background-position 使用各格，不含参考图上的文字及线路。

生成提示词：

> Create a production-ready square sprite atlas of FOUR separate Chinese autumn tourist-map watercolor illustrations on a truly transparent background, a precise 2 by 2 grid of equally sized cells. Each icon entirely fits inside its own cell with generous empty margin, no overlap between cells. Top left cell: a small traditional Chinese Buddhist temple with red ochre walls, dark gray tiled sweeping roofs, two golden-orange maple trees. Top right cell: an elegant ancient pale stone octagonal five-storey pagoda, gray-beige stone with fine ink lines, a red maple tree. Bottom left cell: a delicate Chinese wooden lakeside pavilion with a gray sweeping tiled roof, tiny pale blue water accent and golden-red maple tree. Bottom right cell: a lush cluster of three Chinese sweetgum/maple trees in vermilion, burnt orange, warm yellow, tiny grass, no buildings. Style: refined hand-painted Chinese scenic tourist-map watercolor illustration, soft ochre pigment textures and thin brown ink details, slightly isometric aerial 3/4 view, warm nostalgic autumn palette, evocative of a Qixia Mountain illustrated guide map. Architectural forms coherent and elegant. Not flat vector or clipart. Transparent negative space; no paper rectangle, no sky or backdrop, no white matte, no drop shadow extending outside cell. NO text, NO letters, NO numbers, NO captions, NO lines connecting icons, NO paths, NO borders. The atlas will be used in CSS as four equal background-position cells; keep all four icons in consistent scale and centered within their exact quadrants.

## 地图装饰

地图保留高德原始底图颜色、景点插画与名称、园内道路和步行导航。树冠剪影、落叶动画和落叶开关已移除，不加载额外树冠图案、全图滤镜、矩形地形纹理或插画覆盖试验素材。地图自由拖动和缩放功能保留。
