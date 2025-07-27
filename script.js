
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

function getRandomSample(jumlah, n) {
  const populasi = Array.from({ length: jumlah }, (_, i) => i + 1);
  const sampel = [];
  while (sampel.length < n) {
    const idx = Math.floor(Math.random() * populasi.length);
    sampel.push(populasi.splice(idx, 1)[0]);
  }
  return sampel.sort((a, b) => a - b);
}

function generateAll() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  let totalPop = 0;
  let totalSamp = 0;
  const dataExport = [];

  Object.entries(dataPuskesmas).forEach(([nama, jumlah], index) => {
    const nSample = Math.round(jumlah / totalPopulasi * totalSampel);
    const sampel = getRandomSample(jumlah, nSample);

    totalPop += jumlah;
    totalSamp += nSample;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${nama}</td>
      <td>${jumlah}</td>
      <td>${nSample}</td>
      <td>${sampel.join(", ")}</td>
    `;
    tbody.appendChild(row);

    dataExport.push({
      No: index + 1,
      Puskesmas: nama,
      "Jumlah Populasi": jumlah,
      "Jumlah Sampel": nSample,
      "Responden Terpilih": sampel.join(", ")
    });
  });

  document.getElementById("totalPopulasi").textContent = totalPop;
  document.getElementById("totalSampel").textContent = totalSamp;

  // Buat file Excel
  const worksheet = XLSX.utils.json_to_sheet(dataExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sampel");
  XLSX.writeFile(workbook, "sampel_semua_puskesmas.xlsx");
}
