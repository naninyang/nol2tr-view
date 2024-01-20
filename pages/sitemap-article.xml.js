const ArticleAPI = 'https://memorial.dev1stud.io/api/sitemapArticle';
// const ArticleAPI = 'http://localhost:3003/api/sitemapArticle';

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${articles
        .map(({ idx, created }) => {
          return `
            <url>
              <loc>https://memorial.dev1stud.io/${idx}</loc>
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
  const articleRequest = await fetch(ArticleAPI);
  const articles = await articleRequest.json();
  const sitemap = generateSiteMap(articles);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
