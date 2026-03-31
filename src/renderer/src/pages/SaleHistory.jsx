import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import InputFeild from "../components/InputFeild";
import DropdownFeild from "../components/DropdownFeild";
import DialogPopUp from "../components/DialogPopUp";
import TableFeild from "../components/TableFeild";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";
import { getCompanySlice } from "../store/companySlice";

import { 
  EyeIcon, 
  TrashIcon, 
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChevronUpIcon, ChevronDownIcon,
  ShoppingCartIcon,
 ArrowTrendingUpIcon as TrendingUpIcon,
  ChartBarIcon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/solid";
import {
  getSalesSlice,
  getSaleByIdSlice,
  deleteSaleSlice,
  getSalesStatsSlice,
} from "../store/saleSlice";

export default function SalesHistory() {
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.sale.list);
  const stats = useSelector((state) => state.sale.stats);
  const company = useSelector((state) => state.company.company);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [searchBar, setSearchBar] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewSale, setViewSale] = useState(null);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [showSalesHistory, setshowSalesHistory] = useState(true);


  const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const handleDateFilterChange = (filter) => {
  setDateFilter(filter);

  const today = new Date();
  let start, end;

  switch (filter) {
    case "yesterday":
      start = new Date();
      start.setDate(today.getDate() - 1);

      end = new Date();
      end.setDate(today.getDate() - 1); // only yesterday
      break;

    case "this_week": {
      start = new Date(today);
      const day = today.getDay(); // 0=Sun, 1=Mon...
      const diff = day === 0 ? 6 : day - 1; // week starts Monday
      start.setDate(today.getDate() - diff);

      end = new Date(today);
      break;
    }

    case "this_month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today);
      break;

    case "custom":
      return;

    default:
      setStartDate("");
      setEndDate("");
      return;
  }

  setStartDate(formatDateLocal(start));
  setEndDate(formatDateLocal(end));
};


  useEffect(() => {
    dispatch(getSalesSlice({
      search: searchBar,
      start_date: startDate,
      end_date: endDate,
      payment_status: paymentStatus
    }));
    
    dispatch(getSalesStatsSlice({
      start_date: startDate,
      end_date: endDate
    }));
  }, [dispatch, searchBar, startDate, endDate, paymentStatus]);

  useEffect(() => {
    async function loadCompany() {
      try {
        // const user = await window.api.getUserSession();
        // const res = await window.api.getCompany(user.user.company_id);
        // if (res.success) {
        //   setDefaultCurrency(res.company.dataValues.currency);
        // }
          if(company){
             if (company) {
            console.log("company===========",company)
          setDefaultCurrency(company.currency);
        }
          }
      } catch (err) {
        toast.error("Failed to load company currency");
      }
    }
    loadCompany();
  }, []);

  const handleViewSale = async (saleId) => {
    const result = await dispatch(getSaleByIdSlice(saleId)).unwrap();
    if (result.success) {
      setViewSale(result.sale);
      setOpenViewDialog(true);
    } else {
      toast.error("Failed to load sale details");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteSaleSlice(deleteItem.id)).unwrap();
    if (result.success) {
      toast.success("Sale deleted successfully");
      dispatch(getSalesSlice({
        search: searchBar,
        start_date: startDate,
        end_date: endDate,
        payment_status: paymentStatus
      }));
      setOpenDeletePopup(false);
    } else {
      toast.error(result.error);
    }
  };

  const printInvoice = () => {
    const printContent = document.getElementById('invoice-print-content');
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${viewSale?.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: 600; }
            .header { text-align: center; margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .totals { margin-top: 20px; text-align: right; }
            .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            @media print {
              body { margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Calculate comprehensive stats
 
  const totalRevenue = parseFloat(stats?.total_revenue || 0);
  const totalOrders = parseInt(stats?.total_sales || 0);
  const totalPurchaseCost = parseFloat(stats?.total_purchase_cost || 0);
  const totalSalePrice = parseFloat(stats?.total_sale_price || 0);
  const expectedProfit = totalSalePrice - totalPurchaseCost;
  const profitMargin = totalSalePrice > 0 ? ((expectedProfit / totalSalePrice) * 100) : 0;

  const columns = [
    { label: "Invoice", accessor: "invoice_number" },
    {
      label: "Date",
      accessor: "sale_date",
      render: (row) => new Date(row.sale_date).toLocaleDateString()
    },
    {
      label: "Customer",
      accessor: "customer",
      render: (row) => row.customer?.customerName || "Walk-in"
    },
    {
      label: "Total",
      accessor: "total_amount",
      render: (row) => `${defaultCurrency} ${parseFloat(row.total_amount).toFixed(2)}`
    },
    {
      label: "Paid",
      accessor: "paid_amount",
      render: (row) => `${defaultCurrency} ${parseFloat(row.paid_amount).toFixed(2)}`
    },
    {
      label: "Payment",
      accessor: "payment_method",
      render: (row) => (
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600 capitalize">
          {row.payment_method}
        </span>
      )
    },
    {
      label: "Status",
      accessor: "payment_status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs capitalize ${
            row.payment_status === "paid"
              ? "bg-green-100 text-green-600"
              : row.payment_status === "partial"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.payment_status}
        </span>
      )
    },
  ];

  const actions = [
    {
      label: "View",
      icon: EyeIcon,
      className: "bg-secondary text-white hover:bg-secondary-dark rounded-md",
      onClick: (row) => handleViewSale(row.id),
    },
    {
      label: "Delete",
      icon: TrashIcon,
      className: "bg-red-500 text-white hover:bg-red-600 rounded-md",
      onClick: (row) => {
        setDeleteItem(row);
        setOpenDeletePopup(true);
      },
    },
  ];

  const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      <ToastContainer />

    
   
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
        <PageHeading title="Sales History" subtitle="View and manage all sales transactions" />
         <button
        onClick={() => setshowSalesHistory(!showSalesHistory)}
        className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-darker transition"
      >
         {/* {showSalesHistory ? "Hide" : "Show"} */}
        {showSalesHistory ? <ChevronDownIcon className="w-7 h-7 inline " /> : <ChevronUpIcon className="w-7 h-7 inline " />}
       
        
      </button>
      </div>

        {/* Date Filter Presets */}
       { showSalesHistory && <div className="flex gap-2 mt-4 mb-4">
          {["all", "yesterday", "this_week", "this_month", "custom"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleDateFilterChange(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                dateFilter === filter
                  ? "bg-primary-dark text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "all" ? "All Time" : 
               filter === "yesterday" ? "Yesterday" :
               filter === "this_week" ? "This Week" :
               filter === "this_month" ? "This Month" :
               "Custom Range"}
            </button>
          ))}
        </div>}

        {/* Search and Filters */}
        { showSalesHistory && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InputFeild
            label="Search Invoice"
            placeholder="Search by invoice number"
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
          />
          <InputFeild
            label="From Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDateFilter("custom");
            }}
          />
          <InputFeild
            label="To Date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setDateFilter("custom");
            }}
          />
          <DropdownFeild
            label="Payment Status"
            value={paymentStatus}
            onChange={setPaymentStatus}
            options={["all", "paid", "partial", "unpaid"]}
          />
        </div>}
      </div>

        {/* Enhanced Stats Cards */}


       { showSalesHistory && <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-6 gap-3">
        <StatCard
          title="Total Revenue"
          value={` ${totalRevenue.toFixed(2)}`}
          icon={CurrencyDollarIcon}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Purchase Cost"
          value={`${totalPurchaseCost.toFixed(2)}`}
          icon={ShoppingCartIcon}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          title="Sale Price"
          value={` ${totalSalePrice.toFixed(2)}`}
          icon={TrendingUpIcon}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Expected Profit"
          value={` ${expectedProfit.toFixed(2)}`}
          icon={ChartBarIcon}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(2)}%`}
          icon={ReceiptPercentIcon}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={DocumentDuplicateIcon}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
      </div>
}

      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.invoice_number}
        onConfirm={handleDelete}
        onClose={() => setOpenDeletePopup(false)}
      />

      {/* Enhanced Sale Details Dialog */}
     


      <DialogPopUp
  isOpen={openViewDialog}
  onClose={() => setOpenViewDialog(false)}
  className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto "
>
  {viewSale && (
   
    <div className="flex justify-center ">
      {/* A4 Paper */}
      <div
        id="invoice-print-content"
        className="bg-white text-gray-900 shadow-2xl"
        style={{
          width: "794px",      // A4 width
          // minHeight: "1123px", // A4 height
          padding: "48px",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TAX INVOICE</h1>
            <p className="text-sm mt-1 text-gray-600">
              Invoice #: {viewSale.invoice_number}
            </p>
            <p className="text-sm text-gray-600">
              Date: {new Date(viewSale.sale_date).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={printInvoice}
            className="px-4 py-2 border text-lg bg-primary-dark text-white rounded-md transition print:hidden"
          >
            Print
          </button>
        </div>

        {/* Customer Info */}
        {viewSale.customer && (
          <div className="border p-4 mb-8">
            <h3 className="font-semibold mb-3">Bill To</h3>
            <p className="text-sm font-medium">
              {viewSale.customer.customerName}
            </p>
            <p className="text-sm text-gray-600">
              Mobile: {viewSale.customer.mobile}
            </p>
            {viewSale.customer.email && (
              <p className="text-sm text-gray-600">
                Email: {viewSale.customer.email}
              </p>
            )}
          </div>
        )}

        {/* Items Table */}
        <table className="w-full text-sm border-collapse mb-10">
          <thead>
            <tr className="border-b-2">
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left">Product</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Tax</th>
              <th className="py-2 text-right">Discount</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {viewSale.items?.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">
                  <p className="font-medium">{item.product_name}</p>
                  {item.unit && (
                    <p className="text-xs text-gray-500">
                      Unit: {item.unit.unit_name}
                    </p>
                  )}
                </td>
                <td className="py-2 text-right">
                  {parseFloat(item.quantity).toFixed(2)}
                </td>
                <td className="py-2 text-right">
                  {defaultCurrency} {parseFloat(item.unit_price).toFixed(2)}
                </td>
                <td className="py-2 text-right">
                  {defaultCurrency} {parseFloat(item.tax_amount).toFixed(2)}
                </td>
                <td className="py-2 text-right">
                  {defaultCurrency} {parseFloat(item.discount_amount).toFixed(2)}
                </td>
                <td className="py-2 text-right font-semibold">
                  {defaultCurrency} {parseFloat(item.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-72 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {defaultCurrency} {parseFloat(viewSale.subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                {defaultCurrency} {parseFloat(viewSale.tax_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-red-600">
                - {defaultCurrency} {parseFloat(viewSale.discount_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>
                {defaultCurrency} {parseFloat(viewSale.total_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Paid</span>
              <span>
                {defaultCurrency} {parseFloat(viewSale.paid_amount).toFixed(2)}
              </span>
            </div>
            {viewSale.change_amount > 0 && (
              <div className="flex justify-between">
                <span>Change</span>
                <span>
                  {defaultCurrency} {parseFloat(viewSale.change_amount).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="border p-4 text-sm mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium capitalize">
                {viewSale.payment_method}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Payment Status</p>
              <p className="font-medium capitalize">
                {viewSale.payment_status}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Sale Status</p>
              <p className="font-medium capitalize">
                {viewSale.sale_status}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Cashier</p>
              <p className="font-medium">
                {viewSale.cashier?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {viewSale.notes && (
          <div className="border p-4 text-sm">
            <p className="font-semibold mb-1">Notes</p>
            <p className="text-gray-600">{viewSale.notes}</p>
          </div>
        )}
      </div>
    </div>
  )}
</DialogPopUp>


      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm">
        <TableFeild columns={columns} data={sales} actions={actions} />
      </div>
    </div>
  );
}