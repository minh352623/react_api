import axios from "axios";
import React from "react";
import { useEffect ,useState} from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layouts/Layout";
import BestSaler from "../../modules/home/BestSaler";
import Category from "../../modules/home/Category";
import Discount from "../../modules/home/Discount";
import Option from "../../modules/home/Option";
import Partner from "../../modules/home/Partner";
import ProductNew from "../../modules/home/ProductNew";
import Service from "../../modules/home/Service";
import Slider from "../../modules/home/Slider";
import Slogan from "../../modules/home/Slogan";
import TopCategory from "../../modules/home/TopCategory";
import { ethers } from 'ethers';
const HomeClient = () => {
  const [provider, setProvider] = useState(null);

useEffect(() => {
  const initializeProvider = async () => {
    if (window.ethereum) {
      // Modern dapp browsers
      try {
        await window.ethereum.enable();
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(providerInstance);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      // Non-dapp browsers or old versions of MetaMask
      console.error('No web3 provider detected');
    }
  };

  initializeProvider();
}, []);
  const makePayment = async () => {
    if (!provider) {
      console.error('Provider is not initialized');
      return;
    }
  
    try {
      const signer = provider.getSigner();
      const accounts = await provider.listAccounts();
      const sender = accounts[0];
  
      const recipient = '0x496F4E4cA3Cee6d32CF02E1e433Eb1109010C9B0'; // Ethereum address to receive the payment
      const amount = ethers.utils.parseEther('0.1'); // Amount to send in Ether
  
      const transaction = {
        to: recipient,
        value: amount,
      };
  
      const txResponse = await signer.sendTransaction(transaction);
      console.log('Transaction response:', txResponse);
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  return (
    <Layout>
      <button onClick={makePayment}>Make Payment</button>
      <div className="main px-5 mt-3 bg-[#f4f4f4]">
        <Slider></Slider>

        <Partner></Partner>
        <Category></Category>
        <TopCategory></TopCategory>
        <Slogan></Slogan>
        <ProductNew></ProductNew>
        <Discount></Discount>
        <BestSaler></BestSaler>
        <Option></Option>
        <Service></Service>
      </div>
    </Layout>
  );
};

export default HomeClient;
