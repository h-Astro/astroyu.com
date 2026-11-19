/* 暂时隐藏的文章、计划与联系栏目保存在 git 提交 3bb8b67 的 app/page.tsx 中，需要时可从那里恢复。 */
import PhotosStrip from "./PhotosStrip";
import ThemeToggle from "./ThemeToggle";
import { getPhotosShareUrl, getRecentPhotos } from "./lib/photos";

export const dynamic = "force-dynamic";

// Relay deliberately names no provider.
const apps = [
  { name: "Relay", href: "https://relay.astroyu.com", icon: "world" },
  { name: "Fit", href: "https://fit.astroyu.com/", icon: "fit" },
  { name: "Photos", href: "https://photos.astroyu.com", icon: "photos" },
  { name: "Videos", href: "https://v.astroyu.com", icon: "videos" },
];

export default async function Home() {
  const shareUrl = getPhotosShareUrl();
  const recentPhotos = await getRecentPhotos(shareUrl, 12);
  return (
    <main className="page overflow-x-clip" id="top">
      <header className="site-header shell mx-auto flex h-[76px] w-[min(1360px,calc(100%-36px))] items-center justify-between sm:h-[84px] sm:w-[min(1360px,calc(100%-88px))]">
        <a
          className="wordmark inline-flex items-center gap-3 text-[25px] leading-none font-[850] tracking-[-0.1em] focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)] sm:text-[27px]"
          href="#top"
          aria-label="与航，返回顶部"
        >
          <img className="brand-mark size-[28px] sm:size-[30px]" src="/logo.svg?v=4" width={30} height={30} alt="" />
          <span className="brand-name [&>span]:text-[var(--accent)]">与航<span>。</span></span>
        </a>
        <div className="header-line flex-1" aria-hidden="true" />
        <ThemeToggle />
      </header>

      <section className="temple-home" aria-labelledby="hero-title">
        <img className="temple-home-image" src="/temple-home.webp" alt="蓝调手绘中，两个人并肩站在天坛祈年殿前" width={1774} height={887} fetchPriority="high" />
        <h1 id="hero-title" className="temple-home-copy">
          <span>顺路的话，我们看一样的风景。</span>
          <span>不顺路的话，祝我们都能看到自己想要的风景。</span>
        </h1>
      </section>

      <section
        className="apps-section shell mx-auto w-[min(1360px,calc(100%-36px))] pt-[clamp(56px,7vw,96px)] pb-0 sm:w-[min(1360px,calc(100%-88px))]"
        id="apps"
        aria-labelledby="apps-title"
      >
        <div className="section-heading mb-6 flex items-baseline justify-between sm:mb-8">
          <h2 id="apps-title" className="m-0 font-sans text-[clamp(22px,2.2vw,30px)] leading-tight font-semibold tracking-[-0.03em] text-[var(--ink)]">
            Apps
          </h2>
          <span className="section-rule hidden" aria-hidden="true" />
          <span className="section-period hidden" aria-hidden="true" />
        </div>
        <ul className="apps grid w-full list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:gap-6 lg:grid-cols-4">
          {apps.map((app) => (
            <li className={`app app-${app.icon} min-w-0`} key={app.name}>
              <a
                className="app-link group block w-full focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
                href={app.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="stamp relative isolate block aspect-square w-full overflow-hidden rounded-[6px] bg-[var(--art-ground)]">
                  <span
                    className="stamp-art absolute inset-0 transition-transform duration-550 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
                    aria-hidden="true"
                  >
                    <i className="absolute block" />
                    <i className="absolute block" />
                    <i className="absolute block" />
                  </span>
                  <span
                    className="art-letter pointer-events-none absolute right-[0.06em] bottom-[-0.32em] z-10 font-sans text-[clamp(76px,18vw,136px)] leading-none font-[750] tracking-[-0.12em] text-white [text-shadow:0_2px_20px_#19263d40] lg:text-[clamp(88px,9.5vw,138px)]"
                    aria-hidden="true"
                  >
                    {app.name[0]}
                  </span>
                </span>
                <span className="app-title mt-3 block">
                  <span className="app-name text-[clamp(16px,1.35vw,19px)] leading-[1.35] font-semibold tracking-[-0.02em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                    {app.name}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {recentPhotos.length > 0 && (
        <section
          className="photos-section w-full pt-[clamp(56px,7vw,92px)] pb-0"
          id="photos"
          aria-labelledby="photos-title"
        >
          <div className="section-heading mx-auto mb-1 w-[min(1360px,calc(100%-36px))] sm:mb-2 sm:w-[min(1360px,calc(100%-88px))]">
            <h2 id="photos-title" className="m-0 font-sans text-[clamp(22px,2.2vw,30px)] leading-tight font-semibold tracking-[-0.03em] text-[var(--ink)]">
              近影
            </h2>
          </div>
          <PhotosStrip photos={recentPhotos} />
        </section>
      )}

      <footer className="footer shell mx-auto mt-[clamp(64px,8vw,108px)] w-[min(1360px,calc(100%-36px))] pt-4 pb-9 sm:w-[min(1360px,calc(100%-88px))] sm:pt-6 sm:pb-11">
        <div className="footer-main flex items-center justify-between gap-6">
          <span className="m-0 font-sans text-[20px] leading-none font-medium tracking-[0.04em] text-[var(--ink)] sm:text-[24px]">向前看</span>
          <a
            className="footer-period block size-7 text-[var(--muted)] transition-all duration-300 hover:-translate-y-0.5 hover:text-[var(--accent)] sm:size-8"
            href="#top"
            aria-label="返回顶部"
          >
            <svg className="block size-full" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="37" stroke="currentColor" strokeWidth="11" />
            </svg>
          </a>
        </div>
        <div className="footer-bottom mt-4 flex items-center text-xs text-[var(--muted)]">
          <span>© 2026 与航</span>
        </div>
      </footer>
    </main>
  );
}
