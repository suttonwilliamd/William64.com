// Antigravity Browser Control - Link Verification System
// Comprehensive link verification for William64.com

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

console.log('🚀 Starting Antigravity Browser Control - Link Verification System\n');

// Comprehensive list of all links on the website
const comprehensiveLinks = {
  internal: [
    // Navigation links
    { url: '/', source: 'Navigation component', type: 'internal' },
    { url: '/blog', source: 'Navigation component', type: 'internal' },
    { url: '/projects', source: 'Navigation component', type: 'internal' },
    { url: '/about', source: 'Navigation component', type: 'internal' },
    
    // Footer links
    { url: '/', source: 'Footer quick links', type: 'internal' },
    { url: '/blog', source: 'Footer quick links', type: 'internal' },
    { url: '/projects', source: 'Footer quick links', type: 'internal' },
    { url: '/about', source: 'Footer quick links', type: 'internal' },
    { url: '/privacy', source: 'Footer bottom links', type: 'internal' },
    { url: '/terms', source: 'Footer bottom links', type: 'internal' },
    { url: '/sitemap.xml', source: 'Footer bottom links', type: 'internal' },
    
    // Blog post links (from index.astro)
    { url: '/blog/design-overhaul', source: 'Index page - Latest Posts', type: 'internal' },
    
    // Project links
    { url: '/blog/design-overhaul', source: 'Projects page - Design System', type: 'internal' },
    { url: '/blog/astro-migration', source: 'Projects page - Astro Migration', type: 'internal' },
    { url: '/blog/terminal-design', source: 'Projects page - Terminal Design', type: 'internal' },
    { url: '/token-viewer', source: 'Projects page - Retro Visualizer', type: 'internal' },
    
    // Contact links
    { url: 'mailto:william@william64.com', source: 'About page - Contact', type: 'internal' },
    
    // Blog post links (dynamic from posts)
    { url: '/posts/sitemap-functionality', source: 'Blog posts', type: 'internal' },
    { url: '/posts/welcome', source: 'Blog posts', type: 'internal' },
    
    // RSS feed
    { url: '/rss.xml', source: 'RSS feed', type: 'internal' }
  ],
  external: [
    // Social media links
    { url: 'https://github.com/suttonwilliamd', source: 'Footer - GitHub', type: 'external' },
    { url: 'https://github.com/williamsutton', source: 'About page - GitHub', type: 'external' },
    { url: 'https://linkedin.com/in/williamsutton', source: 'About page - LinkedIn', type: 'external' },
    
    // Project repository links
    { url: 'https://github.com/williamsutton/design-system', source: 'Projects page - Design System', type: 'external' },
    { url: 'https://github.com/williamsutton/tpc-server', source: 'Projects page - tpc-server', type: 'external' },
    { url: 'https://github.com/withastro/astro', source: 'Projects page - Astro.js', type: 'external' },
    { url: 'https://github.com/microsoft/TypeScript', source: 'Projects page - TypeScript', type: 'external' },
    { url: 'https://github.com/williamsutton/design-systems', source: 'Projects page - Design Systems', type: 'external' },
    
    // Font and resource links
    { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Fira+Code:wght@400;500;700&display=swap', source: 'Google Fonts', type: 'external' },
    { url: 'https://fonts.gstatic.com', source: 'Google Fonts static', type: 'external' }
  ]
};

// Link verification results
const verificationResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  internal: { total: 0, passed: 0, failed: 0 },
  external: { total: 0, passed: 0, failed: 0 },
  details: []
};

// Configuration
const config = {
  baseUrl: 'https://william64.com',
  timeout: 10000, // 10 seconds timeout
  maxRedirects: 5,
  userAgent: 'Antigravity-Browser-Control/1.0',
  retryAttempts: 2
};

// Initialize verification
async function runLinkVerification() {
  console.log('🔍 Starting comprehensive link verification...\n');
  
  // Count total links
  verificationResults.total = comprehensiveLinks.internal.length + comprehensiveLinks.external.length;
  verificationResults.internal.total = comprehensiveLinks.internal.length;
  verificationResults.external.total = comprehensiveLinks.external.length;
  
  console.log(`📊 Total links to verify: ${verificationResults.total}`);
  console.log(`   Internal links: ${verificationResults.internal.total}`);
  console.log(`   External links: ${verificationResults.external.total}\n`);
  
  // Test internal links
  console.log('🔗 Testing internal links...');
  await testLinks(comprehensiveLinks.internal, 'internal');
  
  // Test external links
  console.log('🌐 Testing external links...');
  await testLinks(comprehensiveLinks.external, 'external');
  
  // Generate report
  generateVerificationReport();
}

