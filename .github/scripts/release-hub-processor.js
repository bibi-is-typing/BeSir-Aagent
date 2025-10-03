const { Client } = require('@notionhq/client');

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 환경 변수에서 데이터베이스 ID 가져오기
const RELEASE_DB_ID = process.env.NOTION_RELEASE_DB_ID;
const MARKETING_DB_ID = process.env.NOTION_MARKETING_DB_ID;
const CS_DB_ID = process.env.NOTION_CS_DB_ID;
const SALES_DB_ID = process.env.NOTION_SALES_DB_ID;

// PR 정보 가져오기
const prTitle = process.env.PR_TITLE;
const prBody = process.env.PR_BODY;
const prNumber = process.env.PR_NUMBER;
const prAuthor = process.env.PR_AUTHOR;
const prUrl = process.env.PR_URL;
const commitMessages = process.env.COMMIT_MESSAGES;

// 버전 추출 함수 (예: "Feat: v2.4.0 - ..." → "v2.4.0")
function extractVersion(title) {
  const versionMatch = title.match(/v?\d+\.\d+\.\d+/i);
  return versionMatch ? versionMatch[0] : 'v0.0.0';
}

// AI 기반 콘텐츠 생성 함수 (간단한 룰 기반 생성)
function generateMarketingContent(prTitle, prBody) {
  const isFeature = prTitle.toLowerCase().includes('feat');
  const isFix = prTitle.toLowerCase().includes('fix');
  
  if (isFeature) {
    return {
      mainUpdate: `새로운 기능이 추가되었습니다: ${prTitle.split('-')[1]?.trim() || prTitle}`,
      socialPost: `🎉 업데이트 소식! ${prTitle.split('-')[1]?.trim() || prTitle}\n\n사용자 경험을 개선했습니다. 지금 확인해보세요! #프로덕트업데이트 #신기능`,
      targetAudience: '전체 사용자'
    };
  } else if (isFix) {
    return {
      mainUpdate: `버그가 수정되었습니다: ${prTitle.split('-')[1]?.trim() || prTitle}`,
      socialPost: `🔧 안정성 개선: ${prTitle.split('-')[1]?.trim() || prTitle}\n\n더 나은 서비스를 위해 지속적으로 개선하고 있습니다. #업데이트 #품질개선`,
      targetAudience: '기존 사용자'
    };
  }
  
  return {
    mainUpdate: prTitle,
    socialPost: `📢 ${prTitle}\n\n자세한 내용은 릴리즈 노트를 확인해주세요!`,
    targetAudience: '전체 사용자'
  };
}

function generateCSContent(prTitle, prBody) {
  const isFeature = prTitle.toLowerCase().includes('feat');
  const isFix = prTitle.toLowerCase().includes('fix');
  
  if (isFeature) {
    return {
      faqs: [
        {
          question: '새로운 기능은 어떻게 사용하나요?',
          answer: '업데이트 후 자동으로 활성화됩니다. 메인 화면에서 바로 확인하실 수 있습니다.'
        },
        {
          question: '기존 데이터에 영향이 있나요?',
          answer: '아니요, 기존 데이터는 안전하게 보존됩니다.'
        },
        {
          question: '모바일에서도 사용 가능한가요?',
          answer: '네, 모든 플랫폼에서 동일하게 작동합니다.'
        }
      ],
      guidelines: '신규 기능 관련 문의 시, 사용자가 최신 버전을 사용 중인지 먼저 확인해주세요.'
    };
  } else if (isFix) {
    return {
      faqs: [
        {
          question: '버그 수정 후에도 문제가 발생합니다',
          answer: '브라우저 캐시를 삭제하거나 앱을 재시작해보세요. 문제가 지속되면 고객센터로 문의해주세요.'
        },
        {
          question: '이전 버전으로 돌아갈 수 있나요?',
          answer: '보안 및 안정성을 위해 최신 버전 사용을 권장드립니다.'
        }
      ],
      guidelines: '버그 수정 관련 문의 시, 증상과 발생 시점을 상세히 확인해주세요.'
    };
  }
  
  return {
    faqs: [
      {
        question: '업데이트 내용이 궁금합니다',
        answer: '릴리즈 노트를 참고해주시거나, 고객센터로 문의주시면 자세히 안내드리겠습니다.'
      }
    ],
    guidelines: '일반 업데이트 문의 시, 릴리즈 노트를 먼저 안내해주세요.'
  };
}

