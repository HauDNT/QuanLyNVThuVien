import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CONTEXTS:  
import ProviderContext from "./context/ProviderContext.js";
import { UserRoleProvider } from "./context/UserRoleContext.js";

// COMPONENTS:
import CreateBarCode from "./views/CreateBarCode.js";
import Home from "./views/Home.js";
import Dashboard from "./views/Dashboard/Dashboard.js";
import Login from "./views/Authenticate/Login.js";
import UserAccounts from "./views/Users/Accounts.js";
import CreateAccountUser from "./views/Users/CreateAccount.js";
import AccountsTrash from "./views/Users/AccountsTrash.js";
import EditUser from "./views/Users/EditUser.js";
import Positions from "./views/Users/Position.js";
import Roles from "./views/Users/Roles.js";
import Bills from "./views/Bills/Bills.js";
import BillDetail from "./views/Bills/BillDetail.js";
import BillTypes from "./views/Bills/BillTypes.js";
import CreatBill from "./views/Bills/CreateBill.js";
import EditBill from "./views/Bills/EditBill.js";
import BillTrash from "./views/Bills/BillTrash.js";
import ViewCataloging from "./views/Books/ViewCataloging.js";
import CreateCataloging from "./views/Books/CreateCataloging.js";
import EditCataloging from "./views/Books/EditCataloging.js";
import ApproveView from "./views/Approve/ApproveView.js";
import ApproveCreate from "./views/Approve/ApproveCreate.js";
import ApproveUpdate from "./views/Approve/ApproveUpdate.js";
import EncodeTitles from "./views/EncodeTitles.js";
import Rooms from "./views/Rooms/Rooms.js";
import StoreTypes from "./views/StoreTypes/StoreTypes.js";
import StatusDocs from "./views/StatusDocs/StatusDocs.js";
import PageNotFound from "./views/PageNotFound";

import "./styles/App.scss";

function App() {
  return (
    <div className="App">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css?family=Poppins:300&display=swap" rel="stylesheet"/>
        <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet" />
        <script src="https://kit.fontawesome.com/a81368914c.js"></script>

        <UserRoleProvider>
            <ProviderContext>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" exact element={<Login/>} />
                        <Route element={<Home/>}>
                            <Route path="/" exact element={<Dashboard/>}/>
                            <Route path="barcode" element={<CreateBarCode/>}/>
                            <Route path="users/" element={<UserAccounts/>}/>
                            <Route path="users/create" element={<CreateAccountUser/>}/>
                            <Route path="users/edit/:id" element={<EditUser/>}/>
                            <Route path="users/trash" element={<AccountsTrash/>}/>
                            <Route path="positions" element={<Positions/>}/>
                            <Route path="roles" element={<Roles/>}/>
                            <Route path="bills/createbill" element={<CreatBill/>}/>
                            <Route path="bills/detail/:billId" element={<BillDetail/>}/>
                            <Route path="bills/edit/:billId" element={<EditBill/>}/>
                            <Route path="bills/types" exact element={<BillTypes/>}/>
                            <Route path="bills/:type" element={<Bills/>}/>
                            <Route path="bills/trash/:type" element={<BillTrash/>}/>
                            <Route path="bills/trash/:type" element={<BillTrash/>}/>
                            <Route path="book/cataloging/all" element={<ViewCataloging/>}/>
                            <Route path="book/cataloging/create" element={<CreateCataloging/>}/>
                            <Route path="book/cataloging/edit/:id" element={<EditCataloging/>}/>
                            <Route path="approve/:id" element={<ApproveView/>}/>
                            <Route path="approve/create/:id" element={<ApproveCreate/>}/>
                            <Route path="approve/update/:id" element={<ApproveUpdate/>}/>
                            <Route path="encodetitles" element={<EncodeTitles/>}/>
                            <Route path="rooms" element={<Rooms/>}/>
                            <Route path="storetypes" element={<StoreTypes/>}/>
                            <Route path="statusdocs" element={<StatusDocs/>}/>
                        </Route>
                        <Route path="/*" exact element={<PageNotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </ProviderContext>
        </UserRoleProvider>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
        />

        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
    </div>
  );
}

export default App;
