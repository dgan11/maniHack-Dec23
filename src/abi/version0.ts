export const extensionABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ArtistProofNotInitialized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedToTransfer',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInstance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidStorageProtocol',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'AdminApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'AdminRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creatorContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'artistProofr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint96',
        name: 'count',
        type: 'uint96',
      },
    ],
    name: 'ArtistProof',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creatorContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'editionAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'initializer',
        type: 'address',
      },
    ],
    name: 'ArtistProofInitialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creatorContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'artistProofr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint96',
        name: 'count',
        type: 'uint96',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'ArtistProofProxy',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creatorContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
    ],
    name: 'ArtistProofUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MEMBERSHIP_ADDRESS',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINT_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SUPERLIKE_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
    ],
    name: 'approveAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    name: 'approveTransfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'locationChunk',
        type: 'string',
      },
    ],
    name: 'extendTokenURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAdmins',
    outputs: [
      {
        internalType: 'address[]',
        name: 'admins',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
    ],
    name: 'getArtistProof',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'proofTokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'editionTokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'editionAddress',
            type: 'address',
          },
          {
            internalType: 'enum IArtistProofExtension.StorageProtocol',
            name: 'storageProtocol',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'location',
            type: 'string',
          },
          {
            internalType: 'address payable',
            name: 'paymentReceiver',
            type: 'address',
          },
          {
            internalType: 'uint96',
            name: 'editionCount',
            type: 'uint96',
          },
        ],
        internalType: 'struct IArtistProofExtension.ArtistProofInstance',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'editionAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'enum IArtistProofExtension.StorageProtocol',
            name: 'storageProtocol',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'location',
            type: 'string',
          },
          {
            internalType: 'address payable',
            name: 'paymentReceiver',
            type: 'address',
          },
        ],
        internalType: 'struct IArtistProofExtension.ArtistProofParameters',
        name: 'parameters',
        type: 'tuple',
      },
    ],
    name: 'initializeArtistProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
    ],
    name: 'isAdmin',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        internalType: 'uint96',
        name: 'count',
        type: 'uint96',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        internalType: 'uint96',
        name: 'count',
        type: 'uint96',
      },
      {
        internalType: 'address',
        name: 'mintFor',
        type: 'address',
      },
    ],
    name: 'mintProxy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
    ],
    name: 'revokeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'membershipAddress',
        type: 'address',
      },
    ],
    name: 'setMembershipAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creatorContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'instanceId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'enum IArtistProofExtension.StorageProtocol',
            name: 'storageProtocol',
            type: 'uint8',
          },
          {
            internalType: 'string',
            name: 'location',
            type: 'string',
          },
          {
            internalType: 'address payable',
            name: 'paymentReceiver',
            type: 'address',
          },
        ],
        internalType: 'struct IArtistProofExtension.ArtistProofParameters',
        name: 'parameters',
        type: 'tuple',
      },
    ],
    name: 'updateArtistProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'receiver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
