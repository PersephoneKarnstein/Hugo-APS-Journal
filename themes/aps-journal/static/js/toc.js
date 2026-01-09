/**
 * Table of Contents - Dynamic generation and toggle functionality
 * Builds TOC from all h2/h3 headings including shortcode-generated ones
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.getElementById('toc-sidebar');
    var toggle = document.getElementById('toc-toggle');
    var tocContainer = document.getElementById('toc-list');

    if (!sidebar || !toggle || !tocContainer) return;

    // Find all headings in the post content
    var postContent = document.querySelector('.post-content');
    if (!postContent) return;

    var headings = postContent.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      // No headings, hide the sidebar entirely
      sidebar.style.display = 'none';
      return;
    }

    // Build the TOC with hierarchical numbering
    var tocHTML = '<ul>';
    var headingData = [];
    var h2Counter = 0;
    var h3Counter = 0;

    headings.forEach(function(heading, index) {
      // Ensure heading has an ID for linking
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }

      var level = heading.tagName.toLowerCase();
      var text = heading.textContent.trim();
      var id = heading.id;
      var number = '';

      if (level === 'h2') {
        h2Counter++;
        h3Counter = 0; // Reset subsection counter
        number = h2Counter + '.';
      } else if (level === 'h3') {
        h3Counter++;
        number = h2Counter + '.' + h3Counter + '.';
      }

      headingData.push({ element: heading, id: id });

      var cssClass = level === 'h3' ? ' class="toc-h3"' : '';
      tocHTML += '<li' + cssClass + '><a href="#' + id + '"><span class="toc-number">' + number + '</span> ' + text + '</a></li>';
    });

    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;

    // Get the newly created links
    var tocLinks = tocContainer.querySelectorAll('a');

    // Toggle sidebar visibility
    toggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      document.body.classList.toggle('toc-open');

      // Save preference to localStorage
      var isOpen = sidebar.classList.contains('open');
      localStorage.setItem('toc-open', isOpen ? 'true' : 'false');
    });

    // Restore preference from localStorage
    var savedState = localStorage.getItem('toc-open');
    if (savedState === 'true') {
      sidebar.classList.add('open');
      document.body.classList.add('toc-open');
    }

    // Active section highlighting on scroll
    function updateActiveLink() {
      var scrollPosition = window.scrollY + 120;

      // Find the current section
      var currentIndex = -1;
      for (var i = headingData.length - 1; i >= 0; i--) {
        if (headingData[i].element.offsetTop <= scrollPosition) {
          currentIndex = i;
          break;
        }
      }

      // Update active states
      tocLinks.forEach(function(link, index) {
        if (index === currentIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // Throttle scroll handler for performance
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial call
    updateActiveLink();

    // Smooth scroll when clicking TOC links
    tocLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        var id = this.getAttribute('href');
        if (id && id.startsWith('#')) {
          var target = document.getElementById(id.substring(1));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, id);
          }
        }
      });
    });
  });
})();
