var Project3 = {};

// Set by server during testing
Project3.PUNK_CONTRACT_ADDRESS = "";
Project3.ALPHATOKEN_CONTRACT_ADDRESS = "";
Project3.MAIN_CONTRACT_ADDRESS = "";
Project3.punkContract = null;
Project3.alphaTokenContract = null;
Project3.mainContract = null;
Project3.NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
Project3.TX_HASHES = "_Project3_Hashes";
Project3.TX_DIV_ID = "#pendingTransactions";
Project3.EVENT_START_BLOCK = 3914490;
Project3.ETHER_CONVERSION = {USD: 1600};

Project3.currentItemIndex = -1;

Project3.gasPrice = 40 * 1000000001;

Project3.state = {
    isTestnet: false,
	web3Queried: false,
    web3ready: false,
    web3UsingInfura: false,
    web3NotPresent: false,
    accountQueried: false,
    accountUnlocked: false,
    account: null,
    accountHasBalance: false,
    accountBalanceInWei: 0,
    accountBalanceInEther: 0,
    accountBalanceInEtherTwoDecimals: 0,
    communitySaleStartTime: 1615729261,
    communitySaleEndTime: 1616247625,
    publicSaleStartTime: 1586542889,
    publicSaleEndTime: 1589134889,
    currentSystemTime: Math.floor((new Date).getTime()/1000),
    FREE_MINTS: 1,
    TOKEN_LIMIT: 0,
    totalSupply: 0,
    remainingToMint: 0,
    currentMintPrice: 0,
    transactions: [],
    isOwned: true,
    isOwner: false,
    canBuy: false,
    forSale: false,
    hasBid: false,
    ownsBid: false,
    isMarketPaused: false,
    itemData: {
	    loadComplete: false,
	    punkIndex: -1,
        owner: Project3.NULL_ADDRESS,
        offerValue: 0,
        onlySellTo: Project3.NULL_ADDRESS,
        bidder: Project3.NULL_ADDRESS,
        bidValue: 0,
    },
    events: {
	    allSorted: [],
	    transfers: [],
	    bids: [],
	    bidsWithdrawn: [],
	    bought: [],
	    offeredForSale: [],
        claimed: []
    },
    loadingDone: {
	    owner: false,
	    bid: false,
        offer: false,
        eventsClaimed: false
    },
    postCreateReload: false,
    createTransactionHash: null,
};

