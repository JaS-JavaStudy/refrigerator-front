// components/ingredient/modal/AddIngredientModal.jsx
import React, { useState } from 'react';
import style from '@/assets/css/ingredient/SearchIngredientList.module.css';

function AddIngredientModal({ ingredient, onClose, onConfirm }) {
  const [amount, setAmount] = useState(1);
  const [expirationDate, setExpirationDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // 0이나 음수인 경우 제출 방지
    if (amount <= 0) {
      alert('수량은 1개 이상이어야 합니다.');
      return;
    }

    onConfirm({
      ingredientManagementPk: ingredient.ingredientManagementPk,
      ingredientAmount: amount,
      expirationDate: expirationDate,
      registrationDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {  // 음수 입력 방지
      setAmount(value);
    }
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          <h3>{ingredient.ingredientName} 추가</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={style.modalContent}>
            <div className={style.inputGroup}>
              <label>수량</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="1"
                required
              />
            </div>
            <div className={style.inputGroup}>
              <label>유통기한</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          <div className={style.modalFooter}>
            <button
              type="submit"
              className={style.confirmButton}
              disabled={amount <= 0}  // 0이하일 때 버튼 비활성화
            >
              확인
            </button>
            <button
              type="button"
              onClick={onClose}
              className={style.cancelButton}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddIngredientModal;