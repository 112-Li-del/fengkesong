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

此前按用户蓝圈添加的20处湖泊波纹装饰已移除。高德底图原有水面及湖泊景点节点保留。

按最新红圈在东南侧纸底空白区单独放置一处湖泊波纹 PNG（`qixia-lake-ripple.png`），使用内置 imagegen 从用户提供的导览图湖泊参考中提取为透明底。位置与范围保存在 `lib/qixia-lake-decoration.json`，仅为美术装饰；复用地理标记缩放与底图切换逻辑，保持比例，层级10，低于道路和景点，不拦截地图操作。

第二处红圈使用不对称湖泊波纹 `qixia-lake-ripple-02.png`，通过内置 imagegen 根据用户提供的另一幅湖泊截图提取，清除背景和光晕后使用。位置范围保存在 `lib/qixia-roadside-lake-decoration.json`，位于东南侧环路以东，与道路留有间距，沿用层级10与装饰显示规则。

第三处红圈位于中东部环路内，使用从用户湖泊截图经内置 imagegen 提取的横向波纹 `qixia-lake-ripple-03.png`，透明底、无水面填色。位置范围保存在 `lib/qixia-central-lake-decoration.json`，保持比例，并与两侧道路留出空隙；沿用其他湖泊的层级、缩放与显示规则。

南部陆羽茶庄下方的用户红框内放置三个湖泊组成的透明底素材 `qixia-lake-group.png`，使用内置 imagegen 从用户截图提取，保留上小、中左、下右的错落布局。位置范围保存在 `lib/qixia-lake-group-decoration.json`；整组随地图缩放、移动及底图切换，层级10，景点插画显示在其上方。

西侧栖霞街内侧的用户红圈使用竖向湖泊波纹 `qixia-lake-ripple-04.png`，由内置 imagegen 根据用户截图提取为透明底，去除参考中的道路及文字。位置范围保存在 `lib/qixia-west-lake-decoration.json`，保持竖向比例，与周边道路留有间距，显示规则与其他湖泊一致。

西侧新增红框内使用上宽下窄的湖泊波纹 `qixia-lake-ripple-05.png`，通过内置 imagegen 从用户提供的湖泊截图提取为透明底，去除背景及灰色道路线。位置范围保存在 `lib/qixia-west-inner-lake-decoration.json`，位于前一处西侧湖泊东南侧，按用户红框调整尺寸，沿用其他湖泊的显示规则。

西北侧山脊下方的用户红圈使用横向不对称湖泊 `qixia-lake-ripple-06.png`，由内置 imagegen 从用户截图提取蓝色波纹并去除背景及上方道路线。位置范围保存在 `lib/qixia-northwest-lake-decoration.json`，按红圈缩放，避开下方道路，沿用其他湖泊的显示规则。

北部园内道路西侧新增红圈使用斜向轮廓湖泊 `qixia-lake-ripple-07.png`，由内置 imagegen 从用户截图提取为透明底，去除文字及绿色标线。位置范围保存在 `lib/qixia-north-inner-lake-decoration.json`，按红圈大小放置，与右侧道路留有间距，沿用其他湖泊的缩放及显示规则。

其南侧新增红圈使用 `qixia-lake-ripple-08.png`，由内置 imagegen 从用户参考中去除文字、背景和道路线，并补全被文字遮住的波纹，作为透明底美术素材。位置范围保存在 `lib/qixia-midwest-lake-decoration.json`，与右侧及下方道路留出间距，景点标记可覆盖其上方。

中东部山脊上方红框使用横向三湖组 `qixia-lake-group-02.png`，通过内置 imagegen 从用户截图提取为透明底，保留左侧细长湖、右上宽湖、下方小湖及细波纹连接，去除文字。范围保存在 `lib/qixia-east-lake-group-decoration.json`，与左侧道路留有间距，整组随地图缩放及底图切换。

北侧园路内的用户红框使用紧凑三湖组 `qixia-lake-group-03.png`，由内置 imagegen 根据用户截图提取为透明底，去除文字、背景及灰色道路线。范围保存在 `lib/qixia-north-lake-group-decoration.json`，保持上左、中右、下左的错落布局，沿用其他湖泊的层级及缩放显示规则。

最北侧环路拐弯内的用户红框使用细长弧形湖泊 `qixia-lake-ripple-09.png`，由内置 imagegen 从用户截图提取为透明底并去除边缘道路线。范围保存在 `lib/qixia-summit-lake-decoration.json`，缩小放入道路包围的空白处，与上方和两侧道路留出间距；沿用其他湖泊的显示规则。

东北侧环路内的用户红框使用上宽下窄的湖泊 `qixia-lake-ripple-10.png`，由内置 imagegen 从用户截图提取透明波纹，去除背景、文字、花朵及灰色道路线。范围保存在 `lib/qixia-northeast-lake-decoration.json`，按红框大小放置，与左侧及下方道路留有空隙，沿用其他湖泊的层级及缩放显示规则。

北侧弯道内第二个红框使用斜向叶形湖泊 `qixia-lake-ripple-11.png`，通过内置 imagegen 参考用户截图重建为透明底细波纹，避免提取过程产生的蓝色光晕，不包含地形、背景和灰色道路线。范围保存在 `lib/qixia-summit-bend-lake-decoration.json`，缩小放在弯道内侧，与右侧及下方道路保持间距，沿用其他湖泊的显示规则。

