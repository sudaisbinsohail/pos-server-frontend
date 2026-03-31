import { useState, useEffect } from "react";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrandSlice,
  deleteBrandSlice,
  getBrandsSlice,
  updateBrandSlice,
} from "../store/brandSlice";
import DialogPopUp from "../components/DialogPopUp";
import BrandGridView from "../components/BrandGridView";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";

export default function Brand() {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brand.list);

  const [brandName, setBrandName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const currentUser = useSelector((state) => state.users.currentUser);

  // Load all brands
  useEffect(() => {
    dispatch(getBrandsSlice());
  }, [dispatch]);

  // ================================
  // CREATE BRAND
  // ================================
  const handleCreateBrand = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    // let user_id = await window.api.getUserSession();

    const payload = {
      brandName,
      image: imageFile,
      user_id: currentUser.id,
    };

    const result = await dispatch(createBrandSlice(payload)).unwrap();

    if (result.success) {
      toast.success("Brand created successfully");

      resetForm();
      dispatch(getBrandsSlice());
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  // ================================
  // UPDATE BRAND
  // ================================
  const handleUpdateBrand = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    const payload = {
     brandName,
      image: imageFile,
    };

    const result = await dispatch(
      updateBrandSlice({ id: editItem.id, data: payload })
    ).unwrap();

    if (result.success) {
      toast.success("Brand updated successfully");

      resetForm();
      dispatch(getBrandsSlice());
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  // ================================
  // DELETE BRAND
  // ================================
  const handleDeleteBrand = async (id) => {
    if (!id) return;

    try {
      const result = await dispatch(deleteBrandSlice(id)).unwrap();

      if (result.success) {
        toast.success("Brand deleted successfully");
        dispatch(getBrandsSlice());
        setOpenDeletePopup(false);
      } else {
        toast.error(result.error || "Failed to delete brand");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ================================
  // PICK IMAGE
  // ================================
  const pickImage = async () => {
    const filePath = await window.api.selectImageFile();
    if (filePath) {
      setImageFile(filePath);
      const base64 = await window.api.readImageBase64(filePath);
      setImagePreview(base64);
    }
  };

  // ================================
  // RESET FORM
  // ================================
  const resetForm = () => {
    setBrandName("");
    setImageFile(null);
    setImagePreview(null);
    setEditItem(null);
    setOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
       <ToastContainer
        position="top-center"
        autoClose={10}  
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable={false}
       />

      <div className="bg-white p-6 rounded-xl shadow-sm flex">
        <PageHeading
          title="Brand"
          subtitle="Manage your product brands"
          className="w-full"
        />

        <ButtonFeild
          onClick={() => setOpen(true)}
          label="Create Brand"
          className="w-auto max-w-[200px] px-4 py-2"
        />
      </div>

      {/* DELETE POPUP */}
      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.brandName}
        onConfirm={() => handleDeleteBrand(deleteItem.id)}
        onClose={() => setOpenDeletePopup(false)}
      />

      {/* FORM POPUP */}
      <DialogPopUp
        isOpen={open}
        className={"w-xl"}
        onClose={() => {
          resetForm();
        }}
      >
        <form onSubmit={editItem ? handleUpdateBrand : handleCreateBrand}>
          <InputFeild
            label="Enter Brand Name"
            placeholder="Enter Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />

          <div className="my-4">
            <label className="block mb-2">Upload Image</label>

            <button
              type="button"
              onClick={pickImage}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg 
                hover:bg-gray-200 hover:border-gray-400 transition flex items-center gap-2"
            >
              Upload Image
            </button>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 mt-3 rounded"
              />
            )}
          </div>

          <ButtonFeild
            label={editItem ? "Update Brand" : "Create Brand"}
            type="submit"
          />
        </form>
      </DialogPopUp>

      {/* GRID VIEW */}
      <BrandGridView
        data={brands}
        onOpen={() => {}}
        onEdit={(item) => {
          setOpen(true);
          setEditItem(item);
          setBrandName(item.brandName);

          if (item.imageUrl) {
            window.api.readImageBase64(item.imageUrl).then((base64) => {
              setImagePreview(base64);
            });
          }
        }}
        onDelete={(item) => {
          setDeleteItem(item);
          setOpenDeletePopup(true);
        }}
      />
    </div>
  );
}
