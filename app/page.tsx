/* 暂时隐藏的文章、计划与联系栏目保存在 git 提交 3bb8b67 的 app/page.tsx 中，需要时可从那里恢复。 */
import Postcard from "./Postcard";
import ThemeToggle from "./ThemeToggle";

// Relay deliberately names no provider.
const apps = [
  { name: "Relay", href: "https://relay.astroyu.com", domain: "relay.astroyu.com", note: "看世界", icon: "world" },
  { name: "Fit", href: "https://fit.astroyu.com/", domain: "fit.astroyu.com", note: "向前看", icon: "fit" },
  { name: "Photos", href: "https://photos.astroyu.com", domain: "photos.astroyu.com", note: "忆往昔", icon: "photos", provider: "Immich", providerHref: "https://immich.app/" },
  { name: "Videos", href: "https://v.astroyu.com", domain: "v.astroyu.com", note: "藏所爱", icon: "videos", provider: "Jellyfin", providerHref: "https://jellyfin.org/" },
];

export default function Home() {
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

      <section
        className="hero relative isolate w-full overflow-hidden bg-[image:var(--hero-bg)]"
        aria-labelledby="hero-title"
      >
        <div className="mx-auto grid min-h-[clamp(540px,50vw,680px)] w-[min(1360px,calc(100%-36px))] grid-cols-1 items-end gap-y-10 py-9 sm:w-[min(1360px,calc(100%-88px))] sm:py-[clamp(44px,5.2vw,72px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-12">
          <h1
            className="intro m-0 flex min-w-0 flex-col justify-end gap-6 self-end pb-1 font-sans text-[var(--hero-ink)] sm:gap-7"
            id="hero-title"
          >
            <span className="intro-first block">
              <span className="intro-opening mb-2.5 block text-[clamp(18px,1.75vw,24px)] leading-[1.35] font-medium tracking-[-0.01em] text-[var(--hero-ink)]">
                顺路的话，
              </span>
              <span className="intro-main block text-[clamp(34px,4vw,54px)] leading-[1.14] font-semibold tracking-[-0.04em] text-[var(--hero-ink)]">
                我们看一样的<span className="scenery-word mt-0.5 block">风景。</span>
              </span>
            </span>
            <span className="intro-second block w-fit max-w-full border-t border-[var(--hero-line)] pt-4 sm:pt-5">
              <span className="intro-second-opening mb-1.5 block text-[clamp(15px,1.4vw,19px)] leading-[1.4] font-medium tracking-[-0.01em] text-[var(--hero-muted)]">
                不顺路的话，
              </span>
              <span className="intro-second-message block text-[clamp(20px,2.1vw,28px)] leading-[1.38] font-semibold tracking-[-0.025em] text-[var(--hero-ink)]">
                祝我们都能看到自己想要的风景。
              </span>
            </span>
          </h1>
          <Postcard />
        </div>
      </section>

      <section
        className="apps-section shell mx-auto w-[min(1320px,calc(100%-36px))] pt-[clamp(58px,8vw,108px)] pb-0 sm:w-[min(1320px,calc(100%-96px))]"
        id="apps"
        aria-labelledby="apps-title"
      >
        <div className="section-heading mb-6 flex items-center gap-[30px] after:h-px after:flex-1 after:bg-[var(--line)]">
          <h2 id="apps-title" className="m-0 font-sans text-[clamp(34px,5vw,66px)] leading-none font-[650] tracking-[-0.075em]">
            Apps
          </h2>
          <span className="section-rule hidden" aria-hidden="true" />
          <span className="section-period" aria-hidden="true" />
        </div>
        <ul className="apps mx-auto grid w-[min(960px,100%)] list-none grid-cols-2 gap-x-3.5 gap-y-6 p-0 sm:gap-[clamp(20px,4vw,52px)]">
          {apps.map((app) => (
            <li className={`app app-${app.icon} min-w-0`} key={app.name}>
              <a
                className="app-link group block w-full focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[var(--accent)]"
                href={app.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="stamp relative isolate block aspect-[1.55] overflow-hidden rounded-[4px] bg-[var(--art-ground)] sm:aspect-[2.27]">
                  <span
                    className="stamp-art absolute inset-0 transition-transform duration-550 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
                    aria-hidden="true"
                  >
                    <i className="absolute block" />
                    <i className="absolute block" />
                    <i className="absolute block" />
                  </span>
                  <span
                    className="art-letter pointer-events-none absolute right-[0.08em] bottom-[-0.36em] z-10 font-sans text-[clamp(66px,19vw,122px)] leading-none font-[750] tracking-[-0.12em] text-white [text-shadow:0_2px_20px_#19263d55] sm:text-[clamp(65px,13vw,170px)]"
                    aria-hidden="true"
                  >
                    {app.name[0]}
                  </span>
                </span>
                <span className="app-title mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="app-name text-[clamp(18px,2vw,25px)] leading-[1.25] tracking-[-0.025em] transition-colors group-hover:text-[var(--accent)]">
                    {app.name}
                  </span>
                  <span className="app-note font-sans text-[15px] leading-[1.4] text-[var(--muted)]">{app.note}</span>
                </span>
              </a>
              <span className="app-foot mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 font-mono text-xs leading-[1.5] text-[var(--muted)]">
                <span className="app-domain wrap-anywhere">{app.domain}</span>
                {app.provider && (
                  <a
                    className="app-provider underline underline-offset-4 hover:text-[var(--accent)]"
                    href={app.providerHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {app.provider}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer shell mx-auto mt-[clamp(55px,8vw,115px)] w-[min(1320px,calc(100%-36px))] p-0 sm:w-[min(1320px,calc(100%-96px))]">
        <div className="footer-main relative isolate flex items-center justify-between overflow-hidden rounded-[5px] p-[clamp(20px,4vw,56px)] text-[#15334d]">
          <span className="m-0 font-sans text-[clamp(50px,10vw,134px)] leading-none font-[750] tracking-[-0.09em]">向前看</span>
          <a
            className="footer-period block aspect-square w-[clamp(55px,12vw,156px)] text-[#15334d] transition-transform duration-350 hover:-translate-y-1.5"
            href="#top"
            aria-label="返回顶部"
          >
            <svg className="block size-full" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="37" stroke="currentColor" strokeWidth="13" />
            </svg>
          </a>
        </div>
        <div className="footer-bottom flex items-center gap-7 py-5 text-xs text-[var(--muted)]">
          <span>© 2026 与航</span>
          <div className="footer-line h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        </div>
      </footer>
    </main>
  );
}
