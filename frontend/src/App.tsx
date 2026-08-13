import { useEffect } from "react";
import { api } from "./api/client"

function App() {
  useEffect(() => {
  api.get('/catalogue/list-products')
    .then(console.log)
    .catch(console.error);
  }, []);
}

export default App;
