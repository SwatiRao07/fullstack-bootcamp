import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

const product = {
  id: "p1",
  name: "Sony WH-1000XM5",
  price: "$399",
  stock: 25
};


app.get('/api/product', (req: Request, res: Response) => {
  res.json(product);
});


const head = (title: string) => `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/style.css">
    </head>
`;


app.get('/ssr', (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    ${head('SSR - Product Page')}
    <body class="ssr">
        <div class="container">
            <h1>SSR: Server-Side Rendering</h1>
            <p class="description">Look at View Source! The content is baked into the HTML string on the server.</p>
            <div class="product-card">
                <h2>${product.name}</h2>
                <p class="price">Price: <span>${product.price}</span></p>
                <p class="stock">In Stock: <span>${product.stock}</span></p>
                <button id="add-to-cart" class="btn">Add to Cart</button>
            </div>
            <a href="/">Back to Home</a>
        </div>
        <script src="/hydrate.js"></script>
    </body>
    </html>
  `;
  res.send(html);
});


const ssgPath = path.join(import.meta.dir, 'public', 'product-static.html');
const ssgContent = `
    <!DOCTYPE html>
    <html lang="en">
    ${head('SSG - Product Page')}
    <body class="ssg">
        <div class="container">
            <h1>SSG: Static Site Generation</h1>
            <p class="description">This is a 100% static file served directly from the disk.</p>
            <div class="product-card">
                <h2>${product.name}</h2>
                <p class="price">Price: <span>${product.price}</span></p>
                <p class="stock">In Stock: <span>${product.stock}</span></p>
                <button id="add-to-cart" class="btn">Add to Cart</button>
            </div>
            <a href="/">Back to Home</a>
        </div>
        <script src="/hydrate.js"></script>
    </body>
    </html>
`;

if (!fs.existsSync(path.join(import.meta.dir, 'public'))) {
  fs.mkdirSync(path.join(import.meta.dir, 'public'));
}
fs.writeFileSync(ssgPath, ssgContent);


app.use(express.static(path.join(import.meta.dir, 'public')));


app.get('/csr', (req: Request, res: Response) => {
    res.sendFile(path.join(import.meta.dir, 'public', 'csr.html'));
});


app.get('/ssg', (req: Request, res: Response) => {
    res.sendFile(path.join(import.meta.dir, 'public', 'product-static.html'));
});


app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    ${head('Rendering Models Demo')}
    <body>
        <div class="container">
            <h1>Rendering Models</h1>
            <nav>
                <ul>
                    <li><a href="/csr">CSR (Client Side Rendering)</a></li>
                    <li><a href="/ssr">SSR (Server Side Rendering)</a></li>
                    <li><a href="/ssg">SSG (Static Site Generation)</a></li>
                </ul>
            </nav>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});