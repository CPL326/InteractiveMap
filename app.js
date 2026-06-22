//變數宣告區域
const mapContainer = document.querySelector(".map-container");

const filterCheckboxes =
    document.querySelectorAll(".filter-panel input");

const tooltip =
    document.getElementById("tooltip");

const sidebarContent =
    document.getElementById("sidebar-content");

const searchInput =
    document.getElementById("search-input");

const progressText =
    document.getElementById("progress-text");    

const exportBtn =
    document.getElementById("export-btn");

const importBtn =
    document.getElementById("import-btn");

const importInput =
    document.getElementById("import-input");

const mapViewport =
    document.querySelector(".map-viewport");

const regionFilter =
    document.getElementById("region-filter");

const rarityFilter =
    document.getElementById("rarity-filter");

const resetBtn =
    document.getElementById("reset-btn");

const hideCollectedCheckbox =
    document.getElementById("hide-collected-checkbox");

const resetFiltersBtn =
    document.getElementById("reset-filters-btn");

const visibleCountText =
    document.getElementById("visible-count-text");

const editModeBtn =
    document.getElementById("edit-mode-btn");

const deleteMarkerBtn =
    document.getElementById("delete-marker-btn");

const editMarkerBtn =
    document.getElementById("edit-marker-btn");

const exportProjectBtn =
    document.getElementById("export-project-btn");

const importProjectBtn =
    document.getElementById("import-project-btn");

const importProjectInput =
    document.getElementById("import-project-input");

const uploadMapBtn =
    document.getElementById("upload-map-btn");

const mapUploadInput =
    document.getElementById("map-upload-input");

const gameMapImage =
    document.querySelector(".game-map");

const mapSelect =
    document.getElementById("map-select");

const newMarkerNameInput =
    document.getElementById("new-marker-name");

const newMarkerTypeSelect =
    document.getElementById("new-marker-type");

const createMarkerBtn =
    document.getElementById("create-marker-btn");

let maps = [];//放地圖
let markerTypes = [];


let isEditMode = false;
let scale = 1;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;

let hasDragged = false;

let customItems = [];//收集marker清單

let selectedMarker = null;//選擇哪個marker
let selectedItem = null;//選擇哪個item，用於刪掉選擇的marker

let currentMapId = "default";//地圖id

let pendingMarkerPosition = null;//暫存點擊座標

//函式宣告區域
async function loadItems() {

    const response =
        await fetch("data/items.json");

    const items =
        await response.json();

    loadCustomItems();

    const allItems =
        items.concat(customItems);

    allItems.forEach(item => {

        createMarker(item);

    });

    updateProgress();

    updateFilters();

    updateVisibleCount();


}

function createMarker(item) {

    const marker = document.createElement("div");

    marker.classList.add("marker");

    marker.classList.add(item.type);

    setMarkerIcon(marker, item.type);

    marker.dataset.type = item.type;

    marker.dataset.name =
    item.name.toLowerCase();

    marker.dataset.id = item.id;

    marker.dataset.region = item.region;

    marker.dataset.type = item.type;

    marker.dataset.rarity = item.rarity;

    marker.style.left = item.x + "px";
    marker.style.top = item.y + "px";

    // 讀取已保存狀態
    const collectedState =getCollectedState();

    const savedState = collectedState[item.id];

    if (savedState === true) {

        marker.classList.add("collected");

    }

    // Hover 顯示 tooltip
    marker.addEventListener("mouseenter", () => {

        tooltip.style.display = "block";

        tooltip.innerHTML = `
            <strong>${item.name}</strong>
            <br>
            Type: ${item.type}
        `;

        tooltip.style.left = (item.x + 40) + "px";

        tooltip.style.top = (item.y - 10) + "px";

    });

    // Hover 離開
    marker.addEventListener("mouseleave", () => {

        tooltip.style.display = "none";

    });

    // 點擊切換收集狀態
    marker.addEventListener("click", () => {

        if (hasDragged) {
            return;
        }

        marker.classList.toggle("collected");

        const isCollected =
            marker.classList.contains("collected");

        saveCollectedState(item.id, isCollected);

        updateSidebar(item, isCollected);

        selectMarker(marker);

        updateProgress();

    });

    

    mapContainer.appendChild(marker);

}

