import { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { ethers } from "ethers";
import { ABI, address } from "../../trait/ABI";
import { TourProvider, useTour } from "@reactour/tour";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
const Blockchain = () => {
  const accentColor = "#5cb7b7";
  const { user } = useSelector((state) => state.user);

  const [provider, setProvider] = useState(null);
  const [singer, setSinger] = useState(null);
  const [contract, setContract] = useState(null);
  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState(null);
  const [balance, setBalance] = useState("");
  const [inputEther, setInputEther] = useState(0);
  const [stateEnter, setStateEnter] = useState("");
  const [statePickWInner, setStatePickWInner] = useState("");
  const [openTourS, setOpenTour] = useState(false);
  const [isShowingMore, setisShowingMore] = useState(false);
  const [lotteries, serLotteries] = useState(null);
  const [stateModalMetamask, setStateModalMetamask] = useState(false);
  const [stateModalMetamaskPick, setStateModalMetamaskPick] = useState(false);


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

  const enterETH = async (eth,id_lottery) => {
    setStateModalMetamask(true);
    console.log("🚀 ~ file: Blockchain.jsx:78 ~ enterETH ~ eth:", eth);
    try {
      const accounts = await provider.send("eth_requestAccounts", []);

      setStateEnter("Hệ thống đang xủ lý giao dịch...")
      const formData = new FormData();
      formData.append("lottery_id",id_lottery );
      formData.append("address_metamask", accounts[0]);
      const resp = await axios({
        method: "post",
        url: "/lotery/add_user_lottery",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        data: formData,
      });
      if(resp.status == 200 || resp.status == 201){
        setStateEnter("Metamask đang xủ lý giao dịch...");
        const res = await contract.enter({
          from: accounts[0],
          value: ethers.utils.parseEther(eth),
        });
        const txReceipt = await res.wait();
        console.log(
          "🚀 ~ file: Blockchain.jsx:87 ~ enterETH ~ txReceipt:",
          txReceipt
        );
  
        if (txReceipt.status === 1) {
          console.log("Transaction succeeded!");
          console.log("Transaction hash:", txReceipt.transactionHash);
          //
          const formData2 = new FormData();
          formData2.append("status",1 );
          const resp_update = await axios({
            method: "post",
            url: "/lotery/update_status_lottery/"+resp.data.lotteries_id,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user?.token,
            },
            data: formData2,
          });
          refresh();
          setStateEnter("Giao dịch thành công!");
  
  
        } else {
          refresh();

          setStateEnter("Giao dịch thất bại! ");

          //
        }
      }else{
        refresh();

        setStateEnter("Giao dịch thất bại! Vé này đã được mua vui lòng chọn vé khác.");

      }
    
    } catch (err) {
      refresh();

      setStateEnter("Giao dịch thất bại! Vé này đã được mua vui lòng chọn vé khác.");

      console.log("🚀 ~ file: Blockchain.jsx:69 ~ enterETH ~ err:", err);
    }
  };
  const pickWinner = async (e) => {
    setStateModalMetamaskPick(true)
    setStatePickWInner("Waiting on pick winner success... ");

    const accounts = await provider.send("eth_requestAccounts", []);
    const res = await contract.pickWinner({
      from: accounts[0],
    });

    const txReceipt = await res.wait();
    if (txReceipt.status === 1) {
      const resp_update = await axios({
        method: "delete",
        url: "/lotery/clear_user_lottery",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
      });
      refresh();

      setStatePickWInner("Pick winner success");
    }else{
      refresh();

      setStatePickWInner("Pick winner error");

    }
    
  };

  const refresh = () => {
    getPlayers();
    getManager();
    getBalancePrizeMoney();
    getListLottery();
  };
  useEffect(() => {
    initializeProvider();
  }, []);

  const closeTour = () => {
    setIsOpen(false);
  };

  const openTour = () => {
    try {
      setIsOpen(true);
    } catch (e) {
      console.log("🚀 ~ file: Blockchain.jsx:115 ~ openTour ~ e:", e);
    }
  };

  const getListLottery = async () => {
    try {
      const res = await axios.get("/lotery/list_client");
      serLotteries(res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getListLottery();
  }, []);
  return (
    <Layout>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={stateModalMetamask}
        onHide={() => setStateModalMetamask(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crypto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-3">
            {stateEnter}
            {stateEnter == "Giao dịch thành công!" ?
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          
            :
            
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
            }
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={stateModalMetamaskPick}
        onHide={() => setStateModalMetamaskPick(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crypto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-3">
            {statePickWInner}
            {statePickWInner == "Pick winner success" ?
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          
            :
            
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
            }
          </div>
        </Modal.Body>
      </Modal>
      <div className="m-auto bg-slate-800  flex justify-start items-start gap-3 flex-col p-5">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-2 text-white">
            <h2 className="text-yellow-400">Lottery</h2>
            <p className="flex m-0 gap-2">
              <span>Manager: </span>
              <span className="text-green-500 font-semibold">{manager}</span>
            </p>
            <p className="flex m-0 gap-2">
              <span>Player Number: </span>
              <span className="text-cyan-500 font-semibold">
                {players?.length}
              </span>
            </p>
            <p className="flex m-0 gap-2">
              <span>Prize Money ETH: </span>
              <span className="font-semibold text-yellow-500">
                {balance ?? ""}
              </span>
            </p>
          </div>
          <div className="flex gap-3 justify-start flex-col  items-end ">
            <button
              data-tut="reactour__position"
              className="px-3 hover:scale-110 transition-all py-2 rounded-xl bg-orange-500 text-white"
              onClick={initializeProvider}
            >
              Connect Metamask
            </button>
            <button
              data-tut="reactour__position"
              className="px-3 hover:scale-110 transition-all py-2 rounded-xl bg-slate-500 text-white"
              onClick={pickWinner}
            >
              Pick Winner
            </button>
            <button
              className="px-3 hover:scale-110 transition-all py-2 rounded-xl bg-green-500 text-white"
              onClick={refresh}
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {lotteries?.data?.lotteries?.length > 0 &&
            lotteries?.data.lotteries.map((lottery) => {
              const check = lotteries.data.lottery_user.some(e => e.lotteries_id == lottery?.id);
              if(check) {
                return (
                  <div
                    key={lottery?.id}
                    className="flex  flex-col p-2  border border-yellow-500 gap-2 rounded-sm"
                  >
                    <div className="relative">
                      <span className="absolute top-0 right-0 p-2 rounded-full bg-white text-black font-medium">
                        {lottery?.number}
                      </span>
                      <img
                        src={lottery.background_image}
                        className="object-cover w-full rounded-lg h-[200px]"
                        alt=""
                      />
                      <p className="absolute rounded-full w-fit bg-white block p-1 m-0 top-3/4 left-1/2 -translate-x-1/2">
                        <img
                          src={lottery.image}
                          className=" w-[100px] h-[100px] rounded-full object-cover "
                          alt=""
                        />
                      </p>
                    </div>
                    <span className="mt-[60px] text-white font-semibold block text-center">
                      {lottery?.name}
                    </span>
                    <div className="flex justify-center">
                      <span className="block w-1/2 p-2 text-yellow-500 border rounded-sm font-semibold  text-center">
                        {lottery?.price} ETH
                      </span>
                    </div>
  
                    <div className="flex justify-center">
                      <span
                        className="block w-full hover:scale-105 cursor-pointer transition-all bg-slate-300 p-2 text-black border rounded-sm font-semibold  text-center"
                      >
                        Out of stock
                      </span>
                    </div>
                  </div>
                );
              }else{
                return (
                  <div
                    key={lottery?.id}
                    className="flex  flex-col p-2  border border-yellow-500 gap-2 rounded-sm"
                  >
                    <div className="relative">
                      <span className="absolute top-0 right-0 p-2 rounded-full bg-white text-black font-medium">
                        {lottery?.number}
                      </span>
                      <img
                        src={lottery.background_image}
                        className="object-cover w-full rounded-lg h-[200px]"
                        alt=""
                      />
                      <p className="absolute rounded-full w-fit bg-white block p-1 m-0 top-3/4 left-1/2 -translate-x-1/2">
                        <img
                          src={lottery.image}
                          className=" w-[100px] h-[100px] rounded-full object-cover "
                          alt=""
                        />
                      </p>
                    </div>
                    <span className="mt-[60px] text-white font-semibold block text-center">
                      {lottery?.name}
                    </span>
                    <div className="flex justify-center">
                      <span className="block w-1/2 p-2 text-yellow-500 border rounded-sm font-semibold  text-center">
                        {lottery?.price} ETH
                      </span>
                    </div>
  
                    <div className="flex justify-center">
                      <span
                        onClick={() => enterETH(lottery?.price,lottery?.id)}
                        className="block w-full hover:scale-105 cursor-pointer transition-all bg-yellow-500 p-2 text-black border rounded-sm font-semibold  text-center"
                      >
                        Buy now
                      </span>
                    </div>
                  </div>
                );
              }
             
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Blockchain;
