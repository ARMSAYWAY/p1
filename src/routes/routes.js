//front
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

//all
import EventAll from "../pages/EventAll";
import ReviewAll from "../pages/ReviewAll";

//detail
import TempleDetail from "../components/detail/TempleDetail";
import EventDetail from "../components/detail/EventDetail";
import ReviewDetail from "../components/detail/ReviewDetail";

//list
import TempleEvent from "../components/list/TempleEvent";
import TempleReview from "../components/list/TempleReview";

//temple_admin
import AdminManageTemple from "../components/TempleAdmin/ManageTemple";
import AdminManageEvent from "../components/TempleAdmin/ManageEvent";
import AdminManageLocation from "../components/TempleAdmin/ManageLocation";

//super_admin
import SuperManageTemple from "../components/SuperAdmin/ManageTemple";
import SuperManageTempleType from "../components/SuperAdmin/ManageTempleType";
import SuperManageEvent from "../components/SuperAdmin/ManageEvent";
import SuperManageUser from "../components/SuperAdmin/ManageUser";
import SuperManageReview from "../components/SuperAdmin/ManageReview";
import SuperManageComment from "../components/SuperAdmin/ManageComment";

const routes = [
  //front
  {
    path: "/home",
    component: Home,
    title: "หน้าหลัก",
    onlyUser: true,
  },
  {
    path: "/login",
    component: Login,
    title: "ล็อกอิน",
    login: true,
  },
  {
    path: "/register",
    component: Register,
    title: "สมัครสมาชิก",
    register: true,
  },
  {
    path: "/event",
    component: EventAll,
    title: "กิจกรรมทั้งหมด",
  },
  {
    path: "/review",
    component: ReviewAll,
    title: "รีวิวทั้งหมด",
  },
  {
    path: "/templeDetail",
    component: TempleDetail,
    title: "รายละเอียดวัด",
  },
  {
    path: "/eventDetail",
    component: EventDetail,
    title: "รายละเอียดกิจกรรม",
  },
  {
    path: "/reviewDetail",
    component: ReviewDetail,
    title: "รายละเอียดรีวิว",
  },
  {
    path: "/templeEvent",
    component: TempleEvent,
    title: "กิจกรรมของวัด",
  },
  {
    path: "/templeReview",
    component: TempleReview,
    title: "รีวิวของวัด",
  },

  //temple_admin
  {
    path: "/templeAdmin/manageTemple",
    component: AdminManageTemple,
    title: "จัดการข้อมูลวัด",
    onlyTempleAdmin: true,
  },
  {
    path: "/templeAdmin/manageEvent",
    component: AdminManageEvent,
    title: "จัดการกิจกรรม",
    onlyTempleAdmin: true,
  },

  {
    path: "/templeAdmin/manageLocation",
    component: AdminManageLocation,
    title: "จัดการโลเคชัน",
    onlyTempleAdmin: true,
  },

  //super_admin
  {
    path: "/superAdmin/manageTemple",
    component: SuperManageTemple,
    title: "จัดการข้อมูลวัด",
    onlySuperAdmin: true,
  },
  {
    path: "/superAdmin/manageTempleType",
    component: SuperManageTempleType,
    title: "จัดการประเภทวัด",
    onlySuperAdmin: true,
  },
  {
    path: "/superAdmin/manageEvent",
    component: SuperManageEvent,
    title: "จัดการกิจกรรม",
    onlySuperAdmin: true,
  },
  {
    path: "/superAdmin/manageUser",
    component: SuperManageUser,
    title: "จัดการผู้ใช้",
    onlySuperAdmin: true,
  },
  {
    path: "/superAdmin/manageReview",
    component: SuperManageReview,
    title: "จัดการรีวิว",
    onlySuperAdmin: true,
  },
  {
    path: "/superAdmin/manageComment",
    component: SuperManageComment,
    title: "จัดการคอมเมนต์",
    onlySuperAdmin: true,
  },

];
export default routes;