Project3.ABI_PUNKS = [{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"punkIndexToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"punkIndex","type":"uint256"}],"name":"transferPunk","outputs":[],"stateMutability":"nonpayable","type":"function"}];
Project3.ABI_ALPHA_TOKEN = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"BENEFICIARY","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOKEN_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintAlpha","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];
Project3.ABI_MAIN = [{"inputs":[{"internalType":"address","name":"_punks","type":"address"},{"internalType":"address","name":"_glyphs","type":"address"},{"internalType":"address payable","name":"_beneficiary","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[],"name":"CommunityGrantEnds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":true,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"createdVia","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"OfferCancelled","type":"event"},{"anonymous":false,"inputs":[],"name":"SaleBegins","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"hash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"maker","type":"address"},{"indexed":false,"internalType":"address","name":"taker","type":"address"},{"indexed":false,"internalType":"uint256","name":"makerWei","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"makerIds","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"takerWei","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"takerIds","type":"uint256[]"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"SALE_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOKEN_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"maker","type":"address"},{"internalType":"address","name":"taker","type":"address"},{"internalType":"uint256","name":"makerWei","type":"uint256"},{"internalType":"uint256[]","name":"makerIds","type":"uint256[]"},{"internalType":"uint256","name":"takerWei","type":"uint256"},{"internalType":"uint256[]","name":"takerIds","type":"uint256[]"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"acceptTrade","outputs":[],"payable":"true","type":"function"},{"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"maker","type":"address"},{"internalType":"address","name":"taker","type":"address"},{"internalType":"uint256","name":"makerWei","type":"uint256"},{"internalType":"uint256[]","name":"makerIds","type":"uint256[]"},{"internalType":"uint256","name":"takerWei","type":"uint256"},{"internalType":"uint256[]","name":"takerIds","type":"uint256[]"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"cancelOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"cancelledOffers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"communityGrant","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contentHash","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractSealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"creatorNftMints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"payable":"true","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"devMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endCommunityGrant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"maker","type":"address"},{"internalType":"address","name":"taker","type":"address"},{"internalType":"uint256","name":"makerWei","type":"uint256"},{"internalType":"uint256[]","name":"makerIds","type":"uint256[]"},{"internalType":"uint256","name":"takerWei","type":"uint256"},{"internalType":"uint256[]","name":"takerIds","type":"uint256[]"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"hashToSign","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"true","type":"function"},{"inputs":[{"internalType":"uint256","name":"_createVia","type":"uint256"}],"name":"mintWithPunkOrGlyph","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintsRemaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_paused","type":"bool"}],"name":"pauseMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"publicSale","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sealContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_saleDuration","type":"uint256"}],"name":"startSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"maker","type":"address"},{"internalType":"address","name":"taker","type":"address"},{"internalType":"uint256","name":"makerWei","type":"uint256"},{"internalType":"uint256[]","name":"makerIds","type":"uint256[]"},{"internalType":"uint256","name":"takerWei","type":"uint256"},{"internalType":"uint256[]","name":"takerIds","type":"uint256[]"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"tradeValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

Vue.component('account-link', {
    props: ['account'],
    template: '<a v-bind:href="\'/cryptopunks/accountInfo?account=\'+account">{{ account.substring(0,8) }}</a>'
});

Vue.component('glyph-transaction-link', {
    props: ['hash', 'linktext'],
    template: '<a v-bind:href="\'/autoglyphs/glyphForTransaction?hash=\'+hash">{{ linktext }}</a>'
});

Vue.component('transaction-link', {
    props: ['hash'],
    template: '<a v-bind:href="\'https://etherscan.io/tx/\'+hash">{{hash.substring(0,8)}}</a>'
});

Vue.component('value-display', {
    data: function() {
        return {
            etherConversion: Project3.ETHER_CONVERSION
        };
    },
    props: ['amount', 'short'],
    computed: {
        valueStr: function() {
            var ether = web3.fromWei(Project3.GLYPH_PURCHASE_COST, 'ether').toNumber();
            var usdVal = (ether * this.etherConversion.USD);
            var usdValStr = '$'+usdVal.toFixed(2);

            var fractionDigits = 2;
            if (this.short) fractionDigits = 0;

            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
            });
            if (formatter) {
                usdValStr = formatter.format(usdVal);
            }

            // The divide by 1 here removes trailing zeros
            if (this.short) {
                return '' + (ether.toPrecision(4) / 1) + ' (' + usdValStr + ')';
            } else {
                return '' + (ether.toPrecision(4) / 1) + ' ETH (' + usdValStr + ' USD)';
            }
        }
    },
    template: '<span>{{valueStr}}</span>'
});

/*
var autoglyphCreate = new Vue({
    el: '#create_autoglpyh',
    data: {
        state: Project3.state
    },
    computed: {
        accountShort: function() {
            if (this.state.accountUnlocked) {
                return this.state.account.substring(0,10);
            } else {
                return "none";
            }
        },
        hasPendingTransaction: function() {
            var items = Project3.state.transactions;
            // console.log("Transactions: " + items);
            for (i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.pending) {
                    return true;
                }
            }
            return false;
        },
        accountMessage: function() {
            if (this.state.web3UsingInfura) {
                return "Please download Metamask"
            } else if (this.state.accountUnlocked) {
                return this.state.account;
            } else {
                return "Allow access to Metamask below"
            }
        }
    }
});
*/


Project3.init = function(punkContractAddress, autoglyphContractAddress, mainContractAddress, ethereumUrl, testnet) {
    console.log("Project 3 init...");

    Project3.PUNK_CONTRACT_ADDRESS = punkContractAddress;
    Project3.ALPHATOKEN_CONTRACT_ADDRESS = autoglyphContractAddress;
    Project3.MAIN_CONTRACT_ADDRESS = mainContractAddress;

    if (testnet) {
        Project3.state.isTestnet = true;
    }

    var width = $(window).width();
    // Modern dapp browsers...
    if (window.ethereum) {
        web3 = new Web3(ethereum);
        window.web3 = web3;
    }
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    else if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log("- Found web3");
        // window.web3 = new Web3(web3.currentProvider);
        web3 = new Web3(web3.currentProvider);
        window.web3 = web3;
    } else {
        console.log("- Didn't find web3, using infura.");
        // web3 = null;
        // Project3.state.web3NotPresent = true;
        // console.log('No web3? You should consider trying MetaMask!')
        // console.log("Jquery width: " + width);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        if (ethereumUrl) {
            window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumUrl));
            Project3.state.web3UsingInfura = true;
        } else {
            web3 = null;
            Project3.state.web3NotPresent = true;
        }
    }
    Project3.state.web3Queried = true;

    startApp();
}

var startApp = function () {

	if (web3) {
		console.log("Found web3.");

        if (typeof web3ReadyCallback !== 'undefined') {
            web3ReadyCallback();
        }

		var PunkContract = new web3.eth.Contract(Project3.ABI_PUNKS, Project3.PUNK_CONTRACT_ADDRESS);
        console.log("Loading Cryptopunks contract with address: " + Project3.PUNK_CONTRACT_ADDRESS);
        Project3.punkContract = PunkContract;

        var AlphaTokenContract = new web3.eth.Contract(Project3.ABI_ALPHA_TOKEN, Project3.ALPHATOKEN_CONTRACT_ADDRESS);
        console.log("Loading alpha token contract with address: " + Project3.ALPHATOKEN_CONTRACT_ADDRESS);
        Project3.alphaTokenContract = AlphaTokenContract;

        var MainContract = new web3.eth.Contract(Project3.ABI_MAIN, Project3.MAIN_CONTRACT_ADDRESS);
        console.log("Loading main contract with address: " + Project3.MAIN_CONTRACT_ADDRESS);
        Project3.mainContract = MainContract;

        Project3.state.web3ready = true;

        if (typeof cryptopunksContractLoadedCallback !== 'undefined' && Project3.state.web3UsingInfura) {
            cryptopunksContractLoadedCallback();
        }

        Project3.clearTransactions();

        function handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== Project3.state.account) {
                console.log("Metamask account changed: " + accounts[0]);
                var checkSumAddress = web3.utils.toChecksumAddress(accounts[0]);
                console.log("Checksummed: " + checkSumAddress);
                Project3.state.account = checkSumAddress;
                web3.eth.defaultAccount = checkSumAddress;

                Project3.punkContract.defaultAccount = Project3.state.account;
                Project3.alphaTokenContract.defaultAccount = Project3.state.account;
                Project3.mainContract.defaultAccount = Project3.state.account;

                console.log("Checking mints")
                Project3.mainContract.methods.TOKEN_LIMIT().call(function (error, result) {
                    console.log("Token limit: " + result)
                    Project3.state.TOKEN_LIMIT = result;
                });
                Project3.mainContract.methods.getPrice().call(function (error, result) {
                    console.log("Current mint price: " + result)
                    Project3.state.currentMintPrice = result;
                });
                Project3.updateTotalSupply();
                Project3.updateRemainingToMint();
                Project3.updateBalance();

                if (Project3.state.account === undefined) {
                    console.log("  Default account is locked.");
                    Project3.state.accountUnlocked = false;
                } else {
                    console.log("  Default account is unlocked.");
                    Project3.state.accountUnlocked = true;
                }

                if (typeof accountChangedCallback !== 'undefined') {
                    accountChangedCallback();
                }
            }
            Project3.state.accountQueried = true;
        }

        if (window.ethereum) {
            ethereum.on('accountsChanged', handleAccountsChanged);

            // Make an initial single attempt to get the current unlocked account
            web3.eth.getAccounts(function(err, accounts) {
                if (!err && accounts) {
                    handleAccountsChanged(accounts);
                }
            });
        }

        Project3.updateBlockTime();
        var minuteUpdateFrequency = setInterval(function() {
            Project3.updateBlockTime();
        }, 60000);

        Project3.restoreTransactions();
        setInterval(Project3.checkTransactions, 1000);

        $.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', function(data) {
            Project3.ETHER_CONVERSION.USD = data.USD;
            console.log("Value of ether now " + Project3.ETHER_CONVERSION.USD);
        })

        if (!Project3.state.isTestnet) {
            $.get('https://ethgasstation.info/json/ethgasAPI.json', function (data) {
                if (data.fast) {
                    var gasPriceGwei = data.fast / 10
                    console.log("Fast gas price in gwei: " + gasPriceGwei)
                    Project3.gasPrice = web3.utils.toWei('' + gasPriceGwei, "gwei");
                    console.log("Gas price now " + Project3.gasPrice);
                }
            })
        } else {
            Project3.gasPrice = web3.utils.toWei('2', "gwei");
        }
	}
};

