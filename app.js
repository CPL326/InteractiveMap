// ==============================
// DOM 元素取得區
// 這一區負責抓取 HTML 畫面上的元素，後續 JS 會透過這些變數操作畫面。
// ==============================

// 地圖內容容器，marker 會被加到這裡面，也會對它做縮放 / 位移
const mapContainer =
    document.querySelector(".map-container");

// 上方篩選區中的所有 checkbox，例如 boss / chest / npc / hide collected 等
const filterCheckboxes =
    document.querySelectorAll(".filter-panel input");

// 滑鼠移到 marker 上時顯示的小提示框
const tooltip =
    document.getElementById("tooltip");

// 右側 sidebar 的內容區，用來顯示目前選取 marker 的詳細資料
const sidebarContent =
    document.getElementById("sidebar-content");

// 搜尋輸入框，用來依名稱或類型搜尋 marker
const searchInput =
    document.getElementById("search-input");

// 顯示已收集數量，例如 Collected: 3 / 10
const progressText =
    document.getElementById("progress-text");

// 匯出收集狀態的按鈕
const exportBtn =
    document.getElementById("export-btn");

// 觸發匯入收集狀態的按鈕
const importBtn =
    document.getElementById("import-btn");

// 實際用來選擇匯入檔案的 input，通常會 hidden 起來
const importInput =
    document.getElementById("import-input");

// 地圖可視範圍容器，負責限制地圖顯示區域，也用來處理地圖拖曳 / zoom
const mapViewport =
    document.querySelector(".map-viewport");

// 地區篩選下拉選單
const regionFilter =
    document.getElementById("region-filter");

// 稀有度篩選下拉選單
const rarityFilter =
    document.getElementById("rarity-filter");

// 清除所有收集進度的按鈕
const resetBtn =
    document.getElementById("reset-btn");

// 是否隱藏已收集 marker 的 checkbox
const hideCollectedCheckbox =
    document.getElementById("hide-collected-checkbox");

// 重置所有篩選條件的按鈕
const resetFiltersBtn =
    document.getElementById("reset-filters-btn");

// 顯示目前篩選後可見 marker 數量，例如 Showing: 5 / 20
const visibleCountText =
    document.getElementById("visible-count-text");

// 切換編輯模式的按鈕
const editModeBtn =
    document.getElementById("edit-mode-btn");

// 刪除目前選取 marker 的按鈕
const deleteMarkerBtn =
    document.getElementById("delete-marker-btn");

// 編輯目前選取 marker 資料的按鈕
const editMarkerBtn =
    document.getElementById("edit-marker-btn");

// 匯出整個地圖專案的按鈕，包含自訂 marker 與收集狀態
const exportProjectBtn =
    document.getElementById("export-project-btn");

// 觸發匯入整個地圖專案的按鈕
const importProjectBtn =
    document.getElementById("import-project-btn");

// 實際用來選擇匯入專案檔案的 input，通常會 hidden 起來
const importProjectInput =
    document.getElementById("import-project-input");

// 上傳新地圖圖片的按鈕
const uploadMapBtn =
    document.getElementById("upload-map-btn");

// 實際用來選擇地圖圖片的 input，通常會 hidden 起來
const mapUploadInput =
    document.getElementById("map-upload-input");

// 目前顯示的地圖圖片元素
const gameMapImage =
    document.querySelector(".game-map");

// 地圖切換下拉選單，用來切換不同地圖專案
const mapSelect =
    document.getElementById("map-select");

// 重新命名目前地圖的按鈕
const renameMapBtn =
    document.getElementById("rename-map-btn");

// 刪除目前地圖的按鈕
const deleteMapBtn =
    document.getElementById("delete-map-btn");

// 新增 marker 時輸入名稱的欄位
const newMarkerNameInput =
    document.getElementById("new-marker-name");

// 新增 marker 時選擇 marker type 的下拉選單
const newMarkerTypeSelect =
    document.getElementById("new-marker-type");

// 建立新 marker 的按鈕
const createMarkerBtn =
    document.getElementById("create-marker-btn");

// 顯示目前滑鼠在地圖上的座標，例如 X: 500, Y: 300
const coordinateText =
    document.getElementById("coordinate-text");


// ==============================
// 資料狀態區
// 這一區負責保存目前程式執行中的資料狀態。
// 有些資料會和 localStorage 同步。
// ==============================

// 所有地圖清單，例如 Hollow Knight / Terraria / 自訂地圖
let maps = [];

// 所有 marker 類型，例如 boss / chest / npc
let markerTypes = [];

// 使用者自己新增的 marker 清單
let customItems = [];

// 目前使用中的地圖 ID，用來區分不同地圖的 marker 與收集狀態
let currentMapId = "default";

// 暫存使用者在 Edit Mode 下點擊地圖的位置，之後 Create Marker 時會使用
let pendingMarkerPosition = null;


// ==============================
// UI 狀態區
// 這一區負責記錄畫面目前處於什麼狀態。
// ==============================

// 是否正在編輯模式；true 時點地圖代表新增 marker / 可拖曳 marker
let isEditMode = false;

// 目前被選取的 marker DOM 元素
let selectedMarker = null;

// 目前被選取的 marker id，用於編輯 / 刪除該 marker
let selectedItem = null;


// ==============================
// 地圖縮放與拖曳狀態區
// 這一區負責記錄整張地圖的 zoom / pan 狀態。
// ==============================

// 地圖目前縮放比例，1 代表原始大小
let scale = 1;

// 地圖目前在 X 軸方向的位移量
let translateX = 0;

// 地圖目前在 Y 軸方向的位移量
let translateY = 0;

// 是否正在拖曳整張地圖
let isDragging = false;

// 開始拖曳地圖時，滑鼠和地圖位移的 X 軸差值
let startX = 0;

// 開始拖曳地圖時，滑鼠和地圖位移的 Y 軸差值
let startY = 0;

// 判斷剛剛是否真的拖曳過地圖，用來避免拖曳後誤觸 click
let hasDragged = false;


// ==============================
// Marker 拖曳狀態區
// 這一區負責記錄目前是否正在拖曳某一個 marker。
// ==============================

// 目前正在被拖曳的 marker DOM 元素
let draggingMarker = null;

// 是否正在拖曳 marker
let isDraggingMarker = false;

// 判斷 marker 是否真的被拖曳過，用來避免拖曳後誤觸 marker click
let hasDraggedMarker = false;

//函式宣告區域
// ==============================
// Item / Marker 載入與建立
// ==============================

/**
 * 載入地圖上的 marker 資料。
 *
 * 流程：
 * 1. 從 data/items.json 讀取預設 marker
 * 2. 從 localStorage 讀取使用者自訂 marker
 * 3. 合併兩種 marker
 * 4. 逐一建立 marker DOM
 * 5. 更新統計與篩選結果
 */
async function loadItems() {

    // 讀取預設 marker 資料，目前如果 items.json 是 []，就代表沒有內建 marker
    const response =
        await fetch("data/items.json");

    const items =
        await response.json();

    // 讀取目前地圖對應的自訂 marker
    loadCustomItems();

    // 將預設 marker + 自訂 marker 合併成完整清單
    const allItems =
        items.concat(customItems);

    // 依照每筆資料建立畫面上的 marker
    allItems.forEach(item => {

        createMarker(item);

    });

    // 更新已收集數量
    updateProgress();

    // 套用目前的搜尋 / 篩選條件
    updateFilters();

    // 更新目前顯示數量
    updateVisibleCount();

}


/**
 * 根據一筆 item 資料建立 marker DOM 元素。
 *
 * item 代表地圖上的一個點，例如 Boss / Chest / NPC / 自訂標記。
 */
