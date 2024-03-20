import {Component} from '@angular/core';
import {ethers} from "ethers";

const contractERC20ABI = require('./contract/ERC20.abi.json');
const contractNftFactoryABI = require('./contract/NFTFactory.abi.json');
const contractNftABI = require('./contract/NFT.abi.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  window: any = window;

  POLYGON_MUMBAI_NETWORK = {
    chainId: '0x13881',
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'Mumbai',
      symbol: 'Matic',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-mumbai-bor.publicnode.com'],
    blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
  };

  NFT_FACTORY_CONTRACT = '0x96baa39B6C4bf1f4E8bf0DCef0053aAF88952E71';

  SEPOLIA_NETWORK = {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia',
      symbol: 'SEPOLIA',
      decimals: 18,
    },
    rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  };

  LINK_ADDRESS = '0x779877A7B0D9E8603169DdbD7836e478b4624789';
  RANDOM_ADDRESS = '0x87028e52304A3d58D6d48DC5a864815Ab70fB6F5';

  constructor() {
  }

}
