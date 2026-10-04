import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-primary-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Pratika</h3>
            <p className="text-sm leading-relaxed">
              Quality products delivered to your door. Watches, accessories,
              organic spices, essences and more.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <p className="text-sm">
              Need help? Order via WhatsApp for faster response.
            </p>
            <a
              href="https://wa.me/2340000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-md"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Pratika. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