function setMarkerIcon(marker, typeId) {

    const markerType =
        markerTypes.find(type =>
            type.id === typeId
        );

    if (markerType && markerType.icon) {

        marker.style.backgroundImage =
            `url('${markerType.icon}')`;

    }
    else {

        marker.style.backgroundImage = "";

    }

}

function updateFilters() {

    // 取得 type filter
    const enabledTypes = [];

    filterCheckboxes.forEach(checkbox => {

        if (checkbox.checked) {

            enabledTypes.push(checkbox.value);

        }

    });

    // 取得搜尋文字
    const searchKeyword =
        searchInput.value
            .toLowerCase()
            .trim();

    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        const markerType =
            marker.dataset.type;

        const markerName =
            marker.dataset.name;

        const markerRegion =
            marker.dataset.region;

        const selectedRegion =
            regionFilter.value;

        const markerRarity =
            marker.dataset.rarity;

        const selectedRarity =
            rarityFilter.value;
        
        const isCollected =
            marker.classList.contains("collected");

        // type filter
        const typeMatched =
            enabledTypes.includes(markerType);

        // keyword filter
        const searchMatched =
            markerName.includes(searchKeyword) || markerType.includes(searchKeyword);

        const regionMatched =
            selectedRegion === "all" || markerRegion === selectedRegion;

        const rarityMatched =
            selectedRarity === "all" || markerRarity === selectedRarity;

        const collectedMatched =
            !hideCollectedCheckbox.checked || !isCollected;

        // 同時符合才顯示
        if (typeMatched && searchMatched && regionMatched && rarityMatched && collectedMatched) {

            marker.style.display = "block";

        }
        else {

            marker.style.display = "none";

        }

    });

    updateVisibleCount();

}




function selectMarker(marker) {

    // 取消之前選中的 marker
    if (selectedMarker) {

        selectedMarker.classList.remove("selected");

    }

    // 更新目前選中的 marker
    selectedMarker = marker;

    selectedItem = marker.dataset.id;

    // 加上 selected class
    marker.classList.add("selected");

}

function updateSidebar(item, isCollected) {

    sidebarContent.innerHTML = `

        <img
            src="${item.image}"
            class="sidebar-image"
        />

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
            ${item.description}
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
            <a
                href="${item.wiki}"
                target="_blank"
                class="wiki-link"
            >
                Open Wiki
            </a>
        </p>
    `;

}

function updateProgress() {

    const allMarkers =
        document.querySelectorAll(".marker");

    const collectedMarkers =
        document.querySelectorAll(".marker.collected");

    progressText.textContent =
        `Collected: ${collectedMarkers.length} / ${allMarkers.length}`;

}

function exportSave() {

    const saveData = {};

    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        const markerId =
            marker.dataset.id;
            console.log(markerId);

        const isCollected =
            marker.classList.contains("collected");

        saveData[markerId] = isCollected;

        console.log(saveData);
        console.log(saveData[markerId]);

    });

    const jsonString =
        JSON.stringify(saveData, null, 2);

    const blob =
        new Blob([jsonString], {
            type: "application/json"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "map-save.json";

    a.click();

    URL.revokeObjectURL(url);

}

function importSave(file) {

    const reader =
        new FileReader();

    reader.onload = (event) => {

        console.log("file content:", event.target.result);

        const saveData =
            JSON.parse(event.target.result);

        const allMarkers =
            document.querySelectorAll(".marker");

        allMarkers.forEach(marker => {

            const markerId =
                marker.dataset.id;

            const isCollected =
                saveData[markerId];

            if (isCollected) {

                marker.classList.add("collected");

            }
            else {

                marker.classList.remove("collected");

            }

            saveCollectedState(markerId, isCollected);

        });

        updateProgress();

    };

    reader.readAsText(file);

}

function updateMapTransform() {

    mapContainer.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;

}

function resetSave() {

    const confirmed =
        confirm("Are you sure you want to reset all progress?");

    if (!confirmed) {
        return;
    }

    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        marker.classList.remove("collected");

        const markerId =
            marker.dataset.id;

        saveCollectedState(markerId, false);

    });

    updateProgress();

    sidebarContent.innerHTML =
        "Click a marker...";

}

