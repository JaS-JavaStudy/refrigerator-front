
import { useState,useEffect } from 'react';
import {
    getUserPk,
    deleteRecipe,
    getRecipeDetail,
    recipeCategory,
    updateRecipe
} from "@/sources/api/recipeAPI.jsx";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";

const initialState = {
    recipePk: 0,
    recipeName: '',
    recipeCookingTime: 0,
    recipeDifficulty: 0,
    recipeContent: '',
    recipeSteps: [],
    recipeCategoryPk: 0,
    userPk: 1,
    recipeIngredients: []
};


export const UpdateRecipe = () => {
    const navigate = useNavigate();
    const { recipePk } = useParams()
    const [request, setRequest] = useState({ ...initialState });

    const [recipeSources, setRecipeSources] = useState([]);

    const [recipeStepSources, setRecipeStepSources] = useState([]);

    const [recipeCategories, setRecipeCategories] = useState([]);

    const [result, setResult] = useState(null);
    const [imageChanged,setImageChanged] = useState(false);

    const [ingredients, setIngredients] = useState([]); // 추가된 재료 목록
    const [ingredientInputTrue,setIngredientInputTrue] = useState("")
    const [ingredientInputFalse,setIngredientInputFalse] = useState("")

    const defaultUrl = "https://amzn-ap-s3-demo-bucket1-refrigerator-storage.s3.ap-southeast-2.amazonaws.com/noimage.jpg";
    const handleClickUpdate = () => {

        const formData = new FormData();
        const userPk = getUserPk();
        if (!userPk) {
            console.error("User Token is invalid or missing.");
            return; // UserPk가 없을 시 요청을 중단
        }// request 기본 글은 그냥 추가

        const updatedRequest = { ...request, recipeUserPk: userPk };

        formData.append("request",new Blob([JSON.stringify(updatedRequest)],{type:"application/json"}));

        // recipeSources 파일 배열 추가
        recipeSources.forEach(file => {
            formData.append(`recipeSources`, file); // 같은 이름으로 서버에 전달
        });


        // recipeStepSources 추가
        recipeStepSources.forEach((files, stepIndex) => {
            if (files && files.length > 0) { // 파일이 있는 경우만 처리
                files.forEach(file => {
                    formData.append(`recipeStepSources`, file);
                });
            }
        });

        updateRecipe(formData)
            .then(res => {
                console.log(res);
                setResult(res);

                // 사용 후 초기화
                setRequest({ ...initialState });
                setRecipeSources([]);
                setRecipeStepSources([]);
                setIngredients([]);
                navigate("/recipe")
            })
            .catch(err => {
                console.log(err);
            });
    };
    const handleClickDelete = () => {
        deleteRecipe(recipePk)
            .then(res => {
                navigate("/recipe")
            })
            .catch(err => {
                console.log(err);
            })
    }

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

        if (files.length === 0) return;

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
            setRecipeCategories(data);
        } catch (err) {
            console.error("카테고리 로드 실패:", err);
        }
    };

    const convertUrlsToFiles = async (arrays) => { // url 받아와서 파일화..
        try {
            const files = await Promise.all(
                arrays.map(async (array, index) => {

                    const [url, fileName] = array;
                    if (!url || !fileName) { // URL 또는 fileName이 없는 경우 경고 및 무시
                        console.warn("Invalid URL or fileName:", { url, fileName });
                        return null;
                    }

                    const response = await fetch(url,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            mode: "cors",
                            cache: "no-cache",
                            credentials: "same-origin",
                            redirect: "follow",
                        }); // 해당 URL에서 데이터를 가져옴
                    const blob = await response.blob(); // Blob으로 변환
                    const file = new File([blob], fileName, { type: blob.type }); // Blob을 File로 변환
                    return file;
                })
            );
            return files; // `MultiFiles` 형태와 호환 가능
        } catch (error) {
            console.error('Error converting URLs to files:', error);
            return [];
        }
    };

    const fetchRecipeDetail = async () => {
        try {
            const data = await getRecipeDetail(recipePk);

            // 데이터를 매핑하여 request 상태로 설정
            const mappedData = {
                recipePk: data.recipePk || 0,
                recipeName: data.recipeName || "",
                recipeCookingTime: data.recipeCookingTime || 0,
                recipeDifficulty: data.recipeDifficulty || 0,
                recipeContent: data.recipeContent || "",
                recipeSteps: data.recipeStep || [],
                recipeCategoryPk: data.recipeCategory?.recipeCategoryPK || 1,
                userPk: 1,
                recipeIngredients: data.ingredients || [],
            };

            setRequest(mappedData); // 기본 요청 설정

            // recipeSources 상태 업데이트(메인 이미지)
            if (data.recipeSource?.length > 0) {
                const mainImageFiles = await convertUrlsToFiles([
                    [
                        data.recipeSource[0].recipeSourceSave,
                        data.recipeSource[0].recipeSourceFileName,
                    ],
                ]);
                setRecipeSources(mainImageFiles);
            } else {
                setRecipeSources([]);
            }
            console.log(data)
            // recipeStepSources 상태 업데이트(스텝별 이미지)
            if (data.recipeStep?.length > 0) {
                const stepFiles = await Promise.all(
                    data.recipeStep.map(async (step) => {
                        if (step.recipeStepSource) {
                            // URL 배열과 파일 이름을 convertUrlsToFiles 함수에 전달
                            const files = await convertUrlsToFiles([
                                [
                                    step.recipeStepSource.recipeStepSourceSave,
                                    step.recipeStepSource.recipeStepSourceFileName,
                                ],
                            ]);
                            return files.length > 0 ? files : null; // 변환 성공 시 파일 반환
                        }
                        return null; // recipeStepSource가 없는 경우 null 반환
                    })
                );

                // 변환된 데이터로 상태 업데이트
                setRecipeStepSources(stepFiles.map((file) => file || null));
            } else {
                setRecipeStepSources([]); // 스텝 이미지가 없으면 빈 배열로 설정
            }

            // 재료 데이터 매핑 및 상태 업데이트
            const ingredientMappedData = data.ingredients.map((ingredient) => ({
                ingredientIsNecessary: ingredient.ingredientIsNecessary === 1,
                ingredientName: ingredient.ingredientManagement?.ingredientName || "",
            }));

            setIngredients(ingredientMappedData);

            // 재료 데이터도 request에 반영
            setRequest((prevRequest) => ({
                ...prevRequest,
                recipeIngredients: ingredientMappedData,
            }));
        } catch (err) {
            console.error("디테일 로드 실패:", err);
        }
    };

    useEffect(() => {
        fetchRecipeCategories();
        fetchRecipeDetail();
        console.log(recipeStepSources)
    }, []);



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
                        recipeIngredients: updatedIngredients,
                    }));

                    return updatedIngredients;
                });
            }

            setIngredientInputFalse("");
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
                <div
                style={{
                    marginLeft: "auto",// 오른쪽 끝으로 이동
                }}>
                    <button
                        className={"flex items-center"}
                        onClick={handleClickDelete}
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
                            marginRight: "30px"
                        }}
                    >
                        삭제
                    </button>
                    <button
                        className={"flex items-center"}
                        onClick={handleClickUpdate}
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
                            marginRight: "30px"
                        }}
                    >
                        레시피 수정
                    </button>
                </div>
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
                    <img
                        src={
                            recipeSources.length > 0 && recipeSources[0]
                                ? URL.createObjectURL(recipeSources[0]) // 정상적인 파일 객체가 있을 경우 URL 생성
                                : defaultUrl // 기본 이미지 URL로 대체
                        }
                        alt="레시피 이미지"
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            height: "400px",
                            objectFit: "cover",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                        }}
                    />
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
                                    src={recipeStepSources[index] &&
                                    recipeStepSources[index][0] &&
                                    URL.createObjectURL(recipeStepSources[index][0])? URL.createObjectURL(recipeStepSources[index][0]) : defaultUrl}
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

export default UpdateRecipe;