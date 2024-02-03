const InterviewAPI = 'https://nol2tr.dev1stud.io/api/sitemapInterview';
// const InterviewAPI = 'http://localhost:3003/api/sitemapInterview';

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${articles
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
  const interviewRequest = await fetch(InterviewAPI);
  const interviews = await interviewRequest.json();
  const sitemap = generateSiteMap(interviews);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
