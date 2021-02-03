import useRoutes from './pages/routes'
import { BrowserRouter as Router } from 'react-router-dom'

import 'materialize-css'
function App() {

  const routes = useRoutes(true)
  return (
    <Router>
      <div className="container">
        {routes}
      </div>
    </Router>
  )
}

export default App;