// SearchIngredient.jsx
import React, { useState, useEffect } from 'react';
import { getAllIngredients, addIngredientToMyRefrigerator, createIngredient } from '../../../sources/api/IngredientAPI';
import { Search } from 'lucide-react';
import SearchIngredientList from './SearchIngredientList';
import style from '../../../assets/css/ingredient/ingredient/SearchIngredient.module.css';

const SearchIngredient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        const data = await getAllIngredients();
        setIngredients(data);
        setFilteredIngredients(data);
      } catch (error) {
        console.error('재료 로딩 중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = ingredients.filter(ingredient =>
      ingredient.ingredientName.toLowerCase().includes(term)
    );
    setFilteredIngredients(filtered);
  };

  const handleAddIngredient = async (ingredientData) => {
    try {
      await createIngredient(ingredientData);
      alert('재료가 추가되었습니다!');
      // UserIngredient 컴포넌트의 데이터를 새로고침하기 위해 이벤트를 발생시킬 수 있습니다.
      window.dispatchEvent(new Event('ingredientAdded'));
    } catch (error) {
      console.error('재료 추가 중 에러 발생:', error);
      alert('재료 추가에 실패했습니다.');
    }
  };

  return (
    <div className={style.searchContainer}>
      <div className={style.searchSection}>
        <h1 className={style.addSection}>재료 추가하기</h1>
        <div className={style.searchInputWrapper}>
          <Search className={style.searchIcon} size={20} />
          <input
            type="text"
            placeholder="찾으시는 재료를 입력해 주세요."
            value={searchTerm}
            onChange={handleSearch}
            className={style.searchInput}
          />
        </div>
      </div>

      <SearchIngredientList
        isLoading={isLoading}
        ingredients={filteredIngredients}
        onAddIngredient={handleAddIngredient}
      />
    </div>
  );
};

export default SearchIngredient;