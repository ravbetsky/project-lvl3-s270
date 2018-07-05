export default (rssXML) => {
  const result = new DOMParser().parseFromString(rssXML, 'application/xml');
  const channel = result.querySelector('channel');
  const items = result.querySelectorAll('item');
  return {
    title: channel.querySelector('title').textContent,
    items: [...items].map((item) => {
      const props = ['title', 'link', 'pubDate', 'description'];
      const iter = (acc, prop) => ({ ...acc, [prop]: item.querySelector(prop).textContent });
      return props.reduce(iter, {});
    }),
    description: channel.querySelector('description').textContent,
  };
};
