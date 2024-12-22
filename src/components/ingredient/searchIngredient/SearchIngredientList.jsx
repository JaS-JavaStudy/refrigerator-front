// components/ingredient/searchIngredient/SearchIngredientList.jsx
import React, { useState } from 'react';
import style from '../../../assets/css/ingredient/ingredient/SearchIngredientList.module.css';
import AddIngredientModal from '../modal/AddIngredientModal';

const SearchIngredientList = ({ isLoading, ingredients, onAddIngredient }) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 한 페이지당 10개의 재료 표시
  const itemsPerPage = 10;
  const totalPages = Math.ceil(ingredients.length / itemsPerPage);

  // 현재 페이지의 재료 목록
  const getCurrentPageIngredients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ingredients.slice(startIndex, endIndex);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className={style.ingredientsGrid}>
        {selectedIngredient && (
          <AddIngredientModal
            ingredient={selectedIngredient}
            onClose={() => setSelectedIngredient(null)}
            onConfirm={onAddIngredient}
          />
        )}

        {isLoading ? (
          <div className={style.loadingContainer}>
            <div className={style.loadingSpinner} />
            <p>재료를 불러오는 중...</p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className={style.noResults}>
            <p>검색 결과가 없습니다</p>
          </div>
        ) : (
          getCurrentPageIngredients().map((ingredient) => (
            <div key={ingredient.ingredientManagementPk} className={style.cardContainer}>
              <div className={style.ingredientCard}>
                <button
                  onClick={() => setSelectedIngredient(ingredient)}
                  className={style.statusDot}
                >
                  +
                </button>
                <div className={style.whitespace} />
              </div>
              <div className={style.textContent}>
                <div className={style.ingredientName}>{ingredient.ingredientName}</div>
                <div className={style.category}>{ingredient.ingredientCategory}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {ingredients.length > 0 && !isLoading && (
        <div className={style.pagination}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`${style.pageButton} ${currentPage === pageNumber ? style.activePage : ''}`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchIngredientList;