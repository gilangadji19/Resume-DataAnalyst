

// --- DATASETS ---

// 1. Scatter Plot: Problem Krusial
const scatterData = [
    { x: 25, y: 25.0, label: "Klaim Asuransi Ditolak (Bukti Kurang)" },
    { x: 37, y: 35.0, label: "Kurir Resign Bawa Kabur Uang COD" },
    { x: 125, y: 32.0, label: "Fake Delivery oleh Kurir" },
    { x: 7, y: 35.0, label: "Truk Linehaul Vendor Mogok" },
    { x: 130, y: 22.5, label: "Admin Salah Tempel Label Retur" },
    { x: 92, y: 42.0, label: "Selisih Setoran Kurir" },
    { x: 3, y: 20.5, label: "Kecelakaan Forklift Gudang" },
    { x: 120, y: 65.0, label: "Paket Tidak Terkirim Hingga SLA" },
    { x: 14, y: 22.0, label: "Scanner Gun Rusak/Error" },
    { x: 9, y: 95.0, label: "Sindikat Pembeli Fiktif" },
    { x: 55, y: 13.0, label: "Paket Salah Alamat" },
    { x: 40, y: 9.0, label: "Paket Retur Tidak Kembali ke HUB" },
    { x: 15, y: 60.0, label: "Pencurian Barang High Value" },
    { x: 185, y: 345.5, label: "Paket Hilang di Hub (Lost)" },
    { x: 1, y: 220.0, label: "Gudang Satelite Kebanjiran" },
    { x: 11, y: 285.0, label: "Internal Theft" },
    { x: 8, y: 60.0, label: "Kecelakaan Armada Truk" }
];

// 2. Line Chart: Forecasting
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des", "Jan26", "Feb26", "Mar26"];
const lineSeries = [
    { name: "Produk A", data: [160000, 165000, 170000, 175000, 180000, 195000, 210000, 205000, 215000, 225000, 230000, 235000, 240000, 235000, 245000] },
    { name: "Produk B", data: [200000, 210000, 225000, 245000, 270000, 300000, 330000, 350000, 360000, 380000, 430000, 495000, 450000, 465000, 485000] },
    { name: "Produk C", data: [285000, 275000, 260000, 245000, 230000, 215000, 200000, 185000, 170000, 155000, 140000, 130000, 120000, 110000, 100000] }
];

// 3. Horizontal Bar: Optimalisasi
const barCategories = ["Gate-in & Antrean Driver", "Spotting & Docking Armada", "Staging & Persiapan Muat", "Loading Time", "Final Tally  & Gate-out Admin"];
const barSeries = [
    {
        name: "Waktu Lama (Menit)",
        data: barCategories.map((cat, index) => ({
            x: cat,
            y: [24, 17, 56, 88, 31][index]
        }))
    },
    {
        name: "Waktu Baru (Menit)",
        data: barCategories.map((cat, index) => ({
            x: cat,
            y: [9, 11, 23, 46, 14][index]
        }))
    }
];

// 4. Waterfall Chart: Perencanaan Efisiensi (HPP Reduction)
const waterfallCategories = ["HPP Awal", "Migrasi Vendor", "Direct Procurement", "Contract Nego", "Std Komponen", "Eff Packaging", "Penataan Gudang", "HPP Baru (Final)"];

// Calculation:
// Start: 15.000
// -2.500 -> 12.500
// -3.000 -> 9.500
// -1.200 -> 8.300
// -600   -> 7.700
// -800   -> 6.900
// -400   -> 6.500
// Final: 6.500

const waterfallData = [
    { x: "HPP Awal", y: [0, 15000], fillColor: '#94A3B8' }, // Slate 400 (Light Gray)
    { x: "Vendor Migration", y: [12500, 15000], fillColor: '#10B981' }, // Emerald 500
    { x: "Direct Procurement", y: [9500, 12500], fillColor: '#10B981' }, // Emerald 500
    { x: "Bulk Contract Purchase", y: [8300, 9500], fillColor: '#10B981' }, // Emerald 500
    { x: "Standardisasi Komponen", y: [7700, 8300], fillColor: '#10B981' }, // Emerald 500
    { x: "Switch Material Packaging", y: [6900, 7700], fillColor: '#10B981' }, // Emerald 500
    { x: "Efisiensi Logistik", y: [6500, 6900], fillColor: '#10B981' }, // Emerald 500
    { x: "HPP Baru (Final)", y: [0, 6500], fillColor: '#94A3B8' } // Slate 400 (Light Gray)
];

// --- CHART CONFIGURATIONS ---

let currentChart = null;
let legendClickHandler = null; // Global handler to prevent memory leaks
let scatterLabelMap = {}; // Global map for scatter plot tooltip labels

function renderScatter() {
    // Split data into Outliers (High Impact > 100 Juta) and Normal
    const threshold = 100;

    // 1. Prepare Data Arrays [x, y]
    const outliersData = scatterData.filter(d => d.y >= threshold).map(d => [d.x, d.y]);
    const normalData = scatterData.filter(d => d.y < threshold).map(d => [d.x, d.y]);

    // 2. Create GLOBAL Lookup Map for tooltip access (most robust method)
    // Reset and populate global map
    scatterLabelMap = {};
    scatterData.forEach(d => {
        scatterLabelMap[`${d.x}-${d.y}`] = d.label;
    });

    // Create Annotations for Outliers (outer ring highlights)
    const outlierAnnotations = outliersData.map(point => {
        return {
            x: point[0],
            y: point[1],
            marker: {
                size: 8,
                fillColor: 'transparent',
                strokeColor: '#EC4899',
                strokeWidth: 2,
                radius: 2,
                cssClass: 'no-mouse-events'
            },
            label: {
                borderWidth: 0,
                text: ''
            }
        };
    });

    const options = {
        series: [
            {
                name: "Outliers Issues",
                data: outliersData
            },
            {
                name: "Normal Issues",
                data: normalData
            }
        ],
        chart: {
            type: 'scatter',
            height: 400,
            foreColor: '#cbd5e1', // Dark Mode Text
            zoom: { enabled: false },
            toolbar: { show: false },
            fontFamily: 'Nunito Sans, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        grid: {
            borderColor: '#334155' // Dark Mode Grid
        },
        xaxis: {
            tickAmount: 10,
            min: 0,
            max: 200, // Force range 0-200
            title: {
                text: 'Frekuensi Kejadian',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#cbd5e1'
                }
            },
            labels: {
                formatter: function (val) {
                    return Math.round(val);
                }
            }
        },
        yaxis: {
            tickAmount: 7,
            title: {
                text: 'Dampak Kerugian (Juta)',
                style: { color: '#cbd5e1' }
            },
            labels: { formatter: (val) => `Rp ${val} Jt` }
        },
        markers: {
            size: [6, 6], // Both dots are solid size 6
            strokeWidth: 0,
            fillOpacity: 1, // Solid fill
            hover: {
                size: 9,
                sizeOffset: 3
            }
        },
        colors: ['#EC4899', '#6366f1'], // Pink for Outlier, Indigo for Normal
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            markers: { radius: 12 },
            labels: { colors: '#cbd5e1' }
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            shared: false,
            intersect: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                // Find original object to get label
                const original = scatterData.find(d => d.x === data[0] && d.y === data[1]);
                const color = seriesIndex === 0 ? '#EC4899' : '#cbd5e1';

                return `
                <div class="arrow_box" style="padding:12px; border-radius:8px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.5); background:#1e293b; border:1px solid #334155; color:#f8fafc;">
                    <div style="color:${color}; font-weight:700; margin-bottom:4px;">${original ? original.label : 'Issue'}</div>
                    <div style="font-size:0.85em; color:#94a3b8">
                        Frekuensi: <strong style="color:#f8fafc">${data[0]}</strong><br>
                        Kerugian: <strong style="color:#f8fafc">Rp ${data[1]} Juta</strong>
                    </div>
                </div>`;
            }
        }

    };

    return options;
}


