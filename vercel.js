{
    "version": 2,
    "builds": [
        {
            "src": "src/index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/src/index.js"
        }
    ]
}

//version 2 = current vercel format
//builds: tells which file is the entry point
//@vercel/node: the builder for Node.js/Express apps
//routesss: catch all incoming requests, /(.*) = anything, /src/index.js = the entry point 
//this tells vercel to forward all requests to index.js 