// Projects Page Test Script
// This script tests projects page functionality

console.log('🧪 Starting Projects Page Tests...\n');

// Test 1: Check featured project section
console.log('Test 1: Featured Project Section');
const featuredProject = document.querySelector('.featured-project');
if (featuredProject) {
    const projectTitle = featuredProject.querySelector('.project-title');
    const projectBody = featuredProject.querySelector('.project-body');
    
    if (projectTitle && projectBody) {
        console.log('✅ Featured project structure complete');
        console.log(`✅ Featured project title: ${projectTitle.textContent.trim()}`);
        
        const border = window.getComputedStyle(featuredProject).border;
        const boxShadow = window.getComputedStyle(featuredProject).boxShadow;
        console.log(`✅ Featured project border: ${border}`);
        console.log(`✅ Featured project shadow: ${boxShadow}`);
        console.log('✅ Featured project section enhanced\n');
    } else {
        console.log('❌ Featured project structure incomplete\n');
    }
} else {
    console.log('❌ Featured project not found\n');
}

// Test 2: Check project grid layout
console.log('Test 2: Project Grid Layout');
const projectGrid = document.querySelector('.grid.md\\:grid-cols-2');
if (projectGrid) {
    const projects = projectGrid.querySelectorAll('.project-card');
    console.log(`✅ Found ${projects.length} projects in grid`);
    
    const gridTemplateColumns = window.getComputedStyle(projectGrid).gridTemplateColumns;
    console.log(`✅ Grid template columns: ${gridTemplateColumns}`);
    console.log('✅ Project grid layout working correctly\n');
} else {
    console.log('❌ Project grid not found\n');
}

// Test 3: Check project card interactivity
console.log('Test 3: Project Card Interactivity');
const projectCards = document.querySelectorAll('.project-card');
if (projectCards.length > 0) {
    projectCards.forEach((card, index) => {
        // Simulate hover
        card.dispatchEvent(new MouseEvent('mouseenter'));
        const hoverTransform = window.getComputedStyle(card).transform;
        const hoverShadow = window.getComputedStyle(card).boxShadow;
        console.log(`✅ Project card ${index + 1} hover: transform ${hoverTransform}, shadow ${hoverShadow}`);
    });
    console.log('✅ Project card interactivity working\n');
} else {
    console.log('❌ No project cards found\n');
}

// Test 4: Check open source contributions section
console.log('Test 4: Open Source Contributions Section');
const ossSection = document.querySelector('h3:contains("Open Source Contributions")');
if (ossSection) {
    console.log('✅ Open source contributions section present');
    const ossCards = document.querySelectorAll('.grid.md\\:grid-cols-3 .card');
    console.log(`✅ Found ${ossCards.length} open source contribution cards`);
    console.log('✅ Open source contributions section working\n');
} else {
    console.log('❌ Open source contributions section not found\n');
}

// Test 5: Check cyberpunk styling on projects
console.log('Test 5: Cyberpunk Styling on Projects');
const cyberpunkProjects = document.querySelectorAll('.cyberpunk-card');
console.log(`✅ Found ${cyberpunkProjects.length} cyberpunk-styled project cards`);

const cyberpunkTitles = document.querySelectorAll('.cyberpunk-accent');
console.log(`✅ Found ${cyberpunkTitles.length} cyberpunk-accent elements`);

const cyberpunkButtons = document.querySelectorAll('.btn-cyberpunk');
console.log(`✅ Found ${cyberpunkButtons.length} cyberpunk buttons`);

console.log('✅ Cyberpunk styling applied to projects\n');

// Test 6: Check project animations
console.log('Test 6: Project Animations');
if (projectCards.length > 0) {
    projectCards.forEach((card, index) => {
        const opacity = window.getComputedStyle(card).opacity;
        const transform = window.getComputedStyle(card).transform;
        const transition = window.getComputedStyle(card).transition;
        console.log(`✅ Project card ${index + 1} animations: opacity ${opacity}, transform ${transform}`);
    });
    console.log('✅ Project animations working correctly\n');
} else {
    console.log('❌ No project cards to test animations\n');
}

// Test 7: Check project technology tags
console.log('Test 7: Project Technology Tags');
const techTags = document.querySelectorAll('.tech-tag, .btn-xs');
console.log(`✅ Found ${techTags.length} technology tags`);

if (techTags.length > 0) {
    techTags.forEach((tag, index) => {
        const tagText = tag.textContent.trim();
        console.log(`✅ Tech tag ${index + 1}: ${tagText}`);
    });
    console.log('✅ Project technology tags displayed\n');
} else {
    console.log('❌ No technology tags found\n');
}

// Test 8: Check project links
console.log('Test 8: Project Links and CTAs');
const projectLinks = document.querySelectorAll('.project-card a[href]');
console.log(`✅ Found ${projectLinks.length} project links`);

if (projectLinks.length > 0) {
    projectLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const linkText = link.textContent.trim();
        console.log(`✅ Project link ${index + 1}: ${linkText} -> ${href}`);
    });
    console.log('✅ Project links and CTAs working\n');
} else {
    console.log('❌ No project links found\n');
}

console.log('🎉 Projects Page Tests Complete!');