function resetFilters() {

    searchInput.value = "";

    filterCheckboxes.forEach(checkbox => {

        checkbox.checked = true;

    });

    regionFilter.value = "all";

    rarityFilter.value = "all";

    hideCollectedCheckbox.checked = false;

    updateFilters();

}

function updateVisibleCount() {

    const allMarkers =
        document.querySelectorAll(".marker");

    const visibleMarkers =
        Array.from(allMarkers).filter(marker => {

            return marker.style.display !== "none";

        });

    visibleCountText.textContent =
        `Showing: ${visibleMarkers.length} / ${allMarkers.length}`;

}

//讀取自行設定的物件
function loadCustomItems() {

    const saved =
        localStorage.getItem(
            `customItems_${currentMapId}`
        );

    if (saved) {

        customItems =
            JSON.parse(saved);

    }
    else {

        customItems = [];

    }

}

//將自行設定的物件保存
function saveCustomItems() {

    localStorage.setItem(
        `customItems_${currentMapId}`,
        JSON.stringify(customItems)
    );

}

//獲取保存狀態時的地圖id
function getCollectedState() {

    const saved =
        localStorage.getItem(
            `collectedState_${currentMapId}`
        );

    if (saved) {

        return JSON.parse(saved);

    }

    return {};

}

//保存地圖狀態 含marker, 地圖id等
function saveCollectedState(markerId, isCollected) {

    const collectedState =
        getCollectedState();

    collectedState[markerId] =
        isCollected;

    localStorage.setItem(
        `collectedState_${currentMapId}`,
        JSON.stringify(collectedState)
    );

}

//刪除所選擇的marker
function deleteSelectedMarker() {

    if (!selectedItem) {

        alert("No marker selected");

        return;

    }

    const confirmed =
        confirm("Delete this marker?");

    if (!confirmed) {
        return;
    }

    //從自訂 marker 清單移除資料。
    customItems =
        customItems.filter(item =>
            item.id !== selectedItem
        );

    //把刪除後的結果存回 localStorage。    
    saveCustomItems();

    //直接從畫面上刪除 marker。
    const markerToDelete =
        document.querySelector(
            `.marker[data-id="${selectedItem}"]`
        );

        
    if (markerToDelete) {

        markerToDelete.remove();

    }

    //把那個 marker 的收集狀態也刪掉。
    const collectedState =
    getCollectedState();

    delete collectedState[selectedItem];

    localStorage.setItem(
        `collectedState_${currentMapId}`,
        JSON.stringify(collectedState)
    );

    selectedItem = null;
    selectedMarker = null;

    sidebarContent.innerHTML =
        "Click a marker...";

    updateProgress();
    updateVisibleCount();
    updateFilters();

}

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

    const newName =
        prompt("Marker name?", item.name);

    if (!newName) {
        return;
    }

    const newType =
        prompt("Type? boss / chest / npc", item.type);

    const newDescription =
        prompt("Description?", item.description);

    const newRegion =
        prompt("Region?", item.region);

    const newRarity =
        prompt("Rarity?", item.rarity);

    item.name = newName;
    item.type = newType || item.type;
    item.description = newDescription || "";
    item.region = newRegion || "Custom";
    item.rarity = newRarity || "Common";

    saveCustomItems();

    const marker =
        document.querySelector(
            `.marker[data-id="${selectedItem}"]`
        );

    if (marker) {

        marker.dataset.type = item.type;
        marker.dataset.name = item.name.toLowerCase();
        marker.dataset.region = item.region;
        marker.dataset.rarity = item.rarity;

        marker.className = "marker";
        marker.classList.add(item.type);

        setMarkerIcon(marker, item.type);

        const isCollected =
            marker.classList.contains("collected");

        updateSidebar(item, isCollected);

    }

    updateFilters();

}

