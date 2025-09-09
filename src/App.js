import { BrowserRouter } from "react-router-dom";
import Router from './Router/index';
// import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
// import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;