function createMarker(item) {

    // 建立一個 div，作為 marker 本體
    const marker =
        document.createElement("div");

    // 加上通用 marker class
    marker.classList.add("marker");

    // 加上 type class，例如 boss / chest / npc
    // 目前有些 CSS 或 filter 可能仍會用到
    marker.classList.add(item.type);

    // 根據 marker type 設定 icon
    setMarkerIcon(marker, item.type);

    // 將 item 的資料綁到 DOM dataset 上，方便 filter / select / delete 使用
    marker.dataset.id = item.id;
    marker.dataset.type = item.type;
    marker.dataset.name = item.name.toLowerCase();
    marker.dataset.region = item.region;
    marker.dataset.rarity = item.rarity;

    // 設定 marker 在地圖上的座標位置
    marker.style.left = item.x + "px";
    marker.style.top = item.y + "px";

    // 讀取目前地圖的 collectedState
    const collectedState =
        getCollectedState();

    // 取得這個 marker 是否已經被收集
    const savedState =
        collectedState[item.id];

    // 如果 localStorage 中紀錄為 true，就套上 collected 樣式
    if (savedState === true) {

        marker.classList.add("collected");

    }

    // 滑鼠移到 marker 上時顯示 tooltip
    marker.addEventListener("mouseenter", () => {

        tooltip.style.display = "block";

        tooltip.innerHTML = `
            <strong>${item.name}</strong>
            <br>
            Type: ${item.type}
        `;

        // tooltip 顯示在 marker 右上附近
        tooltip.style.left = (item.x + 40) + "px";
        tooltip.style.top = (item.y - 10) + "px";

    });

    // 滑鼠離開 marker 時隱藏 tooltip
    marker.addEventListener("mouseleave", () => {

        tooltip.style.display = "none";

    });

    // 點擊 marker 時切換收集狀態
    marker.addEventListener("click", () => {

        // 如果剛剛是在拖曳地圖，就不要觸發 click
        if (hasDragged) {
            return;
        }

        // 如果剛剛是在拖曳 marker，也不要觸發 click
        if (hasDraggedMarker) {
            return;
        }

        // 切換 collected class
        marker.classList.toggle("collected");

        // 判斷目前是否已收集
        const isCollected =
            marker.classList.contains("collected");

        // 將收集狀態存到目前地圖對應的 localStorage
        saveCollectedState(item.id, isCollected);

        // 更新右側資訊欄
        updateSidebar(item, isCollected);

        // 記錄目前選中的 marker
        selectMarker(marker);

        // 更新已收集數量
        updateProgress();

        // 如果 Hide Collected 有打開，點擊後需要重新套用篩選
        updateFilters();

    });

    // 在 Edit Mode 下，按住 marker 可以開始拖曳 marker
    marker.addEventListener("mousedown", (event) => {

        // 只有編輯模式才允許拖曳 marker
        if (!isEditMode) {
            return;
        }

        // 阻止事件往外層傳遞，避免同時觸發地圖拖曳
        event.stopPropagation();

        // 阻止瀏覽器預設拖曳 / 選取行為
        event.preventDefault();

        // 記錄目前正在拖曳的 marker
        draggingMarker = marker;

        // 進入 marker 拖曳狀態
        isDraggingMarker = true;

        // 拖曳剛開始時，先視為尚未真的移動
        hasDraggedMarker = false;

    });

    // 將 marker 加到地圖容器中
    mapContainer.appendChild(marker);

}


/**
 * 根據 marker type id 設定 marker 的 icon。
 *
 * 舊寫法是 if type === "boss"。
 * 現在改成從 markerTypes 陣列中查資料，讓 icon 由資料控制。
 */
function setMarkerIcon(marker, typeId) {

    // 從 markerTypes 找出對應的 type 設定
    const markerType =
        markerTypes.find(type =>
            type.id === typeId
        );

    // 如果有找到 icon，就設定為 marker 背景圖片
    if (markerType && markerType.icon) {

        marker.style.backgroundImage =
            `url('${markerType.icon}')`;

    }
    else {

        // 找不到 icon 時清空背景圖，避免沿用舊圖片
        marker.style.backgroundImage = "";

    }

}

// ==============================
// Filter / Search 篩選邏輯
// ==============================

/**
 * 根據目前 UI 上的篩選條件，決定哪些 marker 要顯示。
 *
 * 篩選條件包含：
 * 1. marker type checkbox
 * 2. 搜尋文字
 * 3. region
 * 4. rarity
 * 5. hide collected
 */
function updateFilters() {

    // 取得目前勾選的 marker type
    const enabledTypes = [];

    filterCheckboxes.forEach(checkbox => {

        if (checkbox.checked) {

            enabledTypes.push(checkbox.value);

        }

    });

    // 取得搜尋文字，轉小寫並去除前後空白
    const searchKeyword =
        searchInput.value
            .toLowerCase()
            .trim();

    // 取得目前畫面上的所有 marker
    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        // 從 dataset 取得 marker 資料
        const markerType =
            marker.dataset.type;

        const markerName =
            marker.dataset.name;

        const markerRegion =
            marker.dataset.region;

        const markerRarity =
            marker.dataset.rarity;

        const isCollected =
            marker.classList.contains("collected");

        // 取得目前 UI 選擇的 region / rarity
        const selectedRegion =
            regionFilter.value;

        const selectedRarity =
            rarityFilter.value;

        // Type 是否符合
        const typeMatched =
            enabledTypes.includes(markerType);

        // 搜尋條件是否符合：目前支援 name 或 type
        const searchMatched =
            markerName.includes(searchKeyword) ||
            markerType.includes(searchKeyword);

        // Region 是否符合；all 代表不限制
        const regionMatched =
            selectedRegion === "all" ||
            markerRegion === selectedRegion;

        // Rarity 是否符合；all 代表不限制
        const rarityMatched =
            selectedRarity === "all" ||
            markerRarity === selectedRarity;

        // Hide Collected 是否符合
        // 沒勾 hide collected：全部都符合
        // 有勾 hide collected：只有未收集才符合
        const collectedMatched =
            !hideCollectedCheckbox.checked ||
            !isCollected;

        // 所有條件都符合才顯示
        if (
            typeMatched &&
            searchMatched &&
            regionMatched &&
            rarityMatched &&
            collectedMatched
        ) {

            marker.style.display = "block";

        }
        else {

            marker.style.display = "none";

        }

    });

    // 更新目前顯示數量
    updateVisibleCount();

}


// ==============================
// Marker 選取與 Sidebar 顯示
// ==============================

/**
 * 將某個 marker 設為目前選取狀態。
 *
 * 主要用途：
 * 1. 讓 marker 顯示 selected 樣式
 * 2. 記住目前選到哪個 marker，方便 edit / delete 使用
 */
function selectMarker(marker) {

    // 如果之前有選過 marker，先移除 selected 樣式
    if (selectedMarker) {

        selectedMarker.classList.remove("selected");

    }

    // 更新目前選取的 marker DOM
    selectedMarker = marker;

    // 記錄目前選取的 marker id
    selectedItem = marker.dataset.id;

    // 加上 selected class，讓畫面上有高亮效果
    marker.classList.add("selected");

}


/**
 * 更新右側 Sidebar 的 marker 詳細資訊。
 *
 * 顯示內容包含：
 * - 圖片
 * - 名稱
 * - 類型
 * - 收集狀態
 * - 描述
 * - 地區
 * - 稀有度
 * - 座標
 * - Wiki 連結
 */
