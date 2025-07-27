let puskesmasData = [];

fetch('puskesmas.json')
  .then(res => res.json())
  .then(data => puskesmasData = data);

function hitungSampling() {
  const totalPopulasi = parseInt(document.getElementById('totalPopulasi').value);
  const jumlahSampel = parseInt(document.getElementById('jumlahSampel').value);
  const tbody = document.querySelector('#hasilSampling tbody');
  tbody.innerHTML = "";

  const total = puskesmasData.reduce((sum, row) => sum + row.populasi, 0);
  if (total !== totalPopulasi) {
    alert(`Total populasi input (${totalPopulasi}) tidak sama dengan total dari data (${total})`);
    return;
  }

  let globalRespondenCounter = 1;

  puskesmasData.forEach((row, i) => {
    const proporsi = row.populasi / totalPopulasi;
    const jumlahSampelPuskesmas = Math.round(proporsi * jumlahSampel);

    const start = globalRespondenCounter;
    const end = globalRespondenCounter + row.populasi - 1;
    const range = [...Array(row.populasi).keys()].map(x => x + start);
    const sample = shuffle(range).slice(0, jumlahSampelPuskesmas);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.nama}</td>
      <td>${row.populasi}</td>
      <td>${start} - ${end}</td>
      <td>${sample.length}</td>
      <td>${sample.sort((a, b) => a - b).join(', ')}</td>
    `;
    tbody.appendChild(tr);

    globalRespondenCounter += row.populasi;
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function exportExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(document.getElementById('hasilSampling'));
  XLSX.utils.book_append_sheet(wb, ws, "Sampel Responden");
  XLSX.writeFile(wb, "hasil_sampling_puskesmas.xlsx");
}
