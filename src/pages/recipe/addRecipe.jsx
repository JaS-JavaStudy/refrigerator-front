
import { useState,useEffect } from 'react';
import { createRecipe,recipeCategory } from "../../sources/api/recipeAPI.jsx";

const initialState = {
    recipeName: '',
    recipeCookingTime: 0,
    recipeDifficulty: 0,
    recipeContent: '',
    recipeSteps: [],
    recipeCategoryPk: 0,
    userPk: 1,
    recipeIngredients: []
};

export const AddRecipe = () => {

    const [request, setRequest] = useState({ ...initialState });

    const [recipeSources, setRecipeSources] = useState([]);

    const [recipeStepSources, setRecipeStepSources] = useState([]);

    const [recipeCategories, setRecipeCategories] = useState([]);

    const [result, setResult] = useState(null);

    const [ingredients, setIngredients] = useState([]); // 추가된 재료 목록
    const [ingredientInputTrue,setIngredientInputTrue] = useState("")
    const [ingredientInputFalse,setIngredientInputFalse] = useState("")

    const defaultUrl = "https://amzn-ap-s3-demo-bucket1-refrigerator-storage.s3.ap-southeast-2.amazonaws.com/noimage.jpg";
    const handleClickAdd = () => {

        const formData = new FormData();

        // request 기본 글은 그냥 추가
        formData.append("request",new Blob([JSON.stringify(request)],{type:"application/json"}));

        // recipeSources 파일 배열 추가
        recipeSources.forEach(file => {
            formData.append(`recipeSources`, file); // 같은 이름으로 서버에 전달
        });

        // recipeStepSources 추가
        recipeStepSources.forEach((files, stepIndex) => {
            if(files) {
                files.forEach(file => {
                    formData.append(`recipeStepSources`, file);
                })
            }
        });

        console.log(formData)

        createRecipe(formData)
            .then(res => {
                console.log(res);
                setResult(res);

                // 사용 후 초기화
                setRequest({ ...initialState });
                setRecipeSources([]);
                setRecipeStepSources([]);
                setIngredients([]);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 파일 업로드 처리
    const handleRecipeSourcesChange = (e) => {
        setRecipeSources(Array.from(e.target.files)); // 여러 파일을 배열로 추가
        console.log(Array.from(e.target.files))
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequest(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addStep =  (index) => {
        setRequest((prevState) => {
            const updatedSteps = [...prevState.recipeSteps];
            const newStep = {
                recipeStepOrder: index + 2,
                recipeStepContent: '',
            };

            updatedSteps.splice(index + 1, 0, newStep); // 클릭된 스텝 아래 삽입

            // 전체 순서 업데이트
            const updatedOrderedSteps = updatedSteps.map((step, idx) => ({
                ...step,
                recipeStepOrder: idx + 1, // 순서 재정렬
            }));

            return {
                ...prevState,
                recipeSteps: updatedOrderedSteps,
            };
        });

        // recipeStepSources에도 빈 값 추가
        setRecipeStepSources((prevSources) => {
            const updatedSources = [...prevSources];
            updatedSources.splice(index + 1, 0, null); // 클릭된 스텝 아래에 빈 값 삽입
            return updatedSources;
        });

    };

    const removeStep =  (index) => {
        setRequest((prevState) => {
            const updatedSteps = [...prevState.recipeSteps];
            updatedSteps.splice(index, 1); // 해당 인덱스 스텝 삭제

            // 순서 재정렬
            const updatedOrderedSteps = updatedSteps.map((step, idx) => ({
                ...step,
                recipeStepOrder: idx + 1,
            }));

            return {
                ...prevState,
                recipeSteps: updatedOrderedSteps,
            };
        });

        // recipeStepSources에서도 해당 인덱스의 이미지 삭제
        setRecipeStepSources((prevSources) => {
            const updatedSources = [...prevSources];
            updatedSources.splice(index, 1); // 해당 인덱스 삭제
            return updatedSources;
        });
    };

    const handleStepChange = (e, index) => {
        const { name, value } = e.target;
        setRequest(prevState => {
            const updatedSteps = [...prevState.recipeSteps];
            updatedSteps[index] = { ...updatedSteps[index], [name]: value };
            return {
                ...prevState,
                recipeSteps: updatedSteps,
            };
        });
    };

    const handleRecipeStepSourcesChange = (e, index) => {
        const files = Array.from(e.target.files||[]); // 업로드된 파일 리스트

        setRecipeStepSources((prevSources) => {
            const updatedSources = [...prevSources];
            updatedSources[index] = files.length > 0 ? files : null; // 파일이 있으면 업데이트, 없으면 null
            return updatedSources;
        });
    };

// 카테고리 API 호출 함수
    const fetchRecipeCategories = async () => {
        try {
            const data = await recipeCategory(); // API 호출
            setRecipeCategories(data); // 카테고리 목록 저장
        } catch (err) {
            console.error("카테고리 로드 실패:", err);
        }
    };
    useEffect(() => {
        fetchRecipeCategories();
    }, [ingredients]);



    // 입력값 업데이트
    const handleIngredientTrueChange = (e) => {
        setIngredientInputTrue(e.target.value); // 입력 필드의 값을 상태에 저장
    };
    const handleIngredientFalseChange = (e) => {
        setIngredientInputFalse(e.target.value); // 입력 필드의 값을 상태에 저장
    };

    // 재료 추가 핸들러 (엔터 키 / 버튼 클릭)
    const handleAddIngredient = (e) => {
        // ID 값으로 필수 또는 부가 재료 구분
        const isNecessary = e.target.id === "ingredientInputTrue"; // 아이디 비교 제대로 수정!

        if (isNecessary && ingredientInputTrue.trim() !== "") {
            const newIngredient = {
                ingredientName: ingredientInputTrue.trim(),
                ingredientIsNecessary: isNecessary,
            };

            // 중복 확인 후 추가
            if (!ingredients.some((ingredient) => ingredient.ingredientName === newIngredient.ingredientName)) {
                setIngredients((prev) => {
                    const updatedIngredients = [...prev, newIngredient];

                    // setRequest에 재료 목록 반영
                    setRequest((prevRequest) => ({
                        ...prevRequest,
                        recipeIngredients: updatedIngredients, // recipeIngredients에 반영
                    }));

                    return updatedIngredients;
                });
            }

            setIngredientInputTrue(""); // 입력 필드 초기화
        } else if (!isNecessary && ingredientInputFalse.trim() !== "") {
            const newIngredient = {
                ingredientName: ingredientInputFalse.trim(),
                ingredientIsNecessary: isNecessary,
            };

            // 중복 확인 후 추가
            if (!ingredients.some((ingredient) => ingredient.ingredientName === newIngredient.ingredientName)) {
                setIngredients((prev) => {
                    const updatedIngredients = [...prev, newIngredient];

                    // setRequest에 재료 목록 반영
                    setRequest((prevRequest) => ({
                        ...prevRequest,
                        recipeIngredients: updatedIngredients, // recipeIngredients에 반영
                    }));

                    return updatedIngredients;
                });
            }

            setIngredientInputFalse(""); // 입력 필드 초기화
        }
    };

    // 엔터 키로 추가
    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            handleAddIngredient(e);
        }
    };

    // 재료 삭제 핸들러 (리스트에서 삭제)
    const handleRemoveIngredient = (ingredientToRemove) => {
        setIngredients((prev) => {
            const updatedIngredients = prev.filter(
                (ingredient) =>
                    ingredient.ingredientName !== ingredientToRemove.ingredientName
            );

            // setRequest에 재료 목록 반영
            setRequest((prevRequest) => ({
                ...prevRequest,
                recipeIngredients: updatedIngredients

            }));

            return updatedIngredients;
        });

    };

    return (
        <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                }}
            >
                <p
                    className={"text-2xl"}
                    style={{
                        display: "inline-block", // 글자의 크기에 맞춤
                        padding: "4px 8px", // 글자 주변 공간 추가
                        fontSize: "40px", // 글자 크기 설정
                        lineHeight: "1", // 줄 간격을 1로 설정 (글자 높이에 딱 맞춤)
                        fontWeight: "bold",
                    }}
                >
                    Recipe
                </p>
                <button
                    className={"flex items-center"}
                    onClick={handleClickAdd}
                    style={{
                        height: "40px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "#007bff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "auto",// 오른쪽 끝으로 이동
                        marginRight: "30px"
                    }}
                >
                    레시피 추가
                </button>
            </div>


            <div
                style={{
                    display: "grid", // Grid Layout 사용
                    gridTemplateColumns: "400px 1fr", // 두 개의 칼럼: 첫 번째는 이미지(고정 폭), 두 번째는 나머지
                    gap: "20px", // 이미지는 레시피 정보와 20px 간격
                    alignItems: "flex-start", // 세로 정렬: 시작 부분 정렬
                    marginRight: "30px"
                }}
            >
                {/* 왼쪽: 이미지 */}
                <label htmlFor="recipe-file-upload" style={{cursor: "pointer"}}>
                    <input
                        id="recipe-file-upload"
                        type="file"
                        multiple
                        onChange={handleRecipeSourcesChange}
                        style={{display: "none"}}
                    />
                    {recipeSources.length > 0 ? (
                        <img
                            src={URL.createObjectURL(recipeSources[0])}
                            alt="레시피 이미지"
                            style={{
                                width: "100%", // 그리드 셀의 전체를 채움
                                maxWidth: "400px", // 최대 폭 고정
                                height: "400px", // 고정된 높이
                                objectFit: "cover", // 유지하며 리사이즈
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                            }}
                        />
                    ) : (
                        <img
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                height: "400px",
                                objectFit: "contain",
                                border: "1px dashed gray",
                                cursor: "pointer",
                                borderRadius: "6px",
                            }}
                            src={defaultUrl}
                            alt="기본 이미지"
                        />
                    )}
                </label>

                {/* 오른쪽: 레시피 정보 */}
                <div
                    style={{
                        display: "grid", // 내부 레이아웃도 Grid로 적용
                        gridTemplateColumns: "1fr", // 한 줄씩 배치(열 1개)
                        gap: "20px", // 위아래 간격
                    }}
                >
                    {/* 레시피 이름 */}
                    <div>
                        <input
                            type="text"
                            name="recipeName"
                            value={request.recipeName}
                            onChange={handleInputChange}
                            placeholder="레시피 이름"
                            style={{
                                height: "50px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "20px",
                                width: "100%", // 입력 필드가 컨테이너 전폭을 사용
                            }}
                        />
                    </div>

                    {/* 조리 시간 */}
                    <div>
                        <label
                            htmlFor="recipeCookingTime"
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginBottom: "5px",
                            }}
                        >
                            조리 시간 (분)
                        </label>
                        <input
                            type="number"
                            id="recipeCookingTime"
                            name="recipeCookingTime"
                            value={request.recipeCookingTime}
                            onChange={handleInputChange}
                            placeholder="분"
                            style={{
                                height: "40px",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%", // 정렬 유지
                            }}
                        />
                    </div>

                    {/* 카테고리 */}
                    <div>
                        <label
                            htmlFor="recipeCategoryPk"
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginBottom: "5px",
                            }}
                        >
                            카테고리
                        </label>
                        <select
                            id="recipeCategoryPk"
                            name="recipeCategoryPk"
                            value={request.recipeCategoryPk || ""}
                            onChange={handleInputChange}
                            style={{
                                height: "40px",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%", // 정렬 유지
                            }}
                        >
                            <option value="" disabled>
                                카테고리를 선택하세요
                            </option>
                            {recipeCategories.map((category, index) => (
                                <option key={index} value={category.recipeCategoryPK}>
                                    {category.recipeCategory}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 난이도 */}
                    <div>
                        <label
                            htmlFor="recipeDifficulty"
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginBottom: "5px",
                            }}
                        >
                            난이도
                        </label>
                        <select
                            id="recipeDifficulty"
                            name="recipeDifficulty"
                            value={request.recipeDifficulty}
                            onChange={handleInputChange}
                            style={{
                                height: "40px",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%", // 정렬 유지
                            }}
                        >
                            {Array.from({length: 5}, (_, i) => i + 1).map((difficulty) => (
                                <option key={difficulty} value={difficulty}>
                                    {difficulty}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 간단한 요약 */}
                    <div>
                        <label
                            htmlFor="recipeContent"
                            style={{
                                display: "block",
                                fontWeight: "bold",
                                fontSize: "16px",
                                marginBottom: "5px",
                            }}
                        >
                            간단 요약
                        </label>
                        <input
                            style={{
                                height: "40px",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%", // 정렬 유지
                            }}
                            type="text"
                            name="recipeContent"
                            value={request.recipeContent}
                            onChange={handleInputChange}
                            placeholder="레시피 내용"
                        />
                    </div>
                </div>
            </div>
            <div>
                {/* 필수 재료 입력 */}
                <div style={{marginBottom: "20px"}}>
                    <label
                        htmlFor="ingredientInputTrue"
                        style={{
                            display: "block",
                            fontWeight: "bold",
                            fontSize: "16px",
                            marginBottom: "5px",
                        }}
                    >
                        필수 재료
                    </label>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <input
                            id="ingredientInputTrue" // 필수 재료 필드 ID
                            value={ingredientInputTrue}
                            onChange={handleIngredientTrueChange}
                            onKeyUp={handleEnterPress} // 엔터키로 추가
                            placeholder="필수 재료를 입력하세요."
                            style={{
                                flex: 1,
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                marginRight: "10px",
                            }}
                        />
                        <button
                            id="ingredientInputTrue"
                            onClick={handleAddIngredient}
                            style={{
                                color: "#fff",
                                backgroundColor: "#007bff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                padding: "8px 16px",
                                fontSize: "14px",
                            }}
                        >
                            추가
                        </button>
                    </div>
                </div>

                {/* 부가 재료 입력 */}
                <div style={{marginBottom: "20px"}}>
                    <label
                        htmlFor="ingredientInputFalse"
                        style={{
                            display: "block",
                            fontWeight: "bold",
                            fontSize: "16px",
                            marginBottom: "5px",
                        }}
                    >
                        부가 재료
                    </label>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <input
                            id="ingredientInputFalse" // 부가 재료 필드 ID
                            value={ingredientInputFalse}
                            onChange={handleIngredientFalseChange}
                            onKeyUp={handleEnterPress} // 엔터키로 추가
                            placeholder="부가 재료를 입력하세요."
                            style={{
                                flex: 1,
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                marginRight: "10px",
                            }}
                        />
                        <button
                            id="ingredientInputFalse"
                            onClick={handleAddIngredient}
                            style={{
                                color: "#fff",
                                backgroundColor: "#007bff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                padding: "8px 16px",
                                fontSize: "14px",
                            }}
                        >
                            추가
                        </button>
                    </div>
                </div>

                {/* 추가된 재료 목록 */}
                <ul style={{listStyleType: "none", padding: "0"}}>
                    {ingredients.map((ingredient, index) => (
                        <li
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px",
                                borderBottom: "1px solid #ccc",
                            }}
                        >
            <span>
              {ingredient.ingredientName} ({ingredient.ingredientIsNecessary ? "필수" : "부가"})
            </span>
                            <button
                                onClick={() => handleRemoveIngredient(ingredient)}
                                style={{
                                    color: "#fff",
                                    backgroundColor: "#dc3545",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                }}
                            >
                                ✖️
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 단계별 입력 */}
            <button
                style={{
                    height: "40px",
                    margin: "10px",
                    width: "100%",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#007bff",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    alignItems: "center"
                }}
                onClick={async () => await addStep(-1)}
            >
                +
            </button>

            {request.recipeSteps.map((step, index) => (
                <div key={index}
                     className="flex items-center"
                     style={{
                         width: "100%",
                     }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "40px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex", // 내부 요소(번호, 입력 필드, 버튼)를 Flexbox로 배치
                                flexBasis: "80%", // 부모 컨테이너의 80% 차지
                                alignItems: "center", // 수직 중앙 정렬
                                columnGap: "10px", // 요소 간 간격
                            }}
                        >
                            <span
                                style={{
                                    alignItems: "center", // 수직 중앙 정렬
                                    width:"100px",
                                    marginLeft: "10px"
                                }}>
                                {index + 1} :
                            </span>
                            <input
                                type="text"
                                style={{
                                    marginLeft: "10px", // 입력 필드와 이전 요소(번호) 간의 간격
                                    fontSize: "40px", // 글자 크기 키움
                                    height: "50px", // 입력 필드 높이 키움
                                    width: "100%", // 입력 필드 너비 키움
                                    padding: "5px 10px", // 내용 패딩
                                }}
                                name="recipeStepContent"
                                value={step.recipeStepContent || ''}
                                onChange={(e) => handleStepChange(e, index)}
                                placeholder={`스텝 ${index + 1}`}
                            />
                            <button
                                style={{
                                    height: "50px",
                                    padding: "5px 10px", // 내용 패딩
                                    fontSize: "40px",
                                    fontWeight: "bold",
                                    color: "#007bff",
                                    backgroundColor: "transparent",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginLeft: "10px",

                                }}
                                onClick={() => removeStep(index)}>
                                -
                            </button>
                        </div>
                        <div>
                            {/* 숨겨진 파일 선택 입력 */}
                            <input
                                id={`step-file-${index}`} // 각 스텝마다 고유 ID 할당
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleRecipeStepSourcesChange(e, index)}
                                style={{display: 'none'}} // 숨기기
                            />
                            {/* 라벨을 클릭하면 파일 창 열기 */}
                            <label htmlFor={`step-file-${index}`} style={{cursor: 'pointer'}}>
                                <img
                                    src={recipeStepSources[index] ? URL.createObjectURL(recipeStepSources[index][0]) : defaultUrl}
                                    alt="스텝 이미지"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        border: '1px solid #ccc',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    <button
                        style={{
                            height: "40px",
                            margin: "10px",
                            width: "100%",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#007bff",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            alignItems: "center"
                        }}
                        onClick={async () => await addStep(index)}
                    >
                        +
                    </button>
                </div>
            ))}


        </div>
    );
};