function renderLine() {
    const colors = ['#8B5CF6', '#06B6D4', '#F97316']; // Purple, Cyan, Orange
    const products = ['Produk A', 'Produk B', 'Produk C'];

    const rangeSeries = [];
    const historySeries = [];
    const forecastSeries = [];

    lineSeries.forEach((s, i) => {
        rangeSeries.push({
            name: `${s.name} Range`,
            type: 'rangeArea',
            data: s.data.map((v, idx) => {
                if (idx < 11) return { x: months[idx], y: null };
                const devFactor = (idx - 11) * 0.06;
                const variance = v * devFactor;
                const bottom = Math.max(0, Math.floor(v - variance));
                return { x: months[idx], y: [bottom, Math.ceil(v + variance)] };
            }),
            color: colors[i],
            showInLegend: false
        });

        historySeries.push({
            name: s.name,
            type: 'line',
            data: s.data.map((v, idx) => ({ x: months[idx], y: idx <= 11 ? v : null })),
            color: colors[i],
            showInLegend: true
        });

        forecastSeries.push({
            name: `${s.name} Forecast`,
            type: 'line',
            data: s.data.map((v, idx) => ({ x: months[idx], y: idx > 11 ? v : null })),
            color: colors[i],
            showInLegend: false
        });
    });

    const finalSeries = [...rangeSeries, ...historySeries, ...forecastSeries];
    const dashArray = [...[0, 0, 0], ...[0, 0, 0], ...[5, 5, 5]];
    const strokeWidth = [...[0, 0, 0], ...[3, 3, 3], ...[3, 3, 3]];

    const options = {
        series: finalSeries,
        chart: {
            type: 'line',
            height: 400,
            foreColor: '#cbd5e1', // Dark Mode
            fontFamily: 'Nunito Sans, sans-serif',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        xaxis: {
            categories: months,
            title: {
                text: 'Bulan',
                style: { color: '#cbd5e1' }
            }
        },
        yaxis: {
            title: {
                text: 'Volume / Unit',
                style: { color: '#cbd5e1' }
            }
        },
        stroke: { curve: 'straight', width: strokeWidth, dashArray: dashArray },
        fill: { type: 'solid', opacity: [...[0.2, 0.2, 0.2], ...[1, 1, 1], ...[1, 1, 1]] },
        markers: { size: [...[0, 0, 0], ...[4, 4, 4], ...[4, 4, 4]], hover: { size: 6 } },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                    value: 0.8
                }
            }
        },
        // Grid missing in original, adding for consistency
        grid: { borderColor: '#334155' },
        annotations: { xaxis: [{ x: 'Des', strokeDashArray: 2, borderColor: '#999', label: { style: { color: '#fff', background: '#775DD0' }, text: 'Mulai Forecast' } }] },
        legend: { show: true, customLegendItems: products, markers: { fillColors: colors }, onItemClick: { toggleDataSeries: false }, onItemHover: { highlightDataSeries: true }, labels: { colors: '#cbd5e1' } },
        tooltip: {
            shared: true,
            theme: 'dark',
            intersect: false,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                if (!w || !w.config || !w.config.series) return '';
                const monthLabel = w.globals.categoryLabels[dataPointIndex] || months[dataPointIndex];
                let html = '<div style="padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; font-family: Nunito Sans, sans-serif; color: #f8fafc;">';
                html += `<div style="font-weight: 600; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid #334155; padding-bottom: 5px;">${monthLabel}</div>`;
                for (let i = 0; i < w.config.series.length; i++) {
                    try {
                        const currentSeries = w.config.series[i];
                        if (!currentSeries || !currentSeries.data) continue;
                        const seriesName = currentSeries.name;
                        const seriesType = currentSeries.type;
                        const seriesColor = w.config.colors && w.config.colors[i] ? w.config.colors[i] : '#000';
                        if (seriesType === 'rangeArea' || seriesName.includes('Range')) continue;
                        if (dataPointIndex >= currentSeries.data.length) continue;
                        const dataPoint = currentSeries.data[dataPointIndex];
                        let value = null;
                        if (dataPoint && typeof dataPoint === 'object' && 'y' in dataPoint) value = dataPoint.y;
                        else if (typeof dataPoint === 'number') value = dataPoint;
                        if (value === null || typeof value === 'undefined') continue;
                        let displayName = seriesName;
                        if (seriesName.includes('Forecast')) displayName = seriesName.replace(' Forecast', '') + ' (Forecast)';
                        html += '<div style="display: flex; align-items: center; margin: 5px 0;">';
                        html += `<span style="width: 12px; height: 12px; border-radius: 50%; background-color: ${seriesColor}; margin-right: 8px;"></span>`;
                        html += `<span style="font-size: 12px;"><span style="color: #94a3b8;">${displayName}:</span> <strong>${Math.round(value)}</strong></span>`;
                        html += '</div>';
                    } catch (error) { }
                }
                html += '</div>';
                return html;
            }
        }
    };
    return options;
}

