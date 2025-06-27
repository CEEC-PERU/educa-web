// hooks/useUserInfo.ts
import { useState } from 'react';
import { createUserInfo } from '../../services/users/userInfoService';
import { UserInfoData } from '../../interfaces/User/UserInfo';

export const useUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitUserInfo = async (userInfo: UserInfoData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createUserInfo(userInfo);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      throw err;
    }
  };

  return { submitUserInfo, loading, error };
};
