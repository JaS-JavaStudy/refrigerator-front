import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function UsersIngredientItem({ userIngredient }) {
    console.log(userIngredient);
    return (
        <Card style={{ width: '16rem', margin: '1rem', border: '1px solid black'}}>
            <Card.Img 
                variant="top" 
                src={userIngredient.image || 'https://via.placeholder.com/150'} 
                alt={userIngredient.ingredientName}
            />
            <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {userIngredient.ingredientName || '재료명'}
                </Card.Title>
                <Card.Text>
                    <div><strong>유통기한:</strong> {userIngredient.expirationDate || '알 수 없음'}</div>
                    <div><strong>남은 일수:</strong> {userIngredient.remainExpirationDate}</div>
                    <div><strong>남은 양:</strong> {userIngredient.ingredientAmount || '0'}</div>
                    <div><strong>보관 방법:</strong> {userIngredient.ingredientStorage|| '보관 방법 미정'}</div>
                </Card.Text>
                <Button 
                    variant="success" 
                    onClick={() => console.log(`${userIngredient.ingredientName} 사용하기 클릭됨`)}
                >
                    사용하기
                </Button>
            </Card.Body>
        </Card>
    );
}

export default UsersIngredientItem;
