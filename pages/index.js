<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
<title>Keith's Cig Inventory · Edit SKU by Scanner</title>
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f5f0e8;
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  :root {
    --red: #c0392b;
    --red-dark: #96231a;
    --navy: #0f1f38;
    --navy-mid: #1a3157;
    --blue: #1e4080;
    --tan: #f0e9d6;
    --tan-dark: #d9cdb3;
    --white: #ffffff;
    --text: #1a1a2e;
    --muted: #6b7280;
    --border: #ddd6c8;
    --shadow: 0 2px 12px rgba(15,31,56,0.12);
    --highlight: #fef9c3;
  }

  header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 60%, var(--red) 100%);
    color: white;
    position: sticky;
    top: 0;
    z-index: 110;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .header-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 26px;
    letter-spacing: 2px;
    line-height: 1;
  }
  .header-sub {
    font-size: 11px;
    opacity: 0.75;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .header-stats {
    display: flex;
    gap: 16px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    text-align: center;
  }
  .hstat {
    background: rgba(255,255,255,0.12);
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
  }
  .hstat-val { font-size: 18px; font-weight: 500; display: block; }
  .hstat-lbl { opacity: 0.7; font-size: 10px; text-transform: uppercase; }

  .controls {
    background: white;
    border-bottom: 2px solid var(--tan-dark);
    padding: 12px 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    position: sticky;
    top: 70px;
    z-index: 105;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  @media (max-width: 640px) { .controls { top: 90px; } }

  .search-wrap {
    flex: 1;
    min-width: 180px;
    position: relative;
  }
  .search-wrap input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    background: var(--tan);
    outline: none;
  }
  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
  }
  select, .scan-input {
    padding: 8px 12px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    background: var(--tan);
    cursor: pointer;
    outline: none;
  }
  .scan-input {
    width: 160px;
    background: #fff6e5;
    font-family: 'DM Mono', monospace;
  }
  .btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }
  .btn-red { background: var(--red); color: white; }
  .btn-red:hover { background: var(--red-dark); transform: translateY(-1px); }
  .btn-navy { background: var(--navy); color: white; }
  .btn-navy:hover { background: var(--navy-mid); }
  .btn-outline { background: white; color: var(--navy); border: 2px solid var(--navy); }
  .btn-outline:hover { background: var(--navy); color: white; }
  .btn-camera { background: #2c3e66; color: white; }
  .btn-camera:hover { background: #1e2a4a; }
  .date-stamp {
    font-size: 11px;
    opacity: 0.6;
    font-family: 'DM Mono', monospace;
    margin-left: auto;
  }

  .modal {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    width: 90%;
    max-width: 500px;
    border-radius: 24px;
    padding: 20px;
    text-align: center;
    position: relative;
  }
  .modal-content #qr-reader { width: 100%; }
  .close-modal {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    cursor: pointer;
    color: var(--red);
  }
  .scanner-status {
    margin-top: 12px;
    font-size: 13px;
    color: var(--muted);
  }

  .main {
    padding: 16px 20px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .summary-bar {
    background: var(--navy);
    color: white;
    padding: 12px 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
    border-radius: 10px;
    flex-shrink: 0;
  }
  .sbar-item { text-align: center; }
  .sbar-val { font-family: 'Bebas Neue', cursive; font-size: 28px; color: var(--tan); line-height: 1; }
  .sbar-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }

  .inventory-scroll {
    flex: 1;
    max-height: calc(100vh - 280px);
    overflow-y: auto;
    border-radius: 12px;
    scroll-behavior: smooth;
  }
  @media (max-width: 768px) {
    .inventory-scroll { max-height: calc(100vh - 320px); }
  }

  .brand-section {
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: visible;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    background: white;
  }
  .brand-header {
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    background: linear-gradient(90deg, var(--navy) 0%, var(--navy-mid) 100%);
    color: white;
    position: sticky;
    top: 0;
    z-index: 20;
    border-radius: 12px 12px 0 0;
  }
  .brand-name {
    font-family: 'Bebas Neue', cursive;
    font-size: 20px;
    letter-spacing: 1.5px;
  }
  .brand-meta { display: flex; gap: 16px; align-items: center; font-size: 12px; flex-wrap: wrap; }
  .brand-totals { display: flex; gap: 8px; font-family: 'DM Mono', monospace; font-size: 12px; }
  .btag {
    background: rgba(255,255,255,0.15);
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.25);
  }
  .btag.red { background: rgba(192,57,43,0.6); }
  .chevron { transition: transform 0.2s; font-size: 14px; }
  .brand-section.collapsed .chevron { transform: rotate(-90deg); }
  .brand-section.collapsed .items-table { display: none; }

  .items-table {
    width: 100%;
    border-collapse: collapse;
  }
  .items-table thead tr {
    background: var(--tan);
    border-bottom: 2px solid var(--tan-dark);
  }
  .items-table th {
    padding: 8px 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--navy);
    text-align: left;
  }
  .items-table th.num { text-align: center; }
  .items-table tbody tr {
    border-bottom: 1px solid #f0ebe0;
    transition: background 0.1s;
  }
  .items-table tbody tr:hover { background: #faf6ee; }
  .highlight-row {
    background-color: var(--highlight) !important;
    animation: fadeHighlight 1.5s ease-out;
  }
  @keyframes fadeHighlight {
    0% { background-color: #fff3b0; }
    70% { background-color: #fff3b0; }
    100% { background-color: transparent; }
  }
  .item-sku {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    display: inline-block;
    background: #e9e5d8;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .edit-sku-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    margin-left: 6px;
    color: var(--blue);
    vertical-align: middle;
  }
  .edit-sku-btn:hover { color: var(--red); }
  .tier-badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .tier-premium { background: #fef3c7; color: #92400e; }
  .tier-generic { background: #dbeafe; color: #1e40af; }
  .tier-sub { background: #f3e8ff; color: #6b21a8; }
  .count-cell { text-align: center; }
  .count-group { display: inline-flex; flex-direction: column; gap: 3px; align-items: center; }
  .count-row { display: flex; align-items: center; gap: 4px; }
  .count-lbl { font-size: 9px; font-weight: 600; color: var(--muted); width: 38px; text-align: right; }
  input[type="number"] {
    width: 70px;
    padding: 4px 6px;
    border: 1px solid var(--border);
    border-radius: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    text-align: center;
    background: var(--tan);
  }
  .total-cell { text-align: center; font-family: 'DM Mono', monospace; }
  .total-packs { font-size: 16px; font-weight: 500; color: var(--navy); }
  .add-form-wrap {
    background: white;
    border: 2px dashed var(--tan-dark);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    display: none;
  }
  .add-form-wrap.open { display: block; }
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 14px;
  }
  .form-field label { display: block; font-size: 11px; font-weight: 600; color: var(--navy); margin-bottom: 4px; }
  .form-field input, .form-field select {
    width: 100%;
    padding: 8px 10px;
    border: 2px solid var(--border);
    border-radius: 8px;
    background: var(--tan);
  }
  @media print {
    header, .controls, .add-form-wrap, .btn, .modal { display: none; }
    .inventory-scroll { overflow: visible !important; max-height: none; }
    .brand-section.collapsed .items-table { display: table; }
  }
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <div>
      <div class="header-title">🚬 Keith's Cig Inventory</div>
      <div class="header-sub">Storage = Cartons · Shelf = Packs · Edit SKU by Scanner</div>
    </div>
    <div class="header-stats">
      <div class="hstat"><span class="hstat-val" id="hdr-total-packs">0</span><span class="hstat-lbl">Total Packs</span></div>
      <div class="hstat"><span class="hstat-val" id="hdr-total-ctns">0</span><span class="hstat-lbl">Cartons</span></div>
      <div class="hstat"><span class="hstat-val" id="hdr-items">0</span><span class="hstat-lbl">SKUs</span></div>
    </div>
  </div>
</header>

<div class="controls">
  <div class="search-wrap"><span class="search-icon">🔍</span><input type="text" id="search" placeholder="Search brands, SKUs..." oninput="filterItems()"></div>
  <select id="filter-brand" onchange="filterItems()"><option value="">All Brands</option></select>
  <select id="filter-tier" onchange="filterItems()"><option value="">All Tiers</option><option value="PREMIUM">Premium</option><option value="GENERIC">Generic</option><option value="SUB GENERIC">Sub Generic</option></select>
  
  <input type="text" id="barcode-scan" class="scan-input" placeholder="🔍 Jump to SKU" autocomplete="off">
  <button class="btn btn-camera" id="cameraScanBtn">📷 Scan to Find</button>
  
  <button class="btn btn-red" onclick="toggleAddForm()">+ Add Item</button>
  <button class="btn btn-navy" onclick="printInventory()">🖨 Print</button>
  <button class="btn btn-outline" onclick="resetAll()">Reset Counts</button>
  <span class="date-stamp" id="date-display"></span>
</div>

<!-- Scanner modal for both finding and editing SKU -->
<div id="scannerModal" class="modal">
  <div class="modal-content">
    <span class="close-modal" onclick="closeScanner()">&times;</span>
    <h3 style="margin-bottom: 12px;" id="scannerModalTitle">📸 Scan Barcode</h3>
    <div id="qr-reader" style="width: 100%;"></div>
    <div class="scanner-status" id="scannerStatus">Align barcode with camera</div>
    <button class="btn btn-outline" style="margin-top: 12px;" onclick="closeScanner()">Close</button>
  </div>
</div>

<div class="main">
  <div class="add-form-wrap" id="add-form">
    <div class="add-form-title">Add New Item</div>
    <div class="form-grid">
      <div class="form-field"><label>Brand Group</label><input type="text" id="f-brand" placeholder="e.g. MARLBORO" list="brand-list"><datalist id="brand-list"></datalist></div>
      <div class="form-field"><label>Item Name</label><input type="text" id="f-name" placeholder="e.g. MARLBORO GOLD KS BOX"></div>
      <div class="form-field"><label>SKU / Item #</label><input type="text" id="f-sku" placeholder="e.g. 10383597"></div>
      <div class="form-field"><label>Tier</label><select id="f-tier"><option value="PREMIUM">Premium</option><option value="GENERIC">Generic</option><option value="SUB GENERIC">Sub Generic</option></select></div>
      <div class="form-field"><label>Storage (Cartons)</label><input type="number" id="f-storage" value="0" min="0" step="1"></div>
      <div class="form-field"><label>Shelf (Packs)</label><input type="number" id="f-shelf" value="0" min="0" step="1"></div>
    </div>
    <div class="form-actions"><button class="btn btn-red" onclick="addItem()">Add to Inventory</button><button class="btn btn-outline" onclick="toggleAddForm()">Cancel</button></div>
  </div>

  <div class="summary-bar">
    <div class="sbar-item"><div class="sbar-val" id="sum-total-packs">0</div><div class="sbar-lbl">Total Packs</div></div>
    <div class="sbar-item"><div class="sbar-val" id="sum-total-ctns">0</div><div class="sbar-lbl">Total Cartons</div></div>
    <div class="sbar-item"><div class="sbar-val" id="sum-storage-packs">0</div><div class="sbar-lbl">Storage Packs</div></div>
    <div class="sbar-item"><div class="sbar-val" id="sum-shelf-packs">0</div><div class="sbar-lbl">Shelf Packs</div></div>
    <div class="sbar-item"><div class="sbar-val" id="sum-storage-ctns">0</div><div class="sbar-lbl">Storage Cartons</div></div>
    <div class="sbar-item"><div class="sbar-val" id="sum-shelf-ctns">0</div><div class="sbar-lbl">Shelf Cartons</div></div>
  </div>

  <div class="inventory-scroll" id="inventory-scroll">
    <div id="inventory-container"></div>
  </div>
</div>

<script>
// ========== INVENTORY DATA ==========
// Internal: storage = packs (cartons * 10), shelf = packs directly
let inventory = [
  { id:1,  brand:'AM SPIRIT', name:'AMER SPIRIT BX CELADON',           sku:'10631461', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:2,  brand:'AM SPIRIT', name:'AMER SPIRIT BX KNG BLUE',           sku:'10631454', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:3,  brand:'AM SPIRIT', name:'AMER SPIRIT BX KNG ORANGE',         sku:'10631485', tier:'SUB GENERIC', storage:10, shelf:0 },
  { id:4,  brand:'AM SPIRIT', name:'AMER SPIRIT BX MLW YELLOW',         sku:'10631478', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:5,  brand:'AM SPIRIT', name:'AMER SPIRIT BX US DRKYBLUE',        sku:'10631447', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:6,  brand:'AM SPIRIT', name:'AMER SPIRIT BX PERIO BLCK',         sku:'10631553', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:7,  brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC GOLD',          sku:'10631591', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:8,  brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC GRNDK',         sku:'10631423', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:9,  brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC GRNT',          sku:'10631430', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:10, brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC TURQU',         sku:'10631355', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:11, brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC SKY',           sku:'10631394', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:12, brand:'B&H MERIT', name:'B&H 100 MTH BOX FSC',              sku:'10410387', tier:'PREMIUM', storage:10, shelf:10 },
  { id:13, brand:'B&H MERIT', name:'B&H LUXURY MERIT 100BOXFSC',       sku:'10410165', tier:'PREMIUM', storage:10, shelf:10 },
  { id:14, brand:'B&H MERIT', name:'B&H DLXNTH 100BXFSC',              sku:'10410462', tier:'PREMIUM', storage:10, shelf:10 },
  { id:15, brand:'B&H MERIT', name:'B&H NITH 100BXFSC',                sku:'10410165', tier:'PREMIUM', storage:10, shelf:10 },
  { id:16, brand:'BASIC', name:'BASIC BOX 100 BLUE',                   sku:'10125007', tier:'GENERIC', storage:10, shelf:0 },
  { id:17, brand:'BASIC', name:'BASIC BOX 100 FSC',                    sku:'10125076', tier:'GENERIC', storage:10, shelf:0 },
  { id:18, brand:'CAMEL', name:'CAMEL CRUSH RICH BOX FSC',             sku:'10380802', tier:'PREMIUM', storage:200, shelf:50 },
  { id:19, brand:'CAMEL', name:'CAMEL CRUSH SILVER MEN BX',            sku:'10380789', tier:'PREMIUM', storage:70, shelf:20 },
  { id:20, brand:'CAMEL', name:'CAMEL CRUSH SMOOTH MTH BX',            sku:'10380758', tier:'PREMIUM', storage:10, shelf:10 },
  { id:21, brand:'CAMEL', name:'CAMEL CRUSH SMOOTH SIL BX',            sku:'10380765', tier:'PREMIUM', storage:10, shelf:0 },
  { id:22, brand:'CAMEL', name:'CAMEL FILTER HARD PK FSC',             sku:'10380779', tier:'PREMIUM', storage:10, shelf:10 },
  { id:23, brand:'CAMEL', name:'CAMEL GOLD BOX K',                     sku:'10382028', tier:'PREMIUM', storage:10, shelf:10 },
  { id:24, brand:'CAMEL', name:'CAMEL JADE MTH K BOX',                 sku:'10382059', tier:'PREMIUM', storage:10, shelf:10 },
  { id:25, brand:'CAMEL', name:'CAMEL JADE SILVER BOX K',              sku:'10382011', tier:'PREMIUM', storage:10, shelf:10 },
  { id:26, brand:'CAMEL', name:'CAMEL ROYAL BOX K',                    sku:'10382042', tier:'PREMIUM', storage:20, shelf:10 },
  { id:27, brand:'CAMEL', name:'CAMEL 99 BLUE BOX',                    sku:'10382035', tier:'PREMIUM', storage:10, shelf:10 },
  { id:28, brand:'CAMEL', name:'CAMEL 99 FILTER BOX K',                sku:'10382011', tier:'PREMIUM', storage:10, shelf:10 },
  { id:29, brand:'CAMEL', name:'CAMEL BLUE LT KING SZ FSC',            sku:'10380604', tier:'PREMIUM', storage:10, shelf:10 },
  { id:30, brand:'CAMEL', name:'CAMEL CLASSIC GOLD 99 BOX',            sku:'10380628', tier:'PREMIUM', storage:10, shelf:10 },
  { id:31, brand:'CAMEL', name:'CAMEL CLASSIC GOLD KS BOX',            sku:'10380611', tier:'PREMIUM', storage:10, shelf:10 },
  { id:32, brand:'CAMEL', name:'CAMEL CRUSH BOX FSC',                  sku:'10380796', tier:'PREMIUM', storage:10, shelf:10 },
  { id:33, brand:'CAMEL', name:'CAMEL CRUSH REG MENTH BOX',            sku:'10383772', tier:'PREMIUM', storage:10, shelf:10 },
  { id:34, brand:'CAMEL', name:'CAMEL NO.9 KING FSC',                  sku:'10380468', tier:'PREMIUM', storage:10, shelf:10 },
  { id:35, brand:'CAMEL', name:'CAMEL PLATINUM BOX KS FSC',            sku:'10380437', tier:'PREMIUM', storage:10, shelf:10 },
  { id:36, brand:'CAMEL', name:'CAMEL SILVER BX FSC',                  sku:'10380536', tier:'PREMIUM', storage:10, shelf:10 },
  { id:37, brand:'CAMEL', name:'CAMEL SILVER RYL BX FSC',              sku:'10380793', tier:'PREMIUM', storage:10, shelf:10 },
  { id:38, brand:'CAMEL', name:'CAMEL TURK SILVER BX FSC',             sku:'10380451', tier:'PREMIUM', storage:10, shelf:10 },
  { id:39, brand:'CAMEL', name:'CAMEL TURK SILVER BX FSC (Turkish)',   sku:'10380499', tier:'PREMIUM', storage:10, shelf:10 },
  { id:40, brand:'CAMEL', name:'CAMEL WIDE LT BX FSC',                 sku:'10380581', tier:'PREMIUM', storage:10, shelf:10 },
  { id:41, brand:'CAMEL', name:'CAMEL WIDE BLUE LT BX FSC',            sku:'10380590', tier:'PREMIUM', storage:10, shelf:10 },
  { id:42, brand:'CAMEL', name:'CAMEL WIDE FTL KS BX FSC',             sku:'10380550', tier:'PREMIUM', storage:10, shelf:10 },
  { id:43, brand:'CAMEL', name:'CAMEL WIDE MENTH BL BX FSC',           sku:'10380543', tier:'PREMIUM', storage:10, shelf:0 },
  { id:44, brand:'CAMEL', name:'CAMEL REGULAR NON FILTER',             sku:'10380500', tier:'PREMIUM', storage:10, shelf:0 },
  { id:45, brand:'CAPRI/CARLTON', name:'CAPRI IMAGE 120 FSC',          sku:'10411001', tier:'PREMIUM', storage:10, shelf:10 },
  { id:46, brand:'CAPRI/CARLTON', name:'CAPRI WIDE BX 100 LT FSC',     sku:'10250501', tier:'PREMIUM', storage:10, shelf:10 },
  { id:47, brand:'CAPRI/CARLTON', name:'CAPRI MEN INDIGO 100 FSC',     sku:'10552063', tier:'PREMIUM', storage:10, shelf:10 },
  { id:48, brand:'CAPRI/CARLTON', name:'CAPRI MEN FF BOX 100 FSC',     sku:'25981', tier:'PREMIUM', storage:10, shelf:10 },
  { id:49, brand:'CAPRI/CARLTON', name:'CAPRI VIOLET 100 ULT FSC',     sku:'10552117', tier:'PREMIUM', storage:10, shelf:10 },
  { id:50, brand:'CAPRI/CARLTON', name:'CARLTON MENT BOX 100 FSC',     sku:'10411254', tier:'PREMIUM', storage:10, shelf:10 },
  { id:51, brand:'CAPRI/CARLTON', name:'CARLTON MEN BOX 100 FSC',      sku:'10411063', tier:'PREMIUM', storage:10, shelf:10 },
  { id:52, brand:'CAPRI/CARLTON', name:'CARLTON MEN MENTH 120 FSC',    sku:'10411278', tier:'PREMIUM', storage:10, shelf:10 },
  { id:53, brand:'DORAL', name:'DORAL MEN GOLD LT BX 100FSC',         sku:'10120781', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:54, brand:'DORAL', name:'DORAL MEN GOLD LT BX 100FSC (2)',     sku:'10125878', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:55, brand:'DORAL', name:'DORAL SILVER UL BX KS FSC',           sku:'10120798', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:56, brand:'DORAL', name:'DORAL RED FF BX 100 FSC',             sku:'10120781', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:57, brand:'DORAL', name:'DORAL MEN GOLD LT BOX 100FSC',        sku:'20774', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:58, brand:'DORAL', name:'DORAL GOLD LT BOX KS FSC',            sku:'20120866', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:59, brand:'DORAL', name:'DORAL GOLD LT BX 100 FSC',            sku:'20125885', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:60, brand:'DORAL', name:'ORAL MEN FF BOX KS FSC',              sku:'20774', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:61, brand:'DORAL', name:'ORAL MEN GOLD LT BX 100 FSC',         sku:'20757', tier:'SUB GENERIC', storage:10, shelf:10 },
  { id:62, brand:'KOOL', name:'KOOL KING BOX',                        sku:'10358832', tier:'PREMIUM', storage:80, shelf:90 },
  { id:63, brand:'KOOL', name:'KOOL BOX BLUE',                        sku:'10358849', tier:'PREMIUM', storage:60, shelf:60 },
  { id:64, brand:'KOOL', name:'KOOL KING SP',                         sku:'10387856', tier:'PREMIUM', storage:20, shelf:30 },
  { id:65, brand:'KOOL', name:'KOOL 100 BOX',                         sku:'10387849', tier:'PREMIUM', storage:20, shelf:30 },
  { id:66, brand:'KOOL', name:'KOOL 100 BOX BLUE',                    sku:'10418437', tier:'PREMIUM', storage:60, shelf:30 },
  { id:67, brand:'KOOL', name:'KOOL BLACK BLK/WIN SEL SUB',           sku:'10418444', tier:'PREMIUM', storage:20, shelf:10 },
  { id:68, brand:'KOOL', name:'KOOL BLACK BOX 100',                   sku:'10418581', tier:'PREMIUM', storage:10, shelf:0 },
  { id:69, brand:'KOOL', name:'KOOL BLACK KINGS BOX',                 sku:'10418165', tier:'PREMIUM', storage:10, shelf:0 },
  { id:70, brand:'L&M', name:'L&M BLUE KING 100S BOX FSC',            sku:'10125569', tier:'PREMIUM', storage:10, shelf:0 },
  { id:71, brand:'L&M', name:'L&M BOLD KING BOX FSC',                 sku:'10120552', tier:'PREMIUM', storage:10, shelf:10 },
  { id:72, brand:'L&M', name:'L&M BOLD KING BOX (2)',                  sku:'10120613', tier:'PREMIUM', storage:10, shelf:10 },
  { id:73, brand:'L&M', name:'L&M FF KINGS BOX FSC',                  sku:'10120576', tier:'PREMIUM', storage:10, shelf:10 },
  { id:74, brand:'L&M', name:'L&M MENTHOL 100S BOX FSC',              sku:'10125250', tier:'PREMIUM', storage:10, shelf:10 },
  { id:75, brand:'L&M', name:'L&M MENTHOL KING BOX FSC',              sku:'10125274', tier:'PREMIUM', storage:10, shelf:10 },
  { id:76, brand:'LUCKY STRIKE', name:'LUCKY STRIKE ACTIVATE GRN',    sku:'10388556', tier:'GENERIC', storage:70, shelf:10 },
  { id:77, brand:'LUCKY STRIKE', name:'LUCKY STRIKE ACTIVATE BLU',    sku:'10125274', tier:'GENERIC', storage:50, shelf:20 },
  { id:78, brand:'LUCKY STRIKE', name:'LUCKY STRIKE GOLD 100 BOX',    sku:'10388518', tier:'GENERIC', storage:30, shelf:40 },
  { id:79, brand:'LUCKY STRIKE', name:'LUCKY STRIKE GOLD BOX',        sku:'10388526', tier:'GENERIC', storage:30, shelf:20 },
  { id:80, brand:'LUCKY STRIKE', name:'LUCKY STRIKE MEN SLY BOX',     sku:'10388532', tier:'GENERIC', storage:10, shelf:10 },
  { id:81, brand:'LUCKY STRIKE', name:'LUCKY STRIKE MEN 100S BOX',    sku:'10418833', tier:'GENERIC', storage:10, shelf:20 },
  { id:82, brand:'LUCKY STRIKE', name:'LUCKY STRIKE MENTHOL BOX',     sku:'10388625', tier:'GENERIC', storage:10, shelf:10 },
  { id:83, brand:'LUCKY STRIKE', name:'LUCKY STRIKE RED BOX',         sku:'10388501', tier:'GENERIC', storage:40, shelf:20 },
  { id:84, brand:'MARLBORO', name:'MARLBORO MEN GOLD KSBXFSC',        sku:'10383438', tier:'PREMIUM', storage:30, shelf:30 },
  { id:85, brand:'MARLBORO', name:'MARLBORO MEN SILV KSBXFSC',        sku:'10383784', tier:'PREMIUM', storage:10, shelf:10 },
  { id:86, brand:'MARLBORO', name:'MARLBORO MEN GOLD 100 BX',         sku:'10413807', tier:'PREMIUM', storage:30, shelf:40 },
  { id:87, brand:'MARLBORO', name:'MARLBORO MEN SMOOTH BX',           sku:'10383636', tier:'PREMIUM', storage:10, shelf:20 },
  { id:88, brand:'MARLBORO', name:'MARLBORO MEN SMOOTH 100BX',        sku:'10413821', tier:'PREMIUM', storage:10, shelf:30 },
  { id:89, brand:'MARLBORO', name:'MARLBORO MEN MENTH ICE BX',        sku:'10383445', tier:'PREMIUM', storage:20, shelf:40 },
  { id:90, brand:'MARLBORO', name:'MARLBORO MEN MENTH ICE BOX',       sku:'10383445', tier:'PREMIUM', storage:30, shelf:10 },
  { id:91, brand:'MARLBORO', name:'MARLBORO MEN 100 BX KS FSC',       sku:'10413821', tier:'PREMIUM', storage:10, shelf:10 },
  { id:92, brand:'MARLBORO', name:'MARLBORO MEN ICE BOX',             sku:'10383599', tier:'PREMIUM', storage:40, shelf:50 },
  { id:93, brand:'MARLBORO', name:'MARLBORO 72S BLACK MTH BXFSC',     sku:'10383780', tier:'PREMIUM', storage:30, shelf:10 },
  { id:94, brand:'MARLBORO', name:'MARLBORO 72S GREEN BXFSC',         sku:'10383742', tier:'PREMIUM', storage:20, shelf:0 },
  { id:95, brand:'MARLBORO', name:'MARLBORO BOX FF 100 FSC',          sku:'10419708', tier:'PREMIUM', storage:20, shelf:30 },
  { id:96, brand:'MARLBORO', name:'MARLBORO GOLD KING BOX FSC',       sku:'10383597', tier:'PREMIUM', storage:20, shelf:30 },
  { id:97, brand:'MARLBORO', name:'MARLBORO GOLD 100S BOX FSC',       sku:'10383537', tier:'PREMIUM', storage:10, shelf:50 },
  { id:98, brand:'MARLBORO', name:'MARLBORO RED LABEL 100S BOXFSC',   sku:'10383414', tier:'PREMIUM', storage:40, shelf:20 },
  { id:99, brand:'MARLBORO', name:'MARLBORO RED LABEL BX FSC',        sku:'10413777', tier:'PREMIUM', storage:10, shelf:30 },
  { id:100,brand:'MARLBORO', name:'MARLBORO SILVER SPBLND REDBOXFSC', sku:'10383667', tier:'PREMIUM', storage:10, shelf:20 },
  { id:101,brand:'MARLBORO', name:'MARLBORO SILVER SPBLND GOLDBOXFSC',sku:'10383643', tier:'PREMIUM', storage:20, shelf:80 },
  { id:102,brand:'MARLBORO', name:'MARLBORO SILVER SPBLND D100FSC',   sku:'10383628', tier:'PREMIUM', storage:40, shelf:30 },
  { id:103,brand:'MARLBORO', name:'MARLBORO SILVER SPBLND REDBXFSC',  sku:'10383852', tier:'PREMIUM', storage:40, shelf:50 },
  { id:104,brand:'MARLBORO', name:'MARLBORO SILVER BX KS FSC',        sku:'10383483', tier:'PREMIUM', storage:30, shelf:70 },
  { id:105,brand:'MARLBORO', name:'MARLBORO SILVER 100 BX FSC',       sku:'10383414', tier:'PREMIUM', storage:10, shelf:50 },
  { id:106,brand:'MARLBORO', name:'MARLBORO SOUTHERN CUT BOX',        sku:'10383483', tier:'PREMIUM', storage:10, shelf:30 },
  { id:107,brand:'MARLBORO', name:'MARLBORO BLK GOLD 100 BX',         sku:'10413883', tier:'PREMIUM', storage:10, shelf:40 },
  { id:108,brand:'MARLBORO', name:'MARLBORO BLK GOLD BOX',            sku:'10383704', tier:'PREMIUM', storage:10, shelf:10 },
  { id:109,brand:'MARLBORO', name:'MARLBORO BLACK SP BL BOX',         sku:'10383674', tier:'PREMIUM', storage:30, shelf:30 },
  { id:110,brand:'MARLBORO', name:'MARLBORO BLACK SP BL 100B',        sku:'10383681', tier:'PREMIUM', storage:20, shelf:30 },
  { id:111,brand:'MARLBORO', name:'MARLBORO BLACK MEN SP BLD',        sku:'10383636', tier:'PREMIUM', storage:40, shelf:40 },
  { id:112,brand:'MARLBORO', name:'MARLBORO BLACK LOW PREMIUM',       sku:'10383711', tier:'PREMIUM', storage:50, shelf:20 },
  { id:113,brand:'MARLBORO', name:'MARLBORO 72S SILVE BXFSC',         sku:'10383629', tier:'PREMIUM', storage:0, shelf:20 },
  { id:114,brand:'MARLBORO', name:'MARLBORO 83S BOX',                 sku:'10383681', tier:'PREMIUM', storage:0, shelf:20 },
  { id:115,brand:'MARLBORO', name:'MARLBORO MEN BLUE 100 KSBXFSC',    sku:'10383612', tier:'PREMIUM', storage:10, shelf:10 },
  { id:116,brand:'MARLBORO', name:'MARLBORO MEN BLUE 100BX ICE KB',   sku:'10413845', tier:'PREMIUM', storage:10, shelf:10 },
  { id:117,brand:'MARLBORO', name:'MARLBORO MEN GRN BX 120 FSC',      sku:'10383604', tier:'PREMIUM', storage:10, shelf:10 },
  { id:118,brand:'MARLBORO', name:'MARLBORO 72S RED BOX SPBLND',       sku:'10383612', tier:'PREMIUM', storage:10, shelf:10 },
  { id:119,brand:'MAVERICK', name:'MAVERICK GOLD 100 BOX',            sku:'10387924', tier:'GENERIC', storage:20, shelf:10 },
  { id:120,brand:'MAVERICK', name:'MAVERICK GOLD KING BOX',           sku:'10418529', tier:'GENERIC', storage:10, shelf:0 },
  { id:121,brand:'MAVERICK', name:'MAVERICK MENTHOL KING BOX',        sku:'10418505', tier:'GENERIC', storage:10, shelf:0 },
  { id:122,brand:'MAVERICK', name:'MAVERICK MENTHOL 100 BOX',         sku:'10387931', tier:'GENERIC', storage:10, shelf:0 },
  { id:123,brand:'MAVERICK', name:'MAVERICK RED K BOX',               sku:'10418390', tier:'GENERIC', storage:20, shelf:20 },
  { id:124,brand:'MAVERICK', name:'MAVERICK SILVER 100 BOX',          sku:'10418499', tier:'GENERIC', storage:10, shelf:0 },
  { id:125,brand:'MAVERICK', name:'MAVERICK SILVER RED 100 BOX',      sku:'10418499', tier:'GENERIC', storage:10, shelf:10 },
  { id:126,brand:'MISTY', name:'MISTY BLUE BOX 120 LT FSC',           sku:'10129760', tier:'GENERIC', storage:10, shelf:0 },
  { id:127,brand:'MISTY', name:'MISTY BLUE 100 LIGHTS FSC',           sku:'10126431', tier:'GENERIC', storage:10, shelf:0 },
  { id:128,brand:'MISTY', name:'MISTY MEN GRN BX 100 FSC',            sku:'10129784', tier:'GENERIC', storage:10, shelf:0 },
  { id:129,brand:'MISTY', name:'MISTY MEN SMOOTH 100 BOX',            sku:'10126448', tier:'GENERIC', storage:10, shelf:0 },
  { id:130,brand:'MONTCLAIR', name:'MONTCLAIR BLUE 100 BOX',          sku:'10126521', tier:'SUB GENERIC', storage:20, shelf:20 },
  { id:131,brand:'NEWPORT', name:'NEWPORT BOX 100S FSC',              sku:'10383933', tier:'PREMIUM', storage:20, shelf:50 },
  { id:132,brand:'NEWPORT', name:'NEWPORT KINGS BOX FSC',             sku:'10383957', tier:'PREMIUM', storage:10, shelf:30 },
  { id:133,brand:'NEWPORT', name:'NEWPORT KINGS SOFT FSC',            sku:'10383957', tier:'PREMIUM', storage:10, shelf:40 },
  { id:134,brand:'NEWPORT', name:'NEWPORT MEN GOLD 100 SOFT',         sku:'10414163', tier:'PREMIUM', storage:10, shelf:0 },
  { id:135,brand:'NEWPORT', name:'NEWPORT 100S SOFTPACK FSC',         sku:'10383902', tier:'PREMIUM', storage:10, shelf:0 },
  { id:136,brand:'NEWPORT', name:'NEWPORT PLATINUM BLU 100BX',        sku:'10414224', tier:'PREMIUM', storage:10, shelf:0 },
  { id:137,brand:'NEWPORT', name:'NEWPORT SMOOTH 100',                sku:'10414156', tier:'PREMIUM', storage:20, shelf:0 },
  { id:138,brand:'NEWPORT', name:'NEWPORT MEN GOLD BOX FSC',          sku:'10383940', tier:'PREMIUM', storage:10, shelf:10 },
  { id:139,brand:'NEWPORT', name:'NEWPORT MEN BLUE BOX FSC',          sku:'10414170', tier:'PREMIUM', storage:10, shelf:10 },
  { id:140,brand:'NEWPORT', name:'NEWPORT MEN GOLD BOXFSC',           sku:'10383964', tier:'PREMIUM', storage:60, shelf:10 },
  { id:141,brand:'NEWPORT', name:'NEWPORT MEN GOLD BLUE BOX',         sku:'10414194', tier:'PREMIUM', storage:60, shelf:10 },
  { id:142,brand:'NEWPORT', name:'NEWPORT MEN MENTH BLU BOX',         sku:'10383971', tier:'PREMIUM', storage:10, shelf:10 },
  { id:143,brand:'NEWPORT', name:'NEWPORT NONMENTHL GL BX',           sku:'10414231', tier:'PREMIUM', storage:20, shelf:20 },
  { id:144,brand:'NEWPORT', name:'NEWPORT NONMENTHL KSBXFSC',         sku:'10414217', tier:'PREMIUM', storage:10, shelf:10 },
  { id:145,brand:'NEWPORT', name:'NEWPORT NONMENTH 100BPFSC',         sku:'10383988', tier:'PREMIUM', storage:10, shelf:10 },
  { id:146,brand:'NEWPORT', name:'NEWPORT NONMENTH GL DX BX',         sku:'10383995', tier:'PREMIUM', storage:10, shelf:10 },
  { id:147,brand:'PALL MALL', name:'PALL MEN 100 BOX-FSC',            sku:'10384459', tier:'GENERIC', storage:10, shelf:20 },
  { id:148,brand:'PALL MALL', name:'PALL MALL ORG KS BOX FSC',        sku:'10384510', tier:'GENERIC', storage:10, shelf:20 },
  { id:149,brand:'PALL MALL', name:'PALL MALL ORG 100 BX FSC',        sku:'10410387', tier:'GENERIC', storage:10, shelf:20 },
  { id:150,brand:'PALL MALL', name:'PALL MALL RED 100 BX FFSC',       sku:'10414552', tier:'GENERIC', storage:10, shelf:20 },
  { id:151,brand:'PALL MALL', name:'PALL MALL RED KS BOX FSC',        sku:'10414576', tier:'GENERIC', storage:10, shelf:10 },
  { id:152,brand:'PALL MALL', name:'PALL MALL WHITE MEN 100BX',       sku:'10384497', tier:'GENERIC', storage:10, shelf:0 },
  { id:153,brand:'PALL MALL', name:'PALL MALL WHITE MENTH BOX',       sku:'10414540', tier:'GENERIC', storage:10, shelf:0 },
  { id:154,brand:'PALL MALL', name:'PALL MALL SELECT BX BLUE',        sku:'10677025', tier:'GENERIC', storage:30, shelf:50 },
  { id:155,brand:'PALL MALL', name:'PALL MALL SELECT BX GREX',        sku:'10677018', tier:'GENERIC', storage:40, shelf:40 },
  { id:156,brand:'PALL MALL', name:'PALL MALL SELECT BX RED',         sku:'10677032', tier:'GENERIC', storage:20, shelf:30 },
  { id:157,brand:'PALL MALL', name:'PALL MALL SELECT 100 GREEN',      sku:'10677674', tier:'GENERIC', storage:30, shelf:50 },
  { id:158,brand:'PALL MALL', name:'PALL MALL SELECT 100 BLUE',       sku:'10677698', tier:'GENERIC', storage:20, shelf:10 },
  { id:159,brand:'PALL MALL', name:'PALL MALL SELECT 100 RED',        sku:'10677698', tier:'GENERIC', storage:20, shelf:30 },
  { id:160,brand:'PALL MALL', name:'PALL MALL BLACK MEN 100BX',       sku:'10384473', tier:'GENERIC', storage:10, shelf:10 },
  { id:161,brand:'PALL MALL', name:'PALL MALL BLACK MENTH BOX',       sku:'10414583', tier:'GENERIC', storage:10, shelf:10 },
  { id:162,brand:'PALL MALL', name:'PALL MALL BLACK MEN 100BX (2)',   sku:'10384450', tier:'GENERIC', storage:10, shelf:10 },
  { id:163,brand:'PARLIAMENT', name:'PARLIAMENT WHITE 100 BOX',       sku:'10414699', tier:'PREMIUM', storage:10, shelf:0 },
  { id:164,brand:'PARLIAMENT', name:'PARLIAMENT BLUE KS BXFSC',       sku:'10384572', tier:'PREMIUM', storage:10, shelf:0 },
  { id:165,brand:'PYRAMID', name:'PYRAMID NOFILTER BX KS FSC',        sku:'10128950', tier:'GENERIC', storage:10, shelf:0 },
  { id:166,brand:'SALEM', name:'SALEM GOLD KING BOX',                 sku:'10387894', tier:'PREMIUM', storage:10, shelf:10 },
  { id:167,brand:'SALEM', name:'SALEM GOLD 100 BOX',                  sku:'10387894', tier:'PREMIUM', storage:10, shelf:10 },
  { id:168,brand:'SALEM', name:'SALEM SILVER KING BOX',               sku:'10387900', tier:'PREMIUM', storage:10, shelf:10 },
  { id:169,brand:'SALEM', name:'SALEM SLIM 100 BOX',                  sku:'10418451', tier:'PREMIUM', storage:10, shelf:0 },
  { id:170,brand:'SALEM', name:'SALEM 100 BOX',                       sku:'10418451', tier:'PREMIUM', storage:10, shelf:0 },
  { id:171,brand:'SALEM', name:'CIGS-VIR SLMI/PRLAMNT/NS PREM',       sku:'10384572', tier:'PREMIUM', storage:10, shelf:0 },
  { id:172,brand:'VA SLIM', name:'VA SLIM EF 100 BOX FSC',            sku:'10414699', tier:'PREMIUM', storage:10, shelf:0 },
  { id:173,brand:'VA SLIM', name:'VA SLIM GOLD 100 BOX FSC',          sku:'10417188', tier:'PREMIUM', storage:10, shelf:0 },
  { id:174,brand:'VA SLIM', name:'VA SLIM GOLD 120 BOX FSC',          sku:'10417218', tier:'PREMIUM', storage:10, shelf:0 },
  { id:175,brand:'VA SLIM', name:'VA SLIM MEN SILVE 100BXFSC',        sku:'10559390', tier:'PREMIUM', storage:10, shelf:0 },
  { id:176,brand:'VA SLIM', name:'VA SLIM MEN SILVER 120BXFSC',       sku:'10417201', tier:'PREMIUM', storage:10, shelf:10 },
  { id:177,brand:'VA SLIM', name:'VA SLIM MENSIL VE 120BXFSC',        sku:'10559383', tier:'PREMIUM', storage:10, shelf:0 },
  { id:178,brand:'VA SLIM', name:'VA SLIM MENTHOL 100 BXFSC',         sku:'10559383', tier:'PREMIUM', storage:10, shelf:0 },
  { id:179,brand:'VA SLIM', name:'VA SLIM SPERSIM PP 100FSC',         sku:'10417764', tier:'PREMIUM', storage:10, shelf:10 },
  { id:180,brand:'VA SLIM', name:'VA SLIM SILVER 120 BX FSC',         sku:'10417225', tier:'PREMIUM', storage:10, shelf:10 },
  { id:181,brand:'WINSTON', name:'WINSTON SELECT KING GLD',            sku:'10397728', tier:'PREMIUM', storage:30, shelf:20 },
  { id:182,brand:'WINSTON', name:'WINSTON SELECT KING RED',            sku:'10418345', tier:'PREMIUM', storage:20, shelf:10 },
  { id:183,brand:'WINSTON', name:'WINSTON SELECT 100 RED',             sku:'10418338', tier:'PREMIUM', storage:10, shelf:20 },
  { id:184,brand:'WINSTON', name:'WINSTON SELECT KING GLD (2)',        sku:'10398719', tier:'PREMIUM', storage:20, shelf:0 },
  { id:185,brand:'WINSTON', name:'WINSTON BOX KING BLACK',             sku:'10388764', tier:'PREMIUM', storage:20, shelf:10 },
  { id:186,brand:'WINSTON', name:'WINSTON BOX KING GOLD',              sku:'10388771', tier:'PREMIUM', storage:20, shelf:10 },
  { id:187,brand:'WINSTON', name:'WINSTON BOX KING MTH GREEN',         sku:'10388740', tier:'PREMIUM', storage:10, shelf:0 },
  { id:188,brand:'WINSTON', name:'WINSTON BOX KING WHITE',             sku:'10388733', tier:'PREMIUM', storage:10, shelf:0 },
  { id:189,brand:'WINSTON', name:'WINSTON BOX KING RED',               sku:'10388757', tier:'PREMIUM', storage:10, shelf:0 },
  { id:190,brand:'WINSTON', name:'WINSTON BOX 100 BLACK',              sku:'10418352', tier:'PREMIUM', storage:10, shelf:10 },
  { id:191,brand:'WINSTON', name:'WINSTON BOX 100 GOLD',               sku:'10418543', tier:'PREMIUM', storage:10, shelf:20 },
  { id:192,brand:'WINSTON', name:'WINSTON BOX 100 RED',                sku:'10418536', tier:'PREMIUM', storage:20, shelf:20 },
  { id:193,brand:'RYO/PAPERS', name:'CIG RYO ROCKT POHORGL',          sku:'12201969', tier:'PREMIUM', storage:20, shelf:10 },
  { id:194,brand:'RYO/PAPERS', name:'EZ WIDER DOUBLE WIDE',           sku:'12331802', tier:'PREMIUM', storage:10, shelf:10 },
];
let nextId = 200;

// Helper functions
function totalPacks(item) { return (item.storage || 0) + (item.shelf || 0); }
function packsToCartons(packs) { return (packs / 10).toFixed(1); }
function tierClass(t) {
  if (t === 'PREMIUM') return 'tier-premium';
  if (t === 'GENERIC') return 'tier-generic';
  return 'tier-sub';
}

// Render inventory with edit SKU button
function renderInventory() {
  const search = document.getElementById('search').value.toLowerCase();
  const brandFilter = document.getElementById('filter-brand').value;
  const tierFilter = document.getElementById('filter-tier').value;
  let items = inventory.filter(item => {
    if (brandFilter && item.brand !== brandFilter) return false;
    if (tierFilter && item.tier !== tierFilter) return false;
    if (search && !item.name.toLowerCase().includes(search) && !item.sku.includes(search) && !item.brand.toLowerCase().includes(search)) return false;
    return true;
  });
  const groups = {};
  items.forEach(item => { if (!groups[item.brand]) groups[item.brand] = []; groups[item.brand].push(item); });
  const container = document.getElementById('inventory-container');
  if (Object.keys(groups).length === 0) { container.innerHTML = '<div style="text-align:center;padding:40px;color:#888;">No items found.</div>'; return; }
  container.innerHTML = Object.keys(groups).sort().map(brand => {
    const brandItems = groups[brand];
    const totalPacksSum = brandItems.reduce((s, i) => s + totalPacks(i), 0);
    const storagePacksSum = brandItems.reduce((s, i) => s + (i.storage || 0), 0);
    const shelfPacksSum = brandItems.reduce((s, i) => s + (i.shelf || 0), 0);
    const rows = brandItems.map(item => {
      const storageCartons = (item.storage / 10).toFixed(1);
      return `
        <tr data-sku="${item.sku}" data-itemid="${item.id}">
          <td>
            <span class="item-name">${escapeHtml(item.name)}</span>
            <div><span class="item-sku">${escapeHtml(item.sku)}</span>
            <button class="edit-sku-btn" onclick="editSku(${item.id})" title="Edit SKU by scanner">✏️</button></div>
           </td>
          <td><span class="tier-badge ${tierClass(item.tier)}">${item.tier}</span></td>
          <td class="count-cell"><div class="count-group"><div class="count-row"><span class="count-lbl">Ctns</span><input type="number" class="storage-input" min="0" step="1" value="${storageCartons}" onchange="updateStorageCartons(${item.id}, this.value)" style="border-color:#1e4080;"></div><div class="count-row" style="font-size:9px;">= ${item.storage} packs</div></div></td>
          <td class="count-cell"><div class="count-group"><div class="count-row"><span class="count-lbl">Packs</span><input type="number" class="shelf-input" min="0" step="1" value="${item.shelf}" onchange="updateShelfPacks(${item.id}, this.value)" style="border-color:#c0392b;"></div><div class="count-row" style="font-size:9px;">= ${packsToCartons(item.shelf)} ctns</div></div></td>
          <td class="total-cell"><div class="total-packs">${totalPacks(item)} packs</div><div class="total-ctns">${packsToCartons(totalPacks(item))} ctns</div><div class="total-breakdown">📦 ${storageCartons} ctn + 🏪 ${item.shelf} pk</div></td>
          <td><button onclick="removeItem(${item.id})" style="background:none;border:none;cursor:pointer;color:#c0392b;font-size:16px;">✕</button></td>
        </td>
      `;
    }).join('');
    return `<div class="brand-section" data-brand="${brand}"><div class="brand-header" onclick="toggleBrand(this)"><span class="brand-name">${brand}</span><div class="brand-meta"><div class="brand-totals"><span class="btag">${brandItems.length} SKUs</span><span class="btag">📦 ${packsToCartons(storagePacksSum)} ctns / ${storagePacksSum} pk</span><span class="btag red">🏪 ${packsToCartons(shelfPacksSum)} ctns / ${shelfPacksSum} pk</span><span class="btag">TOTAL: ${packsToCartons(totalPacksSum)} ctns / ${totalPacksSum} pk</span></div><span class="chevron">▾</span></div></div><table class="items-table"><thead><tr><th>Product</th><th>Tier</th><th class="num">📦 STORAGE (cartons)</th><th class="num">🏪 SHELF (packs)</th><th class="num">TOTAL</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join('');
}

function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

function updateStorageCartons(id, cartonVal) {
  const item = inventory.find(i => i.id === id);
  if (item) {
    const cartons = parseInt(cartonVal) || 0;
    item.storage = cartons * 10;
    updateSummary();
    renderInventory();
  }
}

function updateShelfPacks(id, packVal) {
  const item = inventory.find(i => i.id === id);
  if (item) {
    item.shelf = parseInt(packVal) || 0;
    updateSummary();
    renderInventory();
  }
}

function updateSummary() {
  const totalPacksSum = inventory.reduce((s, i) => s + totalPacks(i), 0);
  const storagePacks = inventory.reduce((s, i) => s + (i.storage || 0), 0);
  const shelfPacks = inventory.reduce((s, i) => s + (i.shelf || 0), 0);
  document.getElementById('sum-total-packs').textContent = totalPacksSum;
  document.getElementById('sum-total-ctns').textContent = (totalPacksSum/10).toFixed(1);
  document.getElementById('sum-storage-packs').textContent = storagePacks;
  document.getElementById('sum-shelf-packs').textContent = shelfPacks;
  document.getElementById('sum-storage-ctns').textContent = (storagePacks/10).toFixed(1);
  document.getElementById('sum-shelf-ctns').textContent = (shelfPacks/10).toFixed(1);
  document.getElementById('hdr-total-packs').textContent = totalPacksSum;
  document.getElementById('hdr-total-ctns').textContent = (totalPacksSum/10).toFixed(1);
  document.getElementById('hdr-items').textContent = inventory.length;
}

function addItem() {
  const brand = document.getElementById('f-brand').value.trim().toUpperCase();
  const name = document.getElementById('f-name').value.trim().toUpperCase();
  const sku = document.getElementById('f-sku').value.trim();
  const tier = document.getElementById('f-tier').value;
  const storageCartons = parseInt(document.getElementById('f-storage').value) || 0;
  const shelfPacks = parseInt(document.getElementById('f-shelf').value) || 0;
  if (!brand || !name) { alert('Brand and Item Name are required.'); return; }
  inventory.push({ id: nextId++, brand, name, sku, tier, storage: storageCartons * 10, shelf: shelfPacks });
  document.getElementById('f-brand').value = ''; document.getElementById('f-name').value = ''; document.getElementById('f-sku').value = '';
  document.getElementById('f-storage').value = '0'; document.getElementById('f-shelf').value = '0';
  toggleAddForm(); render();
}

function removeItem(id) { if (confirm('Remove this item?')) { inventory = inventory.filter(i => i.id !== id); render(); } }
function filterItems() { renderInventory(); }
function resetAll() { if (confirm('Reset ALL counts to zero?')) { inventory.forEach(i => { i.storage = 0; i.shelf = 0; }); render(); } }
function printInventory() { window.print(); }
function toggleAddForm() { document.getElementById('add-form').classList.toggle('open'); }
function toggleBrand(header) { header.closest('.brand-section').classList.toggle('collapsed'); }

// --- SKU editing via scanner ---
let pendingEditItemId = null;
function editSku(itemId) {
  pendingEditItemId = itemId;
  document.getElementById('scannerModalTitle').innerText = '📸 Scan NEW Barcode for this item';
  openScannerForEdit();
}

function openScannerForEdit() {
  const modal = document.getElementById('scannerModal');
  modal.style.display = 'flex';
  const readerElement = document.getElementById('qr-reader');
  readerElement.innerHTML = '';
  if (html5QrCode) try { html5QrCode.stop(); } catch(e) {}
  html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 150 } }, (decodedText) => {
    if (pendingEditItemId !== null) {
      const item = inventory.find(i => i.id === pendingEditItemId);
      if (item) {
        // optional: check duplicate SKU?
        item.sku = decodedText;
        renderInventory();
        alert(`SKU updated to ${decodedText}`);
      }
      pendingEditItemId = null;
    }
    closeScanner();
  }, (errorMessage) => {});
}

// Global scanner for "Scan to Find" (jump to item)
let html5QrCode;
function openScannerToFind() {
  pendingEditItemId = null;
  document.getElementById('scannerModalTitle').innerText = '📸 Scan Barcode to Find Item';
  const modal = document.getElementById('scannerModal');
  modal.style.display = 'flex';
  const readerElement = document.getElementById('qr-reader');
  readerElement.innerHTML = '';
  if (html5QrCode) try { html5QrCode.stop(); } catch(e) {}
  html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 150 } }, (decodedText) => {
    jumpToSku(decodedText);
    closeScanner();
  }, (errorMessage) => {});
}

function closeScanner() {
  if (html5QrCode && html5QrCode.isScanning) html5QrCode.stop().then(() => { document.getElementById('scannerModal').style.display = 'none'; }).catch(()=>{});
  else document.getElementById('scannerModal').style.display = 'none';
  pendingEditItemId = null;
}

function jumpToSku(scannedSku) {
  if (!scannedSku) return;
  const match = inventory.find(item => item.sku === scannedSku);
  if (!match) { alert(`SKU "${scannedSku}" not found.`); return; }
  const brandSection = document.querySelector(`.brand-section[data-brand="${match.brand}"]`);
  if (brandSection && brandSection.classList.contains('collapsed')) brandSection.classList.remove('collapsed');
  const targetRow = document.querySelector(`tr[data-sku="${match.sku}"]`);
  if (targetRow) {
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetRow.classList.add('highlight-row');
    setTimeout(() => targetRow.classList.remove('highlight-row'), 1500);
  } else { renderInventory(); setTimeout(() => { const row = document.querySelector(`tr[data-sku="${match.sku}"]`); if(row) row.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }
}

function render() {
  updateBrandFilter();
  renderInventory();
  updateSummary();
  document.getElementById('date-display').textContent = new Date().toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric', year:'numeric'});
}
function updateBrandFilter() {
  const sel = document.getElementById('filter-brand');
  const cur = sel.value;
  const brands = [...new Set(inventory.map(i => i.brand))].sort();
  sel.innerHTML = '<option value="">All Brands</option>' + brands.map(b => `<option value="${b}" ${b===cur?'selected':''}>${b}</option>`).join('');
  document.getElementById('brand-list').innerHTML = brands.map(b => `<option value="${b}">`).join('');
}

document.getElementById('barcode-scan').addEventListener('keypress', (e) => { if(e.key === 'Enter') { e.preventDefault(); jumpToSku(e.target.value.trim()); e.target.value = ''; } });
document.getElementById('cameraScanBtn').addEventListener('click', openScannerToFind);
window.addEventListener('load', () => { render(); setTimeout(() => document.getElementById('barcode-scan').focus(), 200); });
</script>
</body>
</html>
