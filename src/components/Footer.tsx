import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-white/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Keisuke Miyajima</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              UI/UXデザイナー
              <br />
              2004年から2022年にかけて、
              <br />
              ウェブサービスと電気機器の
              <br />
              UIデザインを担当
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Awards</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>GOOD DESIGN賞 2014, 2015</li>
              <li>HCDグッドプラクティスアウォード 2016</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200/50">
          <p className="text-sm text-neutral-500 text-center">
            &copy; {new Date().getFullYear()} Keisuke Miyajima. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
