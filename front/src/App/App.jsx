import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import { deepMerge } from 'grommet/utils';
import customTheme from './theme';
import DesignSystem from './DesignSystem/DesignStystem';
import Manual from './Manual/Manual.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/os/:id/projector" element={<OSProjector />} />
    <Route path="/os/:id/myTalks" element={<MyTalks />} />
    <Route path="/newTalk/:id" element={<NewTalk />} />
    <Route path="/os/:id/editTalk/:talkId" element={<EditTalk />} />
    <Route path="/new" element={<NewOpenSpace />} />
    <Route path="/os/:id/edit" element={<EditOpenSpace />} />
    <Route path="/os/:id/schedule" element={<Schedule />} />
    <Route path="/os/:id" element={<OpenSpace />} />
    <Route path="/os/:id/talk/:talkId" element={<Talk />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/recovery-email" element={<RecoveryEmail />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/" element={<Home />} />
    <Route path="/design-system" element={<DesignSystem />} />
    <Route path="/manual" element={<Manual />} />
    {/* <Route path="*" element={<Page404 />} /> */}
  </Routes>
);

const theme = deepMerge(grommet, customTheme);

const App = () => (
  <Grommet full theme={theme}>
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <MainLayout header={<Header />}>
            <AppRoutes />
          </MainLayout>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  </Grommet>
);

export default App;