function generateSalesContent(prTitle, prBody) {
  const isFeature = prTitle.toLowerCase().includes('feat');
  const isDashboard = prTitle.toLowerCase().includes('dashboard') || prTitle.toLowerCase().includes('대시보드');
  const isAnalytics = prTitle.toLowerCase().includes('analytics') || prTitle.toLowerCase().includes('분석');
  
  if (isDashboard || isAnalytics) {
    return {
      salesPoints: [
        '실시간 데이터 분석으로 빠른 의사결정 지원',
        '직관적인 시각화로 비전문가도 쉽게 이해 가능',
        '별도 툴 없이 통합 환경에서 모든 데이터 확인'
      ],
      competitiveAdvantage: '경쟁사는 별도 분석 툴 구매가 필요하지만, 우리는 기본 제공으로 추가 비용 없음',
      targetSegment: 'B2B 중견기업, 데이터 기반 의사결정을 중요시하는 조직'
    };
  } else if (isFeature) {
    return {
      salesPoints: [
        '고객 요청사항을 반영한 실용적 기능',
        '사용자 경험 개선으로 만족도 향상',
        '지속적인 업데이트로 장기 투자 가치 증명'
      ],
      competitiveAdvantage: '빠른 업데이트 주기로 시장 변화에 민첩하게 대응',
      targetSegment: '혁신을 중시하는 얼리어답터 고객'
    };
  }
  
  return {
    salesPoints: [
      '안정성과 품질 개선',
      '고객 피드백 적극 반영'
    ],
    competitiveAdvantage: '지속적인 품질 관리',
    targetSegment: '전체 고객'
  };
}

