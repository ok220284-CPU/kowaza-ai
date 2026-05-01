const GEMINI_API_KEY_FALLBACK = "AIzaSyAD3teZCW6BPnl6sEiQuF2Bcloa91WBUfM";

const TECHNIQUE_KNOWLEDGE = {
  slap: {
    name: 'スラップ',
    common: `
スラップ（共通）の理想フォーム：
- バットの持ち方：初心者は両手の間隔を空ける、上級者は詰める。間隔を空けるとコントロール◎、詰めると強い打球
- ステップ：つま先をショート方向（45度）に向ける。ピッチャー方向にまっすぐ向けると体が早く開いて一塁側に流れる
- 体の開きを抑え、三遊間に打球を転がせる形を作る
- 走り抜けへのスムーズな繋ぎ`,
    rubber: `
ゴムボールスラップの理想：
- ボールの中心より「上」を打つ
- ポイントは「後ろ」（引きつけて打つ）で捉える
- バットの「先っぽ」で打つ
- ヘッドを下げながら上から「叩き」つける
- 高く跳ねるバウンドを狙う（ゴムは反発するので）`,
    leather: `
革ボールスラップの理想：
- ボールの中心より「下」を打つ
- ポイントは「前」で捉える
- バットの「根っこ寄り」で打つ
- 体が一塁側に突っ込まないようにする
- 落ちる球はヘッドを少し下げて軌道に入れる
- ライナー性、レフト前、ポテンヒット狙い`,
    criteria: [
      { name: '持ち方・グリップ', desc: '両手の間隔、グリップの位置' },
      { name: 'つま先の角度', desc: 'ショート方向45度に向いているか' },
      { name: '体の開き', desc: '一塁側に流れず開きを抑えられているか' },
      { name: 'バット軌道', desc: 'ヘッドの軌道、ボールへのアプローチ' },
      { name: 'ミート位置', desc: 'ボールに対する打点（前後・上下）' },
      { name: '走り抜け', desc: '打撃から走塁への切り替え' }
    ]
  },
  safety: {
    name: 'セーフティバント',
    common: `
セーフティバントの理想：
- 一番大事なのは「野手にバントだと悟らせないこと」
- ギリギリまで普通のヒッティング構えを見せる
- ボールをキャッチャー近くまで引きつけてから、最後の一瞬でバントの形を作る
- 野手の一歩目を遅らせて迷いを作る
- 上手く転がすことより、野手のスタートを遅らせる方が重要`,
    criteria: [
      { name: '構えの隠し方', desc: 'ギリギリまでヒッティング姿勢を保てているか' },
      { name: '引きつけ', desc: 'ボールをキャッチャー近くまで待てているか' },
      { name: 'バント形成のタイミング', desc: '最後の一瞬で構えを変えられているか' },
      { name: '野手の反応', desc: '野手のスタートを遅らせられているか（読み取り可能なら）' },
      { name: 'ボールタッチ', desc: '転がし方、コース取り' },
      { name: '走り出し', desc: 'バントから走塁への素早い移行' }
    ]
  },
  buster: {
    name: 'バスター',
    common: `
バスターの理想：
- 進塁打や三遊間に強いゴロを打ちたい場面で使う
- 目線を安定させたままタイミングを取りやすい（スラップは頭が動くがバスターは安定）
- 目線をブレさせない
- その場でリズムと間を作る
- ボールの「上半分」を叩く
- バットを上からかぶせる
- フライではなく強いゴロを打つ
- ボールの下を打つとフライになりやすいので注意`,
    criteria: [
      { name: '目線の安定', desc: '頭・目線がブレずに保てているか' },
      { name: 'リズム取り', desc: 'その場で間を作れているか' },
      { name: 'ボールへのアプローチ', desc: '上半分を叩けているか' },
      { name: 'バットの被せ', desc: '上からかぶせる軌道になっているか' },
      { name: '打球角度', desc: 'フライではなくゴロになる打ち方か' },
      { name: '進塁意識', desc: '進塁打として有効な打球方向か' }
    ]
  },
  push: {
    name: 'プッシュ',
    common: `
プッシュの理想：
- 相手がバントを警戒している場面で有効
- ファーストが前に出てきて、セカンドが一塁ベースカバーに入る、その間のスペース（一・二塁間）を狙う
- バントシフトの裏をかく
- 振るのではなく「押し出す」感覚
- 左手と体重を使ってボールを運ぶ
- バントの構えから、左足をセカンド方向へ踏み出す
- 強すぎず弱すぎず、ファーストとセカンドが迷う場所に打つ`,
    criteria: [
      { name: 'シフトの読み', desc: '相手のバントシフトを意識できているか' },
      { name: '構えの隠し方', desc: 'バントを警戒させる準備ができているか' },
      { name: '左足の踏み出し', desc: 'セカンド方向への踏み込みが効いているか' },
      { name: '押し出し感', desc: '振るのではなく押し出す形か' },
      { name: '打球コース', desc: '一・二塁間に転がせているか' },
      { name: '打球の強さ', desc: 'ファースト・セカンドが迷う強さか' }
    ]
  }
};

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return jsonResp({ ok: false, error: 'method_not_allowed' }, 405);
  }
  const apiKey = context.env.GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK;
  if (!apiKey) return jsonResp({ ok: false, message: 'GEMINI_API_KEY 未設定' }, 500);

  let formData;
  try { formData = await context.request.formData(); }
  catch (e) { return jsonResp({ ok: false, message: 'リクエスト形式エラー' }, 400); }

  const videoFile = formData.get('video');
  const technique = formData.get('technique') || 'slap';
  const ballType = formData.get('ballType') || 'rubber';

  if (!videoFile || !(videoFile instanceof File)) {
    return jsonResp({ ok: false, message: '動画ファイルがありません' }, 400);
  }
  if (videoFile.size > 25 * 1024 * 1024) {
    return jsonResp({ ok: false, message: '動画が大きすぎます（25MBまで）' }, 400);
  }

  const knowledge = TECHNIQUE_KNOWLEDGE[technique];
  if (!knowledge) return jsonResp({ ok: false, message: '無効な技指定' }, 400);

  const promptText = buildPrompt(technique, ballType, knowledge);
  const mimeType = videoFile.type || 'video/mp4';
  const buf = await videoFile.arrayBuffer();
  const base64 = arrayBufferToBase64(buf);

  const apiBody = {
    contents: [{
      parts: [
        { text: promptText },
        { inline_data: { mime_type: mimeType, data: base64 } }
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          totalScore: { type: 'integer' },
          summary: { type: 'string' },
          criteria: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                score: { type: 'integer' },
                comment: { type: 'string' }
              },
              required: ['name','score','comment']
            }
          },
          nextPractice: { type: 'array', items: { type: 'string' } }
        },
        required: ['totalScore','summary','criteria','nextPractice']
      }
    }
  };

  let geminiRes;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiBody)
    });
    if (!r.ok) {
      const t = await r.text();
      return jsonResp({ ok: false, message: `Gemini API エラー (${r.status}): ${t.slice(0, 300)}` }, 502);
    }
    geminiRes = await r.json();
  } catch (e) {
    return jsonResp({ ok: false, message: 'Gemini 呼び出し失敗: ' + e.message }, 502);
  }

  const txt = geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!txt) return jsonResp({ ok: false, message: 'Gemini 応答が空' }, 502);

  let parsed;
  try { parsed = JSON.parse(txt); }
  catch (e) { return jsonResp({ ok: false, message: 'JSON解析失敗', raw: txt.slice(0, 500) }, 502); }

  return jsonResp({ ok: true, technique, ballType, result: parsed });
}

