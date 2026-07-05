import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-4">
              <span className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center text-white text-[15px]">
                M
              </span>
              MiniShop
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Let's Shop Beyond Boundaries. Platform belanja online terpercaya dengan jutaan produk fashion, elektronik, dan kebutuhan harian.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-200" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-200" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-200" aria-label="YouTube">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-200" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* MiniShop Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">MiniShop</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Tentang Kami</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Karir</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Mitra Blog</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">B2B Digital</Link>
            </div>
          </div>

          {/* Beli Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Beli</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Tagihan &amp; Top Up</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">MiniShop COD</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Promo Terbaru</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Voucher Saya</Link>
            </div>
          </div>

          {/* Bantuan Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Bantuan</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">MiniShop Care</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Syarat &amp; Ketentuan</Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors duration-200">Kebijakan Privasi</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © 2024 MiniShop. All Rights Reserved.
      </div>
    </footer>
  );
}
