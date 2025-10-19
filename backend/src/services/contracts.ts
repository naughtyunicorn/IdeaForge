// Contract ABIs - these would typically be imported from compiled contracts
export const contracts = {
  ForgeToken: {
    abi: [
      {
        "inputs": [],
        "name": "name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "getVotes",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  IPNFT: {
    abi: [
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getIPData",
        "outputs": [
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "creationTime", "type": "uint256"},
          {"internalType": "uint256", "name": "aiScore", "type": "uint256"},
          {"internalType": "string", "name": "category", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "bool", "name": "isLicensed", "type": "bool"},
          {"internalType": "uint256", "name": "licensePrice", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "address", "name": "creator", "type": "address"}],
        "name": "getCreatorTokens",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "price", "type": "uint256"}],
        "name": "licenseIP",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ]
  },
  IdeaForgeCore: {
    abi: [
      {
        "inputs": [
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "string", "name": "category", "type": "string"},
          {"internalType": "string", "name": "contentHash", "type": "string"},
          {"internalType": "string", "name": "metadataHash", "type": "string"}
        ],
        "name": "submitIdea",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "uint256", "name": "ideaId", "type": "uint256"},
          {"internalType": "uint256", "name": "aiCredibilityScore", "type": "uint256"},
          {"internalType": "string", "name": "validationNotes", "type": "string"}
        ],
        "name": "approveIdea",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "uint256", "name": "ideaId", "type": "uint256"},
          {"internalType": "string", "name": "tokenURI", "type": "string"},
          {"internalType": "uint96", "name": "royaltyFee", "type": "uint96"}
        ],
        "name": "mintIPNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "ideaId", "type": "uint256"}],
        "name": "getIdeaSubmission",
        "outputs": [
          {
            "internalType": "struct IdeaForgeCore.IdeaSubmission",
            "name": "",
            "type": "tuple",
            "components": [
              {"internalType": "uint256", "name": "ideaId", "type": "uint256"},
              {"internalType": "address", "name": "submitter", "type": "address"},
              {"internalType": "string", "name": "title", "type": "string"},
              {"internalType": "string", "name": "description", "type": "string"},
              {"internalType": "string", "name": "category", "type": "string"},
              {"internalType": "string", "name": "contentHash", "type": "string"},
              {"internalType": "string", "name": "metadataHash", "type": "string"},
              {"internalType": "uint256", "name": "submissionTime", "type": "uint256"},
              {"internalType": "uint256", "name": "aiCredibilityScore", "type": "uint256"},
              {"internalType": "bool", "name": "isApproved", "type": "bool"},
              {"internalType": "bool", "name": "isMinted", "type": "bool"},
              {"internalType": "address", "name": "validator", "type": "address"},
              {"internalType": "string", "name": "validationNotes", "type": "string"},
              {"internalType": "uint256", "name": "mintedTokenId", "type": "uint256"}
            ]
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getUserSubmissions",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  IdeaForgeDAO: {
    abi: [
      {
        "inputs": [
          {"internalType": "address[]", "name": "targets", "type": "address[]"},
          {"internalType": "uint256[]", "name": "values", "type": "uint256[]"},
          {"internalType": "bytes[]", "name": "calldatas", "type": "bytes[]"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "enum IdeaForgeDAO.ProposalType", "name": "proposalType", "type": "uint8"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "externalLink", "type": "string"}
        ],
        "name": "proposeWithMetadata",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}, {"internalType": "uint8", "name": "support", "type": "uint8"}],
        "name": "castVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
        "name": "state",
        "outputs": [{"internalType": "enum IGovernor.ProposalState", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  RevenueSplitter: {
    abi: [
      {
        "inputs": [{"internalType": "address", "name": "creator", "type": "address"}],
        "name": "getCreatorEarnings",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "claimCreatorEarnings",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  }
}
