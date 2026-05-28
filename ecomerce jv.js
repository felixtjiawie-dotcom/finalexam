document.addEventListener("DOMContentLoaded", function () {
    // 1. Inisialisasi data keranjang dari LocalStorage atau buat baru jika kosong
    let keranjang = JSON.parse(localStorage.getItem("keranjang_makanan")) || [];

    // 2. Ambil semua elemen DOM yang dibutuhkan
    const tombolBeli = document.querySelectorAll(".btn-beli");
    const totalItemNav = document.getElementById("total-item");
    const daftarBelanja = document.getElementById("daftar-belanja");
    const totalHargaTeks = document.getElementById("total-harga");
    const btnKosongkan = document.getElementById("btn-kosongkan");

    // 3. Fungsi untuk memperbarui tampilan keranjang dan navigasi
    function updateTampilanKeranjang() {
        // Hitung total kuantitas barang
        let totalItem = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
        totalItemNav.textContent = totalItem;

        // Jika keranjang kosong
        if (keranjang.length === 0) {
            daftarBelanja.innerHTML = "<p>Keranjang masih kosong.</p>";
            totalHargaTeks.textContent = "Rp 0";
            localStorage.setItem("keranjang_makanan", JSON.stringify(keranjang));
            return;
        }

        // Tampilkan daftar item di keranjang
        let htmlKonten = '<ul style="list-style: none; padding: 0;">';
        let totalHarga = 0;

        keranjang.forEach((item, index) => {
            let subTotal = item.harga * item.jumlah;
            totalHarga += subTotal;
            htmlKonten += `
                <li style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                    <span><strong>${item.nama}</strong> (${item.jumlah}x)</span>
                    <span>
                        Rp ${subTotal.toLocaleString('id-ID')} 
                        <button class="btn-kurang" data-index="${index}" style="margin-left:10px; background:#e44d26; color:white; border:none; border-radius:3px; cursor:pointer;">-</button>
                    </span>
                </li>
            `;
        });
        htmlKonten += '</ul>';
        daftarBelanja.innerHTML = htmlKonten;
        totalHargaTeks.textContent = "Rp " + totalHarga.toLocaleString('id-ID');

        // Simpan perubahan ke LocalStorage
        localStorage.setItem("keranjang_makanan", JSON.stringify(keranjang));

        // Pasang event listener untuk tombol kurang (-)
        gandengTombolKurang();
    }

    // 4. Fungsi ketika tombol "Beli" diklik
    tombolBeli.forEach(tombol => {
        tombol.addEventListener("click", function () {
            const namaProduk = this.getAttribute("data-nama");
            const hargaProduk = parseInt(this.getAttribute("data-harga"));

            // Validasi jika atribut data belum dipasang di HTML
            if (!namaProduk || !hargaProduk) {
                alert("Gagal menambahkan! Atribut data-nama atau data-harga belum disetting di HTML.");
                return;
            }

            // Cek apakah makanan tersebut sudah ada di keranjang
            const produkEksis = keranjang.find(item => item.nama === namaProduk);

            if (produkEksis) {
                produkEksis.jumlah += 1; // Jika ada, tambah jumlahnya
            } else {
                keranjang.push({ nama: namaProduk, harga: hargaProduk, jumlah: 1 }); // Jika belum, masukkan data baru
            }

            alert(`${namaProduk} berhasil dimasukkan ke keranjang!`);
            updateTampilanKeranjang();
        });
    });

    // 5. Fungsi tombol mengurangi item (-) di dalam daftar belanja
    function gandengTombolKurang() {
        document.querySelectorAll(".btn-kurang").forEach(tombol => {
            tombol.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                keranjang[index].jumlah -= 1;

                // Jika jumlahnya 0, hapus dari daftar keranjang
                if (keranjang[index].jumlah === 0) {
                    keranjang.splice(index, 1);
                }
                updateTampilanKeranjang();
            });
        });
    }

    // 6. Fungsi mengosongkan seluruh isi keranjang
    btnKosongkan.addEventListener("click", function () {
        if (keranjang.length > 0) {
            if (confirm("Apakah Anda yakin ingin mengosongkan seluruh isi keranjang?")) {
                keranjang = [];
                updateTampilanKeranjang();
            }
        }
    });

    // Jalankan pembaruan data saat halaman pertama kali dibuka
    updateTampilanKeranjang();
});