function updateSidebar(item, isCollected) {

    const imageHtml =
        item.image
            ? `
                <img
                    src="${item.image}"
                    class="sidebar-image"
                />
            `
            : "";

    const wikiHtml =
        item.wiki
            ? `
                <p>
                    <a
                        href="${item.wiki}"
                        target="_blank"
                        class="wiki-link"
                    >
                        Open Wiki
                    </a>
                </p>
            `
            : "";

    sidebarContent.innerHTML = `

        ${imageHtml}

        <h3>${item.name}</h3>

        <p>
            <strong>Type:</strong>
            ${item.type}
        </p>

        <p>
            <strong>Status:</strong>
            ${isCollected ? "Collected" : "Not Collected"}
        </p>

        <p>
            ${item.description || ""}
        </p>

        <p>
            <strong>Region:</strong>
            ${item.region}
        </p>

        <p>
            <strong>Rarity:</strong>
            ${item.rarity}
        </p>

        <p>
            <strong>Position:</strong>
            X: ${item.x}, Y: ${item.y}
        </p>

        ${wikiHtml}
    `;

}
// ==============================
// Marker Edit Form / Sidebar 編輯表單
// ==============================

/**
 * 在 sidebar 顯示 marker 編輯表單。
 *
 * 目前只會用在 custom marker。
 * 使用者可以修改：
 * 1. name
 * 2. type
 * 3. description
 * 4. region
 * 5. rarity
 */
function renderEditMarkerForm(item) {

    const typeOptions =
        markerTypes.map(type => {

            const selected =
                type.id === item.type ? "selected" : "";

            return `
                <option value="${type.id}" ${selected}>
                    ${type.name}
                </option>
            `;

        }).join("");

    sidebarContent.innerHTML = `

        <h3>Edit Marker</h3>

        <label>
            Name
        </label>
        <input
            id="edit-marker-name"
            type="text"
            value="${item.name}"
        />

        <label>
            Type
        </label>
        <select id="edit-marker-type">
            ${typeOptions}
        </select>

        <label>
            Description
        </label>
        <textarea id="edit-marker-description">${item.description || ""}</textarea>

        <label>
            Region
        </label>
        <input
            id="edit-marker-region"
            type="text"
            value="${item.region || "Custom"}"
        />

        <label>
            Rarity
        </label>
        <input
            id="edit-marker-rarity"
            type="text"
            value="${item.rarity || "Common"}"
        />

        <div class="sidebar-button-row">
            <button id="save-marker-edit-btn">
                Save
            </button>

            <button id="cancel-marker-edit-btn">
                Cancel
            </button>
        </div>
    `;

    const saveBtn =
        document.getElementById("save-marker-edit-btn");

    const cancelBtn =
        document.getElementById("cancel-marker-edit-btn");

    saveBtn.addEventListener("click", () => {

        saveMarkerEdit(item);

    });

    cancelBtn.addEventListener("click", () => {

        const marker =
            document.querySelector(
                `.marker[data-id="${item.id}"]`
            );

        const isCollected =
            marker && marker.classList.contains("collected");

        updateSidebar(item, isCollected);

    });

}

/**
 * 保存 sidebar 編輯表單的內容。
 *
 * 會更新：
 * 1. customItems 裡的資料
 * 2. localStorage
 * 3. marker DOM dataset / class / icon
 * 4. sidebar 顯示
 * 5. filter 結果
 */
function saveMarkerEdit(item) {

    const nameInput =
        document.getElementById("edit-marker-name");

    const typeSelect =
        document.getElementById("edit-marker-type");

    const descriptionInput =
        document.getElementById("edit-marker-description");

    const regionInput =
        document.getElementById("edit-marker-region");

    const rarityInput =
        document.getElementById("edit-marker-rarity");

    const newName =
        nameInput.value.trim();

    if (!newName) {

        alert("Marker name is required.");

        return;

    }

    item.name =
        newName;

    item.type =
        typeSelect.value;

    item.description =
        descriptionInput.value.trim();

    item.region =
        regionInput.value.trim() || "Custom";

    item.rarity =
        rarityInput.value.trim() || "Common";

    saveCustomItems();

    const marker =
        document.querySelector(
            `.marker[data-id="${item.id}"]`
        );

    if (marker) {

        const wasCollected =
            marker.classList.contains("collected");

        const wasSelected =
            marker.classList.contains("selected");

        marker.dataset.type =
            item.type;

        marker.dataset.name =
            item.name.toLowerCase();

        marker.dataset.region =
            item.region;

        marker.dataset.rarity =
            item.rarity;

        marker.className =
            "marker";

        marker.classList.add(item.type);

        if (wasCollected) {
            marker.classList.add("collected");
        }

        if (wasSelected) {
            marker.classList.add("selected");
        }

        setMarkerIcon(marker, item.type);

        updateSidebar(item, wasCollected);

    }

    updateFilters();

    updateProgress();

    updateVisibleCount();

}

// ==============================
// Progress / 統計進度
// ==============================

/**
 * 更新收集進度文字。
 *
 * 會統計：
 * 1. 畫面上總共有幾個 marker
 * 2. 其中有幾個 marker 已經加上 collected class
 *
 * 顯示範例：
 * Collected: 3 / 10
 */
function updateProgress() {

    // 取得畫面上所有 marker
    const allMarkers =
        document.querySelectorAll(".marker");

    // 取得所有已收集的 marker
    const collectedMarkers =
        document.querySelectorAll(".marker.collected");

    // 更新進度文字
    progressText.textContent =
        `Collected: ${collectedMarkers.length} / ${allMarkers.length}`;

}


// ==============================
// Save / Export 存檔匯出
// ==============================

/**
 * 匯出目前地圖的收集狀態。
 *
 * 匯出的內容只包含：
 * {
 *     "markerId1": true,
 *     "markerId2": false
 * }
 *
 * 也就是只記錄每個 marker 是否已收集。
 */
function exportSave() {

    // 建立一個空物件，用來保存 marker 收集狀態
    const saveData = {};

    // 取得畫面上所有 marker
    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        // 取得 marker id
        const markerId =
            marker.dataset.id;

        // 判斷 marker 是否已收集
        const isCollected =
            marker.classList.contains("collected");

        // 將結果存進 saveData
        // key 是 marker id，value 是 true / false
        saveData[markerId] = isCollected;

    });

    // 將 JS object 轉成 JSON 字串
    // null, 2 是為了讓輸出的 JSON 有縮排，比較好閱讀
    const jsonString =
        JSON.stringify(saveData, null, 2);

    // 建立一個 Blob，讓 JSON 字串變成可以下載的檔案內容
    const blob =
        new Blob([jsonString], {
            type: "application/json"
        });

    // 建立暫時下載網址
    const url =
        URL.createObjectURL(blob);

    // 建立一個暫時的 a 標籤，用來觸發下載
    const a =
        document.createElement("a");

    // 設定下載連結
    a.href = url;

    // 設定下載檔名
    a.download = "map-save.json";

    // 模擬點擊，觸發瀏覽器下載檔案
    a.click();

    // 釋放暫時網址，避免記憶體浪費
    URL.revokeObjectURL(url);

}

// ==============================
// Save / Import 存檔匯入
// ==============================

/**
 * 匯入收集狀態檔案。
 *
 * file 來自 input[type="file"] 選到的檔案。
 *
 * 流程：
 * 1. 用 FileReader 讀取檔案內容
 * 2. 將 JSON 字串轉成 JS object
 * 3. 依照 marker id 還原 collected 狀態
 * 4. 同步存回 localStorage
 * 5. 更新進度
 */