// Notion 릴리즈 데이터베이스에 추가
async function createReleaseEntry() {
  const version = extractVersion(prTitle);
  
  try {
    const response = await notion.pages.create({
      parent: { database_id: RELEASE_DB_ID },
      properties: {
        '릴리즈명': {
          title: [{ text: { content: prTitle } }]
        },
        '버전': {
          rich_text: [{ text: { content: version } }]
        },
        'PR 번호': {
          number: parseInt(prNumber)
        },
        '상태': {
          select: { name: '완료' }
        },
        '릴리즈 날짜': {
          date: { start: new Date().toISOString().split('T')[0] }
        },
        'PR 작성자': {
          rich_text: [{ text: { content: prAuthor } }]
        },
        'PR URL': {
          url: prUrl
        },
        '마케팅 콘텐츠 생성': {
          checkbox: true
        },
        'CS 콘텐츠 생성': {
          checkbox: true
        },
        '영업 콘텐츠 생성': {
          checkbox: true
        }
      }
    });
    
    console.log(`✅ 릴리즈 DB 항목 생성 완료: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error('❌ 릴리즈 DB 생성 오류:', error);
    throw error;
  }
}

// 마케팅팀 콘텐츠 추가
async function createMarketingContent(releasePageId) {
  const content = generateMarketingContent(prTitle, prBody);
  const version = extractVersion(prTitle);
  
  try {
    const response = await notion.pages.create({
      parent: { database_id: MARKETING_DB_ID },
      properties: {
        '릴리즈': {
          title: [{ text: { content: `${version} 마케팅 콘텐츠` } }]
        },
        '버전': {
          rich_text: [{ text: { content: version } }]
        },
        '주요 업데이트': {
          rich_text: [{ text: { content: content.mainUpdate } }]
        },
        '소셜미디어 포스팅': {
          rich_text: [{ text: { content: content.socialPost } }]
        },
        '타겟 고객': {
          rich_text: [{ text: { content: content.targetAudience } }]
        },
        '상태': {
          select: { name: '배포 완료' }
        },
        '생성일': {
          date: { start: new Date().toISOString().split('T')[0] }
        }
      }
    });
    
    console.log(`✅ 마케팅 콘텐츠 생성 완료: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error('❌ 마케팅 콘텐츠 생성 오류:', error);
    throw error;
  }
}

// CS팀 콘텐츠 추가
async function createCSContent(releasePageId) {
  const content = generateCSContent(prTitle, prBody);
  const version = extractVersion(prTitle);
  
  // FAQ 텍스트 생성
  const faqText = content.faqs.map((faq, idx) => 
    `Q${idx + 1}. ${faq.question}\nA${idx + 1}. ${faq.answer}`
  ).join('\n\n');
  
  try {
    const response = await notion.pages.create({
      parent: { database_id: CS_DB_ID },
      properties: {
        '릴리즈': {
          title: [{ text: { content: `${version} CS 가이드` } }]
        },
        '버전': {
          rich_text: [{ text: { content: version } }]
        },
        '예상 문의 (FAQ)': {
          rich_text: [{ text: { content: faqText } }]
        },
        '답변 가이드라인': {
          rich_text: [{ text: { content: content.guidelines } }]
        },
        '상태': {
          select: { name: '배포 완료' }
        },
        '생성일': {
          date: { start: new Date().toISOString().split('T')[0] }
        }
      }
    });
    
    console.log(`✅ CS 콘텐츠 생성 완료: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error('❌ CS 콘텐츠 생성 오류:', error);
    throw error;
  }
}

// 영업팀 콘텐츠 추가
async function createSalesContent(releasePageId) {
  const content = generateSalesContent(prTitle, prBody);
  const version = extractVersion(prTitle);
  
  // 세일즈 포인트를 텍스트로 변환
  const salesPointsText = content.salesPoints.map((point, idx) => 
    `${idx + 1}. ${point}`
  ).join('\n');
  
  try {
    const response = await notion.pages.create({
      parent: { database_id: SALES_DB_ID },
      properties: {
        '릴리즈': {
          title: [{ text: { content: `${version} 영업 자료` } }]
        },
        '버전': {
          rich_text: [{ text: { content: version } }]
        },
        '세일즈 포인트': {
          rich_text: [{ text: { content: salesPointsText } }]
        },
        '경쟁사 대비 강점': {
          rich_text: [{ text: { content: content.competitiveAdvantage } }]
        },
        '타겟 고객 세그먼트': {
          rich_text: [{ text: { content: content.targetSegment } }]
        },
        '상태': {
          select: { name: '배포 완료' }
        },
        '생성일': {
          date: { start: new Date().toISOString().split('T')[0] }
        }
      }
    });
    
    console.log(`✅ 영업 콘텐츠 생성 완료: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error('❌ 영업 콘텐츠 생성 오류:', error);
    throw error;
  }
}

// 메인 실행 함수
async function main() {
  console.log('🚀 릴리즈 허브 자동화 시작...');
  console.log(`📦 PR #${prNumber}: ${prTitle}`);
  console.log(`👤 작성자: ${prAuthor}`);
  
  try {
    // 1. 릴리즈 DB 항목 생성
    const releasePageId = await createReleaseEntry();
    
    // 2. 부서별 콘텐츠 생성
    await Promise.all([
      createMarketingContent(releasePageId),
      createCSContent(releasePageId),
      createSalesContent(releasePageId)
    ]);
    
    console.log('✅ 모든 콘텐츠 생성 및 배포 완료!');
  } catch (error) {
    console.error('❌ 처리 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main();
