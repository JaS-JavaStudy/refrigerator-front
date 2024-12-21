
import { useState } from 'react';
import { createRecipe } from "../../sources/api/recipeAPI.jsx";

const initialState = {
    recipeName: '',
    recipeCookingTime: 0,
    recipeDifficulty: 0,
    recipeContent: '',
    recipeSteps: [],
    recipeCategoryPk: 0,
    userPk: 0,
};

export const AddRecipe = () => {

    const [request, setRequest] = useState({ ...initialState });

    const [recipeSources, setRecipeSources] = useState([]);

    const [recipeStepSources, setRecipeStepSources] = useState([]);

    const [result, setResult] = useState(null);

    const defaultUrl = 'https://picsum.photos/200/300';
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

        createRecipe(formData)
            .then(res => {
                console.log(res);
                setResult(res);

                // 사용 후 초기화
                setRequest({ ...initialState });
                setRecipeSources([]);
                setRecipeStepSources([]);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 파일 업로드 처리
    const handleRecipeSourcesChange = (e) => {
        setRecipeSources(Array.from(e.target.files)); // 여러 파일을 배열로 추가
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

    const printRecipeStepSources = () => {
        console.log(recipeStepSources);
    }
    return (
        <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>
            <div className={"flex justify-center items-center"}>
                <p> 레시피 사진 :
                    <input
                        id="recipe-file-upload"
                        type="file"
                        multiple
                        onChange={handleRecipeSourcesChange}
                        placeholder="레시피 이미지 업로드"
                        style={{display: 'none'}}
                    />
                    <label htmlFor="recipe-file-upload" style={{cursor: "pointer"}}>
                        {recipeSources.length > 0 ? (
                            <img
                                src={URL.createObjectURL(recipeSources[0])} // 첫 번째 파일 미리보기
                                alt="레시피 이미지"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                }}
                            />
                        ) : (
                            <img
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    border: "2px dashed gray",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    color: "gray",

                                }}
                                src={defaultUrl}
                            >
                            </img>
                        )}
                    </label>

                </p>
            </div>
            <div className={"flex justify-center items-center"}>
                <p> 레시피 이름 :
                    <input
                        type="text"
                        name="recipeName"
                        value={request.recipeName}
                        onChange={handleInputChange}
                        placeholder="레시피 이름"
                    />
                </p>
            </div>


            <div className={"flex justify-center items-center"}>
                <p> 조리 시간 :
                    <input
                        type="number"
                        name="recipeCookingTime"
                        value={request.recipeCookingTime}
                        onChange={handleInputChange}
                        placeholder="조리 시간(분)"
                    />
                </p>
            </div>

            <div className={"flex justify-center items-center"}>
                <p> 레시피 간단한 내용 :
                    <input
                        type="text"
                        name="recipeContent"
                        value={request.recipeContent}
                        onChange={handleInputChange}
                        placeholder="레시피 내용"
                    />
                </p>
            </div>
            <div className={"flex justify-center items-center"}>
                <p> 카테고리 :
                    <input
                        type="number"
                        name="recipeCategoryPk"
                        value={request.recipeCategoryPk}
                        onChange={handleInputChange}
                        placeholder="카테고리 PK"
                    />
                </p>
            </div>
            <div className={"flex justify-center items-center"}>
                <p> 유저 번호:
                    <input
                        type="number"
                        name="userPk"
                        value={request.userPk}
                        onChange={handleInputChange}
                        placeholder="유저 PK"
                    />
                </p>
            </div>


            {/* 단계별 입력 */}
            <button onClick={async() => await addStep(-1)}>스텝 추가</button>

            {request.recipeSteps.map((step, index) => (
                <div key={index} className="flex justify-center items-center">
                    <p> 스텝 {index + 1} :
                        <input
                            type="text"
                            name="recipeStepContent"
                            value={step.recipeStepContent || ''}
                            onChange={(e) => handleStepChange(e, index)}
                            placeholder={`스텝 ${index + 1}`}
                        />
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

                            <button type="button" onClick={() => addStep(index)}>스텝 추가</button>
                            <button type="button" onClick={() => removeStep(index)}> 해당 스텝 삭제</button>

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
                    </p>

                </div>
            ))}


            <button onClick={handleClickAdd}>레시피 추가</button>
            <button onClick={printRecipeStepSources}>순서 확인</button>
        </div>
    );
};