import Nav from './components/Nav';
import Routers from './routers/Routers';
import Footer from './components/Footer';


function App() {
  return (
    <>

      <Nav />
      <div className="container-fluid" style={{minHeight:100+'vh'}}>
        <Routers />
      </div>
      <Footer/>

    </>
  );
}

export default App;
