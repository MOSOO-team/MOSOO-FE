import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 추가
import "./css/CategoryList.css";

const CategoryList = () => {
  // 카테고리 데이터 상태 관리
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // 대분류 조회 API 호출
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category/first_category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategories();
  }, []);

  // 이벤트 핸들러
  const handleCreate = (id) => {
    console.log("생성 버튼 클릭:", id);
  };

  const handleUpdate = (id) => {
    console.log("수정 버튼 클릭:", id);
  };

  const handleDelete = (id) => {
    console.log("삭제 버튼 클릭:", id);
  };

  return (
    <div className="container">
      <div className="category-header">
        <h1>카테고리 관리</h1>
        <button className="btn-create" onClick={handleCreate}>
        대분류 생성
        </button>
      </div>
      <div className="category-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div className="category-item" key={category.id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={category.icon}
                  alt={category.name}
                  className="category-icon"
                />
                <div className="category-name">{category.name}</div>
              </div>
              <div className="category-actions">
                <button
                  className="btn-create"
                  onClick={() => handleCreate(category.id)}
                >
                  생성
                </button>
                <button
                  className="btn-update"
                  onClick={() => handleUpdate(category.id)}
                >
                  수정
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(category.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>카테고리를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;