/**
 * Test script to view deployed sites
 * This simulates how middleware routes different domains
 */

// Simulate different domain requests
const testDomains = [
    { domain: 'localhost:3000', expected: 'Main domain (geekgolfers.com)' },
    { domain: 'geekgolfers.com', expected: 'Main domain' },
    { domain: 'shopgiay.com', expected: 'Tenant site → /sites/shopgiay.com' },
    { domain: 'hatdieu.com', expected: 'Tenant site → /sites/hatdieu.com' },
    { domain: 'shopgiay.local', expected: 'Local test tenant → /sites/shopgiay.local' },
];

function simulateMiddleware(hostname, path = '/') {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌐 Request: ${hostname}${path}`);
    console.log(`${'='.repeat(60)}`);

    // Remove port
    let cleanHostname = hostname.split(':')[0];

    // Handle localhost
    if (cleanHostname.includes('localhost') || cleanHostname.includes('127.0.0.1')) {
        if (!cleanHostname.endsWith('.local')) {
            cleanHostname = 'geekgolfers.com';
            console.log(`📍 Localhost detected → Mapped to: ${cleanHostname}`);
        } else {
            console.log(`📍 Local test domain: ${cleanHostname}`);
        }
    }

    const APP_DOMAIN = 'geekgolfers.com';

    // Main domain
    if (cleanHostname === APP_DOMAIN || cleanHostname === `www.${APP_DOMAIN}`) {
        console.log(`✅ Main Domain Routing`);
        console.log(`   Route: Normal Next.js routing`);
        console.log(`   URL: ${path}`);
        console.log(`   Handler: app${path === '/' ? '/page.tsx' : path + '/page.tsx'}`);
        return { type: 'main', route: path };
    }

    // Tenant domain
    console.log(`✅ Tenant Domain Routing`);
    console.log(`   Rewrite to: /sites/${cleanHostname}${path}`);
    console.log(`   Handler: app/sites/[domain]/page.tsx`);
    console.log(`   Params: { domain: "${cleanHostname}" }`);

    return { type: 'tenant', route: `/sites/${cleanHostname}${path}`, domain: cleanHostname };
}

console.log(`
╔════════════════════════════════════════════════════════════╗
║         MULTI-TENANT ROUTING SIMULATION                    ║
╚════════════════════════════════════════════════════════════╝
`);

// Test all domains
testDomains.forEach(({ domain, expected }) => {
    const result = simulateMiddleware(domain);
    console.log(`   Expected: ${expected}`);
    console.log(`   Result: ${result.type === 'main' ? 'Main domain' : `Tenant → ${result.route}`}`);
});

// Test with different paths
console.log(`\n\n${'='.repeat(60)}`);
console.log(`📄 Testing Different Paths`);
console.log(`${'='.repeat(60)}`);

const pathTests = [
    { domain: 'shopgiay.com', path: '/' },
    { domain: 'shopgiay.com', path: '/products' },
    { domain: 'shopgiay.com', path: '/about' },
    { domain: 'geekgolfers.com', path: '/editor' },
];

pathTests.forEach(({ domain, path }) => {
    simulateMiddleware(domain, path);
});

console.log(`\n\n${'='.repeat(60)}`);
console.log(`📋 Summary`);
console.log(`${'='.repeat(60)}`);
console.log(`
Main Domain (geekgolfers.com):
  - Editor, Dashboard, API routes
  - Normal Next.js routing
  - Access: http://localhost:3000

Tenant Domains (shopgiay.com, etc):
  - Customer websites
  - Routed to /sites/[domain]
  - Access: 
    • Local: Setup hosts file or use .local
    • Production: Custom domain with DNS + Nginx

Current Dev Server:
  - Running on: http://localhost:3000
  - Default: Main domain (geekgolfers.com)
  - To test tenant: Modify middleware.ts line 30
`);

console.log(`\n${'='.repeat(60)}`);
console.log(`🔧 How to View Tenant Sites Locally`);
console.log(`${'='.repeat(60)}`);
console.log(`
Option 1: Modify middleware.ts
  1. Open src/middleware.ts
  2. Uncomment line 30: hostname = "shopgiay.local"
  3. Restart dev server
  4. Visit: http://localhost:3000

Option 2: Use hosts file
  1. Edit hosts file:
     Windows: C:\\Windows\\System32\\drivers\\etc\\hosts
     Mac/Linux: /etc/hosts
  2. Add: 127.0.0.1  shopgiay.local
  3. Visit: http://shopgiay.local:3000

Option 3: Use curl with Host header
  curl -H "Host: shopgiay.com" http://localhost:3000
`);

console.log(`\n✨ Done!\n`);
