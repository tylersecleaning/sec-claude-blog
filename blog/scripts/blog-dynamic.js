/**
 * SEC Blog Dynamic Renderer
 * Fetches posts.json from GitHub Pages and renders post cards into the blog listing page.
 * Loaded via <script src> in ALL-IN-ONE.html — hosted on GitHub Pages.
 */
(function () {
  var POSTS_URL = 'https://tylersecleaning.github.io/sec-claude-blog/blog/posts.json';
  var GRID_ID = 'dynamicPostsGrid';

  function formatDate(dateStr) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = new Date(dateStr + 'T00:00:00');
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function createPostCard(post) {
    return '<div class="post-card reveal">' +
      '<div class="post-card-image">' +
        '<img src="' + post.imageUrl + '" alt="' + post.imageAlt + '" width="400" height="240" loading="lazy">' +
        '<span class="post-card-tag">' + post.category + '</span>' +
        '<span class="post-card-date">' + post.readTime + '</span>' +
      '</div>' +
      '<div class="post-card-content">' +
        '<div class="post-card-meta">' +
          '<span class="post-card-meta-item">' + formatDate(post.date) + '</span>' +
        '</div>' +
        '<h3><a href="https://tylersecleaning.github.io/sec-claude-blog/blog/post-content/' + post.slug + '.html">' + post.title + '</a></h3>' +
        '<p>' + post.excerpt + '</p>' +
        '<a href="https://tylersecleaning.github.io/sec-claude-blog/blog/post-content/' + post.slug + '.html" class="post-card-link">' +
          'Read More ' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>' +
        '</a>' +
      '</div>' +
    '</div>';
  }

  function showError(msg) {
    var grid = document.getElementById(GRID_ID);
    if (grid) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem"><p class="body">' + msg + '</p></div>';
    }
  }

  function loadPosts(posts) {
    var grid = document.getElementById(GRID_ID);
    if (!grid || !posts || posts.length === 0) {
      if (grid && posts.length === 0) showError('No articles published yet.');
      return;
    }

    var html = '';
    posts.forEach(function (post, i) {
      var delay = (i % 3) + 1;
      html += createPostCard(post).replace('class="post-card reveal"', 'class="post-card reveal reveal-delay-' + delay + '"');
    });
    grid.innerHTML = html;

    // Re-observe new reveal elements for the fade-in animation
    if (window.RevealObserver) {
      grid.querySelectorAll('.reveal').forEach(function (el) {
        window.RevealObserver.observe(el);
      });
    }
  }

  // Attempt to fetch and render
  fetch(POSTS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch posts: ' + res.status);
      return res.json();
    })
    .then(function (data) {
      loadPosts(data.posts || []);
    })
    .catch(function () {
      // Graceful fallback — keep static content if provided
      // This fires only once; no retry needed
    });
})();
