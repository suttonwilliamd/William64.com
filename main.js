window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('blog-previews');
  try {
    const res = await fetch('/posts.json');
    const posts = await res.json();

    posts.forEach(post => {
      const el = document.createElement('div');
      el.className = 'post-preview';
      el.innerHTML = `
        <h2><a href="${post.url}">${post.title}</a></h2>
        <p>${post.summary}</p>
        <small>Posted on ${post.date}</small>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Failed to load posts.</p>`;
    console.error(err);
  }
});