function renderBar() {
    const options = {
        series: barSeries,
        chart: {
            type: 'bar',
            height: 400,
            foreColor: '#cbd5e1', // Dark Mode
            fontFamily: 'Nunito Sans, sans-serif',
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 10,  // Rounded bar ends (setengah lingkaran)
                borderRadiusApplication: 'end',  // Only round the end
                dataLabels: { position: 'top' }
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -10,  // Inside bar, not too close to rounded end
            style: {
                fontSize: '12px',
                colors: ['#fff'],
                fontWeight: '600'
            }
        },
        stroke: {
            width: 1,
            colors: ['transparent']
        },
        fill: {
            colors: ['#64748B', '#6366f1']  // Slate for Old Time, Indigo for New Time
        },
        xaxis: {
            type: 'numeric',
            labels: {
                show: false // Hide axis labels (numbers)
            },
            axisBorder: {
                show: false // Hide bottom axis line
            },
            axisTicks: {
                show: false // Hide small ticks
            },
            title: {
                text: 'Waktu (Menit)',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#cbd5e1'
                },
                offsetY: -10 // Adjust title position since labels are gone
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '13px',
                    fontWeight: 500
                }
            }
        },
        // Grid missing, adding for consistency
        grid: { borderColor: '#334155' },
        legend: {
            fontSize: '13px',
            fontWeight: 500,
            labels: { colors: '#cbd5e1' }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                    return val + " Menit";
                }
            }
        }
    };
    return options;
}

function renderWaterfall() {
    const options = {
        series: [{
            data: waterfallData
        }],
        chart: {
            type: 'rangeBar',
            height: 400,
            foreColor: '#cbd5e1', // Dark Mode
            fontFamily: 'Nunito Sans, sans-serif'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 0,  // Kotak tegas
                borderRadiusApplication: 'end',
                dataLabels: {
                    position: 'center',
                    orientation: 'vertical'
                }
            }
        },
        fill: {
            type: 'solid',
            opacity: 1
        },
        xaxis: {
            type: 'category' // Ensure categories are read from x within data
        },
        yaxis: {
            title: {
                text: 'Rupiah',
                style: { color: '#cbd5e1' }
            },
            labels: {
                formatter: function (val) {
                    return val.toLocaleString();
                }
            }
        },
        grid: {
            borderColor: '#334155',
            yaxis: {
                lines: { show: true }
            }
        },
        tooltip: {
            theme: 'dark',
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                const category = w.globals.labels[dataPointIndex];
                const value = data.y; // Array [start, end]

                let displayValue = 0;
                let label = "";
                let color = data.fillColor;

                // Logic to determine value to show
                if (dataPointIndex === 0 || dataPointIndex === 7) {
                    // Total bars (Start & End) -> Show the end value
                    displayValue = value[1];
                    label = "Total";
                } else {
                    // Reduction bars -> Show difference (Start - End) 
                    displayValue = value[1] - value[0];
                    label = "Pengurangan";
                    displayValue = -displayValue; // Show as negative for reduction
                }

                return `
                <div class="arrow_box" style="padding:10px; border-radius:4px; box-shadow:0 2px 6px rgba(0,0,0,0.5); background:#1e293b; border:1px solid #334155; color:#f8fafc;">
                    <div style="font-weight:600; font-size:13px; margin-bottom:4px; color:#f8fafc;">${category}</div>
                    <div style="font-size:12px; display:flex; align-items:center;">
                        <span style="width:10px; height:10px; background:${color}; margin-right:6px; display:inline-block;"></span>
                        <span style="color:#cbd5e1">${label}: <strong style="color:#f8fafc">Rp ${displayValue.toLocaleString()}</strong></span>
                    </div>
                </div>`;
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                // Safer access to data point
                const dataPoint = opts.w.config.series[0].data[opts.dataPointIndex];

                // Only show labels for start (index 0) and end (index 7) bars
                if (opts.dataPointIndex === 0 || opts.dataPointIndex === 7) {
                    // Check if y is component (array)
                    if (Array.isArray(dataPoint.y)) {
                        return "Rp " + dataPoint.y[1].toLocaleString();
                    }
                    return "Rp " + val.toLocaleString(); // Fallback
                }
                return "";
            },
            style: {
                colors: ['#FFFFFF'],
                fontSize: '13px',
                fontWeight: '600'
            },
            offsetY: 0
        }
    };
    return options;
}