function importSave(file) {

    // 建立 FileReader，用來讀取使用者選擇的本機檔案
    const reader =
        new FileReader();

    // 當檔案讀取完成後會執行這段
    reader.onload = (event) => {

        // 將讀到的 JSON 字串轉成 JS object
        const saveData =
            JSON.parse(event.target.result);

        // 取得畫面上的所有 marker
        const allMarkers =
            document.querySelectorAll(".marker");

        allMarkers.forEach(marker => {

            // 取得 marker id
            const markerId =
                marker.dataset.id;

            // 從匯入資料中找出該 marker 是否已收集
            const isCollected =
                saveData[markerId];

            // 根據匯入狀態加上或移除 collected class
            if (isCollected) {

                marker.classList.add("collected");

            }
            else {

                marker.classList.remove("collected");

            }

            // 同步保存到目前地圖的 localStorage
            saveCollectedState(markerId, isCollected);

        });

        // 匯入完成後更新收集進度
        updateProgress();

        // 匯入後如果有開啟 Hide Collected，需要重新套用篩選
        updateFilters();

    };

    // 以文字方式讀取檔案
    reader.readAsText(file);

}

// ==============================
// Map Transform / 地圖縮放與位移
// ==============================

/**
 * 更新地圖的 transform 狀態。
 *
 * translateX / translateY 控制地圖平移。
 * scale 控制地圖縮放。
 *
 * 例如：
 * translate(100px, 50px) scale(1.5)
 *
 * 代表：
 * 1. 地圖往右移 100px
 * 2. 地圖往下移 50px
 * 3. 地圖放大 1.5 倍
 */
function updateMapTransform() {

    mapContainer.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;

}


// ==============================
// Save / Reset 重置收集狀態
// ==============================

/**
 * 重置目前地圖的所有收集進度。
 *
 * 會做：
 * 1. 跳出確認視窗
 * 2. 移除所有 marker 的 collected class
 * 3. 將每個 marker 的 collected 狀態存成 false
 * 4. 更新進度
 * 5. 清空 sidebar 顯示
 */
function resetSave() {

    // 防止使用者誤按，所以先跳出確認視窗
    const confirmed =
        confirm("Are you sure you want to reset all progress?");

    // 如果使用者按取消，就不繼續執行
    if (!confirmed) {
        return;
    }

    // 取得畫面上所有 marker
    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        // 移除 collected 樣式
        marker.classList.remove("collected");

        // 取得 marker id
        const markerId =
            marker.dataset.id;

        // 將 localStorage 裡的狀態更新為 false
        saveCollectedState(markerId, false);

    });

    // 更新收集進度
    updateProgress();

    // 重置後重新套用篩選，避免 Hide Collected 狀態下畫面沒有刷新
    updateFilters();

    // 清空右側資訊欄
    sidebarContent.innerHTML =
        "Click a marker...";

}

// ==============================
// Filter / Reset 重置篩選條件
// ==============================

/**
 * 重置所有篩選條件。
 *
 * 會恢復成：
 * 1. 搜尋文字清空
 * 2. 所有 type checkbox 勾選
 * 3. region 回到 all
 * 4. rarity 回到 all
 * 5. 不隱藏已收集 marker
 */
function resetFilters() {

    // 清空搜尋框
    searchInput.value = "";

    // 將所有 type checkbox 改成勾選
    filterCheckboxes.forEach(checkbox => {

        checkbox.checked = true;

    });

    // region 篩選回到全部
    regionFilter.value = "all";

    // rarity 篩選回到全部
    rarityFilter.value = "all";

    // 關閉隱藏已收集
    hideCollectedCheckbox.checked = false;

    // 重新套用篩選條件
    updateFilters();

}


// ==============================
// Visible Count / 目前顯示數量統計
// ==============================

/**
 * 更新目前畫面上可見 marker 的數量。
 *
 * 顯示範例：
 * Showing: 5 / 20
 *
 * visibleMarkers：
 * 代表通過目前篩選條件、沒有被 display:none 隱藏的 marker。
 */
function updateVisibleCount() {

    // 取得畫面上所有 marker
    const allMarkers =
        document.querySelectorAll(".marker");

    // NodeList 不能直接用 filter，所以先用 Array.from 轉成陣列
    const visibleMarkers =
        Array.from(allMarkers).filter(marker => {

            // display 不是 none，就代表目前是顯示狀態
            return marker.style.display !== "none";

        });

    // 更新顯示數量文字
    visibleCountText.textContent =
        `Showing: ${visibleMarkers.length} / ${allMarkers.length}`;

}


// ==============================
// Custom Items / 自訂 Marker 存取
// ==============================

/**
 * 從 localStorage 讀取目前地圖的自訂 marker 清單。
 *
 * key 會依照 currentMapId 區分：
 * customItems_default
 * customItems_map_123456
 *
 * 這樣不同地圖可以有不同的自訂 marker。
 */
function loadCustomItems() {

    // 讀取目前地圖對應的自訂 marker 資料
    const saved =
        localStorage.getItem(
            `customItems_${currentMapId}`
        );

    // 如果 localStorage 有資料，就轉成 JS array
    if (saved) {

        customItems =
            JSON.parse(saved);

    }
    else {

        // 沒資料就代表目前地圖還沒有自訂 marker
        customItems = [];

    }

}


/**
 * 將目前 customItems 保存到 localStorage。
 *
 * 通常在：
 * 1. 新增 marker
 * 2. 編輯 marker
 * 3. 刪除 marker
 * 4. 拖曳 marker 後更新座標
 *
 * 這些情況會呼叫。
 */
function saveCustomItems() {

    localStorage.setItem(
        `customItems_${currentMapId}`,
        JSON.stringify(customItems)
    );

}
// ==============================
// Collected State / 收集狀態存取
// ==============================

/**
 * 取得目前地圖的 collected 狀態。
 *
 * 回傳格式大概是：
 * {
 *     "boss_001": true,
 *     "chest_002": false
 * }
 *
 * key 是 marker id。
 * value 是是否已收集。
 */
function getCollectedState() {

    // 讀取目前地圖對應的收集狀態
    const saved =
        localStorage.getItem(
            `collectedState_${currentMapId}`
        );

    // 如果有資料，就轉成 JS object 後回傳
    if (saved) {

        return JSON.parse(saved);

    }

    // 沒有資料時，回傳空物件，避免後面讀取時出錯
    return {};

}


/**
 * 保存單一 marker 的收集狀態。
 *
 * markerId：
 * 要保存狀態的 marker id。
 *
 * isCollected：
 * true 代表已收集。
 * false 代表未收集。
 */
function saveCollectedState(markerId, isCollected) {

    // 先取得目前整份 collected 狀態
    const collectedState =
        getCollectedState();

    // 更新指定 marker 的收集狀態
    collectedState[markerId] =
        isCollected;

    // 再整份存回 localStorage
    localStorage.setItem(
        `collectedState_${currentMapId}`,
        JSON.stringify(collectedState)
    );

}

// ==============================
// Marker Delete / 刪除目前選取的 Marker
// ==============================

/**
 * 刪除目前選取的自訂 marker。
 *
 * 流程：
 * 1. 確認目前是否有選取 marker
 * 2. 跳出 confirm 避免誤刪
 * 3. 從 customItems 移除資料
 * 4. 從畫面移除 marker DOM
 * 5. 從 collectedState 移除收集狀態
 * 6. 清空 selected 狀態
 * 7. 更新畫面統計與篩選
 */
