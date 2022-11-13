const fetch = require('node-fetch');

exports.handler = async (event, _context) => {
  const pdfId = event.queryStringParameters.pdfId;
  const response = await fetch(`https://arxiv.org/pdf/${pdfId}`)
  const pdfBlob = await response.buffer();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      },
    body: pdfBlob.toString('base64'),
    isBase64Encoded: true,
    }
}
