// Add these handlers to your main.js or a separate ipcHandlers file

import { ipcMain  } from "electron";
const productController = require('../../controllers/productController')
const {  BrowserWindow } = require('electron')

// =====================================================
// PRODUCT IPC HANDLERS
// =====================================================


export default function productIPC() {


// Create Product
ipcMain.handle('product:create', async (event, data) => {
  return await productController.createProduct(data)
})

// Get All Products (with filters)
ipcMain.handle('product:getAll', async (event, filters) => {
  return await productController.getProducts(filters)
})

// Get Product By ID
ipcMain.handle('product:getById', async (event, id) => {
  return await productController.getProductById(id)
})

// Update Product
ipcMain.handle('product:update', async (event, id, data) => {
  return await productController.updateProduct(id, data)
})

// Delete Product (Soft Delete)
ipcMain.handle('product:delete', async (event, id) => {
  return await productController.deleteProduct(id)
})

// Restore Product
ipcMain.handle('product:restore', async (event, id) => {
  return await productController.restoreProduct(id)
})

// Bulk Delete Products
ipcMain.handle('product:bulkDelete', async (event, ids) => {
  return await productController.bulkDeleteProducts(ids)
})

// Get Low Stock Products
ipcMain.handle('product:getLowStock', async () => {
  return await productController.getLowStockProducts()
})

// Update Product Stock
ipcMain.handle('product:updateStock', async (event, id, quantity, operation) => {
  return await productController.updateProductStock(id, quantity, operation)
})

// Get Product Image Path
ipcMain.handle('product:getImagePath', async (event, fileName) => {
  return productController.getFullImagePath(fileName)
})








// ipcMain.on('print-receipt', (_, html) => {

//   console.log(html)
//   const printWindow = new BrowserWindow({
//     width: 300,          // ~80mm
//     height: 600,
//     show: false,
//     webPreferences: {
//       sandbox: false
//     }
//   })

//   const content = `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta charset="UTF-8" />
//       <style>
//         @page {
//           size: 80mm auto;
//           margin: 0;
//         }

//         body {
//           margin: 0;
//           padding: 0;
//           background: #fff;
//           font-family: Arial, Helvetica, sans-serif;
//           font-size: 12px;
//           -webkit-print-color-adjust: exact;
//         }

//         /* ===== RECEIPT CONTAINER ===== */
//         .receipt {
//           width: 80mm;
//           max-width: 80mm;
//           margin: 0 auto;
//           padding: 6px;
//         }

//         /* ===== HEADER ===== */
//         .receipt-header {
//           text-align: center;
//           border-bottom: 2px solid #000;
//           padding-bottom: 4px;
//           margin-bottom: 4px;
//         }

//         .receipt-company-name {
//           font-size: 16px;
//           font-weight: bold;
//           margin: 0;
//         }

//         .receipt-company-address,
//         .receipt-company-phone,
//         .receipt-title {
//           font-size: 10px;
//           margin: 2px 0;
//         }

//         .receipt-title {
//           font-weight: bold;
//           font-size: 12px;
//           text-transform: uppercase;
//         }

//         /* ===== INFO SECTION ===== */
//         .receipt-info {
//           border-bottom: 1px solid #000;
//           padding-bottom: 3px;
//           margin-bottom: 4px;
//         }

//         .info-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 1px 0;
//         }

//         .info-label {
//           font-weight: bold;
//         }

//         .info-value {
//           text-align: right;
//         }

//         /* ===== ITEMS TABLE ===== */
//         .receipt-items table {
//           width: 100%;
//           border-collapse: collapse;
//           table-layout: fixed;
//         }

//         .receipt-items th,
//         .receipt-items td {
//           padding: 2px 0;
//           line-height: 1.2;
//           font-variant-numeric: tabular-nums;
//         }

//         .receipt-items th {
//           font-size: 10px;
//           font-weight: bold;
//           text-transform: uppercase;
//           border-bottom: 1px solid #000;
//         }

//         .col-item {
//           width: 45%;
//           text-align: left;
//           white-space: normal;
//           word-break: break-word;
//         }

//         .col-qty {
//           width: 15%;
//           text-align: center;
//         }

//         .col-price {
//           width: 20%;
//           text-align: right;
//         }

//         .col-total {
//           width: 20%;
//           text-align: right;
//         }

//         /* ===== TOTALS SECTION ===== */
//         .receipt-totals .totals-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 2px 0;
//         }

//         .receipt-totals .discount {
//           color: red;
//         }

//         .receipt-totals .total {
//           font-size: 14px;
//           font-weight: bold;
//           border-top: 1px solid #000;
//           padding-top: 4px;
//           margin-top: 4px;
//         }

//         /* ===== PAYMENT SECTION ===== */
//         .receipt-payment .payment-row {
//           display: flex;
//           justify-content: space-between;
//           margin: 2px 0;
//         }

//         .receipt-payment .change {
          
//           font-weight: bold;
//         }

//         /* ===== FOOTER ===== */
//         .receipt-footer {
//           text-align: center;
//           border-top: 1px dashed #000;
//           padding-top: 4px;
//           margin-top: 6px;
//           font-size: 10px;
//         }

//         .receipt-footer div {
//           margin: 2px 0;
//         }

//       </style>
//     </head>
//     <body>
//       <div class="receipt">
//         ${html}
//       </div>
//     </body>
//   </html>
//   `

//   printWindow.loadURL(
//     `data:text/html;charset=utf-8,${encodeURIComponent(content)}`
//   )

//   printWindow.webContents.on('did-finish-load', () => {
//     printWindow.webContents.print(
//       {
//         silent: true,
//         printBackground: true,
//         margins: { marginType: 'none' }
//       },
//       () => {
//         printWindow.close()
//       }
//     )
//   })
// })
ipcMain.on('print-receipt', (_, html) => {

  const printWindow = new BrowserWindow({
    width: 300,          // ~80mm
    height: 600,
    show: false,
    webPreferences: {
      sandbox: false
    }
  });

  const content = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
      
        }

        /* Container */
        .receipt {
          width: 80mm;   /* exact width for thermal printer */
          padding: 4px;
          margin: 0 auto;
        }

        /* Header */
        .receipt-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 4px;
          margin-bottom: 4px;
        }

        .receipt-company-name { font-size: 18px; font-weight: bold; margin: 0; }
        .receipt-company-address,
        .receipt-company-phone,
        .receipt-title { font-size: 14px; margin: 1px 0; }
        .receipt-title { font-weight: bold; font-size: 12px; text-transform: uppercase; }

        /* Info */
        .receipt-info .info-row { display: flex; justify-content: space-between; }
        .info-label { font-weight: bold; }
        .info-value { text-align: right; }

        /* Table */
        .receipt-items table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .receipt-items th,
        .receipt-items td {
          padding: 2px 0;
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
        }

        th { font-size: 10px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; }

        /* Fixed column widths */
        .col-item { width: 45%; text-align: left; word-wrap: break-word; }
        .col-qty { width: 15%; text-align: center; white-space: nowrap; }
        .col-price { width: 20%; text-align: right; white-space: nowrap; }
        .col-total { width: 20%; text-align: right; white-space: nowrap; }

        /* Totals */
        .receipt-totals .totals-row { display: flex; justify-content: space-between; margin: 2px 0; }
        .receipt-totals .discount { color: red; }
        .receipt-totals .total { font-size: 14px; font-weight: bold; border-top: 1px solid #000; padding-top: 2px; }

        /* Payment */
        .receipt-payment .payment-row { display: flex; justify-content: space-between; margin: 2px 0; }
        .receipt-payment .change {  font-weight: bold; }

        /* Footer */
        .receipt-footer { text-align: center; border-top: 1px dashed #000; padding-top: 4px; margin-top: 6px; font-size: 10px; }
        .receipt-footer div { margin: 2px 0; }
      </style>
    </head>
    <body>
      <div class="receipt">
        ${html}
      </div>
    </body>
  </html>
  `;

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(content)}`);

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print(
      {
        silent: true,       // Direct print
        printBackground: true,
        margins: { marginType: 'none' },
         pageSize: {
    width: 70000,   // microns → 80mm
    height: 200000  // adjust as needed
  }
      },
      (success, errorType) => {
        if (!success) console.error('Print failed:', errorType);
        printWindow.close();
      }
    );
  });
});

}