import logo from "./assets/logo.svg";

function NavBar() {
  return ( 
    <img src={logo} alt="TRGlobal Store" height={40}/>
  );
}

function App() {
  return (
    <>
      <NavBar />
    </>
  );
}

export default App;