Project3.updateBlockTime = function() {
    web3.eth.getBlock(web3.eth.defaultBlock, function(error, result) {
        if (!error) {
            console.log("Current block time: " + result.timestamp);
            Project3.state.currentBlockTime = result.timestamp;
            Project3.state.currentSystemTime = Math.floor((new Date).getTime()/1000);
        } else {
            console.log("Error getting current block number: " + error);
        }
    });
}

Project3.shouldShowUnlockAccountMessageFunc = function () {
    if (!this.state.accountQueried) return false;
    return !this.state.accountUnlocked && !this.state.web3NotPresent;
};

Project3.timeUntilStartFunc = function () {
    if (this.state.fundingStartTime < 0) return "(loading...)";
    var secondsUntilStart = this.state.communitySaleStartTime - Project3.state.currentSystemTime;
    console.log("Start time: " + this.state.communitySaleStartTime);
    console.log("Total seconds until start: " + secondsUntilStart);
    return humanizeDuration(secondsUntilStart * 1000, {largest: 2});
};

Project3.timeUntilEndFunc = function () {
    if (this.state.communitySaleStartTime < 0) return "(loading...)";
    var secondsUntilEnd = this.state.communitySaleEndTime - Project3.state.currentSystemTime;
    console.log("Funding end time: " + this.state.communitySaleEndTime);
    console.log("Total seconds until end: " + secondsUntilEnd);
    return humanizeDuration(secondsUntilEnd * 1000, {largest: 2});
};

Project3.humanizeExpiry = function(expirySeconds) {
    let expiryMillis = expirySeconds * 1000;
    if (Date.now() > expiryMillis) {
        return "Expired";
    } else {
        return humanizeDuration(expiryMillis);
    }
}

Project3.mintWithPunkOrGlyph = function(createViaItemId, successCallback, errorCallback) {
    Project3.mainContract.methods.mintWithPunkOrGlyph(createViaItemId).send({from: Project3.state.account, gas: 400000, gasPrice: Project3.gasPrice}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
            if (successCallback) {
                successCallback(result);
            }
            Project3.state.createTransactionHash = result;
            Project3.trackTransaction("Create", result);
            window.location = "/meebits/watchTransactionForMint?transactionHash="+result;
        } else {
            console.log(error);
            console.log("Failure.");
            if (errorCallback) {
                errorCallback(error);
            }
        }
    });
    return true;
};

Project3.mintItem = function(price, successCallback, errorCallback) {
    Project3.mainContract.methods.mint().send({from: Project3.state.account, gas: 400000, gasPrice: Project3.gasPrice, value: price}, function(error, result) {
        if(!error) {
            console.log(result);
            console.log("Success!");
            if (successCallback) {
                successCallback(result);
            }
            Project3.state.createTransactionHash = result;
            Project3.trackTransaction("Create", result);
            window.location = "/meebits/watchTransactionForMint?transactionHash="+result;
        } else {
            console.log(error);
            console.log("Failure.");
            if (errorCallback) {
                errorCallback(error);
            }
        }
    });
    return true;
};

