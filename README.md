# ⬡ Hexaria - Game Puzzle Matematika Multiplayer

Hexaria adalah permainan puzzle strategi berbasis matematika di mana dua pemain bersaing untuk mendapatkan skor tertinggi dengan menempatkan heksagon bernilai acak di papan permainan. Pemain dapat menangkap heksagon lawan atau memperkuat heksagon mereka sendiri melalui penempatan strategis.

## Fitur Utama

- **Mode Multiplayer Lokal**: Bermain melawan teman di perangkat yang sama.
- **Lawan Bot (AI)**: Tantang kecerdasan buatan dalam mode pemain tunggal.
- **Tingkat Kesulitan**: Pilih antara level Easy, Medium, atau Hard (menentukan jumlah blok yang tidak dapat digunakan di papan).
- **Sistem Skor Real-time**: Pantau skor Anda dan lawan secara langsung selama permainan.
- **Leaderboard**: Simpan riwayat permainan terbaik Anda dan lihat detail pertandingan sebelumnya.
- **Desain Modern & Responsif**: Antarmuka yang bersih dengan animasi halus dan dukungan untuk perangkat mobile.
- **Efek Suara**: Pengalaman bermain yang lebih imersif dengan umpan balik audio.

## Cara Bermain

1. **Persiapan**: Masukkan nama pemain dan pilih tingkat kesulitan.
2. **Giliran**: Pemain Merah selalu memulai lebih dulu, diikuti oleh Pemain Biru (atau Bot).
3. **Penempatan**: Setiap giliran, Anda akan diberikan heksagon dengan angka acak (1-20). Tempatkan pada sel kosong di papan.
4. **Strategi Penangkapan (Capture)**: Jika Anda menempatkan heksagon di sebelah heksagon lawan dan angka Anda **lebih tinggi**, Anda akan mengambil alih heksagon tersebut menjadi warna Anda.
5. **Strategi Penguatan (Boost)**: Jika Anda menempatkan heksagon di sebelah heksagon warna Anda sendiri, nilai heksagon Anda yang ada di papan akan bertambah 1.
6. **Akhir Permainan**: Permainan berakhir ketika seluruh papan telah terisi.
7. **Pemenang**: Pemain dengan total jumlah nilai heksagon tertinggi di papan adalah pemenangnya!

## Teknologi yang Digunakan

- **HTML5**: Struktur semantik untuk aplikasi web.
- **CSS3**: Styling modern dengan CSS Grid, Flexbox, dan animasi.
- **Vanilla JavaScript**: Logika permainan, manajemen state, dan AI bot tanpa dependency eksternal.
- **LocalStorage**: Untuk menyimpan data leaderboard secara lokal di browser.

## Instalasi

Proyek ini sangat ringan dan tidak memerlukan proses build atau instalasi server yang rumit.

1. Clone repositori ini:
   ```bash
   git clone https://github.com/rasyakt/CLIENT_MODULE.git
   ```
2. Buka folder proyek:
   ```bash
   cd CLIENT_MODULE
   ```
3. Buka file `index.html` di browser favorit Anda.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

---

Dibuat untuk LKS Jabar 2023 Web Technologies.
