/**
 * 소셜 로그인 처리를 위한 인증 모듈 (v2.4.1)
 */

// 외부 소셜 로그인 API와 통신하는 함수
async function handleSocialLogin(provider) {
    console.log(`${provider}로 로그인을 시도합니다...`);

    /*
     * BUG (v2.4.0): 외부 API의 인증 방식 변경으로 인해,
     * 아래 로직이 간헐적으로 실패하는 문제 발생.
     * const response = await fetch(`https://api.social.com/auth?provider=${provider}`);
     * const data = await response.json();
     */

    // FIX (v2.4.1): 변경된 인증 방식에 맞춰 API 요청 핸들러를 수정하고,
    // 예외 처리(try-catch) 로직을 추가하여 안정성을 높임.
    try {
        const response = await fetch(`https://api.social.com/v2/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: provider, grant_type: 'token' })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("로그인 성공:", data.userId);
        return { success: true, userId: data.userId };

    } catch (error) {
        console.error("소셜 로그인 중 오류 발생:", error.message);
        return { success: false, error: error.message };
    }
}

// 예시: Google 로그인 실행
handleSocialLogin('google');
