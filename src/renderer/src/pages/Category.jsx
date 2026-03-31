import { useState, useEffect } from "react";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createCategorySlice, deleteCategorySlice, getCategoriesSlice , updateCategorySlice } from "../store/categorySlice";
import DialogPopUp from "../components/DialogPopUp"
import GridView from "../components/GridView";
import PageHeading from "../components/PageHeading";
import Breadcrumbs from "../components/Breadcrumbs";
import DeletePopup from "../components/DeletePopup";

export default function Category() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.list);
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [parentId, setParentId] = useState(null)
  const [open, setOpen] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([{ label: "Home", id: null }]);
  const [editItem, setEditItem] = useState(null)
  const [openDeletePopup , setOpenDeletePopup] = useState(null)
  const [deleteItem , setdeleteItem] = useState(null)

  const currentUser = useSelector((state) => state.users.currentUser);


const resetForm = () => {
  setCategoryName("");
  setImageFile(null);
  setImagePreview(null);
  setEditItem(null);
};

  useEffect(() => {
    dispatch(getCategoriesSlice(null));
  }, [dispatch]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    // let user_id = await window.api.getUserSession()
    // console.log("testing",user_id.user.id)
    const payload = {
      categoryName,
      image: imageFile,
      parentId,
      user_id: currentUser.id
      
    };

    const result = await dispatch(createCategorySlice(payload)).unwrap();

    if (result.success) {
      toast.success("Category created successfully");
      setCategoryName("");
      setImageFile(null);
      setImagePreview(null);
      setOpen(false)

      dispatch(getCategoriesSlice(parentId)); // refresh grid
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      categoryName,
      image: imageFile,
    };
     console.log(editItem.id)
    const result = await dispatch(updateCategorySlice({id:editItem.id,data:payload})).unwrap();

    if (result.success) {
      toast.success("Category updated successfully");
      setCategoryName("");
      setImageFile(null);
      setImagePreview(null);
        setOpen(false)

      dispatch(getCategoriesSlice(parentId)); // refresh grid
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const pickImage = async () => {
    const filePath = await window.api.selectImageFile();
    if (filePath) {
      setImageFile(filePath);

      const base64 = await window.api.readImageBase64(filePath);
      setImagePreview(base64);
    }
  };

 const handleDeleteCategory = async (id) => {
  if (!id) return;

  try {
    const result = await dispatch(deleteCategorySlice(id)).unwrap(); // dispatch your slice

    if (result.success) {
      toast.success("Category deleted successfully");
      dispatch(getCategoriesSlice(parentId)); // refresh grid
      setOpenDeletePopup(null)
    } else {
      toast.error(result.error || "Failed to delete category");
    }
  } catch (error) {
    toast.error("Something went wrong while deleting");
    console.error("Delete error:", error);
  }
};


  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      {/* <ToastContainer /> */}
          <ToastContainer
        position="top-center"
        autoClose={10}  
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable={false}
       />
      <div className="bg-white  rounded-xl shadow-sm flex p-4">
        <PageHeading title="Category" subtitle="Manage your products Category" className="w-full" />

        <ButtonFeild onClick={() => { setOpen(true) }} label="Create Category" className="w-auto max-w-[200px] px-4 py-2" />
      </div>
        <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.categoryName}
        onConfirm={()=>{
          let id = deleteItem.id  
          console.log(id)
          handleDeleteCategory(id)
        }
        }
        onClose={()=>setOpenDeletePopup()}
        />
      <DialogPopUp
        isOpen={open}
        className={"w-xl"}
        onClose={() => {
          setOpen(false)
          setImagePreview(null)
          setEditItem(null)
          resetForm()
          
        }}
      >

      
        <form onSubmit={(editItem)?handleUpdateCategory:handleCreateCategory}>
          <InputFeild
            label="Enter Category Name"
            placeholder="Enter Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <div className="my-4">
            <label className="block mb-2">Upload Image</label>


            <button
              type="button"
              onClick={pickImage}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg 
             hover:bg-gray-200 hover:border-gray-400 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 15a4 4 0 018 0m0 0a4 4 0 018 0m-8 0v6" />
              </svg>
              Upload Image
            </button>

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 mt-3 rounded" />
            )}
          </div>

          <ButtonFeild label={(!editItem)?"Create Category":"updateCategory"} type="submit" />
        </form>
      </DialogPopUp>

      <Breadcrumbs
        items={breadcrumbs}
        onClick={(item, idx) => {
          // Go back to clicked breadcrumb
          setParentId(item.id);

          // Remove deeper breadcrumbs
          setBreadcrumbs((prev) => prev.slice(0, idx + 1));

          dispatch(getCategoriesSlice(item.id));
        }}
      />
   

      {/* GRID VIEW BELOW FORM */}

      <GridView
        data={categories}
        onOpen={(item) => {
          setParentId(item.id)
          console.log(item.id)
          // Update breadcrumbs
          setBreadcrumbs((prev) => [...prev, { label: item.categoryName, id: item.id }]);
          dispatch(getCategoriesSlice(item.id))
        }}
        onEdit={(item) => {
          setOpen(true)
          setEditItem(item)
          setCategoryName(item.categoryName)
          if (item.image) {
            window.api.readImageBase64(item.imageUrl).then((base64) => {
              setImagePreview(base64);
            });
          }

        }}
        onDelete={(item) =>{
           setOpenDeletePopup(true)
           console.log(item)
           setdeleteItem(item)
           
        }}
      />


    </div>
  );
}
