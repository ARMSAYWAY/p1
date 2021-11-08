import {
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
  Redirect
} from "react-router-dom"
import Home from "./pages/Home";
import routes from "./routes/routes"

const RenderRoute = (routes) => {

  const user_firstname = localStorage.getItem("user_firstname")
  const user_lastname = localStorage.getItem("user_lastname")
  const user_role_name = localStorage.getItem("user_role_name")

  const history = useHistory();

  if (routes.login && user_role_name == "super_admin") {
    history.push("/templeAdmin/manageTemple");
  } else if (routes.login && user_role_name == "temple_admin") {
    history.push("/superAdmin/manageTemple");
  } else if (routes.login && user_role_name == "user") {
    history.push("/home");
  }

  if (routes.register && user_role_name == "super_admin") {
    history.push("/templeAdmin/manageTemple");
  } else if (routes.register && user_role_name == "temple_admin") {
    history.push("/superAdmin/manageTemple");
  } else if (routes.register && user_role_name == "user") {
    history.push("/home");
  }

  if (routes.onlyUser && user_role_name == "super_admin") {
    history.push("/superAdmin/manageTemple");
  } else if (routes.onlyUser && user_role_name == "temple_admin") {
    history.push("/templeAdmin/manageTemple");
  }

  if (routes.onlyTempleAdmin && user_role_name == "user") {
    history.push("/home");
  } else if (routes.onlyTempleAdmin && user_role_name == "super_admin") {
    history.push("/superAdmin/manageTemple");
  }

  if (routes.onlySuperAdmin && user_role_name == "user") {
    history.push("/home");
  } else if (routes.onlySuperAdmin && user_role_name == "temple_admin") {
    history.push("/templeAdmin/manageTemple");
  }

  if (routes.onlySuperAdmin || routes.onlyTempleAdmin) {
    if (!user_role_name) {
      history.push("/home");
    }
  }

  return <Route path={routes.path} component={routes.component}></Route>;
};

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Redirect exact from="/" to="/home" />
          {routes.length
            ? routes.map((routes, index) => (
              <RenderRoute {...routes} key={index} />
            ))
            : null}
          <Route path="*" component={() => (
            <div style={{ marginTop: 50, textAlign: "center" }}>
              ไม่พบหน้าที่คุณค้นหา
            </div>
          )}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
