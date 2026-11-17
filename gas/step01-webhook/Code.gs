// ① LINEからの通知を受信
// ② Google Driveへ保存
// ③ PCへ通知
// ④ 複数画像の通知をまとめる
// ⑤ LINEへ受付完了を返信
// ⑥ 営業時間・祝日で返信を切り替える
// ⑦ Lambdaへ通知

function doPost(e) {
  // 1. リクエストデータの解析
  if (typeof e === 'undefined' || !e.postData) {
    return createResponse("No post data");
  }

  const json = JSON.parse(e.postData.contents);
  const events = json.events;

  if (!events || events.length === 0) {
    return createResponse("No events");
  }

  // 3. LINE側へ「200 OK」を返す
  return createResponse("Success");
}

function createResponse(msg) {
  return HtmlService.createHtmlOutput("OK");
}
