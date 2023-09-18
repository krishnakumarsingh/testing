
async function fetchBlogIndex(config) {
    let prefix = `/${window.location.pathname.split('/')[1]}`;
    let consolidatedJson = [];
    if (config.featuredOnly) {
      const linkLocales = config.featuredLinklocales;
      const linkLocs = linkLocales.filter(item => item !== prefix);
      let prefixedLocale = [];
      linkLocs.forEach(item => item !== "" && prefixedLocale.push(`/${item}/express/learn/blog/query-index.json`));
      const resp = await Promise.all(prefixedLocale.map(url => fetch(url).then(res => res.json())))
        .then((res) => res)
        .catch(error => console.log(error));
        consolidatedJson = resp;
        resp.forEach(item => consolidatedJson.push(...item.data))
    } else {
        if (prefix === '/express' || prefix === '/drafts' || prefix === '/documentation') prefix = '';
        const resp = await fetch(`${prefix}/express/learn/blog/query-index.json`);
        consolidatedJson = await resp.json();
      }
      const byPath = {};
    consolidatedJson.forEach((post) => {
      if (post.tags) {
        const tags = JSON.parse(post.tags);
        tags.push(post.category);
        post.tags = JSON.stringify(tags);
      }
      byPath[post.path.split('.')[0]] = post;
    });
    const index = { data: consolidatedJson, byPath };
    return (index);
}
