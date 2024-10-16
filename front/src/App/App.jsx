import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { grommet, Grommet } from 'grommet';

import { AuthProvider } from '#helpers/useAuth';

import EditOpenSpace from './EditOpenSpace';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import RecoveryEmail from './RecoveryEmail';
import MainLayout from './MainLayout';
import MyTalks from './MyTalks';
import OpenSpace from './OpenSpace';
import OSProjector from './OSProjector';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import Schedule from './OpenSpace/schedule/Schedule';

import { EditTalk, NewTalk } from './TalkForm';
import NewOpenSpace from './EditOpenSpace/NewOpenSpace';
import Talk from './Talk';
import ResetPassword from './ResetPassword';

const Routes = () => (
  <Switch>
    <Route path="/os/:id/projector" exact component={OSProjector} />
    <Route path="/os/:id/myTalks" exact component={MyTalks} />
    <Route path="/newTalk/:id" exact component={NewTalk} />
    <Route path="/os/:id/editTalk/:talkId" exact component={EditTalk} />
    <Route path="/new" exact component={NewOpenSpace} />
    <Route path="/os/:id/edit" exact component={EditOpenSpace} />
    <Route path="/os/:id/schedule" exact component={Schedule} />
    <Route path="/os/:id" exact component={OpenSpace} />
    <Route path="/os/:id/talk/:talkId" exact component={Talk} />
    <Route path={'/login'} exact component={Login} />
    <Route path={'/register'} exact component={Register} />
    <Route path="/recovery-email" exact component={RecoveryEmail} />
    <Route path="/reset-password" exact component={ResetPassword} />
    <Route path="/" exact component={Home} />
    {/* <Route component={Page404} /> */}
  </Switch>
);

const App = () => (
  <Grommet full theme={grommet}>
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <MainLayout header={<Route path="/" component={Header} />}>
            <Routes />
          </MainLayout>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  </Grommet>
);

export default App;
