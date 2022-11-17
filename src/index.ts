import puppeteer from 'puppeteer'; 
import fs from "fs";
import PDFDocument from "pdfkit"; 


const URL = "https://github.com/";

const path: string[] = [ 
    "tententgc", 
    "nutthanon",
]

const Screenshot = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage(); 
    await page.setViewport({ width: 1280, height: 800 });

    for (let i = 0; i < path.length; i++) {
        let url = URL
        url += path[i] 
        await page.goto(url, { waitUntil: "networkidle2" }); 
        await page.screenshot({
            path: `./images/${path[i].split("/").join("-").length === 0
                    ? "home"
                    : path[i].split("/").join("-")
                }.png`,
            fullPage: true,
        });
    }

    const doc = new PDFDocument(); 

    doc.pipe(fs.createWriteStream("output.pdf"));

    for (let i = 0; i < path.length; i++) {
        doc.image(
            `./images/${path[i].split("/").join("-").length === 0
                ? "home"
                : path[i].split("/").join("-")
            }.png`,
            {
                cover: [doc.page.width - 100, doc.page.height - 300],
                align: "center",
                valign: "center",
                fit: [doc.page.width - 100, doc.page.height - 300],
            }
        );
        doc.addPage();
    }

    doc.end();


    await page.close();                  
    await browser.close();
    console.log("Done");
}

Screenshot();
