import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 게시글 목록 가져오기
 * @param {number} page - 요청할 페이지 번호
 * @param {boolean} isOffer - 요청 유형 (true: 고수, false: 일반)
 * @returns {Promise<Object>} - 게시글 데이터 { postList, totalPages }
 */
export const fetchPostList = async (page = 1, isOffer) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/post/postList`, {
            params: { page, isOffer },
        });
        return response.data;
    } catch (error) {
        console.error('게시글 목록을 가져오는 데 실패했습니다.', error);
        throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
    }
};

/**
 * 게시글 상세 가져오기
 * @param {Long} postId - 게시글 ID
 * @returns {Promise<Object>} - 게시글 데이터
 */
export const fetchPostDetail = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error('게시글을 불러오는 데 실패했습니다.', error);
        throw new Error('게시글을 불러오는 데 실패했습니다.');
    }
};

/**
 * 게시글 삭제
 * @param {number} postId - 삭제할 게시글 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const deletePost = async (postId) => {
    try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

        const response = await axios.delete(`${API_BASE_URL}/api/post/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
            },
        });

        return response.data; // 서버에서 반환된 데이터
    } catch (error) {
        console.error('게시글 삭제에 실패했습니다.', error);
        throw new Error('게시글 삭제에 실패했습니다.');
    }
};

/**
 * 입찰 목록 가져오기
 * @param {Long} postId - 게시글 ID
 * @returns {Promise<Array>} - 입찰 목록
 */
export const fetchBids = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/bid/${postId}`, { withCredentials: true });
        return response.data.bids;
    } catch (error) {
        console.error('입찰 데이터를 가져오는 데 실패했습니다.', error);
        throw new Error('입찰 데이터를 가져오는 데 실패했습니다.');
    }
};

/**
 * 입찰 생성하기
 * @param {string} postId - 게시글 ID
 * @param {Object} requestDto - 입찰 데이터
 * @returns {Promise<Object>} - 생성된 입찰 데이터
 */
export const createBid = async (postId, requestDto) => {
    try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/bid/${postId}`,
            requestDto,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('입찰 생성에 실패했습니다.', error);
        throw new Error('입찰 생성에 실패했습니다.');
    }
};



/**
 * 리뷰 목록 가져오기
 * @param {string} postId - 게시글 ID
 * @returns {Promise<Array>} - 리뷰 목록
 */
export const fetchReviews = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/review/${postId}`);
        return response.data.reviews;
    } catch (error) {
        console.error('리뷰 데이터를 가져오는 데 실패했습니다.', error);
        throw new Error('리뷰 데이터를 가져오는 데 실패했습니다.');
    }
};

/**
 * 필터링된 게시물 목록 가져오기
 * @param {number} page - 현재 페이지 번호
 * @param {Object} filters - 필터링 조건 (카테고리, 키워드, 주소, Offer 여부)
 * @returns {Promise<Object>} - 게시물 목록과 페이지 정보
 */
export const fetchFilteredPostList = async (page, filters = {}) => {
    try {
        const params = {
            page
        };

        // 선택적으로 파라미터 추가
        if (filters.selectedCategory?.categoryId) {
            params.categoryId = filters.selectedCategory.categoryId;
        }
        if (filters.keyword) {
            params.keyword = filters.keyword;
        }
        if (filters.selectedAddress) {
            params.address = filters.selectedAddress;
        }
        params.isOffer = filters.isOffer;

        const response = await axios.get(`${API_BASE_URL}/api/post/filterPosts`, { params });

        return {
            postList: response.data.postList, // 서버에서 반환된 게시물 목록
            totalPages: response.data.totalPages, // 전체 페이지 수
            keyword: response.data.keyword || '',
            address: response.data.address || '',
            categoryName: response.data.categoryName || '',
        };
    } catch (error) {
        console.error('필터링된 게시물 목록을 가져오는 중 오류 발생:', error);
        throw new Error('필터링된 게시물 데이터를 가져오는 데 실패했습니다.');
    }
};

/**
 * 채팅방 생성 API 호출
 * @param {number} gosuId - 게시글 작성자 ID
 * @param {string} postId - 게시글 ID
 * @param {string} bidId - 입찰 ID
 * @returns {Promise<string>} - 생성된 채팅방 ID
 */
export const createChatroom = async (gosuId, postId, bidId) => {
    try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

        console.log(gosuId, postId, bidId);

        const response = await axios.post(
            `${API_BASE_URL}/api/chatroom`,
            JSON.stringify({
                gosuId,
                postId,
                bidId,
            }),
            {
                headers: {
                    'Content-Type': 'application/json', // JSON 형식으로 전송
                    Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                },
            }
        );
        console.log(response.data);
        return response.data.chatRoomId; // 서버에서 반환된 chatroomId
    } catch (error) {
        console.error('채팅방 생성에 실패했습니다:', error);
        throw new Error('채팅방 생성에 실패했습니다.');
    }
};

/**
 * 게시글 수정 API 호출
 * @param {Object} updatedPost - 수정할 게시글 데이터 (title, description, price, duration 포함)
 * @returns {Promise<Object>} - 수정된 게시글 데이터 반환
 */
export const updatePost = async (updatedPost) => {
    try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

        const response = await axios.put(
            `${API_BASE_URL}/api/post`,
            JSON.stringify(updatedPost),
            {
                headers: {
                    'Content-Type': 'application/json', // JSON 형식으로 전송
                    Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                },
            }
        );
        console.log(response.data);
        return response.data; // 서버에서 반환된 데이터
    } catch (error) {
        console.error('게시글 수정에 실패했습니다:', error);
        throw new Error('게시글 수정에 실패했습니다.');
    }
};



// 게시글 상태 변경 API 호출
export const updatePostStatusApi = async (postId, status) => {
    try {
        const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.put(
            `${API_BASE_URL}/api/post/${postId}?status=${status}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함
                },
            }
        );
        return response.data; // 서버로부터의 응답 데이터 반환
    } catch (error) {
        console.error("상태 변경 요청 실패", error);
        throw error; // 에러를 호출한 쪽으로 전달
    }
};

