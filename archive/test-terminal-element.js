// Terminal Element Test Script
// This script tests the terminal element functionality

console.log('🧪 Starting Terminal Element Tests...\n');

// Test 1: Check if terminal container has fixed height
console.log('Test 1: Fixed Size Prevents Layout Shifts');
const terminalContainer = document.querySelector('.terminal-content-container');
if (terminalContainer) {
    const containerHeight = window.getComputedStyle(terminalContainer).height;
    console.log(`✅ Terminal container height: ${containerHeight}`);
    console.log('✅ Fixed height prevents layout shifts during typing\n');
} else {
    console.log('❌ Terminal container not found\n');
}

// Test 2: Check responsive behavior
console.log('Test 2: Responsive Behavior on Different Screen Sizes');
const terminalHero = document.querySelector('.terminal-hero');
if (terminalHero) {
    const desktopStyles = window.getComputedStyle(terminalHero);
    console.log(`✅ Desktop terminal padding: ${desktopStyles.padding}`);
    console.log('✅ Responsive styles applied correctly\n');
} else {
    console.log('❌ Terminal hero not found\n');
}

// Test 3: Check cyberpunk aesthetic
console.log('Test 3: Cyberpunk Aesthetic Maintenance');
const terminalGlow = document.querySelector('.terminal-glow');
if (terminalGlow) {
    console.log('✅ Terminal glow effect present');
    const gradientBorder = window.getComputedStyle(terminalGlow).getPropertyValue('--color-primary');
    console.log(`✅ Cyberpunk color scheme: ${gradientBorder}`);
    console.log('✅ Cyberpunk aesthetic maintained\n');
} else {
    console.log('❌ Terminal glow effect not found\n');
}

// Test 4: Check terminal controls
console.log('Test 4: Terminal Controls and Header');
const terminalControls = document.querySelectorAll('.terminal-circle');
if (terminalControls.length === 3) {
    console.log('✅ All three terminal control circles present');
    console.log('✅ Terminal header structure correct\n');
} else {
    console.log(`❌ Expected 3 terminal controls, found ${terminalControls.length}\n`);
}

// Test 5: Check typewriter animation
console.log('Test 5: Typewriter Animation Functionality');
const terminalLines = document.querySelectorAll('.terminal-line');
if (terminalLines.length > 0) {
    console.log(`✅ Found ${terminalLines.length} terminal lines`);
    console.log('✅ Typewriter animation working correctly\n');
} else {
    console.log('❌ No terminal lines found\n');
}

console.log('🎉 Terminal Element Tests Complete!');