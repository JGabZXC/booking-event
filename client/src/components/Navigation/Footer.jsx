export default function Footer() {
  return (
    <footer class="bg-gray-900 text-gray-200 py-12">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <h2 class="text-2xl font-bold text-pink-900 mb-3">ShowUp</h2>
          <p class="text-sm text-gray-400">
            Book your tickets to concerts, theater, and events easily. Secure.
            Fast. Exciting.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Explore</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-yellow-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#events" class="hover:text-yellow-500 transition">
                Events
              </a>
            </li>
            <li>
              <a href="#how-it-works" class="hover:text-yellow-500 transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#faq" class="hover:text-yellow-500 transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Support</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-yellow-500 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-yellow-500 transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-yellow-500 transition">
                Refund Policy
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-yellow-500 transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Follow Us</h3>
          <div class="flex space-x-4">
            <a
              href="#"
              class="hover:text-yellow-500 transition"
              aria-label="Facebook"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a10 10 0 0010 10c.339 0 .675-.019 1.008-.056v-7.054h-2.408V12h2.408v-1.674c0-2.384 1.417-3.7 3.59-3.7 1.04 0 2.125.186 2.125.186v2.333h-1.198c-1.18 0-1.547.733-1.547 1.483V12h2.635l-.421 2.89h-2.214v7.054A10 10 0 0022 12z" />
              </svg>
            </a>

            <a
              href="#"
              class="hover:text-yellow-500 transition"
              aria-label="Twitter"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c13 8 24 0 24-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>

            <a
              href="#"
              class="hover:text-yellow-500 transition"
              aria-label="Instagram"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.206.056 2.007.246 2.48.414.61.213 1.046.468 1.51.932.464.464.719.9.932 1.51.168.473.358 1.274.414 2.48.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.206-.246 2.007-.414 2.48-.213.61-.468 1.046-.932 1.51-.464.464-.9.719-1.51.932-.473.168-1.274.358-2.48.414-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.206-.056-2.007-.246-2.48-.414-.61-.213-1.046-.468-1.51-.932-.464-.464-.719-.9-.932-1.51-.168-.473-.358-1.274-.414-2.48C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.056-1.206.246-2.007.414-2.48.213-.61.468-1.046.932-1.51.464-.464.9-.719 1.51-.932.473-.168 1.274-.358 2.48-.414C8.416 2.212 8.8 2.2 12 2.2M12 0C8.741 0 8.332.013 7.053.072 5.775.13 4.755.333 3.955.637 3.091.963 2.377 1.44 1.663 2.153.949 2.867.473 3.581.147 4.445.843 6.177.75 7.197.692 8.475.633 9.754.62 10.163.62 12s.013 2.246.072 3.525c.058 1.278.151 2.298.447 3.03.325.864.801 1.578 1.515 2.292.713.714 1.427 1.19 2.292 1.515.732.296 1.752.389 3.03.447C9.754 23.987 10.163 24 12 24s2.246-.013 3.525-.072c1.278-.058 2.298-.151 3.03-.447.864-.325 1.578-.801 2.292-1.515.714-.713 1.19-1.427 1.515-2.292.296-.732.389-1.752.447-3.03.059-1.279.072-1.688.072-3.525s-.013-2.246-.072-3.525c-.058-1.278-.151-2.298-.447-3.03a5.92 5.92 0 00-1.515-2.292A5.92 5.92 0 0018.555.637c-.732-.296-1.752-.389-3.03-.447C14.246.013 13.837 0 12 0zM12 5.838A6.162 6.162 0 005.838 12 6.162 6.162 0 0012 18.162 6.162 6.162 0 0018.162 12 6.162 6.162 0 0012 5.838zm0 10.2A4.038 4.038 0 018.162 12 4.038 4.038 0 0112 7.838 4.038 4.038 0 0115.838 12 4.038 4.038 0 0112 16.038zm6.406-10.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="text-center text-sm text-gray-500 mt-10">
        &copy; 2025 ShowUp. All rights reserved.
      </div>
    </footer>
  );
}
