import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import AllTrainer from "../pages/AllTrainer";
import TrainerDetails from "../pages/TrainerDetails";
import BeATrainer from "../pages/BeATrainer";
import TrainerBooking from "../pages/TrainerBooking";
import Main from "../layout/Main";
import TrainerLogin from "../pages/trainer/TrainerLogin";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/sharedDash/Dashboard";
import NewsletterSubscribers from "../pages/admin/NewsletterSubscribers";
import AdminAllTrainers from "../pages/admin/AdminAllTrainers";
import AppliedTrainers from "../pages/admin/AppliedTrainers";
import ActivityLogs from "../pages/ActivityLogs";
import UserProfile from "../pages/UserProfile";
import AddClass from "../pages/admin/AddClass";
import AllClasses from "../pages/AllClasses";
import ClassDetails from "../pages/ClassDetails";
import TrainerDetailsFromClass from "../pages/TrainerDetailsFromClass";
import TrainerBookingPage from "../pages/TrainerBookingPage";
import Payment from "../pages/Payment";
import FinalPayment from "../pages/FinalPayment";
import ManageSlot from "../pages/trainer/ManageSlot";
import BookedTrainers from "../pages/BookedTrainers";
import AddForum from "../pages/AddForum";
import Forum from "../pages/Forum";
import ForumDetails from "../pages/ForumDetails";
import PrivateRoute from "./PrivateRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";
import TrainerPrivateRoute from "./TrainerPrivateRoute";
import Balance from "../pages/admin/Balance";
import AddNewSlot from "../pages/trainer/AddNewSlot";
import PaymentSuccess from "../pages/PaymentSuccess";
import AllProducts from "../pages/admin/AllProducts";
import ProductPayment from "../payment/ProductPayment";
import PaymentFail from "../payment/PaymentFail";
import PaymentCancel from "../payment/PaymentCancel";
import PaymentError from "../payment/PaymentError";
import SSLPaymentSuccess from "../payment/SSLPaymentSuccess";
import SalesReport from "../pages/admin/SalesReport";
import AddPet from "../pages/trainer/AddPet";
import AllPets from "../pages/trainer/AllPets";
import PetDetails from "../pages/trainer/PetDetails";
import AdoptPet from "../pages/AdoptPet";
import AdoptPetDetails from "../pages/AdoptPetDetails";
import AdoptPetPayment from "../payment/AdoptPetPayment";
import PetSalesReport from "../pages/admin/PetSalesReport";
import MemberChatBox from "../pages/Member/MemberChatBox";
import TrainerChat from "../pages/trainer/TrainerChat";
import ChatWithMember from "../pages/trainer/ChatWithMember";
import PetDiseaseDetection from "../pages/Member/PetDiseaseDetection";
import ReportLostPet from "../pages/Member/ReportLostPet";
import LostPets from "../pages/LostPets";
import LostPet from "../pages/admin/LostPet";
import Vet from "../pages/admin/Vet";
import VetDetails from "../pages/VetDetails";
import AllVets from "../pages/AllVets";
import FAQ from "../pages/admin/FAQ";
import Appointments from "../pages/vet/Appoinments";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/trainer-login",
        element: <TrainerLogin />,
      },
      {
        path: "/admin-login",
        element: <AdminLogin />,
      },
      {
        path: "/all-volunteer",
        element: <AllTrainer />,
      },
      {
        path: "/volunteer/:id",
        element: <TrainerDetails />,
      },
      {
        path: "/all-products",
        element: <AllClasses />,
      },
      {
        path: "/products/:id",
        element: <ClassDetails />,
      },
      {
        path: "/adopt-pet",
        element: <AdoptPet />,
      },
      {
        path: "/adopt-pet/:id",
        element: <AdoptPetDetails />,
      },
      {
        path: "/vets/:id",
        element: <VetDetails />,
      },
      {
        path: "/all-vets",
        element: <AllVets />,
      },
      {
        path: "/adopt-pet-payment/:id",
        element: <AdoptPetPayment />,
      },
      {
        path: "/product-payment/:id",
        element: <ProductPayment />,
      },
      {
        path: "/book-trainer/:id",
        element: (
          <PrivateRoute>
            <TrainerBooking />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "/final-payment",
        element: (
          <PrivateRoute>
            <FinalPayment />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/fail",
        element: <PaymentFail />,
      },
      {
        path: "/payment/cancel",
        element: <PaymentCancel />,
      },
      {
        path: "/payment/success",
        element: <SSLPaymentSuccess />,
      },
      {
        path: "/payment/error",
        element: <PaymentError />,
      },
      {
        path: "/trainers/:id",
        element: (
          <PrivateRoute>
            <TrainerDetailsFromClass />
          </PrivateRoute>
        ),
      },
      {
        path: "/booking/:id/:slotId",
        element: (
          <PrivateRoute>
            <TrainerBookingPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/be-a-volunteer",
        element: (
          <PrivateRoute>
            <BeATrainer />
          </PrivateRoute>
        ),
      },
      {
        path: "/forums",
        element: <Forum />,
      },
      {
        path: "/forums/:id",
        element: <ForumDetails />,
      },
      {
        path: "/user-chat/:id",
        element: <MemberChatBox />,
      },
      {
        path: "/pet-disease-detection",
        element: <PetDiseaseDetection />,
      },
      {
        path: "/lost-pets",
        element: <LostPets />,
      },
      {
        path: "/report-lost-pet",
        element: (
          <PrivateRoute>
            <ReportLostPet />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/subscribers",
        element: (
          <AdminPrivateRoute>
            <NewsletterSubscribers />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/dashboard/sales-report",
        element: <SalesReport />,
      },
      {
        path: "/dashboard/pet-sales-report",
        element: <PetSalesReport />,
      },
      {
        path: "/dashboard/all-trainers",
        element: (
          <AdminPrivateRoute>
            <AdminAllTrainers />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/dashboard/applied-trainers",
        element: (
          <AdminPrivateRoute>
            <AppliedTrainers />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-products",
        element: <AllProducts />,
      },
      {
        path: "/dashboard/balance",
        element: <Balance />,
      },
      {
        path: "/dashboard/activity-logs",
        element: <ActivityLogs />,
      },
      {
        path: "/dashboard/profile",
        element: <UserProfile />,
      },
      {
        path: "/dashboard/add-product",
        element: <AddClass />,
      },
      {
        path: "/dashboard/lost-pet",
        element: <LostPet />,
      },
      {
        path: "/dashboard/all-pets",
        element: <AllPets />,
      },
      {
        path: "/dashboard/pet/:id",
        element: <PetDetails />,
      },
      {
        path: "/dashboard/add-pet",
        element: <AddPet />,
      },
      {
        path: "/dashboard/manage-slot",
        element: (
          <TrainerPrivateRoute>
            <ManageSlot />
          </TrainerPrivateRoute>
        ),
      },
      {
        path: "/dashboard/booked-volunteers",
        element: <BookedTrainers />,
      },
      {
        path: "/dashboard/forums",
        element: <AddForum />,
      },
      {
        path: "/dashboard/add-slot",
        element: <AddNewSlot />,
      },
      {
        path: "/dashboard/trainer-chat/:email",
        element: <TrainerChat />,
      },
      {
        path: "/dashboard/chat-with-member/:id",
        element: <ChatWithMember />,
      },
      {
        path: "/dashboard/vets",
        element: <Vet />,
      },
      {
        path: "/dashboard/faq",
        element: <FAQ />,
      },
      {
        path: "/dashboard/vet-appointments",
        element: <Appointments />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
