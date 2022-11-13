import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const SingleMe = ({ url }) => {
  const [doubleColumnPdf, setDoubleColumnPdf] = useState(null);
  const [singleColumnPdf, setSingleColumnPdf] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      const response = await fetch(url).then(res => res.arrayBuffer())
      const pdfDoc = await PDFDocument.load(response);
      setDoubleColumnPdf(pdfDoc);
    };
    fetchPDF();
  }, [url]);

  useEffect(() => { 
    const convertToSingleColumn = async () => {
      if (doubleColumnPdf) {
        getSingleColumnResult(doubleColumnPdf).then(pdfDoc => {
          setDoubleColumnPdf(pdfDoc);
        });
      }
    };
    convertToSingleColumn();
  }, [doubleColumnPdf]);

  const getSingleColumnResult = async () => {
    const singleColumnBytes = await toSingleColumn(doubleColumnPdf);
    const bytes  = new Uint8Array( singleColumnBytes ); 
    const blob   = new Blob( [ bytes ], { type: "application/pdf" } );
    const docUrl = URL.createObjectURL( blob );
    setSingleColumnPdf(docUrl);
  }

  const clonePages = async (doubleColumnPdf) => { 
    const pages = doubleColumnPdf.getPages();
    const clonedDocument = await PDFDocument.create();
    const clonedBytes= [];
    for (let i = 0; i < pages.length; ++i) {
      clonedBytes.push(i);
      clonedBytes.push(i);
    }
    const clonedPages = await clonedDocument.copyPages(doubleColumnPdf, clonedBytes);

    return [clonedPages, clonedDocument];
  }

  const toSingleColumn = async (doubleColumnPdf) =>{
    const [clonedPages, clonedDocument] = await clonePages(doubleColumnPdf);
    const singleColumnPdf = clonedDocument;
    const doubleColumnPages = doubleColumnPdf.getPages();
    let { width } = clonedPages[0].getMediaBox();
    const ww = width / 2.0;
    for (let i = 0; i < doubleColumnPages.length; i++) {
        let { x, y, width, height } = clonedPages[0].getMediaBox();
        console.log(`Page ${i}: ${x} ${y} ${width} ${height}`);
        clonedPages[2 * i].setMediaBox(x, y, ww, height);
        clonedPages[2 * i + 1].setMediaBox(x + ww, y, ww, height);
        singleColumnPdf.addPage(clonedPages[2 * i]);
        singleColumnPdf.addPage(clonedPages[2 * i + 1]);
        
    }
    const singleColumnBytes = await singleColumnPdf.save();
    console.log(`Returning ${singleColumnBytes.byteLength} bytes`);
    return singleColumnBytes;
  }
  if (!singleColumnPdf) return <div>Loading</div>
  return <iframe src={singleColumnPdf} type="application/pdf" />
};

export default SingleMe;