# Step ③：PCへ印刷開始の合図を送る

## このStepで実現すること

Step ②では、LINEから送られた画像をGoogle Driveへ保存できるようになりました。

今回は、画像が保存されたことをPCへ知らせる機能を追加します。

GASからPCへ印刷開始の合図を送ることで、次のWindows印刷編で作成する自動印刷の仕組みにつなげます。

ここで使用するのが **ngrok** です。

ngrokは、インターネット側からPC上の受信プログラムへアクセスできる経路を作るサービスです。

## 関数の役割

| 関数 | 役割 |
| --- | --- |
| `doPost(e)` | LINEからの通知を受け取り、画像保存とPC通知を実行します。 |
| `saveImageToDrive(messageId)` | LINEから画像データを取得し、Google Driveへ保存します。 |
| `sendNotificationToPC()` | ngrokを経由して、PCへ印刷開始の合図を送ります。 |
| `createResponse(msg)` | LINEサーバーへHTTP応答を返します。 |

## 主要な処理の読み方

### ① Google Driveへの保存

Step ②までの処理はそのまま引き継ぎます。

LINEから画像が届くと、`saveImageToDrive(messageId)` が画像を取得してGoogle Driveへ保存します。

画像保存の処理が正常に終了すると、次の関数を実行します。

```javascript
sendNotificationToPC();
```

今回追加した部分です。

### ② PCへ合図を送る

`sendNotificationToPC()` は、PCへ通知するための関数です。

最初に、次の処理で2秒待機します。

```javascript
Utilities.sleep(2000);
```

続いて、GASのスクリプトプロパティからPC通知に必要な設定を取得します。

- `NGROK_URL`：PCへ通知を送るURL
- `PC_USER`：認証用ユーザー名
- `PC_PASS`：認証用パスワード

これらを使用して、ngrok経由でPC側の受信プログラムへアクセスします。

### ③ Basic認証

PC側の受信プログラムへアクセスするために、Basic認証を使用します。

次の処理で、ユーザー名とパスワードから認証ヘッダーに使用する文字列を作ります。

```javascript
Utilities.base64Encode(USER + ':' + PASS)
```

これをHTTPリクエストの `Authorization` ヘッダーに設定します。

### ④ HTTP POSTで通知する

実際にPCへ合図を送るのが、次の処理です。

```javascript
UrlFetchApp.fetch(NGROK_URL, options);
```

`NGROK_URL` で指定した宛先へHTTP POSTを送信します。

このとき、画像ファイルそのものを送るわけではありません。

送信しているのは、**「画像が届いたので、印刷処理を始めてください」という合図**です。

画像はすでにGoogle Driveへ保存されているので、PC側でその画像を取得して印刷します。

PCから返された応答は、GASのログで確認できます。

## 必要な設定

Step ②で登録した `LINE_ACCESS_TOKEN` と `FOLDER_ID` はそのまま使用します。

今回は次の3項目を追加します。

| 設定名 | 内容 |
| --- | --- |
| `NGROK_URL` | ngrokで発行されたPC通知先のURL |
| `PC_USER` | PC側のBasic認証ユーザー名 |
| `PC_PASS` | PC側のBasic認証パスワード |

これらの設定値は、Windows印刷編で整備する受信プログラムと一致させます。

## GASへの設定

1. GASのプロジェクトを開きます。
2. 左側の歯車マーク「プロジェクトの設定」を選択します。
3. 「スクリプト プロパティ」を開きます。
4. `NGROK_URL`、`PC_USER`、`PC_PASS` を追加します。
5. 設定値を入力して保存します。

既存の `LINE_ACCESS_TOKEN` と `FOLDER_ID` は削除せず、そのまま残します。

## コードの登録

1. [Step ③のCode.gs](Code.gs)を開きます。
2. コード全文をコピーします。
3. GASの `コード.gs` に貼り付け、Step ②のコード全体を置き換えます。
4. 保存ボタンを押します。

Step ③のコードには、Step ①・②の機能も含まれています。

## デプロイの更新

Step ②で使用したWebアプリを更新します。

1. GAS画面の「デプロイ」から「デプロイを管理」を選択します。
2. 使用中のWebアプリを選択します。
3. 編集アイコンを押します。
4. バージョンで「新バージョン」を選択します。
5. 「デプロイ」を押します。

同じデプロイを更新した場合、LINE DevelopersのWebhook URLを登録し直す必要はありません。

## 動作確認

PC側の受信プログラムを用意したら、次の手順で確認します。

1. ngrokとPC側の受信プログラムを起動します。
2. LINEのWebhookを有効にします。
3. LINE公式アカウントへテスト画像を1枚送信します。
4. Google Driveに画像が保存されたことを確認します。
5. GASの「実行数」から `doPost` の実行ログを確認します。
6. PCへの通知処理と、PCから返された応答を確認します。
7. PC側でも通知を受信したことを確認します。

画像保存とPCへの通知が確認できれば、Step ③のGAS側の作業は完了です。

## うまく動かない場合

Google Driveへの保存は成功するのに、PCへ通知が届かない場合は、次の項目を確認します。

- `NGROK_URL` が正しく登録されているか。
- ngrokが起動しているか。
- PC側の受信プログラムが起動しているか。
- `PC_USER` と `PC_PASS` がPC側の設定と一致しているか。
- コード変更後に新しいバージョンでデプロイしたか。
- GASの実行ログに通知時のエラーが表示されていないか。

## 次の作業：Windows印刷編

ここまでで、LINEから送られた画像をGoogle Driveへ保存し、PCへ印刷開始の合図を送れるようになりました。

ただし、GASから合図を送るだけでは、まだ紙は出てきません。

次はWindows側に、合図を受け取るプログラムを用意します。

さらにGoogle Driveから画像を取得し、プリンタで印刷する仕組みを作ります。

[Windows印刷編へ進む](../../windows-print/README.md)