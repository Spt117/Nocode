import { useReducer, useCallback, useEffect, useState } from "react";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import { ethers } from "ethers";
import NoCodeERC20 from "../artifacts/contracts/NoCodeERC20.sol/NoCodeERC20.json";
import myContracts from "../contrats/address.json";

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isConnect, setIsConnect] = useState(false);
    const [isContract, setIsContract] = useState(false);

    const init = useCallback(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider._networkPromise;
        const networkID = network.chainId;
        const contract = myContracts.networks[networkID].address;
        let account, signer, createERC20;
        switch (isConnect) {
            case true:
                signer = provider.getSigner();
                account = await signer.getAddress();
                if (contract !== null) {
                    createERC20 = new ethers.Contract(
                        contract,
                        NoCodeERC20.abi,
                        signer
                    );
                    setIsContract(true);
                } else {
                    console.log("Vous n'êtes pas sur le bon réseau !");
                    createERC20 = null;
                    setIsContract(false);
                }
                break;
            default:
                account = null;
                signer = null;
                createERC20 = null;
        }
        dispatch({
            type: actions.init,
            data: {
                provider,
                signer,
                account,
                networkID,
                createERC20,
            },
        });
        // eslint-disable-next-line
    }, [isConnect]);

    useEffect(() => {
        if (window.ethereum) {
            isConnected();
            event();
        }
        // eslint-disable-next-line
    }, [init, isConnect]);

    //vérifier la connexion metamask
    async function isConnected() {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        if (accounts.length) {
            setIsConnect(true);
        } else setIsConnect(false);
        init();
    }

    //détecter les changements de compte et de réseau
    function event() {
        const events = ["chainChanged", "accountsChanged"];
        const handleChange = () => isConnected();

        events.forEach((e) => window.ethereum.on(e, handleChange));
        return () =>
            events.forEach((e) =>
                window.ethereum.removeListener(e, handleChange)
            );
    }

    return (
        <div>
            <EthContext.Provider
                value={{
                    state,
                    dispatch,
                }}
            >
                {children}
            </EthContext.Provider>
            {!isContract && isConnect && (
                <p>Vous n'êtes pas sur le bon réseau !</p>
            )}
        </div>
    );
}
export default EthProvider;
