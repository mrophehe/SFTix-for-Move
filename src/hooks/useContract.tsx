import { useEffect, useState } from 'react';
import { useWallet } from './useWallet';
import { contractService } from '../services/contract';
import { toast } from 'react-hot-toast';

export function useContract() {
  const { signer } = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (signer) {
      contractService.initialize(signer)
        .then(() => setIsInitialized(true))
        .catch(error => {
          console.error('Failed to initialize contract:', error);
          toast.error('Failed to connect to smart contract');
        });
    } else {
      setIsInitialized(false);
    }
  }, [signer]);

  return {
    isInitialized,
    contractService
  };
}