Project3.updateTotalSupply = function() {
    Project3.mainContract.methods.totalSupply().call(function(error, result) {
        console.log("Total supply: " + result)
        Project3.state.totalSupply = result;
    });
}

Project3.updateRemainingToMint = function() {
    Project3.mainContract.methods.mintsRemaining().call(function(error, result) {
        console.log("Remaining to mint: " + result)
        Project3.state.remainingToMint = result;
    });
}

Project3.updateCurrentMintPrice = function() {
    Project3.mainContract.methods.getPrice().call(function (error, result) {
        console.log("Current mint price: " + result)
        Project3.state.currentMintPrice = result;
    });
}

Project3.updateBalance = function() {
    Project3.mainContract.methods.ethBalance(Project3.state.account).call(function(error, result) {
        if (error) {
            console.log("Error getting unlocked account balance.");
        } else {
            console.log("Current unlocked account balance: " + result);
            if (result) {
                Project3.state.accountBalanceInWei = result;
                Project3.state.accountBalanceInEther = web3.utils.fromWei(result, 'ether');
                Project3.state.accountBalanceInEtherTwoDecimals = parseFloat(parseFloat(Project3.state.accountBalanceInEther).toFixed(2));  // Outer parseFloat to remove trailing zeros
            }
        }
    });
}

Project3.makeDeposit = function(amount, sendingCallback, successCallback, errorCallback) {
    Project3.mainContract.methods.deposit().send({from: Project3.state.account, gas: 400000, gasPrice: Project3.gasPrice, value: amount})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .on('receipt', function(receipt) {
            console.log(receipt);
            console.log("Deposit successful.");
            Project3.updateBalance();
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log("Deposit failed.");
            if (errorCallback) errorCallback(error);
    });
}

Project3.withdraw = function(amount, sendingCallback, successCallback, errorCallback) {
    Project3.mainContract.methods.withdraw(amount).send({from: Project3.state.account, gas: 400000, gasPrice: Project3.gasPrice})
        .on('sending', function() {
            if (sendingCallback) sendingCallback();
        })
        .on('receipt', function(receipt) {
            console.log(receipt);
            console.log("Deposit successful.");
            Project3.updateBalance();
            if (successCallback) successCallback(receipt);
        })
        .on('error', function(error, receipt) {
            console.log(error);
            console.log("Deposit failed.");
            if (errorCallback) errorCallback(error);
    });
}

Project3.acceptDeal = function(deal) {
    let n = deal.makerIds.length + deal.takerIds.length;
    let gas = 70000 * n + 175000;
    Project3.mainContract.methods.acceptTrade(web3.utils.toChecksumAddress(deal.maker), web3.utils.toChecksumAddress(deal.taker), deal.makerWei, deal.makerIds, deal.takerWei, deal.takerIds, deal.expiry, deal.salt, deal.signature).send({from: Project3.state.account, gas: gas, gasPrice: Project3.gasPrice, value: deal.takerWei})
    .on('receipt', function(receipt) {
        console.log(receipt);
        console.log("Trade accepted!.");
        Project3.updateBalance();
    }).on('error', function(error, receipt) {
        console.log(error);
        console.log("Trade failed to accept.");
    });
}

Project3.test = function() {
    Project3.punkContract.punkIndexToAddress(3, function(error, result){
        if(!error) {
            console.log("Owner of punk index 3: '" + result + "'");
            Project3.state.punkData.owner = result;
            if (address == result) {
                console.log(" - Is owner!");
                Project3.state.isOwner = true;
            } else {
                Project3.state.isOwner = false;
                console.log(" - Is not owner.");
            }

            Project3.state.loadingDone.owner = true;
        } else {
            console.log(error);
        }
    });

/*
    Cryptopunks.punkContract.totalSupply(function(error, result){
        if(!error)
            console.log("Total supply: " + result);
        else
            console.log(error);
    });
*/
	return true;
};

