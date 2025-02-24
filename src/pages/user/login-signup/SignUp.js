import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 모듈을 import

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // 여러 오류 메시지를 저장할 상태
    const navigate = useNavigate();

    // 입력값 변경 핸들러
    const handleChangeFullName = (e) => setFullName(e.target.value);
    const handleChangeEmail = (e) => setEmail(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);

    const handleGoogleSignUp = () => {
        window.location.href = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/google`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // 이전 오류 초기화

        // 유효성 검사
        if (!fullName || !email || !password) {
            setErrors({ global: '모든 필드를 입력해야 합니다.' });
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth`, {
                email,
                fullName,
                password,
            });

            if (response.status === 200) {
                alert('회원가입 성공!');
                // 예: 대시보드 페이지로 이동
                navigate('/login');
            }
        } catch (error) {
            // 에러 처리
            if (error.response) {
                console.error('에러 응답:', error.response.data);

                // 오류 메시지 처리
                if (error.response.data.code === 'INVALID_PASSWORD') {
                    setErrors({ password: '비밀번호는 반드시 문자와 숫자로 8자 이상이어야 합니다.' });
                }else if (error.response.data.code === 'DUPLICATE_RESOURCE') {
                setErrors({email: '중복된 이메일입니다. 다시 입력해주세요.'});
                } else {
                    setErrors(error.response.data); // 서버에서 반환된 오류 메시지를 상태에 설정
                }
            } else {
                console.error('요청 오류:', error);
                setErrors({ global: '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.' });
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <button type="button" onClick={handleGoogleSignUp} style={styles.button}>구글로 가입하기</button>
                </div>
                <hr style={styles.divider} />
                <div style={styles.inputGroup}>
                    <label htmlFor="fullName">사용자 이름:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={handleChangeFullName}
                        style={styles.input}
                    />
                    {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>} {/* 오류 메시지 표시 */}
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleChangeEmail}
                        style={styles.input}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} {/* 오류 메시지 표시 */}
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handleChangePassword}
                        style={styles.input}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>} {/* 오류 메시지 표시 */}
                </div>
                {errors.global && <p style={{ color: 'red' }}>{errors.global}</p>} {/* 전체 오류 메시지 표시 */}
                <button type="submit" style={styles.button}>가입하기</button>
            </form>

            <p style={styles.redirect}>
                이미 회원이신가요? <button onClick={() => navigate('/login')} style={styles.linkButton}>로그인하기</button>
            </p>
        </div>
    );
};

// 스타일 정의
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '20px',
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '450px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '15px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
    },
    redirect: {
        marginTop: '20px',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '0',
    },
    divider: {
        margin: '20px 0',
        border: 'none',
        borderTop: '1px solid #ccc',
    },
};

export default SignUp;
