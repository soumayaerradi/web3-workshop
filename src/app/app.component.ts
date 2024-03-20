import {Component} from '@angular/core';
import {ethers} from "ethers";
import {AppService} from "./app.service";

const contractABI = require('./contract/ERC20.abi.json');
const contractNftFactoryABI = require('./contract/NFTFactory.abi.json');
const contractNftABI = require('./contract/NFT.abi.json');

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: string;
  balance: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  window: any = window;

  // wallet info
  isWalletConnected: boolean = false;
  account: string | undefined;
  network: string | undefined;
  chainId: string | undefined;

  // token info
  tokenInfo: TokenInfo | undefined;
  allowanceAmount: string = '0';
  approveAmount: string = '0';
  transferAddress: string = '';
  transferAmount: string = '';


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
  nftList: any[] = [];

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

  constructor(private _appService: AppService) {
  }

  async connectWallet() {
    const addresses = await this.window.ethereum.request({method: 'eth_requestAccounts'});
    this.account = addresses[0];
    this.isWalletConnected = true;
  }

  checkNetwork() {
    const network = this.window.ethereum.networkVersion;
    this.network = network;
    console.log('Network:', network);

    const chainId = this.window.ethereum.chainId;
    this.chainId = chainId;

    if (chainId === this.POLYGON_MUMBAI_NETWORK.chainId) {
      console.log('Connected to Polygon Mumbai network');
    } else if (chainId === this.SEPOLIA_NETWORK.chainId) {
      console.log('Connected to Sepolia network');
    } else {
      console.log('Connected to unknown network: ', network);
    }
  }

  async changeNetwork(chainId: string) {
    await this.window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: chainId}],
    });

    this.checkNetwork();
  }

  async readTokenInfo() {
    const provider = new ethers.BrowserProvider(this.window.ethereum);
    console.log(provider);
    const signer = await provider.getSigner();
    console.log(signer)

    const contract = new ethers.Contract(this.LINK_ADDRESS, contractABI, signer);

    const name: string = await contract['name']();
    const symbol: string = await contract['symbol']();
    const decimals = await contract['decimals']();

    console.log('Token name:', name);
    console.log('Token symbol:', symbol);
    console.log('Token decimals:', ethers.formatUnits(decimals, 0));

    const balance = await contract['balanceOf'](this.account);
    console.log('Token balance:', ethers.formatUnits(balance, decimals));

    this.tokenInfo = {
      name: name,
      symbol: symbol,
      decimals: ethers.formatUnits(decimals, 0),
      balance: ethers.formatUnits(balance, decimals),
    }
  }

  async readAllowance() {
    const provider = new ethers.BrowserProvider(this.window.ethereum);
    console.log(provider);
    const signer = await provider.getSigner();
    console.log(signer)

    const contract = new ethers.Contract(this.LINK_ADDRESS, contractABI, signer);

    const allowance = await contract['allowance'](this.account, this.NFT_FACTORY_CONTRACT);
    console.log('Allowance:', ethers.formatUnits(allowance, 18));
    this.allowanceAmount = ethers.formatUnits(allowance, 18);
  }

  async approveTokens() {
    const provider = new ethers.BrowserProvider(this.window.ethereum);
    console.log(provider);
    const signer = await provider.getSigner();
    console.log(signer)

    console.log(this.approveAmount)

    const contract = new ethers.Contract(this.LINK_ADDRESS, contractABI, signer);
    const tx = await contract['approve'](this.NFT_FACTORY_CONTRACT, ethers.parseUnits(this.approveAmount, 18));
    console.log('Approve tx:', tx);
    const receipt = await tx.wait();
    console.log('Receipt:', receipt);
    this.readAllowance();
  }

  async transferTokens() {
    const provider = new ethers.BrowserProvider(this.window.ethereum);
    console.log(provider);
    const signer = await provider.getSigner();
    console.log(signer)

    const contract = new ethers.Contract(this.LINK_ADDRESS, contractABI, signer);
    const tx = await contract['transfer'](this.transferAddress, ethers.parseUnits(this.transferAmount, 18));
    console.log('Transfer tx:', tx);
  }

  async readNFTInfo() {
    const provider = new ethers.BrowserProvider(this.window.ethereum);
    console.log(provider);
    const signer = await provider.getSigner();
    console.log(signer)

    const contract = new ethers.Contract(this.NFT_FACTORY_CONTRACT, contractNftFactoryABI, signer);
    console.log(contract);

    const nftCounter = await contract['nftCounter']();
    console.log('NFT counter:', nftCounter.toString());

    for (let i = 3; i < nftCounter; i++) {
      const nftAddress = await contract['get'](i);
      console.log('NFT address:', nftAddress);
      const nftContract = new ethers.Contract(nftAddress, contractNftABI, signer);

      const baseURI = await nftContract['baseURI']();
      console.log('NFT base URI:', baseURI);

      this._appService.getMetadata(baseURI).subscribe({
        next: (metadata: any) => {
          console.log(metadata)

          this.nftList.push({
            name: metadata.name,
            description: metadata.description,
            imageUrl: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          });
        }
      });
    }
  }
}