Project3.requestMetamaskAccess = async () => {
    try {
        // Request account access if needed
        console.log("Requesting metamask access...");
        await ethereum.enable();
        // Acccounts now exposed
        // web3.eth.sendTransaction({/* ... */});
    } catch (error) {
        // User denied account access...
    }
}

Project3.parseTransactionErrorMessage = function(message) {
    try {
        if (message) {
            var jsonStr = message.substring(message.indexOf('{'), message.length - 1);
            var jsonObj = JSON.parse(jsonStr);
            var errorMessage = jsonObj.value.data.message.replace("VM Exception while processing transaction: revert ", "");
            return "Error processing transaction: " + errorMessage;
        }
    } catch (e) {
        console.log("Error parsing transaction error: " + e);
        return "Error processing transaction.";
    }
}

Project3.parseDealValidityErrorMessage = function(message) {
    try {
        if (message) {
            var jsonStr = message.substring(message.indexOf('{'), message.length);
            var jsonObj = JSON.parse(jsonStr);
            var errorMessage = jsonObj.originalError.message.replace("execution reverted: ", "");
            return errorMessage;
        }
    } catch (e) {
        console.log("Error parsing transaction error: " + e);
        return "Error processing transaction.";
    }
}

var allEventsContainsEvent = function(item) {
    for (var i = 0; i < Project3.state.events.allSorted.length; i++) {
        var obj = Project3.state.events.allSorted[i];
        if (obj.transactionHash === item.transactionHash) {
            return true;
        }
        if (item.blockNumber > obj.blockNumber) {
            // No need to lok any further
            return false;
        }
    }
    return false;
};

Project3.addToAllEvents = function(event) {
    if (!allEventsContainsEvent(event)) {
        Project3.state.events.allSorted.push(event);
        Project3.state.events.allSorted.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        })
    }
};

Project3.clearTransactions = function() {
	localStorage.setItem(Project3.TX_HASHES, JSON.stringify([]));
	Project3.state.transactions = [];
	// $(Cryptopunks.TX_DIV_ID).html('');
};

Project3.restoreTransactions = function() {
	var storedData = localStorage.getItem(Project3.TX_HASHES);
	var items = [];
	if (storedData) {
		items = JSON.parse(storedData);
	}
    console.log("Restored transactions from local storage, length: "+items.length);
	Project3.state.transactions = items;

	// Clear content
/*
	for (i = 0; i < items.length; i++) {
		var item = items[i];
		Cryptopunks.showTransaction(item);
	}
*/
};

Project3.showTransaction = function(transaction) {
	var div = $(Project3.TX_DIV_ID);
	if (transaction.failed) {
		div.append('<p id="' + transaction.hash + '">' + transaction.name + ' <i>failed</i>.</p>');
	} else {
		div.append('<p id="' + transaction.hash + '"><a href="https://etherscan.io/tx/' + transaction.hash + '">' + transaction.name + '</a> <i>pending</i>.</p>');
	}

};

Project3.trackTransaction = function(name, hash) {
	var storedData = localStorage.getItem(Project3.TX_HASHES);
	var hashes = [];
	if (storedData) {
		hashes = JSON.parse(storedData);
	}
	var transaction = {
		'name' : name,
		'hash' : hash,
		'pending' : true
	};
	hashes.push(transaction);
	localStorage.setItem(Project3.TX_HASHES, JSON.stringify(hashes));
	Project3.state.transactions = hashes;
	// Cryptopunks.showTransaction(transaction);
};

Project3.showFailure = function(name) {
	var transaction = {
		'name' : name,
		'hash' : '0x0',
		'pending' : false,
		'failed' : true
	};
    Project3.state.transactions.push(transaction);
	// Cryptopunks.showTransaction(transaction);
};

