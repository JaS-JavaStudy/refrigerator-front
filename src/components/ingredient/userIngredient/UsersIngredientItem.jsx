import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from '../../../assets/css/Ingredient/userIngredient/UsersIngredientItem.module.css';
import React, { useState } from 'react';
import { updateIngredientBookmark } from '../../../sources/api/IngredientAPI';

function UsersIngredientItem({ userIngredient }) {
    const [isBookmarked, setIsBookmarked] = useState(userIngredient.bookmarked || false);

    const toggleBookmark = () => {
        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState); // 즐겨찾기 상태 업데이트
        

        // 서버로 상태 업데이트 (필요시)
        updateIngredientBookmark(1, isBookmarked, userIngredient)
    };

    console.log(userIngredient);
    return (
        <Card className={style.card}>
            <div className={style.imageWrapper}>
                <img
                    src={userIngredient.image || 'https://cdn.mindgil.com/news/photo/202211/75510_16178_5715.jpg'}
                    alt={userIngredient.ingredientName}
                    className={style.image}
                />
                <div className={style.favoriteAndQuantity}>
                    <button
                        className={`${style.favoriteButton} ${isBookmarked ? style.active : ''}`} // 즐겨찾기 상태에 따른 스타일
                        onClick={toggleBookmark}
                    >
                        {isBookmarked ? '⭐' : '☆'} {/* 상태에 따른 아이콘 */}
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
                <Card.Text className={style.details}>
                    <div><strong>유통기한:</strong> {userIngredient.expirationDate || '알 수 없음'}</div>
                    <div><strong>남은 일수:</strong> {userIngredient.remainExpirationDate || 0}</div>
                    <div><strong>보관 방법:</strong> {userIngredient.ingredientStorage || '보관 방법 미정'}</div>
                </Card.Text>
                <Button
                    variant="success"
                    className={style.useButton}
                    onClick={() => console.log(`${userIngredient.ingredientName} 사용하기 클릭됨`)}
                >
                    사용하기
                </Button>
            </Card.Body>
        </Card>
    );
}

export default UsersIngredientItem;
