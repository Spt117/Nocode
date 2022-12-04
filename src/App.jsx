import "./App.css";
import EthProvider from "./context/EthProvider.jsx";
import Dapp from "./components/Dapp.jsx";

function App() {
    return (
        <div className="App">
            <EthProvider>
                <Dapp />
            </EthProvider>
        </div>
    );
}

export default App;
