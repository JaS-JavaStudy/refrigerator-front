// UseIngredientModal.jsx
import React, { useState } from 'react';
import style from '../../../assets/css/ingredient/ingredient/SearchIngredientList.module.css';

function UseIngredientModal({ ingredient, onClose, onConfirm }) {
  const [useAmount, setUseAmount] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (useAmount <= 0) {
      alert('수량은 1개 이상이어야 합니다.');
      return;
    }

    if (useAmount > ingredient.ingredientAmount) {
      alert('보유 수량보다 많은 양을 사용할 수 없습니다.');
      return;
    }

    onConfirm(useAmount);
  };

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= ingredient.ingredientAmount) {
      setUseAmount(value);
    }
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          <h3>{ingredient.ingredientName} 사용</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={style.modalContent}>
            <div className={style.inputGroup}>
              <label>사용할 수량</label>
              <input
                type="text"
                value={useAmount}
                onChange={handleAmountChange}
                min="1"
                max={ingredient.ingredientAmount}
                required
              />
              <span className={style.helperText}>
                현재 보유 수량: {ingredient.ingredientAmount}
                {useAmount === ingredient.ingredientAmount && (
                  <span className={style.warningText}>
                    * 전체 수량을 사용하면 재료가 삭제됩니다
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className={style.modalFooter}>
            <button
              type="submit"
              className={style.confirmButton}
              disabled={useAmount <= 0 || useAmount > ingredient.ingredientAmount}
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

export default UseIngredientModal;