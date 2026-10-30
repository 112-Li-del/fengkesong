# 栖霞山赏秋地图素材

景点目录：`lib/qixia-places.json` 与 `lib/qixia-places-extra.json` 合计保存102处景点；`lib/qixia-facilities.json` 保存44处服务设施。`lib/map-search.ts` 将全部146个节点合并为本地搜索目录，搜索不依赖高德附近查询。目录中的点位不代表当前开放状态。

部分细部景点与设施位置来自导览图配准，加入搜索不提高其坐标精度或核实等级。地图浏览范围是产品展示范围，不是官方景区边界。

搜索面板：顶栏入口为“景点搜索”，依次显示搜索框、全部/景点/厕所/餐饮/休息分类和结果列表。关键词与类别取交集，列表和地图使用相同的节点ID集合；选择厕所时只显示厕所节点，全部显示所有节点。重复设施名用邻近景点说明辅助区分。景点详情在独立卡片中显示，手机选择结果后收起搜索面板。

地图交互：初次打开与“全景”按钮沿用 `lib/scenic-view.ts` 的基础画面（西 118.953996、南 32.146498、东 118.971714、北 32.159612，GCJ-02）。地图不再锁定景区范围或基础缩放中心，可自由拖动到景区外，缩放范围为高德 2–20 级。窗口尺寸变化时更新全景适配参数，不主动将用户拉回景区。用户位置判断和景点数据的查询范围独立于地图浏览范围，本次仅解除浏览锁定。

地图节点先按搜索关键词与类别筛选，再应用原有插画显示规则：高德目录景点正常显示，QXS配准点在16.6级及以上展开插画和名称。景点仍使用独立坐标，名称与插画固定在节点附近，不使用长引线；设施在低缩放下聚合，聚合仅包含筛选后保留的设施。

点击地图坐标点或名称切换选中状态：首次点击高亮并显示详情，再次点击同一点取消高亮并关闭卡片，点击另一点直接切换；不缩放或居中，键盘 Enter / 空格行为相同。从搜索或地点列表选择景点时，每次将景点居中到未被展开的地点面板遮挡的最大可见区域，并至少聚焦到基础全景放大半级的视角（自动聚焦最高17级）；当前视角更近时保持原缩放，连续选择不会逐次放大。面板折叠时不计其遮挡。引擎双击缩放已关闭，缩放按钮、滚轮与双指缩放继续可用。手绘与高德底图共用真实坐标，切换底图仍保留所有景点贴图和名称。

道路显示：`lib/qixia-roads.json` 保存 2026-10-29 查询高德 Walking 得到的 101 组道路轨迹，查询目标为 45 处园内景点的邻接道路及外围环山通道，不包括景区外的栖霞古镇。去重后保留 1003 条原始道路边，串接为 212 段连续折线，补齐西侧有灵云意、虎山、北侧山顶周边及南侧蝴蝶谷等区域。道路以 5px 白色实线和细描边叠加在地形上方，不增加全图路网，不修改景区外街道的样式。步行导航采用 7px 蓝色实线、白色描边和方向箭头，显示在园内道路之上、景点标记之下；导航路径仍来自高德实时步行规划结果。这些数据不是官方完整路网或景区边界，不代表全部游步道和实时开放状态；定照庵石刻附近的高德道路止于距目录点位约 266 米处，未用直线补接。道路是否开放请以现场指引为准。

`qixia-terrain-wash.svg` 和 `qixia-terrain-wash.png` 是依据 `public/terrain/qixia.json` 高程网格生成的历史水彩纹理素材，当前赏秋模式不加载该矩形图层。高德道路、地理坐标和地图署名保留；景点插画不表达建筑轮廓、植物实况或红叶指数。未添加参考图中的 A/B/C 游览路线。

`qixia-watercolor-atlas.png` 使用内置 imagegen 生成，透明背景，2×2 等分图集，依次为寺庙、石塔、亭子、红枫。项目通过 CSS background-position 使用各格，不含参考图上的文字及线路。

生成提示词：

