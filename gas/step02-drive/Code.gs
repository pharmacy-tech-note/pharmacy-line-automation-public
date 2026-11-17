// ① LINEからの通知を受信
// ② Google Driveへ保存
// ③ PCへ通知
// ④ 複数画像の通知をまとめる
// ⑤ LINEへ受付完了を返信
// ⑥ 営業時間・祝日で返信を切り替える
// ⑦ Lambdaへ通知

const props = PropertiesService.getScriptProperties();
const LINE_ACCESS_TOKEN = props.getProperty('LINE_ACCESS_TOKEN');
const FOLDER_ID = props.getProperty('FOLDER_ID');

if (!LINE_ACCESS_TOKEN || !FOLDER_ID) {
  console.error("❌ エラー: GASのスクリプトプロパティに LINE_ACCESS_TOKEN, FOLDER_ID のいずれかが設定されていません。確認してください。");
}

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

  // 2. 各イベントの処理
  for (const event of events) {
    // 画像メッセージが送信された場合のみ、一連の処理を実行
    if (event.type === 'message' && event.message.type === 'image') {
      const messageId = event.message.id;
      try {
        // --- 手順A: 画像をGoogleドライブに保存 ---
        saveImageToDrive(messageId);
        console.log("正常に処理完了: メッセージID " + messageId);
      } catch (error) {
        // 処理中にエラーが起きた場合、ログに詳細を残す
        console.error('内部処理エラー:', error.toString());
      }
    }
  }
  // 3. LINE側へ「200 OK」を返す
  return createResponse("Success");
}

function createResponse(msg) {
  return HtmlService.createHtmlOutput("OK");
}

function saveImageToDrive(messageId) {
  const url = 'https://api-data.line.me/v2/bot/message/' + messageId + '/content';
  const options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN
    },
    'muteHttpExceptions': true // ★追加: 画像取得時の偶発的なエラー波及を防止
  };
  
  // LINEサーバーから画像のバイナリデータを取得
  const response = UrlFetchApp.fetch(url, options);
  
  // ★改善点1: 同秒数の受信時、常駐プリントプログラムが上書きや検知漏れを起こさないよう messageId を付与して完全一意化
  const fileName = 'rx_' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd_HHmmss') + '_' + messageId + '.jpg';
  const imageBlob = response.getBlob().setName(fileName);
  
  // 指定したGoogleドライブのフォルダへファイルを保存
  const folder = DriveApp.getFolderById(FOLDER_ID);
  folder.createFile(imageBlob);
}