Project3.checkTransactions = function() {
	// console.log("Checking transactions...");
	var storedData = localStorage.getItem(Project3.TX_HASHES);
	var items = [];
	if (storedData) {
		items = JSON.parse(storedData);
	}
	Project3.state.transactions = items;
	// Clear content
	for (i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.pending) {
			web3.eth.getTransaction(item.hash, function (error, result) {
				if (!error) {
					if (result) {
						// console.log(result);
						if (result.blockNumber) {
							// Completed.
							// $('#' + item.hash + ' i').text("completed");
							item.pending = false;
                            console.log("Reloading glyphs...");
                            Project3.triggerServerGlyphReload()

							localStorage.setItem(Project3.TX_HASHES, JSON.stringify(items));
						}
					}
				} else {
					console.log(error);
					console.log("Failure.");
				}
			});
		} else {
			// items.splice(i, 1);
			// i--;
		}
	}
	localStorage.setItem(Project3.TX_HASHES, JSON.stringify(items));
};

Project3.triggerServerGlyphReload = function() {
	console.log("About to reload.");
	$.ajax({

		url : "/autoglyphs/loadNewGlyphs",
		type : 'GET',
		data : {
		},
		dataType:'text',
		success : function(data) {
			console.log("Reloaded glyphs.");

			Project3.state.postCreateReload = true;
		},
		error : function(request,error)
		{
			console.log("Reload error.");
		}
	});
}

Project3.signOffer = function(hash, callback) {
    web3.eth.personal.sign(hash, web3.eth.defaultAccount, function (err, result) {
        if (err) {
            return console.error(err);
        }
        const signature = result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        callback(signature);
    });
}

Project3.signOfferOLD = function(contract) {
    // Define domain type
    const domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
    ];
    // Define offer type
    const offer = [
        { name: "id", type: "uint256"},
        { name: "maker", type: "address"},
        { name: "taker", type: "address"},
        { name: "makerWei", type: "uint256"},
        { name: "makerIds", type: "uint256[]"},
        { name: "takerWei", type: "uint256"},
        { name: "takerIds", type: "uint256[]"},
        { name: "expiry", type: "uint256"}
    ];
    // Set the domain data
    const domainData = {
        name: "Snoutz",
        version: "3",
        chainId: "1",
        verifyingContract: contract,
        salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
    };
    // Set the message
    var message = {
        id: "10",
        maker: "0xEf8E20248D0d1936b5ACEd6AdD5ba8cc793AFeC5",
        taker: "0x0",
        makerWei: "0",
        makerIds: ["20"],
        takerWei: "500000000000000000",
        takerIds: ["30"],
        expiry: "1616436408"
    }
    const data = JSON.stringify({
        types: {
            EIP712Domain: domain,
            Offer: offer
        },
        domain: domainData,
        primaryType: "Offer",
        message: message
    });
    const signer = Project3.state.account;
    web3.currentProvider.sendAsync(
        {
            method: "eth_signTypedData_v3",
            params: [signer, data],
            from: signer
        },
        function(err, result) {
            if (err) {
                return console.error(err);
            }
            const signature = result.result.substring(2);
            const r = "0x" + signature.substring(0, 64);
            const s = "0x" + signature.substring(64, 128);
            const v = parseInt(signature.substring(128, 130), 16);
            // The signature is now comprised of r, s, and v.
        }
    );
}

Project3.signMessage = function(msg, from, callback, errorCallback) {
    signMsgPersonal(msg, from, callback, errorCallback);
    // signMsg(msgParams, Cryptopunks.PunkState.account);
}

function signMsgPersonal(msg, from, callback, errorCallback) {
    web3.currentProvider.sendAsync({
        method: 'personal_sign',
        params: [msg, from],
        from: from,
    }, function (err, result) {
        if (err) {
            console.error(err)
            if (errorCallback) {
                errorCallback(err);
            }
            return;
        }
        if (result.error) {
            console.error(result.error.message)
            if (errorCallback) {
                errorCallback(result.error);
            }
            return;
        }
        console.log("Signed message: "+result.result);
        if (callback) {
            callback(result.result);
        }
    })
}