> Create a production-ready square sprite atlas of FOUR separate Chinese autumn tourist-map watercolor illustrations on a truly transparent background, a precise 2 by 2 grid of equally sized cells. Each icon entirely fits inside its own cell with generous empty margin, no overlap between cells. Top left cell: a small traditional Chinese Buddhist temple with red ochre walls, dark gray tiled sweeping roofs, two golden-orange maple trees. Top right cell: an elegant ancient pale stone octagonal five-storey pagoda, gray-beige stone with fine ink lines, a red maple tree. Bottom left cell: a delicate Chinese wooden lakeside pavilion with a gray sweeping tiled roof, tiny pale blue water accent and golden-red maple tree. Bottom right cell: a lush cluster of three Chinese sweetgum/maple trees in vermilion, burnt orange, warm yellow, tiny grass, no buildings. Style: refined hand-painted Chinese scenic tourist-map watercolor illustration, soft ochre pigment textures and thin brown ink details, slightly isometric aerial 3/4 view, warm nostalgic autumn palette, evocative of a Qixia Mountain illustrated guide map. Architectural forms coherent and elegant. Not flat vector or clipart. Transparent negative space; no paper rectangle, no sky or backdrop, no white matte, no drop shadow extending outside cell. NO text, NO letters, NO numbers, NO captions, NO lines connecting icons, NO paths, NO borders. The atlas will be used in CSS as four equal background-position cells; keep all four icons in consistent scale and centered within their exact quadrants.

## 地图装饰

地图北侧纸底空白区放置“栖霞山”C款青山古韵标题（内置 imagegen 生成的透明 PNG：`qixia-title-c.png`，保留A、B款供比较）。位置与范围保存在 `lib/qixia-title-decoration.json`，按用户红框对齐；复用山体装饰的地理标记与缩放逻辑，保持图片比例、不拦截地图操作，切换高德底图时一起隐藏。

“赏秋手绘”模式在栖霞山局部轮廓内铺米黄纸底（#f4f2af），景区外保留高德底图原色；切换“高德底图”会移除纸底。覆盖范围独立保存在 `lib/qixia-paper-boundary.json`，依据2026-10-30项目高德底图16级视角的绿色山体轮廓校准，补齐北、东、南侧边缘，并保留此前栖霞古镇和蝴蝶谷周边的扩展。外圈避让栖霞大道等外围公路，北侧内部白色空地一并铺纸，内孔仅保留外围道路走廊；道路旁独立绿化带不作为山体扩展覆盖。该范围为美术展示范围，不是官方实测景区边界，不用于定位、导航或进出景区判定，后续可按用户标注微调。纸底为无边线、支持内孔的 Polygon，zIndex 6，低于自绘白色道路（30/31）、步行导航及景点标记；事件冒泡允许地图拖动和缩放，卸载时清理。

保留景点插画与名称、园内道路和步行导航。树冠剪影、落叶动画和落叶开关已移除，不加载全图滤镜、矩形地形纹理或插画覆盖试验素材。纸底范围内的高德原始水面、建筑和细路会被纸底遮住，自绘道路与景点不受影响。地图自由拖动和缩放功能保留。

根据用户2026-10-30两次截图中的11个红圈接入山体装饰，选用 `line-art-v1/` 中自生成的3款山体与3款山脊，结合镜像、轻微旋转和不同尺寸形成变化。地理位置、范围和朝向保存在 `lib/qixia-mountain-decorations.json`，由截图中的古镇、蝴蝶谷节点对齐，仅表示用户指定的装饰位置，不代表实测山峰。11个无交互装饰标记随地图缩放调整尺寸，低于景点标记，切换高德底图时与纸底一起隐藏；“仅节点”开关继续只隐藏景点贴图和名称。树丛等其他素材尚未接入。

按用户蓝圈截图添加20处湖泊装饰，位置、大小、形状类型和波纹密度保存在 `lib/qixia-lake-decorations.json`。参考官方导览图的纯蓝平行波纹风格，使用8种平滑不规则轮廓裁出不同长度的波浪线；不绘制岸线或水面填色。波纹采用高德 Polyline（zIndex 10），低于白色道路（30/31）和景点标记（120），允许景点插画覆盖在湖泊上。支持拖动、缩放、底图切换与卸载清理。湖泊为按截图配置的美术装饰，不作为实际水体范围或地理查询数据，不新增湖泊名称。
