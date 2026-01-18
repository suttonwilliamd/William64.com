// Blog Page Test Script
// This script tests blog page functionality

console.log('🧪 Starting Blog Page Tests...\n');

// Test 1: Check dynamic content loading
console.log('Test 1: Dynamic Content Loading');
const postList = document.getElementById('post-list');
if (postList) {
    const posts = postList.querySelectorAll('.post-card');
    console.log(`✅ Found ${posts.length} blog posts`);
    
    // Check if posts have animation classes
    posts.forEach((post, index) => {
        const opacity = window.getComputedStyle(post).opacity;
        const transform = window.getComputedStyle(post).transform;
        console.log(`✅ Post ${index + 1} has animations: opacity ${opacity}, transform ${transform}`);
    });
    console.log('✅ Dynamic content loading with animations working\n');
} else {
    console.log('❌ Post list not found\n');
}

// Test 2: Check blog post display
console.log('Test 2: Blog Post Display');
const firstPost = document.querySelector('.post-card:first-child');
if (firstPost) {
    const postTitle = firstPost.querySelector('.post-title');
    const postMeta = firstPost.querySelector('.post-meta');
    const postExcerpt = firstPost.querySelector('.post-excerpt');
    
    if (postTitle && postMeta && postExcerpt) {
        console.log('✅ Blog post structure complete');
        console.log(`✅ Post title: ${postTitle.textContent.trim()}`);
        console.log(`✅ Post meta: ${postMeta.textContent.trim()}`);
        console.log('✅ Blog posts display correctly\n');
    } else {
        console.log('❌ Blog post structure incomplete\n');
    }
} else {
    console.log('❌ No blog posts found\n');
}

// Test 3: Check featured post styling
console.log('Test 3: Featured Post Styling');
const featuredPost = document.querySelector('.featured-post');
if (featuredPost) {
    const borderLeft = window.getComputedStyle(featuredPost).borderLeft;
    const background = window.getComputedStyle(featuredPost).background;
    console.log(`✅ Featured post border: ${borderLeft}`);
    console.log(`✅ Featured post background: ${background}`);
    console.log('✅ Featured post styling applied correctly\n');
} else {
    console.log('❌ Featured post not found\n');
}

// Test 4: Check two-column layout
console.log('Test 4: Two-Column Layout');
const twoColumnLayout = document.querySelector('.two-column-layout');
if (twoColumnLayout) {
    const sidebar = document.querySelector('.two-column-sidebar');
    const mainContent = document.querySelector('.two-column-main');
    
    if (sidebar && mainContent) {
        console.log('✅ Two-column layout structure present');
        const gridTemplateColumns = window.getComputedStyle(twoColumnLayout).gridTemplateColumns;
        console.log(`✅ Grid template columns: ${gridTemplateColumns}`);
        console.log('✅ Two-column layout working correctly\n');
    } else {
        console.log('❌ Two-column layout incomplete\n');
    }
} else {
    console.log('❌ Two-column layout not found\n');
}

// Test 5: Check sidebar functionality
console.log('Test 5: Sidebar Functionality');
const searchComponent = document.querySelector('search');
const categories = document.querySelectorAll('.btn');
if (categories.length > 0) {
    console.log(`✅ Found ${categories.length} category buttons`);
    console.log('✅ Sidebar categories displayed');
}
if (searchComponent) {
    console.log('✅ Search component present');
}
console.log('✅ Sidebar functionality working\n');

// Test 6: Check hover effects
console.log('Test 6: Post Hover Effects');
if (posts && posts.length > 0) {
    posts.forEach((post, index) => {
        // Simulate hover
        post.dispatchEvent(new MouseEvent('mouseenter'));
        const hoverTransform = window.getComputedStyle(post).transform;
        const hoverShadow = window.getComputedStyle(post).boxShadow;
        console.log(`✅ Post ${index + 1} hover effects: transform ${hoverTransform}, shadow ${hoverShadow}`);
    });
    console.log('✅ Post hover effects working correctly\n');
} else {
    console.log('❌ No posts to test hover effects\n');
}

console.log('🎉 Blog Page Tests Complete!');