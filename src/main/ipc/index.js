import userIPC from "./userIpc"
import companyIPC from "./companyIpc";
import categoryIPC from "./categoryIpc";
import brandIPC from "./brandIpc";
import supplierIPC from "./supplierIpc";
import fileIPC from "./fileIpc";
import unitIPC from "./unitIpc";
import productIPC from "./productIpc";
import saleIPC from "./saleIpc";
import customerIPC from "./customerIpc";
import rolePermissionIPC from "./rolepermissionIpc";


export default function registerIpcHandlers() {
  userIPC();
  companyIPC();
  categoryIPC();
  brandIPC();
  supplierIPC();
  fileIPC();
  unitIPC();
  productIPC();
  saleIPC();
  customerIPC()
  rolePermissionIPC();
  

}
