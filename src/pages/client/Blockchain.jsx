import  { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { ethers } from "ethers";
import { ABI, address } from "../../trait/ABI";
import { TourProvider, useTour } from '@reactour/tour'

const Blockchain = () => {
  const accentColor = "#5cb7b7";

  const [provider, setProvider] = useState(null);
  const [singer, setSinger] = useState(null);
  const [contract, setContract] = useState(null);
  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState(null);
  const [balance, setBalance] = useState("");
  const [inputEther, setInputEther] = useState(0);
  const [stateEnter, setStateEnter] = useState("");
  const [statePickWInner, setStatePickWInner] = useState("");
  const [openTourS,setOpenTour] = useState(false);
  const [isShowingMore,setisShowingMore] = useState(false);
  const { setIsOpen } = useTour();

  const initializeProvider = async () => {
    if (window.ethereum) {
      // Modern dapp browsers
      try {
        await window.ethereum.enable();
        const providerInstance = new ethers.providers.Web3Provider(
          window.ethereum
        );
        // const accounts = await providerInstance.send('eth_requestAccounts', []);
        // console.log("🚀 ~ file: Blockchain.jsx:23 ~ initializeProvider ~ accounts:", accounts)
        const singer = providerInstance.getSigner();
        const contract = new ethers.Contract(
          address,
          JSON.parse(JSON.stringify(ABI)),
          singer
        );
        console.log(
          "🚀 ~ file: Blockchain.jsx:27 ~ initializeProvider ~ contract:",
          contract
        );
        setProvider(providerInstance);
        setSinger(singer);
        setContract(contract);
      } catch (error) {
        console.log(
          "🚀 ~ file: Blockchain.jsx:16 ~ initializeProvider ~ error:",
          error
        );
      }
    } else {
      // Non-dapp browsers or old versions of MetaMask
      console.error("No web3 provider detected");
    }
  };
  const getPlayers = async () => {
    const players = await contract.getPlayers();
    console.log(players);
    setPlayers(players);
  };

  const getManager = async () => {
    const manager = await contract.manager();
    setManager(manager);
  };

  const getBalancePrizeMoney = async () => {
    const balanceWei = await provider.getBalance(contract.address);
    const balanceEther = ethers.utils.formatEther(balanceWei);
    setBalance(balanceEther);
  };

  const enterETH = async (e) => {
    e.preventDefault();
    try{
      setStateEnter("Waiting on transition success... ");  
      const accounts = await provider.send("eth_requestAccounts", []);
      const res= await contract.enter({
        from: accounts[0],
        value:ethers.utils.parseEther(inputEther)
      })
      console.log("🚀 ~ file: Blockchain.jsx:78 ~ enterETH ~ res:", res)
      setStateEnter("You have been entered");  

    }catch(err){
      console.log("🚀 ~ file: Blockchain.jsx:69 ~ enterETH ~ err:", err)
      
    }
 
  };
  const pickWinner = async (e) => {
    setStatePickWInner("Waiting on pick winner success... ");  

    const accounts = await provider.send("eth_requestAccounts", []);
    const res = await contract.pickWinner({
      from: accounts[0],
    })
    console.log("🚀 ~ file: Blockchain.jsx:94 ~ pickWinner ~ res:", res)
    setStatePickWInner("Pick winner success");  

  }
  useEffect(() => {
    initializeProvider();
  }, []);
  
  const closeTour = () => {
    setIsOpen(false);
  };

  const openTour = () => {
    setIsOpen(true);

  };

  
  return (
    <Layout>
      <div className="m-auto flex justify-start items-start gap-3 flex-col p-5">
        <div className="flex gap-3 justify-start  items-start ">
          <button
          data-tut="reactour__position"
            className="px-3 py-2 rounded-xl bg-orange-500 text-white"
            onClick={initializeProvider}
          >
            Connect Metamask
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-green-500 text-white"
            onClick={getManager}
          >
            Get Manager
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-slate-500 text-white"
            onClick={getPlayers}
          >
            Get Number Players
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-slate-500 text-white"
            onClick={getBalancePrizeMoney}
          >
            Get Balance
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-slate-500 text-white"
            onClick={openTour}
          >
            Help
          </button>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p>Address manager: {manager}</p>

          <p>Players Number: {players?.length}</p>

          {players?.length > 0 && players.map((item) => <p>{item}</p>)}

          <p>Prize Money {balance ?? ""} ETH</p>
        </div>
        <div className="block w-full">
          <hr />
        </div>
        <div className="flex flex-col gap-3">
          <h3 data-tut="reactour__iso">Want to try your luck?</h3>
          <form onSubmit={enterETH} action="">
            <div className="flex flex-col gap-3">
              <label htmlFor="">Amount of ETH to enter</label>
              <input
                className="outline"
                type="text"
                onChange={(e) => setInputEther(e.target.value)}
              />
              <button
              data-tut="reactour__style"
                className="px-3 py-2 rounded-xl bg-blue-500 text-white"
                // onClick={enterETH}
              >
                Enter
              </button>
            </div>
          </form>
          <h1>{stateEnter}</h1>
          <button
            data-tut="reactour__goTo"
            className="px-3 py-2 rounded-xl bg-orange-500 text-white"
            onClick={pickWinner}
          >
            PickWiner
          </button>
          <h1>{statePickWInner}</h1>
        </div>
      </div>
    </Layout>

  );
};





export default Blockchain;
