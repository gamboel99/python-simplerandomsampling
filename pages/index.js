import { useState } from 'react';
import { utils, writeFile } from 'xlsx';

const dataPuskesmas = [
  { nama: "PRAGAAN", jumlah: 53 },
  { nama: "BLUTO", jumlah: 37 },
  { nama: "SARONGGI", jumlah: 27 },
  { nama: "GILI GENTING", jumlah: 25 },
  { nama: "TALANGO", jumlah: 27 },
  { nama: "KALIANGET", jumlah: 34 },
  { nama: "PANDIAN", jumlah: 23 },
  { nama: "PAMOLOKAN", jumlah: 26 },
  { nama: "BATUAN", jumlah: 25 },
  { nama: "LENTENG", jumlah: 36 },
  { nama: "MONCEK TENGAH", jumlah: 21 },
  { nama: "GANDING", jumlah: 43 },
  { nama: "GULUK-GULUK", jumlah: 43 },
  { nama: "PASONGSONGAN", jumlah: 37 },
  { nama: "AMBUNTEN", jumlah: 48 },
  { nama: "RUBARU", jumlah: 38 },
  { nama: "DASUK", jumlah: 27 },
  { nama: "MANDING", jumlah: 35 },
  { nama: "BATU PUTIH", jumlah: 28 },
  { nama: "GAPURA", jumlah: 36 },
  { nama: "BATANG BATANG", jumlah: 40 },
  { nama: "LEGUNG TIMUR", jumlah: 25 },
  { nama: "DUNGKEK", jumlah: 27 },
  { nama: "NONGGUNONG", jumlah: 22 },
  { nama: "GAYAM", jumlah: 31 },
  { nama: "RAAS", jumlah: 17 },
  { nama: "SAPEKEN", jumlah: 49 },
  { nama: "ARJASA", jumlah: 108 },
  { nama: "KANGAYAN", jumlah: 54 },
  { nama: "MASALEMBU", jumlah: 19 }
];

const totalPopulasi = dataPuskesmas.reduce((sum, p) => sum + p.jumlah, 0);
const targetSample = 109;

function getRandomSamples(jumlah, n) {
  const numbers = Array.from({ length: jumlah }, (_, i) => i + 1);
  const shuffled = numbers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n).sort((a, b) => a - b);
}

export default function Home() {
  const [hasil, setHasil] = useState([]);

  const hitung = () => {
    const hasilSampling = dataPuskesmas.map(p => {
      const jmlSample = Math.round((p.jumlah / totalPopulasi) * targetSample);
      return {
        ...p,
        sampel: jmlSample,
        nomor: getRandomSamples(p.jumlah, jmlSample)
      };
    });
    setHasil(hasilSampling);
  };

  const exportExcel = () => {
    const ws = utils.json_to_sheet(
      hasil.map(h => ({
        Puskesmas: h.nama,
        Populasi: h.jumlah,
        Sampel: h.sampel,
        Nomor_Sampel: h.nomor.join(", ")
      }))
    );
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sampel");
    writeFile(wb, "hasil_sampel.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Acak Sampel Perawat Puskesmas - Sumenep</h1>
      <p>Total Populasi: {totalPopulasi} | Target Sampel: {targetSample}</p>
      <button onClick={hitung}>Hitung Sampel</button>
      <button onClick={exportExcel} disabled={!hasil.length} style={{ marginLeft: 10 }}>Unduh Excel</button>
      <table border="1" cellPadding="6" style={{ marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>No</th>
            <th>Puskesmas</th>
            <th>Populasi</th>
            <th>Sampel</th>
            <th>Nomor Sampel</th>
          </tr>
        </thead>
        <tbody>
          {hasil.map((row, idx) => (
            <tr key={row.nama}>
              <td>{idx + 1}</td>
              <td>{row.nama}</td>
              <td>{row.jumlah}</td>
              <td>{row.sampel}</td>
              <td>{row.nomor.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}