function deleteSelectedMarker() {

    // 沒有選取 marker 時不允許刪除
    if (!selectedItem) {

        alert("No marker selected");

        return;

    }

    // 二次確認，避免誤刪
    const confirmed =
        confirm("Delete this marker?");

    if (!confirmed) {
        return;
    }

    // 從自訂 marker 清單中移除目前選取的 marker
    customItems =
        customItems.filter(item =>
            item.id !== selectedItem
        );

    // 將刪除後的 customItems 存回 localStorage
    saveCustomItems();

    // 從畫面上找到對應的 marker DOM
    const markerToDelete =
        document.querySelector(
            `.marker[data-id="${selectedItem}"]`
        );

    // 如果畫面上有找到，就直接移除
    if (markerToDelete) {

        markerToDelete.remove();

    }

    // 取得目前地圖的收集狀態
    const collectedState =
        getCollectedState();

    // 刪除這個 marker 對應的 collected 狀態
    delete collectedState[selectedItem];

    // 將刪除後的 collectedState 存回 localStorage
    localStorage.setItem(
        `collectedState_${currentMapId}`,
        JSON.stringify(collectedState)
    );

    // 清空目前選取狀態
    selectedItem = null;
    selectedMarker = null;

    // 清空 sidebar
    sidebarContent.innerHTML =
        "Click a marker...";

    // 更新收集進度
    updateProgress();

    // 重新套用篩選條件
    updateFilters();

    // 更新目前顯示數量
    updateVisibleCount();

}

// ==============================
// Marker Edit / 編輯目前選取的 Marker
// ==============================

/**
 * 編輯目前選取的自訂 marker。
 *
 * 現在不再使用 prompt，
 * 而是將 sidebar 切換成正式編輯表單。
 */
function editSelectedMarker() {

    if (!selectedItem) {

        alert("No marker selected");

        return;

    }

    const item =
        customItems.find(item =>
            item.id === selectedItem
        );

    if (!item) {

        alert("Only custom markers can be edited");

        return;

    }

    renderEditMarkerForm(item);

}

// ==============================
// Project Export / 匯出整個專案
// ==============================

/**
 * 匯出目前地圖專案資料。
 *
 * 目前匯出的內容包含：
 * 1. customItems：使用者自訂 marker 清單
 * 2. collectedState：目前所有 marker 的收集狀態
 *
 * 注意：
 * 目前這個版本還沒有匯出 maps / markerTypes。
 * 所以比較像「目前地圖的 marker 專案」，
 * 還不是完整的多地圖專案備份。
 */
function exportProject() {

    // 建立一份 collectedState，用來記錄每個 marker 是否已收集
    const collectedState = {};

    // 取得畫面上的所有 marker
    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        // 取得 marker id
        const markerId =
            marker.dataset.id;

        // 記錄該 marker 是否有 collected class
        collectedState[markerId] =
            marker.classList.contains("collected");

    });

    // 組合要匯出的專案資料
    const projectData = {
        customItems: customItems,
        collectedState: collectedState
    };

    // 將 JS object 轉成 JSON 字串
    const jsonString =
        JSON.stringify(projectData, null, 2);

    // 建立可下載的 JSON 檔案內容
    const blob =
        new Blob([jsonString], {
            type: "application/json"
        });

    // 建立暫時下載網址
    const url =
        URL.createObjectURL(blob);

    // 建立暫時 a 標籤，用來觸發下載
    const a =
        document.createElement("a");

    a.href = url;

    // 設定下載檔名
    a.download = "map-project.json";

    // 觸發下載
    a.click();

    // 釋放暫時網址
    URL.revokeObjectURL(url);

}

// ==============================
// Marker 清除功能
// ==============================

/**
 * 只清除畫面上的自訂 marker。
 *
 * 這個函式會根據 customItems 裡的 id，
 * 找出畫面上對應的 marker DOM，然後移除。
 *
 * 通常用在 importProject 前，
 * 先把舊的 custom marker 清掉，再建立新的 custom marker。
 */
function clearCustomMarkersFromScreen() {

    customItems.forEach(item => {

        const marker =
            document.querySelector(
                `.marker[data-id="${item.id}"]`
            );

        if (marker) {
            marker.remove();
        }

    });

}


/**
 * 清除畫面上的所有 marker。
 *
 * 會移除：
 * 1. 內建 marker
 * 2. 自訂 marker
 *
 * 通常用在切換地圖、上傳新地圖前。
 */
function clearAllMarkersFromScreen() {

    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        marker.remove();

    });

}

// ==============================
// Project Import / 匯入專案
// ==============================

/**
 * 匯入地圖專案資料。
 *
 * file：
 * 來自 input[type="file"] 選到的 JSON 檔案。
 *
 * 流程：
 * 1. 讀取 JSON 檔
 * 2. 清除畫面上的舊 custom marker
 * 3. 套用匯入的 customItems
 * 4. 重新建立 custom marker
 * 5. 套用 collectedState
 * 6. 更新畫面統計與篩選
 */
function importProject(file) {

    // 建立 FileReader 讀取使用者選擇的檔案
    const reader =
        new FileReader();

    reader.onload = (event) => {

        // 將 JSON 字串轉成 JS object
        const projectData =
            JSON.parse(event.target.result);

        // 先清除目前畫面上的自訂 marker
        clearCustomMarkersFromScreen();

        // 使用匯入檔案中的 customItems
        // 如果沒有 customItems，就給空陣列
        customItems =
            projectData.customItems || [];

        // 保存匯入後的 customItems 到目前地圖的 localStorage
        saveCustomItems();

        // 重新建立自訂 marker
        customItems.forEach(item => {

            createMarker(item);

        });

        // 取得匯入檔案中的 collectedState
        const collectedState =
            projectData.collectedState || {};

        // 取得畫面上的所有 marker
        const allMarkers =
            document.querySelectorAll(".marker");

        allMarkers.forEach(marker => {

            const markerId =
                marker.dataset.id;

            const isCollected =
                collectedState[markerId];

            // 根據匯入的狀態套用 collected class
            if (isCollected) {
                marker.classList.add("collected");
            }
            else {
                marker.classList.remove("collected");
            }

            // 保存這個 marker 的收集狀態到目前地圖對應的 localStorage
            saveCollectedState(markerId, isCollected);

        });

        // 清空目前選取狀態
        selectedItem = null;
        selectedMarker = null;

        // 重置 sidebar
        sidebarContent.innerHTML =
            "Click a marker...";

        // 更新畫面
        updateProgress();
        updateFilters();
        updateVisibleCount();

    };

    // 以文字方式讀取 JSON 檔案
    reader.readAsText(file);

}


// ==============================
// Maps / 地圖資料讀取與保存
// ==============================

/**
 * 從 localStorage 讀取所有地圖資料。
 *
 * maps 的格式大概是：
 * [
 *     {
 *         id: "map_123456",
 *         name: "Map Name",
 *         image: "data:image/png;base64,..."
 *     }
 * ]
 */
function loadMaps() {

    const saved =
        localStorage.getItem("maps");

    maps =
        saved ? JSON.parse(saved) : [];

}


/**
 * 將目前 maps 陣列保存到 localStorage。
 */
function saveMaps() {

    localStorage.setItem(
        "maps",
        JSON.stringify(maps)
    );

}

// ==============================
// Map Image / 舊版單一地圖圖片載入
// ==============================

/**
 * 載入保存過的地圖圖片。
 *
 * 注意：
 * 這個函式比較像舊版單一地圖用的。
 *
 * 你現在已經有 maps 陣列和 currentMapId，
 * 所以主要流程應該改由：
 * 1. loadMaps()
 * 2. 取得 currentMapId
 * 3. 從 maps 找 currentMap
 * 4. gameMapImage.src = currentMap.image
 *
 * 如果你的 init() 已經處理多地圖，
 * 這個函式可能可以不用了。
 */