// --- CONTROLLER ---

function initChart(type) {
    if (currentChart) {
        currentChart.destroy();
    }

    const chartEl = document.querySelector("#main-chart");
    let options;
    let title = "";
    let desc = "";

    switch (type) {
        case 'scatter':
            options = renderScatter();
            title = "Analisis Dampak Kerugian Perusahaan 2024";
            desc = "Saya memetakan anomali data dan memvisualisasikannya agar langkah perbaikan yang paling krusial jadi lebih mudah ditentukan.";
            break;
        case 'line':
            options = renderLine();
            title = "Prediksi Tren & Kebutuhan Produk 2026";
            desc = "Saya menganalisis pola data historis secara mendalam untuk menekan angka deviasi, sehingga hasil prediksi tetap akurat dan mendekati realita lapangan.";
            break;
        case 'bar':
            options = renderBar();
            title = "Analisis Bottleneck Vehicle Turnaround Time (TRT)";
            desc = "Saya membedah setiap tahap TRT untuk mengidentifikasi bottleneck dan membandingkannya dengan standar industri, sehingga manajemen bisa melihat jelas gap efisiensi yang telah kita pangkas.";
            break;
        case 'waterfall':
            options = renderWaterfall();
            title = "Strategi Reduksi Biaya & Penghematan HPP";
            desc = "Saya menguraikan komposisi pengurangan biaya dari berbagai sektor untuk menunjukkan dampak finansial nyata yang telah kita berikan bagi profitabilitas perusahaan.";
            break;
        default:
            return;
    }

    // Render Chart
    currentChart = new ApexCharts(chartEl, options);
    currentChart.render().then(() => {
        // Add manual legend click handlers for line chart with customLegendItems
        if (type === 'line' && options.legend && options.legend.customLegendItems) {
            // Wait a bit for DOM to be fully ready
            setTimeout(() => {
                // Use event delegation on chartEl itself (NEVER gets rebuilt)
                // Remove old listener before adding new (prevent memory leak)
                if (legendClickHandler) {
                    chartEl.removeEventListener('click', legendClickHandler);
                }

                // Create handler function
                legendClickHandler = function (e) {
                    // Find if click was on a legend item
                    const legendItem = e.target.closest('.apexcharts-legend-series');

                    if (legendItem) {
                        // Find the legend container to get all items
                        const legendContainer = chartEl.querySelector('.apexcharts-legend');
                        if (legendContainer) {
                            const allLegendItems = legendContainer.querySelectorAll('.apexcharts-legend-series');
                            const index = Array.from(allLegendItems).indexOf(legendItem);

                            const products = ['Produk A', 'Produk B', 'Produk C'];
                            const clickedProduct = products[index];

                            // Toggle all 3 series for this product
                            currentChart.toggleSeries(clickedProduct);
                            currentChart.toggleSeries(`${clickedProduct} Range`);
                            currentChart.toggleSeries(`${clickedProduct} Forecast`);
                        }
                    }
                };

                // Add the new listener
                chartEl.addEventListener('click', legendClickHandler);
            }, 150);
        }
    });

    // Update Text
    document.getElementById('chart-title').innerText = title;
    document.getElementById('chart-subtitle').innerText = desc;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".chart-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove("active"));
            // Add active to current
            btn.classList.add("active");

            // Init chart
            const chartType = btn.getAttribute("data-chart");
            initChart(chartType);
        });
    });

    // Default Load
    initChart('scatter');
});

// --- CTA HANDLER ---

function handleHireMe() {
    // Obfuscated email to prevent simple scraping
    const user = "gilangadji19";
    const domain = "gmail.com";
    const email = user + "@" + domain;

    // Open mail client
    window.location.href = `mailto:${email}`;
}

