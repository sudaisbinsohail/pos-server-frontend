import { useState, useEffect , useRef } from "react";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import DropdownFeild from "../components/DropdownFeild";
import DialogPopUp from "../components/DialogPopUp";
import TableFeild from "../components/TableFeild";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import ObjectDropDownFeild from "../components/ObjectDropDownFeild";
import CategoryDropdown from "../components/CategoryFilter";


import {
  createProductSlice,
  getProductsSlice,
  updateProductSlice,
  deleteProductSlice,
} from "../store/productSlice";

import { getCategoriesSlice } from "../store/categorySlice";
import { getBrandsSlice } from "../store/brandSlice";
import { getUnitsSlice } from "../store/unitSlice";
import { getCompanySlice } from "../store/companySlice";



export default function Product() {
  const dispatch = useDispatch();

  // Redux State
  const products = useSelector((state) => state.product.list);
  const categories = useSelector((state) => state.category.list);
  const brands = useSelector((state) => state.brand.list);
  const units = useSelector((state) => state.unit.list);

  // Form State
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // Search & Filters
  const [searchBar, setSearchBar] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Product Fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [baseUnitId, setBaseUnitId] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [minStockLevel, setMinStockLevel] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Product Units (Multiple units per product)
  const [productUnits, setProductUnits] = useState([]);
  const [showUnitsSection, setShowUnitsSection] = useState(false);

   const currentUser = useSelector((state) => state.users.currentUser);



  const [defaultCurrency, setDefaultCurrency] = useState("");

  const [parentId, setParentId] = useState("")


  //   Load Initial Data

useEffect(() => {
  dispatch(
    getProductsSlice({
      search: searchBar || "",
      category_id: filterCategory || null,
      brand_id: filterBrand || null,
      status: filterStatus === "All" ? null : filterStatus,
    })
  );
}, [dispatch, searchBar, filterCategory, filterBrand, filterStatus]);

useEffect(() => {
  dispatch(getCategoriesSlice());
  dispatch(getBrandsSlice());
  dispatch(getUnitsSlice({ search: "" }));
}, [dispatch]);


const company = useSelector((state) => state.company.company);
// Load company ONCE
useEffect(() => {
  dispatch(getCompanySlice());
}, [dispatch]);



  useEffect(() => {
    async function loadCompany() {
      try {
        const user = await window.api.getUserSession();
        const res = company

        if (res.success) {
          const company = res.company.dataValues;
          setDefaultCurrency(company.currency);
          // setCurrency(company.currency); // ⭐ important
        }
      } catch (err) {
        toast.error(err);
        console.log(err)
      }
    }

    loadCompany();
  }, []);

  // ====================================
  // IMAGE HANDLING
  // ====================================
  const pickImage = async () => {
    const filePath = await window.api.selectImageFile();
    if (filePath) {
      setImageFile(filePath);
      const base64 = await window.api.readImageBase64(filePath);
      setImagePreview(base64);
    }
  };

  // ====================================
  // RESET FORM
  // ====================================
  const resetForm = () => {
    setName("");
    setSku("");
    setCategoryId("");
    setBrandId("");
    setBaseUnitId("");
    setBuyingPrice("");
    setCostPrice("");
    setSellingPrice("");
    setTaxPercent("");
    setMinStockLevel("");
    setOpeningStock("");
    setBarcode("");
    setDescription("");
    setStatus("active");
    setImageFile(null);
    setImagePreview(null);
    setProductUnits([]);
    setShowUnitsSection(false);
    setEditItem(null);
    setOpen(false);
  };

  // ====================================
  // CREATE PRODUCT
  // ====================================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!baseUnitId) {
      toast.error("Base unit is required");
      return;
    }

    let user = await window.api.getUserSession();

    const payload = {
      name,
      sku: sku || null,
      category_id: categoryId || null,
      brand_id: brandId || null,
      base_unit_id: baseUnitId,
      buying_price: parseFloat(buyingPrice) || 0,
      cost_price: parseFloat(costPrice) || 0,
      selling_price: parseFloat(sellingPrice) || 0,
      tax_percent: parseFloat(taxPercent) || 0,
      min_stock_level: parseInt(minStockLevel) || 0,
      opening_stock: parseFloat(openingStock) || 0,
      barcode: barcode || null,
      description: description || null,
      image: imageFile,
      user_id: currentUser.id,
      status,
      units: productUnits.length > 0 ? productUnits : null,
      // units: Array.isArray(productUnits) ? productUnits : [],
    };

    const result = await dispatch(createProductSlice(payload)).unwrap();

    if (result.success) {
      toast.success("Product created successfully");
      resetForm();
      dispatch(
        getProductsSlice({
          search: searchBar,
          category_id: filterCategory,
          brand_id: filterBrand,
          status: filterStatus === "All" ? "" : filterStatus,
        })
      );
    } else {
      toast.error(result.error || "Failed to create product");
    }
  };

  // ====================================
  // UPDATE PRODUCT
  // ====================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      sku: sku || null,
      category_id: categoryId || null,
      brand_id: brandId || null,
      base_unit_id: baseUnitId,
      buying_price: parseFloat(buyingPrice) || 0,
      cost_price: parseFloat(costPrice) || 0,
      selling_price: parseFloat(sellingPrice) || 0,
      tax_percent: parseFloat(taxPercent) || 0,
      min_stock_level: parseInt(minStockLevel) || 0,
      opening_stock: parseFloat(openingStock) || 0,
      barcode: barcode || null,
      description: description || null,
      image: imageFile,
      status,
      units: productUnits.length > 0 ? productUnits : null,
    };

    const result = await dispatch(
      updateProductSlice({ id: editItem.id, data: payload })
    ).unwrap();

    if (result.success) {
      toast.success("Product updated successfully");
      resetForm();
      dispatch(
        getProductsSlice({
          search: searchBar,
          category_id: filterCategory,
          brand_id: filterBrand,
          status: filterStatus === "All" ? "" : filterStatus,
        })
      );
    } else {
      toast.error(result.error || "Failed to update product");
    }
  };

  // ====================================
  // DELETE PRODUCT
  // ====================================
  const handleDelete = async () => {
    const result = await dispatch(deleteProductSlice(deleteItem.id)).unwrap();

    if (result.success) {
      toast.success("Product deleted successfully");
      dispatch(
        getProductsSlice({
          search: searchBar,
          category_id: filterCategory,
          brand_id: filterBrand,
          status: filterStatus === "All" ? "" : filterStatus,
        })
      );
      setOpenDeletePopup(false);
    } else {
      toast.error(result.error || "Failed to delete product");
    }
  };

  // ====================================
  // ADD PRODUCT UNIT
  // ====================================
  const addProductUnit = () => {
    setProductUnits([
      ...productUnits,
      {
        unit_id: "",
        conversion_value: 1,
        selling_price: 0,
        purchase_price: 0,
        barcode: "",
        sku: "",
      },
    ]);
  };

  const removeProductUnit = (index) => {
    setProductUnits(productUnits.filter((_, i) => i !== index));
  };

  const updateProductUnit = (index, field, value) => {
    const updated = [...productUnits];
    updated[index][field] = value;
    setProductUnits(updated);
  };

  // ====================================
  // TABLE COLUMNS
  // ====================================
  const columns = [
    {
      label: "Product",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.name}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">No Img</span>
            </div>
          )}
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-gray-500">{row.sku || "N/A"}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Category",
      accessor: "category",
      render: (row) => row.category?.categoryName || "N/A",
    },
    {
      label: "Brand",
      accessor: "brand",
      render: (row) => row.brand?.brandName || "N/A",
    },
    {
      label: "Stock",
      accessor: "opening_stock",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${row.opening_stock <= row.min_stock_level
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
            }`}
        >
          {row.opening_stock} {row.base_unit?.abbreviation}
        </span>
      ),
    },
    {
      label: "Buying Price",
      accessor: "buying_price",
      render: (row) => `${defaultCurrency} ${row.buying_price}`,
    },
    {
      label: "Selling Price",
      accessor: "selling_price",
      render: (row) => `${defaultCurrency} ${row.selling_price}`,
    },
    {
      label: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${row.status === "active"
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600"
            }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // ====================================
  // TABLE ACTIONS
  // ====================================
  const actions = [
    {
      label: "View",
      icon: EyeIcon,
      className: "bg-secondary text-white hover:bg-secondary-dark rounded-md",
      onClick: (row) => {
        setViewItem(row);
        console.log("-----------------------", row)
        setOpenViewDialog(true);
      },
    },
    {
      label: "Edit",
      icon: PencilIcon,
      className: "bg-primary-dark text-white hover:bg-blue-600 rounded-md",
      onClick: async (row) => {
        setOpen(true);
        setEditItem(row);

        setName(row.name);
        setSku(row.sku || "");
        setCategoryId(row.category_id || "");
        setBrandId(row.brand_id || "");
        setBaseUnitId(row.base_unit_id);
        setBuyingPrice(row.buying_price);
        setCostPrice(row.cost_price);
        setSellingPrice(row.selling_price);
        setTaxPercent(row.tax_percent);
        setMinStockLevel(row.min_stock_level);
        setOpeningStock(row.opening_stock);
        setBarcode(row.barcode || "");
        setDescription(row.description || "");
        setStatus(row.status);

        if (row.imageUrl) {
          const base64 = await window.api.readImageBase64(row.imageUrl);
          setImagePreview(base64);
        }

        if (row.units && row.units.length > 0) {
          setProductUnits(
            row.units.map((u) => ({
              unit_id: u.unit_id,
              conversion_value: u.conversion_value,
              selling_price: u.selling_price,
              purchase_price: u.purchase_price,
              barcode: u.barcode || "",
              sku: u.sku || "",
            }))
          );
          setShowUnitsSection(true);
        }
      },
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


  const Info = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );


  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      <ToastContainer />

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <PageHeading
            title="Products"
            subtitle="Manage your product inventory"
            className="w-full"
          />
          <ButtonFeild
            onClick={() => setOpen(true)}
            label="Add Product"
            className="w-auto max-w-[200px] px-4 py-2"
          />
        </div>

        {/* SEARCH & FILTERS */}
        <div className="grid grid-cols-4 gap-4">
          <InputFeild
            label="Search Products"
            placeholder="Search by name, SKU, barcode"
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
          />

          <CategoryDropdown
            categories={categories}
            value={filterCategory}
            onChange={setFilterCategory}
          />

          <ObjectDropDownFeild
            label="Filter by Brand"
            value={filterBrand}
            onChange={setFilterBrand}
            options={[
              { label: "All Brands", value: "" },
              ...brands.map((b) => ({ label: b.brandName, value: b.id })),
            ]}
          />
          <DropdownFeild
            label="Filter by Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={["All", "active", "inactive"]}
          />
        </div>
      </div>

      {/* DELETE POPUP */}
      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.name}
        onConfirm={handleDelete}
        onClose={() => setOpenDeletePopup(false)}
      />

      {/* VIEW DIALOG */}

      <DialogPopUp
        isOpen={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        className="w-full max-w-4xl"
      >
        {viewItem && (
          <div className="space-y-6">

            {/* HEADER */}
            <div className="border-b pb-3">
              <h2 className="text-xl font-semibold">{viewItem.name}</h2>
              <p className="text-sm text-gray-500">
                SKU: {viewItem.sku || "—"} | Barcode: {viewItem.barcode || "—"}
              </p>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Info label="Category" value={viewItem.category?.categoryName} />
              <Info label="Brand" value={viewItem.brand?.brandName} />
              <Info label="Status" value={viewItem.status} />
              <Info label="Tax %" value={`${viewItem.tax_percent}%`} />
              <Info label="Min Stock" value={viewItem.min_stock_level} />
              <Info label="Opening Stock" value={viewItem.opening_stock} />
            </div>

            {/* PRICES */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <Info label="Buying Price" value={`${defaultCurrency} ${viewItem.buying_price}`} />
              <Info label="Cost Price" value={` ${defaultCurrency} ${viewItem.cost_price}`} />
              <Info label="Selling Price" value={`${defaultCurrency} ${viewItem.selling_price}`} />
            </div>

            {/* BASE UNIT */}
            <div>
              <h3 className="font-semibold mb-1">Base Unit</h3>
              <p className="text-sm">
                {viewItem.base_unit?.unit_name} ({viewItem.base_unit?.abbreviation})
              </p>
            </div>

            {/* UNITS TABLE */}
            <div>
              <h3 className="font-semibold mb-2">Product Units</h3>

              <div className="overflow-x-auto border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Unit</th>
                      <th className="border px-3 py-2 text-left">Conversion</th>
                      <th className="border px-3 py-2 text-left">Selling</th>
                      <th className="border px-3 py-2 text-left">Purchase</th>
                      <th className="border px-3 py-2 text-left">Barcode</th>
                      <th className="border px-3 py-2 text-left">SKU</th>
                    </tr>
                  </thead>

                  <tbody>
                    {viewItem.units?.length ? (
                      viewItem.units.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">
                            {u.unit?.unit_name} ({u.unit?.abbreviation})
                          </td>
                          <td className="border px-3 py-2">
                            1 {u.unit?.abbreviation} = {u.conversion_value}{" "}
                            {viewItem.base_unit?.abbreviation}
                          </td>
                          <td className="border px-3 py-2">{defaultCurrency} {u.selling_price}</td>
                          <td className="border px-3 py-2">{defaultCurrency} {u.purchase_price}</td>
                          <td className="border px-3 py-2">{u.barcode || "—"}</td>
                          <td className="border px-3 py-2">{u.sku || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-3 text-gray-500">
                          No additional units
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DESCRIPTION */}
            {viewItem.description && (
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-sm text-gray-700">{viewItem.description}</p>
              </div>
            )}
          </div>
        )}
      </DialogPopUp>


      {/* CREATE/EDIT FORM */}
      <DialogPopUp isOpen={open} onClose={resetForm} className="w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={editItem ? handleUpdate : handleCreate} className="space-y-4">
          <PageHeading
            title={editItem ? "Update Product" : "Create New Product"}
            subtitle="Fill in the product details"
          />

          {/* IMAGE & BASIC INFO */}
          <div className="flex gap-4">
            {/* Image Upload */}
            <div className="w-1/3">
              <label className="block mb-2 font-semibold">Product Image</label>
              <div
                className="cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center py-6 px-4 hover:border-gray-600 transition"
                onClick={pickImage}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="mt-2 text-gray-500 text-sm">Click to upload</span>
                  </>
                )}
              </div>
            </div>

            {/* Basic Fields */}
            <div className="w-2/3 grid grid-cols-2 gap-3">
              <InputFeild
                label="Product Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <InputFeild label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
              <InputFeild
                label="Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              <DropdownFeild
                label="Status"
                value={status}
                onChange={setStatus}
                options={["active", "inactive"]}
              />
            </div>
          </div>

          {/* CATEGORY, BRAND, UNIT */}
          <div className="grid grid-cols-3 gap-4">


            <CategoryDropdown
              label="Category"
              categories={categories}
              value={categoryId}
              onChange={setCategoryId}
            />



            <ObjectDropDownFeild
              label="Brand"
              value={brandId}
              onChange={setBrandId}
              options={brands.map((b) => ({ label: b.brandName, value: b.id }))}
              searchable={true}
            />
            <ObjectDropDownFeild
              label="Base Unit *"
              value={baseUnitId}
              onChange={setBaseUnitId}
              options={units.map((u) => ({ label: u.unit_name, value: u.id }))}
              required
            />
          </div>

          {/* PRICING */}
          <div className="grid grid-cols-4 gap-4">
            <InputFeild
              label="Buying Price *"
              type="number"
              step="0.01"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
              required
            />
            <InputFeild
              label="Cost Price"
              type="number"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />
            <InputFeild
              label="Selling Price *"
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
            <InputFeild
              label="Tax %"
              type="number"
              step="0.01"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
            />
          </div>

          {/* STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <InputFeild
              label="Opening Stock"
              type="number"
              step="0.01"
              value={openingStock}
              onChange={(e) => setOpeningStock(e.target.value)}
            />
            <InputFeild
              label="Min Stock Level"
              type="number"
              value={minStockLevel}
              onChange={(e) => setMinStockLevel(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <InputFeild
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* PRODUCT UNITS SECTION */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Additional Units (Optional)</h3>
              <button
                type="button"
                onClick={() => setShowUnitsSection(!showUnitsSection)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showUnitsSection ? "Hide" : "Show"} Units
              </button>
            </div>

            {showUnitsSection && (
              <div className="space-y-3">
                {productUnits.map((unit, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 items-end">
                    <ObjectDropDownFeild
                      label="Unit"
                      value={unit.unit_id}
                      onChange={(val) => updateProductUnit(index, "unit_id", val)}
                      options={units.map((u) => ({ label: u.unit_name, value: u.id }))}
                    />
                    <InputFeild
                      label="Conversion"
                      type="number"
                      value={unit.conversion_value}
                      onChange={(e) =>
                        updateProductUnit(index, "conversion_value", e.target.value)
                      }
                    />
                    <InputFeild
                      label="Sell Price"
                      type="number"
                      step="0.01"
                      value={unit.selling_price}
                      onChange={(e) =>
                        updateProductUnit(index, "selling_price", e.target.value)
                      }
                    />
                    <InputFeild
                      label="Buy Price"
                      type="number"
                      step="0.01"
                      value={unit.purchase_price}
                      onChange={(e) =>
                        updateProductUnit(index, "purchase_price", e.target.value)
                      }
                    />
                    <InputFeild
                      label="Barcode"
                      value={unit.barcode}
                      onChange={(e) => updateProductUnit(index, "barcode", e.target.value)}
                    />
                    <div className="flex flex-col pb-2">
                      {/* invisible label for alignment */}
                      <label className="text-sm font-medium opacity-0 select-none">
                        Action
                      </label>

                      <button
                        type="button"
                        onClick={() => removeProductUnit(index)}
                        className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 h-[42px]"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                ))}

                <button
                  type="button"
                  onClick={addProductUnit}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add Unit
                </button>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <ButtonFeild
            label={editItem ? "Update Product" : "Create Product"}
            type="submit"
          />
        </form>
      </DialogPopUp>

      {/* TABLE */}
      {/* <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm"> */}
        <TableFeild columns={columns} data={products} actions={actions} />
      {/* </div> */}
    </div>
  );
}