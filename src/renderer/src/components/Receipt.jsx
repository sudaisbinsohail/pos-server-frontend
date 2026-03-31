import React, { useEffect, useState } from 'react';

export default function Receipt({
  cart,
  selectedCustomer,
  cartSubtotal,
  cartTax,
  cartDiscount,
  cartTotal,
  paidAmount,
  changeAmount,
  paymentMethod,
  defaultCurrency,
  calculateItemTotal
}) {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    async function loadCompany() {
      try {
        const user = await window.api.getUserSession();
        const res = await window.api.getCompany(user.user.company_id);
        if (res.success) {
          setCompanyInfo(res.company.dataValues);
        }
      } catch (err) {
        console.error("Failed to load company info");
      }
    }
    loadCompany();

    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto receipt-container " id="receipt-print">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-4 receipt-header">
        <h1 className="text-2xl font-bold text-gray-800 receipt-company-name">
          {companyInfo?.name || 'Company Name'}
        </h1>
        {companyInfo?.address && (
          <p className="text-sm text-gray-600 mt-1 receipt-company-address">{companyInfo.address}</p>
        )}
        {companyInfo?.phone && (
          <p className="text-sm text-gray-600 receipt-company-phone">Tel: {companyInfo.phone}</p>
        )}
        <p className="text-lg font-semibold mt-2 receipt-title">SALES RECEIPT</p>
      </div>

      {/* Receipt Info */}
      <div className="mb-4 space-y-1 text-sm border-b pb-3 receipt-info">
        <div className="flex justify-between info-row">
          <span className="font-semibold info-label">Date:</span>
          <span className="info-value">{currentDateTime.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between info-row">
          <span className="font-semibold info-label">Time:</span>
          <span className="info-value">{currentDateTime.toLocaleTimeString()}</span>
        </div>
        {selectedCustomer && (
          <>
            <div className="flex justify-between info-row">
              <span className="font-semibold info-label">Customer:</span>
              <span className="info-value">{selectedCustomer.customerName}</span>
            </div>
            {selectedCustomer.mobile && (
              <div className="flex justify-between info-row">
                <span className="font-semibold info-label">Mobile:</span>
                <span className="info-value">{selectedCustomer.mobile}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-4 receipt-items">
        <table className="w-full text-sm items-table">
          <thead className="border-b-2 border-gray-800">
            <tr>
              <th className="text-left py-2 col-item">Item</th>
              <th className="text-center py-2 col-qty">Qty</th>
              <th className="text-right py-2 col-price">Price</th>
              <th className="text-right py-2 col-total">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {cart.map((item) => {
              const totals = calculateItemTotal(item);
              return (
                <tr key={item.cart_key}>
                  <td className="py-2 col-item font-medium">{item.product_name}</td>
                  <td className="text-center py-2 col-qty">{item.quantity} {item.unit_abbreviation}</td>
                  <td className="text-right py-2 col-price">{item.unit_price.toFixed(2)}</td>
                  <td className="text-right py-2 col-total font-medium">{totals.total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="border-t-2 border-gray-800 pt-3 space-y-2 receipt-totals">
        <div className="flex justify-between text-sm totals-row">
          <span>Subtotal:</span>
          <span className="font-medium">{defaultCurrency} {cartSubtotal.toFixed(2)}</span>
        </div>
        {cartTax > 0 && (
          <div className="flex justify-between text-sm totals-row">
            <span>Tax:</span>
            <span className="font-medium">{defaultCurrency} {cartTax.toFixed(2)}</span>
          </div>
        )}
        {cartDiscount > 0 && (
          <div className="flex justify-between text-sm text-red-600 totals-row discount">
            <span>Discount:</span>
            <span className="font-medium">- {defaultCurrency} {cartDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t-2 border-gray-800 pt-2 totals-row total">
          <span>TOTAL:</span>
          <span>{defaultCurrency} {cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Info */}
      {paidAmount && (
        <div className="mt-4 pt-3 border-t border-gray-400 space-y-2 receipt-payment">
          <div className="flex justify-between text-sm payment-row">
            <span className="font-semibold">Payment Method:</span>
            <span className="uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm payment-row">
            <span className="font-semibold">Paid:</span>
            <span className="font-medium">{defaultCurrency} {parseFloat(paidAmount).toFixed(2)}</span>
          </div>
          {changeAmount >= 0 && (
            <div className="flex justify-between text-base font-bold payment-row change">
              <span>Change:</span>
              <span className="text-green-600">{defaultCurrency} {changeAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center receipt-footer">
        <p className="text-sm font-semibold mb-2">Thank you for your business!</p>
        <p className="text-xs">Please come again</p>
        {companyInfo?.email && <p className="text-xs mt-2">{companyInfo.email}</p>}
      </div>
    </div>
  );
}