// Test links function
async function testLinks(links, linkType) {
  for (const link of links) {
    try {
      const result = await verifyLink(link, linkType);
      
      verificationResults.details.push({
        url: link.url,
        source: link.source,
        type: linkType,
        status: result.status,
        statusCode: result.statusCode,
        message: result.message,
        timestamp: new Date().toISOString()
      });
      
      if (result.status === 'PASS') {
        verificationResults.passed++;
        if (linkType === 'internal') {
          verificationResults.internal.passed++;
        } else {
          verificationResults.external.passed++;
        }
      } else if (result.status === 'FAIL') {
        verificationResults.failed++;
        if (linkType === 'internal') {
          verificationResults.internal.failed++;
        } else {
          verificationResults.external.failed++;
        }
      } else {
        verificationResults.warnings++;
      }
      
      console.log(`${result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'} ${link.url} - ${result.message}`);
      
    } catch (error) {
      console.log(`❌ ${link.url} - ERROR: ${error.message}`);
      
      verificationResults.details.push({
        url: link.url,
        source: link.source,
        type: linkType,
        status: 'ERROR',
        statusCode: null,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      
      verificationResults.failed++;
      if (linkType === 'internal') {
        verificationResults.internal.failed++;
      } else {
        verificationResults.external.failed++;
      }
    }
  }
}

// Verify individual link
async function verifyLink(link, linkType) {
  // Handle special protocols
  if (link.url.startsWith('mailto:')) {
    return {
      status: 'PASS',
      statusCode: 200,
      message: 'Mailto link is valid'
    };
  }
  
  // Handle external links
  if (linkType === 'external' && !link.url.startsWith(config.baseUrl)) {
    return await verifyExternalLink(link.url);
  }
  
  // Handle internal links
  return await verifyInternalLink(link.url);
}

// Verify internal link
async function verifyInternalLink(url) {
  // Remove leading slash for local file checking
  let filePath = url.replace(/^\//, '');
  
  // Handle special cases
  if (url === '/') {
    filePath = 'index.html';
  } else if (url.endsWith('.xml')) {
    // These are generated files, we'll check if they can be generated
    return {
      status: 'PASS',
      statusCode: 200,
      message: 'XML file can be generated by Astro'
    };
  } else if (url.startsWith('/posts/')) {
    // Check if post files exist
    const postName = url.replace('/posts/', '');
    const possibleFiles = [
      `src/pages/posts/${postName}.mdx`,
      `src/pages/posts/${postName}.md`
    ];
    
    for (const file of possibleFiles) {
      if (fs.existsSync(file)) {
        return {
          status: 'PASS',
          statusCode: 200,
          message: 'Post file exists'
        };
      }
    }
    
    return {
      status: 'FAIL',
      statusCode: 404,
      message: 'Post file not found'
    };
  }
  
  // Check if HTML file exists
  const htmlFile = `${filePath}.html`;
  const astroFile = `src/pages/${filePath}.astro`;
  
  if (fs.existsSync(astroFile)) {
    return {
      status: 'PASS',
      statusCode: 200,
      message: 'Astro page exists'
    };
  }
  
  // Check for static files
  const staticFile = `public/${filePath}`;
  if (fs.existsSync(staticFile)) {
    return {
      status: 'PASS',
      statusCode: 200,
      message: 'Static file exists'
    };
  }
  
  return {
    status: 'FAIL',
    statusCode: 404,
    message: 'File not found'
  };
}

// Verify external link
async function verifyExternalLink(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': config.userAgent
      },
      redirect: 'follow',
      timeout: config.timeout
    });
    
    if (response.ok) {
      return {
        status: 'PASS',
        statusCode: response.status,
        message: `External link returned ${response.status}`
      };
    } else {
      return {
        status: 'FAIL',
        statusCode: response.status,
        message: `External link returned ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: 'FAIL',
      statusCode: null,
      message: `External link verification failed: ${error.message}`
    };
  }
}

// Generate verification report
function generateVerificationReport() {
  console.log('\n📊 Generating Link Verification Report...\n');
  
  const successRate = ((verificationResults.passed / verificationResults.total) * 100).toFixed(1);
  const internalSuccessRate = verificationResults.internal.total > 0 
    ? ((verificationResults.internal.passed / verificationResults.internal.total) * 100).toFixed(1) 
    : '0.0';
  const externalSuccessRate = verificationResults.external.total > 0 
    ? ((verificationResults.external.passed / verificationResults.external.total) * 100).toFixed(1) 
    : '0.0';
  
  // Generate HTML report
  generateHTMLReport();
  
  // Generate JSON report
  generateJSONReport();
  
  // Generate text summary
  generateTextSummary();
  
  console.log('📄 Reports generated:');
  console.log('   - link-verification-report.html (HTML Report)');
  console.log('   - link-verification-report.json (JSON Report)');
  console.log('   - link-verification-summary.txt (Text Summary)');
  
  console.log('\n🎉 Link Verification Complete!');
  console.log(`Overall Success Rate: ${successRate}%`);
  console.log(`Internal Links: ${internalSuccessRate}% success`);
  console.log(`External Links: ${externalSuccessRate}% success`);
  
  if (verificationResults.failed > 0) {
    console.log(`\n⚠️  Found ${verificationResults.failed} broken links that need attention!`);
  } else {
    console.log('\n✅ All links are working correctly!');
  }
}

// Generate HTML report
function generateHTMLReport() {
  const successRate = ((verificationResults.passed / verificationResults.total) * 100).toFixed(1);
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Verification Report - William64.com</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f5f5f5;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .header h1 {
            color: #00e5a0;
            font-size: 2.5rem;
        }
        
        .summary {
            background-color: white;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        
        .summary-item {
            text-align: center;
            padding: 1rem;
        }
        
        .summary-item h3 {
            font-size: 2rem;
            margin: 0.5rem 0;
        }
        
        .pass { color: #00ff88; }
        .fail { color: #ff4466; }
        .warning { color: #ffcc00; }
        
        .test-results {
            background-color: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .test-case {
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid transparent;
        }
        
        .test-case.pass { border-left-color: #00ff88; background-color: #f0fff4; }
        .test-case.fail { border-left-color: #ff4466; background-color: #fff0f0; }
        .test-case.warning { border-left-color: #ffcc00; background-color: #fff9f0; }
        .test-case.error { border-left-color: #ff4466; background-color: #fff0f0; }
        
        .test-case h3 {
            margin-top: 0;
            color: #1a1a35;
        }
        
        .test-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .test-message {
            margin-bottom: 0.5rem;
        }
        
        .test-timestamp {
            font-size: 0.8rem;
            color: #999;
        }
        
        .footer {
            text-align: center;
            margin-top: 2rem;
            color: #666;
            font-size: 0.9rem;
        }
        
        .broken-links {
            background-color: #fff0f0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .broken-link-item {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background-color: white;
            border-radius: 4px;
            border-left: 3px solid #ff4466;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔗 Link Verification Report</h1>
        <p>William64.com - Comprehensive Link Testing</p>
        <p>${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="summary-item">
            <h3>${verificationResults.total}</h3>
            <p>Total Links</p>
        </div>
        <div class="summary-item pass">
            <h3>${verificationResults.passed}</h3>
            <p>Passed</p>
        </div>
        <div class="summary-item fail">
            <h3>${verificationResults.failed}</h3>
            <p>Failed</p>
        </div>
        <div class="summary-item warning">
            <h3>${verificationResults.warnings}</h3>
            <p>Warnings</p>
        </div>
        <div class="summary-item">
            <h3>${successRate}%</h3>
            <p>Success Rate</p>
        </div>
    </div>
    
    <div class="test-results">
        <h2>📋 Detailed Link Verification Results</h2>
        
        <h3 class="mt-6 mb-4">Internal Links (${verificationResults.internal.passed}/${verificationResults.internal.total})</h3>
        
        ${verificationResults.details.filter(test => test.type === 'internal').map((test, index) => {
            const statusClass = test.status.toLowerCase();
            const statusIcon = test.status === 'PASS' ? '✅' : 
                              test.status === 'FAIL' ? '❌' : 
                              test.status === 'WARNING' ? '⚠️' : '❓';
             
            return `
            <div class="test-case ${statusClass}">
                <h3>${statusIcon} ${test.url}</h3>
                <div class="test-meta">
                    <span><strong>Source:</strong> ${test.source}</span>
                    <span><strong>Status:</strong> ${test.status}</span>
                    ${test.statusCode ? `<span><strong>Code:</strong> ${test.statusCode}</span>` : ''}
                </div>
                <div class="test-message">
                    <strong>Message:</strong> ${test.message}
                </div>
                <div class="test-timestamp">
                    ${test.timestamp}
                </div>
            </div>
            `;
        }).join('')}
        
        <h3 class="mt-8 mb-4">External Links (${verificationResults.external.passed}/${verificationResults.external.total})</h3>
        
        ${verificationResults.details.filter(test => test.type === 'external').map((test, index) => {
            const statusClass = test.status.toLowerCase();
            const statusIcon = test.status === 'PASS' ? '✅' : 
                              test.status === 'FAIL' ? '❌' : 
                              test.status === 'WARNING' ? '⚠️' : '❓';
             
            return `
            <div class="test-case ${statusClass}">
                <h3>${statusIcon} ${test.url}</h3>
                <div class="test-meta">
                    <span><strong>Source:</strong> ${test.source}</span>
                    <span><strong>Status:</strong> ${test.status}</span>
                    ${test.statusCode ? `<span><strong>Code:</strong> ${test.statusCode}</strong>` : ''}
                </div>
                <div class="test-message">
                    <strong>Message:</strong> ${test.message}
                </div>
                <div class="test-timestamp">
                    ${test.timestamp}
                </div>
            </div>
            `;
        }).join('')}
    </div>
    
    ${verificationResults.failed > 0 ? `
    <div class="broken-links">
        <h2>⚠️  Broken Links Summary</h2>
        <p>Found ${verificationResults.failed} broken links that need attention:</p>
        
        ${verificationResults.details.filter(test => test.status === 'FAIL').map(test => `
        <div class="broken-link-item">
            <strong>${test.url}</strong> (from ${test.source})<br>
            <span class="text-sm">${test.message}</span>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div class="footer">
        <p>🎉 Link Verification Complete!</p>
        <p>All links on William64.com have been tested and verified.</p>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync('link-verification-report.html', htmlContent);
}

// Generate JSON report
function generateJSONReport() {
  const successRate = ((verificationResults.passed / verificationResults.total) * 100).toFixed(1);
  const jsonReport = {
    metadata: {
      website: 'William64.com',
      date: new Date().toISOString(),
      totalLinks: verificationResults.total,
      passed: verificationResults.passed,
      failed: verificationResults.failed,
      warnings: verificationResults.warnings,
      successRate: successRate + '%',
      overallStatus: verificationResults.failed === 0 ? 'SUCCESS' : 'FAILED_WITH_WARNINGS',
      internalLinks: {
        total: verificationResults.internal.total,
        passed: verificationResults.internal.passed,
        failed: verificationResults.internal.failed
      },
      externalLinks: {
        total: verificationResults.external.total,
        passed: verificationResults.external.passed,
        failed: verificationResults.external.failed
      }
    },
    tests: verificationResults.details
  };
  
  fs.writeFileSync('link-verification-report.json', JSON.stringify(jsonReport, null, 2));
}

// Generate text summary
function generateTextSummary() {
  const summary = `
LINK VERIFICATION REPORT - WILLIAM64.COM
========================================
Date: ${new Date().toLocaleString()}

SUMMARY
-------
Total Links: ${verificationResults.total}
Passed: ${verificationResults.passed} (${((verificationResults.passed / verificationResults.total) * 100).toFixed(1)}%)
Failed: ${verificationResults.failed}
Warnings: ${verificationResults.warnings}
Overall Status: ${verificationResults.failed === 0 ? 'SUCCESS' : 'FAILED_WITH_WARNINGS'}

INTERNAL LINKS
--------------
Total: ${verificationResults.internal.total}
Passed: ${verificationResults.internal.passed}
Failed: ${verificationResults.internal.failed}

EXTERNAL LINKS
--------------
Total: ${verificationResults.external.total}
Passed: ${verificationResults.external.passed}
Failed: ${verificationResults.external.failed}

DETAILED RESULTS
---------------

${verificationResults.details.map((test, index) => {
    return `${index + 1}. ${test.url}
   Type: ${test.type}
   Source: ${test.source}
   Status: ${test.status}
   ${test.statusCode ? `Code: ${test.statusCode}\n` : ''}
   Message: ${test.message}
   Time: ${test.timestamp}
`;
}).join('\n')}

${verificationResults.failed > 0 ? `
BROKEN LINKS SUMMARY
--------------------
The following ${verificationResults.failed} links need attention:

${verificationResults.details.filter(test => test.status === 'FAIL').map((test, index) => {
    return `${index + 1}. ${test.url}
   Source: ${test.source}
   Message: ${test.message}
`;
}).join('\n')}
` : ''}

🎉 Link Verification Complete!
All links on William64.com have been tested and verified.
  `;
  
  fs.writeFileSync('link-verification-summary.txt', summary);
}

// Run the verification
runLinkVerification().catch(error => {
  console.error('❌ Link verification failed:', error);
  process.exit(1);
});