import html2pdf from 'html2pdf.js';

/**
 * Generate and download PDF from strategy content
 */
export const downloadStrategyPdf = (strategy, platform, userInterest, targetInterest) => {
    const node = document.getElementById('pdf-wrapper');
    if (!node) {
        alert('Nothing to print');
        return;
    }

    // Create temporary print stylesheet
    const style = document.createElement('style');
    style.id = 'print-theme';
    style.textContent = `
    #pdf-wrapper,
    #pdf-wrapper * {
      background: transparent !important;
      color: #222 !important;
    }

    #pdf-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 18mm 15mm;
      display: flex;
      flex-wrap: wrap;
      gap: 12mm;
      font-family: "Poppins", sans-serif;
    }

    #pdf-wrapper h1 {
      flex: 1 0 100%;
      margin: 0 0 6mm 0;
      font-size: 24pt;
      color: #5e56f0 !important;
    }

    #pdf-wrapper .date-stamp {
      flex: 1 0 100%;
      margin: -4mm 0 8mm 0;
      font-size: 9pt;
      color: #666 !important;
    }

    #pdf-wrapper .card {
      flex: 1 0 100%;
      max-width: 100%;
      background: #fafafa !important;
      border: 1px solid #ddd !important;
      border-radius: 6px;
      padding: 14pt 16pt;
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 8mm;
    }

    #pdf-wrapper .cardTitle {
      font-size: 13pt !important;
      font-weight: 600;
      margin: 0 0 6pt 0;
      border-bottom: 1px solid #5e56f0;
      padding-bottom: 4pt;
    }

    #pdf-wrapper li {
      font-size: 10pt !important;
      margin-bottom: 5pt;
      line-height: 1.35;
    }

    #pdf-wrapper footer {
      flex: 1 0 100%;
      margin-top: 12mm;
      text-align: center;
      font-size: 8pt;
      color: #888 !important;
    }
  `;
    document.head.appendChild(style);

    // Create header and footer
    const capPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
    const header = document.createElement('h1');
    header.textContent = `Steps to transform your ${capPlatform} algorithm from "${userInterest}" to "${targetInterest}"`;

    const date = document.createElement('p');
    date.className = 'date-stamp';
    date.textContent = 'Generated on ' + new Date().toLocaleDateString();

    const footer = document.createElement('footer');
    footer.textContent = 'For education purposes only';

    node.prepend(date);
    node.prepend(header);
    node.appendChild(footer);

    // Generate PDF
    html2pdf()
        .from(node)
        .set({
            margin: 0,
            filename: `${strategy?.title || 'AI_Recommendations'}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .save()
        .finally(() => {
            header.remove();
            date.remove();
            footer.remove();
            style.remove();
        });
};

export default downloadStrategyPdf;
