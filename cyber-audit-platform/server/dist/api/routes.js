"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Placeholder for vulnerability summary
router.get('/vulnerabilities/summary', (req, res) => {
    res.json({
        critical: Math.floor(Math.random() * 5),
        high: Math.floor(Math.random() * 20),
        medium: Math.floor(Math.random() * 50),
        low: Math.floor(Math.random() * 100),
    });
});
// Placeholder for recent scan activity
router.get('/scans/recent', (req, res) => {
    res.json([
        { id: 1, target: '192.168.1.1', type: 'Nmap Fast Scan', date: new Date().toISOString(), status: 'Completed' },
        { id: 2, target: 'example.com', type: 'WPScan', date: new Date().toISOString(), status: 'Running' },
        { id: 3, target: '10.0.0.5', type: 'Nmap Aggressive Scan', date: new Date(Date.now() - 86400000).toISOString(), status: 'Completed' },
    ]);
});
// Placeholder for top open ports
router.get('/ports/top', (req, res) => {
    res.json([
        { port: 80, service: 'http', version: 'nginx 1.18.0', hosts: 15 },
        { port: 443, service: 'https', version: 'Apache httpd 2.4.41', hosts: 12 },
        { port: 22, service: 'ssh', version: 'OpenSSH 8.2p1', hosts: 10 },
        { port: 3306, service: 'mysql', version: 'MySQL 8.0.23', hosts: 5 },
    ]);
});
exports.default = router;
