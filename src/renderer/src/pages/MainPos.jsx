import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import DropdownFeild from "../components/DropdownFeild";
import DialogPopUp from "../components/DialogPopUp";
import { createSaleSlice } from "../store/saleSlice";
import { getProductsSlice } from "../store/productSlice";
import { getCustomersSlice } from "../store/customerSlice";
import { getCompanySlice } from "../store/companySlice";
import Receipt from "../components/Receipt";
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  UserPlusIcon, 
  PlusIcon, 
  MinusIcon, 
  TrashIcon,
  UserIcon,
  ClockIcon,
  ShoppingCartIcon,
  PrinterIcon
} from "@heroicons/react/24/solid";

export default function POS() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.list);
  const customers = useSelector((state) => state.customer.list);
  const company = useSelector((state) => state.company.company);

  const barcodeInputRef = useRef(null);

  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [discount, setDiscount] = useState(0);
  
  // Dialogs
  const [openPayment, setOpenPayment] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);

  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());


  const currentUser = useSelector((state) => state.users.currentUser);


  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    dispatch(getCompanySlice())
    dispatch(getProductsSlice({ search: "", category_id: "", brand_id: "", status: "active" }));
    dispatch(getCustomersSlice({ search: "", status: "All" }));
  }, [dispatch]);

  useEffect(() => {
    async function loadCompany() {
      try {
        // const user = await window.api.getUserSession();
        // const res = await window.api.getCompany(user.user.company_id);
        // if (res.success) {
        //   setDefaultCurrency(res.company.dataValues.currency);
        // }
          
          if (company) {
            console.log("company===========",company)
          setDefaultCurrency(company.currency);
        }
      } catch (err) {
        toast.error("Failed to load company currency");
      }
    }
    loadCompany();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Add to cart - UPDATED to handle product units
  const addToCart = (product, unitData = null) => {
    const cartKey = unitData 
      ? `${product.id}_unit_${unitData.unit_id}` 
      : `${product.id}_base`;

    const existingItem = cart.find((item) => item.cart_key === cartKey);
    
    if (existingItem) {
      setCart(cart.map((item) =>
        item.cart_key === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`${product.name} ${unitData ? `(${unitData.unit_name})` : ''} quantity increased`);
    } else {
      const newItem = {
        cart_key: cartKey,
        product_id: product.id,
        product_name: product.name,
        unit_id: unitData?.unit_id || null,
        unit_name: unitData?.unit_name || product.base_unit?.unit_name || 'Base',
        unit_abbreviation: unitData?.abbreviation || product.base_unit?.abbreviation || '',
        conversion_value: unitData?.conversion_value || 1,
        unit_price: unitData?.selling_price || parseFloat(product.selling_price),
        quantity: 1,
        tax_percent: parseFloat(product.tax_percent || 0),
        discount_percent: 0,
        image: product.imageUrl
      };

      setCart([...cart, newItem]);
      // toast.success(`${product.name} ${unitData ? `(${unitData.unit_name})` : ''} added to cart`);
    }
  };

  // Handle barcode scan - UPDATED to handle unit barcodes
  const handleBarcodeSearch = (e) => {
    e.preventDefault();
    
    if (!barcodeInput.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    const barcodeValue = barcodeInput.trim();
    let found = false;

    // Search through all products
    for (const product of products) {
      // Check main product barcode
      if (product.barcode === barcodeValue || product.sku === barcodeValue) {
        addToCart(product, null);
        found = true;
        break;
      }

      // Check unit barcodes
      if (product.units && product.units.length > 0) {
        const matchedUnit = product.units.find(
          (u) => u.barcode === barcodeValue || u.sku === barcodeValue
        );

        if (matchedUnit) {
          // Add with unit information
          addToCart(product, {
            unit_id: matchedUnit.unit_id,
            unit_name: matchedUnit.unit?.unit_name || 'Unit',
            abbreviation: matchedUnit.unit?.abbreviation || '',
            conversion_value: matchedUnit.conversion_value,
            selling_price: matchedUnit.selling_price
          });
          found = true;
          break;
        }
      }
    }

    if (found) {
      setBarcodeInput("");
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } else {
      toast.error(`Product not found: ${barcodeValue}`);
      setBarcodeInput("");
    }
  };

  // Update quantity - UPDATED to use cart_key
  const updateQuantity = (cartKey, delta) => {
    setCart(cart.map((item) => {
      if (item.cart_key === cartKey) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Remove from cart - UPDATED to use cart_key
  const removeFromCart = (cartKey) => {
    setCart(cart.filter((item) => item.cart_key !== cartKey));
  };

  // Calculate totals
  const calculateItemTotal = (item) => {
    const subtotal = item.unit_price * item.quantity;
    const discountAmount = (subtotal * item.discount_percent) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * item.tax_percent) / 100;
    return {
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      total: taxableAmount + taxAmount
    };
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item).subtotal, 0);
  const cartTax = cart.reduce((sum, item) => sum + calculateItemTotal(item).tax_amount, 0);
  const cartDiscount = parseFloat(discount) || 0;
  const cartTotal = cartSubtotal + cartTax - cartDiscount;
  const changeAmount = parseFloat(paidAmount) - cartTotal;


const printReceipt = () => {
  const receiptHtml = document.getElementById('receipt-print')?.innerHTML

  if (!receiptHtml) {
    console.error('Receipt element not found')
    return
  }

  window.api.printReceipt(receiptHtml)
}


  // Complete sale - UPDATED to include unit information
  const completeSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (parseFloat(paidAmount) < cartTotal) {
      toast.error("Paid amount is less than total");
      return;
    }

    // const user = await window.api.getUserSession();

    const saleData = {
      customer_id: selectedCustomer?.id || null,
      user_id: currentUser.id,
      subtotal: cartSubtotal,
      tax_amount: cartTax,
      discount_amount: cartDiscount,
      total_amount: cartTotal,
      paid_amount: parseFloat(paidAmount),
      change_amount: changeAmount,
      payment_method: paymentMethod,
      payment_status: "paid",
      sale_status: "completed",
      items: cart.map((item) => {
        const totals = calculateItemTotal(item);
        // Calculate actual quantity in base unit for stock deduction
        const actualQuantity = item.quantity * (item.conversion_value || 1);
        
        return {
          product_id: item.product_id,
          unit_id: item.unit_id,
          product_name: item.product_name,
          quantity: actualQuantity, // Store in base unit
          unit_price: item.unit_price,
          tax_percent: item.tax_percent,
          tax_amount: totals.tax_amount,
          discount_percent: item.discount_percent,
          discount_amount: totals.discount_amount,
          subtotal: totals.subtotal,
          total: totals.total
        };
      })
    };

    const result = await dispatch(createSaleSlice(saleData)).unwrap();

    if (result.success) {
      printReceipt();
      toast.success(`Sale completed! Invoice: ${result.invoice_number}`);
      
      // Reset
      setCart([]);
      setSelectedCustomer(null);
      setPaidAmount("");
      setDiscount(0);
      setOpenPayment(false);
      setBarcodeInput("");
      
      // Refresh products
      dispatch(getProductsSlice({ search: "", category_id: "", brand_id: "", status: "active" }));
      
      // Refocus barcode input
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } else {
      toast.error(result.error || "Sale failed");
    }
  };

  return (
    <div className="h-screen flex flex-col ">
      <ToastContainer />

      {/* Top Header Bar */}
      <div className="bg-primary-dark text-white px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-80">Date & Time</p>
                <p className="font-semibold">
                  {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Customer Display/Select Button */}
            {selectedCustomer ? (
              <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-lg">
                <UserIcon className="w-5 h-5" />
                <div>
                  <p className="text-xs opacity-80">Customer</p>
                  <p className="font-semibold">{selectedCustomer.customerName}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="ml-2 hover:bg-white/20 p-1 rounded transition"
                  title="Remove Customer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenCustomer(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Add Customer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDE - Products & Cart Items */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBarcodeSearch(e);
                    }
                  }}
                  placeholder="Scan barcode or search product..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  autoFocus
                />
                {barcodeInput && (
                  <button
                    onClick={() => setBarcodeInput("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items Display */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3">
              <div className="grid grid-cols-12 gap-2 font-semibold text-sm">
                <div className="col-span-3">PRODUCT</div>
                <div className="col-span-2 text-center">UNIT</div>
                <div className="col-span-2 text-center">PRICE</div>
                <div className="col-span-2 text-center">QTY</div>
                <div className="col-span-1 text-center">DISC</div>
                <div className="col-span-2 text-right">TOTAL</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCartIcon className="w-24 h-24 mb-4 opacity-30" />
                  <p className="text-lg font-semibold">Cart is Empty</p>
                  <p className="text-sm">Scan or search products to add</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => {
                    const totals = calculateItemTotal(item);
                    return (
                      <div 
                        key={item.cart_key} 
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                      >
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-3">
                            <p className="font-semibold text-gray-800 text-sm">{item.product_name}</p>
                            <p className="text-xs text-gray-500">
                              {defaultCurrency} {item.unit_price.toFixed(2)} per {item.unit_abbreviation}
                            </p>
                          </div>
                          
                          <div className="col-span-2 text-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              {item.unit_name}
                            </span>
                            {item.conversion_value > 1 && (
                              <p className="text-xs text-gray-500 mt-1">
                                (×{item.conversion_value})
                              </p>
                            )}
                          </div>
                          
                          <div className="col-span-2 text-center font-semibold text-blue-600">
                            {defaultCurrency} {item.unit_price.toFixed(2)}
                          </div>
                          
                          <div className="col-span-2 flex items-center justify-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.cart_key, -1)}
                              className="w-7 h-7 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cart_key, 1)}
                              className="w-7 h-7 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="col-span-1 text-center text-orange-600 font-semibold text-sm">
                            {totals.discount_amount.toFixed(2)}
                          </div>
                          
                          <div className="col-span-1 text-right font-bold text-lg text-green-600">
                            {totals.total.toFixed(2)}
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <button
                              onClick={() => removeFromCart(item.cart_key)}
                              className="w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t space-y-2 bg-white rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{defaultCurrency} {cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>{defaultCurrency} {cartTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 text-right border rounded px-2 py-1"
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>{defaultCurrency} {cartTotal.toFixed(2)}</span>
            </div>

            <ButtonFeild
              onClick={() => setOpenPayment(true)}
              label="Proceed to Payment"
              disabled={cart.length === 0}
              className="mt-4"
            />
          </div>
        </div>
      </div>

      {/* Payment Dialog */}

      <DialogPopUp isOpen={openPayment} onClose={() => setOpenPayment(false)} className="w-full max-w-6xl">
        <div className="flex gap-6 h-[80vh]">
          {/* LEFT SIDE - Receipt Preview */}
          <div className="w-1/2 border-r pr-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PrinterIcon className="w-6 h-6" />
              Receipt Preview
            </h2>
            <div className="border-2 border-gray-300 rounded-lg overflow-auto h-[calc(100%-60px)]">
              <Receipt
                cart={cart}
                selectedCustomer={selectedCustomer}
                cartSubtotal={cartSubtotal}
                cartTax={cartTax}
                cartDiscount={cartDiscount}
                cartTotal={cartTotal}
                paidAmount={paidAmount}
                changeAmount={changeAmount}
                paymentMethod={paymentMethod}
                defaultCurrency={defaultCurrency}
                calculateItemTotal={calculateItemTotal}
              />
            </div>
          </div>

          {/* RIGHT SIDE - Payment Form */}
          <div className="w-1/2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            
            <div className="flex-1 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>{defaultCurrency} {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <DropdownFeild
                label="Payment Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={["cash", "card", "mobile", "bank_transfer"]}
              />

              <InputFeild
                label="Paid Amount"
                type="number"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                required
              />

              {paidAmount && (
                <div className={`p-4 rounded-lg ${changeAmount >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Change:</span>
                    <span className={`font-bold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {defaultCurrency} {changeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {/* <button
                onClick={printReceipt}
                disabled={!paidAmount || changeAmount < 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <PrinterIcon className="w-5 h-5" />
                Print Receipt
              </button> */}
              
              <button
                onClick={completeSale}
                disabled={!paidAmount || changeAmount < 0}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </DialogPopUp>


      {/* Customer Select Dialog */}
      <DialogPopUp isOpen={openCustomer} onClose={() => {
        setOpenCustomer(false);
        setCustomerSearchQuery("");
      }} className="w-xl">
        <h2 className="text-2xl font-bold mb-4">Select Customer</h2>
        
        {/* Customer Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, or email..."
              value={customerSearchQuery}
              onChange={(e) => setCustomerSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {customerSearchQuery && (
              <button
                onClick={() => setCustomerSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Customer List */}
        <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
          {customers
            .filter((customer) => {
              const searchLower = customerSearchQuery.toLowerCase();
              return (
                customer.customerName.toLowerCase().includes(searchLower) ||
                customer.mobile?.toLowerCase().includes(searchLower) ||
                customer.email?.toLowerCase().includes(searchLower)
              );
            })
            .map((customer) => (
              <div
                key={customer.id}
                onClick={() => {
                  setSelectedCustomer(customer);
                  setOpenCustomer(false);
                  setCustomerSearchQuery("");
                  toast.success(`Customer selected: ${customer.customerName}`);
                }}
                className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{customer.customerName}</p>
                    <p className="text-sm text-gray-500">{customer.mobile}</p>
                    {customer.email && (
                      <p className="text-xs text-gray-400">{customer.email}</p>
                    )}
                  </div>
                  {customer.balance > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">
                      Balance: {defaultCurrency} {parseFloat(customer.balance).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          
          {customers.filter((customer) => {
            const searchLower = customerSearchQuery.toLowerCase();
            return (
              customer.customerName.toLowerCase().includes(searchLower) ||
              customer.mobile?.toLowerCase().includes(searchLower) ||
              customer.email?.toLowerCase().includes(searchLower)
            );
          }).length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No customers found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <div className="border-t pt-4">
          <ButtonFeild
            onClick={() => {
              setOpenCustomer(false);
              setCustomerSearchQuery("");
              setSelectedCustomer(null);
              toast.info("Continue as walk-in customer");
            }}
            label="Continue as Walk-in Customer"
            className="w-full bg-gray-500 hover:bg-gray-600"
          />
        </div>
      </DialogPopUp>
    </div>
  );
}