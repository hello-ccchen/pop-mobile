import {useEffect, useState} from 'react';
import {
  MerchantPumpPromotionRequest,
  MerchantPumpPromotion,
  getMerchantPumpPromotions,
} from '@services/promotionService';
import {logger} from '@services/logger/loggerService';

const useMerchantPumpPromotions = (payload?: MerchantPumpPromotionRequest) => {
  const [promotions, setPromotions] = useState<MerchantPumpPromotion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!payload?.masterMerchantGuid || !payload?.pumpTypeGuid) {
        setPromotions(null); // reset promotions when payload invalid
        return;
      }

      setIsLoading(true);
      setIsError(false);

      try {
        const data = await getMerchantPumpPromotions(payload);
        setPromotions(data);
      } catch (err) {
        logger.error(
          `Failed in useMerchantPumpPromotions with payload ${JSON.stringify(payload)}`,
          err,
        );
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [payload]);

  return {promotions, isLoading, isError};
};

export default useMerchantPumpPromotions;
