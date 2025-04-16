window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('post-list');
  if (!container) {
    console.error('Blog container element not found');
    return;
  }

  try {
    const res = await fetch('/posts.json');
    const posts = await res.json();

    if (posts.length === 0) {
      container.innerHTML = '<p>No posts found.</p>';
      return;
    }

    posts.forEach(post => {
      const el = document.createElement('li');
      el.className = 'post-preview';
      el.innerHTML = `
        <h3><a href="${post.url}">${post.title}</a></h3>
        <p>${post.summary}</p>
        <small class="text-green-600">Posted on ${post.date}</small>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:#ff3333;">Failed to load posts: ${err.message}</p>`;
    console.error(err);
  }
});
