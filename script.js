
const dataPuskesmas = {
  "PRAGAAN": 53, "BLUTO": 37, "SARONGGI": 27, "GILI GENTING": 25,
  "TALANGO": 27, "KALIANGET": 34, "PANDIAN": 23, "PAMOLOKAN": 26,
  "BATUAN": 25, "LENTENG": 36, "MONCEK TENGAH": 21, "GANDING": 43,
  "GULUK-GULUK": 43, "PASONGSONGAN": 37, "AMBUNTEN": 48, "RUBARU": 38,
  "DASUK": 27, "MANDING": 35, "BATU PUTIH": 28, "GAPURA": 36,
  "BATANG BATANG": 40, "LEGUNG TIMUR": 25, "DUNGKEK": 27,
  "NONGGUNONG": 22, "GAYAM": 31, "RAAS": 17, "SAPEKEN": 49,
  "ARJASA": 108, "KANGAYAN": 54, "MASALEMBU": 19
};

const totalPopulasi = 1061;
const totalSampel = 109;

const puskesmasSelect = document.getElementById("puskesmasSelect");
const hasilTabel = document.getElementById("hasilTabel");
const tbody = hasilTabel.querySelector("tbody");
const unduhBtn = document.getElementById("unduhExcel");

Object.entries(dataPuskesmas).forEach(([nama, jumlah]) => {
  const option = document.createElement("option");
  option.value = nama;
  option.textContent = `${nama} (${jumlah})`;
  puskesmasSelect.appendChild(option);
});

let hasilSampelTerakhir = [];

function ambilSampel() {
  const nama = puskesmasSelect.value;
  const jumlah = dataPuskesmas[nama];
  const jumlahSampel = Math.round(jumlah / totalPopulasi * totalSampel);

  const populasi = Array.from({ length: jumlah }, (_, i) => i + 1);
  const sampel = [];
  while (sampel.length < jumlahSampel) {
    const index = Math.floor(Math.random() * populasi.length);
    sampel.push(populasi.splice(index, 1)[0]);
  }
  sampel.sort((a, b) => a - b);

  hasilSampelTerakhir = sampel.map((nomor, idx) => ({
    No: idx + 1,
    "Nomor Perawat": `Perawat #${nomor}`
  }));

  tbody.innerHTML = "";
  hasilSampelTerakhir.forEach(item => {
    tbody.innerHTML += `<tr><td>${item.No}</td><td>${item["Nomor Perawat"]}</td></tr>`;
  });

  hasilTabel.style.display = "table";
  unduhBtn.style.display = "inline-block";
}

function unduhExcel() {
  const worksheet = XLSX.utils.json_to_sheet(hasilSampelTerakhir);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sampel");

  XLSX.writeFile(workbook, "sampel_perawat.xlsx");
}
