// UsersIngredientItem.jsx
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from '../../../assets/css/Ingredient/userIngredient/UsersIngredientItem.module.css';
import React, { useState } from 'react';
import { updateIngredientBookmark, deleteIngredient } from '../../../sources/api/IngredientAPI';
import UseIngredientModal from '../modal/UseIngredientModal';

function UsersIngredientItem({ userIngredient }) {
    const [isBookmarked, setIsBookmarked] = useState(userIngredient.bookmarked || false);
    const [showModal, setShowModal] = useState(false);

    const toggleBookmark = () => {
        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState);
        updateIngredientBookmark(1, isBookmarked, userIngredient);
        userIngredient.bookmarked = !userIngredient.bookmarked;
    };

    // UsersIngredientItem.jsx의 handleUse 함수 수정
    const handleUse = async (amount) => {
        try {
            console.log('사용 요청:', {
                pk: userIngredient.ingredientMyRefrigeratorPk,
                amount: amount,
                현재수량: userIngredient.ingredientAmount
            });
            await deleteIngredient(userIngredient.ingredientMyRefrigeratorPk, amount);
            setShowModal(false);
            window.dispatchEvent(new Event('ingredientAdded'));
        } catch (error) {
            console.error('재료 사용 중 에러:', error.response?.data || error.message);
            alert(`재료 사용에 실패했습니다. ${error.response?.data || ''}`);
        }
    };

    return (
        <>
            <Card className={style.card}>
                <div className={style.imageWrapper}>
                    <img
                        src={userIngredient.image || `../src/assets/image/ingredient/${userIngredient.ingredientName}.jpg`}
                        alt={userIngredient.ingredientName}
                        className={style.image}
                    />
                    <div className={style.favoriteAndQuantity}>
                        <button
                            className={`${style.favoriteButton} ${isBookmarked ? style.active : ''}`}
                            onClick={toggleBookmark}
                        >
                            {isBookmarked ? '⭐' : '☆'}
                        </button>
                        <div className={style.quantity}>
                            수량: {userIngredient.ingredientAmount || 0}
                        </div>
                    </div>
                </div>
                <Card.Body className={style.body}>
                    <Card.Title className={style.title}>
                        {userIngredient.ingredientName || '재료명'}
                    </Card.Title>
                    <div className={style.details}>
                        <div><strong>유통기한:</strong> {userIngredient.expirationDate || '알 수 없음'}</div>
                        <div><strong>남은 일수:</strong> {userIngredient.remainExpirationDate || 0}일</div>
                        <div><strong>보관 방법:</strong> {userIngredient.ingredientStorage || '보관 방법 미정'}</div>
                    </div>
                    <Button
                        variant="success"
                        className={style.useButton}
                        onClick={() => setShowModal(true)}
                    >
                        사용하기
                    </Button>
                </Card.Body>
            </Card>

            {showModal && (
                <UseIngredientModal
                    ingredient={userIngredient}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleUse}
                />
            )}
        </>
    );
}

export default UsersIngredientItem;