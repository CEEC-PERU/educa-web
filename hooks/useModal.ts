import { useState } from 'react';

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    showModal,
    hideModal,
  };
};

export default useModal;
