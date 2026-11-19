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
  return <main className="page" id="top">
    <header className="site-header shell">
      <a className="wordmark" href="#top" aria-label="与航，返回顶部"><img className="brand-mark" src="/logo.svg?v=3" width={30} height={30} alt="" /><span className="brand-name">与航<span>。</span></span></a>
      <div className="header-line" aria-hidden="true" /><ThemeToggle />
    </header>
    <section className="hero shell" aria-labelledby="hero-title">
      <h1 className="intro" id="hero-title">
        <span className="intro-first"><span className="intro-opening">顺路的话，</span><span className="intro-main">我们看一样的<span className="scenery-word">风景<span className="scenery-stop">。</span><svg viewBox="0 0 240 22" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14Q116-2 234 10M12 20Q121 4 221 15" /></svg></span></span></span>
        <span className="intro-second"><span className="quote-mark" aria-hidden="true">“</span><span className="intro-second-opening">不顺路的话，</span><span className="intro-second-message">祝我们都能看到<span>自己想要的风景。</span></span><span className="quote-period" aria-hidden="true" /></span>
      </h1>
      <Postcard />
    </section>
    <section className="apps-section shell" id="apps" aria-labelledby="apps-title">
      <div className="section-heading"><h2 id="apps-title">Apps</h2><span className="section-rule" aria-hidden="true" /><span className="section-period" aria-hidden="true" /></div>
      <ul className="apps">
        {apps.map((app, index) => (
          <li className={`app app-${app.icon}`} key={app.name}>
            <a className="app-link" href={app.href} target="_blank" rel="noreferrer">
              <span className="stamp">
                <span className="stamp-art" aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
                <span className="app-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </span>
              <span className="app-title">
                <span className="app-name">{app.name}</span>
                <span className="app-note">{app.note}</span>
              </span>
            </a>
            <span className="app-foot">
              <span className="app-domain">{app.domain}</span>
              {app.provider && <a className="app-provider" href={app.providerHref} target="_blank" rel="noreferrer">{app.provider}</a>}
            </span>
          </li>
        ))}
      </ul>
    </section>
    <footer className="footer shell"><div className="footer-main"><span>向前看</span><a className="footer-period" href="#top" aria-label="返回顶部"><svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="37" stroke="currentColor" strokeWidth="13" /></svg></a></div><div className="footer-bottom"><span>© 2026 与航</span><div className="footer-line" aria-hidden="true" /></div></footer>
  </main>;
}