function loadSavedMapImage() {

    const savedMapImage =
        localStorage.getItem("mapImage");

    const savedMapId =
        localStorage.getItem("currentMapId");

    if (savedMapId) {

        currentMapId = savedMapId;

    }

    if (savedMapImage) {

        gameMapImage.src = savedMapImage;

        // 上傳新地圖時重置縮放與位移
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateMapTransform();

    }

}

// ==============================
// Map Upload / 上傳新地圖
// ==============================

/**
 * 上傳新的地圖圖片。
 *
 * file：
 * 來自 input[type="file"] 選到的圖片檔。
 *
 * 流程：
 * 1. 用 FileReader 將圖片轉成 base64 DataURL
 * 2. 讓使用者輸入地圖名稱
 * 3. 建立新的 mapId
 * 4. 將新地圖加入 maps
 * 5. 保存 maps 和 currentMapId
 * 6. 顯示新地圖圖片
 * 7. 清空目前地圖 marker
 * 8. 重新渲染地圖下拉選單
 */
function uploadMapImage(file) {

    const maxSizeMB = 2;

    if (file.size > maxSizeMB * 1024 * 1024) {

        alert(`圖片過大. 請重新上傳小於 ${maxSizeMB}MB的圖片。`);

        return;

    }

    const reader =
        new FileReader();

    reader.onload = (event) => {

        // 圖片轉成 base64 DataURL 後的結果
        const imageData =
            event.target.result;

        // 讓使用者輸入地圖名稱，預設用檔名
        const mapName =
            prompt("Map name?", file.name);

        if (!mapName) {
            return;
        }

        // 建立新的地圖 id
        currentMapId =
            "map_" + Date.now();

        // 建立新的地圖資料
        const newMap = {
            id: currentMapId,
            name: mapName,
            image: imageData
        };

        // 加入地圖清單
        maps.push(newMap);

        // 保存地圖清單
        saveMaps();

        // 保存目前使用中的地圖 id
        localStorage.setItem(
            "currentMapId",
            currentMapId
        );

        // 顯示新地圖圖片
        gameMapImage.src = imageData;

        // 上傳新地圖時重置縮放與位移
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateMapTransform();

        // 新地圖一開始沒有自訂 marker
        customItems = [];
        saveCustomItems();

        // 清除畫面上的舊 marker
        clearAllMarkersFromScreen();

        // 更新地圖選單
        renderMapSelect();

        // 載入目前地圖的 marker
        loadItems();

    };

    // 將圖片檔讀成 DataURL，讓它可以直接放進 img.src
    reader.readAsDataURL(file);

}

// ==============================
// Map Select / 地圖下拉選單
// ==============================

/**
 * 渲染地圖切換下拉選單。
 *
 * 會根據 maps 陣列建立 option。
 */
function renderMapSelect() {

    // 先清空下拉選單，並放入預設提示選項
    mapSelect.innerHTML =
        `<option value="">Select Map</option>`;

    maps.forEach(map => {

        const option =
            document.createElement("option");

        option.value = map.id;
        option.textContent = map.name;

        // 如果這張地圖是目前使用中的地圖，就設成 selected
        if (map.id === currentMapId) {
            option.selected = true;
        }

        mapSelect.appendChild(option);

    });

}

// ==============================
// Map Management / 地圖管理
// ==============================

/**
 * 重新命名目前選取的地圖。
 *
 * 流程：
 * 1. 找出 currentMapId 對應的地圖
 * 2. prompt 輸入新名稱
 * 3. 更新 maps 陣列
 * 4. 保存 localStorage
 * 5. 重新渲染地圖下拉選單
 */
function renameCurrentMap() {

    const map =
        maps.find(map =>
            map.id === currentMapId
        );

    if (!map) {

        alert("No map selected.");

        return;

    }

    const newName =
        prompt("New map name?", map.name);

    if (!newName || !newName.trim()) {
        return;
    }

    map.name =
        newName.trim();

    saveMaps();

    renderMapSelect();

}


/**
 * 刪除目前選取的地圖。
 *
 * 會刪除：
 * 1. maps 陣列中的地圖資料
 * 2. 該地圖的 customItems
 * 3. 該地圖的 collectedState
 *
 * 如果刪除後還有其他地圖，就自動切到第一張。
 * 如果沒有地圖了，就清空畫面。
 */
function deleteCurrentMap() {

    const map =
        maps.find(map =>
            map.id === currentMapId
        );

    if (!map) {

        alert("No map selected.");

        return;

    }

    const confirmed =
        confirm(`Delete map "${map.name}"?`);

    if (!confirmed) {
        return;
    }

    // 刪除這張地圖對應的 localStorage 資料
    localStorage.removeItem(
        `customItems_${currentMapId}`
    );

    localStorage.removeItem(
        `collectedState_${currentMapId}`
    );

    // 從 maps 陣列移除目前地圖
    maps =
        maps.filter(map =>
            map.id !== currentMapId
        );

    saveMaps();

    // 清除畫面上的 marker
    clearAllMarkersFromScreen();

    selectedItem = null;
    selectedMarker = null;
    customItems = [];
    pendingMarkerPosition = null;

    sidebarContent.innerHTML =
        "Click a marker...";

    // 如果還有其他地圖，就切到第一張
    if (maps.length > 0) {

        currentMapId =
            maps[0].id;

        localStorage.setItem(
            "currentMapId",
            currentMapId
        );

        gameMapImage.src =
            maps[0].image;

        renderMapSelect();

        loadItems();

    }
    else {

        // 如果沒有任何地圖了，就清空 currentMapId 和圖片
        currentMapId =
            "default";

        localStorage.removeItem("currentMapId");

        gameMapImage.removeAttribute("src");

        renderMapSelect();

        updateProgress();
        updateVisibleCount();

    }

}

/**
 * 切換目前使用中的地圖。
 *
 * mapId：
 * 使用者在下拉選單中選到的地圖 id。
 *
 * 流程：
 * 1. 從 maps 找出地圖
 * 2. 更新 currentMapId
 * 3. 顯示地圖圖片
 * 4. 清空選取狀態和 sidebar
 * 5. 清除畫面上舊 marker
 * 6. 載入新地圖的 marker
 */
function switchMap(mapId) {

    const map =
        maps.find(map => map.id === mapId);

    if (!map) {
        return;
    }

    // 更新目前地圖 id
    currentMapId = map.id;

    // 保存目前地圖 id
    localStorage.setItem(
        "currentMapId",
        currentMapId
    );

    // 顯示選到的地圖圖片
    gameMapImage.src = map.image;

    // 清空目前選取狀態
    selectedItem = null;
    selectedMarker = null;

    // 重置 sidebar
    sidebarContent.innerHTML =
        "Click a marker...";

    // 清除目前畫面上的 marker
    clearAllMarkersFromScreen();

    // 載入新地圖對應的 marker
    loadItems();

}

// ==============================
// Marker Types / Marker 類型資料
// ==============================

/**
 * 從 data/markerTypes.json 載入 marker 類型設定。
 *
 * markerTypes 格式大概是：
 * [
 *     {
 *         id: "boss",
 *         name: "Boss",
 *         icon: "icons/boss.png"
 *     }
 * ]
 */
async function loadMarkerTypes() {

    const response =
        await fetch("data/markerTypes.json");

    markerTypes =
        await response.json();

}


/**
 * 將 markerTypes 渲染到新增 marker 的 type 下拉選單。
 */
function renderMarkerTypes() {

    // 清空下拉選單
    newMarkerTypeSelect.innerHTML = "";

    markerTypes.forEach(type => {

        const option =
            document.createElement("option");

        option.value = type.id;
        option.textContent = type.name;

        newMarkerTypeSelect.appendChild(option);

    });

}