function exportProject() {

    const collectedState = {};

    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        const markerId =
            marker.dataset.id;

        collectedState[markerId] =
            marker.classList.contains("collected");

    });

    const projectData = {
        customItems: customItems,
        collectedState: collectedState
    };

    const jsonString =
        JSON.stringify(projectData, null, 2);

    const blob =
        new Blob([jsonString], {
            type: "application/json"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "map-project.json";

    a.click();

    URL.revokeObjectURL(url);

}

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

function importProject(file) {

    const reader =
        new FileReader();

    reader.onload = (event) => {

        const projectData =
            JSON.parse(event.target.result);

        clearCustomMarkersFromScreen();

        customItems =
            projectData.customItems || [];

        saveCustomItems();

        customItems.forEach(item => {

            createMarker(item);

        });

        const collectedState =
            projectData.collectedState || {};

        const allMarkers =
            document.querySelectorAll(".marker");

        allMarkers.forEach(marker => {

            const markerId =
                marker.dataset.id;

            const isCollected =
                collectedState[markerId];

            if (isCollected) {
                marker.classList.add("collected");
            }
            else {
                marker.classList.remove("collected");
            }

            localStorage.setItem(
                markerId,
                isCollected
            );

        });

        selectedItem = null;
        selectedMarker = null;

        sidebarContent.innerHTML =
            "Click a marker...";

        updateProgress();
        updateVisibleCount();
        updateFilters();

    };

    reader.readAsText(file);

}

//加載地圖圖片
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

    }

}

//上傳地圖圖片
function uploadMapImage(file) {

    const reader =
        new FileReader();

    reader.onload = (event) => {

        const imageData =
            event.target.result;

        const mapName =
            prompt("Map name?", file.name);

        if (!mapName) {
            return;
        }

        currentMapId =
            "map_" + Date.now();

        const newMap = {
            id: currentMapId,
            name: mapName,
            image: imageData
        };

        maps.push(newMap);

        saveMaps();

        localStorage.setItem(
            "currentMapId",
            currentMapId
        );

        gameMapImage.src = imageData;

        customItems = [];
        saveCustomItems();

        clearAllMarkersFromScreen();

        renderMapSelect();

        loadItems();

    };

    reader.readAsDataURL(file);

}

//新增清除畫面 marker 
function clearAllMarkersFromScreen() {

    const allMarkers =
        document.querySelectorAll(".marker");

    allMarkers.forEach(marker => {

        marker.remove();

    });

}

function loadMaps() {

    const saved =
        localStorage.getItem("maps");

    maps = saved ? JSON.parse(saved) : [];

}

function saveMaps() {

    localStorage.setItem(
        "maps",
        JSON.stringify(maps)
    );

}

function renderMapSelect() {

    mapSelect.innerHTML =
        `<option value="">Select Map</option>`;

    maps.forEach(map => {

        const option =
            document.createElement("option");

        option.value = map.id;
        option.textContent = map.name;

        if (map.id === currentMapId) {
            option.selected = true;
        }

        mapSelect.appendChild(option);

    });

}

function switchMap(mapId) {

    const map =
        maps.find(map => map.id === mapId);

    if (!map) {
        return;
    }

    currentMapId = map.id;

    localStorage.setItem(
        "currentMapId",
        currentMapId
    );

    gameMapImage.src = map.image;

    selectedItem = null;
    selectedMarker = null;

    sidebarContent.innerHTML =
        "Click a marker...";

    clearAllMarkersFromScreen();

    loadItems();

}

async function loadMarkerTypes() {

    const response =
        await fetch("data/markerTypes.json");

    markerTypes =
        await response.json();

}

async function init() {

    await loadMarkerTypes();

    renderMarkerTypes();

    loadMaps();

    const savedMapId =
        localStorage.getItem("currentMapId");

    if (savedMapId) {
        currentMapId = savedMapId;
    }

    renderMapSelect();

    const currentMap =
        maps.find(map => map.id === currentMapId);

    if (currentMap) {
        gameMapImage.src = currentMap.image;
    }

    await loadItems();

}

function renderMarkerTypes() {

    markerTypeSelect.innerHTML = "";

    markerTypes.forEach(type => {

        const option =
            document.createElement("option");

        option.value = type.id;

        option.textContent = type.name;

        markerTypeSelect.appendChild(option);

    });

}

function renderMarkerTypes() {

    newMarkerTypeSelect.innerHTML = "";

    markerTypes.forEach(type => {

        const option =
            document.createElement("option");

        option.value = type.id;

        option.textContent = type.name;

        newMarkerTypeSelect.appendChild(option);

    });

}

