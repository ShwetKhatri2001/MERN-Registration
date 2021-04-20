import React,{createContext, useReducer} from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from './Components/Login';
import Logout from "./Components/Logout"
import Activate from './Components/Activate';
import UserProfile from './Components/UserProfile';
import EditProfile from './Components/EditProfile';
import Contact from "./Components/Contact";
import ForgotPass from './Components/ForgotPass';
import ResetPass from './Components/ResetPass';
import Error from './Components/Error';
import reducer from "./Reducer/reducer";
import 'react-toastify/dist/ReactToastify.css';


const UserContext = createContext();

const App = () => {

 const [state,dispatch] = useReducer(reducer,false);
 

  return (
    <div className="App">
     <UserContext.Provider value={{state,dispatch}}>
      <Navbar/>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/signin' component={Login}/>
        <Route exact path='/password/forgot' component={ForgotPass} />
        <Route exact path='/password/reset/:token' component={ResetPass} />
        <Route exact path='/activate/:token' component={Activate} />
        <Route exact path='/userprofile' component={UserProfile} />
        <Route exact path='/editprofile' component={EditProfile} />
        <Route exact path='/contact' component={Contact} />
        <Route exact path="/signout" component={Logout}/>
        <Route component={Error}/>
      </Switch>
    </UserContext.Provider>
    </div>
  )
}

export default App;
export {UserContext} ;
