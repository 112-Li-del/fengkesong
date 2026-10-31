# 栖霞山赏秋地图素材

景点目录：`lib/qixia-places.json` 与 `lib/qixia-places-extra.json` 合计保存120处景点；`lib/qixia-facilities.json` 保存70处服务设施，共190个节点。`lib/map-search.ts` 将全部节点合并为本地搜索目录，搜索不依赖高德附近查询。目录中的点位不代表当前开放状态。

部分细部景点与设施位置来自导览图配准，加入搜索不提高其坐标精度或核实等级。地图浏览范围是产品展示范围，不是官方景区边界。

分类原则：景点目录归“景点”，商业咖啡、餐馆与休息设施归“休息”，其他设施按卫生间、停车交通、门票入口、购物补给、安全医疗分类。文化景点与附近同名商家分别保留，原group控制图标与颜色，category控制大类过滤。

搜索面板：顶栏入口为“景点搜索”，依次显示搜索框、全部/景点/休息/卫生间/停车交通/门票入口/购物补给/安全医疗分类和结果列表。输入关键词只更新下方名称联想，不改变地图节点、已有选中状态或视角；类别筛选才改变地图可见节点，选择卫生间时只显示卫生间节点，全部显示所有节点。点击候选地点，或在精确/唯一匹配时点击搜索（含回车），才聚焦、高亮并轻微弹动对应节点；多个模糊匹配时由用户选择，零匹配不清空地图。减少动态效果设置下只高亮，不弹动。重复设施名用邻近景点说明辅助区分。景点详情在独立卡片中显示，手机选择结果后收起搜索面板。搜索、定位、天气、地点详情、附近提示与完整知识卡使用轻量淡入上移的弹出动效；切换地点时重新播放，系统减少动态效果模式下关闭动画。

地图交互：初次打开与“全景”按钮沿用 `lib/scenic-view.ts` 的基础画面（西 118.953996、南 32.146498、东 118.971714、北 32.159612，GCJ-02）。地图不再锁定景区范围或基础缩放中心，可自由拖动到景区外，缩放范围为高德 2–20 级。窗口尺寸变化时更新全景适配参数，不主动将用户拉回景区。用户位置判断和景点数据的查询范围独立于地图浏览范围，本次仅解除浏览锁定。

地图节点按类别筛选，再应用下文四级显示规则；关键词输入不筛除地图节点。景点仍使用独立坐标，名称与插画固定在节点附近，不使用长引线；设施在低缩放下聚合，聚合仅包含筛选后保留的设施。

点击地图坐标点或名称切换选中状态：首次点击高亮并显示详情，再次点击同一点取消高亮并关闭卡片，点击另一点直接切换；不缩放或居中，键盘 Enter / 空格行为相同。从搜索或地点列表选择景点时，每次将景点居中到未被展开的地点面板遮挡的最大可见区域，并至少聚焦到基础全景放大半级的视角（自动聚焦最高17级）；当前视角更近时保持原缩放，连续选择不会逐次放大。面板折叠时不计其遮挡。引擎双击缩放已关闭，缩放按钮、滚轮与双指缩放继续可用。手绘与高德底图共用GCJ-02坐标，估算点不等同于实测位置，切换底图仍保留所有景点贴图和名称。

道路显示：赏秋模式直接展示高德JS API原生道路与建筑。前景交互地图开启 `road/building` 并将DOM背景设为透明；其下为按地理坐标投影的黄色SVG纸底，再下方的同步高德底图保留景区外原色与湖泊孔洞中的水面。纸底不会盖住原生细路。已移除 `lib/qixia-roads.json` 步行路线子集的白色覆盖线，蓝色步行导航仍来自高德实时规划。高德自行控制道路缩放分级：16级起能看到更多园内细路，远景不会强行补画不存在的路。地图上的原生道路和POI共用GCJ-02坐标。

2026-10-30至31日坐标复核：56个点匹配实时高德POI，稳定ID不变，新增providerId和coordinateSource；43个历史高德点均已通过详情或同ID搜索复核，另有13个导览图点匹配到了高德POI。98个导览图估算点中28个作局部小幅修正，最大约8.74米，保留估算身份。局部修正使用120米内、位移不超过30米的锚点残差，远处不动，不强制吸附道路，不宣称实测精度。完整原坐标、新坐标、来源与歧义记录见 `lib/qixia-coordinate-audit.json`。财神殿与高德「财神店」差约155米且用途有歧义，未自动替换。

`qixia-terrain-wash.svg` 和 `qixia-terrain-wash.png` 是依据 `public/terrain/qixia.json` 高程网格生成的历史水彩纹理素材，当前赏秋模式不加载该矩形图层。高德道路、地理坐标和地图署名保留；景点插画不表达建筑轮廓、植物实况或红叶指数。A/B/C 推荐路线已接入站点编号展示，不绘制未经核实的连线。

`qixia-watercolor-atlas.png` 使用内置 imagegen 生成，透明背景，2×2 等分图集，依次为寺庙、石塔、亭子、红枫。项目通过 CSS background-position 使用各格，不含参考图上的文字及线路。

