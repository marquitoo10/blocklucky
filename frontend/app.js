const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  {
    "inputs":[
      {"internalType":"uint256","name":"_ticketPrice","type":"uint256"},
      {"internalType":"uint256","name":"_maxPlayers","type":"uint256"}
    ],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  {"inputs":[],"name":"buyTicket","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"getPlayers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

let provider, signer, contract;

async function connectWallet() {
  if (!window.ethereum) {
    alert("⚠️ MetaMask non détecté !");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("✅ Connecté :", address);

    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    alert("✅ MetaMask connecté !");
    await refresh();
  } catch (err) {
    console.error("Erreur MetaMask :", err);
    alert("❌ Connexion échouée : " + err.message);
  }
}

async function refresh() {
  if (!contract) return;
  try {
    const price = await contract.ticketPrice();
    document.getElementById("price").textContent = ethers.utils.formatEther(price);

    const players = await contract.getPlayers();
    document.getElementById("players").textContent = players.length;
  } catch (err) {
    console.error("Erreur refresh :", err);
    alert("❌ Impossible de récupérer le ticket price. Vérifie le contrat et le réseau MetaMask !");
  }
}

async function buyTicket() {
  if (!contract) return alert("Connecte ton wallet d'abord !");
  try {
    const price = await contract.ticketPrice();
    const tx = await contract.buyTicket({ value: price });
    await tx.wait();
    alert("🎟️ Ticket acheté !");
    await refresh();
  } catch (err) {
    console.error("Erreur achat :", err);
    alert("❌ Achat échoué : " + (err.reason || err.message));
  }
}

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("buyBtn").onclick = buyTicket;
