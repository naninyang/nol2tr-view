const NewicAPI = 'https://nol2tr.dev1stud.io/api/sitemapNewsic';
// const NewicAPI = 'http://localhost:3003/api/sitemapNewsic';

function generateSiteMap(watchs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${watchs
        .map(({ idx, created }) => {
          return `
            <url>
              <loc>https://nol2tr.dev1stud.io/${idx}</loc>
              <lastmod>${created}</lastmod>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const newsicRequest = await fetch(NewicAPI);
  const newsics = await newsicRequest.json();
  const sitemap = generateSiteMap(newsics);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
