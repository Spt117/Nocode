import { useState } from "react";
import { useEffect } from "react";
import useEth from "../context/useEth.js";

export default function Dapp() {
    const {
        state: { createERC20 },
    } = useEth();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (createERC20) getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createERC20]);

    async function getData() {
        const myData = await createERC20.data();
        setData(myData.toNumber());
    }

    async function setMyData() {
        const transaction = await createERC20.setData(15);
        await transaction.wait();
    }

    return (
        <div>
            <h5>Data : {data}</h5>
            <button onClick={setMyData}>GO</button>
        </div>
    );
}