// ==============================
// Init / 初始化流程
// ==============================

/**
 * 初始化整個地圖專案。
 *
 * 這是整個程式的入口之一。
 *
 * 流程：
 * 1. 載入 markerTypes
 * 2. 渲染 marker type 下拉選單
 * 3. 載入 maps
 * 4. 讀取上次使用的 currentMapId
 * 5. 渲染地圖下拉選單
 * 6. 顯示目前地圖圖片
 * 7. 載入 marker
 */
async function init() {

    // 先載入 marker 類型，因為 createMarker 會用 setMarkerIcon
    await loadMarkerTypes();

    // 將 marker 類型渲染到新增 marker 的下拉選單
    renderMarkerTypes();

    // 載入所有地圖資料
    loadMaps();

    // 讀取上次使用的地圖 id
    const savedMapId =
        localStorage.getItem("currentMapId");

    if (savedMapId) {
        currentMapId = savedMapId;
    }

    // 渲染地圖下拉選單
    renderMapSelect();

    // 找出目前使用中的地圖
    const currentMap =
        maps.find(map => map.id === currentMapId);

    // 如果有找到目前地圖，就顯示它的圖片
    if (currentMap) {
        gameMapImage.src = currentMap.image;
    }

    // 載入目前地圖的 marker
    await loadItems();

}

// ==============================
// Coordinates / 地圖座標換算
// ==============================

/**
 * 將滑鼠在畫面上的座標，換算成地圖內部座標。
 *
 * event.clientX / event.clientY：
 * 滑鼠在瀏覽器可視範圍內的位置。
 *
 * rect.left / rect.top：
 * mapContainer 目前在畫面上的位置。
 *
 * scale：
 * 目前地圖縮放倍率。
 *
 * 回傳：
 * {
 *     x: 100,
 *     y: 250
 * }
 */
function getMapCoordinates(event) {

    // 取得 mapContainer 目前在畫面上的位置與大小
    const rect =
        mapContainer.getBoundingClientRect();

    // 扣掉 mapContainer 的左上角位置，再除以縮放比例
    const x =
        (event.clientX - rect.left) / scale;

    const y =
        (event.clientY - rect.top) / scale;

    // 回傳四捨五入後的地圖座標
    return {
        x: Math.round(x),
        y: Math.round(y)
    };

}


//3.初始化區域

// ==============================
// Init / 初始化入口
// ==============================

// 啟動整個程式。
// 會載入 markerTypes、maps、目前地圖、items 等資料。
init();


// ==============================
// Map Zoom / 地圖縮放
// ==============================

/**
 * 滑鼠滾輪縮放地圖。
 *
 * event.deltaY < 0：往上滾，放大
 * event.deltaY > 0：往下滾，縮小
 *
 * scale 會限制在 0.5 ~ 3 之間。
 */
mapViewport.addEventListener("wheel", (event) => {

    // 阻止瀏覽器預設滾動頁面
    event.preventDefault();

    // 往上滾，放大
    if (event.deltaY < 0) {

        scale += 0.1;

    }
    else {

        // 往下滾，縮小
        scale -= 0.1;

    }

    // 限制最小縮放比例
    if (scale < 0.5) {

        scale = 0.5;

    }

    // 限制最大縮放比例
    if (scale > 3) {

        scale = 3;

    }

    // 將新的 translate / scale 套用到 mapContainer
    updateMapTransform();

});

// ==============================
// Filter / Search 事件
// ==============================

/**
 * Type checkbox 改變時，重新套用篩選。
 *
 * 例如：
 * boss / chest / npc 勾選或取消勾選。
 */
filterCheckboxes.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        updateFilters();

    });

});


/**
 * 搜尋文字改變時，重新套用篩選。
 *
 * 例如輸入 boss、chest、marker 名稱等。
 */
searchInput.addEventListener("input", () => {

    updateFilters();

});


/**
 * Region 下拉選單改變時，重新套用篩選。
 */
regionFilter.addEventListener("change", () => {

    updateFilters();

});


/**
 * Rarity 下拉選單改變時，重新套用篩選。
 */
rarityFilter.addEventListener("change", () => {

    updateFilters();

});


/**
 * Hide Collected checkbox 改變時，重新套用篩選。
 */
hideCollectedCheckbox.addEventListener("change", () => {

    updateFilters();

});


/**
 * 重置所有篩選條件。
 */
resetFiltersBtn.addEventListener("click", () => {

    resetFilters();

});

// ==============================
// Save Import / Export 事件
// ==============================

/**
 * 匯出目前收集狀態。
 */
exportBtn.addEventListener("click", () => {

    exportSave();

});


/**
 * 點擊 Import 按鈕時，實際觸發隱藏的 file input。
 */
importBtn.addEventListener("click", () => {

    importInput.click();

});


/**
 * 使用者選擇匯入檔案後，讀取該檔案。
 */
importInput.addEventListener("change", (event) => {

    // 取得使用者選到的第一個檔案
    const file =
        event.target.files[0];

    if (file) {

        importSave(file);

    }

    // 清空 input 值，讓下次選同一個檔案也會觸發 change
    event.target.value = "";

});


/**
 * 重置目前地圖的收集進度。
 */
resetBtn.addEventListener("click", () => {

    resetSave();

});



importInput.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    console.log("import file:", file);

    if (file) {

        importSave(file);

    }

    // 讓下次選同一個檔案也會觸發 change
    event.target.value = "";

});

// ==============================
// Map Drag / 拖曳整張地圖
// ==============================

/**
 * 在地圖可視區按下滑鼠左鍵時，開始拖曳地圖。
 */
mapViewport.addEventListener("mousedown", (event) => {

    // 如果現在正在拖 marker，就不要同時啟動地圖拖曳
    if (isDraggingMarker) {
        return;
    }

    // 只允許滑鼠左鍵拖曳
    if (event.button !== 0) {
        return;
    }

    // 進入地圖拖曳狀態
    isDragging = true;

    // 拖曳剛開始時，先視為還沒有真的拖動
    hasDragged = false;

    // 記錄滑鼠按下時的位置與目前地圖位移的差距
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;

    // 加上 dragging class，通常用來改變 cursor 樣式
    mapViewport.classList.add("dragging");

});


/**
 * 滑鼠移動時，如果目前正在拖曳地圖，就更新地圖位移。
 *
 * 用 window 是為了避免滑鼠移動太快離開 mapViewport 時拖曳中斷。
 */
window.addEventListener("mousemove", (event) => {

    // 如果沒有在拖曳地圖，就不做事
    if (!isDragging) {
        return;
    }

    // 計算新的地圖位移
    const newTranslateX =
        event.clientX - startX;

    const newTranslateY =
        event.clientY - startY;

    // 計算本次移動距離，用來判斷是否真的有拖曳
    const movedDistance =
        Math.abs(newTranslateX - translateX) +
        Math.abs(newTranslateY - translateY);

    // 超過 3px 才視為真的拖曳，避免一般 click 被誤判
    if (movedDistance > 3) {
        hasDragged = true;
    }

    // 更新地圖位移狀態
    translateX = newTranslateX;
    translateY = newTranslateY;

    // 套用到畫面
    updateMapTransform();

});


/**
 * 放開滑鼠時，停止拖曳地圖。
 */
window.addEventListener("mouseup", () => {

    isDragging = false;

    mapViewport.classList.remove("dragging");

});


/**
 * 視窗失去焦點時，停止拖曳地圖。
 *
 * 例如拖曳中切到其他視窗，避免狀態卡住。
 */
window.addEventListener("blur", () => {

    isDragging = false;

    mapViewport.classList.remove("dragging");

});


