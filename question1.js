//create an HTTP server using only Node.js core(no express, no npm packages). The server must run on port 3000 and support following routes:
// Get/updateUser append a new visitor entry with the current timestamp to visitors.log.
// Get/serverlog read and return the full contents of visitors.log.
// Post/backup copy the contents of visitors.log into a new file called backup.log.
//Get/clearlog clear the contentsof visitors.log
// Get/serverinfo Return system information in JSON format.
 
const http=require("http");
const fs=require("fs");
const os= require('os');
const url = require('url');
const path = require('path');
const PORT = 3000;
const logFile = path.join(__dirname, 'visitors.log');
const backupFile = path.join(__dirname, 'backup.log');
if(!fs.existsSync(logFile)){
    fs.writeFileSync(logFile, '');
}
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const route = parsedUrl.pathname;
if(method==='GET' && route==='/updateUser'){
    const timeStamp=new Date().toISOString()+'\n';
    fs.appendFile(logFile,timeStamp,(err)=>{
        if(err){
            res.writeHead(500);
            return res.end('Error writing to log file');
        }
        res.writeHead(200);
        res.end('Visitoe logged successfully');
    });
}
else if (method === 'GET' && route === '/serverlog') {
        fs.readFile(logFile, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error reading log file');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }
     else if (method === 'POST' && route === '/backup') {
            fs.copyFile(logFile, backupFile, (err) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error creating backup');
                }
                res.writeHead(200);
                res.end('Backup created successfully');
            });
        }
   else if (method === 'GET' && route === '/clearlog') {
           fs.writeFile(logFile, '', (err) => {
               if (err) {
                   res.writeHead(500);
                   return res.end('Error clearing log file');
               }
               res.writeHead(200);
               res.end('Log cleared successfully');
           });
       } 
       else if (method === 'GET' && route === '/serverinfo') {
               const info = {
                   platform: os.platform(),
                   architecture: os.arch(),
                   cpuCores: os.cpus().length,
                   freeMemory: os.freemem(),
                   totalMemory: os.totalmem(),
                   uptime: os.uptime(),
                   hostname: os.hostname()
               };
       
               res.writeHead(200, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify(info, null, 2));
           }
       else {
        res.writeHead(404);
        res.end('Route not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