function buildPrompt(technique, ballType, knowledge) {
  return `あなたは日本のソフトボール(女子・男子・草野球)の小技指導の専門コーチです。動画に映っている打者のフォームを、以下の理想と比較して具体的に診断してください。

【対象の技】: ${knowledge.name}
${technique === 'slap' ? `【ボール種類】: ${ballType === 'rubber' ? 'ゴムボール（一般軟式・草ソフト）' : '革ボール（硬式・準硬式）'}` : ''}

【理想のフォーム・ポイント】
${knowledge.common}
${technique === 'slap' ? (ballType === 'rubber' ? knowledge.rubber : knowledge.leather) : ''}

【判定軸（${knowledge.criteria.length}項目）】
${knowledge.criteria.map((c, i) => `${i+1}. ${c.name} - ${c.desc}`).join('\n')}

【出力指示】
- totalScore: 全体100点満点（厳しめでOK、初心者なら30〜50点、中級60〜75点、上級80〜95点が目安）
- summary: 全体総評（80〜150字）。良い点と全体的な改善方向を含める
- criteria: 上記の判定軸 ${knowledge.criteria.length} 項目それぞれを評価
  - name: 判定軸名
  - score: 0-100
  - comment: 具体的な観察と指摘（30〜80字）
- nextPractice: 次の練習で意識すべきこと3つ。具体的に「○○を△△する」形式で

【重要】
- 動画から読み取れない項目は「動画から判断不可」と明記して50点を付ける
- 必ず日本語で
- 上から目線ではなく、応援する姿勢で
- 親しみやすい言葉づかい（〜ね、〜よ）`;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000;
  let bin = '';
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  return btoa(bin);
}

function jsonResp(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
