import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from '../../../assets/css/Ingredient/userIngredient/UsersIngredientItem.module.css';

function UsersIngredientItem({ userIngredient }) {
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
                        className={style.favoriteButton}
                        onClick={() => console.log(`${userIngredient.ingredientName} 즐겨찾기 클릭됨`)}
                    >
                        ⭐
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