生成提示词：

> Create a production-ready square sprite atlas of FOUR separate Chinese autumn tourist-map watercolor illustrations on a truly transparent background, a precise 2 by 2 grid of equally sized cells. Each icon entirely fits inside its own cell with generous empty margin, no overlap between cells. Top left cell: a small traditional Chinese Buddhist temple with red ochre walls, dark gray tiled sweeping roofs, two golden-orange maple trees. Top right cell: an elegant ancient pale stone octagonal five-storey pagoda, gray-beige stone with fine ink lines, a red maple tree. Bottom left cell: a delicate Chinese wooden lakeside pavilion with a gray sweeping tiled roof, tiny pale blue water accent and golden-red maple tree. Bottom right cell: a lush cluster of three Chinese sweetgum/maple trees in vermilion, burnt orange, warm yellow, tiny grass, no buildings. Style: refined hand-painted Chinese scenic tourist-map watercolor illustration, soft ochre pigment textures and thin brown ink details, slightly isometric aerial 3/4 view, warm nostalgic autumn palette, evocative of a Qixia Mountain illustrated guide map. Architectural forms coherent and elegant. Not flat vector or clipart. Transparent negative space; no paper rectangle, no sky or backdrop, no white matte, no drop shadow extending outside cell. NO text, NO letters, NO numbers, NO captions, NO lines connecting icons, NO paths, NO borders. The atlas will be used in CSS as four equal background-position cells; keep all four icons in consistent scale and centered within their exact quadrants.

## 地图装饰

“赏秋手绘”模式在栖霞山局部轮廓内铺不透明米黄纸底（#f4f2af），景区外保留高德底图原色；切换“高德底图”会移除纸底。覆盖范围独立保存在 `lib/qixia-paper-boundary.json`，依据2026-10-30项目高德底图可见轮廓人工描绘，为美术展示范围，不是官方实测景区边界，不用于定位、导航或进出景区判定。后续可按用户标注微调轮廓。纸底为无边线SVG多环路径，湖泊轮廓留孔，位于原生道路与建筑层下方；不接收鼠标事件，随拖动、缩放及容器尺寸变化更新，卸载时清理背景地图和监听。

保留景点插画与名称、园内道路和步行导航。树冠剪影、落叶动画和落叶开关已移除，不加载全图滤镜、矩形地形纹理或插画覆盖试验素材。纸底下方原生水面通过湖泊孔洞露出，原生建筑和细路位于纸底上方；切到高德底图时隐藏背景纸底与美术装饰。地图自由拖动和缩放功能保留。

根据用户2026-10-30两次截图中的11个红圈接入山体装饰，选用 `line-art-v1/` 中自生成的3款山体与3款山脊，结合镜像、轻微旋转和不同尺寸形成变化。地理位置、范围和朝向保存在 `lib/qixia-mountain-decorations.json`，由截图中的古镇、蝴蝶谷节点对齐，仅表示用户指定的装饰位置，不代表实测山峰。11个无交互装饰标记随地图缩放调整尺寸，低于景点标记，切换高德底图时与纸底一起隐藏；“仅节点”开关继续只隐藏景点贴图和名称。树丛等其他素材尚未接入。

湖泊与标题装饰恢复本地main已有素材和坐标配置（`lib/qixia-*-decoration.json`、`public/maps/qixia-lake-*.png`），随地图缩放并与黄色模式同步切换。旧 `qixia-lake-decorations.json` 的Polyline装饰不再挂载。美术水纹不作为实际水体范围或地理查询数据。

## 景点分级（当前规则）

显示规则由 `lib/scenic-display.ts` 管理，不再按 QXS 编号区分。用户提供的热度榜仅作为展示排序参考，不作为官方客流数据：一级为七个 S 档景点及牌坊；二级为十个 A 档景点；三级为其余推荐路线站点及主要文化景点；其他为四级。缩放 <16 / 16–17 / 17–18 / ≥18 依次展开。标签预算为8/12/16/20，窄屏最多10个；四方近距离避让，放不下只保留点，不使用长引线，不移动坐标。所有展开的景点同时显示现有贴图和名称，两者整体避让；未达到展开层级或空间不足时，普通景点收起贴图和名称、保留可点击小红点，路线站点保留编号点，选中点优先展开。

推荐路线选择 A/B/C 后，视窗内已有坐标的各站不受等级限制，显示编号点；名称仍受避让限制，点击点可看名称和卡片。霜红苑已按产品决定从路线中移除，A线编号连续排列；钟楼与鼓楼各自编号。此功能展示站点顺序，不绘制未经核实的路线连线。切换设施分类仍按类别过滤。搜索输入只更新候选，不改变地图点位；选择结果后高亮该点。黄色底色和道路图层不受分级影响。

## 定位推荐与新增点位

新增高德点位、休息分类、实时定位推荐与验证边界见 `../../QIXIA_TRIP_RECOMMENDATION.md`。最新数量为120处景点、70处设施，共190个节点；此前坐标审计保留，新增复核与局部校准见 `lib/qixia-poi-audit-2026-10-31.json`。