/**
 * 滑鼠離開視窗時，停止拖曳地圖。
 *
 * 注意：
 * window 的 mouseleave 有些情況不一定穩定，
 * 但作為防呆可以保留。
 */
window.addEventListener("mouseleave", () => {

    isDragging = false;

    mapViewport.classList.remove("dragging");

});

// ==============================
// Edit Mode / 新增 Marker
// ==============================

/**
 * 切換編輯模式。
 *
 * Edit Mode On：
 * 可以點地圖記錄座標、新增 marker、拖曳 marker。
 *
 * Edit Mode Off：
 * 一般瀏覽 / 收集模式。
 */
editModeBtn.addEventListener("click", () => {

    isEditMode = !isEditMode;

    editModeBtn.textContent =
        isEditMode ? "Edit Mode: On" : "Edit Mode: Off";

});


/**
 * 在 Edit Mode 下點擊地圖，記錄準備新增 marker 的座標。
 */
mapContainer.addEventListener("click", (event) => {

    // 只有編輯模式才處理點擊地圖新增 marker 的流程
    if (!isEditMode) {
        return;
    }

    // 如果剛剛是在拖曳地圖，就不要記錄新增位置
    if (hasDragged) {
        return;
    }

    // 將滑鼠座標換算成地圖內部座標
    const position =
        getMapCoordinates(event);

    // 暫存這次點擊的位置
    pendingMarkerPosition = {
        x: position.x,
        y: position.y
    };

    // 在 sidebar 顯示目前選到的位置
    sidebarContent.innerHTML = `
        Selected position:
        ${pendingMarkerPosition.x},
        ${pendingMarkerPosition.y}
    `;

});


/**
 * 根據目前暫存的座標與輸入的名稱，建立新的自訂 marker。
 */
createMarkerBtn.addEventListener("click", () => {

    // 尚未點擊地圖位置時，不能新增 marker
    if (!pendingMarkerPosition) {

        alert("Please click a position on the map first.");

        return;

    }

    // 取得使用者輸入的 marker 名稱
    const name =
        newMarkerNameInput.value.trim();

    // marker 名稱必填
    if (!name) {

        alert("Please enter marker name.");

        return;

    }

    // 取得使用者選擇的 marker type
    const type =
        newMarkerTypeSelect.value;

    // 建立新的 marker 資料
    const newItem = {
        id: "custom_" + Date.now(),
        name: name,
        description: "",
        x: pendingMarkerPosition.x,
        y: pendingMarkerPosition.y,
        type: type,
        region: "Custom",
        rarity: "Common"
    };

    // 加入自訂 marker 清單
    customItems.push(newItem);

    // 保存到 localStorage
    saveCustomItems();

    // 建立畫面上的 marker
    createMarker(newItem);

    // 清空輸入框與暫存座標
    newMarkerNameInput.value = "";
    pendingMarkerPosition = null;

    // 更新畫面
    updateProgress();
    updateFilters();
    updateVisibleCount();

});


// ==============================
// Marker Edit / Delete 事件
// ==============================

/**
 * 刪除目前選取的 marker。
 */
deleteMarkerBtn.addEventListener("click", () => {

    deleteSelectedMarker();

});


/**
 * 編輯目前選取的 marker。
 */
editMarkerBtn.addEventListener("click", () => {

    editSelectedMarker();

});


// ==============================
// Project Import / Export 事件
// ==============================

/**
 * 匯出目前專案資料。
 */
exportProjectBtn.addEventListener("click", () => {

    exportProject();

});


/**
 * 點擊 Import Project 按鈕時，觸發隱藏的 file input。
 */
importProjectBtn.addEventListener("click", () => {

    importProjectInput.click();

});


/**
 * 使用者選擇 project JSON 檔案後，匯入專案資料。
 */
importProjectInput.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    if (file) {

        importProject(file);

    }

    // 讓下次選同一個檔案也會觸發 change
    event.target.value = "";

});

// ==============================
// Map Upload / Switch 事件
// ==============================

/**
 * 點擊 Upload Map 按鈕時，觸發隱藏的圖片 file input。
 */
uploadMapBtn.addEventListener("click", () => {

    mapUploadInput.click();

});


/**
 * 使用者選擇地圖圖片後，建立新的地圖。
 */
mapUploadInput.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    if (file) {

        uploadMapImage(file);

    }

    // 讓下次選同一張圖片也會觸發 change
    event.target.value = "";

});


/**
 * 使用者切換地圖下拉選單時，切換目前地圖。
 */
mapSelect.addEventListener("change", () => {

    if (mapSelect.value) {

        switchMap(mapSelect.value);

    }

});

/**
 * 重新命名目前地圖。
 */
renameMapBtn.addEventListener("click", () => {

    renameCurrentMap();

});


/**
 * 刪除目前地圖。
 */
deleteMapBtn.addEventListener("click", () => {

    deleteCurrentMap();

});


// ==============================
// Marker Drag / 拖曳 Marker
// ==============================

/**
 * 拖曳 marker 時，讓 marker 跟著滑鼠移動。
 *
 * 綁在 document 是為了：
 * 即使滑鼠移動太快離開 marker，本次拖曳仍然可以繼續。
 */
document.addEventListener("mousemove", (event) => {

    // 沒有在拖曳 marker 時，不做事
    if (!isDraggingMarker) {
        return;
    }

    // 只要進入 mousemove，就代表 marker 有被拖曳過
    hasDraggedMarker = true;

    // 將滑鼠座標換算成地圖內部座標
    const position =
        getMapCoordinates(event);

    // 更新 marker 的畫面位置
    draggingMarker.style.left =
        position.x + "px";

    draggingMarker.style.top =
        position.y + "px";

    // 同步更新座標顯示文字
    coordinateText.textContent =
        `X: ${position.x}, Y: ${position.y}`;

});


/**
 * 放開滑鼠時，停止拖曳 marker，並保存新的座標。
 */
document.addEventListener("mouseup", () => {

    // 如果沒有在拖曳 marker，就不做事
    if (!isDraggingMarker) {
        return;
    }

    // 取得正在拖曳的 marker id
    const markerId =
        draggingMarker.dataset.id;

    // 取得 marker 新座標
    const newX =
        parseInt(draggingMarker.style.left);

    const newY =
        parseInt(draggingMarker.style.top);

    // 目前只允許更新 customItems 裡的 marker
    const item =
        customItems.find(item =>
            item.id === markerId
        );

    // 如果找到對應自訂 marker，就更新資料並保存
    if (item) {

        item.x = newX;
        item.y = newY;

        saveCustomItems();

        // 取得該 marker 目前是否已收集
        const isCollected =
            draggingMarker.classList.contains("collected");

        // 更新 sidebar 裡顯示的座標資訊
        updateSidebar(item, isCollected);

    }

    // 結束 marker 拖曳狀態
    isDraggingMarker = false;

    // 清空目前拖曳中的 marker
    draggingMarker = null;

    // 延後重置 hasDraggedMarker，
    // 避免 mouseup 後緊接著的 click 誤觸 marker click
    setTimeout(() => {

        hasDraggedMarker = false;

    }, 0);

});



// ==============================
// Coordinates Display / 座標顯示
// ==============================

/**
 * 滑鼠在地圖可視範圍內移動時，顯示目前地圖座標。
 */
mapViewport.addEventListener("mousemove", (event) => {

    const position =
        getMapCoordinates(event);

    coordinateText.textContent =
        `X: ${position.x}, Y: ${position.y}`;

});


/**
 * 滑鼠離開地圖可視範圍時，清空座標顯示。
 */
mapViewport.addEventListener("mouseleave", () => {

    coordinateText.textContent =
        "X: -, Y: -";

});