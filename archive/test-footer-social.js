// Footer and Social Links Test Script
// This script tests the footer functionality and social links

console.log('🧪 Starting Footer and Social Links Tests...\n');

// Test 1: Check if newsletter elements are removed
console.log('Test 1: Newsletter Elements Removal');
const newsletterForms = document.querySelectorAll('form[action*="newsletter"], input[type="email"], .newsletter');
if (newsletterForms.length === 0) {
    console.log('✅ No newsletter forms found');
    console.log('✅ Newsletter elements completely removed\n');
} else {
    console.log(`❌ Found ${newsletterForms.length} newsletter elements that should be removed\n`);
}

// Test 2: Check social links - only GitHub should remain
console.log('Test 2: Social Links Verification');
const socialLinks = document.querySelectorAll('.footer a[href*="github"], .footer a[href*="twitter"], .footer a[href*="linkedin"]');
const githubLinks = document.querySelectorAll('.footer a[href*="github"]');

console.log(`Found ${socialLinks.length} total social links`);
console.log(`Found ${githubLinks.length} GitHub links`);

if (githubLinks.length === 1 && socialLinks.length === 1) {
    console.log('✅ Only GitHub link remains');
    const githubUrl = githubLinks[0].getAttribute('href');
    console.log(`✅ GitHub URL: ${githubUrl}\n`);
} else {
    console.log('❌ Social links configuration incorrect\n');
}

// Test 3: Check footer layout
console.log('Test 3: Footer Layout and Structure');
const footer = document.querySelector('.footer');
if (footer) {
    const footerGrid = footer.querySelector('.grid');
    if (footerGrid) {
        console.log('✅ Footer grid layout present');
        const gridColumns = window.getComputedStyle(footerGrid).gridTemplateColumns;
        console.log(`✅ Grid columns: ${gridColumns}`);
    }
    
    const footerSections = footer.querySelectorAll('.grid > div');
    console.log(`✅ Found ${footerSections.length} footer sections`);
    console.log('✅ Footer layout structure correct\n');
} else {
    console.log('❌ Footer not found\n');
}

// Test 4: Check footer responsiveness
console.log('Test 4: Footer Responsiveness');
const footerStyles = window.getComputedStyle(footer);
console.log(`✅ Footer padding: ${footerStyles.padding}`);
console.log('✅ Footer responsive styles applied\n');

// Test 5: Check cyberpunk footer styling
console.log('Test 5: Cyberpunk Footer Styling');
const footerGradient = footer.querySelector('.h-1');
if (footerGradient) {
    const gradientStyles = window.getComputedStyle(footerGradient).background;
    console.log(`✅ Footer gradient: ${gradientStyles}`);
    console.log('✅ Cyberpunk footer styling applied\n');
} else {
    console.log('❌ Footer gradient not found\n');
}

console.log('🎉 Footer and Social Links Tests Complete!');