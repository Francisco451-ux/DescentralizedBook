'use client'
import { MetaMaskInpageProvider } from "@metamask/providers";
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Hash } from 'lucide-react'
import { ethers } from 'ethers'
import { BrowserProvider } from "ethers"

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

export default function Web3Page() {
  const [showFullText, setShowFullText] = useState(false);
  const [isFullBookVisible, setIsFullBookVisible] = useState(false);
  const [bookLines, setBookLines] = useState<{ line: number; address: string; content: string }[]>([]);
  const [isConnected, setIsConnected] = useState(false)
  const [contractMessage, setContractMessage] = useState('')
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const contractABI = [
    {
      "type": "function",
      "name": "addLine",
      "inputs": [
        {
          "name": "_text",
          "type": "string",
          "internalType": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "book",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "author",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "text",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllLine",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct DecentralizedBook.Line[]",
          "components": [
            {
              "name": "author",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "text",
              "type": "string",
              "internalType": "string"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getLine",
      "inputs": [
        {
          "name": "_index",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "author",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "text",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTotalLines",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasContributed",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "NewLine",
      "inputs": [
        {
          "name": "author",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "text",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    }
  ]
  const contractAddress = "0x65B2C3F86A24395a36655323bA48EC638A784845";
  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new BrowserProvider(window.ethereum);

        // Ensure MetaMask is connected to the correct network (Hemi Network)
        const network = await web3Provider.getNetwork();

        // Convert chainId to a number for comparison (or vice versa)
        const chainId = Number(network.chainId); // Convert to number

        if (chainId !== 743111) { // Replace 743111 with the correct chainId for Hemi network
          alert("Please switch to the Hemi network in MetaMask.");
          return;
        }

        await web3Provider.send("eth_requestAccounts", []);
        const userSigner = await web3Provider.getSigner();
        const userAccount = await userSigner.getAddress();

        setProvider(web3Provider);
        setSigner(userSigner);
        setAccount(userAccount);
        setIsConnected(true);

        console.log("Connected account:", userAccount);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask not found! Please install the extension.");
    }
  };

  const handleSendToContract = async () => {
    if (!provider || !signer) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!contractMessage) {
      alert("Please enter a message to send to the contract.");
      return;
    }

    try {
      // Inicializar o contrato
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Chamar a função 'addLine' no contrato
      const tx = await contract.addLine(contractMessage);

      // Aguardar a confirmação da transação
      await tx.wait();

      console.log("Message sent to contract:", contractMessage);
      alert("Message sent successfully!");
      setContractMessage('');

      //Update book lines
      await fetchBookLines();

    } catch (error) {
      console.error("Error sending message to contract:", error);
      alert("Error sending message to contract.");
    }
  };

  // Função para buscar as linhas do livro
  const fetchBookLines = async () => {
    if (!provider || !signer) {
      alert("Por favor, conecte sua carteira antes.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
      const totalLines = await contract.getTotalLines();

      const lines = [];
      for (let i = 0; i < totalLines; i++) {
        const [author, text] = await contract.getLine(i);
        lines.push({ line: i + 1, address: author, content: text });
      }

      setBookLines(lines);
      alert("Linhas do livro carregadas com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar as linhas do livro:", error);
      alert("Falha ao buscar as linhas do livro.");
    }
  };

  // useEffect para buscar as linhas do livro quando o usuário está conectado
  useEffect(() => {
    if (isConnected) {
      fetchBookLines();
    }
  }, [isConnected]);


  //const bookLines = [
  //  { line: 1, address: '0x1234...5678', content: 'It was the best of times, it was the worst of times...' },
  //  { line: 2, address: '0xabcd...ef01', content: 'In a hole in the ground there lived a hobbit...' },
  //  { line: 3, address: '0x2468...1357', content: 'To be, or not to be: that is the question...' },
  //]

  const fullText = bookLines.map(line => line.content).join(' ')

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow">
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Book className="h-8 w-8 text-blue-600" color="black" />
                <span className="ml-2 text-xl font-bold">DecentralizedBook</span>
              </div>
              <div className="flex items-center">
                <Button onClick={handleConnect} variant={isConnected ? "outline" : "default"}>
                  {isConnected ? 'Connected' : 'Connect Wallet'}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Explanation Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/codex_gigas.png"
                alt="DecentralizedBook Concept"
                className="rounded-lg shadow-lg"
                width={300}
                height={300}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">Revolutionizing Publishing with Blockchain</h2>
              <p className="text-gray-600 mb-6">
                DecentralizedBook is a collaborative digital book where anyone can add a line and contribute to the story. Each line is permanently stored on the blockchain, creating an immutable and transparent record forever. Join this publishing revolution, where every user can leave their mark and see their creativity preserved for future generations.
              </p>

            </div>
          </div>
        </section>

        {/* Smart Contract Interaction */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Contribute a Line and Make Your Mark on the Blockchain!</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Input
                placeholder="Enter your message for the contract"
                value={contractMessage}
                onChange={(e) => setContractMessage(e.target.value)}
                className="max-w-md"
              />
              <Button onClick={handleSendToContract}>Send to Contract</Button>
            </div>
          </div>
        </section>

        {/* Every Line of Book Deployed */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Every Line of Book Deployed</h2>
          {bookLines.length === 0 ? (
            <p className="text-center text-gray-600">No lines found. Please check the smart contract.</p>
          ) : (
            <div className="space-y-4">
              {bookLines.map((bookLine) => (
                <Card key={bookLine.line}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="mr-2" />
                      Line {bookLine.line}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2"><Hash className="inline mr-1" /> {bookLine.address}</p>
                    <p>{bookLine.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Combined Text Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Full Book Text</h2>
            {fullText ? (
              <>
                <div className="flex justify-center mb-6">
                  <Button onClick={() => setShowFullText(!showFullText)}>
                    {showFullText ? "Hide Full Book" : "Show Full Book"}
                  </Button>
                </div>
                {showFullText && (
                  <Card>
                    <CardContent className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{fullText}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600">The book content is empty. Please check the smart contract.</p>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">DecentralizedBook</h3>
              <p className="mt-2">Revolutionizing publishing with blockchain technology</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Terms of Service</a>
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400">Contact Us</a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 DecentralizedBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}