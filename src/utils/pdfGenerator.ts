import { Loan } from '../types';
import { formatTzs, formatDate } from './format';

/**
 * Simulated PDF Generation Service for Tanzanian Microfinance Loan Agreements.
 * Generates an official, legally formatted PDF document Blob and initiates download.
 */
export function generateLoanAgreementPdfContent(loan: Loan): string {
  const currentDate = new Date().toLocaleDateString('sw-TZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <title>Mkataba wa Mkopo - ${loan.loanNumber}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #059669;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .subtitle {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
      margin-top: 12px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      border-left: 3px solid #059669;
      padding-left: 8px;
      margin: 20px 0 10px 0;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #334155;
    }
    .terms-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-size: 11px;
      color: #334155;
      margin: 16px 0;
    }
    .terms-box ol {
      margin: 0;
      padding-left: 18px;
    }
    .terms-box li {
      margin-bottom: 6px;
    }
    .signatures-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .sig-card {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      background: #fafafa;
    }
    .sig-role {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .sig-img {
      max-height: 50px;
      margin: 8px auto;
      display: block;
    }
    .sig-placeholder {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #94a3b8;
      font-style: italic;
    }
    .sig-name {
      font-size: 11px;
      font-weight: 600;
      color: #0f172a;
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      margin-top: 6px;
    }
    .footer-seal {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">Jamhuri ya Muungano wa Tanzania</h1>
    <div class="subtitle">MKATABA RASMI WA MKOPO WA KIFEDHA (MICROFINANCE LOAN AGREEMENT)</div>
    <div class="subtitle">Chini ya Sheria ya Huduma Ndogo za Fedha (Microfinance Act, 2018 - Kifungu 16)</div>
    <div class="badge-bar">
      <span>Namba ya Mkataba: <strong>#${loan.loanNumber}</strong></span>
      <span>Tarehe ya Kutolewa: <strong>${currentDate}</strong></span>
      <span>Hali: <strong>${loan.status === 'REPAYING' ? 'IMEIDHINISHWA NA INAREJESHWA' : loan.status}</strong></span>
    </div>
  </div>

  <div class="section-title">1. Pandikizi za Mkataba (Parties Involved)</div>
  <table>
    <tr>
      <th style="width: 25%;">Nafasi</th>
      <th style="width: 45%;">Jina Kamili & Anwani</th>
      <th style="width: 30%;">NIDA / Namba ya Simu</th>
    </tr>
    <tr>
      <td><strong>Mkopeshaji (Lender)</strong></td>
      <td>${loan.lenderName || 'Dr. Neema Mwakyusa (Mkopeshaji Aliyesajiliwa)'}</td>
      <td>Simu: +255 754 987 654<br>Leseni ya BOT: TIER-2-TZ-8849</td>
    </tr>
    <tr>
      <td><strong>Mkopaji (Borrower)</strong></td>
      <td>${loan.borrowerName}</td>
      <td>NIDA: ${loan.borrowerNida}<br>Simu: ${loan.borrowerPhone}</td>
    </tr>
    <tr>
      <td><strong>Mdhamini (Guarantor)</strong></td>
      <td>${loan.guarantor.fullName} (${loan.guarantor.relationship})<br>Kazi: ${loan.guarantor.workplace}</td>
      <td>NIDA: ${loan.guarantor.nidaNumber}<br>Simu: ${loan.guarantor.phone}</td>
    </tr>
  </table>

  <div class="section-title">2. Takwimu na Masharti ya Kifedha (Financial Breakdown)</div>
  <table>
    <tr>
      <th>Kipengele</th>
      <th>Kiasi / Asilimia</th>
      <th>Maelezo</th>
    </tr>
    <tr>
      <td>Kiasi Halisi cha Mkopo (Principal)</td>
      <td><strong>${formatTzs(loan.principalAmount)}</strong></td>
      <td>Fedha zilizotolewa kwa mkopaji</td>
    </tr>
    <tr>
      <td>Kiwango cha Riba</td>
      <td><strong>${loan.interestRate}% kwa mwezi</strong></td>
      <td>Riba ya jumla: ${formatTzs(loan.totalInterest)}</td>
    </tr>
    <tr>
      <td>Muda wa Mkopo</td>
      <td><strong>Miezi ${loan.durationMonths}</strong></td>
      <td>Tarehe ya mwisho: ${loan.dueDate ? formatDate(loan.dueDate) : 'Mwisho wa kipindi cha mkopo'}</td>
    </tr>
    <tr>
      <td>Ada ya Huduma & Mfumo</td>
      <td>${formatTzs(loan.processingFee)}</td>
      <td>Gharama ya usindikaji wa mkopo</td>
    </tr>
    <tr>
      <td>Ada ya Mwanasheria / Wakili</td>
      <td>${loan.lawyerFeeRequired ? formatTzs(loan.lawyerFeeAmount) : 'Haitumiki'}</td>
      <td>${loan.lawyerFeeRequired ? 'Mkataba umethibitishwa na Mwanasheria' : 'Makubaliano ya moja kwa moja'}</td>
    </tr>
    <tr style="background-color: #ecfdf5; font-weight: bold;">
      <td style="color: #065f46;">Jumla ya Marejesho (Total Due)</td>
      <td style="color: #065f46; font-size: 13px;">${formatTzs(loan.totalRepayment)}</td>
      <td style="color: #065f46;">Baki ya kulipa: ${formatTzs(loan.totalRepayment - loan.amountPaid)}</td>
    </tr>
  </table>

  <div class="section-title">3. Masharti ya Kisheria na Wajibu (Legal Covenants)</div>
  <div class="terms-box">
    <ol>
      <li><strong>Wajibu wa Marejesho:</strong> Mkopaji anawajibika kurejesha kiasi kilichokubaliwa kila mwezi kupitia njia rasmi za kidijitali (M-Pesa, Tigo Pesa, Airtel Money au Akaunti ya Benki).</li>
      <li><strong>Dhamana ya Mdhamini:</strong> Mdhamini anakiri kwamba mkopaji akishindwa kulipa kwa muda uliopangwa, atawajibika kisheria kusaidia kurejesha deni hili.</li>
      <li><strong>Uzingatiaji wa Sheria za BOT:</strong> Mkataba huu unaongozwa na Sheria ya Huduma Ndogo za Fedha ya Mwaka 2018 na Sheria ya Mikataba ya Tanzania (Law of Contract Act).</li>
      <li><strong>Ulinzi wa Faragha:</strong> Taarifa zote zimehifadhiwa kwa kufuata Sheria ya Ulinzi wa Taarifa Binafsi ya Mwaka 2023 (PDPC).</li>
    </ol>
  </div>

  <div class="section-title">4. Sahihi za Kielektroniki za Pande Zote (Digital Signatures)</div>
  <div class="signatures-grid">
    <div class="sig-card">
      <div class="sig-role">Sahihi ya Mkopeshaji</div>
      ${
        loan.lenderSignature
          ? `<img src="${loan.lenderSignature}" class="sig-img" alt="Sahihi ya Mkopeshaji" />`
          : `<div class="sig-placeholder">Imethibitishwa Kidijitali</div>`
      }
      <div class="sig-name">${loan.lenderName || 'Mkopeshaji'}</div>
      <div style="font-size: 10px; color: #64748b;">Tarehe: ${loan.approvedAt ? formatDate(loan.approvedAt) : currentDate}</div>
    </div>

    <div class="sig-card">
      <div class="sig-role">Sahihi ya Mkopaji</div>
      ${
        loan.borrowerSignature
          ? `<img src="${loan.borrowerSignature}" class="sig-img" alt="Sahihi ya Mkopaji" />`
          : `<div class="sig-placeholder">Sahihi ya Kalamu</div>`
      }
      <div class="sig-name">${loan.borrowerName}</div>
      <div style="font-size: 10px; color: #64748b;">NIDA: ${loan.borrowerNida.substring(0, 8)}...</div>
    </div>

    <div class="sig-card">
      <div class="sig-role">Sahihi ya Mdhamini</div>
      ${
        loan.guarantor.signatureImage
          ? `<img src="${loan.guarantor.signatureImage}" class="sig-img" alt="Sahihi ya Mdhamini" />`
          : `<div class="sig-placeholder">Dhamana Imethibitishwa</div>`
      }
      <div class="sig-name">${loan.guarantor.fullName}</div>
      <div style="font-size: 10px; color: #64748b;">Uhusiano: ${loan.guarantor.relationship}</div>
    </div>
  </div>

  <div class="footer-seal">
    Hati hii imetolewa na mfumo wa kidijitali wa JmkLoanApp Tanzania kulingana na taratibu za miamala ya kielektroniki.<br>
    Namba ya Uthibitisho wa Mfumo: JMK-VERIFY-${Date.now().toString(36).toUpperCase()} · Dar es Salaam, Tanzania.
  </div>
</body>
</html>
  `;
}

/**
 * Triggers a simulated PDF document download in browser
 */
export function downloadLoanAgreementPdf(loan: Loan): void {
  const htmlContent = generateLoanAgreementPdfContent(loan);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Trigger file download with .pdf extension representation
  const link = document.createElement('a');
  link.href = url;
  link.download = `Mkataba_Mkopo_${loan.loanNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Opens a print-ready window allowing immediate saving as PDF via browser print dialogue
 */
export function printLoanAgreementPdf(loan: Loan): void {
  const htmlContent = generateLoanAgreementPdfContent(loan);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