//3.初始化區域

init();

mapViewport.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (event.deltaY < 0) {

        scale += 0.1;

    }
    else {

        scale -= 0.1;

    }

    if (scale < 0.5) {

        scale = 0.5;

    }

    if (scale > 3) {

        scale = 3;

    }

    updateMapTransform();

});

filterCheckboxes.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        updateFilters();

    });

    searchInput.addEventListener("input", () => {

    updateFilters();

    });

});

exportBtn.addEventListener("click", () => {

    exportSave();

});

importBtn.addEventListener("click", () => {

    importInput.click();

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

mapViewport.addEventListener("mousedown", (event) => {

    if (event.button !== 0) {
        return;
    }

    isDragging = true;
    hasDragged = false;

    startX = event.clientX - translateX;
    startY = event.clientY - translateY;

    mapViewport.classList.add("dragging");

});


window.addEventListener("mousemove", (event) => {

    if (!isDragging) {
        return;
    }

    const newTranslateX = event.clientX - startX;
    const newTranslateY = event.clientY - startY;

    const movedDistance =
        Math.abs(newTranslateX - translateX) +
        Math.abs(newTranslateY - translateY);

    if (movedDistance > 3) {
        hasDragged = true;
    }

    translateX = newTranslateX;
    translateY = newTranslateY;

    updateMapTransform();

});

window.addEventListener("mouseup", () => {

    isDragging = false;

    mapViewport.classList.remove("dragging");

});

window.addEventListener("blur", () => {

    isDragging = false;

    mapViewport.classList.remove("dragging");

});

window.addEventListener("mouseleave", () => {

    isDragging = false;

    mapViewport.classList.remove("dragging");

});

regionFilter.addEventListener("change", () => {

    updateFilters();

});

rarityFilter.addEventListener("change", () => {

    updateFilters();

});

resetBtn.addEventListener("click", () => {

    resetSave();

});

hideCollectedCheckbox.addEventListener("change", () => {

    updateFilters();

});

resetFiltersBtn.addEventListener("click", () => {

    resetFilters();

});

editModeBtn.addEventListener("click", () => {

    isEditMode = !isEditMode;

    editModeBtn.textContent =
        isEditMode ? "Edit Mode: On" : "Edit Mode: Off";

});

mapContainer.addEventListener("click", (event) => {

    if (!isEditMode) {
        return;
    }

    if (hasDragged) {
        return;
    }

    const rect =
        mapContainer.getBoundingClientRect();

    const x =
        (event.clientX - rect.left) / scale;

    const y =
        (event.clientY - rect.top) / scale;

    pendingMarkerPosition = {
        x: Math.round(x),
        y: Math.round(y)
    };

    sidebarContent.innerHTML = `
        Selected position:
        ${pendingMarkerPosition.x},
        ${pendingMarkerPosition.y}
    `;

});

createMarkerBtn.addEventListener("click", () => {

    if (!pendingMarkerPosition) {

        alert("Please click a position on the map first.");

        return;

    }

    const name =
        newMarkerNameInput.value.trim();

    if (!name) {

        alert("Please enter marker name.");

        return;

    }

    const type =
        newMarkerTypeSelect.value;

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

    customItems.push(newItem);

    saveCustomItems();

    createMarker(newItem);

    newMarkerNameInput.value = "";
    pendingMarkerPosition = null;

    updateProgress();
    updateVisibleCount();
    updateFilters();

});

deleteMarkerBtn.addEventListener("click", () => {

    deleteSelectedMarker();

});

editMarkerBtn.addEventListener("click", () => {

    editSelectedMarker();

});

exportProjectBtn.addEventListener("click", () => {

    exportProject();

});

importProjectBtn.addEventListener("click", () => {

    importProjectInput.click();

});

importProjectInput.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    if (file) {

        importProject(file);

    }

    event.target.value = "";

});

uploadMapBtn.addEventListener("click", () => {

    mapUploadInput.click();

});

mapUploadInput.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    if (file) {

        uploadMapImage(file);

    }

    event.target.value = "";

});

mapSelect.addEventListener("change", () => {

    if (mapSelect.value) {

        switchMap(mapSelect.value);

    }

});