北侧弯道东侧的用户红框使用圆润湖泊 `qixia-lake-ripple-12.png`，通过内置 imagegen 从用户截图提取为透明底并去除背景、文字和灰色道路线。范围保存在 `lib/qixia-upper-east-lake-decoration.json`，按红框大小放置，避开左侧弯道，沿用其他湖泊的显示规则。

东北侧山体上方的用户红框使用宽浅湖泊 `qixia-lake-ripple-13.png`，由内置 imagegen 从用户截图提取透明蓝色波纹，去除山体、岸线及背景。范围保存在 `lib/qixia-phoenix-lake-decoration.json`，按红框缩放并避开右侧道路，沿用其他湖泊的显示规则。

南侧环路东侧新增红圈使用小型竖向湖泊 `qixia-lake-ripple-14.png`，由内置 imagegen 从用户截图提取为透明底，去除顶部设施图标及背景。范围保存在 `lib/qixia-south-small-lake-decoration.json`，按圈大小放置，避开左侧道路，景点标记保留在素材上方。

栖霞古镇东侧、消防器材室（QXF040）下方的用户红圈使用 `qixia-lake-ripple-15.png`，从用户提供的 51×35 像素湖泊参考图分离出青蓝波纹并移除鹅黄底色及截图边角杂点。范围保存在 `lib/qixia-ancient-town-lake-decoration.json`，以古镇和消防设施标记配准，保持原素材长宽比并按红圈大小放置。该湖泊为装饰贴图，不新增地理 POI；随手绘图层显隐，随地图缩放保持地理位置。

栖霞古镇东北侧、九龙坡点位上方的用户红框使用三湖组合 `qixia-lake-ripple-16.png`。从用户提供的 117×161 像素参考图按颜色分离蓝色波纹，移除鹅黄背景和灰绿色山体，保留三处湖泊的相对位置、形状及比例。范围保存在 `lib/qixia-ancient-town-lake-group-decoration.json`，依据古镇、消防器材室（QXF040）和九龙坡点位配准，组合按原红框范围放置，重叠处由景点插画显示在湖泊上层；作为装饰贴图随手绘图层显隐和地图缩放，不新增地理 POI。

彩虹明镜上方的用户红圈使用明镜湖波纹 `qixia-lake-ripple-17.png`。依据用户提供的 125×102 像素素材提取可见蓝色线条，沿相邻波纹补齐被中英文文字及绿线遮住的部分，移除底色和道路线，输出透明位图。范围保存在 `lib/qixia-mingjing-lake-decoration.json`，通过彩虹明镜、虎爪岩和哼哈殿配准，按红圈范围放置；沿用湖泊装饰层级，景点插画及名称位于湖泊上层，随手绘图层显隐和地图缩放。

栖霞古寺北侧、受降井东南侧道路内的用户红圈使用 `qixia-lake-ripple-18.png`，根据用户提供的 52×62 像素白莲池（月牙池）参考图提取蓝色波纹，并沿可见线条补齐文字遮挡处，去除背景、文字、道路线和左下建筑。范围保存在 `lib/qixia-bailian-lake-decoration.json`，以北侧游览车站（QXF053）、卫生间（QXF047）和附近景点配准，按红圈大小放置；作为装饰贴图保持景点插画及名称在上层，不改动景点坐标，随手绘图层显隐与地图缩放。

品外泉北侧的用户红圈使用圆形湖泊 `qixia-lake-ripple-19.png`，从用户提供的 57×60 像素素材分离青蓝波纹并去除底色、上下文字，保留原图湖形和波纹。范围保存在 `lib/qixia-pinwai-lake-decoration.json`，以游览车站（QXF053）、停车场（QXF008）、卫生间（QXF017、QXF054）和品外泉配准，按红圈大小放在道路内；沿用湖泊装饰层级，景点插画与名称位于湖泊上层，随手绘图层显隐和地图缩放，不改变景点坐标。

白鹿泉南侧道路外的用户红框使用横向湖泊 `qixia-lake-ripple-20.png`，从用户提供的 76×46 像素素材分离青蓝波纹，去除鹅黄背景、上方道路线和下方文字，保留原图可见湖形与横向波纹。范围保存在 `lib/qixia-bailu-south-lake-decoration.json`，以白鹿泉、品外泉、畅观亭和卫生间（QXF017）配准，按红框范围放置；沿用湖泊装饰层级与缩放规则，景点贴图和名称位于湖泊上层。

青峰涧东南侧、两段道路之间的用户红圈使用湖泊 `qixia-lake-ripple-21.png`，从用户提供的 105×56 像素素材分离青蓝波纹，去除鹅黄背景、右上灰色道路线和左下文字残片，保留原湖形及可见波纹。范围保存在 `lib/qixia-qingfeng-lake-decoration.json`，以青峰涧、中峰涧、试茶亭和凌虚室遗址配准，按红圈范围放置；沿用湖泊装饰层级、地图缩放和手绘图层显隐规则，景点贴图及名称保持在上层。

全部湖泊贴图根据 `lib/qixia-roads.json` 的实际道路轨迹应用透明遮罩，道路描边外各留 1 像素空隙；遮罩随缩放及窗口尺寸重新计算，避免全景或更小比例下波纹盖住固定像素宽度的道路。湖泊原始素材、地理范围、整体大小及景点贴图层级保持不变。
