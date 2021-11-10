import Buttons from "@/views/Components/Buttons.js";
import Calendar from "@/views/Calendar/Calendar.js";
import Charts from "@/views/Charts/Charts.js";

import ErrorPage from "@/views/Pages/ErrorPage.js";
import ExtendedForms from "@/views/Forms/ExtendedForms.js";
import ExtendedTables from "@/views/Tables/ExtendedTables.js";
import FullScreenMap from "@/views/Maps/FullScreenMap.js";
import GoogleMaps from "@/views/Maps/GoogleMaps.js";
import GridSystem from "@/views/Components/GridSystem.js";
import Icons from "@/views/Components/Icons.js";
import LockScreenPage from "@/views/Pages/LockScreenPage.js";
import LoginPage from "@/views/Pages/LoginPage.js";
import Notifications from "@/views/Components/Notifications.js";
import Panels from "@/views/Components/Panels.js";
import PricingPage from "@/views/Pages/PricingPage.js";
import RTLSupport from "@/views/Pages/RTLSupport.js";
import ReactTables from "@/views/Tables/ReactTables.js";
import RegisterPage from "@/views/Pages/RegisterPage.js";
import RegularForms from "@/views/Forms/RegularForms.js";
import RegularTables from "@/views/Tables/RegularTables.js";
import SweetAlert from "@/views/Components/SweetAlert.js";
import TimelinePage from "@/views/Pages/Timeline.js";
import Typography from "@/views/Components/Typography.js";
import UserProfile from "@/views/Pages/UserProfile.js";
import ValidationForms from "@/views/Forms/ValidationForms.js";
import VectorMap from "@/views/Maps/VectorMap.js";
import Widgets from "@/views/Widgets/Widgets.js";
import Wizard from "@/views/Forms/Wizard.js";


import HomePage from "@/views/HomePage.js";
import MarketplacePage from "@/views/User/Market/MarketplacePage.js";
import InventoryPage from "@/views/User/Inventory/Inventory.js";
import CategoryPage from "@/views/User/Inventory/Category.js";
import ItemPage from "@/views/User/Inventory/ItemPage.js";
import AccountPage from "@/views/User/Account/Account.js";
import ProfilePage from "@/views/User/Account/Profile.js";
import SecurityPage from "@/views/User/Account/Security.js";
import ForgetPasswordPage from "@/views/Forget/ForgetPasswordPage.js";
import ResetPasswordPage from "@/views/Forget/ResetPasswordPage.js";
import PresalePage from "@/views/User/Presale/Presale.js";

import CrateMainPage from "@/views/User/Crate/CrateMainPage.js";
import CrateItemPage from "@/views/User/Crate/CrateItemPage.js";

import AdminDashboard from "@/views/Admin/AdminDashboard.js";
import AdminUserListPage from "@/views/Admin/AdminUserList.js";
import AdminMintPage from "@/views/Admin/AdminMintPage.js";
import AdminAssignPage from "@/views/Admin/AdminAssignPage.js";
import AdminTokenInfoPage from "@/views/Admin/AdminTokenInfoPage.js";
import AdminToggleMarketPage from "@/views/Admin/AdminToggleMarketPage.js";
import AdminCratesPage from "@/views/Admin/AdminCratesPage.js";
import AdminPresetPage from "@/views/Admin/AdminPresetPage.js";

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import PaymentIcon from '@material-ui/icons/Payment'; 
import ReceiptIcon from '@material-ui/icons/Receipt';

var dashRoutes = [  
  {
    path: "/",
    name: "Home Page",
    component: HomePage,
    layout: "/user"
  },
  {
    path: "/marketplace",
    name: "Marketplace Page",
    component: MarketplacePage,
    layout: "/user"
  },
  {
    path: "/inventory",
    name: "Inventory Page",
    component: InventoryPage,
    layout: "/user"
  },
  {
    path: "/inventory/:category",
    name: "Inventory Category Page",
    component: CategoryPage,
    layout: "/user"
  },
  {
    path: "/inventory/:category/:tokenId",
    name: "Inventory Item Page",
    component: ItemPage,
    layout: "/user"
  },
  {
    path: "/account",
    name: "Account Main Page",
    component: AccountPage,
    layout: "/user"
  },
  {
    path: "/account/profile",
    name: "Account Profile Page",
    component: ProfilePage,
    layout: "/user"
  },
  {
    path: "/account/security",
    name: "Account Security Page",
    component: SecurityPage,
    layout: "/user"
  },
  {
    path: "/presale",
    name: "UMBL Presale Page",
    component: PresalePage,
    layout: "/user"
  },
  {
    path: "/crates",
    name: "Crate Main Page",
    component: CrateMainPage,
    layout: "/user"
  },
  {
    path: "/crates/:crateId",
    name: "Crate Item Page",
    component: CrateItemPage,
    layout: "/user"
  },
  {
    path: "/forgot",
    name: "Forget Password Page",
    component: ForgetPasswordPage,
    layout: "/user"
  },
  {
    path: "/reset",
    name: "Rest Password Page",
    component: ResetPasswordPage,
    layout: "/user"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: AdminDashboard,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Users",
    icon: PeopleAltSharpIcon,
    state: "usersCollapse",
    views: [
      {
        path: "/user-list",
        name: "Users List",
        rtlName: "عالتسعير",
        mini: "L",
        rtlMini: "ع",
        component: AdminUserListPage,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Tokens",
    icon: PaymentIcon,
    state: "tokenCollapse",
    views: [
      {
        path: "/mint",
        name: "Mint",
        rtlName: "عالتسعير",
        mini: "M",
        rtlMini: "ع",
        component: AdminMintPage,
        layout: "/admin"
      },
      {
        path: "/info",
        name: "Info",
        rtlName: "عالتسعير",
        mini: "T",
        rtlMini: "ع",
        component: AdminTokenInfoPage,
        layout: "/admin"
      },
      {
        path: "/assign",
        name: "Assign",
        rtlName: "عالتسعير",
        mini: "A",
        rtlMini: "ع",
        component: AdminAssignPage,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Market",
    icon: ReceiptIcon,
    state: "marketCollapse",
    views: [
      {
        path: "/presets",
        name: "Presets",
        rtlName: "عالتسعير",
        mini: "P",
        rtlMini: "ع",
        component: AdminPresetPage,
        layout: "/admin"
      },
      {
        path: "/crates",
        name: "Crates",
        rtlName: "عالتسعير",
        mini: "C",
        rtlMini: "ع",
        component: AdminCratesPage,
        layout: "/admin"
      },
      {
        path: "/market",
        name: "Toggle",
        rtlName: "عالتسعير",
        mini: "M",
        rtlMini: "ع",
        component: AdminToggleMarketPage,
        layout: "/admin"
      },
    ]
  }  
];
export default dashRoutes;
